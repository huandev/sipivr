import { Gender, Case, GrammaticalNumber } from "./Enums";

export abstract class LexicalUnit {
    Gender: Gender;
    Case: Case;
    GrammaticalNumber: GrammaticalNumber;

    readonly Separator = "/";

    constructor() {
        this.Gender = Gender.Neuter;
        this.Case = Case.Nominative;
        this.GrammaticalNumber = GrammaticalNumber.Singular;
    }

    clone(): LexicalUnit {
        throw new Error("LexicalUnit.clone");
    }

    setCase(value: Case): LexicalUnit {
        this.Case = value;
        return this;
    }

    cloneFields(src: LexicalUnit) {
        this.Gender = src.Gender;
        this.Case = src.Case;
        this.GrammaticalNumber = src.GrammaticalNumber;
    }

    setGender(value: Gender): LexicalUnit {
        this.Gender = value;
        return this;
    }

    abstract getChildren(): LexicalUnit[];

    /// <summary>
    /// transforms this Lexical unit into most basic Lexical units
    /// </summary>
    /// <returns></returns>
    spell(): LexicalUnit[] {
        let res: LexicalUnit[] = [];
        this.getChildren().forEach(f => {
            f.spell().forEach(c => res.push(f));
        });
        return res;
    }

    abstract getFileName(): string;
}