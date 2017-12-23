package ru.sipivr.web.auth;

import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import ru.sipivr.core.utils.AjaxUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by Karpukhin on 02.01.2016.
 */
public class WebRequestCache extends HttpSessionRequestCache {
    @Override
    public void saveRequest(HttpServletRequest request, HttpServletResponse response) {
        if (!AjaxUtils.isAjaxRequest(request)) {
            super.saveRequest(request, response);
        }
    }
}
