<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<style>
    #sound-file-template-container {width:1200px; height:600px; margin-left:-600px; margin-top:-300px; z-index:90; }
    #sound-file-template-container table {background: #fff; box-shadow:0 0 10px #009cde;}
    #sound-file-template .overflow { opacity: 0.4; z-index:90; }
</style>

<div id="sound-file-template" data-bind="visible: selectMode" style="display:none;">
    <div class="overflow"></div>
    <div id="sound-file-template-container">
        <jsp:include page="/jsp/sounds_partial.jsp"/>
    </div>
</div>

<script type="text/javascript">
    require(["knockout", "sound/SoundView", "app/ko.binding.fileDrop", "app/ko.binding.date"], function(ko, model){
        $(function() {
            ko.applyBindings(model, document.getElementById("sound-file-template"));
        });
    });
</script>

<script type="text/html" id="svg-sound-file-menu-item">
    <g data-bind="attr: { 'class': 'menu-item' + (active() ? ' active' : '') }">
        <rect width="194" data-bind="attr: {height: height, 'class': 'menu-item-back' + (active() ? ' active' : '') + (!isValid() ? ' menu-item-incorrect' : '')}"/>
        <text class="icon icon-left" x="6" y="21" data-bind="html: $root.icons['icon-cancel'], click: remove, event: { mousedown: function(s, e){ e.stopPropagation(); } }"></text>
        <text x="25" y="20" data-bind="text: text().substr(0, 21)" clip-path="url(#textClip)"/>
        <!-- ko foreach: outputPoints -->
        <circle class="point output" r="8" data-bind="attr: { transform: 'translate(196,' + (15 + $index() * 30) + ')' }, event: { onload: init($element), mousedown: function(s, e){ e.stopPropagation(); } }"></circle>
        <!-- /ko -->
        <title data-bind="text: text"></title>

        <!-- ko if: soundId() -->
            <!-- ko if: $data.getSrc() != mediaPlayer.src() || mediaPlayer.state() != 'Play'-->
            <text class="icon icon-right" x="170" y="21" data-bind="html: $root.icons['icon-play'], click: play" style="fill:#487209; cursor: pointer;"></text>
            <!-- /ko -->
            <!-- ko if: $data.getSrc() == mediaPlayer.src() && mediaPlayer.state() == 'Play'-->
            <text class="icon icon-right" x="170" y="21" data-bind="html: $root.icons['icon-pause'], click: function() { mediaPlayer.pause(); }" style="fill:#CC0000; cursor: pointer;"></text>
            <!-- /ko -->
        <!-- /ko -->
        <!-- ko if: !soundId() -->
            <text class="icon icon-right" x="170" y="21" data-bind="html: $root.icons['icon-play']"></text>
        <!-- /ko -->
    </g>
</script>