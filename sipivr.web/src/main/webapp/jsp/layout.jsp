<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<!DOCTYPE html>
<html class="no-js">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />

        <title><tiles:insertAttribute name="title" ignore="true"/></title>

        <script type='text/javascript' src="<c:url value="/resources/js/libs/modernizr/modernizr.custom.js"/>"></script>

        <script type="text/javascript">
            var contextPath = "<c:url value="/"/>".replace(/;jsessionid=[0-9A-F]+/, "");
        </script>

        <link href="<c:url value="/resources/css/fontello/fontello.css"/>" rel="stylesheet" title="fontello">
        <link href="<c:url value="/resources/css/fontello/animation.css"/>" rel="stylesheet">

        <link href="<c:url value="/resources/css/style.css"/>" rel="stylesheet" />
        <link href="<c:url value="/resources/css/button.css"/>" rel="stylesheet" />
        <link href="<c:url value="/resources/css/datagrid.css"/>" rel="stylesheet" />

        <script type='text/javascript' src="<c:url value="/resources/js/libs/jquery/jquery-2.1.1.min.js"/>"></script>
        <script type='text/javascript' src="<c:url value="/resources/js/libs/require/require-2.1.15.js"/>"></script>
        <script type='text/javascript' src="<c:url value="/resources/js/view/layout.js"/>"></script>

        <sec:authorize access="isAuthenticated()">
            <script type='text/javascript' src="<c:url value="/resources/js/view/layout.auth.js"/>"></script>
            <script type='text/javascript' src="<c:url value="/resources/js/libs/jquery/notify.js"/>"></script>
        </sec:authorize>

        <noscript>
            <spring:message code="ui.browser.javascript"/>
        </noscript>
    </head>
    <body>
        <div class="wait modernizr-hide">
            <div class="overflow"></div>
            <i class="icon-spin2 animate-spin"></i>
        </div>

        <div class="modernizr-hide" style="position: absolute; width:100%; top:50px; bottom:0;">
            <tiles:insertAttribute name="body" />
        </div>

        <div class="modernizr-show" style="position: fixed; width:100%; top:50px; bottom:0; overflow-y: auto; padding: 20px; font-size: 16px;">
            <spring:message code="ui.browser.html5"/>
            <p><a href="https://www.google.com/chrome/browser/desktop/index.html" target="_blank">Google Chrome</a></p>
            <p><a href="https://www.mozilla.org/firefox/new/" target="_blank">Mozilla Firefox</a></p>
            <p><a href="http://windows.microsoft.com/en-us/internet-explorer/download-ie" target="_blank">Internet Explorer > 8</a></p>
            <p><a href="https://www.apple.com/safari/" target="_blank">Apple Safari</a></p>
            <p><a href="http://www.opera.com" target="_blank">Opera</a></p>
        </div>

        <div id="header" class="header">
            <ul class="left modernizr-hide">
                <li>
                    <a class="logo" href="${pageContext.request.contextPath}/">
                        <table>
                            <tr><td>S</td><td style="color:#009cde;font-weight: bold;">I</td><td>P</td></tr>
                            <tr><td></td><td>V</td><td></td></tr>
                            <tr><td></td><td>R</td><td></td></tr>
                        </table>
                    </a>
                </li>


                <sec:authorize access="isAuthenticated()">
                    <sec:authorize access="hasRole('ADMIN')">
                        <li><a href="${pageContext.request.contextPath}/users"><i class="icon-users-3"></i> <span class="short"><spring:message code="model.users"/></span></a></li>
                    </sec:authorize>
                    <li><a href="${pageContext.request.contextPath}/campaigns"><i class="icon-globe"></i> <span class="short"><spring:message code="model.campaigns"/></span></a></li>
                </sec:authorize>
                <c:forEach items="${pluginService.menuPlugins}" var="menuPlugin">
                    <c:forEach items="${menuPlugin.menus}" var="menu">
                        <li>
                            <a href="${menu.url == null ? "javascript:void(0);" : menu.url }">
                                <c:if test="${menu.icon != null}">
                                    <i class="${menu.icon}"></i> <span class="short">${menu.title}</span>
                                </c:if>
                                <c:if test="${menu.icon == null}">
                                    ${menu.title}
                                </c:if>
                                <c:if test="${not empty menu.children}">
                                    <span><i class="icon-down-dir"></i></span>
                                </c:if>
                            </a>
                            <ul>
                                <c:forEach items="${menu.children}" var="menu">
                                    <li><a href="${menu.url}">${menu.title}</a></li>
                                </c:forEach>
                            </ul>
                        </li>
                    </c:forEach>
                </c:forEach>
            </ul>

            <ul class="right">
                <c:forEach items="${pluginService.menuPlugins}" var="menuPlugin">
                    <c:forEach items="${menuPlugin.rightMenus}" var="menu">
                        <li>
                            <a href="${menu.url == null ? "javascript:void(0);" : menu.url }">
                                <c:if test="${menu.icon != null}">
                                    <i class="${menu.icon}"></i> <span class="short">${menu.title}</span>
                                </c:if>
                                <c:if test="${menu.icon == null}">
                                    ${menu.title}
                                </c:if>
                                <c:if test="${not empty menu.children}">
                                    <span><i class="icon-down-dir"></i></span>
                                </c:if>
                            </a>
                            <ul>
                                <c:forEach items="${menu.children}" var="menu">
                                    <li><a href="${menu.url}">${menu.title}</a></li>
                                </c:forEach>
                            </ul>
                        </li>
                    </c:forEach>
                </c:forEach>

                <sec:authorize access="isAuthenticated()">
                <li>
                    <a href="javascript:void(0);"><i class="icon-user-8"></i><span class="short"> ${pageContext.request.remoteUser}</span></a>

                    <ul>
                        <li><a href="javascript:void(0);" id="change-password-link"><spring:message code="model.user.password.change"/></a></li>
                        <li><a href="<c:url value="/auth/logout"/>"><spring:message code="ui.logout"/></a></li>
                    </ul>
                </li>
                </sec:authorize>
                <li>
                    <a href="javascript:void(0);"><spring:message code="language"/></a>

                    <ul>
                        <li><a href="?language=en"><spring:message code="language.en"/></a></li>
                        <li><a href="?language=ru"><spring:message code="language.ru"/></a></li>
                    </ul>
                </li>
            </ul>
        </div>

        <sec:authorize access="isAuthenticated()">
            <jsp:include page="/jsp/datagrid.jsp"/>
            <jsp:include page="/jsp/datepicker.jsp"/>
            <jsp:include page="/jsp/changePassword.jsp"/>
            <jsp:include page="/jsp/mediaPlayer.jsp"/>
        </sec:authorize>

        <c:forEach items="${pluginService.includePlugins}" var="plugin"><c:forEach items="${plugin.layoutIncludes}" var="item">
            <jsp:include page="/jsp${item}"/>
        </c:forEach></c:forEach>
    </body>
</html>