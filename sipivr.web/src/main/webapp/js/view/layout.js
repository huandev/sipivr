function extend(Child, Parent) {
    var F = function () { };
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    Child.superclass = Parent.prototype;
}

require.config({
    baseUrl: contextPath + "resources/js/",
    paths: {
        text: "libs/require/text",
        domReady: 'libs/require/domReady',
        jquery: "libs/jquery/jquery-2.1.1.min",
        knockout: "libs/knockout/knockout-3.2.0",
        "knockout.mapping": "libs/knockout/knockout.mapping",
        "knockout.binding.validate": "app/ko.binding.validate",

        messages: '../../messages',

        "DataGrid": "widgets/DataGrid/DataGrid",
        "DataGrid.Editor": "widgets/DataGrid/DataGrid.Editor",
        "DataGrid.Editor.Validate": "widgets/DataGrid/DataGrid.Editor.Validate",
        "DataGrid.Pager": "widgets/DataGrid/DataGrid.Pager"
    }
});

require(["domReady"],
    function (domReady) {
        domReady(function () {
            var waitDialog = $(".wait");
            var requestCount = 0;

            $(window).unload(function () {
                waitDialog.css({display: "block"});
            });

            setTimeout(function () {
                if (!requestCount) {
                    waitDialog.css({display: "none"});
                }
            }, 500);

            require(["messages"], function (messages) {
                $.ajaxSetup({
                    cache: false,
                    beforeSend: function () {
                        if (this.wait !== false) {
                            if (!requestCount)
                                waitDialog.css({display: "block"});
                        }
                        requestCount++;
                    },
                    complete: function () {
                        requestCount--;

                        if (!requestCount) {
                            waitDialog.css({display: "none"});
                        }

                        //console.log(requestCount + " " + arguments[1].url);
                    },
                    error: function (e) {
                        $.notify(messages["ui.error"] + ". " + (e.responseText || e.message), { className: "error", position: "right bottom" });
                    },
                    statusCode: {
                        401: function () {
                            document.location = contextPath + "auth/logout";
                        },
                        404: function () {
                           // document.location = contextPath + "auth/login";

                            //$("a[href='/j_spring_security_logout']").click();
                        }
                    }
                });
            });
        });
    });