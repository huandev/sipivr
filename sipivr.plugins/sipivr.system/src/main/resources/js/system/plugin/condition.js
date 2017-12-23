define(["editor/Module", "editor/ElementParameter", "editor/ToolbarItem", "editor/points/OutputPoint", "messages"],
    function (Module, ElementParameter, ToolbarItem, OutputPoint, messages) {
        var key = "ru.sipivr.system.plugin.condition";

        function NewModule(designer, menu) {
            Module.call(this, designer, menu);

            this.name(key);
            this.parameters.push(new ElementParameter({ name: "dtmf", value: "", title: messages[key + ".dtmf"] }));
            this.outputPoints.push(new OutputPoint(this));

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