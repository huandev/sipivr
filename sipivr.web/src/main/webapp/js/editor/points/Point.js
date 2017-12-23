define(function () {
	function Point(element) {
		this.element = element;
	}

	Point.prototype.init = function (ui) {
		this.ui = ui;
	}

	return Point;
});