define(["knockout", "knockout.mapping", "DataGrid"], function (ko, mapping, DataGrid) {
    function DataGridPager(dataGrid, options) {
        this.dataGrid = dataGrid;
        this.options = options;

        // paging
        this.CurrentPage = ko.observable(0);

        this.ItemsPerPage = ko.observable(options.itemsPerPage || 10);
        this.ItemsPerPage.subscribe(this._resetCurrentPage, this);

        this.PagesCount = ko.computed(this._getPagesCount, this);
        this.StartIndex = ko.computed(this._getStartIndex, this);

        // recompute PageItems in async manner because it subscribed to CurrentPage, PagesCount 
        // and FilteredItems, but CurrentPage already subscribed to PagesCount and PreparedFilters
        this.PageItems = ko.computed(this._getPageItems, this).extend({
            rateLimit: { timeout: 0, method: "notifyWhenChangesStop" }
        });

        this.PagesCount.subscribe(this._resetLastPage, this);

        this.dataGrid._PreparedFilters.subscribe(this._resetCurrentPage, this, "beforeChange");
    }

    
    var init = DataGrid.prototype.init;

    DataGrid.prototype.init = function () {
        init.call(this);

        this.pager = new DataGridPager(this, this.options.pager || {});
    }

    /**
     * Safely set current page of grid
     * @param {Number} newValue Current page number (starts from 0)
     */
    DataGridPager.prototype.setCurrentPage = function (newValue) {
        var currentValue = this.CurrentPage(),
                pagesCount = this.PagesCount(),
                valueToWrite = parseInt(newValue);

        valueToWrite = Math.max(0, Math.min(pagesCount - 1, valueToWrite));
        if (valueToWrite !== currentValue) {
            this.CurrentPage(valueToWrite);
        }
    };

    DataGridPager.prototype._resetCurrentPage = function () {
        if (this.CurrentPage() != 0) {
            this.CurrentPage(0);
        } else {
            this.CurrentPage.notifySubscribers(0);
        }
    };

    DataGridPager.prototype._resetLastPage = function () {
        var currentPage = this.CurrentPage(),
                pagesCount = this.PagesCount();

        if (pagesCount == currentPage) {
            this.CurrentPage(Math.max(0, pagesCount - 1));
        }
    };

    /**
     * Set start page as current page number
     */
    DataGridPager.prototype.goToStartPage = function () {
        this.CurrentPage(0);
    };

    /**
     * Set end page as current page number
     */
    DataGridPager.prototype.goToEndPage = function () {
        this.CurrentPage(this.PagesCount() - 1);
    };

    /**
     * Safely decrement current page number
     */
    DataGridPager.prototype.goToLastPage = function () {
        this.setCurrentPage(this.CurrentPage() - 1);
    };

    /**
     * Safely increment current page number
     */
    DataGridPager.prototype.goToNextPage = function () {
        this.setCurrentPage(this.CurrentPage() + 1);
    };

    DataGridPager.prototype._getPagesCount = function () {
        return Math.ceil(this.dataGrid.FilteredItems().length / this.ItemsPerPage());
    };

    DataGridPager.prototype._getStartIndex = function () {
        return this.CurrentPage() * this.ItemsPerPage();
    };

    DataGridPager.prototype._getPageItems = function () {
        var itemsPerPage = this.ItemsPerPage(),
                filteredItems = this.dataGrid.FilteredItems(),
                start = this.StartIndex(),
                end = Math.min(start + itemsPerPage, filteredItems.length);

        return filteredItems.slice(start, end);
    };

    return DataGridPager;
});