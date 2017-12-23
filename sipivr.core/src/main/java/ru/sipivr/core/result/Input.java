package ru.sipivr.core.result;

/**
 * Created by Karpukhin on 01.01.2016.
 */
public class Input extends AbstractResult {
    private int duration;
    private int length;

    public Input(int duration, int length) {
        this.duration = duration;
        this.length = length;
    }

    public int getDuration() {
        return duration;
    }

    public int getLength() {
        return length;
    }
}