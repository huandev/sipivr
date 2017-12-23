export type Case = "nom" | "gen" | "dat" | "acc" | "ins" | "pre";
export const Case = {
    /**именительный */
    Nominative: "nom" as Case,
    /**родительный */
    Genitive: "gen" as Case,
    /**дательный */
    Dative: "dat" as Case,
    /**винительный */
    Accusative: "acc" as Case,
    /**творительный */
    Instrumental: "ins" as Case,
    /**предложный */
    Prepositional: "pre" as Case,
};

export type NumberType = "cardinal" | "ordinal";
export const NumberType = {
    /**количественное число */
    Cardinal: "cardinal" as NumberType,
    /**порядковый номер */
    Ordinal: "ordinal" as NumberType,
};

export type Gender = "neu" | "mas" | "fem";
export const Gender = {
    /**нейтральный */
    Neuter: "neu" as Gender,
    /**мужской */
    Masculine: "mas" as Gender,
    /**женский */
    Feminine: "fem" as Gender,
};

export type GrammaticalNumber = "sing" | "plr";
export const GrammaticalNumber = {
    /**единственное число */
    Singular: "sing" as GrammaticalNumber,
    /**множественное число */
    Plural: "plr" as GrammaticalNumber,
};

export type Currency = "RUB" | "USD" | "EUR" | "GBP" | "CHF" | "JPY" | "UAH" | "NOK" | "SEK" | "DKK" | "NZD" | "AUD" | "CAD";
export const Currency = {
    /**Рубли*/
    RUB: "RUB" as Currency,
    /**Доллары*/
    USD: "USD" as Currency,
    /**Евро*/
    EUR: "EUR" as Currency,
    /**Английский фунт*/
    GBP: "GBP" as Currency,
    /**Швейцарский франк*/
    CHF: "CHF" as Currency,
    /**Японская йена*/
    JPY: "JPY" as Currency,
    /**Украинская гривна*/
    UAH: "UAH" as Currency,
    /**Норвежская крона*/
    NOK: "NOK" as Currency,
    /**Шведская крона*/
    SEK: "SEK" as Currency,
    /**Датская крона*/
    DKK: "DKK" as Currency,
    /**Новозеландский доллар*/
    NZD: "NZD" as Currency,
    /**Австралийский доллар*/
    AUD: "AUD" as Currency,
    /**Канадский доллар*/
    CAD: "CAD" as Currency,
};