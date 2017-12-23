define(['knockout', "widgets/MediaPlayer"], function (ko, MediaPlayer) {
    var mediaPlayer = new MediaPlayer();
    mediaPlayer.title = ko.observable();

    mediaPlayer.click = function (event) {
        var barPercent = ((event.clientX - event.currentTarget.getBoundingClientRect().left) / event.currentTarget.offsetWidth) * 100;

        if (barPercent < 0)
            barPercent = 0;
        if (barPercent > 100)
            barPercent = 100;

        this.audioContainer.currentTime = (this.audioContainer.duration / 100) * barPercent;
    }

    return mediaPlayer;
});
