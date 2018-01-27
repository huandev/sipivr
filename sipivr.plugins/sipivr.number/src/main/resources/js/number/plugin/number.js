define(["editor/Module", "editor/ElementParameter", "editor/ToolbarItem", "messages"],
    function (Module, ElementParameter, ToolbarItem, messages) {
        var key = "ru.sipivr.number.plugin.number";

        function NewModule(designer, menu, options) {
            Module.call(this, designer, menu, options);

            this.name(key);

            this.parameters.push(new ElementParameter({ name: "Value", value: 0 }));

            this.icon("icon-sound");
        }

        NewModule.prototype = Object.create(Module.prototype);

        function NewToolbarItem(options) {
            ToolbarItem.call(this, options);

            this.name = key;
            this.section = "ru.sipivr.number";
            this.data = NewModule;

            this.icon = "icon-sound";
        }

        NewToolbarItem.prototype = Object.create(ToolbarItem.prototype);

        return NewToolbarItem;
    });