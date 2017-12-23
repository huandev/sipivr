define(["knockout"], function(ko) {
    ko.bindingHandlers.enums = {
        contains: function(value, enumValue) {
            var values = value ? value.split(",") : [];
            for (var i = 0; i < values.length; i++) {
                if(values[i] == enumValue){
                    return true;
                }
            }
            return false;
        },
        toStringValue: function(value, enums){
            var text = "";
            for (var key in enums) {
                if (ko.bindingHandlers.enums.contains(value, key)) {
                    text = text ? text + "," + enums[key.toString()] : enums[key.toString()];
                }
            }
            return text;
        },
        init: function (element, valueAccessor, allBindings) {
            var enumValue = allBindings.get("enum");
            var value = allBindings.get("value");
            var enums = allBindings.get("enums");

            if ($(element).is(":checkbox") === true) {
                $(element).change(function () {
                    var res = null;
                    for(var key in enums){
                        if (key != enumValue && ko.bindingHandlers.enums.contains(value(), key) || (key == enumValue && $(element).prop("checked"))) {
                            res = res ? res + "," + key.toString() : key.toString();
                        }
                    }
                    value(res);
                });
            }
        },
        update: function (element, valueAccessor, allBindings) {
            var enumValue = allBindings.get("enum");
            var value = allBindings.get("value")();
            var enums = allBindings.get("enums");

            if ($(element).is(":checkbox") === true) {
                $(element).prop("checked", ko.bindingHandlers.enums.contains(value, enumValue));
            }
            else {
                $(element).text(ko.bindingHandlers.enums.toStringValue(value, enums));
            }
        }
    };

    return ko.bindingHandlers.enums;
});