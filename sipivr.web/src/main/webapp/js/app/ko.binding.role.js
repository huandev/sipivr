define(["knockout", "app/enums", "messages"], function(ko, enums, messages) {
    ko.bindingHandlers.role = {
        hasAnyRole: function(role) {
            for (var i = 1; i < arguments.length; i++) {
                var value = enums.userRole[arguments[i]];
                if ((role % (value * 2)) >= value) {
                    return true;
                }
            }
            return false;
        },
        init: function (element, valueAccessor, allBindings) {
            var roleValue = allBindings.get("roleValue");
            var value = enums.userRole[roleValue];

            if ($(element).is(":checkbox") === true) {
                $(element).change(function () {
                    var role = valueAccessor()();

                    if(ko.bindingHandlers.role.hasAnyRole(role, roleValue))
                    {
                        valueAccessor()(role * 1 - value);
                    }
                    else
                    {
                        valueAccessor()(role * 1 + value);
                    }
                });
            }

        },
        update: function (element, valueAccessor, allBindings) {
            var v = ko.utils.unwrapObservable(valueAccessor());

            if ($(element).is(":checkbox") === true) {
                var roleValue = allBindings.get("roleValue");
                var value = enums.userRole[roleValue];

                $(element).prop("checked", (v % (value * 2)) >= value);
            }
            else {
                var text = "";
                for (var key in enums.userRole) {
                    if (ko.bindingHandlers.role.hasAnyRole(v, key)) {
                        if (text) {
                            text += ", ";
                        }
                        text += messages["model.user.role." + key.toLowerCase()];
                    }
                }

                $(element).text(text)
            }
        }
    };
});