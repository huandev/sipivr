package ru.sipivr.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.support.DelegatingMessageSource;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.RequestContextUtils;
import ru.sipivr.core.controller.BaseController;
import ru.sipivr.core.model.Campaign;
import ru.sipivr.web.utils.ReloadableResourceBundleMessageSource;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.util.Locale;
import java.util.ResourceBundle;

/**
 * Created by Karpukhin on 06.01.2016.
 */
@Controller
public class CommonController extends BaseController {
    @Autowired
    private MessageSource messageSource;

    @RequestMapping("/messages.js")
    public String messages(Model model) {
        ReloadableResourceBundleMessageSource messageSource = (ReloadableResourceBundleMessageSource)((DelegatingMessageSource) this.messageSource).getParentMessageSource();

        model.addAttribute("keys", messageSource.getMergedProperties(Locale.ENGLISH).getProperties().stringPropertyNames());
        return "/messages";
    }

    @PreAuthorize("isAuthenticated()")
    @RequestMapping(value = {"/", "/index"})
    public String index() {
        return "/index";
    }

    @RequestMapping(value = "/auth")
    public String login(HttpServletRequest request, @RequestParam(required = false) String error, Model model) {
        Exception exception = (Exception)request.getSession().getAttribute("SPRING_SECURITY_LAST_EXCEPTION");
        model.addAttribute("error", error == null ? null : (exception == null ? bundleService.getLocaleMessage("ui.login.error") : exception.getMessage()));
        return "/auth";
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @RequestMapping("/users")
    public String users(){
        return "/users";
    }

    @PreAuthorize("isAuthenticated()")
    @RequestMapping("/campaigns")
    public String campaigns(){
        return "/campaigns";
    }

    @PreAuthorize("isAuthenticated()")
    @RequestMapping("/scheme/{id}")
    public String scheme(@PathVariable int id, Model model){
        Campaign campaign = dao.getCampaignDao().get(id);
        model.addAttribute("campaign", campaign);
        return "/scheme";
    }
}
