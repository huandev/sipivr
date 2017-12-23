package ru.sipivr.voicemail.controller;

import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import ru.sipivr.core.controller.BaseController;
import ru.sipivr.voicemail.dao.VoiceMailDao;
import ru.sipivr.voicemail.model.VoiceMail;

import javax.servlet.http.HttpServletResponse;

/**
 * Created by Admin on 26.02.2016.
 */
@Controller
@PreAuthorize("isAuthenticated()")
@RequestMapping("/voicemail")
public class VoiceMailController extends BaseController {
    @RequestMapping("/index")
    public String voicemails() {
        return "/voicemails";
    }

    @RequestMapping(value = "/play/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public void play(HttpServletResponse response, @PathVariable("id") int id) throws Exception {
        VoiceMail sound = dao.get(VoiceMailDao.class).get(id);
        String path = appConfig.getSoundPath("voicemail", sound.getCall().getSipCallId() + ".wav");
        playMediaFile(response, path);
    }
}