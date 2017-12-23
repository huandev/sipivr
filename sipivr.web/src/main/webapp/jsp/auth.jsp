<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>

<tiles:insertDefinition name="defaultTemplate">
    <tiles:putAttribute name="body">
        <div id="auth-login" style="margin:30px auto;width: 240px;">
            <c:if test="${error != null}">
            <p style="text-align: center; padding: 4px;"><span class="error shadow">${error}</span></p>
            </c:if>

            <form method="post" action="/auth/login">
                <table class="table" style="width:100%; border: 1px solid #e6e6e6;">
                    <tr>
                        <td style="padding-left:12px;"><spring:message code="ui.login.username"/></td>
                        <td><input type="text" name="username" data-bind="validate: { required: true }"/></td>
                    </tr>
                    <tr>
                        <td style="padding-left:12px;"><spring:message code="ui.login.password"/></td>
                        <td><input type="password" name="password" data-bind="validate: { required: true }"/></td>
                    </tr>
                    <c:if test="${captcha == true}">
                        <tr>
                            <td colspan="2" style="text-align: center; border-top: 1px solid #e6e6e6;">
                                <p style="font-size: 0.8em; text-align: right;">
                                    <a href="javascript:void(0);" onclick="document.getElementById('captcha').src='/captcha#' + (new Date()).valueOf()">Обновить</a>
                                </p>
                                <img id="captcha" src="/captcha" style="width:95%;"/>
                                <p style="font-size: 0.9em; padding: 3px;"><spring:message code="ui.login.captcha"/></p>
                                <input type="text" name="answer"  autocomplete="off" data-bind="validate: { required: true }"/>
                            </td>
                        </tr>
                    </c:if>
                    <tr>
                        <td colspan="2" style="text-align: center; border-top: 1px solid #e6e6e6;">
                            <button class="blue" type="submit" style="width:95%;"><spring:message code="ui.login"/> <i class="icon-login"></i></button>
                        </td>
                    </tr>
                </table>
            </form>
        </div>

        <%--<script type="text/javascript">--%>
            <%--require(["knockout", "app/ko.binding.hint"], function (ko) {--%>
                <%--ko.applyBindings({}, document.getElementById("auth-login"));--%>
            <%--});--%>
        <%--</script>--%>
    </tiles:putAttribute>
</tiles:insertDefinition>