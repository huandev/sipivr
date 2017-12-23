<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<tiles:insertDefinition name="defaultTemplate">
    <tiles:putAttribute name="body">
        <jsp:include page="/jsp/sipclient.jsp"/>
        <jsp:include page="/jsp/sounds_partial.jsp"/>

        <script type="text/javascript">
            require(["knockout", "sound/SoundView", "app/ko.binding.fileDrop", "app/ko.binding.date"], function(ko, model){
                model.selectMode(false);

                $(function() {
                    ko.applyBindings(model, document.getElementById("sound-index"));
                });
            });
        </script>
    </tiles:putAttribute>
</tiles:insertDefinition>