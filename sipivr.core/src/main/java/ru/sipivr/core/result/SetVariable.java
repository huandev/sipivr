package ru.sipivr.core.result;

/**
 * Created by okarpukhin on 31.01.2018.
 */
public class SetVariable extends AbstractResult {
    private final String name;
    private final String value;

    public SetVariable(String name, String value) {
        this.name = name;
        this.value = value;
    }

    public String getName() {
        return name;
    }

    public String getValue() {
        return value;
    }
}