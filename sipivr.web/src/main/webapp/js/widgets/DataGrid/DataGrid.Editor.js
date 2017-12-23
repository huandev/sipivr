define(["knockout", "knockout.mapping", "DataGrid"], function (ko, mapping, DataGrid) {
    function DataGridEditor(dataGrid, options) {
        this.dataGrid = dataGrid;
        this.options = options;
        this.edited = ko.observable();
        this.editedTemp = ko.observable();

        this.init();
    }

    DataGridEditor.prototype.init = function () {
    }

    DataGridEditor.prototype.mapFromJs = function(js) {
        return mapping.fromJS(js);
    }

    DataGridEditor.prototype.add = function () {
        this.cancel();

        var model = {};
        for (var i = 0; i < this.dataGrid.columns.length; i++) {
            var c = this.dataGrid.columns[i];

            if(c.editable !== false) {
                model[c.key] = c.defaultValue === undefined ? null : c.defaultValue;
            }
        }
        this.editedTemp(this.mapFromJs(model));
    }

    DataGridEditor.prototype.edit = function (item) {
        this.cancel();

        this.editedTemp(this.mapFromJs(item));
        this.edited(item);
    }

    DataGridEditor.prototype.cancel = function () {
        this.edited(null);
        this.editedTemp(null);
    }

    DataGridEditor.prototype.save = function () {
        var self = this;

        var js = mapping.toJS(this.editedTemp());

        function postSave(data) {
            if (self.edited()) {
                self.dataGrid.Items.replace(self.edited(), data || js);
            }
            else {
                self.dataGrid.Items.push(data || js);
            }
            self.cancel();
        }

        this.options.save ? this.options.save(js, postSave) : postSave();
    }

    DataGridEditor.prototype.remove = function (item) {
        if (confirm("Вы действительно хотите удалить элемент?")) {
            var self = this;

            function postRemove() {
                if (self.edited() == item) {
                    self.cancel();
                }

                self.dataGrid.Items.remove(item);
            }

            this.options.remove ? this.options.remove(item, postRemove) : postRemove();
        }
    }

    var init = DataGrid.prototype.init;

    DataGrid.baseColumn.editorTemplate = 'datagrid-editor-template';

    DataGrid.prototype.init = function () {
        init.call(this);

        for (i = 0; i < this.columns.length; i++) {
            var c = this.columns[i];
            
            if (!c.editorTemplate) {
                c.editorTemplate = c.cellTemplate;
            }
        }

        this.editor = new DataGridEditor(this, this.options.editor || {});
    }

    return DataGridEditor;
});