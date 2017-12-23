define(["knockout"], function(ko) {
	var validateObservables = [];

	ko.validateObservable = function (data) {
		var observable = ko.observable(data);

		observable.isValid = function () {
			return !observable.getErrors().length;
		};

		observable.getErrors = function () {
			var res = [];
			var value = observable();

			//for (var key in value) {
			//	if (ko.isObservable(value[key]) && value[key].isValid && !value[key].isValid()) {
			//		res.push({ field: key, message: "not valid" });
			//	}
			//}

			var validateObservable = ko.utils.arrayFirst(validateObservables, function (item) {
				return item.viewModel == value;
			});

			if(validateObservable){
				ko.utils.arrayForEach(validateObservable.fields, function (field) {
					if(!field.isValid()){
						res.push({ message: "not valid" });
					}
				});
			}

			return res;
		};

		return observable;
	};

	ko.bindingHandlers.validate = {
		init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
			if (allBindings.has("value")) {
				var valueBinding = allBindings.get("value");
				if (ko.isObservable(valueBinding)) {
					valueBinding.isValid = ko.observable(true);

					var validateObservable = ko.utils.arrayFirst(validateObservables, function (item) {
							return item.viewModel == viewModel;
						});

					if(!validateObservable){
						validateObservable = { viewModel: viewModel, fields: [] };
						validateObservables.push(validateObservable);
					}

					validateObservable.fields.push(valueBinding);

					valueBinding.subscribe(function(){
						ko.bindingHandlers.validate.update(element, valueAccessor, allBindings, viewModel, bindingContext);
					});
					return;
				}
			}

			$(element).change(function () {
				ko.bindingHandlers.validate.update(element, valueAccessor, allBindings, viewModel, bindingContext);
			});
		},
		update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
			var valid = true;

			var rules = ko.utils.unwrapObservable(valueAccessor());
			if(typeof rules == 'function'){
				rules = rules.call(viewModel);
			}

			var value = $(element).val();

			var numberPattern = "^[0-9]+$";

			for (var key in rules) {
				var rule = ko.utils.unwrapObservable(rules[key]);
				switch (key) {
					case "required":
						if(rule && !value){
							valid = false;
						}
						break;
					case "pattern":
						if (rule && !new RegExp(rule).test(value)) {
							valid = false;
						}
						break;
					case "min":
						if (rule && (!new RegExp(numberPattern).test(value) || value * 1 < rule)) {
							valid = false;
						}
						break;
					case "max":
						if (rule && (!new RegExp(numberPattern).test(value) || value * 1 > rule)) {
							valid = false;
						}
						break;
					default:
						if(typeof(rule) == "function" && !rule()){
							valid = false;
						}
						break;
				}
			}

			if (valid) {
				$(element).removeClass("validate");
			} else {
				$(element).addClass("validate");
			}

			if (allBindings.has("value")) {
				var valueBinding = allBindings.get("value");
				if (ko.isObservable(valueBinding)) {
					valueBinding.isValid(valid);
				}
			}
		}
	};
});