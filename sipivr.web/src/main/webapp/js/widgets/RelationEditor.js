define(["knockout"], function(ko) {
    function RelationEditor(options)
    {
        this.options = options;

        this.items = ko.observableArray();
        this.keys = ko.observableArray();

        this.leftKey = ko.observable();
        this.rightKey = ko.observable();

        this.leftItems = ko.computed(function()
        {
            var self = this;

            return ko.utils.arrayFilter(this.items(), function(item)
            {
                return self.keys.indexOf(item[self.options.key]) < 0;
            });
        }, this);

        this.rightItems = ko.computed(function()
        {
            var self = this;

            return ko.utils.arrayFilter(this.items(), function(item)
            {
                return self.keys.indexOf(item[self.options.key]) >= 0;
            });
        }, this);
    }

    RelationEditor.prototype.init = function()
    {
        var self = this;

        this.options.getItems(function(data)
        {
            self.items(data);
        });

        this.options.getKeys(function(data)
        {
            self.keys(data);
        });
    }

    RelationEditor.prototype.add = function()
    {
        var self = this;

        this.options.add(this.leftKey(), function()
        {
            self.keys.push(self.leftKey())
        });
    }

    RelationEditor.prototype.remove = function()
    {
        var self = this;

        this.options.remove(this.rightKey(), function()
        {
            self.keys.remove(self.rightKey());
        });
    }

    return RelationEditor;
});