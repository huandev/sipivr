package ru.sipivr.speech.core;

import ru.sipivr.speech.enums.*;

import java.util.List;

/**
 * Created by okarpukhin on 14.01.2016.
 */
public class NumberNoun extends Noun {
    private double numValue;
    private NumberType numberType;
    private Noun unit;

    public NumberNoun() {
        this(0);
    }

    public NumberNoun(double numValue) {
        this(numValue, null);
    }

    public NumberNoun(double numValue, Noun unit) {
        numberType = NumberType.Cardinal;
        gender = Gender.Masculine;

        this.numValue = numValue;
        this.unit = unit;
    }

    public double getNumValue() {
        return numValue;
    }

    public void setNumValue(double numValue) {
        this.numValue = numValue;
    }

    public NumberType getNumberType() {
        return numberType;
    }

    public void setNumberType(NumberType numberType) {
        this.numberType = numberType;
    }

    public Noun getUnit() {
        return unit;
    }

    public void setUnit(Noun unit) {
        this.unit = unit;
    }

    @Override
    public String toString() {
        return String.format("{{%s, %s, %s, %s, %s}}",
                numValue,
                caseType,
                grNumber,
                gender,
                numberType
        );
    }

    @Override
    public LexicalUnit clone() {
        NumberNoun n = new NumberNoun();
        n.cloneFields(this);
        return n;
    }

    @Override
    protected void cloneFields(LexicalUnit src) {
        super.cloneFields(src);
        NumberNoun n = (NumberNoun) src;
        numValue = n.numValue;
        numberType = n.numberType;
        if (n.unit != null)
            unit = (Noun) n.unit.clone();
    }

    @Override
    public List<LexicalUnit> spell() {
        List<LexicalUnit> res = super.spell();
        if (unit != null) {
            res.addAll(unit.spell());
        }
        return res;
    }
}