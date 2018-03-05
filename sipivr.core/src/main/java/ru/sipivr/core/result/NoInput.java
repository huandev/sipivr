package ru.sipivr.core.result;

/**
 * Created by okarpukhin on 04.03.2018.
 */
public class NoInput extends AbstractResult {
    private Integer nextMenuId;

    public NoInput(Integer nextMenuId) {
        this.nextMenuId = nextMenuId;
    }

    public Integer getNextMenuId() {
        return nextMenuId;
    }
}