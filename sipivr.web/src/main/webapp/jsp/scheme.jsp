<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles" %>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>

<tiles:insertDefinition name="defaultTemplate">
    <tiles:putAttribute name="title" value="sipivr - ${campaign.name}" />
    <tiles:putAttribute name="body">
        <jsp:include page="/jsp/sipclient.jsp"/>

        <c:forEach items="${pluginService.includePlugins}" var="plugin"><c:forEach items="${plugin.schemeIncludes}" var="item">
            <jsp:include page="/jsp${item}"/>
        </c:forEach></c:forEach>

        <link href="<c:url value="/resources/css/ivr.css"/>" rel="stylesheet">

        <div id="editor">
            <div style="position:absolute; left:0; right:0; top:0; bottom:0;">
                <svg id="svg" class="svg" width="100%" height="100%">
                    <defs>
                        <linearGradient id="gradient-active" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style="stop-color:#FF9900;stop-opacity:1;" />
                            <stop offset="80%" style="stop-color:#FFCC99;stop-opacity:1;" />
                            <stop offset="100%" style="stop-color:#FFCC99;stop-opacity:1;" />
                        </linearGradient>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style="stop-color:#CCCCCC;stop-opacity:1;" />
                            <stop offset="80%" style="stop-color:#FFFFFF;stop-opacity:1;" />
                            <stop offset="100%" style="stop-color:#FFFFFF;stop-opacity:1;" />
                        </linearGradient>
                    </defs>
                    <g class="workspace" data-bind="attr: { transform: 'translate(' + x() + ',' + y() + ')scale(' + scale() + ')' }, event: { onload: init($element) }">
                        <!-- ko foreach: menus -->
                        <g data-bind="template: { name: template, templateEngine: SVGTemplateEngine, afterRender: function() { init($element); } }, attr: { transform: 'translate(' + x() + ', ' + y() + ')', class: 'element' + (active() ? ' active' : '') }"></g>
                        <!-- /ko -->

                        <!-- ko with: helper -->
                        <g data-bind="template: { name: template, templateEngine: SVGTemplateEngine, afterRender: function() { init($element); } }, attr: { transform: 'translate(' + x() + ', ' + y() + ')' }"></g>
                        <!-- /ko -->
                    </g>
                </svg>
            </div>

            <div id="parameters" class="gray" style="display: none;" data-bind="visible: true">
                <div style="display: inline-block;">
                    <span><spring:message code="model.campaign.startmenu"/> </span><select data-bind="options: menus,
                    optionsValue: function (item) { return item.getIndex(); },
                    optionsText: function (item) { return item.nameParameter.value(); },
                    value: startMenuIndex,
                    optionsCaption: '...'" style="max-width:240px;"></select>
                </div>

                <div class="button-group">
                    <!-- ko with: commandHistory -->
                    <button class="blue" data-bind="attr: { title: Current() < 0 ? '' : 'Undo ' + Commands()[Current()].Name }, click: undo, disable: Current() < 0"><i class="icon-reply"></i></button>
                    <!-- /ko -->
                    <button class="blue" data-bind="click: save, enable: menus().length"><spring:message code="ui.save"/></button>
                    <!-- ko with: commandHistory -->
                    <button class="blue" data-bind="attr: { title: (Current() >= Commands().length - 1) ? '' : 'Redo ' + Commands()[Current() + 1].Name }, click: redo, disable: Current() >= Commands().length - 1"><i class="icon-forward"></i></button>
                    <!-- /ko -->
                </div>

                <!-- ko with: activeElement() -->
                <!-- ko if: parameters().length -->
                <!-- ko foreach: parameters -->
                <div style="display: inline-block;" data-bind="component: { name: component, params: $data }"></div>
                <!-- /ko -->
                <!-- /ko -->
                <!-- /ko -->

                <!-- ko with: sipclient -->
                <!-- ko if: connected -->
                <div class="button-group" style="float:right;">
                <!-- ko if: currentCall() -->
                <button class="red" data-bind="click: function() { currentCall().session.terminate(); }">
                    <span data-bind="text: currentCall().duration"></span>
                    <span class="icon-phone"></span>
                </button>
                <!-- /ko -->
                <!-- ko if: !currentCall() -->
                <button class="green" data-bind="enable: connected(), click: function() { makeCall('${campaign.number}'); }">
                    Call
                    <span class="icon-phone"></span>
                </button>
                <!-- /ko -->
                </div>
                <!-- /ko -->
                <!-- /ko -->
            </div>
        </div>

        <div id="toolbar" data-bind="style: { opacity: opacity }" class="gray">
            <!-- ko foreach: sections -->
            <div class="toolbar-section">
                <!-- ko if: name -->
                <div class="toolbar-header" data-bind="click: function () { isVisible(!isVisible()) }">
                    <div data-bind="message: name"></div>
                    <div class="arrow" data-bind="css: { 'arrow-up': isVisible(), 'arrow-down': !isVisible() }">
                        <div></div>
                    </div>
                </div>
                <!-- /ko -->
                <div data-bind="visible: isVisible">
                    <!-- ko foreach: items -->
                    <div class="button gray" data-bind="event: init($element), css: { 'disabled': !enable() }">
                        <span data-bind="message: name"></span>
                        <!-- ko if: $data.icon -->
                        <i style="float:right;" data-bind="attr: { 'class': icon }"></i>
                        <!-- /ko -->
                    </div>
                    <!-- /ko -->
                </div>
            </div>
            <!-- /ko -->
        </div>

        <script type="text/html" id="svg-menu-item">
            <g data-bind="attr: { 'class': 'menu-item' + (active() ? ' active' : '') }">
                <rect width="194" data-bind="attr: {height: height, 'class': 'menu-item-back' + (active() ? ' active' : '') + (!isValid() ? ' menu-item-incorrect' : '')}"/>
                <text class="icon icon-left" x="6" y="21" data-bind="html: $root.icons['icon-cancel'], click: remove, event: { mousedown: function(s, e){ e.stopPropagation(); } }"></text>
                <text x="25" y="20" data-bind="text: text().substr(0, 21)" clip-path="url(#textClip)"/>
                <!-- ko foreach: outputPoints -->
                <circle class="point output" r="8" data-bind="attr: { transform: 'translate(196,' + (15 + $index() * 30) + ')' }, event: { onload: init($element), mousedown: function(s, e){ e.stopPropagation(); } }"></circle>
                <!-- /ko -->
                <title data-bind="text: text"></title>

                <!-- ko if: $data.icon() -->
                <text class="icon icon-right" x="170" y="21" data-bind="html: $root.icons[icon()]"></text>
                <!-- /ko -->
            </g>
        </script>

        <script type="text/html" id="svg-menu">
            <g data-bind="attr: { 'class': 'menu' + (active() ? ' active' : '') + (highlight() ? ' highlight' : '') }">
                <rect width="200" rx="3" ry="3" data-bind="attr: { 'class': 'menu-back', height: 30 + height() }"></rect>

                <g class="header">
                    <rect class="header-back" width="200" height="30" rx="2" ry="2"></rect>
                    <text class="header-text" x="10" y="20" data-bind="text: nameParameter.value()"></text>
                    <text class="icon" x="177" y="21" data-bind="html: $root.icons['icon-cancel'], click: remove, event: {mousedown: function(s, e){ e.stopPropagation(); } }"></text>
                </g>

                <g class="menu-items">
                    <rect transform="translate(0,30)" rx="2" ry="2" width="198" x="1" class="menu-items-back" data-bind="attr: {height: (height() - 1) }"></rect>
                    <g transform="translate(0,30)" class="menu-items-body">
                        <!-- ko foreach: modules -->
                        <g data-bind="template: { name: template, templateEngine: SVGTemplateEngine, afterRender: function() { init($element); } }, attr: { transform: 'translate(' + (3 + x()) + ', ' + getTopPosition() + ')'}"></g>
                        <!-- /ko -->
                    </g>
                </g>

                <!-- ko with: inputPoint -->
                <circle class="point input" r="6" transform="translate(100, 0)" data-bind="event: { onload: init($element) }"></circle>
                <!-- /ko -->
            </g>
        </script>

        <script type="text/javascript">
            require(["utils/SVGTemplateEngine"], function(SVGTemplateEngine){
                window.SVGTemplateEngine = new SVGTemplateEngine();
            });

            $(function() {
                require(["require", "knockout", "editor/Designer", "editor/Menu",
                            "editor/Toolbar", "editor/ToolbarItem", "utils/SVG", "messages", "app/ko.binding.date", "app/ko.binding.message"
                            <c:forEach items="${pluginService.resultPlugins}" var="plugin">,"${plugin.scriptPath}"
                            </c:forEach>],
                        function (require, ko, Designer, Menu, Toolbar, ToolbarItem, SVG, messages) {
                            var toolbar = new Toolbar();

                            var designer = new Designer(toolbar);

                            designer.sipclient.currentCall.subscribe(function(newValue){
                                designer.sipclient.visible(newValue && newValue.number == '${campaign.number}');
                            });

                            designer.save = function () {
                                var model = designer.getModel();

                                $.ajax({
                                    url: "<c:url value="/api/saveScheme/${campaign.id}"/>",
                                    data: ko.toJSON(model),
                                    type: "POST",
                                    contentType: 'application/json',
                                    success: function () {
                                        designer.commandHistory.clear();
                                        $.notify("<i class='icon-ok'></i> " + messages["ui.done"], { className: "base", position: "right bottom"} );
                                    }
                                });
                            };

                            window.designer = designer;
                            designer.icons = {};
                            var styleSheets = window.document.styleSheets;
                            for(var i = 0; i < styleSheets.length; i++){
                                if(!styleSheets[i].title == "fontello"){
                                    return null;
                                }
                                var classes = styleSheets[i].rules || styleSheets[i].cssRules;
                                for (var x = 0; x < classes.length; x++) {
                                    if(classes[x].selectorText) {
                                        var m = classes[x].selectorText.match("^\.(icon-\\S+)::before$");
                                        if (m) {
                                            designer.icons[m[1]] = "&#" + classes[x].style.content.charCodeAt(1) + ";";
                                        }
                                    }
                                }
                            }

                            var toolbarItemOptions = {
                                start: function (e, toolbarItem) {
                                    toolbar.opacity(0.2);

                                    var element = designer.createModule(toolbarItem);

                                    element.isHelper = true;

                                    var position = SVG.getMousePositionBy(e, designer.ui);
                                    element.x(position.x - 100);
                                    element.y(position.y - 15);

                                    designer.helper(element);

                                    element.drag.start(e);
                                },
                                stop: function (e, toolbarItem) {
                                    toolbar.opacity(1);
                                    designer.helper(null);
                                }
                            };

                            toolbar.addItem(new ToolbarItem(toolbarItemOptions, 'model.menu', Menu));

                            <c:forEach items="${pluginService.resultPlugins}" var="resultPlugin">
                                var toolbarItem = require("${resultPlugin.scriptPath}");
                                toolbar.addItem(new toolbarItem(toolbarItemOptions));
                            </c:forEach>

                            ko.applyBindings(designer, document.getElementById("editor"));
                            ko.applyBindings(toolbar, document.getElementById("toolbar"));


                            $.post("<c:url value="/api/scheme/${id}"/>", function (data) {
                                designer.setModel(data);
                            });
                        });
            });
        </script>
    </tiles:putAttribute>
</tiles:insertDefinition>