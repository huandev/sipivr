define(['knockout', "utils/TreeNode", "knockout.binding.validate"], function (ko, TreeNode) {
    function Tree() {
        this.active = ko.observable();
        this.edited = ko.validateObservable();

        this.root = new TreeNode(this);
        this.root.isOpen(true);
    }

    Tree.prototype.click = function(data, e){
        e.stopPropagation();
        this.isOpen(!this.isOpen());
    }

    return Tree;
});