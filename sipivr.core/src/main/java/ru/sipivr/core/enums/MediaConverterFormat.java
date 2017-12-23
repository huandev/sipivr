package ru.sipivr.core.enums;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Karpukhin on 01.01.2016.
 */
public enum MediaConverterFormat {
    WAV("wav"),
    MP3("mp3");

    private String value;

    MediaConverterFormat(String value) {
        this.value = value;
    }

    public String getValue() {
        return this.value;
    }
}