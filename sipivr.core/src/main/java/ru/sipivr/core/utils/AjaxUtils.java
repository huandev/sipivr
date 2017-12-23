package ru.sipivr.core.utils;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by PIgnatov on 24.11.2014.
 */
public class AjaxUtils {
    private static final String ajaxHeader = "XMLHttpRequest";

    public static boolean isAjaxRequest(HttpServletRequest request) {
        String header = request.getHeader("X-Requested-With");
        return header != null && header.equals(ajaxHeader);
    }
}
