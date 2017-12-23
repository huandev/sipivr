define(["knockout", "utils/DOM"], function(ko, DOM) {
    ko.bindingHandlers.hint = {
        init: function(element, valueAccessor, allBindings, viewModel)
        {
            var hint = valueAccessor();

            if(hint) {
                var popup = null;

                if (!$(element).is("input") && !$(element).is("select")) {
                    $(element).attr("tabindex", $(element).attr("tabindex") || 1000);
                }

                DOM.attachEvent(element, "focus", function (e) {
                    if (!popup) {
                        var parent = $(element).parent();
                        popup = $("<div class=\"hint\"></div>").html(hint).appendTo("body");
                        popup.offset({
                            top: $(element).offset().top - popup.height() - 5,
                            left: $(element).offset().left + $(element).width() - 5
                        });
                    }

                    popup.fadeIn();
                });

                DOM.attachEvent(element, "blur", function (e) {
                    popup.fadeOut();
                });
            }
        }
    };
});