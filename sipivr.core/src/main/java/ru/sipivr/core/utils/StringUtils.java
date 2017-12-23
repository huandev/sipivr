package ru.sipivr.core.utils;

/**
 * Created by Karpukhin on 02.01.2016.
 */
public class StringUtils {
    public static boolean isNullOrEmpty(String str) {
        return str == null || "".equals(str);
    }
}
