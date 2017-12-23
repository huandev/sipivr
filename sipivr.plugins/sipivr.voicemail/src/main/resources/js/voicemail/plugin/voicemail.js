define(["editor/Module", "editor/ElementParameter", "editor/ToolbarItem", "messages"],
    function (Module, ElementParameter, ToolbarItem, messages) {
        var key = "ru.sipivr.voicemail.plugin.voicemail";

        function NewModule(designer, menu) {
            Module.call(this, designer, menu);

            this.name(key);
            this.parameters.push(new ElementParameter({ name: "timeout", value: 10, title: messages[key + ".timeout"] }));

            this.icon("icon-mail-alt");
        }

        NewModule.prototype = Object.create(Module.prototype);

        function NewToolbarItem(options){
            ToolbarItem.call(this, options);

            this.name = key;
            this.section = "ru.sipivr.system";
            this.icon = "icon-mail-alt";
            this.data = NewModule;
        }

        NewToolbarItem.prototype = Object.create(ToolbarItem.prototype);

        return NewToolbarItem;
    });