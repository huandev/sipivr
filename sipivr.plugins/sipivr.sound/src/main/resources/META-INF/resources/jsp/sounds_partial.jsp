<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<style>
    #sound-index {width:1000px; height: 100%; font-size: 0.9em;}

    #sound-index form {position: absolute; background:#64a70b; width:100%; height:100%; top:0; left:0; opacity:0.5; z-index:100;}
    #sound-index input[type=file] { width:100%; height: 100%; opacity: 0; position: absolute;}

    #sound-index .progress {width:120px;}

    #sound-index table { width:1220px; border: 1px solid #ccc;}
    #sound-index thead { background: #f0f0f0; border-bottom: 1px solid #ccc; }
    #sound-index tfoot { background: #f0f0f0; border-top: 1px solid #ccc; }
    #sound-index tbody { max-height: 500px; min-height: 500px; }
    #sound-index tfoot td {width: 1220px; max-width:none !important;}

    <c:set var="widths" value="0,110,120,120,160,150,520" />
    <c:forTokens items="${widths}" delims="," varStatus="width">
    #sound-index td:nth-child(${width.index}), #sound-index th:nth-child(${width.index}) { min-width:${width.current}px; max-width:${width.current}px; }
    </c:forTokens>
</style>

<script type="text/html" id="sound-index-title">
    <div class="datagrid-sortable" data-bind="click: function() { if($root.filter.sortField() != field) { $root.filter.sortField(field) } else { $root.filter.sortType( $root.filter.sortType() == 'Asc' ? 'Desc' : 'Asc'); }; }">
        <div data-bind="text: title"></div>
        <!-- ko if: $root.filter.sortField() == field -->
        <div class="datagrid-sorting-arrows" data-bind="css: {'asc-sorted': $root.filter.sortType() == 'Desc', 'desc-sorted': $root.filter.sortType() == 'Asc' }">
            <div></div>
        </div>
        <!-- /ko -->
    </div>
</script>

<div id="sound-index" style="display: none;" data-bind="visible: $data, fileDrop: 'fileDropContainer', fileDropHandler: fileDropHandler">
    <form method="POST" id="fileDropContainer" enctype="multipart/form-data">
        <input type="file" name="file" accept=".mp3,.wav,audio/*" multiple/>
    </form>

    <table class="table table-overflow datagrid">
        <thead>
            <tr>
                <th data-bind="template: { name: 'sound-index-title', data: { title: '<spring:message code="model.sound.createDate"/>', field: 'createDate' } }"></th>
                <th data-bind="template: { name: 'sound-index-title', data: { title: '<spring:message code="ui.owner"/>', field: 'ownerId' } }"></th>
                <th data-bind="template: { name: 'sound-index-title', data: { title: '<spring:message code="model.sound.name"/>', field: 'name' } }"></th>
                <th data-bind="template: { name: 'sound-index-title', data: { title: '<spring:message code="model.sound.description"/>', field: 'description' } }"></th>

                <th></th>
                <th rowspan="2">
                    <button class="blue" type="button" data-bind="click: function() { $('input[type=file]', $($element).parent()).click(); }">
                        <span class="icon-plus"></span> <spring:message code="ui.add"/>
                    </button>
                    <!-- ko if: $root.selectMode() -->
                    <button class="blue" data-bind="click: function() { $root.selectMode(false); }"><spring:message code="ui.cancel"/></button>
                    <!-- /ko -->
                    <input type="file" style="display: none;" data-bind="event: { change: function() { fileDropHandler($element.files); }}" multiple  accept=".wav,.mp3"/>

                    <!-- ko with: sipclient -->
                    <!-- ko if: connected -->
                        <!-- ko if: currentCall() -->
                        <button class="red" data-bind="click: function() { currentCall().session.terminate(); }">
                            <span data-bind="text: currentCall().duration"></span>
                            <span class="icon-phone"></span>
                        </button>
                        <!-- /ko -->
                        <!-- ko if: !currentCall() -->
                        <button class="green" data-bind="click: function() { $root.recordNew(); }">
                            <span class="icon-phone"></span>
                            <spring:message code="ru.sipivr.sound.plugin.quickrecord"/>
                        </button>
                        <!-- /ko -->
                    <!-- /ko -->
                    <!-- /ko -->
                </th>
            </tr>
            <!-- ko with: filter.model -->
            <tr>
                <th><input type="text" data-bind="value: createDate, date: 'yyyy-MM-dd'"/></th>
                <th><select data-bind="value: ownerId, options: $root.users, optionsValue: 'id', optionsText: 'name', optionsCaption: '<spring:message code="ui.all"/>'"></select></th>
                <th><input type="text" data-bind="value: name"/></th>
                <th><input type="text" data-bind="value: description"/></th>
                <th></th>
            </tr>
            <!-- /ko -->
        </thead>
        <tbody>
        <!-- ko foreach: items -->
        <tr>
            <td data-bind="text: createDate, date: 'yyyy-MM-dd hh:mm'"></td>
            <td data-bind="text: ownerName"></td>

            <!-- ko if: $parent.edited() == $data -->
            <!-- ko with: $parent.editedTemp -->
            <td><input type="text" data-bind="value: name"/></td>
            <td><input type="text" data-bind="value: description"/></td>
            <!-- /ko -->
            <!-- /ko -->

            <!-- ko if: $parent.edited() != $data -->
            <td data-bind="text: name"></td>
            <td data-bind="text: description"></td>
            <!-- /ko -->

            <td data-bind="with: $parent.mediaPlayer">
                <div class="player">
                    <i class="green icon-play" data-bind="click: function() { title($parent.name); src($root.getSrc($parent)); play(); }, visible: $root.getSrc($parent) != src() || state() != 'Play'"></i>
                    <i class="red icon-pause" data-bind="click: pause, visible: $root.getSrc($parent) == src() && state() == 'Play'"></i>

                    <div class="progress" data-bind="click: function(data, event) { $root.mediaPlayerClick($root.getSrc($parent), event); }" style="text-align: center;">
                        <div class="progress-bar green" data-bind="style: { width: Math.round($root.getSrc($parent) == src() ? percent() : 0) + '%' }"></div>
                    </div>
                </div>
            </td>

            <!-- ko if: $parent.edited() == $data -->
            <td>
                <button class="blue" data-bind="click: function() { $parent.save(); }"><i class="icon-floppy"></i> <spring:message code="ui.save"/></button>
                <button class="blue" data-bind="click: function() { $parent.cancel(); }"><spring:message code="ui.cancel"/></button>
            </td>
            <!-- /ko -->
            <!-- ko if: $parent.edited() != $data -->
            <td>
                <!-- ko if: $root.selectMode() -->
                <button class="blue" data-bind="click: function() { $root.select($data); $root.selectMode(false); }"><spring:message code="ui.choose"/></button>
                <!-- /ko -->
                <button class="link" data-bind="click: function() { $parent.edit($data); }"><i class="icon-edit"></i> <spring:message code="ui.edit"/></button>
                <button class="link" data-bind="click: function() { $parent.remove($data); }"><i class="icon-delete"></i> <spring:message code="ui.delete"/></button>
                <button class="link" data-bind="click: function() { $($element).next().click(); }">
                    <spring:message code="ru.sipivr.sound.newFile"/>
                </button>
                <input type="file" style="display: none;" data-bind="event: { change: function() { $root.fileDropHandler($element.files, $data); }}" accept=".wav,.mp3"/>
                <!-- ko if: $root.sipclient.connected() -->
                <button class="link" data-bind="click: function() { $root.record($data); }"><i class="icon-mic"></i> <spring:message code="ru.sipivr.sound.plugin.quickrecord"/></button>
                <!-- /ko -->
            </td>
            <!-- /ko -->
        </tr>
        <!-- /ko -->
        </tbody>
        <tfoot>
            <tr>
                <td colspan="6">
                    <div class="datagrid-footer-bar">
                        <div>
                            <div style="text-align: left">
                                <span style="white-space: nowrap">
                                    <span style="font-weight: bold"><spring:message code="ui.total"/>: </span>
                                    <span class="text-box" data-bind="text: filterResult.count()"></span>
                                </span>
                            </div>
                            <div class="datagrid-page-links">
                                <button class="gray" data-bind="click: goToStartPage, disable: filter.pageNumber() <= 1">&lt;&lt;</button>
                                <button class="gray" data-bind="click: goToLastPage, disable: filter.pageNumber() <= 1">&lt;</button>
                                <!-- ko foreach: ko.utils.range(1, filterResult.pagesCount()) -->
                                <button data-bind="text: $data, css: { gray: $root.filter.pageNumber() != $data, blue: $root.filter.pageNumber() == $data },
                                                    click: function() { $root.filter.pageNumber($data); }"></button>
                                <!-- /ko -->
                                <button class="gray" data-bind="click: goToNextPage, disable: filter.pageNumber() >= (filterResult.pagesCount())">&gt;</button>
                                <button class="gray" data-bind="click: goToEndPage, disable: filter.pageNumber() >= (filterResult.pagesCount())">&gt;&gt;</button>
                            </div>
                            <div style="text-align: right">
                                <span style="white-space: nowrap">
                                    <select data-bind="options: [50, 100, 500, 1000], value: filter.pageSize" style="width: 60px;"></select>
                                </span>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        </tfoot>
    </table>
</div>