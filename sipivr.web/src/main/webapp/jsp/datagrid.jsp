<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>

<script type="text/html" id="datagrid-title-template">
    <div class="datagrid-sortable">
        <div data-bind="text: title"></div>
        <div class="datagrid-sorting-arrows" data-bind="css: {'asc-sorted': $parent.isOrdered(key, false),'desc-sorted': $parent.isOrdered(key, true)}">
            <div></div>
        </div>
    </div>
</script>

<script type="text/html" id="datagrid-head-right-column-template">
    <!-- ko if: !$data.editor.editedTemp() -->
    <button class="blue" data-bind="click: function() { $data.editor.add(); }"><spring:message code="ui.add"/> <i class="icon-plus"></i></button>
    <!-- /ko -->
</script>

<script type="text/html" id="datagrid-body-right-column-template">
    <button class="link" data-bind="click: function() { $parent.editor.edit($data); }"><i class="icon-edit"></i> <spring:message code="ui.edit"/></button>
    <!-- ko if: $parent.editor.options.remove -->
    <button class="link" data-bind="click: function() { $parent.editor.remove($data); }"><spring:message code="ui.delete"/></button>
    <!-- /ko -->
</script>

<script type="text/html" id="datagrid-filter-template">
    <!-- ko if: $data.options -->
    <select data-bind="value: filter.observable, options: options, optionsValue: optionsValue, optionsText: optionsText, optionsCaption: '<spring:message code="ui.choose"/>'"></select>
    <!-- /ko -->
    <!-- ko if: !$data.options -->
    <input type="text" data-bind="value: filter.observable, valueUpdate: 'afterkeydown'"/>
    <!-- /ko -->
</script>

<script type="text/html" id="datagrid-cell-template">
    <!-- ko if: $parent.options -->
        <!-- ko foreach: $parent.options -->
                <!-- ko if: $data[$parents[1].optionsValue] == $parent[$parents[1].key] -->
                    <span data-bind="text: $data[$parents[1].optionsText]"></span>
                <!-- /ko -->
        <!-- /ko -->
    <!-- /ko -->
    <!-- ko if: !$parent.options -->
    <span data-bind="text: $root.getValue($data, $parent.key)"></span>
    <!-- /ko -->
</script>

<script type="text/html" id="datagrid-editor-template">
    <!-- ko if: $parent.options -->
    <select data-bind="value: $data[$parent.key], options: $parent.options, optionsValue: $parent.optionsValue, optionsText: $parent.optionsText, optionsCaption: '<spring:message code="ui.choose"/>', validate: $parent.validate"></select>
    <!-- /ko -->
    <!-- ko if: !$parent.options -->
    <input data-bind="value: $data[$parent.key], attr: { type: $parent.type || 'text' }, validate: $parent.validate, hint: $parent.hint"/>
    <!-- /ko -->
</script>

<script type="text/html" id="datagrid-checkbox-cell-template">
    <input type="checkbox" data-bind="checked: $data[$parent.key], disable: true"/>
</script>

<script type="text/html" id="datagrid-checkbox-editor-template">
    <input type="checkbox" data-bind="checked: $data[$parent.key]"/>
</script>

<script type="text/html" id="datagrid-template">
    <table class="table datagrid">
        <colgroup>
            <!-- ko foreach: columns -->
            <col data-bind="attr: { width: width }"/>
            <!-- /ko -->
            <!-- ko if: $data.editor -->
            <col/>
            <!-- /ko -->
        </colgroup>
        <thead>
        <tr>
            <!-- ko foreach: columns -->
            <th data-bind="template: { name: titleTemplate }, click: function() { $data.key ? $parent.orderBy(key) : null; }"></th>
            <!-- /ko -->
            <!-- ko if: $data.editor -->
            <th data-bind="template: { name: $data.editor.options.headRightColumnTemplate || 'datagrid-head-right-column-template' }">
            </th>
            <!-- /ko -->
        </tr>
        <!-- ko if: $data.editor && !$data.editor.edited() && $data.editor.editedTemp() -->
        <tr class="datagrid-editor">
            <!-- ko with: editor.editedTemp() -->
            <!-- ko foreach: $parent.columns -->

            <!-- ko if: $data.editable !== false -->
            <td data-bind="template: { name: editorTemplate, data: $parent }"></td>
            <!-- /ko -->
            <!-- ko if: $data.editable === false -->
            <td data-bind="template: { name: cellTemplate, data: $parent }"></td>
            <!-- /ko -->

            <!-- /ko -->
            <!-- /ko -->
            <!-- ko if: $data.editor -->
            <td>
                <button class="blue" data-bind="click: function() { editor.save(); }"><i class="icon-floppy"></i> <spring:message code="ui.save"/></button>
                <button class="blue" data-bind="click: function() { editor.cancel(); }"><spring:message code="ui.cancel"/></button>
            </td>
            <!-- /ko -->
        </tr>
        <!-- /ko -->
        <!-- ko if: $data.hasFilters() && !($data.editor && !$data.editor.edited() && $data.editor.editedTemp()) -->
        <tr>
            <!-- ko foreach: columns -->
            <!-- ko if: $data.filter -->
            <th data-bind="template: { name: filter.template }"></th>
            <!-- /ko -->
            <!-- ko if: !$data.filter -->
            <th></th>
            <!-- /ko -->
            <!-- /ko -->
            <!-- ko if: $data.editor -->
            <th>
            </th>
            <!-- /ko -->
        </tr>
        <!-- /ko -->
        </thead>
        <tbody data-bind="foreach: $data.pager ? $data.pager.PageItems : FilteredItems">
        <!-- ko if: !$parent.editor || $parent.editor.edited() != $data -->
        <tr>
            <!-- ko foreach: $parent.columns -->
            <td data-bind="template: { name: cellTemplate, data: $parent }"></td>
            <!-- /ko -->
            <!-- ko if: $parent.editor -->
            <td data-bind="template: $parent.editor.options.bodyRightColumnTemplate || 'datagrid-body-right-column-template'"></td>
            <!-- /ko -->
        </tr>
        <!-- /ko -->
        <!-- ko if: $parent.editor && $parent.editor.edited() === $data -->
        <tr class="datagrid-editor">
            <!-- ko with: $parent.editor.editedTemp() -->
            <!-- ko foreach: $parents[1].columns -->
            <td data-bind="template: { name: $data.editable === false || $data.editable && typeof $data.editable == 'function' && $data.editable() === false ? cellTemplate : editorTemplate, data: $parent }"></td>
            <!-- /ko -->
            <!-- /ko -->
            <!-- ko if: $parent.editor -->
            <td>
                <button class="blue" data-bind="click: function() { $parent.editor.save(); }"><i class="icon-floppy"></i> <spring:message code="ui.save"/></button>
                <button class="blue" data-bind="click: function() { $parent.editor.cancel(); }"><spring:message code="ui.cancel"/></button>
            </td>
            <!-- /ko -->
        </tr>
        <!-- /ko -->
        </tbody>
        <!-- ko if: $data.pager && $data.pager.ItemsPerPage() < FilteredItems().length -->
        <tfoot>
        <tr>
            <td data-bind="attr: { colspan: columns.length + ($data.editor ? 1 : 0) }">
                <div class="datagrid-footer-bar">
                    <div>
                        <div style="text-align: left">
									    <span style="white-space: nowrap">
										    <span style="font-weight: bold">Всего: </span>
										    <span class="text-box" data-bind="text: FilteredItems().length"></span>
									    </span>
                        </div>
                        <!-- ko with: $data.pager -->
                        <div class="datagrid-page-links">
                            <button class="gray" data-bind="click: goToStartPage, disable: !CurrentPage()">&lt;&lt;</button>
                            <button class="gray" data-bind="click: goToLastPage, disable: !CurrentPage()">&lt;</button>
                            <!-- ko foreach: ko.utils.range(1, PagesCount()) -->
                            <button data-bind="text: $data, css: { gray: $parent.CurrentPage() != $index(), blue: $parent.CurrentPage() == $index() },
											    click: function() { $parent.setCurrentPage($index()); }"></button>
                            <!-- /ko -->
                            <button class="gray" data-bind="click: goToNextPage, disable: CurrentPage() >= (PagesCount() - 1)">&gt;</button>
                            <button class="gray" data-bind="click: goToEndPage, disable: CurrentPage() >= (PagesCount() - 1)">&gt;&gt;</button>
                        </div>
                        <div style="text-align: right">
									    <span style="white-space: nowrap">
										    <span style="font-weight: bold">На странице: </span>
										    <select data-bind="options: [5, 10, 20, 50], value: ItemsPerPage" style="width: 50px;"></select>
									    </span>
                        </div>
                        <!-- /ko -->
                    </div>
                </div>
            </td>
        </tr>
        </tfoot>
        <!-- /ko -->
    </table>
</script>