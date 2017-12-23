define(["editor/lines/MultiLine"], function (MultiLine) {
	function StraightLine(p1, p2, data) {
		this.p1 = p1;
		this.p2 = p2;

		MultiLine.call(this, [p1, p2], data);
	}

	StraightLine.prototype = Object.create(MultiLine.prototype);

	return StraightLine;
});