define(["knockout", "messages"], function (ko, messages) {
	function Toolbar() {
		this.items = {};
		this.sections = ko.observableArray();
		this.opacity = ko.observable(1);
	}

	Toolbar.prototype.addItem = function (item) {
		var sectionName = item.section;
		sectionName = sectionName ? sectionName.toLowerCase() : sectionName;

		var section = ko.utils.arrayFirst(this.sections(), function (item) {
			return item.name === sectionName;
		});

		if (!section) {
			section = {
				name: sectionName,
				items: ko.observableArray(),
				isVisible: ko.observable(true)
			};
			this.sections.push(section);

			this.sections.sort(function (a, b) {
				var aw = a.name ? (messages[a.name + ".order"] || "0") * 1 : 1000000;
				var bw = b.name ? (messages[b.name + ".order"] || "0") * 1 : 1000000;
				return aw > bw ? -1 : 1;
			});
		}

		if (item.name) {
			this.items[item.name] = item;
		}

		section.items.push(item);
	}

	return Toolbar;
});