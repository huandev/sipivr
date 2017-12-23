define(["sound/plugin/fileModule", "editor/ToolbarItem", "widgets/sipclient"],
    function (Module, ToolbarItem, sipclient) {
        function NewModule(designer, menu, options) {
            Module.call(this, designer, menu, options);

            this.name("ru.sipivr.sound.plugin.file");

            if(!menu) {
                var self = this;

                var subscription = this.menu.subscribe(function (newValue) {
                    subscription.dispose();

                    $.post(contextPath + "record/quick", null, function(sound){
                        self.sounds.push(sound);
                        self.soundId(sound.id);
                        self.record();
                    });
                });
            }
        }

        NewModule.prototype = Object.create(Module.prototype);

        function NewToolbarItem(options){
            ToolbarItem.call(this, options);

            this.name = "ru.sipivr.sound.plugin.quickrecord";
            this.section = "ru.sipivr.sound";
            this.data = NewModule;
            this.icon = "icon-mic";

            this.enable = sipclient.connected;
        }

        NewToolbarItem.prototype = Object.create(ToolbarItem.prototype);

        return NewToolbarItem;
    });