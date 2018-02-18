define(["knockout", "utils/DOM"], function(ko, DOM) {
    ko.bindingHandlers.fileDrop = {
        init: function(element, valueAccessor, allBindings, viewModel)
        {
            var data = valueAccessor();

            DOM.attachEvent(element, "dragover", function () {
                $(element).addClass("drag");
                return false;
            });

            DOM.attachEvent(element, "dragleave", function () {
                $(element).removeClass("drag");
                return false;
            });

            DOM.attachEvent(element, "drop", function (e) {
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }
                $(element).removeClass("drag");

                console.log(e.dataTransfer.files);
                data.handler.call(viewModel, e.dataTransfer.files);
            });

            if ($("input[type=file]", element).length) {
                DOM.attachEvent($("input[type=file]", element)[0], "change", function (e) {
                    $(element).removeClass("drag");

                    console.log(e.target.files);
                    data.handler.call(viewModel, e.target.files);
                });
            }
        }
    };
});