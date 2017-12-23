<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>

<tiles:insertDefinition name="defaultTemplate">
    <tiles:putAttribute name="body">
        <div style="position: absolute; width:600px; height: 250px; top:50%; margin-top: -150px; left: 50%; margin-left:-300px;">
            <div style="position: absolute; font-size: 160px;">
                <i class="icon-flash" style="color:#ffd000; position: absolute; font-size: 0.6em; top:130px; left:45px;"></i>
                <i class="icon-cloud" style="color:#999999; position: absolute; font-size: 0.8em; left:60px; top:-5px;"></i>
                <i class="icon-cloud" style="color:#009cde; position: absolute;"></i>
            </div>

            <div style="position: absolute; right:0; top:20px; width:350px; color:#999;">
                <p style="font-size: 48px; font-weight: bold; "><spring:message code="ui.error"/> ${code}</p>
                <br>
                <p style="font-size: 32px;">${message}</p>
            </div>
        </div>
    </tiles:putAttribute>
</tiles:insertDefinition>