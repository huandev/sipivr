define(["editor/Module", "editor/ToolbarItem", "editor/points/OutputPoint"],
    function (Module, ToolbarItem, OutputPoint) {
        var key = "ru.sipivr.system.plugin.noMatch";

        function NewModule(designer, menu) {
            Module.call(this, designer, menu);

            this.name(key);
            this.outputPoints.push(new OutputPoint(this));
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