define (function(){

    var DOM = {
        attachEvent: function(ui, name, handler) {
            if (ui.attachEvent) //if IE (and Opera depending on user setting)
                ui.attachEvent("on" + name, handler);
            else if (ui.addEventListener) { //WC3 browsers
                ui.addEventListener(name, handler, false);
            }
        },
        detachEvent: function(ui, name, handler) {
            if (ui.detachEvent) //if IE (and Opera depending on user setting)
                ui.detachEvent("on" + name, handler);
            else if (ui.removeEventListener) //WC3 browsers
                ui.removeEventListener(name, handler, false)
        },
        droppable: function(ui, callback) {
            DOM.attachEvent(ui, "mouseup", callback);

            var documentMouseUpEventHandler = function() {
                DOM.detachEvent(ui, "mouseup", callback);
                DOM.detachEvent(document, "mouseup", documentMouseUpEventHandler);
            };

            DOM.attachEvent(document, "mouseup", documentMouseUpEventHandler);
        },
        scrollable: function(ui, callback) {
            function mouseWheelHandler(e) {
                var delta = (e.wheelDelta ? e.wheelDelta / -40 : 0) || e.deltaY || e.detail || 0;
                
                callback(e, delta);
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }
            }

            DOM.attachEvent(ui, (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel", mouseWheelHandler); //FF doesn't recognize mousewheel as of FF3.x
        },
        addClass: function(ui, name) {
            DOM.removeClass(ui, name);
            ui.setAttribute("class", ui.getAttribute("class") + " " + name);
        },
        removeClass: function(ui, name) {
            if(ui.getAttribute("class"))
                ui.setAttribute("class", ui.getAttribute("class").replace(name,""));
        }
    };
    
    return DOM;
});