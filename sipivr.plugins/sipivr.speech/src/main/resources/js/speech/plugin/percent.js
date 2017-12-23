define(["editor/Module", "editor/ElementParameter", "editor/ToolbarItem", "messages"],
    function (Module, ElementParameter, ToolbarItem, messages) {
        var key = "ru.sipivr.speech.plugin.percent";

        function NewModule(designer, menu, options) {
            Module.call(this, designer, menu, options);

            this.name(key);

            this.parameters.push(new ElementParameter({ name: "value", value: 0 }));

            this.icon("icon-sound");
        }

        NewModule.prototype = Object.create(Module.prototype);

        function NewToolbarItem(options) {
            ToolbarItem.call(this, options);

            this.name = key;
            this.section = "ru.sipivr.speech";
            this.data = NewModule;

            this.icon = "icon-sound";
        }

        NewToolbarItem.prototype = Object.create(ToolbarItem.prototype);

        return NewToolbarItem;
    });