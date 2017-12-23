<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<style>
    .datepicker { position: fixed; z-index: 99; background: #333; color: #e0e0e0;  }
    .datepicker  td { border: 1px solid #666; padding: 5px; text-align: center; cursor:pointer; }
    .datepicker th {cursor:pointer;}
    .datepicker  td:hover { color:#fff; }
    .datepicker .weekDays td { height: 24px; padding:0 5px; text-transform:uppercase; border:none; }
    .datepicker input, .datepicker select { width:50px; margin: 2px; }
</style>

<script type="text/html" id="datepicker-template">
    <div tabindex="-1" class="datepicker" style="display: none;" data-bind="event: { mousedown: function(el, event) { event.stopPropagation(); return true; } }, visible: visible, style: { left: left() + 'px', top: top() + 'px' }">
        <table>
            <thead>
            <tr>
                <th data-bind="click: prevMonth">&#9668;</th>
                <th colspan="5" data-bind="text: months[month()] + ' ' + year()"></th>
                <th data-bind="click: nextMonth">&#9658;</th>
            </tr>
            <tr class="weekDays">
                <!-- ko foreach: weekDays -->
                <td data-bind="text: $data" class="disabled"></td>
                <!-- /ko -->
            </tr>
            </thead>
            <tbody>
            <!-- ko foreach: weeks -->
            <tr data-bind="template: { name: $parent.cellTemplate || 'datepicker-cell-template', foreach: $data }">
            </tr>
            <!-- /ko -->
            </tbody>
            <!-- ko if: $data.timepicker && $data.timepicker() -->
            <tfoot>
            <tr>
                <th colspan="7">
                    <select data-bind="value: hour, options: hourOptions"></select>
                    <select data-bind="value: minute, options: minuteOptions"></select>
                </th>
            </tr>
            </tfoot>
            <!-- /ko -->
        </table>
    </div>
</script>

<script type="text/html" id="datepicker-cell-template">
    <td data-bind="text: getDate(), click: function() { $parents[1].select($data); }, css: { 'blue': valueOf() == $parents[1].value().valueOf() }"></td>
</script>