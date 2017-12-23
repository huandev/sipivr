define(["knockout", "editor/Element", "editor/AppCommands", "utils/SVG"],
    function (ko, Element, appCommands, SVG) {
    	function Module(designer, menu) {
    		var self = this;

    		Element.call(this, designer, {
    			dragStart: function()
    			{
    				if (this.menu())
    					this.menu().toFront();

    				var prevMenu = this.menu();

    				var menus = designer.menus();
    				for (var i = 0; i < menus.length; i++) {
    					//menus[i].highlight(true);

    					menus[i].droppable(function (e) {
    						if (prevMenu) {
    							if (prevMenu == this) {
    								ko.utils.arrayForEach(this.modules(), function (module) {
    									if (module != self) {
    										var p = SVG.getMousePositionBy(e, module.ui);
    										if (p.y >= 0 && p.y <= module.height()) {
    											designer.commandHistory.add(new appCommands.MoveModule(self, prevMenu, prevMenu, module));
    										}
    									}
    								});
    							}
    							else {
    								var after = null;
    								ko.utils.arrayForEach(this.modules(), function (module) {
    									var p = SVG.getMousePositionBy(e, module.ui);
    									if (p.y >= 0 && p.y <= module.height()) {
    										after = module;
    									}
    								});

    								designer.commandHistory.add(new appCommands.MoveModule(self, prevMenu, this, after));
    							}
    						}
    						else {
    							designer.commandHistory.add(new appCommands.AddModule(this, self));
    						}

    						self.move();
    					});
    				}
    			},
    			dragStop: function () {
    				this.x(0);
    				this.y(0);

    				var menus = designer.menus();

    				for (var i = 0; i < menus.length; i++) {
    					menus[i].highlight(false);
    				}

    				self.move();
    			},
    			dragMove: function () {
					var menus = designer.menus();
					for (var i = 0; i < menus.length; i++) {
						if(!menus[i].highlight()) {
							menus[i].highlight(true);
						}
					}

    				self.move();
    			}
    		});

    		this.designer = designer;
            this.menu = ko.observable(menu);

            this.outputPoints = [];

            this.height = ko.computed(function () {
            	return (this.outputPoints.length || 1) * 30;
            }, this);

            this.template = 'svg-menu-item';

			this.icon = ko.observable();
        }

		Module.prototype = Object.create(Element.prototype);

        Module.prototype.getIndex = function () {
            return this.menu().modules.indexOf(this);
        };

        Module.prototype.getTopPosition = function () {
        	var res = 3;

            if (this.menu()) {
                var modules = this.menu().modules();

                for (var i = 0; i < modules.length; i++) {
                    if (modules[i] == this)
                        break;

                    res += modules[i].height() + 3;
                }
            }

            res += this.y();

            return res;
        };

        Module.prototype.remove = function () {
        	this.designer.commandHistory.add(new appCommands.RemoveModule(this.menu(), this));
        };

        Module.prototype.move = function (x, y) {
        	for (var i = 0; i < this.outputPoints.length; i++) {
        		this.outputPoints[i].move();
        	}
        };

        Module.prototype.getModel = function () {
        	var model = {
        		name: this.name,
        		parameters: [],
        		transitions: [],
        		index: this.getIndex()
        	};

        	var parameters = this.parameters();
        	for (var i = 0; i < parameters.length; i++) {
        		model.parameters.push(parameters[i].getModel());
        	}

        	for (var i = 0; i < this.outputPoints.length; i++) {
        		var op = this.outputPoints[i];

        		if (this.outputPoints[i].line)
        			model.transitions.push({ nextMenu: this.outputPoints[i].line.data.inputPoint.element.getIndex() });
        	}

        	return model;
        };

        return Module;
    });