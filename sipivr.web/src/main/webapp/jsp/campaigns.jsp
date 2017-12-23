<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles" %>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>

<tiles:insertDefinition name="defaultTemplate">
    <tiles:putAttribute name="body">
        <jsp:include page="/jsp/sipclient.jsp"/>

        <script type="text/html" id="admin-campaigns-datagrid-body-right-column-template">
            <button class="link" data-bind="click: function() { document.location = '<c:url value="/scheme/"/>' + $data.id; }"
                    style="font-weight: bold; font-size:1.1em;">IVR</button>

            <button class="link" data-bind="click: function() { $parent.editor.edit($data); }"><i class="icon-edit"></i> <spring:message code="ui.edit"/></button>

            <!-- ko with: $root.sipclient -->
            <!-- ko if: connected -->

            <!-- ko if: currentCall() && currentCall().number == $parent.number -->
            <button class="red" data-bind="click: function() { currentCall().session.terminate(); }"><span data-bind="text: currentCall().duration"></span> <i class="icon-phone"></i></button>
            <!-- /ko -->
            <!-- ko if: !currentCall() || currentCall().number != $parent.number -->
            <button class="green" data-bind="enable: connected() && !currentCall(), click: function() { $data.makeCall($parent.number); }">Call <i class="icon-phone"></i></button>
            <!-- /ko -->

            <!-- /ko -->
            <!-- /ko -->
        </script>

        <div class="content table-border" id="admin-campaigns" style="display: none;" data-bind="visible: $data, template: 'datagrid-template'"></div>

        <script type="text/javascript">
            require(["knockout", "widgets/sipclient", "messages", "controller/api", "DataGrid", "DataGrid.Editor", "DataGrid.Editor.Validate", "DataGrid.Pager", "app/ko.binding.hint"],
                    function(ko, sipclient, messages, api, DataGrid, DataGridEditor) {
                        var users = ko.observableArray();
                        api.users(users);

                        var model = new DataGrid([
                            {
                                key: "createDate",
                                title: messages["model.campaign.createDate"],
                                width: 200,
                                editable: false,
                                defaultValue: null
                            },
                            {
                                key: "ownerId",
                                title: messages["model.campaign.owner"],
                                width: 200,
                                editable: false,
                                defaultValue: 0,
                                options: users,
                                optionsValue: 'id',
                                optionsText: 'name'
                            },
                            {
                                key: "name",
                                title: messages["model.campaign.name"],
                                width: 300,
                                validate: {pattern: '^.+$'}
                            },
                            {
                                key: "number",
                                title: messages["model.campaign.number"],
                                width: 120,
                                validate: {pattern: '^.+$'}
                            }
                        ], {
                            modelKey: "id",
                            editor: {
                                save: api.saveCampaign,
                                bodyRightColumnTemplate: 'admin-campaigns-datagrid-body-right-column-template'
                            }
                        });

                        model.sipclient = sipclient;
                        model.sipclient.currentCall.subscribe(function (newValue) {
                            model.sipclient.visible(true);
                        });

                        $(function () {
                            ko.applyBindings(model, document.getElementById("admin-campaigns"));
                        });
                        api.campaigns(function (data) {
                            model.load(data);
                        });
                    });
        </script>
    </tiles:putAttribute>
</tiles:insertDefinition>