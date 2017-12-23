define(["knockout"], function(ko) {
    function Datepicker() {
        this.months = [
            "Январь",
            "Февраль",
            "Март",
            "Апрель",
            "Май",
            "Июнь",
            "Июль",
            "Август",
            "Сентябрь",
            "Октябрь",
            "Ноябрь",
            "Декабрь"
        ];
        this.weekDays = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];

        this.onchange = onchange || null;

        this.today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

        this.value = ko.observable();
        this.year = ko.observable();
        this.month = ko.observable();

        this.postConstruct();

        this.setValue(new Date());

        this.day = ko.computed(function () {
            return this.value().getDate();
        }, this);

        this.weekDay = ko.computed(function () {
            return this.value().getDay() || 7;
        }, this);

        this.top = ko.observable(0);
        this.left = ko.observable(0);
        this.visible = ko.observable(false);

        this.items = ko.computed(function () {
            var res = [];

            var dtFrom = new Date(this.year(), this.month(), 1);

            if (dtFrom.getDay() != 1) {
                dtFrom.setDate(dtFrom.getDate() + 1 - (dtFrom.getDay() || 7));
            }

            var dtTo = new Date(this.year(), this.month() + 1, 0);

            if (dtTo.getDay()) {
                dtTo.setDate(dtTo.getDate() + 7 - dtTo.getDay());
            }

            for (var i = new Date(dtFrom) ; i.valueOf() <= dtTo.valueOf() ; i.setDate(i.getDate() + 1)) {
                res.push(new Date(i));
            }

            return res;
        }, this);


        this.weeks = ko.computed(function () {
            var res = [];

            for (var i = 0; i < this.items().length; i++) {
                var row = Math.floor(i / 7.0);

                if (res.length < row + 1) {
                    res.push([]);
                }

                res[row].push(this.items()[i]);
            }

            return res;
        }, this);
    }

    Datepicker.prototype.postConstruct = function () {

    }

    Datepicker.prototype.setValue = function (value) {
        this.value(new Date(value.getTime()));
        this.year(value.getFullYear());
        this.month(value.getMonth());
    }

    Datepicker.prototype.nextMonth = function () {
        if (this.month() == 11) {
            this.month(0);
            this.year(this.year() + 1);
        } else {
            this.month(this.month() + 1);
        }
    }

    Datepicker.prototype.prevMonth = function () {
        if (this.month()) {
            this.month(this.month() - 1);
        } else {
            this.month(11);
            this.year(this.year() - 1);
        }
    }

    Datepicker.prototype.select = function (date, e) {
        this.setValue(date);
        if (this.onchange) {
            this.onchange(this.value(), e);
        }
    }

    Datepicker.prototype.hide = function () {
        this.visible(false);
    }

    Datepicker.prototype.show = function (top, left) {
        this.top(top);
        this.left(left);
        this.visible(true);
    }

    return Datepicker;
});