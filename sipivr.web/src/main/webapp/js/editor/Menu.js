define(["knockout", "editor/Element", "editor/points/InputPoint", "editor/ElementParameter", "editor/AppCommands", "utils/DOM", "utils/SVG", "messages"],
    function (ko, Element, InputPoint, ElementParameter, appCommands, DOM, SVG, messages) {
    	function Menu(designer) {
    		var self = this;

    		Element.call(this, designer, {
				dragStart: function (data) {
					if (data.event.ctrlKey && !this.isHelper) {
						this.drag.stop();

						var menu = this.copy();
						menu.isHelper = true;
						designer.commandHistory.add(new appCommands.AddMenu(designer, menu));
						menu.drag.start(data.event);
					}
				},
				dragStop: function (data) {
					if (data.stopPosition.x != data.startPosition.x || data.stopPosition.y != data.startPosition.y) {
						if (designer.menus.indexOf(this) < 0)
							designer.commandHistory.add(new appCommands.AddMenu(designer, this));
						else {
							designer.commandHistory.add(new appCommands.MoveMenu(this, data.startPosition, data.stopPosition));
						}
					}
    			},
    			dragMove: function () {
    				self.move();
    			}
    		});

    		this.designer = designer;
    		this.modules = ko.observableArray([]);

    		this.inputPoint = new InputPoint(this, {});

			this.moduleOutputPoints = ko.computed(function () {
				var res = [];
				ko.utils.arrayForEach(this.modules(), function (m) { return m.outputPoint; });
				return res;
			}, this);

			this.height = ko.computed(function () {
				var res = 0;

				ko.utils.arrayForEach(this.modules(), function(module) {
					res += module.height() + 3;
				});

    			return (res || 33) + 3;
    		}, this);

			this.nameParameter = new ElementParameter({ name: messages["model.menu.name"], value: messages["model.menu.name.new"] });

    		this.parameters.push(this.nameParameter);

    		this.template = 'svg-menu';
			this.id = 0;
    	}

		Menu.prototype = Object.create(Element.prototype);

    	Menu.prototype.activate = function () {
    		Element.prototype.activate.call(this);

    		this.toFront();
    	}

    	Menu.prototype.toFront = function () {
    		//return;
            //
    		//var self = this;
            //
    		//this.designer.menus.sort(function (left, right) {
    		//	return left == self ? 1 : (right == self ? -1 : 0);
    		//});
    	}

    	Menu.prototype.remove = function () {
    		this.designer.commandHistory.add(new appCommands.RemoveMenu(this.designer, this));
    	}

    	Menu.prototype.getIndex = function () {
    		return this.designer.menus.indexOf(this);
    	}

		Menu.prototype.move = function () {
			this.inputPoint.move();

			ko.utils.arrayForEach(this.modules(), function (module) {
				module.move();
			});
		}

    	Menu.prototype.droppable = function (callback) {
    		var self = this;

    		var documentMouseUpEventHandler = function (e) {
    			DOM.detachEvent(document, "mouseup", documentMouseUpEventHandler);

    			var p = SVG.getMousePositionBy(e, self.ui);
    			var box = self.ui.getBBox();
    			if (p.x >= 0 && p.x <= box.width && p.y >= 0 && p.y <= box.height) {
    				callback.call(self, e);
    			}
    		};

    		DOM.attachEvent(document, "mouseup", documentMouseUpEventHandler);
    	}

		Menu.prototype.getModel = function () {
    		var model = {
				//id: this.id,
				index: this.getIndex(),
    			x: this.x(),
    			y: this.y(),
    			name: this.nameParameter.value(),
    			modules: []
    		};

    		var modules = this.modules();
    		for (var i = 0; i < modules.length; i++) {
    			model.modules.push(modules[i].getModel());
    		}
    		return model;
    	}

    	return Menu;
    });