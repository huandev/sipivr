    /// <reference path="../References.js" />

    //#region Object

//    //warning conflict with query
//    Object.prototype.getName = function() {
//        var funcNameRegex = /function (.{1,})\(/;
//        var results = (funcNameRegex).exec((this).constructor.toString());
//        return (results && results.length > 1) ? results[1] : "";
//    };

    Object.clone = function (o) {
        ///<summary>создает копию объекта</summary>
        ///<param name="o">копируемый объект</summary>
        ///<returns type="Object">копия объекта</summary>
        if (!o || "object" !== typeof o) return o;
        var c = "function" === typeof o.pop ? [] : {};
        for (var p in o) {
            var v = o[p];
            c[p] = (v && "object" === typeof v) ? Object.clone(v) : v;
        }
        return c;
    };

    Object.merge = function (a, b) {
        ///<summary>объединяет 2 объекта, добавляя члены из объекта b в объект a</summary>
        ///<returns type="Object">Объединенный объект</returns>
        for (var k in b)
            a[k] = b[k];
        return a;
    };

    Object.mergeFields = function (a, b) {
        ///<summary>Объединяет поля 2 объектов, добавляя поля из объекта b в объект a</summary>
        ///<returns type="Object">Объединенный объект</returns>
        for (var k in b)
            if (typeof (b[k]) !== "function")
                a[k] = b[k];
        return a;
    };

    Object.extract = function (o, keys) {
        ///<summary>Выбирает определенные ключи из объекта</summary>
        ///<param name="o" type="Object">Исходный объект</param>
        ///<param name="keys" type="Array">Выбираемые ключи</param>
        ///<returns type="Object">Объект, составленный из выбранных ключей</returns>

        var res = {};
        for (var i = 0, l = keys.length; i < l; i++)
            res[keys[i]] = o[keys[i]];
        return res;
    };

    Object.fields = function (obj) {
        var fields = [];
        for (key in obj) {
            if (typeof (obj[key]) !== "function")
                fields.push(obj[key]);
        }
        return fields;
    };

    Object.keys = function (o) {
        var res = [];
        for (var k in o)
            res.push(k);
        return res;
    };

    Object.values = function (o) {
        /// <returns type="Array" />
        var res = [];
        for (var k in o)
            res.push(o[k]);
        return res;
    };

    Object.recoverFunctions = function (obj, objType) {
        ///<summary>востанавливает функции объекта из прототипа</summary>
        ///<param name="obj" type="Object">восстанавливаемый объект</param>
        ///<param name="objType" type="Object">прототип восстанавливаемого объекта</param>
        if (obj != null) {
            //также ASP легко проебывает функции от встроенных объектов, например, Date
            //поэтому их надо пересоздавать 
            if (objType == Date) //восстанавливаем Date
            {
                obj.valueOf2 = Date.prototype.valueOf;
                return new Date(obj.valueOf2());
            }
            if (objType == Array) //восстанавливаем Array
            {
                var dest = new Array(obj.length);
                for (var i = 0; i < obj.length; i++)
                    dest[i] = obj[i];
                return dest;
            }
            else //пользовательские объекты восстанавливаем по прототипу
            {
                for (var f in objType.prototype) {
                    var member = objType.prototype[f];
                    if (typeof (member) === "function")
                        obj[f] = member;
                }
                obj.prototype = objType.prototype;
                if (obj.RecoverFunctions) obj.RecoverFunctions();
            }
        }
        return obj;
    };

    //#endregion

    //#region Number

    Number.isNumeric = function (value) {
        ///<summary>проверяет, можно ли значение преобразовать в число</summary>
        ///<param name="value">проверяемое значение - число или строка</param>
        ///<returns type="Boolean"/>
        switch (typeof (value)) {
            case "number": return isFinite(value) && !isNaN(value);
            case "string":
                return value.length > 0 && isFinite(Number(value));
        }
        return false;
    };

    Number.div = function (a, b) {
        ///<summary>Деление, a/0 = 0</summary>
        return b === 0 ? 0 : a / b;
    };

    Number.parse = function (val, defaultValue) {
        ///<summary>преобразует значение в число</summary>
        ///<param name="val">преобразуемое значение</param>
        ///<param name="defaultValue" type="Number" optional="true">значение по умолчанию, если не удалось преобразовать</param>
        ///<returns type="Number">результат преобразования</returns>
        var res = parseFloat(val);
        return isNaN(res) ? (defaultValue === undefined ? null : defaultValue) : res;
    };

    //	Number.prototype.format = function ()
    //	{
    //		var div, res = "";
    //		var n = Math.abs(new Number(this));
    //		while (n > 0)
    //		{
    //			div = n % 1000;
    //			res = " " + (div + "") + res;
    //			n = (n / 1000).toFixed();
    //		}
    //		return (this < 0 ? "-" : "") + res.trim();
    //	}

    var Int =
        {
            parse: function (val, defaultValue) {
                ///<summary>преобразует значение в число</summary>
                ///<param name="val">преобразуемое значение</param>
                ///<param name="defaultValue" type="Number" optional="true">значение по умолчанию, если не удалось преобразовать</param>
                ///<returns type="Number">результат преобразования</returns>
                var res = parseInt(val, 10);
                return isNaN(res) ? (defaultValue === undefined ? null : defaultValue) : res;
            },

            addLeadingZeros: function (n, length) {
                ///<summary>Добавляет нули перед числом до определенной длины</summary>
                ///<param name="n" type="Number">целое число</param>
                ///<param name="length">минимальная общая длина результата. Если длина исходного числа > length, то нули не добавляются</param>
                ///<returns type="String">строковое представление числа с нулями</retuns>
                var str = (n > 0 ? n : -n) + "";
                var zeros = "";
                for (var i = length - str.length; i > 0; i--)
                    zeros += "0";
                zeros += str;
                return n >= 0 ? zeros : "-" + zeros;
            }
        };

    //#endregion

    //#region Array
    Array.prototype.contains = function (val, equalsFunction) {
        ///<summary>проверяет наличие значения в массиве</summary>
        ///<param name="val">Искомое значение</param>
        ///<returns type="Boolean">найдено ли значение</retuns>
        for (var i = this.length; i--;) {
            if (equalsFunction) {
                if (equalsFunction(this[i], val))
                    return true
            }
            else if (this[i] == val)
                return true;
        }
        return false;
    };

    Array.prototype.find = function (condition) {
        ///<summary>ищет первый элемент в массиве, удовлетворяющий заданному условию</summary>
        ///<param name="condition" type="Function">условие поиска</param>
        ///<retuns>найденный элемент. Если не найден - то null</retuns>
        for (var i = 0, l = this.length; i < l; i++)
            if (condition.call(this[i], this[i])) return this[i];
        return null;
    };

    Array.prototype.remove = function (condition) {
        ///<summary>удаляет элемент из массива, удовлетворяющий заданному условию</summary>
        ///<param name="condition" type="Function">условие поиска</param>
        ///<retuns>найденный элемент. Если не найден - то null</retuns>
        for (var i = 0, l = this.length; i < l; i++)
            if (condition.call(this[i], this[i], i)) return this.splice(i, 1);
        return null;
    };

    Array.prototype.findIndex = function (condition) {
        ///<summary>ищет индекс первого элемента в массиве, удовлетворяющего заданному условию</summary>
        ///<param name="condition" type="Function">условие поиска</param>
        ///<retuns type=""Number>индекс найденного элемента. Если не найден - то null</retuns>
        for (var i = 0, l = this.length; i < l; i++)
            if (condition.call(this[i], this[i])) return i;
        return null;
    };

    Array.prototype.count = function (condition) {
        ///<summary>считает элементы, удовлетворяющие данному условию</summary>
        ///<param name="condition" type="Function">условие поиска</param>
        ///<retuns type=""Number>количество элементов</retuns>
        var n = 0;
        for (var i = this.length; i--;)
            if (!condition || condition.call(this[i], this[i])) n++;
        return n;
    };

    Array.prototype.where = function (condition) {
        ///<summary>выбирает элементы, соответствующие указанному условию</summary>
        ///<param name="condition" type="Function">условие</param>
        ///<retuns type="Array">массив с найденными элементами</retuns>
        var res = [];
        for (var i = 0, l = this.length; i < l; i++)
            if (condition.call(this[i], this[i], i))
                res.push(this[i]);
        return res;
    };

    Array.prototype.select = function (selector) {
        ///<summary>преобразует массив, применяя функцию к каждому элементу</summary>
        ///<param name="selector" type="Function">преобразующая функция</param>
        ///<retuns type="Array">преобразованный массив</retuns>
        var res = new Array(this.length);
        for (var i = this.length; i--;)
            res[i] = selector.call(this[i], this[i], i, this);
        return res;
    };

    Array.prototype.all = function (condition) {
        ///<summary>Проверяет, все ли элементы последовательности удовлетворяют условию</summary>
        ///<param name="condition" type="Function">условие</param>
        ///<retuns type="Array">преобразованный массив</retuns>
        for (var i = this.length; i--;)
            if (!condition.call(this[i], this[i])) return false;
        return true;
    };

    Array.range = function (start, count, step) {
        ///<summary>создает арифметическую прогрессию</summary>
        ///<param name="start" type="Number">первый член прогрессии</param>
        ///<param name="count" type="Number">количество членов прогрессии</param>
        ///<param name="step" type="Number" optional="true">шаг прогрессии. Если не указан, то 1</param>
        ///<retuns type="Array">массив с членами прогрессии</retuns>
        if (step === undefined) step = 1;
        var res = new Array(count);
        for (var i = count; i--;)
            res[i] = start + step * i;
        return res;
    };

    Array.prototype.forEach = function (action) {
        ///<summary>выполняет действие над каждым элементом массива</summary>
        ///<param name="action" type="Function">действие</param>
        for (var i = 0, l = this.length; i < l; i++) {
            if (action.call(this[i], this[i], i) === false)
                break;
        }
    };

    Array.prototype.swap = function (i, j) {
        var t = this[i];
        this[i] = this[j];
        this[j] = t;
    };

    Array.AreEqual = function (array1, array2) {
        if (array1.length != array2.length)
            return false;

        for (var i = 0; i < array1.length; i++) {
            if (array1[i] != array2[i])
                return false;
        }

        return true;
    };

    Array.prototype.max = function (selector) {
        var res = selector ? selector.call(this[0], this[0]) : this[0];
        for (var i = 1; i < this.length; i++) {
            var next = selector ? selector.call(this[i], this[i]) : this[i];
            if (next > res)
                res = next;
        }
        return res;
    };

    Array.prototype.min = function (selector) {
        var res = selector ? selector.call(this[0], this[0]) : this[0];
        for (var i = 1; i < this.length; i++) {
            var next = selector ? selector.call(this[i], this[i]) : this[i];
            if (next < res)
                res = next;
        }
        return res;
    };

    Array.prototype.sum = function (selector) {
        var res = 0;
        for (var i = 0; i < this.length; i++) {
            res += selector ? selector.call(this[i], this[i], i) : this;
        }
        return res;
    };

    Array.prototype.avg = function (selector) {
        return this.sum(selector) / this.length;
    };

    Array.prototype.distinct = function (selector) {
        var res = [];

        for (var i = 0; i < this.length; i++) {
            var el = selector == undefined ? this[i] : selector.call(this[i], this[i]);
            if (!res.contains(el)) {
                res.push(el);
            }
        }

        return res;
    }

    Array.prototype.groupBy = function (keySelector, valueSelector) {
        ///<summary>группирует элементы по заданному селектору</summary>
        ///<param name="selector" type="Function">преобразующая функция</param>
        ///<retuns type="Object">хэш</retuns>

        var res = {};

        for (var i = 0, l = this.length; i < l; i++) {
            var key = keySelector ? keySelector.call(this[i], this[i], i) : this[i];

            if (!res[key])
                res[key] = [];

            res[key].push(valueSelector ? valueSelector.call(this[i], this[i], i) : this[i]);
        }

        return res;
    };

    Array.prototype.selectMany = function (selector) {
        ///<summary>[[a,b],[c,d]].selectMany(function(){ return this; }) = [a,b,c,d]</summary>
        ///<param name="selector" type="Function"></param>
        ///<retuns type="Array">Array</retuns>

        var res = [];

        for (var i = 0, l = this.length; i < l; i++) {
            var mass = selector ? selector.call(this[i], this[i], i) : this[i];

            for (var j = 0; j < mass.length; j++) {
                res.push(mass[j]);
            }
        }

        return res;
    };

    Array.concat = function (arrays) {
        var res = [];

        for (var i = 0; i < arrays.length; i++) {
            for (var j = 0; j < arrays[i].length; j++) {
                res.push(arrays[i][j]);
            }
        }

        return res;
    }

    Array.prototype.toDictionary = function (keySelector, valueSelector) {
        var res = {};

        for (var i = 0, l = this.length; i < l; i++) {
            var key = keySelector.call(this[i], this[i], i);
            res[key] = valueSelector ? valueSelector.call(this[i], this[i], i) : this[i];
        }

        return res;
    };


    Array.prototype.copyWithField = function (fieldName, obj) {
        ///<summary>возвращает копию массива с новым полем у каждого объекта</summary>
        var res = [];

        for (var i = 0; i < this.length; i++) {
            res.push(this[i]);
            res[i][fieldName] = obj;
        }
        return this;
    }

    //#endregion		

    //#region String

    String.prototype.format = function () {
        ///<summary>форматирует строку</summary>
        ///<param name="text" type="String">
        ///форматируемая строка. содержит подстановочные шаблоны {0}, {1}, {2} ..., 
        ///куда подставляются значения последующих аргументов
        ///</param>
        ///<retuns type="String">результат форматирования</retuns>
        var formatArgs = arguments;
        return this.replace(/\{(0|[1-9]\d*)\}/g,
                                function (match, number) {
                                    var argIndex = parseInt(number, 10);
                                    return argIndex < formatArgs.length ? formatArgs[argIndex] : match;
                                });
    };

    String.compare = function (a, b) {
        ///<summary>сравнивает строки a и b</summary>
        ///<param name="a" type="String"/>
        ///<param name="b" type="String"/>
        ///<retuns type="Number">a > b -> 1, a == b -> 0, a < b -> -1</returns>
        return a === b ? 0 : (a > b ? 1 : -1);
    };

    String.contains = function (a, b, ignoreCase) {
        ///<summary>проверяет, входит ли строка b в строку a</summary>
        ///<param name="a" type="String"/>
        ///<param name="b" type="String"/>
        ///<param name="ignoreCase" type="Boolean">игнорировать регистр. По умолчанию - false</param>
        ///<returns type="Boolean"/>
        if (a == null || b == null) return a == b;
        if (ignoreCase) {
            a = a.toLowerCase();
            b = b.toLowerCase();
        }
        return a.indexOf(b) !== -1;
    };

    String.prototype.trim = function () {
        ///<summary>Убирает пробелы с обеих сторон строки</summary>
        //return this.replace(/(^\s+|\s+$)/g, "");
        return this.replace(/^\s+/, "").replace(/\s+$/, ""); //это быстрее
    };

    String.evaluate = function (string) {
        return string ? string.replace(/\x3C%=(.*?)%\x3E/g,
                function (match, innerMatch) {
                    return eval(innerMatch) || "";
                }) : null;
    };

    //#endregion

    //#region Date

    Date.prototype.addSeconds = function (secs) {
        ///<summary>добавляет секунды к дате</summary>
        ///<param name="secs">количество секунд</summary>
        ///<returns type="Date">новая дата</returns>
        var res = new Date(this.valueOf());
        res.setSeconds(this.getSeconds() + secs);
        return res;
    };

    Date.prototype.addMinutes = function (mins) {
        ///<summary>добавляет секунды к дате</summary>
        ///<param name="secs">количество секунд</summary>
        ///<returns type="Date">новая дата</returns>
        var res = new Date(this.valueOf());
        res.setMinutes(this.getMinutes() + mins);
        return res;
    };

    Date.prototype.addHours = function (hours) {
        ///<summary>добавляет часы к дате</summary>
        ///<param name="hours">количество часов</summary>
        ///<returns type="Date">новая дата</returns>
        var res = new Date(this.valueOf());
        res.setHours(this.getHours() + hours);
        return res;
    };

    Date.prototype.addMonths = function (months) {
        ///<summary>добавляет дни к дате</summary>
        ///<param name="days">количество дней</summary>
        ///<returns type="Date">новая дата</returns>
        var res = new Date(this.valueOf());
        res.setMonth(this.getMonth() + months);
        return res;
    };

    Date.prototype.addYears = function (years) {
        ///<summary>добавляет дни к дате</summary>
        ///<param name="days">количество дней</summary>
        ///<returns type="Date">новая дата</returns>
        var res = new Date(this.valueOf());
        res.setYear(this.getYear() + years);
        return res;
    };

    Date.prototype.addDays = function (days) {
        ///<summary>добавляет дни к дате</summary>
        ///<param name="days">количество дней</summary>
        ///<returns type="Date">новая дата</returns>
        var res = new Date(this.valueOf());
        res.setDate(this.getDate() + days);
        return res;
    };

    Date.prototype.getDatePart = function () {
        ///<summary>отбрасывает времня от даты<summary>
        ///<returns type="Date">дата без времени (00:00:00.000)</returns>
        return new Date(this.getFullYear(), this.getMonth(), this.getDate());
    };

    Date.prototype.getWeek = function () {
        ///<summary>получает глобальный номер недели</summary>
        ///<retuns type="Number">номер недели, начиная с понедельника 29.12.1969</returns>
        //29.12.1969 = -259200000 мс, Лину(п)су Торвальдсу исполняется 1 день
        var absTime = this.valueOf() + 259200000 - this.getTimezoneOffset() * 60000;
        absTime = (absTime - absTime % 604800000) / 604800000; //число недель с базовой даты
        return absTime;
    };

    Date.prototype.getTotalSeconds = function () {
        return this.getHours() * 60 * 60 + this.getMinutes() * 60 + this.getSeconds();
    };

    Date.clone = function (d) {
        ///<summary>создает копию объекта Date, сохраняя миллисекунды (new Date(date) не сохраняет)</summary>
        ///<param name="d">копируемая дата</param>
        ///<returns type="Date" mayBeNull="true"></returns>
        //new Date(d.valueOf()) - чтобы миллисекунды не проебывал, как new Date(d)
        return d ? new Date(d.valueOf()) : null;
    };

    Date.prototype.toShortString = function () {
        return Date.format(this, DateFormat.Short);
    };

    Date.prototype.getWeekMonday = function () {
        ///<summary>возвращает понедельник для недели даты</summary>
        ///<returns type="Date" mayBeNull="false"></returns>
        var weekDay = this.getDay();
        return this.addDays(1 - (weekDay == 0 ? 7 : weekDay));
    };

    Date.prototype.getWeekOfYear = function () {
        var beginYear = new Date(this);
        beginYear.setDate(1);
        beginYear.setMonth(1);
        return 1 + this.getWeek() - beginYear.getWeek();
    };

    Date.prototype.getFirstDayOfMonth = function () {
        var res = new Date(this);
        res.setDate(1);
        return res;
    };

    //форматы дат
    var DateFormat =
        {
            Sql: "yyyy/MM/dd hh:mm:ss",
            PreciseSql: "yyyy/MM/dd hh:mm:ss.fff",
            Local: "dd.MM.yyyy hh:mm:ss",
            Short: "dd.MM.yyyy",
            Time: "hh:mm:ss",
            Precise: "dd.MM.yyyy hh:mm:ss.fff",
            MonthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            ShortMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            WeekDayNames: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        };

    Date.prototype.getWeekDay = function () {
        return DateFormat.WeekDayNames[this.getDay || 7];
    }

    Date.format = function (d, format) {
        ///<summary>форматирует дату</summary>
        ///<param name="d" type="Date">дата</param>
        ///<param name="format" type="String">формат</param>
        ///<retuns type="String">строковое представление даты</summary>

        // d+ - день
        // M+ - месяц,
        // MMM - короткое название месяца,
        // MMMM - полное название месяца
        // yy - 2 последние цифры года,
        // yyy+ - год
        // h+ - часы,
        // m+ - минуты,
        // s+ - секунды,
        // f{1,3} - миллисекунды
        return d == null ? "" :
                format.replace(/d+|M+|yy+|h+|m+|s+|f{1,3}/g,
                                function (match) {
                                    var len = match.length;
                                    switch (match.charAt(0)) {
                                        case "d": return Int.addLeadingZeros(d.getDate(), len);
                                        case "M":
                                            switch (len) {
                                                case 3: return DateFormat.ShortMonthNames[d.getMonth()];
                                                case 4: return DateFormat.MonthNames[d.getMonth()];
                                                default: return Int.addLeadingZeros(d.getMonth() + 1, len);
                                            };
                                        case "y": return Int.addLeadingZeros(len == 2 ? d.getFullYear() % 100 : d.getFullYear(), len);
                                        case "h": return Int.addLeadingZeros(d.getHours(), len);
                                        case "m": return Int.addLeadingZeros(d.getMinutes(), len);
                                        case "s": return Int.addLeadingZeros(d.getSeconds(), len);
                                        case "f": return Int.addLeadingZeros(d.getMilliseconds(), 3).substr(0, len);
                                    }
                                    return match;
                                }
                            );
    };

    Date.prototype.format = function (format) {
        return Date.format(this, format);
    };

    Date.parse = function (text, format) {
        ///<summary>получает дату из строки</summary>
        ///<param name="text" type="String">строка</param>
        ///<param name="format" type="String">формат</param>
        ///<retuns type="Date">полученная дата или null, если не удалось преобразовать</retuns>

        function getMatch(match) {
            ///<summary>получает часть строки, соответствующую заданному формату</summary>
            //("12.12.2008 05:58:50", "dd.MM.yyyy hh:mm:ss", "yyyy") = "2008"
            var pos = format.search(match);
            return (pos != -1) ? Int.parse(text.substr(pos, match.length)) : null;
        }

        var res = new Date(2008, 1, 1);
        //year
        var match = getMatch("yyyy");
        if (match !== null)
            res.setFullYear(match);
        else
            return null;
        //month
        match = getMatch("MM");
        if (match !== null)
            res.setMonth(match - 1);
        else
            return null;
        //day
        match = getMatch("dd");
        if (match !== null)
            res.setDate(match);
        else
            return null;
        //hour
        match = getMatch("hh");
        if (match !== null) res.setHours(match);
        //minute
        match = getMatch("mm");
        if (match !== null) res.setMinutes(match);
        //second
        match = getMatch("ss");
        if (match !== null) res.setSeconds(match);
        //millisecond
        match = getMatch("fff");
        if (match !== null) res.setMilliseconds(match);

        return res;
    };

    //преобразование дат из формата JavaScript в формат OleDB
    //JavaScript - число мс с 1.1.1970
    //OleDB - число дней с 30.12.1899
    Date.toOleDate = function (d) {
        return d == null ? null : d.getVarDate();
    };

    //преобразование дат из формата OleDB в формат JavaScript
    Date.fromOleDate = function (d) {
        return d == null ? null : new Date(d);
    };

    (function () {
        var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        Date.daysInMonth = function (month, year) {
            /// <summary>возвращает количество дней в месяце</summary>
            /// <param name="month" type="Number">номер месяца, начиная 0 (январь = 0, февраль = 1...)</param>
            /// <param name="year" type="Number">год</param>
            /// <returns type="Number">количество дней в месяце</returns>
            return (month == 1 && year % 4 == 0 && year % 400 != 0) ? 29 : days[month];
        };
    })();

    Date.prototype.toExcelDate = function () {
        return 25569.0 + ((this.getTime() - (this.getTimezoneOffset() * 60000)) / (60000 * 60 * 24));
    };
    //#endregion