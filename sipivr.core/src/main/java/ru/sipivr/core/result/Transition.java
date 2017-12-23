package ru.sipivr.core.result;

/**
 * Created by Karpukhin on 01.01.2016.
 */
public class Transition extends AbstractResult {
    private int nextMenuId;

    public Transition(int nextMenuId) {
        this.nextMenuId = nextMenuId;
    }

    public int getNextMenuId() {
        return nextMenuId;
    }
}