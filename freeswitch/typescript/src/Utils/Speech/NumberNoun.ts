import { Noun } from "./Noun";
import { LexicalUnit } from "./LexicalUnit";
import { NumberType, Gender } from "./Enums";

export class NumberNoun extends Noun {
    NumValue: number;
    NumberType: NumberType;
    Unit: Noun;

    constructor(numValue?: number, unit?: Noun) {
        super();

        this.NumberType = NumberType.Cardinal;
        this.Gender = Gender.Masculine;
        this.NumValue = numValue === undefined ? 0 : numValue;
        this.Unit = unit === undefined ? null : unit;
    }

    clone(): LexicalUnit {
        let n = new NumberNoun();
        n.cloneFields(this);
        return n;
    }

    cloneFields(src: LexicalUnit) {
        super.cloneFields(src);
        let n = src as NumberNoun;
        this.NumValue = n.NumValue;
        this.NumberType = n.NumberType;
        if (n.Unit != null)
            this.Unit = n.Unit.clone() as Noun;
    }

    spell(): LexicalUnit[] {
        let res = super.spell();
        if (this.Unit != null) {
            this.Unit.spell().forEach(f => res.push(f))
        }
        return res;
    }

    getFileName(): string {
        let parts = [
            "sipivr.number",
            this.NumberType,
            this.Case,
            this.GrammaticalNumber,
            this.Gender,
            Math.floor(this.NumValue)
        ]
        return parts.join(this.Separator) + ".wav";
    }

    isNumberNoun(): boolean {
        return true;
    }
}