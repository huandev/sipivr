define(["editor/Module", "editor/ToolbarItem"],
    function (Module, ToolbarItem) {
        var key = "ru.sipivr.system.plugin.inputOn";

        function NewModule(designer, menu) {
            Module.call(this, designer, menu);

            this.name(key);
            this.icon("icon-th");
        }

        NewModule.prototype = Object.create(Module.prototype);

        function NewToolbarItem(options){
            ToolbarItem.call(this, options);

            this.name = key;
            this.section = "ru.sipivr.system";
            this.icon = "icon-th";
            this.data = NewModule;
        }

        NewToolbarItem.prototype = Object.create(ToolbarItem.prototype);

        return NewToolbarItem;
    });