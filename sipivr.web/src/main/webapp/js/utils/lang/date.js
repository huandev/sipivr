define(["utils/lang/int"], function (langInt) {
   return {
       addDays: function (date, days) {
           ///<summary>добавляет дни к дате</summary>
           ///<param name="days">количество дней</summary>
           ///<returns type="Date">новая дата</returns>
           var res = new Date(date.valueOf());
           res.setDate(date.getDate() + days);
           return res;
       },
       format: function (d, format) {
           return d == null ? "" :
               format.replace(/d+|M+|yy+|h+|m+|s+|f{1,3}/g,
                   function (match) {
                       var len = match.length;
                       switch (match.charAt(0)) {
                           case "d":
                               return langInt.addLeadingZeros(d.getDate(), len);
                           case "M":
                               switch (len) {
                                   case 3:
                                       return DateFormat.ShortMonthNames[d.getMonth()];
                                   case 4:
                                       return DateFormat.MonthNames[d.getMonth()];
                                   default:
                                       return langInt.addLeadingZeros(d.getMonth() + 1, len);
                               }
                               ;
                           case "y":
                               return langInt.addLeadingZeros(len == 2 ? d.getFullYear() % 100 : d.getFullYear(), len);
                           case "h":
                               return langInt.addLeadingZeros(d.getHours(), len);
                           case "m":
                               return langInt.addLeadingZeros(d.getMinutes(), len);
                           case "s":
                               return langInt.addLeadingZeros(d.getSeconds(), len);
                           case "f":
                               return langInt.addLeadingZeros(d.getMilliseconds(), 3).substr(0, len);
                       }
                       return match;
                   }
               );
       },
       getDatePart: function (date) {
           ///<summary>отбрасывает времня от даты<summary>
           ///<returns type="Date">дата без времени (00:00:00.000)</returns>
           return new Date(date.getFullYear(), date.getMonth(), date.getDate());
       },
       parse: function (text, format) {
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
           if (match !== null)
               res.setHours(match);
           //minute
           match = getMatch("mm");
           if (match !== null)
               res.setMinutes(match);
           //second
           match = getMatch("ss");
           if (match !== null)
               res.setSeconds(match);
           //millisecond
           match = getMatch("fff");
           if (match !== null)
               res.setMilliseconds(match);

           return res;

           //----------------------------------------------------
           function getMatch(match) {
               var pos = format.search(match);
               return (pos != -1) ? langInt.parse(text.substr(pos, match.length)) : null;
           }
       }
   }
});