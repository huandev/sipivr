<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<style>
    #change-password-form { width:200px; top:200px; margin-left:-100px; border:2px solid #999; border-radius: 5px; }
    #change-password-form h4 { color:#fff; text-align: center; }
    #change-password-form > * {width:170px; margin: 10px 0 0 10px;}
    #change-password-form > button {height: 30px; margin-bottom: 10px;  width:85px; }
    #change-password-form > button:last-child {margin-left: 5px; }
</style>

<div id="change-password-dialog" style="display: none;">
    <div class="overflow"></div>
    <div id="change-password-form" class="gray">
        <h4><spring:message code="model.user.password.change"/></h4>
        <input autocomplete="off" type="password" data-bind="value: oldPassword, validate: { required: true }" placeholder="old password"/>
        <input autocomplete="off" type="text" data-bind="value: newPassword, validate: { pattern: '<spring:message code="model.user.password.pattern"/>'}, hint: '<spring:message code="model.user.password.hint"/>'" placeholder="new password"/>
        <div style="margin-top: 2px; text-align: right;">
            <a class="shadow" style="text-transform:lowercase;" href="javascript:void(0)" data-bind="click: function() { newPassword($root.generate()); }"><spring:message code="ui.random"/></a>
        </div>

        <button type="button" class="blue" data-bind="click: save"><spring:message code="ui.save"/></button>
        <button type="button" class="blue" data-bind="click: cancel"><spring:message code="ui.cancel"/></button>
    </div>
</div>

<script type="text/javascript">
    require(["knockout", "controller/api", "utils/PasswordGenerator", "knockout.binding.validate", "app/ko.binding.hint"], function (ko, api, PasswordGenerator) {
        var model = {
            newPassword: ko.validateObservable(),
            oldPassword: ko.validateObservable(),
            save: function () {
                if (this.newPassword.isValid()) {
                    api.changePassword(this.newPassword(), this.oldPassword(), function () {
                        $("#change-password-dialog").hide();
                        model.newPassword(null);
                        model.oldPassword(null);
                    });
                }
            },
            cancel: function () {
                $("#change-password-dialog").hide();
                this.newPassword(null);
                this.oldPassword(null);
            },
            generate: PasswordGenerator.generate
        };
        $(function () {
            ko.applyBindings(model, document.getElementById("change-password-dialog"));

            $("#change-password-link").click(function () {
                $("#change-password-dialog").show();
            });
        });
    });
</script>