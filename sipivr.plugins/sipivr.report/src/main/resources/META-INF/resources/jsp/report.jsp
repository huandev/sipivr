<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>

<tiles:insertDefinition name="defaultTemplate">
    <tiles:putAttribute name="body">
        <div class="content" id="ivr-report" style="display: none;" data-bind="visible: $data">
            <h2><spring:message code="ru.sipivr.report.reports"/></h2>

            <table class="table">
                <tr>
                    <td><spring:message code="ru.sipivr.report.from"/></td>
                    <td><input type="text" data-bind="value: from, date: 'yyyy-MM-dd'"/></td>
                    <td><spring:message code="ru.sipivr.report.to"/></td>
                    <td><input type="text" data-bind="value: to, date: 'yyyy-MM-dd'"/></td>
                    <td>
                        <a href="#" data-bind="attr: { href: contextPath + 'api/report?from='+from()+'&to='+to() }">
                            <button class="blue"><spring:message code="ui.download"/></button>
                        </a>
                    </td>
                </tr>
            </table>
        </div>
        <script type="text/javascript">
            require(["knockout", "utils/lang/date", "app/ko.binding.date"], function(ko, langDate) {
                function ViewModel() {
                    this.from = ko.observable(langDate.format(new Date(), "yyyy-MM-dd"));
                    this.to = ko.observable(langDate.format(new Date(), "yyyy-MM-dd"));
                }

                var model = new ViewModel();
                ko.applyBindings(model, document.getElementById("ivr-report"));
            });
        </script>
    </tiles:putAttribute>
</tiles:insertDefinition>