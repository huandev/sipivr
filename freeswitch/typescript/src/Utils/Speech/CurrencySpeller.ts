import { Noun } from "./Noun";
import { NumberNoun } from "./NumberNoun";
import { LexicalUnit } from "./LexicalUnit";
import { NumberSpeller } from "./NumberSpeller";
import { Case, NumberType, Gender, Currency } from "./Enums";

export class CurrencySpeller {
    private static folder = "sipivr.speech.currency";
    private static readonly currencyNames: { [key: string]: { major: Noun, minor: Noun } } = {};

    static initialize() {
        this.currencyNames[Currency.RUB] = { major: new Noun("Ruble", this.folder), minor: new Noun("Kopeck", this.folder).setGender(Gender.Feminine) as Noun };
        this.currencyNames[Currency.USD] = { major: new Noun("Dollar", this.folder), minor: new Noun("Cent", this.folder) };
        this.currencyNames[Currency.EUR] = { major: new Noun("Euro", this.folder), minor: new Noun("Eurocent", this.folder) };
        this.currencyNames[Currency.JPY] = { major: new Noun("JPY", this.folder).setGender(Gender.Feminine) as Noun, minor: null };
        this.currencyNames[Currency.GBP] = { major: new Noun("GBP", this.folder), minor: new Noun("Pence", this.folder) };
        this.currencyNames[Currency.CHF] = { major: new Noun("CHF", this.folder), minor: new Noun("Centime", this.folder) };
        this.currencyNames[Currency.NOK] = { major: new Noun("NOK", this.folder).setGender(Gender.Feminine) as Noun, minor: new Noun("Ore", this.folder) };
        this.currencyNames[Currency.SEK] = { major: new Noun("SEK", this.folder).setGender(Gender.Feminine) as Noun, minor: new Noun("Ore", this.folder) };
        this.currencyNames[Currency.DKK] = { major: new Noun("DKK", this.folder).setGender(Gender.Feminine) as Noun, minor: new Noun("Ore", this.folder) };
        this.currencyNames[Currency.NZD] = { major: new Noun("NZD", this.folder), minor: new Noun("Cent", this.folder) };
        this.currencyNames[Currency.AUD] = { major: new Noun("AUD", this.folder), minor: new Noun("Cent", this.folder) };
        this.currencyNames[Currency.CAD] = { major: new Noun("CAD", this.folder), minor: new Noun("Cent", this.folder) };
    }

    static spell(amount: number, currency: Currency): LexicalUnit[] {
        amount = NumberSpeller.round(amount, 2);
        let res: LexicalUnit[] = [];
        let wholePart = NumberSpeller.truncate(amount);
        let fracPart = Math.abs((amount - wholePart)) * 100;

        let cn = this.currencyNames[currency];

        if (Math.abs(amount) >= 1 || amount == 0) {
            let unit = cn.major;
            let wholeSpelling = new NumberNoun(wholePart, unit);
            NumberSpeller.decomposeNumber(wholeSpelling).forEach(f => res.push(f));
        }
        if (fracPart != 0 && cn.minor != null) {
            let unit = cn.minor;
            let fracSpelling = new NumberNoun(fracPart, unit);
            NumberSpeller.decomposeNumber(fracSpelling).forEach(f => res.push(f));
        }
        return res;
    }
}

CurrencySpeller.initialize();