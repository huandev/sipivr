define(["knockout", "messages", "widgets/MediaPlayerView", "utils/Drag", "widgets/sipclient"],
    function(ko, messages, mediaPlayer, Drag, sipclient){
        function Editor() {
            var self = this;

            this.sipclient = sipclient;
            this.mediaPlayer = mediaPlayer;

            this.path = ko.observable();
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

            this.timeItems = ko.computed(function() {
                var wavInfo = this.wavInfo();
                if (!wavInfo) {
                    return [];
                }

                var steps = [50, 100, 250, 500, 1000, 5000, 10000];
                var step = 0;
                for (var i = 0; i < steps.length; i++) {
                    step = steps[i];
                    if (this.wavInfo.duration / step < 20) {
                        break;
                    }
                }
                var result = [];
                for (var i = 0; i <= this.wavInfo.duration; i+= step) {
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

        Editor.prototype.load = function (path) {
            var self = this;
            $.post(contextPath + "wav/get", { path: path }, function(wavInfo){
                self.mediaPlayer.title(path);
                self.mediaPlayer.src(contextPath + "wav/play?path=" + encodeURIComponent(path) + "&timestamp=" + new Date().valueOf());

                self.left(0);
                self.right(0);
                self.path(path);
                self.wavInfo(wavInfo);
                self.right(wavInfo.duration);
            });
        }

        Editor.prototype.initLeft = function (ui) {
            var self = this;
            new Drag(ui, {
                move: function (data) {
                    var duration = self.wavInfo().duration;
                    self.left(self.left() + duration * data.dx / 1000);

                    if(self.left() < 0){
                        self.left(0);
                    } else if(self.left() > self.right()){
                        self.left(self.right());
                    }
                },
            });
        }

        Editor.prototype.initRight = function (ui) {
            var self = this;
            new Drag(ui, {
                move: function (data) {
                    var duration = self.wavInfo().duration;
                    self.right(self.right() + duration * data.dx / 1000);

                    if(self.right() > duration){
                        self.right(duration);
                    } else if(self.right() < self.left()){
                        self.right(self.left());
                    }
                },
            });
        }

        Editor.prototype.play = function () {
            this.mediaPlayer.audioContainer.currentTime = this.left() / 1000;
            this.mediaPlayer.play();
        }

        Editor.prototype.click = function (data, e) {
            var x = e.clientX - e.currentTarget.getBoundingClientRect().left;
            if(x > 1000){
                x = 1000;
            }
            this.mediaPlayer.audioContainer.currentTime = this.wavInfo().duration * x / 1000 / 1000;
            this.mediaPlayer.play();
        }

        Editor.prototype.record = function() {
            var self = this;
            var call = sipclient.makeCall("record", {
                ended: function () {
                    if (call.id) {
                        $.post(contextPath + "wav/record", { path: self.path(), uuid: call.id }, function(){
                            self.load(self.path());
                        });
                    }
                }
            });
        }

        Editor.prototype.cut = function () {
            var self = this;
            $.post(contextPath + "wav/cut", {
                path: self.path(),
                from: self.left(),
                to: self.right(),
            }, function(){
                self.load(self.path());
            });
        }

        Editor.prototype.fileDropHandler = function(files) {
            var self = this;

            var data = new FormData();

            if(files.length == 1){
                var fileExtension = files[0].name.split('.').pop();

                if(fileExtension != 'wav' && fileExtension != 'mp3') {
                    $.notify(messages["model.sound.error.extension"], { className: "error", position: "right bottom" });
                    return;
                }
                data.append('path', self.path());
                data.append('file', files[0]);

                $.ajax({
                    url: contextPath + "wav/updateFile",
                    type: "POST",
                    data: data,
                    cashe: false,
                    processData: false,
                    contentType: false,
                    success: function(data){
                        self.load(self.path());
                    }
                });
            }
        }

        return new Editor();
    });