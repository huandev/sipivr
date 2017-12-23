define(["knockout", "editor/points/Point", "utils/SVG"],
	function (ko, Point, SVG) {
		function InputPoint(element) {
			Point.call(this, element);
		}

		InputPoint.prototype = Object.create(Point.prototype);

		InputPoint.prototype.init = function (ui) {
			var self = this;

			Point.prototype.init.call(self, ui);

			self.lines = [];
		}

		InputPoint.prototype.move = function () {
			var p2 = SVG.getTransformBy(this.ui, this.element.designer.ui);

			ko.utils.arrayForEach(this.lines, function (line) {
				var p1 = SVG.getTransformBy(line.data.outputPoint.ui, line.data.outputPoint.element.designer.ui);

				line.p1.x = p1.x;
				line.p1.y = p1.y;
				line.p2.x = p2.x;
				line.p2.y = p2.y;
				line.draw();
			});
		}

		return InputPoint;
	});