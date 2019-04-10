define(["knockout", "editor/Module", "editor/ElementParameter", "editor/ToolbarItem", "messages", "editor/points/OutputPoint"],
    function (ko, Module, ElementParameter, ToolbarItem, messages, OutputPoint) {
        var key = "ru.sipivr.system.plugin.ifVariable";

        function NewModule(designer, menu) {
            Module.call(this, designer, menu);

            this.name(key);

            var parameter = new ElementParameter({ name: "method", value: "Equal", title: messages[key + ".method"] });
            parameter.options = [
                { Value: "Equal", Text: "=" },
                { Value: "NotEqual", Text: "!=" },
                { Value: "LessThan", Text: "<" },
                { Value: "LessThanOrEqual", Text: "<=" },
                { Value: "GreaterThan", Text: ">" },
                { Value: "GreaterThanOrEqual", Text: ">=" },
                { Value: "Match", Text: "[.]" },
                { Value: "NotMatch", Text: "[^]" }
            ];
            parameter.optionsValue = "Value";
            parameter.optionsText = "Text";


            this.parameters.push(new ElementParameter({ name: "name", title: messages[key + ".name"] }));
            this.parameters.push(parameter);
            this.parameters.push(new ElementParameter({ name: "value", title: messages[key + ".value"] }));

            this.outputPoints.push(new OutputPoint(this));

            this.text = ko.computed(function () {
                return ko.utils.arrayMap(this.parameters(), function (p) {
                    if(p === parameter) {
                        return parameter.options.find(function(option) { return option.Value === p.value(); }).Text;
                    }
                    return p.text();
                }).join(" ");
            }, this);
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