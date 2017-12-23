package ru.sipivr.core.result;

/**
 * Created by Karpukhin on 01.01.2016.
 */

public abstract class AbstractResult {
    public String getType(){
        return this.getClass().getSimpleName();
    }
}
