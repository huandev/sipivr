package ru.sipivr.web.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import ru.sipivr.core.controller.BaseController;
import ru.sipivr.core.model.*;
import ru.sipivr.core.result.AbstractResult;
import ru.sipivr.core.utils.UserException;
import ru.sipivr.web.viewmodel.CallModel;

import javax.json.Json;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by Karpukhin on 02.01.2016.
 */
@RestController
@RequestMapping("/service")
public class ServiceController extends BaseController {
    @RequestMapping(value = { "/{number}", "/index/{number}" })
    @ResponseStatus(value = HttpStatus.OK)
    public void index(@PathVariable String number, @RequestParam String callerId, @RequestParam String calledId, @RequestParam String sipCallId, HttpServletResponse response) throws Exception {
        Campaign campaign = dao.getCampaignDao().getByNumber(number);
        if(campaign == null){
            throw new UserException();
        }

        CampaignVersion campaignVersion = dao.getCampaignVersionDao().get(campaign.getCampaignVersionId());

        if(campaignVersion == null){
            throw new UserException();
        }

        Call call = new Call();
        call.setCampaignVersionId(campaignVersion.getId());
        call.setCalledId(calledId);
        call.setCallerId(callerId);
        call.setSipCallId(sipCallId);
        dao.getCallDao().save(call);

        menu(campaignVersion.getStartMenuId(), call.getId(), null, response);
    }

    @RequestMapping(value = "menu/{menuId}")
    @ResponseStatus(value = HttpStatus.OK)
    public void menu(@PathVariable int menuId, @RequestParam long callId, @RequestParam(required = false) String input, HttpServletResponse response) throws Exception {
        CallTransition callTransition = new CallTransition();
        callTransition.setCallId(callId);
        callTransition.setInput(input);
        callTransition.setMenuId(menuId);
        dao.getCallTransitionDao().save(callTransition);

        CallModel model = new CallModel(200);
        model.setCallId(callId);
        model.setModules(new ArrayList<>());
        List<Module> modules = dao.getModuleDao().getByMenuId(menuId);
        for(Module m: modules){
            List<AbstractResult> runners = pluginService.getByName(m.getName()).run(m, input);
            if(runners != null) {
                model.getModules().addAll(runners);
            }
        }

        new ObjectMapper().writeValue(response.getOutputStream(), model);
        response.getOutputStream().close();
    }

    @RequestMapping(value = "disconnect/{callId}")
    @ResponseStatus(value = HttpStatus.OK)
    public void disconnect(@PathVariable long callId, @RequestParam(required = false) String transferNumber){
        Call call = dao.getCallDao().get(callId);
        call.setEndDate(new Date());
        call.setTransferNumber(transferNumber);
        dao.getCallDao().update(call);
    }
}
