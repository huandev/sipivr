define(["knockout", "editor/Module", "editor/ToolbarItem", "editor/ElementParameter", "messages"],
    function (ko, Module, ToolbarItem, ElementParameter, messages) {
        var key = "ru.sipivr.currency.plugin.currency";
        var currency = ko.utils.arrayMap(['RUB','USD','EUR','JPY','GBP','CHF','NOK','SEK','DKK','NZD','AUD','CAD'], function(item){
            return { value: item, text: messages[key + "." + item] };
        });

        function NewModule(designer, menu, options) {
            Module.call(this, designer, menu, options);

            this.name(key);

            this.parameters.push(new ElementParameter({ name: "value", value: 0 }));
            this.parameters.push(new ElementParameter({
                name: "currency",
                value: "RUB",
                options: currency,
                optionsValue: "value",
                optionsText: "text"
            }));

            this.icon("icon-sound");
        }

        NewModule.prototype = Object.create(Module.prototype);

        function NewToolbarItem(options){
            ToolbarItem.call(this, options);

            this.name = key;
            this.section = "ru.sipivr.currency";
            this.data = NewModule;
            this.icon = "icon-sound";
        }

        NewToolbarItem.prototype = Object.create(ToolbarItem.prototype);

        return NewToolbarItem;
    });