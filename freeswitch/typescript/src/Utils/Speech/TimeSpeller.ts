import { Noun } from "./Noun";
import { NumberNoun } from "./NumberNoun";
import { NumberSpeller } from "./NumberSpeller";
import { LexicalUnit } from "./LexicalUnit";
import { Case, Gender } from "./Enums";

export class TimeSpeller {
    private static hourUnit = new Noun("hour", "sipivr.time").setCase(Case.Genitive).setGender(Gender.Masculine) as Noun;
    private static minuteUnit = new Noun("minute", "sipivr.time").setCase(Case.Genitive).setGender(Gender.Feminine) as Noun;

    static spell(hour: number, minute: number): LexicalUnit[] {
        let res: LexicalUnit[] = [];
        NumberSpeller.decomposeNumber(new NumberNoun(hour, this.hourUnit)).forEach(f => res.push(f));
        NumberSpeller.decomposeNumber(new NumberNoun(minute, this.minuteUnit)).forEach(f => res.push(f));
        return res;
    }

    static parse(text: string, format = "hh:mm:ss.fff") {
        var res = new Date(2008, 1, 1);
        var match = getMatch("hh");

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
        function getMatch(match: string): number {
            var pos = format.search(match);
            return (pos != -1) ? parseInt(text.substr(pos, match.length), 10) : null;
        }
    }
}