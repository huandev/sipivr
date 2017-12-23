define(["knockout", "utils/Drag", "utils/DOM", "messages"],
	function (ko, Drag, DOM, messages) {
		function Element(designer, options) {
			this.designer = designer;
			this.options = options || {};

			this.active = ko.computed(function () {
				return designer.activeElement() == this;
			}, this);

			this.highlight = ko.observable(false);

			this.parameters = ko.observableArray();

			this.x = ko.observable(0);
			this.y = ko.observable(0);

			this.isValid = ko.observable(true);

			this.name = ko.observable();
			this.title = ko.computed(function(){
				return messages[this.name()];
			}, this);

			this.text = ko.computed(function () {
				if (this.parameters().length) {
					return this.title() + ": " + ko.utils.arrayMap(this.parameters(), function (p) {
							return p.text();
						}).join(" ");
				}

				return this.title();
			}, this);
		}

		Element.prototype.init = function (ui) {
			this.ui = ui;

			var self = this;

			var startPosition = null;

			this.drag = new Drag(ui, {
				start: function (data) {
					self.activate();

					if (self.options.dragStart)
						self.options.dragStart.call(self, data);

					startPosition = { x: self.x(), y: self.y() };
				},
				move: function (data) {
					if (self.options.dragMove)
						self.options.dragMove.call(self);

					self.x(self.x() + data.dx / self.designer.scale());
					self.y(self.y() + data.dy / self.designer.scale());
				},
				stop: function () {
					var stopPosition = { x: self.x(), y: self.y() };

					if (self.options.dragStop)
						self.options.dragStop.call(self, { startPosition: startPosition, stopPosition: stopPosition });

					if (self.isHelper) {
						self.isHelper = false;
					}
				}
			});

			DOM.attachEvent(ui, "mousedown", function(e) {
				if (e.stopPropagation) {
				    e.stopPropagation();
				} else {
				    e.returnValue = false;
				}
			});
		};

		Element.prototype.activate = function () {
			this.designer.activeElement(this);
		}

		Element.prototype.move = function (x, y) {
			this.outputPoint.move();
		};

		return Element;
	});