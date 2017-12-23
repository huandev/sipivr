define(["knockout", "sound/plugin/fileModule", "editor/ToolbarItem"],
    function (ko, Module, ToolbarItem) {
        function NewToolbarItem(options){
            ToolbarItem.call(this, options);

            this.name = "ru.sipivr.sound.plugin.file";
            this.section = "ru.sipivr.sound";
            this.data = Module;
            this.icon = "icon-music";
        }

        NewToolbarItem.prototype = Object.create(ToolbarItem.prototype);

        return NewToolbarItem;
    });