package ru.sipivr.core.result;

/**
 * Created by Karpukhin on 01.01.2016.
 */
public class Sleep extends AbstractResult {
    private int duration;

    public Sleep(int duration) {
        this.duration = duration;
    }

    public int getDuration() {
        return duration;
    }
}