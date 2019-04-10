define(["knockout", "editor/Module", "editor/ElementParameter", "editor/ToolbarItem", "messages"],
    function (ko, Module, ElementParameter, ToolbarItem, messages) {
        var key = "ru.sipivr.speech.plugin.yandextts";

        function NewModule(designer, menu) {
            Module.call(this, designer, menu);

            this.name(key);
            /*
             text=<текст>
             format=<mp3|wav|opus>
             [quality=<hi|lo>]
             lang=<ru-RU|en-US|uk-UK|tr-TR>
             speaker=<jane|oksana|alyss|omazh|zahar|ermil>
             [speed=<скорость речи>]
             [emotion=<good|neutral|evil>]
             */
            var textParameter = new ElementParameter({ name: "text", value: "" });
            this.parameters.push(textParameter);
            this.parameters.push(new ElementParameter({
                name: "speaker",
                value: "jane",
                options: ["jane", "oksana", "alyss", "omazh", "zahar", "ermil"]
            }));
            this.parameters.push(new ElementParameter({
                name: "lang",
                value: "ru-RU",
                options: ["ru-RU", "en-US", "uk-UK", "tr-TR"]
            }));
            this.parameters.push(new ElementParameter({
                name: "format",
                value: "wav",
                options: ["wav", "mp3", "opus"]
            }));
            this.parameters.push(new ElementParameter({
                name: "quality",
                value: "hi",
                options: ["hi", "lo"]
            }));
            var speed = [];
            for(var i = 1; i <= 30; i+=1){
                speed.push((i / 10).toFixed(1));
            }
            this.parameters.push(new ElementParameter({
                name: "speed",
                value: "1.0",
                options: speed
            }));
            this.parameters.push(new ElementParameter({
                name: "emotion",
                value: "good",
                options: ["good", "neutral", "evil"]
            }));
            this.icon("icon-sound");

            this.text = ko.computed(function () {
                return "Y: " + textParameter.text();
            }, this);
        }

        NewModule.prototype = Object.create(Module.prototype);

        function NewToolbarItem(options){
            ToolbarItem.call(this, options);

            this.name = key;
            this.section = "ru.sipivr.speech";
            this.icon = "icon-sound";
            this.data = NewModule;
        }

        NewToolbarItem.prototype = Object.create(ToolbarItem.prototype);

        return NewToolbarItem;
    });