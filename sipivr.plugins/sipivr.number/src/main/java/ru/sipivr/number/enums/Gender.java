package ru.sipivr.number.enums;

/**
 * Created by Karpukhin on 14.01.2016.
 */
public enum Gender
{
    Neuter("neu"),	// нейтральный
    Masculine("mas"),	// мужской
    Feminine("fem");	// женский

    private final String value;

    Gender(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
