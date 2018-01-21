<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<style>
    .player i {display: inline-block; height: 24px; line-height: 24px; width:24px; font-size: 12px;
        color:#fff; border-radius: 12px; text-align: center; cursor:pointer; }
    .player i.icon-play:before {margin-left: 3px;}
    .player i.icon-pause:before {margin-left: 2px;}
    .player .progress {display: inline-block; height: 8px; cursor: pointer; }
    .player .progress { width:240px; min-height: 5px; border: 1px solid #ccc; border-radius: 4px; background: #f0f0f0;}
    .player .progress .progress-bar { height: 100%; color:#fff; text-align: center; }

    #mediaPlayer {
        position: fixed; bottom: 0; left:50%; width:400px; margin-left: -200px;;
        border:1px solid #ccc; border-bottom:none; border-radius: 5px 5px 0 0; color:#fff;
        z-index: 100;
    }
    #mediaPlayer > div { padding: 5px 7px; }
    #mediaPlayer > div:first-child { padding-bottom: 0; text-align: center;}
    #mediaPlayer > div:last-child { padding-top: 0; }
    #mediaPlayer .progress {width:320px; margin-left: 5px;}
</style>

<div id="mediaPlayer" class="player gray" style="display: none;" data-bind="visible: state() != 'Stop'">
    <audio data-bind="event: { load: function() { init($element); }() }, attr: { src: src }"></audio>

    <div data-bind="text: title">

    </div>
    <div>
        <i class="green icon-play" data-bind="click: play, visible: state() != 'Play'"></i>
        <i class="red icon-pause" data-bind="click: pause, visible: state() == 'Play'"></i>

        <i class="red icon-stop" data-bind="click: function() { stop(); src(null); }"></i>
        <div class="progress" data-bind="click: function(data, event) { click(event); }" style="text-align: center;">
            <div class="progress-bar green" data-bind="style: { width: Math.round(percent()) + '%' }"></div>
        </div>
    </div>
</div>

<script type="text/javascript">
    $(function() {
        require(["knockout", "widgets/MediaPlayerView"], function (ko, mediaPlayer) {
            ko.applyBindings(mediaPlayer, document.getElementById("mediaPlayer"));
        });
    });
</script>