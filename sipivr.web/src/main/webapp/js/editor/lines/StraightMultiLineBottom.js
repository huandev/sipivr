define(["editor/lines/MultiLine"], function (MultiLine) {
	function StraightMultiLineBottom(container, p1, p2, data) {
		this.p1 = p1;
		this.p2 = p2;

		MultiLine.call(this, container, [p1, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, p2], data);
	}

	StraightMultiLineBottom.prototype = Object.create(MultiLine.prototype);

	StraightMultiLineBottom.prototype.draw = function () {
		var d = 40;

		this.points[1].x = this.points[0].x;
		this.points[1].y = (this.points[5].y - this.points[0].y) > 0 ? (this.points[0].y + this.points[5].y) / 2 : (this.points[0].y + d / 2);

		this.points[2].x = (this.points[0].x + this.points[5].x) / 2;
		this.points[2].y = this.points[1].y;

		this.points[3].x = this.points[2].x;
		this.points[3].y = (this.points[5].y - this.points[0].y) > 0 ? this.points[2].y : (this.points[5].y - d / 2);

		this.points[4].x = this.points[5].x;
		this.points[4].y = this.points[3].y;

		MultiLine.prototype.draw.call(this);
	}

	return StraightMultiLineBottom;
});