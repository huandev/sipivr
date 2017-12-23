import { Noun } from "./Noun";
import { NumberNoun } from "./NumberNoun";
import { NumberSpeller } from "./NumberSpeller";
import { Case } from "./Enums";
import { LexicalUnit } from "./LexicalUnit";

export class PercentSpeller {
    private static unit: Noun;

    static initialize() {
        this.unit = new Noun("percent", "sipivr.speech.percent");
        this.unit.Case = Case.Genitive;
    }

    static spell(amount: number): LexicalUnit[] {
        amount = NumberSpeller.round(amount, 2);
        let res: LexicalUnit[] = [];
        NumberSpeller.decomposeNumber(new NumberNoun(amount)).forEach(f => res.push(f));
        res.push(this.unit);

        return res;
    }
}

PercentSpeller.initialize();