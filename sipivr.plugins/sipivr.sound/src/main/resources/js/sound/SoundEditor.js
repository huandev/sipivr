define(["knockout", "messages", "widgets/MediaPlayerView", "utils/Drag"],
    function(ko, messages, mediaPlayer, Drag){
        function SoundEditor() {
            var self = this;

            this.mediaPlayer = mediaPlayer;

            this.filePath = ko.observable();
            this.wavInfo = ko.observable();

            this.soundPathD = ko.computed(function() {
                var wavInfo = this.wavInfo();
                if(!wavInfo){
                    return null;
                }

                var soundPathD = "M 0 0 L";
                for(var i = 0; i < wavInfo.data.length; i+=2) {
                    var value = (wavInfo.data[i]) + (wavInfo.data[i + 1] << 8);
                    if(value >= 32768) {
                        value -= 65535;
                    }
                    soundPathD += " " + i / 2 + " " + value;
                }
                return soundPathD;
            }, this);

            this.duration = ko.computed(function(){
                var wavInfo = this.wavInfo();
                if(!wavInfo){
                    return 0;
                }

                return 1000 * wavInfo.data.length / wavInfo.byteRate;
            }, this);

            this.timeItems = ko.computed(function() {
                var wavInfo = this.wavInfo();
                if (!wavInfo) {
                    return [];
                }

                var steps = [50, 100, 250, 500, 1000];
                var step = 0;
                for (var i = 0; i < steps.length; i++) {
                    step = steps[i];
                    if (this.duration() / step < 20) {
                        break;
                    }
                }
                var result = [];
                for (var i = 0; i <= this.duration(); i+= step) {
                    result.push(i);
                }
                return result;
            }, this);

            this.left = ko.observable(0);
            this.right = ko.observable(0);

            this.mediaPlayer.time.subscribe(function (value) {
                if(self.right() < value * 1000){
                    self.mediaPlayer.stop();
                }
            });
        }
        
        SoundEditor.prototype.load = function (filePath) {
            var self = this;

            this.wavInfo(null);
            $.post(contextPath + "soundEditor/getWavInfo", { filePath: filePath }, function(wavInfo){
                self.mediaPlayer.title(filePath);
                self.mediaPlayer.src(contextPath + "soundEditor/play?filePath=" + encodeURIComponent(filePath));

                self.left(0);
                self.right(0);

                self.filePath(filePath);
                self.wavInfo(wavInfo);

                self.right(self.duration());
            });
        }
        
        SoundEditor.prototype.initLeft = function (ui) {
            var self = this;
            var duration = self.duration();
            var drag = new Drag(ui, {
                move: function (data) {
                    self.left(self.left() + duration * data.dx / 1000);

                    if(self.left() < 0){
                        self.left(0);
                    } else if(self.left() > self.right()){
                        self.left(self.right());
                    }
                },
            });
        }

        SoundEditor.prototype.initRight = function (ui) {
            var self = this;
            var duration = self.duration();
            var drag = new Drag(ui, {
                move: function (data) {
                    self.right(self.right() + duration * data.dx / 1000);

                    if(self.right() > duration){
                        self.right(duration);
                    } else if(self.right() < self.left()){
                        self.right(self.left());
                    }
                },
            });
        }

        SoundEditor.prototype.play = function () {
            this.mediaPlayer.audioContainer.currentTime = this.left() / 1000;
            this.mediaPlayer.play();
        }

        SoundEditor.prototype.click = function (data, e) {
            var x = e.clientX - e.currentTarget.getBoundingClientRect().left - 10;
            if(x > 1000){
                x = 1000;
            }
            this.mediaPlayer.audioContainer.currentTime = this.duration() * x / 1000 / 1000;
            this.mediaPlayer.play();
        }

        return SoundEditor;
    });