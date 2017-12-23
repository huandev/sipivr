package ru.sipivr.web.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.savedrequest.SavedRequest;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.i18n.CookieLocaleResolver;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by Karpukhin on 02.01.2016.
 */
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {
    @Autowired
    private CookieLocaleResolver localeResolver;

    @Autowired
    private WebRequestCache webRequestCache;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        setLocale(request, response, authentication);

        SavedRequest savedRequest = webRequestCache.getRequest(request, response);
        response.sendRedirect(savedRequest == null ? "/" :  savedRequest.getRedirectUrl());
    }

    private void setLocale(HttpServletRequest request, HttpServletResponse response, Authentication authentication){
        for(Cookie cookie: request.getCookies()){
            if (localeResolver.getCookieName().equals(cookie.getName())) {
                return;
            }
        }

        localeResolver.setLocale(request, response, request.getLocale());
        localeResolver.resolveLocale(request);
    }
}