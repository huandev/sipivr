<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles"  %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<tiles:insertDefinition name="defaultTemplate">
    <tiles:putAttribute name="body">
        <style>
            #admin-users td {vertical-align: top;}
        </style>

        <div class="content table-border" id="admin-users" style="display: none;" data-bind="visible: $data, template: 'datagrid-template'"></div>

        <script type="text/html" id="role-template">
            <span data-bind="role: role"></span>
        </script>

        <script type="text/html" id="role-editor-template">
            <spring:message code="model.user.role.manager"/> <input type="checkbox" data-bind="role: role, roleValue: 'MANAGER'"/>
            <spring:message code="model.user.role.admin"/> <input type="checkbox" data-bind="role: role, roleValue: 'ADMIN', disable: name() == 'admin'"/>
        </script>

        <script type="text/html" id="password-template">
            <span style="font-size: 1.4em; line-height: 14px;">&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;</span>
        </script>
        <script type="text/html" id="password-editor-template">
            <input type="text" data-bind="value: $data[$parent.key], validate: $parent.validate, hint: $parent.hint"/>
            <a class="shadow" style="text-transform:lowercase;" href="javascript:void(0)" data-bind="click: function() { $data[$parent.key]($parent.generate()); }"><spring:message code="ui.random"/></a>
        </script>

        <script type="text/javascript">
            require(["knockout", "messages", "controller/api", "utils/PasswordGenerator", "DataGrid", "DataGrid.Editor", "DataGrid.Editor.Validate", "DataGrid.Pager", "app/ko.binding.hint", "app/ko.binding.role"],
                    function(ko, messages, api, PasswordGenerator, DataGrid, DataGridEditor){
                        var model = new DataGrid([
                            {
                                key: "name",
                                title: messages["model.user.name"],
                                width: 120,
                                validate: { pattern: messages["model.user.name.pattern"] },
                                hint: messages["model.user.name.hint"],
                                editable: function() { return false; }
                            },
                            {
                                key: "newPassword",
                                title: messages["model.user.password"],
                                width: 150,
                                validate: { pattern: "(" + messages['model.user.password.pattern'] + ")|(^[*]{8}$)" },
                                hint: messages["model.user.password.hint"],
                                cellTemplate: "password-template",
                                editorTemplate: "password-editor-template",
                                generate: PasswordGenerator.generate
                            },
                            {
                                key: "role",
                                title: messages["model.user.role"],
                                width: 320,
                                defaultValue: 1,
                                cellTemplate: "role-template",
                                editorTemplate: "role-editor-template"
                            }
                        ], {
                            modelKey: "id",
                            editor: {
                                save: api.saveUser
                            }
                        });

                        $(function() {
                            ko.applyBindings(model, document.getElementById("admin-users"));
                        });
                        api.users(function(data){
                            model.load(data);
                        });
                    });
        </script>
    </tiles:putAttribute>
</tiles:insertDefinition>