package ru.sipivr.core.service;

import nl.captcha.Captcha;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by Admin on 24.01.2016.
 */
@Service
public class CaptchaService {
    @Autowired(required = false)
    private HttpServletRequest request;

    public boolean isValid(){
        Captcha captcha = (Captcha) request.getSession().getAttribute(Captcha.NAME);
        String answer = request.getParameter("answer");
        return answer != null && captcha.isCorrect(answer);
    }
}
