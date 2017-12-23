package ru.sipivr.core.result;

/**
 * Created by Karpukhin on 01.01.2016.
 */
public class Transfer extends AbstractResult {
    private String number;

    public Transfer(String number) {
        this.number = number;
    }

    public String getNumber() {
        return number;
    }
}