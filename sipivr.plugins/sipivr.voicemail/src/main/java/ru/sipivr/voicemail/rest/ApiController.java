package ru.sipivr.voicemail.rest;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import ru.sipivr.core.controller.BaseController;
import ru.sipivr.core.enums.UserRole;
import ru.sipivr.core.model.User;
import ru.sipivr.core.model.base.BaseCall;
import ru.sipivr.core.model.base.BaseCampaign;
import ru.sipivr.voicemail.dao.VoiceMailDao;
import ru.sipivr.voicemail.model.base.BaseVoiceMail;
import ru.sipivr.voicemail.model.VoiceMail;
import ru.sipivr.voicemail.view.ViewVoiceMail;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Admin on 27.02.2016.
 */
@RestController(value="ru.sipivr.voicemail.rest.ApiController")
@PreAuthorize("isAuthenticated()")
@RequestMapping("/api")
public class ApiController extends BaseController {
    @RequestMapping(value = "/voicemails", produces = "application/json")
    @ResponseBody
    public List<ViewVoiceMail> voicemails() {
        List<VoiceMail> list;

        User currentUser = getCurrentUser();
        if (currentUser.hasAnyRole(UserRole.ADMIN)) {
            list = dao.get(VoiceMailDao.class).list();
        } else {
            list = dao.get(VoiceMailDao.class).getByCampaignOwnerId(currentUser.getId());
        }

        List<ViewVoiceMail> res = new ArrayList<>(list.size());
        for (VoiceMail vm : list) {
            ViewVoiceMail vvm = mapper.map(vm, ViewVoiceMail.class);
            vvm.setCampaign(mapper.map(vm.getCall().getCampaignVersion().getCampaign(), BaseCampaign.class));
            res.add(vvm);
        }

        return res;
    }
}
