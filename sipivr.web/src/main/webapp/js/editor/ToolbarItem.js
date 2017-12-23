define(["knockout", "utils/DOM"],
	function (ko, DOM) {
		function ToolbarItem(options, name, data) {
			this.options = options;
			this.enable = ko.observable(true);

			this.name = name;
			this.section = null;
			this.data = data;
		}

		ToolbarItem.prototype.init = function (ui) {
			var self = this;
			self.ui = ui;

			function mouseUpEventHandler(e) {
				DOM.removeClass(ui, "active");
				DOM.detachEvent(document, "mouseup", mouseUpEventHandler);

				self.options.stop(e, self);
			}

			DOM.attachEvent(ui, "mousedown", function (e) {
				if(e.preventDefault)
					e.preventDefault();
				//e.stopPropagation();

				if(self.enable()) {
					DOM.attachEvent(document, "mouseup", mouseUpEventHandler);
					DOM.addClass(ui, "active");

					self.options.start(e, self);
				}
			});
		}

		return ToolbarItem;
	});