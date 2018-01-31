package ru.sipivr.core.result;

/**
 * Created by Karpukhin on 01.01.2016.
 */
public class Script extends AbstractResult {
    private String path;
    private String arguments;

    public Script(String path, String arguments) {
        this.path = path;
        this.arguments = arguments;
    }

    public String getPath() {
        return path;
    }

    public String getArguments() {
        return arguments;
    }
}