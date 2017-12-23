define(['utils/DOM'], function(DOM){
    function Drag(ui, options) {
        this.ui = ui;
        this.options = options;

        this.init();
    }

    Drag.prototype.init = function() {
        var self = this;

        DOM.attachEvent(self.ui, "mousedown", function(e) {
            e.preventDefault();

            //if (e.stopPropagation) {
            //    e.stopPropagation();
            //} else {
            //    e.returnValue = false;
            //}

            self.start(e);
        });
    }

    Drag.prototype.start = function(e) {
        var self = this;

        self.Position = {x: e.clientX, y: e.clientY};
        self.StartPosition = {x: e.clientX, y: e.clientY};

        this.mouseMoveEventHandler = function(e) {
            if (self.options.move)
                self.options.move.call(self, self.getData(e));

            self.Position = {x: e.clientX, y: e.clientY};
        };

        this.mouseUpEventHandler = function(e) {
            if (self.options.stop)
                self.options.stop.call(self, self.getData(e));

            self.stop(e);
        };   

        DOM.attachEvent(document, "mousemove", this.mouseMoveEventHandler);
        DOM.attachEvent(document, "mouseup", this.mouseUpEventHandler );

        if (self.options.start)
            self.options.start.call(self, self.getData(e));
    }

    Drag.prototype.stop = function(){
        DOM.detachEvent(document, "mousemove", this.mouseMoveEventHandler);
        DOM.detachEvent(document, "mouseup", this.mouseUpEventHandler );
    }

    Drag.prototype.getData = function (e) {
        return {
            x: e.clientX,
            y: e.clientY,
            dx: e.clientX - this.Position.x,
            dy: e.clientY - this.Position.y,
            kx: e.clientX - this.StartPosition.x,
            ky: e.clientY - this.StartPosition.y,
            sx: this.StartPosition.x,
            sy: this.StartPosition.y,
            event: e
        };
    }
    
    return Drag;
});