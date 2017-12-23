define(['knockout'], function (ko) {
    function TreeNode(tree, parent) {
        this.tree = tree;
        this.parent = parent;

        this.title = ko.observable();

        this.isOpen = ko.observable(false);

        this.children = ko.observableArray();

        this.isActive = ko.computed(function(){
            return this.tree.active() == this;
        }, this);
    }

    TreeNode.prototype.click = function(data, e) {
        if (this.tree.edited() != this) {
            e.stopPropagation();
            this.isOpen(!this.isOpen());
            this.tree.active(this);

            if(this.tree.edited()){
                this.tree.edited().cancel();
            }
        }
    }

    TreeNode.prototype.cancel = function () {
        this.tree.edited(null);
    }

    return TreeNode;
});