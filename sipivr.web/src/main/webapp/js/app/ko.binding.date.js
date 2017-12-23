define(["knockout", "utils/lang/date", "widgets/datepicker",  "widgets/datetimepicker", "utils/DOM"], function(ko, langDate, DatePicker, DateTimePicker, DOM) {
    ko.bindingHandlers.date = {
        init: function(element, valueAccessor, allBindings)
        {
            var $element = $(element);

            if ($element.is("input")) {
                var dateFormat = allBindings.get('date') || "yyyy-MM-dd hh:mm:ss.fff";

                var datepicker = dateFormat.indexOf("hh") >= 0 ? new DateTimePicker() : new DatePicker();

                function h() {
                    datepicker.hide();
                }

                datepicker.visible.subscribe(function(newValue){
                    if(newValue) {
                        DOM.attachEvent(document, "mousedown", h);
                    } else {
                        DOM.detachEvent(document, "mousedown", h);
                    }
                });

                ko.applyBindings(datepicker, $("<div data-bind=\"template: 'datepicker-template'\"></div>").appendTo("body")[0]);


                datepicker.onchange = function (date, e) {
                    allBindings.get("value")(langDate.format(date, dateFormat));
                };

                $element.click(function (e) {
                    datepicker.setValue(langDate.parse($(this).val(), dateFormat) || new Date());
                    datepicker.show($element.offset().top + $element.outerHeight(), $element.offset().left);
                });
            }
        },
        update: function(element, valueAccessor, allBindings) {
            var dateFormat = allBindings.get('date') || "yyyy-MM-dd hh:mm:ss.fff";
            var value = ko.utils.unwrapObservable(allBindings.get("value") || allBindings.get("text"));

            var $element = $(element);

            if (value !== null && value !== undefined) {
                var output = langDate.format(value instanceof Date ? value : langDate.parse(value, dateFormat), dateFormat);

                if ($element.is("input") === true) {
                    $element.val(output);
                } else {
                    $element.text(output);
                }
            }
            else
            {
                if ($element.is("input") === true) {
                    $element.val("");
                } else {
                    $element.text("");
                }
            }
        }
    };
});