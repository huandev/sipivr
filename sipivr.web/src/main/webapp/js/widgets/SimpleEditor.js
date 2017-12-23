define(["knockout", "messages", "knockout.mapping", "knockout.binding.validate"], function(ko, messages, mapping) {
    function SimpleEditor(options) {
        this.options = options;

        this.data = ko.validateObservable();
    }

    SimpleEditor.prototype.init = function (success) {
        var self = this;

        this.options.get(function (data) {
            self.data(mapping.fromJS(data));
            //self.data().errors.showAllMessages();
        });
    }

    SimpleEditor.prototype.validate = function(){
        var errors = this.data.getErrors();
        if(errors.length) {
            $.notify(messages["ui.error"] + ". " + messages["ui.error.invalid"], {className: "error", position: "right bottom"});
            return false;
        }
        return true;
    }

    SimpleEditor.prototype.save = function () {
        if(!this.validate()){
            return;
        }

        var self = this;

        this.options.save(mapping.toJS(this.data()), function (data) {
            if(data) {
                mapping.fromJS(data, self.data());
            }

            if (self.options.onSave) {
                self.options.onSave();
            }
        });
    }

    SimpleEditor.prototype.cancel = function () {
        if (this.options.onCancel) {
            this.options.onCancel();
        }
    }

    return SimpleEditor;
});