define(["knockout", "editor/points/Point", "editor/lines/StraightMultiLineRight", "utils/SVG", "utils/Drag", "editor/AppCommands"],
	function (ko, Point, StraightMultiLineRight, SVG, Drag, appCommands) {

	function OutputPoint(element, lineType) {
		Point.call(this, element);

		this.lineType = lineType || StraightMultiLineRight;
		this.line = null;
	}

	OutputPoint.prototype = Object.create(Point.prototype);

	OutputPoint.prototype.init = function (ui) {
		var self = this;

		Point.prototype.init.call(self, ui);

		var dragLine = null;

		new Drag(ui, {
		    start: function (data) {
		        if (self.line) {
		            self.element.designer.commandHistory.add(new appCommands.Disconnect(self.line));
		        }
				self.disconnect();

				var t = SVG.getTransformBy(ui, self.element.designer.ui);
				dragLine = new self.lineType(self.element.designer.ui, { x: t.x, y: t.y }, { x: t.x, y: t.y });

				ko.utils.arrayForEach(self.element.designer.menus(), function (menu) {
					menu.droppable(function () {
						self.element.designer.commandHistory.add(new appCommands.Connect(self, this.inputPoint));
					});
				});
			},
			move: function (data) {
				dragLine.p2.x = dragLine.p1.x + data.kx / self.element.designer.scale();
				dragLine.p2.y = dragLine.p1.y + data.ky / self.element.designer.scale();

				dragLine.draw();
			},
			stop: function () {
				dragLine.destroy();
			}
		});
	}

	OutputPoint.prototype.move = function () {
		if (this.line) {
			var p1 = SVG.getTransformBy(this.ui, this.element.designer.ui);

			var p2 = SVG.getTransformBy(this.line.data.inputPoint.ui, this.line.data.inputPoint.element.designer.ui);

			this.line.p1.x = p1.x;
			this.line.p1.y = p1.y;
			this.line.p2.x = p2.x;
			this.line.p2.y = p2.y;
			this.line.draw();
		}
	}

	OutputPoint.prototype.connect = function (inputPoint) {
		this.disconnect();

		var t1 = SVG.getTransformBy(this.ui, this.element.designer.ui);
		var t2 = SVG.getTransformBy(inputPoint.ui, this.element.designer.ui);
		this.line = new this.lineType(this.element.designer.ui, { x: t1.x, y: t1.y }, { x: t2.x, y: t2.y }, { outputPoint: this, inputPoint: inputPoint });
		inputPoint.lines.push(this.line);
	}

	OutputPoint.prototype.disconnect = function () {
		var self = this;
		if (self.line) {
			self.line.data.inputPoint.lines = ko.utils.arrayFilter(self.line.data.inputPoint.lines, function (line) {
				return line != self.line;
			});
			self.line.destroy();
			self.line = null;
		}
	}

	return OutputPoint;
});