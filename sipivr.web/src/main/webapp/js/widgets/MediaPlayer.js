define(['knockout'], function (ko) {
    var mediaPlayerState = {
        Play: "Play",
        Stop: "Stop",
        Pause: "Pause"
    };

    ko.subscribable.fn.subscribeChanged = function (callback) {
        var oldValue;
        this.subscribe(function (_oldValue) {
            oldValue = _oldValue;
        }, this, 'beforeChange');

        this.subscribe(function (newValue) {
            callback(newValue, oldValue);
        });
    };

    function MediaPlayer() {
        var self = this;

        this.src = ko.observable();

        this.src.subscribeChanged(function(newValue, oldValue) {
            if(oldValue != newValue) {
                self.stop();
            }
        })

        this.isReady = ko.observable(false);
        this.state = ko.observable(mediaPlayerState.Stop);

        this.time = ko.observable(0);

        this.percent = ko.computed(function() {
            return 100 * this.time() / (this.audioContainer ? this.audioContainer.duration : 100);
        }, this);
    }

    MediaPlayer.prototype.init = function (element) {
        var self = this;

        this.audioContainer = element;

        this.audioContainer.addEventListener('timeupdate', function(){
            self.time(self.audioContainer.currentTime);
        });

        this.audioContainer.addEventListener('ended', function(){
            // console.log("ended");
            self.state(mediaPlayerState.Stop);
            self.src(null);
        });

        this.isReady(true);
    }

    MediaPlayer.prototype.play = function () {
        if(this.isReady() && (this.state() == mediaPlayerState.Stop || this.state() == mediaPlayerState.Pause))
        {
            this.audioContainer.play();
            this.state(mediaPlayerState.Play);
        }
//        if (this.paused()) {
//
//            this.audioContainer.addEventListener('canplay', function() {
//                self.canPlay(true);
//                self.setAudioCurrentTime(self.pauseTimeSpan());
//                self.audioContainer.removeEventListener('canplay', arguments.callee);
//            });
//            this.paused(false);
//        }
    }

    MediaPlayer.prototype.pause = function () {
        if(this.isReady() && this.state() == mediaPlayerState.Play) {
            this.audioContainer.pause();
            this.state(mediaPlayerState.Pause);
        }
    }

    MediaPlayer.prototype.stop = function() {
        if(this.isReady() && (this.state() == mediaPlayerState.Play || this.state() == mediaPlayerState.Pause)) {
            this.audioContainer.pause();
            this.audioContainer.currentTime = 0;
            this.time(0);

            this.state(mediaPlayerState.Stop);
        }
    }

    return MediaPlayer;
});
