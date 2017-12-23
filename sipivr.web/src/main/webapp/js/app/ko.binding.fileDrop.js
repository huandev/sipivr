define(["knockout", "utils/DOM"], function(ko, DOM) {
    ko.bindingHandlers.fileDrop = {
        init: function(element, valueAccessor, allBindings, viewModel)
        {
            var self = this;

            var formId = valueAccessor();
            var formElement = document.getElementById(formId);
            formElement.style.display = "none";

            DOM.attachEvent(element, "dragover", function () {
                formElement.style.display = "block";
                return false;
            });

            DOM.attachEvent(formElement, "dragleave", function () {
                formElement.style.display = "none";
                return false;
            });

            DOM.attachEvent(formElement, "drop", function (e) {
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }
                formElement.style.display = "none";

                allBindings.get("fileDropHandler").call(viewModel, e.dataTransfer.files);
            });
        }
    };
});