define(["knockout", "editor/Module", "editor/ElementParameter", "editor/ToolbarItem", "messages"],
    function (ko, Module, ElementParameter, ToolbarItem, messages) {
        var key = "ru.sipivr.script.plugin.script";

        var scripts = ko.observableArray();
        $.post(contextPath + "api/scripts", function(data){
            scripts(data);
        });

        function NewModule(designer, menu) {
            Module.call(this, designer, menu);

            this.name(key);

            var parameter = new ElementParameter({ name: "file", value: "", title: messages[key + ".file"] });
            parameter.options = scripts;
            this.parameters.push(parameter);
            this.parameters.push(new ElementParameter({ name: "arguments", value: "", title: messages[key + ".arguments"] }));

            this.icon("icon-tag");
        }

        NewModule.prototype = Object.create(Module.prototype);

        function NewToolbarItem(options){
            ToolbarItem.call(this, options);

            this.name = key;
            this.section = "ru.sipivr.system";
            this.icon = "icon-tag";
            this.data = NewModule;
        }

        NewToolbarItem.prototype = Object.create(ToolbarItem.prototype);

        return NewToolbarItem;
    });