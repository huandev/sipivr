define(["knockout", "utils/Command"], function (ko, c) {
	var Command = c.Command;

	function AddMenuCommand(designer, element) {
		Command.call(this, "Add menu", function () {
			designer.menus.push(element);
		}, function () {
			designer.menus.remove(element);
		});
	}

	function RemoveMenuCommand(designer, menu) {
	    var lines = [];

	    ko.utils.arrayForEach(menu.inputPoint.lines, function (line) {
	        if (lines.indexOf(line) < 0) {
	            lines.push(line);
	        }
	    });

	    ko.utils.arrayForEach(menu.modules(), function (module) {
	        ko.utils.arrayForEach(module.outputPoints, function (outputPoint) {
	            if (outputPoint.line) {
	                if (lines.indexOf(outputPoint.line) < 0) {
	                    lines.push(outputPoint.line);
	                }
	            }
	        });
	    });

	    var subcommands = [];

	    ko.utils.arrayForEach(lines, function (line) {
	        subcommands.push(new DisconnectCommand(line));
	    });

		Command.call(this, "Remove menu", function () {
			designer.menus.remove(menu);
		}, function () {
		    designer.menus.push(menu);
		}, subcommands);
	}

	function AddModuleCommand(menu, module) {
		Command.call(this, "Add module", function () {
			module.menu(menu);
			menu.modules.push(module);
		}, function () {
			menu.modules.remove(module);
		});
	}

	function RemoveModuleCommand(menu, module) {
	    var subcommands = [];

		for (var i = 0; i < module.outputPoints.length; i++) {
			if (module.outputPoints[i].line) {
				subcommands.push(new DisconnectCommand(module.outputPoints[i].line));
			}
		}

	    Command.call(this, "Remove module", function () {
	        menu.modules.remove(module);
	    }, function () {
	        menu.modules.push(module);
	    }, subcommands);
	}

	function MoveMenuCommand(menu, start, stop) {
		Command.call(this, "Move menu", function () {
			menu.x(stop.x);
			menu.y(stop.y);
		}, function () {
			menu.x(start.x);
			menu.y(start.y);
		});
	}

	function MoveModuleCommand(module, prevMenu, newMenu, after) {
	    var afterIndex = after ? after.getIndex() : -1;

        var newArray = [];
        var oldArray = prevMenu.modules().slice(0);

	    Command.call(this, "Move module", function () {
	        if (prevMenu != newMenu) {
				module.menu(newMenu);
				
				prevMenu.modules.remove(module);
				newMenu.modules.push(module);
	        }

	        if (after) {
	            if (!newArray.length) {
					var moduleIndex = module.getIndex();

	                for (var i = 0; i < newMenu.modules().length; i++) {
	                    var m = newMenu.modules()[i];

						if(afterIndex > moduleIndex){
							if(i < moduleIndex){
								newArray[i] = m;
							} else if(i == moduleIndex) {
								newArray[afterIndex] = m;
							} else if(i <= afterIndex){
								newArray[i - 1] = m;
							} else {
								newArray[i] = m;
							}
						} else {
							if(i < afterIndex){
								newArray[i] = m;
							} else if(i == moduleIndex) {
								newArray[afterIndex] = m;
							} else if(i < moduleIndex){
								newArray[i + 1] = m;
							} else {
								newArray[i] = m;
							}
						}
	                }
	            }

				newMenu.modules(newArray.slice(0));
	        }

	        newMenu.move();
		}, function () {
			if (prevMenu != newMenu) {
				module.menu(prevMenu);
				newMenu.modules.remove(module);
			}

			prevMenu.modules(oldArray.slice(0));

			newMenu.move();
		});
	}

	function ConnectCommand(ouput, input) {
		Command.call(this, "Connect elements", function () {
			ouput.connect(input);
		}, function () {
			ouput.disconnect();
		});
	}

	function DisconnectCommand(line) {
		var ouput = line.data.outputPoint;
		var input = line.data.inputPoint;

		Command.call(this, "Disconnect", function () {
			ouput.disconnect();
		}, function () {
			ouput.connect(input);
		});
	}

	return {
		AddMenu: AddMenuCommand,
		RemoveMenu: RemoveMenuCommand,
		AddModule: AddModuleCommand,
		RemoveModule: RemoveModuleCommand,
		MoveMenu: MoveMenuCommand,
		MoveModule: MoveModuleCommand,
		Connect: ConnectCommand,
		Disconnect: DisconnectCommand
	};
});