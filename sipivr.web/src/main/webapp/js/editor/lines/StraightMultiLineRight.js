define(["editor/lines/MultiLine"], function (MultiLine) {
	function StraightMultiLineRight(container, p1, p2, data) {
		this.p1 = p1;
		this.p2 = p2;

		MultiLine.call(this, container, [p1, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, p2], data);
	}

	StraightMultiLineRight.prototype = Object.create(MultiLine.prototype);

	StraightMultiLineRight.prototype.draw = function () {
		var d = 40;

		this.points[1].x = (this.points[4].x - this.points[0].x) > d / 2 ? (this.points[0].x + this.points[4].x) / 2 : (this.points[0].x + d / 2);
		this.points[1].y = this.points[0].y;

		this.points[2].x = this.points[1].x;
		this.points[2].y = (this.points[4].y - this.points[0].y) > d / 2 ? ((this.points[4].x - this.points[0].x) > d / 2 ? this.points[1].y : (this.points[0].y + this.points[4].y) / 2) : (this.points[4].y - d / 2);

		this.points[3].x = this.points[4].x;
		this.points[3].y = this.points[2].y;

		MultiLine.prototype.draw.call(this);
	}

	return StraightMultiLineRight;
});