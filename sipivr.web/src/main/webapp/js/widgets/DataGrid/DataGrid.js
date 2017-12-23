/**
 * @constructor
 * @param {Object[]} modelArray Array of plain JavaScript objects
 * @param {Object} options Settings object
 * @param {String} options.modelKey Name of model's key property
 * @param {Function} options.viewModelConstructor Constructor that creates VeiwModel from Model
 * @param {Number} options.itemsPerPage Count of items per page
 * @param {Object[]} options.filters Array of filter objects
 * @param {String} options.filters[].key Name of filtered ViewModel's field
 * @param {Function} options.filters[].observable Observable that represents user input for filtering
 * @param {String|Function} options.filters[].method Method to match ViewModel's value and user input 
 * ("contains", or "equals", or custom function)
 * @example
 *     new DataGrid([
 *             {
 *                 key: "ID",
 *                 filter: {
 *                     method: "contains" 
 *                 }
 *             },
 *             {
 *                 key: "Name"
 *             }
 *         ], {
 *         modelKey: "ID",
 *         viewModelConstructor: function(model) {
 *             ko.mapping.fromJS(model, {}, this);
 *         },
 *         itemsPerPage: 5,
 *         filters: [
 *             { 
 *                 key: "ID", observable: ko.observable(undefined),
 *                 method: function(value, filterValue) { return value < filterValue; } 
 *             },
 *             { key: "Name", observable: ko.observable(null), method: "contains" },
 *             { key: "Active", observable: ko.observable(undefined), method: "equals" }
 *         ]
 *     }, [{ ID: 1, Name: "Test", Active: false }]);
 */

define(["knockout", "knockout.mapping"], function (ko, mapping) {
    if (!ko.mapping) {
        ko.mapping = mapping;
    }

    function DataGrid(columns, options) {
        this.columns = columns;
        this.options = options;

        for (i = 0; i < this.columns.length; i++) {
            var c = this.columns[i];
            for (var key in DataGrid.baseColumn) {
                if (c[key] === undefined)
                    c[key] = DataGrid.baseColumn[key];
            }

            if (c.title === undefined)
                c.title = c.key;

            if (c.filter) {
                for (var key in DataGrid.baseFilter) {
                    if (c.filter[key] === undefined)
                        c.filter[key] = DataGrid.baseFilter[key];
                }
            }
        }

        this.ViewModelConstructor = options.viewModelConstructor || function (model) {
            ko.mapping.fromJS(model, {}, this);
        };

        // notify subscribers in async manner after all changes with Items have been performed
        this.Items = ko.observableArray().extend({
            rateLimit: { timeout: 0, method: "notifyWhenChangesStop" }
        });

        // ordering
        this._OrderingKey = ko.observable(null);
        this._OrderByDesc = ko.observable(false);

        // filtering
        // notify subscribers in async manner after all changes with Filters have been performed
        this._PreparedFilters = ko.computed(this._prepareFilters, this).extend({
            rateLimit: { timeout: 0, method: "notifyWhenChangesStop" }
        });

        this.FilteredItems = ko.computed(this._applyFilters, this);

        this.init();
    }

    DataGrid.prototype.init = function () {
    }

    DataGrid.baseColumn = {
        titleTemplate: "datagrid-title-template",
        cellTemplate: "datagrid-cell-template",
        width: "auto"
    };

    DataGrid.baseFilter = {
        method: "contains",
        observable: ko.observable(),
        template: "datagrid-filter-template"
    };

    DataGrid.prototype.hasFilters = function () {
        return ko.utils.arrayFirst(this.columns, function (c) { return c.filter != undefined; }) != null;
    }

    DataGrid.prototype.getModelKey = function (viewModel) {
        return ko.utils.unwrapObservable(viewModel[this.options.modelKey]);
    };

    DataGrid.prototype._get = function (key) {
        var getModelKey = this.getModelKey;
        return ko.utils.arrayFirst(this.Items(), function (item) {
            return getModelKey(item) == key;
        });
    };

    /**
     * Get Model by key
     * @param {Any} key Value of model's key field
     * @returns {Object} Model
     */
    DataGrid.prototype.get = function (key) {
        var viewModel = this._get(key);
        return viewModel ? ko.mapping.toJS(viewModel) : null;
    };

    DataGrid.prototype.getValue = function (data, key) {
        var parts = key.split(".");
        var value = data;
        for(var i = 0; i < parts.length; i++) {
            value = value[parts[i]];
        }
        return value;
    };

    DataGrid.prototype._findWhere = function (condition) {
        var items = this.Items(), result = [];

        for (var i = 0, iLen = items.length; i < iLen; ++i) {
            var viewModel = items[i];
            if (condition(viewModel)) {
                result.push(viewModel);
            }
        }
        return result;
    };

    /**
     * Get array of models that satisfy the condition
     * @param {Function} condition Function that accepts Model (or ViewModel) and returns bool value
     * @param {Boolean} onViewModel Flag that determines if condition accepts ViewModel
     */
    DataGrid.prototype.findWhere = function (condition, onViewModel) {
        var items = this.Items(), result = [];

        for (var i = 0, iLen = items.length; i < iLen; ++i) {
            var model = onViewModel ? items[i] : ko.mapping.toJS(items[i]);

            if (condition(model)) {
                result.push(onViewModel ? ko.mapping.toJS(model) : model);
            }
        }
        return result;
    };

    /**
     * Remove model by key
     * @param {Any} key Value of model's key field
     */
    DataGrid.prototype.remove = function (key) {
        var item = this._get(key);
        if (item) {
            this.Items.remove(item);
        }
    };

    /**
     * Remove models that satisfy the condition
     * @param {Function} condition Function that accepts Model and returns bool value
     * @param {Boolean} onViewModel Flag that determines if condition accepts ViewModel
     */
    DataGrid.prototype.removeWhere = function (condition, onViewModel) {

        this.Items(ko.utils.arrayFilter(this.Items(), function (model) {
            if (!onViewModel) {
                model = ko.mapping.toJS(model);
            }
            return !condition(model);
        }));
    };

    /**
     * Insert or update model (if model with same key already exists)
     * with keeping order of items if grid is ordered
     * @param {Object} model Plain JavaScript Model object
     */
    DataGrid.prototype.save = function (model) {
        var oldItem = this._get(this.getModelKey(model)),
                newItem = new this.ViewModelConstructor(model),
                orderingKey = this._OrderingKey(),
                newValue = ko.utils.unwrapObservable(newItem[orderingKey]);

        if (orderingKey && newValue != null) {
            if (oldItem) {
                this.Items.remove(oldItem);
            }
            var index = sortedIndex(this.Items(), orderingKey, newValue,
                    this._OrderByDesc(), ko.utils.unwrapObservable);
            // such insert keeps ordering
            this.Items.splice(index, 0, newItem);
        } else {
            if (oldItem) {
                this.Items.replace(oldItem, newItem);
            } else {
                this.Items.push(newItem);
            }
        }
    };

    /**
     * Append array of items to the end of the grid
     * @param {Object[]} modelArray Array of plain JavaScript Model objects
     */
    DataGrid.prototype.load = function (modelArray) {
        this.Items.push.apply(this.Items, modelArray);
        this._resetOrdering();
    };

    /**
     * Remove all items from grid and append an array of new items
     * @param {Object[]} modelArray Array of plain JavaScript Model objects
     */
    DataGrid.prototype.reload = function (modelArray) {
        this.Items(modelArray);
        this._resetOrdering();
    };

    DataGrid.prototype._resetOrdering = function () {
        var orderingKey = this._OrderingKey(),
                orderByDesc = this._OrderByDesc();
        // reset ordering
        if (orderingKey) {
            this._OrderingKey(null);
            this.orderBy(orderingKey);
            if (orderByDesc) {
                this.Items.reverse();
            }
        }
    };

    /**
     * Sort grid items by values of model's field with given key. When called
     * twise in a row with the same key — it reverses an array of items
     * @param {String} orderingKey Name of model's field for sorting
     */
    DataGrid.prototype.orderBy = function (orderingKey) {
        if (this._OrderingKey() == orderingKey) {
            this._OrderByDesc(!this._OrderByDesc());
            // reverse an array instead of sorting
            this.Items.reverse();
        } else {
            this._OrderingKey(orderingKey);
            this._OrderByDesc(false);

            this.Items.sort(function (l, r) {
                var lval = ko.utils.unwrapObservable(l[orderingKey]),
                        rval = ko.utils.unwrapObservable(r[orderingKey]);
                // TODO: should strings sorting be case-insensitive ?
                return lval == rval ? 0 : (lval < rval || rval == null ? -1 : 1);
            });
        }
    };

    /**
     * Check if grid is ordered by given key and ordering has given direction
     * @param {String} orderingKey Name of model's field for sorting
     * @param {Boolean} orderByDesc Flag for descendant ordering direction
     * @returns {Boolean}
     */
    DataGrid.prototype.isOrdered = function (orderingKey, orderByDesc) {
        return this._OrderingKey() == orderingKey && this._OrderByDesc() == orderByDesc;
    };

    /**
     * Clear all filters in grid
     */
    DataGrid.prototype.clearFilters = function () {
        ko.utils.arrayForEach(this.columns, function (column) {
            if (column.filter) {
                column.filter.observable(undefined);
            }
        });
    };

    DataGrid.prototype._prepareFilters = function () {
        var filters = [];
        // exclude empty filters and prepare user input
        for (var i = 0, fLen = this.columns.length; i < fLen; ++i) {
            var column = this.columns[i];
            if (column.filter) {
                var filter = column.filter,
                    method = filter.method,
                    value = filter.observable();

                // split non-empty user input to separate words
                if (method === "contains" && typeof value === "string" && value) {
                    var words = value.toLowerCase().match(/\S+/g);
                    if (words) {
                        filters.push({
                            key: column.key, value: words, method: method
                        });
                    }
                } else if (method === "equals" && value !== undefined) {
                    // ignore empty strings but include null values
                    if (value || typeof value !== "string") {
                        filters.push({
                            key: column.key, value: value, method: method
                        });
                    }
                } else if (typeof method === "function" && value !== undefined) {
                    filters.push({
                        key: column.key, value: value, method: method
                    });
                }
            }
        }
        return filters;
    };

    DataGrid.prototype._applyFilters = function () {
        var filters = this._PreparedFilters();
        // apply filters
        return ko.utils.arrayFilter(this.Items(), function (viewModel) {
            for (var f = 0, fLen = filters.length; f < fLen; ++f) {
                var filter = filters[f], method = filter.method,
                        value = ko.utils.unwrapObservable(viewModel[filter.key]);
                // switch matching behaviour
                if (method === "contains") {
                    if (typeof value === "string") {
                        value = value.toLowerCase();
                    } else if (typeof value !== "number") {
                        return false;  // exclude from filter Objects, Functions, etc.
                    }
                    // field must contain all of words
                    var words = filter.value;
                    for (var i = 0, wLen = words.length; i < wLen; ++i) {
                        if (value.indexOf(words[i]) === -1) {
                            return false;
                        }
                    }
                } else if (method === "equals") {
                    if (value != filter.value) {
                        return false;
                    }
                } else if (typeof method === "function") {
                    if (!method(value, filter.value)) {
                        return false;
                    }
                }
            }
            return true;
        });
    };


    /**
     * Get index that represents a place for object, where it can be inserted
     * with keeping order in the array
     * @param {Object[]} array Sorted array
     * @param {String} key Name of object's field, by which an array is sorted
     * @param {Any} value Searched value of object's field, by which an array is sorted
     * @param {Boolean} desc Flag for descendant sorting
     * @param {Function} [getVlaue] Function for getting value from object's field
     */
    function sortedIndex(array, key, value, desc, getValue) {
        if (!getValue) {
            getValue = function (x) {
                return x;
            };
        }

        var low = 0, high = array.length, mid;

        if (desc) {
            while (low < high) {
                mid = (low + high) >>> 1;
                if (getValue(array[mid][key]) > value) {
                    low = mid + 1;
                } else {
                    high = mid;
                }
            }
        } else {
            while (low < high) {
                mid = (low + high) >>> 1;
                if (getValue(array[mid][key]) < value) {
                    low = mid + 1;
                } else {
                    high = mid;
                }
            }
        }
        return low;
    }

    return DataGrid;
});