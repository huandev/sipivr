<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles" %>

<sec:authorize access="isAuthenticated()">
    <c:redirect url="/index"/>
</sec:authorize>

<sec:authorize access="!isAuthenticated()">
    <c:redirect url="/auth"/>
</sec:authorize>
