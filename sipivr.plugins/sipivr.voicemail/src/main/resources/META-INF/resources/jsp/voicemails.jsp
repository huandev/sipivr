<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<tiles:insertDefinition name="defaultTemplate">
    <tiles:putAttribute name="body">
        <div class="content table-border" id="voicemails" style="display: none;" data-bind="visible: $data">
            <table class="table datagrid">
                <colgroup>
                    <col width="160"/>
                    <col width="120"/>
                    <col width="120"/>
                    <col width="120"/>
                    <col width="300"/>
                </colgroup>
                <thead>
                <tr>
                    <th><spring:message code="model.call.createdate"/></th>
                    <th><spring:message code="model.campaign"/></th>
                    <th><spring:message code="model.call.callerId"/></th>
                    <th><spring:message code="model.call.calledId"/></th>
                    <th><spring:message code="ru.sipivr.voicemail"/></th>
                </tr>
                </thead>
                <tbody>
                <!-- ko foreach: items -->
                <tr>
                    <td data-bind="text: createDate, date: 'yyyy-MM-dd hh:mm:ss'"></td>
                    <td data-bind="text: campaign.name"></td>
                    <td data-bind="text: call.callerId"></td>
                    <td data-bind="text: call.calledId"></td>
                    <td data-bind="with: $parent.mediaPlayer">
                        <div class="player">
                            <i class="green icon-play" data-bind="click: function() { title($root.getTitle($parent)); src($root.getSrc($parent)); play(); }, visible: $root.getSrc($parent) != src() || state() != 'Play'"></i>
                            <i class="red icon-pause" data-bind="click: pause, visible: $root.getSrc($parent) == src() && state() == 'Play'"></i>

                            <div class="progress" data-bind="click: function(data, event) { $root.mediaPlayerClick($root.getSrc($parent), event); }" style="text-align: center;">
                                <div class="progress-bar green" data-bind="style: { width: Math.round($root.getSrc($parent) == src() ? percent() : 0) + '%' }"></div>
                            </div>
                        </div>
                    </td>
                </tr>
                <!-- /ko -->
                </tbody>
            </table>
        </div>

        <script type="text/javascript">
            require(["knockout", "messages", "widgets/InlineEditor", "widgets/MediaPlayerView", "app/ko.binding.date"], function (ko, messages, InlineEditor, MediaPlayer) {
                $(function() {
                    var model = new InlineEditor({
                        get: function (success) {
                            $.post(contextPath + "api/voicemails", function (data) {
                                success(data);
                            });
                        }
                    });

                    model.mediaPlayer = MediaPlayer;

                    model.getSrc = function(model){
                        return contextPath + "voicemail/play/" + model.id;
                    }

                    model.getTitle = function(model){
                        return model.campaign.name + " - " + model.createDate + " - " + model.call.callerId;
                    }

                    model.mediaPlayerClick = function (src, event) {
                        if(this.mediaPlayer.src() == src) {
                            this.mediaPlayer.click(event);
                        }
                    }

                    ko.applyBindings(model, document.getElementById("voicemails"));

                    model.init();
                });
            });
        </script>
    </tiles:putAttribute>
</tiles:insertDefinition>