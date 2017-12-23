define(["knockout", "editor/Module", "editor/ElementParameter", "widgets/sipclient", "messages", "widgets/MediaPlayerView", "sound/SoundView"],
    function (ko, Module, ElementParameter, sipclient, messages, MediaPlayer, SoundView) {
        ko.components.register('sound-file-parameter', {
            template: { require: 'text!sound/plugin/fileParameter.html' }
        });

        var key = "ru.sipivr.sound.plugin.file";

        var sounds = ko.observableArray();
        $.post(contextPath + "sound/list", function(data){
            sounds(data);
        });

        function NewModule(designer, menu, options) {
            Module.call(this, designer, menu, options);

            this.name(key);

            this.sounds = sounds;

            var parameter = new ElementParameter({ name: "name", value: null, title: messages[key + ".name"], component: 'sound-file-parameter' });
            parameter.options = sounds;
            parameter.optionsValue = "id";
            parameter.optionsText = function(item) { return item.description || item.name; };
            parameter.optionsCaption = " ";
            parameter.style = { "max-width": "240px" };
            parameter.text = ko.computed(function () {
                var sound = ko.utils.arrayFirst(sounds(), function(s){
                   return s.id == parameter.value();
                });
                return sound ? (sound.name || sound.description) : "";
            }, parameter);

            parameter.select = function(){
                SoundView.select = function(data) {
                    if(sounds.indexOf(data) < 0){
                        sounds.push(data);
                    }
                    parameter.value(data.id);
                }
                SoundView.selectMode(true);
            }

            this.parameters.push(parameter);

            this.soundId = parameter.value;

            this.text = parameter.text;

            this.mediaPlayer = MediaPlayer;
            this.template = 'svg-sound-file-menu-item';
        }

        NewModule.prototype = Object.create(Module.prototype);

        NewModule.prototype.record = function() {
            var self = this;


            var call = sipclient.makeCall("record", {
                ended: function () {
                    if(call.id) {
                        $.post(contextPath + "record/refresh", { soundId: self.soundId(), uuid: call.id });
                    }
                }
            });
        }

        NewModule.prototype.getSrc = function(){
            return contextPath + "sound/play/" + this.soundId();
        }

        NewModule.prototype.play = function(){
            if(this.soundId()) {
                this.mediaPlayer.title(this.text());
                this.mediaPlayer.src(this.getSrc());
                this.mediaPlayer.play();
            }
        }

        return NewModule;
    });