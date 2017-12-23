package ru.sipivr.voicemail.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import ru.sipivr.core.controller.BaseController;
import ru.sipivr.core.model.Call;
import ru.sipivr.voicemail.dao.VoiceMailDao;
import ru.sipivr.voicemail.model.VoiceMail;

import java.util.Date;

/**
 * Created by Admin on 27.02.2016.
 */
@Controller("ru.sipivr.voicemail.controller.ServiceController")
@RequestMapping("/service")
public class ServiceController extends BaseController {
    @Autowired
    private VoiceMailDao voiceMailDao;

    @RequestMapping(value = "/voicemail")
    @ResponseStatus(value = HttpStatus.OK)
    public void voicemail(@RequestParam long callId){
        VoiceMail voiceMail = new VoiceMail();
        voiceMail.setCallId(callId);
        voiceMailDao.save(voiceMail);
    }
}
