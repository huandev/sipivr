package ru.sipivr.core.result;

/**
 * Created by okarpukhin on 04.03.2018.
 */
public class NoMatch extends AbstractResult {
    private Integer nextMenuId;

    public NoMatch(Integer nextMenuId) {
        this.nextMenuId = nextMenuId;
    }

    public Integer getNextMenuId() {
        return nextMenuId;
    }
}