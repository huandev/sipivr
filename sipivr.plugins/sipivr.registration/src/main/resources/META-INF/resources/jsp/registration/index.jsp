<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<tiles:insertDefinition name="defaultTemplate">
    <tiles:putAttribute name="body">
        <style>
            #registration-index { width:180px; top:200px; margin-left:-75px;
                border:2px solid #999; border-radius: 5px; }
            #registration-index h3 {color:#fff; text-align: center;}
            #registration-index * {margin: 10px 0 0 10px; }
            #registration-index img { width:160px; cursor: pointer; }
            #registration-index input { width:150px; }
            #registration-index button {height: 30px; margin-bottom: 10px;  width:158px; }
        </style>

        <div class="overflow"></div>

        <form class="gray" method="post" action="/registration/save" id="registration-index">
            <h3>Registration</h3>
            <input type="text" name="name" data-bind="value:name, validate: { pattern: '<spring:message code="model.user.name.pattern" javaScriptEscape="true"/>'}, hint: '<spring:message code="model.user.name.hint"/>'" placeholder="<spring:message code="model.user.name"/>"/>
            <input type="text" name="email" data-bind="value:email, validate: { required: true }" placeholder="e-mail"/>
            <input type="password" name="password" data-bind="value: password, validate: { pattern: '<spring:message code="model.user.password.pattern"/>'}, hint: '<spring:message code="model.user.password.hint"/>'" placeholder="<spring:message code="model.user.password"/>"/>

            <img id="captcha" src="/captcha" onclick="document.getElementById('captcha').src='/captcha#' + (new Date()).valueOf()" title="Refresh"/>
            <input type="text" name="answer" autocomplete="off" data-bind="validate: { required: true }" placeholder="security code"/>

            <button type="submit" class="blue"><spring:message code="ui.save"/></button>
        </form>

        <script type="text/javascript">
            $(function(){
                require(["knockout", "app/ko.binding.validate", "app/ko.binding.hint"], function(ko){
                    var model = ko.validateObservable({
                        name: ko.validateObservable(),
                        email: ko.validateObservable(),
                        password: ko.validateObservable()
                    });
                    ko.applyBindings(model(), document.getElementById("#registration-index"));

                    $("button[type='submit']").click(function(){
                        if(!model.isValid()){
                            return false;
                        }
                    });
                });
            });
        </script>
    </tiles:putAttribute>
</tiles:insertDefinition>