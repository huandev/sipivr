package ru.sipivr.core.result;

/**
 * Created by Karpukhin on 01.01.2016.
 */
public class Transition extends AbstractResult {
    private Integer nextMenuId;

    public Transition(Integer nextMenuId) {
        this.nextMenuId = nextMenuId;
    }

    public Integer getNextMenuId() {
        return nextMenuId;
    }
}