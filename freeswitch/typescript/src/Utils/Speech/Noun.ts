import { LexicalUnit } from "./LexicalUnit";
import { GrammaticalNumber, Case } from "./Enums";

export class Noun extends LexicalUnit {
    Value: string;
    Tag: string;
    /** whether translator will look at the categories when calculating file name */
    ApplyCategories: boolean;

    constructor(value?: string, tag?: string, applyCategories?: boolean) {
        super();
        this.Value = value === undefined ? null : value;
        this.Tag = tag === undefined ? null : tag;
        this.ApplyCategories = applyCategories === undefined ? true : applyCategories;
    }

    clone(): LexicalUnit {
        let res = new Noun();
        res.cloneFields(this);
        return res;
    }

    cloneFields(src: LexicalUnit) {
        let n = src as Noun;
        this.Tag = n.Tag;
        this.Value = n.Value;
        this.ApplyCategories = n.ApplyCategories;
        super.cloneFields(src);
    }

    getChildren(): LexicalUnit[] {
        throw new Error();
    }

    spell(): LexicalUnit[] {
        let res: LexicalUnit[] = [];
        res.push(this);
        return res;
    }

    getFileName(): string {
        let res: string;
        switch (this.Tag) {
            case "Separator": //слово "целых"
                res = "sipivr.number/int_" + this.Case + "_" + this.GrammaticalNumber;
                break;
            case "Minus":
                res = "sipivr.number/minus";
                break;
            case "Point":
                res = "sipivr.number/point";
                break;
            default:
                let parts: string[] = this.Tag !== null ? [this.Tag] : [];

                if (this.ApplyCategories) {
                    parts.push(this.Case);
                    parts.push(this.GrammaticalNumber);
                }

                parts.push(this.Value);
                res = parts.join(this.Separator);
                break;
        }
        return res + ".wav";
    }

    isNumberNoun(): boolean {
        return false;
    }
}