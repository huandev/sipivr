package ru.sipivr.core.result;

/**
 * Created by Karpukhin on 01.01.2016.
 */
public class Sound extends AbstractResult {
    private String path;

    public Sound(String path) {
        this.path = path;
    }

    public String getPath() {
        return path;
    }
}