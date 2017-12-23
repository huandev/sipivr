define(["knockout", "utils/DOM", "messages", "knockout.mapping", "knockout.binding.validate"],
    function(ko, DOM, messages, mapping) {
        function InlineEditor(options) {
            this.options = options;

            this.items = ko.observableArray();

            this.edited = ko.observable();
            this.editedTemp = ko.validateObservable();

            var self = this;

            DOM.attachEvent(document, "keydown", function (e) {
                switch (e.keyCode) {
                    case 27: //Esc
                        self.cancel();
                        break;
                }
            });
        }

        InlineEditor.prototype.init = function () {
            var self = this;

            this.options.get(function (data) {
                self.items(data.reverse());
            });
        }

        InlineEditor.prototype.push = function (item) {
            this.items.unshift(item);
        }

        InlineEditor.prototype.add = function () {
            this.cancel();

            this.editedTemp(this.mapFromJs(this.options.model));
        }

        InlineEditor.prototype.edit = function (item) {
            this.cancel();

            var js = mapping.toJS(item);

            this.edited(item);
            this.editedTemp(this.mapFromJs(js));
        }

        InlineEditor.prototype.mapFromJs = function (js) {
            return mapping.fromJS(js);
        }

        InlineEditor.prototype.cancel = function () {
            this.editedTemp(null);
            this.edited(null);
        }

        InlineEditor.prototype.save = function () {
            var self = this;

            var errors = this.editedTemp.getErrors();
            if (errors.length) {
                $.notify(messages["ui.error"] + ". " + messages["ui.error.invalid"], {
                    className: "error",
                    position: "right bottom"
                });
                return;
            }

            var js = mapping.toJS(this.editedTemp());

            this.options.save(js, function (data) {
                var edited = self.edited();
                if (edited) {
                    self.items.replace(edited, data);
                }
                else {
                    self.items.unshift(mapping.fromJS(data));
                }
                self.cancel();
            });
        }

        InlineEditor.prototype.remove = function (data) {
            if (confirm("Вы действительно хотите удалить элемент?")) {
                var self = this;

                this.options.remove(data, function () {
                    if (self.edited() == data) {
                        self.cancel();
                    }

                    self.items.remove(data);
                });
            }
        }

        return InlineEditor;
    });