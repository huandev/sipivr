package ru.sipivr.speech.core;

import org.joda.time.LocalDate;
import ru.sipivr.speech.enums.Case;
import ru.sipivr.speech.enums.Gender;
import ru.sipivr.speech.enums.NumberType;

import java.util.HashMap;

/**
 * Created by Admin on 22.02.2016.
 */
public class DateSpeller {
    private NumberSpeller numberSpeller;

    private static final HashMap<Integer, String> MonthNames;

    static {
        MonthNames = new HashMap<>();

        MonthNames.put(1, "Jan");
        MonthNames.put(2, "Feb");
        MonthNames.put(3, "Mar");
        MonthNames.put(4, "Apr");
        MonthNames.put(5, "May");
        MonthNames.put(6, "Jun");
        MonthNames.put(7, "Jul");
        MonthNames.put(8, "Aug");
        MonthNames.put(9, "Sep");
        MonthNames.put(10, "Oct");
        MonthNames.put(11, "Nov");
        MonthNames.put(12, "Dec");
    }

    public DateSpeller(NumberSpeller numSpeller) {
        this.numberSpeller = numSpeller;
    }

    public CompositeLexicalUnit spell(LocalDate date) {
        return spell(date, Case.Nominative);
    }

    public CompositeLexicalUnit spell(LocalDate date, Case caseType) {
        CompositeLexicalUnit res = new CompositeLexicalUnit();

        NumberNoun dayOfMonth = new NumberNoun(date.getDayOfMonth());
        dayOfMonth.setNumberType(NumberType.Ordinal);
        dayOfMonth.setGender(Gender.Neuter);
        dayOfMonth.setCaseType(caseType);



      //  return Objects.equals(n.getValue(), "Year") ? String.format("Date/Year_%s", n.getCaseType().getValue()) : TranslateNoun(n);

        res.getChildren().add(numberSpeller.decomposeNumber(dayOfMonth));
        res.getChildren().add(new Noun("sipivr.speech.date", MonthNames.get(date.getMonthOfYear()), false));

        NumberNoun yearNumberNoun = new NumberNoun(date.getYear());
        yearNumberNoun.setCaseType(Case.Genitive);
        yearNumberNoun.setGender(Gender.Neuter);
        yearNumberNoun.setNumberType(NumberType.Ordinal);

        res.getChildren().add(numberSpeller.decomposeNumber(yearNumberNoun));

        res.getChildren().add(new Noun("sipivr.speech.date", "year_" + Case.Genitive.getValue(), false));

        return res;
    }
}