define(["knockout", "widgets/datepicker", "utils/lang/date", "utils/lang/int"], function (ko, DatePicker, langDate, langInt) {
    function DateTimePicker() {
        this.timepicker = ko.observable(true);

        this.hour = ko.observable();
        this.minute = ko.observable();

        this.hourOptions = [];
        for (var i = 0; i < 24; i++) {
            this.hourOptions.push(langInt.addLeadingZeros(i, 2));
        }

        this.minuteOptions = [];
        for (var i = 0; i < 60; i += 15) {
            this.minuteOptions.push(langInt.addLeadingZeros(i, 2));
        }

        DatePicker.call(this);
    }

    DateTimePicker.prototype = Object.create(DatePicker.prototype);

    DateTimePicker.prototype.postConstruct = function () {
        DatePicker.prototype.postConstruct.call(this);

        var self = this;

        this.hour.subscribe(function (newValue) {
            var value = self.value();
            value.setHours(newValue);
            self.value(value);

            if (self.onchange) {
                self.onchange(self.value());
            }
        });

        this.minute.subscribe(function (newValue) {
            var value = self.value();
            value.setMinutes(newValue);
            self.value(value);

            if (self.onchange) {
                self.onchange(self.value());
            }
        });
    }

    DateTimePicker.prototype.setValue = function (value) {
        DatePicker.prototype.setValue.call(this, value);

        this.hour(value.getHours());
        this.minute(value.getMinutes());
    }

    DateTimePicker.prototype.select = function (date, e) {
        date.setHours(this.hour());
        date.setMinutes(this.minute());

        DatePicker.prototype.select.call(this, date, e);
    }

    return DateTimePicker;
});