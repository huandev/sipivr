define(["editor/Module", "editor/ElementParameter", "editor/ToolbarItem", "messages"],
    function (Module, ElementParameter, ToolbarItem, messages) {
        var key = "ru.sipivr.system.plugin.bridge";

        function NewModule(designer, menu) {
            Module.call(this, designer, menu);

            this.name(key);
            this.parameters.push(new ElementParameter({ name: "address", value: "", title: messages[key + ".address"] }));
        }

        NewModule.prototype = Object.create(Module.prototype);

        function NewToolbarItem(options){
            ToolbarItem.call(this, options);

            this.name = key;
            this.section = "ru.sipivr.system";
            this.data = NewModule;
        }

        NewToolbarItem.prototype = Object.create(ToolbarItem.prototype);

        return NewToolbarItem;
    });