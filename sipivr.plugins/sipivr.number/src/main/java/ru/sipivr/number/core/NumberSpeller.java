package ru.sipivr.number.core;

import ru.sipivr.number.enums.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Created by okarpukhin on 14.01.2016.
 */
public class NumberSpeller {
    private static final int precision = 2;

    /// <summary>
    /// decomposes a number into whole and fractional part
    /// </summary>
    public CompositeLexicalUnit decomposeNumber(NumberNoun n) {
        //we preserve original number
        NumberNoun number = (NumberNoun) n.clone();

        List<LexicalUnit> res = new ArrayList<>();

        if (number.getNumValue() < 0)
            res.add(new Noun("Minus", null));

        number.setNumValue(Math.abs(number.getNumValue()));
        //Only 2 fraction digits are supported

        number.setNumValue(round(number.getNumValue()));

        double wholePart = Math.floor(number.getNumValue());

        //calculating fractional part and denominator
        double denominator = getDenominator(number.getNumValue());

        double fractionalPart = round((number.getNumValue() - wholePart) * denominator);

        //decompose integer
        if (fractionalPart == 0) {
            res.addAll(decomposeInteger(number));
        } else {
            NumberNoun intPart = new NumberNoun(wholePart);
            intPart.setCaseType(number.getCaseType());

            Noun intPartUnit = new Noun("Separator", null);
            intPartUnit.setGender(Gender.Feminine);
            intPartUnit.setCaseType(number.getCaseType());
            intPart.setUnit(intPartUnit);
            res.addAll(decomposeInteger(intPart));

            NumberNoun fracPart = new NumberNoun(fractionalPart);
            fracPart.setCaseType(number.getCaseType());

            NumberNoun fracPartUnit = new NumberNoun(denominator) ;
            fracPartUnit.setGender(Gender.Feminine);
            fracPartUnit.setNumberType(NumberType.Ordinal);
            fracPartUnit.setUnit(number.getUnit());
            fracPart.setUnit(fracPartUnit);
            res.addAll(decomposeInteger(fracPart));

            //in fractional number, the unit is always converted to singular genitive
            //in this implementaion, it is safe to do this in the end (since unit remains the same object through all operations)
            number.setUnit((NumberNoun) fracPart.getUnit().clone());
            number.getUnit().setGrNumber(GrammaticalNumber.Singular);
            number.getUnit().setCaseType(Case.Genitive);
        }
        return new CompositeLexicalUnit(res);
    }

    /// <summary>
    /// decomposes integer number into number groups
    /// </summary>
    private List<Noun> decomposeInteger(NumberNoun n) {
        if (n.getNumValue() == 0) {
            return decomposeGroup(n);
        }

        List<Noun> res = new ArrayList<>();
        List<NumberNoun> groups = new ArrayList<>();

        //separating into groups of 3 digits (in order: ones, thousands, millions...)
        double value = n.getNumValue();
        double multiplier = 1;

        while (value != 0) {
            double group = value % 1000;
            value = Math.floor(value / 1000);
            if (group != 0) {
                NumberNoun gr = new NumberNoun(group);
                if (multiplier > 1) { //group name (thousands, millions etc...)

                    NumberNoun nm = new NumberNoun(multiplier);
                    nm.setGender(multiplier == 1000 ? Gender.Feminine : Gender.Masculine);
                    gr.setUnit(nm);
                }
                //n may be ordinal
                if (n.getNumberType() == NumberType.Ordinal) {
                    if (groups.size() == 0) //last group (since they are reversed, it will be first)
                    {
                        gr.setNumberType(NumberType.Ordinal);
                        gr.setCaseType(n.getCaseType());
                        gr.setGender(n.getGender());
                        gr.setGrNumber(n.getGrNumber());
                    }
                } else {
                    gr.setCaseType(n.getCaseType());
                    gr.setGender(n.getGender());
                    gr.setGrNumber(n.getGrNumber());
                }

                //last group inherits the unit
                if (groups.size() == 0) {
                    if (gr.getUnit() == null)
                        gr.setUnit(n.getUnit());
                    else
                        ((NumberNoun) gr.getUnit()).setUnit(n.getUnit());
                }
                groups.add(gr);
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

        for (int i = groups.size() - 1; i >= 0; i--) {
            res.addAll(decomposeGroup(groups.get(i)));
        }
        return res;
    }

    /// <summary>
    /// decomposes a number group into basic numbers and applies grammatical forms to number and its units
    /// </summary>
    private List<Noun> decomposeGroup(NumberNoun n) {
        List<Noun> res = decomposeToSingleDigits(n);

        //inheriting grammar categories
        NumberNoun last = (NumberNoun) res.get(res.size() - 1);
        //applying categories
        if (n.getNumberType() == NumberType.Cardinal) {
            for(Noun num : res)
            num.setCaseType(n.getCaseType());
        } else {
            last.setCaseType(n.getCaseType());
        }
        last.setNumberType(n.getNumberType());
        last.setGender(n.getGender());


        //last digit may have unit attached
        last.setUnit(n.getUnit());
        if (last.getUnit() != null) {
            syncUnit(last);
            if (last.getUnit().getClass() == NumberNoun.class)
            {
                res.add(last.getUnit());
                last.setUnit(null);
            }
        }
        return res;
    }

    /// <summary>
    /// decomposes a number group into basic numbers
    /// </summary>
    private List<Noun> decomposeToSingleDigits(NumberNoun n) {
        //n - 0 - 999
        List<Noun> res = new ArrayList<Noun>();
        int group = (int) n.getNumValue();
        if (group == 0) {
            res.add(new NumberNoun(0));
            return res;
        }

        int hundreds = group / 100;
        if (hundreds != 0) {
            res.add(new NumberNoun(hundreds * 100));
        }

        int tens = (group % 100) / 10;
        if (tens != 0 && tens != 1) // for numbers >= 20
        {
            res.add(new NumberNoun(tens * 10));
        }

        int ones = group % 10;
        if (tens == 1) //10, 11, 12...
        {
            res.add(new NumberNoun(10 + ones));
        } else if (ones != 0) {
            res.add(new NumberNoun(ones));
        }
        return res;
    }

    /// <summary>
    /// syncs number unit with number itself
    /// </summary>
    private void syncUnit(NumberNoun n) {
        NumberNoun numUnit = n.getUnit().getClass().getSuperclass() == NumberNoun.class ? (NumberNoun)n.getUnit() : null;
        if (n.getNumberType() == NumberType.Cardinal) {
            if (n.getUnit().getGender() == Gender.Feminine && (n.getNumValue() == 1 || n.getNumValue() == 2))
                n.setGender(Gender.Feminine);

            //separator and fraction name use different rules
            if (Objects.equals(n.getUnit().getTag(), "Separator") || (numUnit != null && numUnit.getNumberType() == NumberType.Ordinal))
                n.getUnit().setGrNumber(n.getNumValue() == 1 ? GrammaticalNumber.Singular : GrammaticalNumber.Plural);
            else //numbers ending with 1 - 4 use singular number
                n.getUnit().setGrNumber( n.getNumValue() >= 1 && n.getNumValue() <= 4 ? GrammaticalNumber.Singular : GrammaticalNumber.Plural);

            //numbers ending with anything else than 1 change nominative case to genitive
            n.getUnit().setCaseType(n.getNumValue() != 1 && n.getCaseType() == Case.Nominative ? Case.Genitive : n.getCaseType());
        } else {
            //todo ordinal
        }

        if (numUnit != null && numUnit.getUnit() != null)
            syncUnit(numUnit);
    }

    /// <summary>
    /// finds denominator of a fractional part
    /// </summary>
    private long getDenominator(double number) {
        number = Math.abs(number);

        number = round(number - truncate(number));
        double testFPart = 0;
        long denominator = 1;
        do {
            denominator *= 10;
            testFPart = denominator * number;
        } while (testFPart - truncate(testFPart) > 1e-12);
        return denominator;
    }

    public double truncate(double number) {
        return number >= 0 ? Math.floor(number) : Math.ceil(number);
    }

    public double round(double number, double precision){
        double m = Math.pow(10, precision);
        return Math.round(number * m) / m;
    }

    public double round(double number){
        return round(number, precision);
    }
}
