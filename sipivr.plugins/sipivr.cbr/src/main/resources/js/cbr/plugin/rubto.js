define(["knockout", "editor/Module", "editor/ElementParameter", "editor/ToolbarItem", "messages", "app/ko.binding.enums"],
    function (ko, Module, ElementParameter, ToolbarItem, messages) {
        var key = "ru.sipivr.cbr.plugin.rubto";

        function NewModule(designer, menu, options) {
            Module.call(this, designer, menu, options);

            this.name(key);

            var enums = {
                USD: "USD",
                EUR: "EUR",
                GBP: "GBP",
                CHF: "CHF",
                JPY: "JPY"
            };

            var defaultValue = "";
            for(var k in enums) {
                if (defaultValue) {
                    defaultValue += ",";
                }
                defaultValue += k;
            }

            this.parameters.push(new ElementParameter({ name: "to", value: defaultValue, enums: enums }));

            this.text = ko.computed(function () {
                return ko.bindingHandlers.enums.toStringValue(this.parameters()[0].value(), enums);
            }, this);

            this.icon("icon-sound");
        }

        NewModule.prototype = Object.create(Module.prototype);

        function NewToolbarItem(options){
            ToolbarItem.call(this, options);

            this.name = key;

            this.section = "ru.sipivr.speech";
            this.data = NewModule;

            this.icon = "icon-sound";
        }

        NewToolbarItem.prototype = Object.create(ToolbarItem.prototype);

        return NewToolbarItem;
    });