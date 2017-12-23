<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>

<tiles:insertDefinition name="defaultTemplate">
    <tiles:putAttribute name="body">
        <style>
            .videoWrapper {
                position: relative;
                padding-bottom: 50%; /* 16:9 */
                padding-top: 25px;
                height: 0;
            }
            .videoWrapper img, .videoWrapper iframe {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                cursor: pointer;
            }
        </style>
        <div style="width:80%; margin: 20px auto;">
            <div class="videoWrapper">
                <iframe width="640" height="360" src="https://www.youtube.com/embed/BGIrc9PPLF8?autoplay=1" frameborder="0" allowfullscreen></iframe>
            </div>
        </div>
    </tiles:putAttribute>
</tiles:insertDefinition>