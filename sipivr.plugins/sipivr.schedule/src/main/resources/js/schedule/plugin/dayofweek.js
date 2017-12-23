define(["knockout", "schedule/plugin/basemodule", "editor/ElementParameter", "editor/ToolbarItem", "messages", "app/ko.binding.enums"],
    function (ko, Module, ElementParameter, ToolbarItem, messages) {
        var key = "ru.sipivr.schedule.plugin.dayofweek";

        function NewModule(designer, menu, options) {
            Module.call(this, designer, menu, options);

            this.name(key);

            var enums = {};
            for(var i = 1; i <= 7; i++ ){
                enums[i] = messages["ru.sipivr.schedule.plugin.dayofweek." + i];
            }
            this.parameters.push(new ElementParameter({ name: "day", value: "1,2,3,4,5,6,7", enums: enums }));

            this.text = ko.computed(function () {
                return ko.bindingHandlers.enums.toStringValue(this.parameters()[0].value(), enums);
            }, this);

            this.icon("icon-calendar");
        }

        NewModule.prototype = Object.create(Module.prototype);

        function NewToolbarItem(options){
            ToolbarItem.call(this, options);

            this.name = key;
            this.section = "ru.sipivr.schedule";
            this.data = NewModule;

            this.icon = "icon-calendar";
        }

        NewToolbarItem.prototype = Object.create(ToolbarItem.prototype);

        return NewToolbarItem;
    });