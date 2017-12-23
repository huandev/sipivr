package ru.sipivr.core.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.RequestContextUtils;

import javax.servlet.http.HttpServletRequest;
import java.util.Locale;

/**
 * Created by Karpukhin on 01.01.2016.
 */
@Service
public class BundleService {
    @Autowired(required = false)
    private HttpServletRequest request;
    @Autowired
    private MessageSource messageSource;

    public final String getLocaleMessage(String key) {
        Locale locale = RequestContextUtils.getLocale(request);

        return messageSource.getMessage(key, null, locale);
    }

    public final String getLocaleMessage(String key, String defaultMessage) {
        Locale locale = RequestContextUtils.getLocale(request);
        return messageSource.getMessage(key, null, defaultMessage, locale);
    }
}
