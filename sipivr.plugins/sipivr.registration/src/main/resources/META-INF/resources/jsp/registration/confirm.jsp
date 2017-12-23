<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<tiles:insertDefinition name="defaultTemplate">
    <tiles:putAttribute name="body">
        <h4 style="text-align: center; margin-top: 10px;">
            Отлично! <a href="${pageContext.request.contextPath}/auth">Перейти на страницу авторизации</a>
        </h4>
    </tiles:putAttribute>
</tiles:insertDefinition>