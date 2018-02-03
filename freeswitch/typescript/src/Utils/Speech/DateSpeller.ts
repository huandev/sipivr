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

    static spellWithoutYear(date: Date, caseType?: Case): LexicalUnit[] {
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

        return res;
    }
}