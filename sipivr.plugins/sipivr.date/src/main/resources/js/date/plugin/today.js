define(["editor/Module", "editor/ElementParameter", "editor/ToolbarItem"],
    function (Module, ElementParameter, ToolbarItem) {
        var key = "ru.sipivr.date.plugin.today";

        function NewModule(designer, menu, options) {
            Module.call(this, designer, menu, options);

            this.name(key);

            this.icon("icon-calendar");
        }

        NewModule.prototype = Object.create(Module.prototype);

        function NewToolbarItem(options) {
            ToolbarItem.call(this, options);

            this.name = key;
            this.section = "ru.sipivr.date";
            this.data = NewModule;
            this.icon = "icon-calendar";
        }

        NewToolbarItem.prototype = Object.create(ToolbarItem.prototype);

        return NewToolbarItem;
    });