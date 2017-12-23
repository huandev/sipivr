define(["knockout", "utils/DOM", "utils/Drag", "utils/SVG", "editor/Menu", "utils/Command", "widgets/sipclient"],
function (ko, DOM, Drag, SVG, Menu, command, sipclient) {
	function Designer(toolbar) {
		this.toolbar = toolbar;
		this.commandHistory =  new command.CommandHistory();
		this.menus = ko.observableArray();

		this.x = ko.observable(0);
		this.y = ko.observable(0);
		this.scale = ko.observable(1 / 1.25);

		this.activeElement = ko.observable();

		this.helper = ko.observable();

		this.campaignId = ko.observable();
		this.startMenuIndex = ko.observable();

		this.sipclient = sipclient;
    }

	Designer.prototype.init = function (ui) {
    	var self = this;
    	self.ui = ui;
    	self.svg = ui.parentNode;

    	DOM.scrollable(self.svg, function (e, delta) {
    		var p = SVG.getMousePositionBy(e, self.ui);
			var steps = 25;
			var interval = setInterval(function(){
				steps--;
				if(steps == 0){
					clearInterval(interval);
				}

				var scale = self.scale();
				var ds = 1.01;

				if (delta > 0) {
					if (self.scale() <= 0.25) {
						return;
					}

					self.scale(self.scale() / ds);

					self.x(self.x() + (p.x - p.x / ds) * scale);
					self.y(self.y() + (p.y - p.y / ds) * scale);
				}
				else if (delta < 0) {
					if (self.scale() > 2) {
						return;
					}

					self.scale(self.scale() * ds);
					self.x(self.x() - (p.x * ds - p.x) * scale);
					self.y(self.y() - (p.y * ds - p.y) * scale);
				}
			}, 10);
    	});

    	new Drag(self.svg, {
    		move: function (data) {
    			self.x(self.x() + data.dx);
    			self.y(self.y() + data.dy);
    		}
    	});

		DOM.attachEvent(document, "keydown", function (e) {
			if(e.ctrlKey) {
				switch (e.keyCode) {
					case 89: //Y
						self.commandHistory.redo();
						break;
					case 90: //Z
						self.commandHistory.undo();
						break;
				}
			} else {
				switch (e.keyCode) {
					case 46: //Del
						if(self.activeElement()) {
							self.activeElement().remove();
						}
						break;
				}
			}
		});

		DOM.attachEvent(document, "click", function (e) {
			if(e.target.namespaceURI == "http://www.w3.org/2000/svg") {
				document.activeElement.blur();
			}
		});
    }

	Designer.prototype.getModel = function () {
		var model = { menus: [], startMenu: this.startMenuIndex(), campaignId: this.campaignId() };

		var menus = this.menus();

		ko.utils.arrayForEach(this.menus(), function(menu) {
			model.menus.push(menu.getModel());
		});

		return model;
	}

	Designer.prototype.setModel = function (model) {
		var self = this;
		self.campaignId(model.campaignId);
		ko.utils.arrayForEach(model.menus, function (menu) {
			var vMenu = new Menu(self);
			vMenu.data = menu;
			vMenu.x(menu.x);
			vMenu.y(menu.y);
			vMenu.nameParameter.value(menu.name);
			self.menus.push(vMenu);

			ko.utils.arrayForEach(menu.modules, function (module) {
				var toolbarItem = self.toolbar.items[module.name];
				if(!toolbarItem){
					throw new Error("module with name '" + module.name + "' is not found");
				}

				var vModule = self.createModule(toolbarItem, vMenu);

				ko.utils.arrayForEach(module.parameters, function (parameter) {
					for (var i = 0; i < vModule.parameters().length; i++) {
						var p =  vModule.parameters()[i];
						if(p.name() == parameter.name) {
							p.value(parameter.value);
							break;
						}
					}
				});

				ko.utils.arrayForEach(module.transitions, function (transition) {
					if(transition.nextMenu && transition.nextMenu.index){
						model.menus[transition.nextMenu.index - 1] = transition.nextMenu;
						transition.nextMenu = transition.nextMenu.index;
					}
				});

				vMenu.modules.push(vModule);
			});
		});

		this.startMenuIndex(model.startMenu - 1);

		for (var i = 0; i < model.menus.length; i++) {
			var menu = model.menus[i];

			for (var j = 0; j < menu.modules.length; j++) {
				var module = menu.modules[j];

				for (var k = 0; k < module.transitions.length; k++) {
					var t = module.transitions[k];

					if(t.nextMenu !== null)
					{
						var oP = self.menus()[i].modules()[j].outputPoints[k];
						var iP = ko.utils.arrayFirst(self.menus(), function(menu){
							return menu.data.index == t.nextMenu;
						}).inputPoint;

						oP.connect(iP);
					}
				}
			}
		}
	}

	Designer.prototype.createModule = function(toolbarItem, menu){
		var type = toolbarItem.data;
		var module = new type(this, menu);
		return module;
	}

	return Designer;
});