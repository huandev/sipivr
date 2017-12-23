define([], function(){
    return {
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
    }
});