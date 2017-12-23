define(["editor/Module", "editor/ElementParameter", "editor/ToolbarItem", "messages"],
    function (Module, ElementParameter, ToolbarItem, messages) {
        var key = "ru.sipivr.speech.plugin.date";

        function NewModule(designer, menu, options) {
            Module.call(this, designer, menu, options);

            this.name(key);

            this.parameters.push(new ElementParameter({ name: "date", date: "yyyy-MM-dd" }));
            this.icon("icon-calendar");
        }

        NewModule.prototype = Object.create(Module.prototype);

        function NewToolbarItem(options) {
            ToolbarItem.call(this, options);

            this.name = key;
            this.section = "ru.sipivr.speech";
            this.data = NewModule;
            this.icon = "icon-calendar";
        }

        NewToolbarItem.prototype = Object.create(ToolbarItem.prototype);

        return NewToolbarItem;
    });