define(["knockout", "utils/Drag"], function(ko, Drag){
    function Splitter(options) {
        this.options = options;

        this.left = ko.observable(options.left);
        this.width = ko.observable(options.width);
        this.right = ko.computed(function()
        {
            return this.left() + this.width();
        }, this);
    }

    Splitter.prototype.init = function(ui) {
        var self = this;

        this.ui = ui;

        this.drag = new Drag(ui, {
            move: function(data)
            {
                var newLeft = self.left() + data.dx;

                if(self.options.min && newLeft < self.options.min){
                    newLeft = self.options.min;
                }

                if(self.options.max && newLeft > self.options.max){
                    newLeft = self.options.max;
                }

                self.left(newLeft);
            }
        });
    }
    
    return Splitter;
});