package ru.sipivr.core.result;

/**
 * Created by Karpukhin on 01.01.2016.
 */
public class Conference extends AbstractResult {
    private String name;

    public Conference(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}