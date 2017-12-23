require(["domReady"],
    function (domReady) {
        domReady(function(){
            var match = document.URL.match("^(https?)://([a-zA-Z0-9.-]+)(:(\\d+))?" + contextPath + "((\\w+)(/\\w+)?)");
            if(match){
                var activeLink = (contextPath + match[5]).replace(/[es]{1,2}$/, "");
                $("#header > ul > li").has("a[href^='" + activeLink +"']").eq(0).addClass("active");
            }
        });

        domReady(function() {
            var widths = [];

            var menus = $(">ul>li", document.getElementById("header"));
            menus.each(function(){
                widths.push($(this).width());
            });

            function getWidthTo(index) {
                var res = 0;
                for (var i = 0; i <= index; i++) {
                    res += widths[i];
                }
                return res;
            }

            var minWidth = 0;

            function resize() {
                var width = window.innerWidth;
                for (var i = widths.length - 1 ; i >= 0; i--) {
                    if(getWidthTo(i) > width)
                    {
                        menus.eq(i).addClass("short");
                        width -= menus.eq(i).width();

                        if(!i && !minWidth){
                            menus.each(function(){
                                minWidth += $(this).width();
                            });

                            console.log("min-width: %s", minWidth)
                            $("html, .header").css("min-width", minWidth + "px");
                        }
                    } else {
                        menus.eq(i).removeClass("short");
                    }
                }
            }

            $(window).resize(resize);

            resize();
        });
    });