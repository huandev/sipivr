define(["knockout", "knockout.mapping", "DataGrid.Editor", "knockout.binding.validate"], function (ko, mapping, DataGridEditor) {
    var init = DataGridEditor.prototype.init;
    var save = DataGridEditor.prototype.save;

    DataGridEditor.prototype.init = function () {
        init.call(this);

        this.editedTemp = ko.validateObservable();
    }

    DataGridEditor.prototype.save = function () {
        if (this.editedTemp.getErrors().length) {
            return;
        }

        save.call(this);
    }
});