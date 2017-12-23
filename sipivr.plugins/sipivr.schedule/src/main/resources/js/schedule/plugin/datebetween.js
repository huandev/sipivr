define(["knockout", "schedule/plugin/basemodule", "editor/ElementParameter", "editor/ToolbarItem", "messages"],
    function (ko, Module, ElementParameter, ToolbarItem, messages) {
        var key = "ru.sipivr.schedule.plugin.datebetween";

        function NewModule(designer, menu, options) {
            Module.call(this, designer, menu, options);

            this.name(key);

            this.parameters.push(new ElementParameter({ name: "from", date: "yyyy-MM-dd", title: messages["ru.sipivr.schedule.from"] }));
            this.parameters.push(new ElementParameter({ name: "to", date: "yyyy-MM-dd", title: messages["ru.sipivr.schedule.to"] }));

            this.text = ko.computed(function () {
                return ko.utils.arrayMap(this.parameters(), function (p) {
                        return p.text();
                    }).join(" ");
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