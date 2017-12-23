package ru.sipivr.core.utils;

/**
 * Created by Karpukhin on 06.01.2016.
 */
public class UserException extends Exception {
    @Deprecated
    public UserException() {
        super("");
    }

    public UserException(String message) {
        super(message);
    }
}
