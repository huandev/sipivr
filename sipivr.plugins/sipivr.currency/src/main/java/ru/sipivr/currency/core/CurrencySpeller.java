package ru.sipivr.currency.core;


import ru.sipivr.currency.enums.Currency;
import ru.sipivr.number.core.*;
import ru.sipivr.number.enums.Gender;

import java.util.HashMap;

/**
 * Created by Admin on 24.01.2016.
 */
public class CurrencySpeller {
    public static class CurrencyNames {
        private final Noun majorName;
        private final Noun minorName;

        public CurrencyNames(Noun majorName) {
            this(majorName, null);
        }

        public CurrencyNames(Noun majorName, Noun minorName) {
            this.majorName = majorName;
            this.minorName = minorName;
        }

        public Noun getMajorName() {
            return majorName;
        }

        public Noun getMinorName() {
            return minorName;
        }
    }

    private static final String folder = "sipivr.speech.currency";
    private static HashMap<Currency, CurrencyNames> currencyNames;

    static {
        currencyNames = new HashMap<>();
        currencyNames.put(Currency.RUB, new CurrencyNames(new Noun(folder, "Ruble"), (Noun) new Noun(folder, "Kopeck").setGender(Gender.Feminine)));
        currencyNames.put(Currency.USD, new CurrencyNames(new Noun(folder, "Dollar"), new Noun(folder, "Cent")));
        currencyNames.put(Currency.EUR, new CurrencyNames(new Noun(folder, "Euro"), new Noun(folder, "Eurocent")));
        currencyNames.put(Currency.JPY, new CurrencyNames((Noun) new Noun(folder, "JPY").setGender(Gender.Feminine)));
        currencyNames.put(Currency.GBP, new CurrencyNames(new Noun(folder, "GBP"), new Noun(folder, "Pence")));
        currencyNames.put(Currency.CHF, new CurrencyNames(new Noun(folder, "CHF"), new Noun(folder, "Centime")));
        currencyNames.put(Currency.NOK, new CurrencyNames((Noun) new Noun(folder, "NOK").setGender(Gender.Feminine), new Noun(folder, "Ore")));
        currencyNames.put(Currency.SEK, new CurrencyNames((Noun) new Noun(folder, "SEK").setGender(Gender.Feminine), new Noun(folder, "Ore")));
        currencyNames.put(Currency.DKK, new CurrencyNames((Noun) new Noun(folder, "DKK").setGender(Gender.Feminine), new Noun(folder, "Ore")));
        currencyNames.put(Currency.NZD, new CurrencyNames(new Noun(folder, "NZD"), new Noun(folder, "Cent")));
        currencyNames.put(Currency.AUD, new CurrencyNames(new Noun(folder, "AUD"), new Noun(folder, "Cent")));
        currencyNames.put(Currency.CAD, new CurrencyNames(new Noun(folder, "CAD"), new Noun(folder, "Cent")));
    }

    private NumberSpeller numberSpeller;

    public CurrencySpeller(NumberSpeller numberSpeller)
    {
        this.numberSpeller = numberSpeller;
    }

    public CompositeLexicalUnit spell( double amount, Currency currency )
    {
        amount = numberSpeller.round(amount, 2);
        CompositeLexicalUnit res = new CompositeLexicalUnit();
        double wholePart = numberSpeller.truncate(amount);
        double fracPart = Math.abs((amount - wholePart)) * 100;

        CurrencyNames cn = currencyNames.get(currency);

        if (Math.abs(amount) >= 1 || amount == 0)
        {
            Noun unit = cn.getMajorName();
            NumberNoun wholeSpelling = new NumberNoun(wholePart, unit);
            res.getChildren().add(numberSpeller.decomposeNumber(wholeSpelling));
        }
        if (fracPart != 0 && cn.getMinorName() != null)
        {
            Noun unit = cn.getMinorName();
            NumberNoun fracSpelling = new NumberNoun(fracPart, unit);
            res.getChildren().add(numberSpeller.decomposeNumber(fracSpelling));
        }
        return res;
    }
}
