package ru.sipivr.number.enums;

/**
 * Created by Karpukhin on 14.01.2016.
 */
public enum GrammaticalNumber
{
    Singular("Sing"),	// единственное число
    Plural("Plr");		// множественное число

    private final String value;

    GrammaticalNumber(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
