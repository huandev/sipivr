package ru.sipivr.speech.core;


import ru.sipivr.speech.enums.Case;
import ru.sipivr.speech.enums.Currency;
import ru.sipivr.speech.enums.Gender;

import java.util.HashMap;

/**
 * Created by Admin on 24.01.2016.
 */
public class PercentSpeller {
    private static final Noun unit;

    private NumberSpeller numberSpeller;

    static {
        unit = new Noun("sipivr.speech.percent", "percent");
        unit.setCaseType(Case.Genitive);
    }

    public PercentSpeller(NumberSpeller numberSpeller) {
        this.numberSpeller = numberSpeller;
    }

    public CompositeLexicalUnit spell(double amount) {
        amount = numberSpeller.round(amount, 2);
        CompositeLexicalUnit res = new CompositeLexicalUnit();
        res.getChildren().add(numberSpeller.decomposeNumber(new NumberNoun(amount)));
        res.getChildren().add(unit);

        return res;
    }
}