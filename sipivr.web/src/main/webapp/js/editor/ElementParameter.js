define(["knockout"], function (ko) {
    function ElementParameter(options) {
        options = options || {};

        this.name = ko.observable(options.name || "");
        this.value = ko.observable(options.value || "");
        this.title = ko.observable(options.title || "");

        for(var key in options){
            if(!this[key]){
                this[key] = options[key];
            }
        }

        this.isValid = ko.observable(true);

        this.text = ko.computed(function () {
        	return this.value();
        }, this);

        this.style = { width: 'auto' };
        this.component = options.component || "element-parameter";
    }

    ElementParameter.prototype.validate = function () {
        if (this.value() !== undefined && this.value() != '' && this.value() != null) {
            this.isValid(true);
            return true;
        }

        this.isValid(false);

        return false;
    }

    ElementParameter.prototype.getModel = function () {
        return {
            name: this.name(),
            value: this.value()
        };
    }

    ko.components.register('element-parameter', {
        template: { require: 'text!editor/ElementParameter.html' }
    });

    return ElementParameter;
});