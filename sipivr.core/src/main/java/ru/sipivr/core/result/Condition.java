package ru.sipivr.core.result;

/**
 * Created by Karpukhin on 01.01.2016.
 */
public class Condition extends AbstractResult {
    private int nextMenuId;
    private String value;

    public Condition(int nextMenuId, String value) {
        this.nextMenuId = nextMenuId;
        this.value = value;
    }

    public int getNextMenuId() {
        return nextMenuId;
    }

    public String getValue() {
        return value;
    }
}