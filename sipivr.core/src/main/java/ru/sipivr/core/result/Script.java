package ru.sipivr.core.result;

/**
 * Created by Karpukhin on 01.01.2016.
 */
public class Script extends AbstractResult {
    private String path;

    public Script(String path) {
        this.path = path;
    }

    public String getPath() {
        return path;
    }
}