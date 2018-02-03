import { NumberSpeller } from "./NumberSpeller";
import { DateSpeller } from "./DateSpeller";
import { CurrencySpeller } from "./CurrencySpeller";
import { PercentSpeller } from "./PercentSpeller";
import { Currency } from "./Enums";
import { LexicalUnit } from "./LexicalUnit";

export class SpeechManager {
    Sound: (name: string, inputMode?: boolean) => string;

    constructor(sound: (name: string, inputMode?: boolean) => string) {
        this.Sound = sound;
    }

    private sound(units: LexicalUnit[], inputMode?: boolean): string {
        let input: string = null;
        units.every(f => {
            input = this.Sound(f.getFileName(), inputMode);
            return input === null;
        });
        return input;
    }

    number(value: number, inputMode?: boolean): string {
        return this.sound(NumberSpeller.spell(value), inputMode);
    }

    date(value: Date, inputMode?: boolean): string {
        return this.sound(DateSpeller.spell(value), inputMode);
    }

    currency(value: number, currency: Currency, inputMode?: boolean): string {
        return this.sound(CurrencySpeller.spell(value, currency), inputMode);
    }

    percent(value: number, inputMode?: boolean): string {
        return this.sound(PercentSpeller.spell(value), inputMode);
    }
}