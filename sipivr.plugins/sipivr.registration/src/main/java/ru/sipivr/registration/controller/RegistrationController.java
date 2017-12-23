package ru.sipivr.registration.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import ru.sipivr.core.controller.BaseController;
import ru.sipivr.core.model.User;
import ru.sipivr.core.service.CaptchaService;
import ru.sipivr.core.service.MailService;
import ru.sipivr.core.utils.UserException;
import ru.sipivr.registration.dao.RegistrationDao;
import ru.sipivr.registration.model.Registration;

import javax.mail.MessagingException;
import javax.validation.Valid;
import java.util.UUID;

/**
 * Created by Admin on 22.01.2016.
 */
@Controller
@RequestMapping("/registration")
public class RegistrationController extends BaseController {
    @Autowired
    private CaptchaService captchaService;
    @Autowired
    private MailService mailService;

    @RequestMapping("/index")
    public String index(){
        return "/registration/index";
    }

    @RequestMapping(value = "/save")
    public String save(@Valid Registration registration) throws MessagingException {
        if(!captchaService.isValid()){
            return "/registration/index";
        }

        registration.setGuid(UUID.randomUUID().toString());
        dao.get(RegistrationDao.class).save(registration);

        String site = request.getScheme() + "://" + request.getServerName() +
                (request.getServerPort() == 80 ? "" : (":" + request.getServerPort()))+ request.getContextPath();

        String url = site + "/registration/confirm/" + registration.getGuid();
        mailService.send(registration.getEmail(), site, "<a href='" + url + "'>" + url + "</a>");

        return "/registration/save";
    }

    @RequestMapping("/confirm/{guid}")
    public String confirm(@PathVariable String guid) throws UserException{
        Registration registration = dao.get(RegistrationDao.class).getByGuid(guid);

        if(registration == null) {
            throw new UserException();
        }

        User user = new User();
        user.setName(registration.getName());
        user.setPassword(registration.getPassword());
        dao.getUserDao().save(user);

        return "/registration/confirm";
    }
}
