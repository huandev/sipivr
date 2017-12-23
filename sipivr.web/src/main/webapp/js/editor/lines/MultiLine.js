define(["editor/lines/Line"], function (Line) {
	function MultiLine(container, points, data) {
		this.container = container;
		this.points = points;
		this.data = data;

		this.lines = [];
		for (var i = 0; i < points.length - 1; i++) {
			this.lines.push(new Line(container, this.points[i], this.points[i + 1]));
		}

		this.draw();
	}

	MultiLine.prototype.draw = function () {
		for (var i = 0; i < this.lines.length; i++) {
			this.lines[i].draw();
		}
	}

	MultiLine.prototype.destroy = function () {
		for (var i = 0; i < this.lines.length; i++) {
			this.lines[i].destroy();
		}
	}

	return MultiLine;
});