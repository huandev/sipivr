<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<tiles:insertDefinition name="defaultTemplate">
    <tiles:putAttribute name="body">

        <div id="soundEditor-index" data-bind="if: wavInfo" style="text-align: center;">
            <div>
                <span data-bind="text: filePath"></span>
                <span data-bind="text: duration"></span>ms
            </div>
            <svg width="1020" height="276" style="border:1px solid #999;" data-bind="click: click">
                <g transform="translate(10,0)">
                    <g>
                        <rect height="256" data-bind="attr: { width: 1000 * left() / duration() }" fill="red" fill-opacity="0.1"></rect>
                        <rect height="256" width="4" fill="red" style="cursor: pointer;"
                              data-bind="
                              attr: { transform: 'translate(' + (1000 * left() / duration() - 2) + ', 0)' },
                              event: initLeft($element)">
                        </rect>
                    </g>
                    <g data-bind="attr: { transform: 'translate(' + 1000 * right() / duration() + ',0)' }">
                        <rect height="256" data-bind="attr: { width: 1000 * (duration() - right()) / duration() }" fill="red" fill-opacity="0.1"></rect>
                        <rect height="256" width="4" fill="red" style="cursor: pointer;"
                              data-bind="attr: { transform: 'translate(-2, 0)' }, event: initRight($element)">
                        </rect>
                    </g>

                    <rect height="256" width="2" fill="green"
                          data-bind="attr: { transform: 'translate(' + 1000 * 1000 * mediaPlayer.time() / duration() + ',0)' }"></rect>

                    <g data-bind="attr: { transform: 'translate(0, 128) scale(' + 1000 / (wavInfo().data.length / 2) + ', 1)' }">
                        <path data-bind="attr: { d: soundPathD }" stroke="black" stroke-width="1" transform="scale(1, 0.0039)"></path>
                        <path data-bind="attr: { d: 'M 0 0 L ' + wavInfo().data.length / 2 + ' 0' }" stroke="#f00" stroke-width="1"></path>
                    </g>

                    <g data-bind="attr: { transform: 'translate(0, 256)' }">
                        <rect width="1020" height="20" fill="#ccc" transform="translate(-10,0)"></rect>
                        <g data-bind="foreach: timeItems">
                            <text data-bind="text: $data, attr: { x: 1000 * ($data / $root.duration()) }" y = "14" font-size="10" text-anchor="middle"></text>
                            <path data-bind="attr: { d: 'M ' + 1000 * ($data / $root.duration()) +' 0 L ' + 1000 * ($data / $root.duration()) +' -256' }" stroke="#ccc" stroke-width="1"></path>
                            <path data-bind="attr: { d: 'M ' + 1000 * ($data / $root.duration()) +' 0 L ' + 1000 * ($data / $root.duration()) +' -5' }" stroke="#000" stroke-width="2"></path>
                        </g>
                    </g>
                </g>
            </svg>

            <div>
                <div class="player" data-bind="with: mediaPlayer">
                    <i class="green icon-play" data-bind="click: function() { $root.play(); }, visible: state() != 'Play'"></i>
                    <i class="red icon-pause" data-bind="click: pause, visible: state() == 'Play'"></i>
                </div>
            </div>
        </div>

        <script type="text/javascript">
            require(["knockout", "utils/SVGTemplateEngine", "sound/SoundEditor"], function(ko, SVGTemplateEngine, SoundEditor){
                window.SVGTemplateEngine = new SVGTemplateEngine();

                var model = new SoundEditor();
                model.load("5.wav");
                ko.applyBindings(model, document.getElementById("soundEditor-index"));
            });
        </script>
    </tiles:putAttribute>
</tiles:insertDefinition>