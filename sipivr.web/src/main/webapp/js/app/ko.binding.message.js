define(["knockout", "messages"], function(ko, messages) {
    ko.bindingHandlers.message = {
        init: function (element, valueAccessor, allBindings) {
            var value = valueAccessor();
            $(element).text(messages[ko.isObservable(value) ? value() : value]);
        }
    };
});