define(["utils/SVG"], function (SVG) {
	function Line(container, p1, p2) {
		this.p1 = p1;
		this.p2 = p2;

		this.container = container;

		this.ui = SVG.createNode(container, "line", {
			"class": "line"
		});
		this.draw();
	}

	Line.prototype.draw = function () {
		this.ui.setAttribute("x1", this.p1.x);
		this.ui.setAttribute("y1", this.p1.y);
		this.ui.setAttribute("x2", this.p2.x);
		this.ui.setAttribute("y2", this.p2.y);
	}

	Line.prototype.destroy = function () {
		SVG.removeNode(this.ui);
	}

	return Line;
});