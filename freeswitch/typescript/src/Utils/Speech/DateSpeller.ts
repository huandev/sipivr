import { Noun } from "./Noun";
import { NumberNoun } from "./NumberNoun";
import { LexicalUnit } from "./LexicalUnit";
import { NumberSpeller } from "./NumberSpeller";
import { Case, NumberType, Gender } from "./Enums";

export class DateSpeller {
    private static MonthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ]

    static spell(date: Date, caseType?: Case): LexicalUnit[] {
        if (caseType === undefined) {
            caseType = Case.Nominative;
        }

        let res: LexicalUnit[] = [];

        let dayOfMonth = new NumberNoun(date.getDate());
        dayOfMonth.NumberType = NumberType.Ordinal;
        dayOfMonth.Gender = Gender.Neuter;
        dayOfMonth.Case = caseType;
        //  return Objects.equals(n.getValue(), "Year") ? String.format("Date/Year_%s", n.getCaseType().getValue()) : TranslateNoun(n);

        NumberSpeller.decomposeNumber(dayOfMonth).forEach(f => res.push(f));
        res.push(new Noun(DateSpeller.MonthNames[date.getMonth()], "sipivr.date", false));

        let yearNumberNoun = new NumberNoun(date.getFullYear());
        yearNumberNoun.Case = Case.Genitive;
        yearNumberNoun.Gender = Gender.Neuter;
        yearNumberNoun.NumberType = NumberType.Ordinal;

        NumberSpeller.decomposeNumber(yearNumberNoun).forEach(f => res.push(f));

        res.push(new Noun("year_" + Case.Genitive, "sipivr.date", false));

        return res;
    }

    static spellWithoutYear(date: Date, caseType = Case.Nominative): LexicalUnit[] {
        let res: LexicalUnit[] = [];

        let dayOfMonth = new NumberNoun(date.getDate());
        dayOfMonth.NumberType = NumberType.Ordinal;
        dayOfMonth.Gender = Gender.Neuter;
        dayOfMonth.Case = caseType;
        //  return Objects.equals(n.getValue(), "Year") ? String.format("Date/Year_%s", n.getCaseType().getValue()) : TranslateNoun(n);

        NumberSpeller.decomposeNumber(dayOfMonth).forEach(f => res.push(f));
        res.push(new Noun(DateSpeller.MonthNames[date.getMonth()], "sipivr.date", false));

        return res;
    }

    static parse(text: string, format = "yyyy-MM-dd hh:mm:ss.fff") {
        var res = new Date(2008, 1, 1);
        var match = getMatch("yyyy");
        if (match !== null)
            res.setFullYear(match);
        else
            return null;
        
        match = getMatch("MM");
        if (match !== null)
            res.setMonth(match - 1);
        else
            return null;

        match = getMatch("dd");
        if (match !== null)
            res.setDate(match);
        else
            return null;

        match = getMatch("hh");
        if (match !== null)
            res.setHours(match);

        match = getMatch("mm");
        if (match !== null)
            res.setMinutes(match);

        match = getMatch("ss");
        if (match !== null)
            res.setSeconds(match);

        match = getMatch("fff");
        if (match !== null)
            res.setMilliseconds(match);

        return res;

        //----------------------------------------------------
        function getMatch(match: string): number {
            var pos = format.search(match);
            return (pos != -1) ? parseInt(text.substr(pos, match.length), 10) : null;
        }
    }
}