<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<div id="wav-editor" data-bind="if: wavInfo, visible: wavInfo" style="width:1020px; text-align: center;display:none;">
    <div style="padding: 5px;">
        <span>path:</span>
        <span data-bind="text: path"></span>,
        <!-- ko with: wavInfo -->
            <span>duration:</span>
            <span data-bind="text: duration"></span>ms,
            <span>numChannels:</span>
            <span data-bind="text: numChannels"></span>,
            <span>byteRate:</span>
            <span data-bind="text: byteRate"></span>
        <!-- /ko -->
    </div>

    <svg width="1020" height="300" style="border:1px solid #999;">
        <g transform="translate(10,0)">
            <rect height="256" width="1000" data-bind="click: click" fill-opacity="0"></rect>

            <g data-bind="attr: { transform: 'translate(0, 256)' }">
                <rect width="1020" height="20" fill="#ccc" transform="translate(-10,0)"></rect>
                <g data-bind="foreach: timeItems">
                    <text data-bind="text: $data, attr: { x: 1000 * ($data / $root.wavInfo().duration) }" y = "14" font-size="10" text-anchor="middle"></text>
                    <path data-bind="attr: { d: 'M ' + 1000 * ($data / $root.wavInfo().duration) +' 0 L ' + 1000 * ($data / $root.wavInfo().duration) +' -256' }" stroke="#ccc" stroke-width="1"></path>
                    <path data-bind="attr: { d: 'M ' + 1000 * ($data / $root.wavInfo().duration) +' 0 L ' + 1000 * ($data / $root.wavInfo().duration) +' -5' }" stroke="#000" stroke-width="2"></path>
                </g>
            </g>
            <g>
                <rect height="256" data-bind="attr: { width: 1000 * left() / wavInfo().duration}" fill="red" fill-opacity="0.1"></rect>
                <g data-bind="attr: { transform: 'translate(' + (1000 * left() / wavInfo().duration - 2) + ', 0)' }">
                    <path d="M0 0 L-5 5 L-5 15 L5 15 L5 5 Z"  transform="translate(0, 276)"
                          fill="#ccc" stroke="#666" style="cursor: pointer;"
                          data-bind="event: initLeft($element)" />
                    <line x1="0" y1="0" x2="0" y2="256" stroke="red" stroke-width="2"/>
                </g>
            </g>
            <g data-bind="attr: { transform: 'translate(' + 1000 * right() / wavInfo().duration + ',0)' }">
                <rect height="256" data-bind="attr: { width: 1000 * (wavInfo().duration - right()) / wavInfo().duration }" fill="red" fill-opacity="0.1"></rect>

                <path d="M0 0 L-5 5 L-5 15 L5 15 L5 5 Z"  transform="translate(0, 276)"
                      fill="#ccc" stroke="#666" style="cursor: pointer;"
                      data-bind="event: wavInfo() ? initRight($element) : undefined" />
                <line x1="0" y1="0" x2="0" y2="256" stroke="red" stroke-width="2"/>
            </g>

            <!-- ko if: mediaPlayer.state() !== 'Stop' -->
            <rect height="256" width="2" fill="green"
                  data-bind="attr: { transform: 'translate(' + 1000 * 1000 * mediaPlayer.time() / wavInfo().duration + ',0)' }"></rect>
            <!-- /ko -->
            <g data-bind="attr: { transform: 'translate(0, 128) scale(' + 1000 / (wavInfo().data.length / 2) + ', 1)' }">
                <path data-bind="attr: { d: soundPathD }" stroke="black" stroke-width="1" transform="scale(1, 0.0039)"></path>
                <path data-bind="attr: { d: 'M 0 0 L ' + wavInfo().data.length / 2 + ' 0' }" stroke="#f00" stroke-width="1"></path>
            </g>
        </g>
    </svg>

    <div>
        <div class="player">
            <!-- ko with: mediaPlayer -->
            <button class="green" data-bind="click: function() { $root.play(); }, visible: state() != 'Play'">
                <spring:message code="ru.sipivr.sound.ui.play"/>
                <i class="icon-play" ></i>
            </button>
            <button class="red" data-bind="click: pause, visible: state() == 'Play'">
                <spring:message code="ru.sipivr.sound.ui.pause"/>
                <i class="icon-pause"></i>
            </button>
            <!-- /ko -->

            <!-- ko with: sipclient -->
                <!-- ko with: connected() && currentCall() -->
                <button class="red" data-bind="click: function() { session.terminate(); }">
                    <span data-bind="text: duration"></span>
                    <span class="icon-phone"></span>
                </button>
                <!-- /ko -->
                <!-- ko if: connected() && !currentCall() -->
                <button class="green" data-bind="enable: connected(), click: function() { $root.record(); }">
                    <spring:message code="ru.sipivr.sound.ui.record"/>
                    <span class="icon-mic"></span>
                </button>
                <!-- /ko -->
            <!-- /ko -->

            <button class="red" data-bind="visible: left() > 0 || right() < wavInfo().duration, click: cut">
                Вырезать выбранный участок
                <span class="icon-cut"></span>
            </button>
        </div>
    </div>
</div>

<script type="text/javascript">
    require(["knockout", "utils/SVGTemplateEngine", "sound/wav/Editor"], function(ko, SVGTemplateEngine, editor){
        if(!window.SVGTemplateEngine) {
            window.SVGTemplateEngine = new SVGTemplateEngine();
        }

        ko.applyBindings(editor, document.getElementById("wav-editor"));
    });
</script>