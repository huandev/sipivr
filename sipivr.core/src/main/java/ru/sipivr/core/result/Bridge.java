package ru.sipivr.core.result;

/**
 * Created by Karpukhin on 01.01.2016.
 */
public class Bridge extends AbstractResult {
    private String value;

    public Bridge(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}