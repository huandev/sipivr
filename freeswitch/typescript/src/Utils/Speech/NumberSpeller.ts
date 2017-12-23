import { LexicalUnit } from "./LexicalUnit";
import { NumberNoun } from "./NumberNoun";
import { Noun } from "./Noun";
import { Gender, NumberType, GrammaticalNumber, Case } from "./Enums";

export class NumberSpeller {
    static spell(number: number): LexicalUnit[] {
        return this.decomposeNumber(new NumberNoun(number));
    }

    static decomposeNumber(n: NumberNoun): LexicalUnit[] {
        if (!isFinite(n.NumValue)) {
            throw new Error("NumberSpeller.decomposeNumber " + n.NumValue + " is not finite");
        }

        //we preserve original number
        let number = n.clone() as NumberNoun;

        let res: LexicalUnit[] = [];

        if (number.NumValue < 0)
            res.push(new Noun(null, "Minus"));

        number.NumValue = Math.abs(number.NumValue);
        //Only 2 fraction digits are supported

        number.NumValue = this.round(number.NumValue);

        let wholePart = Math.floor(number.NumValue);

        //calculating fractional part and denominator
        let denominator = this.getDenominator(number.NumValue);

        let fractionalPart = this.round((number.NumValue - wholePart) * denominator);

        //decompose integer
        if (fractionalPart == 0) {
            this.decomposeInteger(number).forEach(f => res.push(f));
        } else {
            let intPart = new NumberNoun(wholePart);
            intPart.Case = number.Case;

            let intPartUnit = new Noun(null, "Separator");
            intPartUnit.Gender = Gender.Feminine;
            intPartUnit.Case = number.Case;

            intPart.Unit = intPartUnit;
            this.decomposeInteger(intPart).forEach(f => res.push(f));

            let fracPart = new NumberNoun(fractionalPart);
            fracPart.Case = number.Case;


            let fracPartUnit = new NumberNoun(denominator);
            fracPartUnit.Gender = Gender.Feminine;
            fracPartUnit.NumberType = NumberType.Ordinal;
            fracPartUnit.Unit = number.Unit;

            fracPart.Unit = fracPartUnit;
            this.decomposeInteger(fracPart).forEach(f => res.push(f));

            //in fractional number, the unit is always converted to singular genitive
            //in this implementaion, it is safe to do this in the end (since unit remains the same object through all operations)
            number.Unit = fracPart.Unit.clone() as NumberNoun;
            number.Unit.GrammaticalNumber = GrammaticalNumber.Singular;
            number.Unit.Case = Case.Genitive;
        }
        return res;
    }

    /// <summary>
    /// finds denominator of a fractional part
    /// </summary>
    static getDenominator(number: number): number {
        number = Math.abs(number);

        number = this.round(number - this.truncate(number));
        let testFPart = 0;
        let denominator = 1;
        do {
            denominator *= 10;
            testFPart = denominator * number;
        } while (testFPart - this.truncate(testFPart) > 1e-12);
        return denominator;
    }

    static truncate(number: number): number {
        return number >= 0 ? Math.floor(number) : Math.ceil(number);
    }

    static round(number: number, precision?: number): number {
        let m = Math.pow(10, precision === undefined ? 2 : precision);
        return Math.round(number * m) / m;
    }

    private static decomposeInteger(n: NumberNoun): Noun[] {
        if (n.NumValue == 0) {
            return this.decomposeGroup(n);
        }

        let res: Noun[] = [];
        let groups: NumberNoun[] = [];

        //separating into groups of 3 digits (in order: ones, thousands, millions...)
        let value = n.NumValue;
        let multiplier = 1;

        while (value != 0) {
            let group = value % 1000;
            value = Math.floor(value / 1000);
            if (group != 0) {
                let gr = new NumberNoun(group);
                if (multiplier > 1) { //group name (thousands, millions etc...)

                    let nm = new NumberNoun(multiplier);
                    nm.Gender = multiplier == 1000 ? Gender.Feminine : Gender.Masculine;
                    gr.Unit = nm;
                }
                //n may be ordinal
                if (n.NumberType == NumberType.Ordinal) {
                    if (groups.length == 0) //last group (since they are reversed, it will be first)
                    {
                        gr.NumberType = NumberType.Ordinal;
                        gr.Case = n.Case;
                        gr.Gender = n.Gender;
                        gr.GrammaticalNumber = n.GrammaticalNumber;
                    }
                } else {
                    gr.Case = n.Case;
                    gr.Gender = n.Gender;
                    gr.GrammaticalNumber = n.GrammaticalNumber;
                }

                //last group inherits the unit
                if (groups.length == 0) {
                    if (gr.Unit == null)
                        gr.Unit = n.Unit;
                    else
                        gr.Unit = n.Unit;
                }
                groups.push(gr);
            }
            multiplier *= 1000;
        }
        //special rules
        //1 тысяча => тысяча
        //Number last = groups[groups.Count - 1];
        //Number lastUnit = last.Unit as Number;
        //if (last.getNumValue() == 1 && lastUnit != null && lastUnit.getNumValue() == 1000)
        //{
        //	last = groups[groups.Count - 1] = lastUnit;
        //}

        for (let i = groups.length - 1; i >= 0; i--) {
            this.decomposeGroup(groups[i]).forEach(f => res.push(f));
        }

        return res;
    }

    private static decomposeToSingleDigits(n: NumberNoun): Noun[] {
        //n - 0 - 999
        let res: Noun[] = [];
        let group = Math.floor(n.NumValue);
        if (group == 0) {
            res.push(new NumberNoun(0));
            return res;
        }

        let hundreds = Math.floor(group / 100);
        if (hundreds != 0) {
            res.push(new NumberNoun(hundreds * 100));
        }

        let tens = Math.floor((group % 100) / 10);
        if (tens != 0 && tens != 1) // for numbers >= 20
        {
            res.push(new NumberNoun(tens * 10));
        }

        let ones = Math.floor(group % 10);
        if (tens == 1) //10, 11, 12...
        {
            res.push(new NumberNoun(10 + ones));
        } else if (ones != 0) {
            res.push(new NumberNoun(ones));
        }

        return res;
    }

    private static decomposeGroup(n: NumberNoun): Noun[] {
        let res = this.decomposeToSingleDigits(n);

        //inheriting grammar categories
        let last = res[res.length - 1] as NumberNoun;
        //applying categories
        if (n.NumberType === NumberType.Cardinal) {
            res.forEach(f => f.Case = n.Case);
        } else {
            last.Case = n.Case;
        }

        last.NumberType = n.NumberType;
        last.Gender = n.Gender;


        //last digit may have unit attached
        last.Unit = n.Unit;
        if (last.Unit != null) {
            this.syncUnit(last);
            if (last.isNumberNoun()) {
                res.push(last.Unit);
                last.Unit = null;
            }
        }
        return res;
    }

    private static syncUnit(n: NumberNoun): void {
        let numUnit: NumberNoun = n.Unit.isNumberNoun() ? n.Unit as NumberNoun : null;
        if (n.NumberType == NumberType.Cardinal) {
            if (n.Unit.Gender == Gender.Feminine && (n.NumValue == 1 || n.NumValue == 2))
                n.Gender = Gender.Feminine;

            //separator and fraction name use different rules
            if (n.Unit.Tag === "Separator" || (numUnit != null && numUnit.NumberType === NumberType.Ordinal))
                n.Unit.GrammaticalNumber = n.NumValue == 1 ? GrammaticalNumber.Singular : GrammaticalNumber.Plural;
            else //numbers ending with 1 - 4 use singular number
                n.Unit.GrammaticalNumber = n.NumValue >= 1 && n.NumValue <= 4 ? GrammaticalNumber.Singular : GrammaticalNumber.Plural;

            //numbers ending with anything else than 1 change nominative case to genitive
            n.Unit.Case = (n.NumValue != 1 && n.Case == Case.Nominative ? Case.Genitive : n.Case);
        } else {
            //todo ordinal
        }

        if (numUnit != null && numUnit.Unit != null)
            this.syncUnit(numUnit);
    }
}
