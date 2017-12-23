define(["knockout", "editor/Module", "editor/points/OutputPoint"],
    function (ko, Module, OutputPoint) {
        function NewModule(designer, menu, options) {
            Module.call(this, designer, menu, options);

            this.text = ko.computed(function () {
                if (this.parameters().length) {
                    var title = this.title() ? this.title().replace(/(Date)|(Time)|(Between)/ig, "") : "";
                    return (title ? title + ": " : title) + ko.utils.arrayMap(this.parameters(), function (p) {
                            return p.value();
                        }).join(" - ");
                }

                return this.title();
            }, this);

            this.outputPoints.push(new OutputPoint(this));
        }

        NewModule.prototype = Object.create(Module.prototype);

        return NewModule;
    });