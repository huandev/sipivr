package ru.sipivr.core.result;

/**
 * Created by okarpukhin on 20.05.2015.
 */
public class Tts extends AbstractResult {
    private String text;

    public Tts(String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }
}