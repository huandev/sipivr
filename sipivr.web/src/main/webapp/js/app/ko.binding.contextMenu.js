define(["knockout", "utils/DOM"], function(ko, DOM) {
    function ContextMenu()
    {
        this.items = ko.observableArray();

        this.position = ko.observable({x: 0, y: 0});
        this.visible = ko.observable(false);
    }

    ContextMenu.prototype.click = function(item){
        var self = this;
        item.click(function(){
            self.visible(false);
        });
    }

    var contextMenus = {};

    ko.bindingHandlers.contextMenu = {
        init: function(element, valueAccessor, allBindings)
        {
            var contextMenuId = valueAccessor();
            var contextMenuElement = document.getElementById(contextMenuId);

            var contextMenu = contextMenus[contextMenuId];
            if(!contextMenu)
            {
                contextMenu = new ContextMenu();
                contextMenus[contextMenuId] = contextMenu;
                ko.applyBindings(contextMenu, contextMenuElement);
            }

            DOM.attachEvent(element, "contextmenu", function(e) {
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }
            });

            DOM.attachEvent(contextMenuElement, "contextmenu", function(e) {
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }
            });

            DOM.attachEvent(contextMenuElement, "mousedown", function(e) {
                e.stopPropagation();
            });

            DOM.attachEvent(element, "mouseup", function(e){
                if(e.button == 2 ){
                    e.stopPropagation();
                    contextMenu.items(allBindings.get("contextMenuItems")());
                    contextMenu.position({x: e.clientX, y: e.clientY });
                    contextMenu.visible(true);
                }
            });

            DOM.attachEvent(document, "mousedown", function(){
                contextMenu.visible(false);
            });
        }
    };
});