package ru.sipivr.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import ru.sipivr.core.controller.BaseController;
import ru.sipivr.core.enums.UserRole;
import ru.sipivr.core.model.*;
import ru.sipivr.core.utils.UserException;
import ru.sipivr.web.viewmodel.SchemeModel;
import ru.sipivr.web.viewmodel.UserModel;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Karpukhin on 06.01.2016.
 */
@RestController
@PreAuthorize("isAuthenticated()")
@RequestMapping("/api")
public class ApiController extends BaseController {
    @Autowired
    private PasswordEncoder passwordEncoder;

    @RequestMapping(value = "/users", produces = "application/json")
    @ResponseBody
    public List<UserModel> users() {
        List<UserModel> res = new ArrayList<>();

        if(getCurrentUser().hasAnyRole(UserRole.ADMIN)) {
            List<User> users = dao.getUserDao().list();

            for (User u : users) {
                res.add(mapper.map(u, UserModel.class));
            }
        } else {
            res.add(mapper.map(getCurrentUser(), UserModel.class));
        }
        return res;
    }

    @Transactional(readOnly = false, rollbackFor = java.lang.Exception.class)
    @RequestMapping(value = "/saveUser", method = RequestMethod.POST, produces = "application/json")
    @PreAuthorize("hasAnyRole('ADMIN')")
    @ResponseBody
    public UserModel saveUser(@Valid UserModel model) throws Exception {
        User user = model.getId() == 0 ? new User() : dao.getUserDao().get(model.getId());

        mapper.map(model, user);

        if(!model.getNewPassword().equals(UserModel.PasswordMask)) {
            user.setPassword(passwordEncoder.encode(model.getNewPassword()));
        }
        if (model.getId() == 0) {
            dao.getUserDao().save(user);
        } else {
            user = dao.getUserDao().update(user);
        }

        return mapper.map(user, UserModel.class);
    }

    @RequestMapping(value = "/campaigns", produces = "application/json")
    @ResponseBody
    public List<Campaign> campaigns(){
        User currentUser = getCurrentUser();
        if(currentUser.hasAnyRole(UserRole.ADMIN)) {
            return dao.getCampaignDao().list();
        } else {
            return dao.getCampaignDao().getByOwnerId(currentUser.getId());
        }
    }

    @RequestMapping(value = "/saveCampaign", method = RequestMethod.POST, produces = "application/json")
    @ResponseBody
    public Campaign saveCampaign(Campaign model){
        model.setOwnerId(getCurrentUser().getId());

        if(model.getId() == 0){
            dao.getCampaignDao().save(model);
        } else {
            model = dao.getCampaignDao().update(model);
        }

        return model;
    }

    @RequestMapping(value = "/scheme/{campaignId}", produces = "application/json")
    @ResponseBody
    public SchemeModel scheme(@PathVariable int campaignId){
        SchemeModel model = new SchemeModel();
        model.setCampaignId(campaignId);

        Campaign campaign = dao.getCampaignDao().get(campaignId);

        CampaignVersion campaignVersion = campaign.getCampaignVersionId() == null ? null : dao.getCampaignVersionDao().get(campaign.getCampaignVersionId());
        if(campaignVersion == null) {
            model.setMenus(new ArrayList<>());
        } else {
            model.setMenus(dao.getMenuDao().getByVersionId(campaignVersion.getId()));
            if (campaignVersion.getStartMenuId() != null) {
                model.setStartMenu(dao.getMenuDao().get(campaignVersion.getStartMenuId()));
            }
        }
        return model;
    }

    @Transactional(value = "transactionManager", propagation = Propagation.REQUIRED, readOnly = false, rollbackFor = Exception.class)
    @RequestMapping(value = "/saveScheme/{campaignId}", method = RequestMethod.POST, produces = "application/json")
    @ResponseStatus(value = HttpStatus.OK)
    public void saveScheme(@RequestBody SchemeModel model) throws UserException {
        if(model.getStartMenu() == null){
            throw new UserException();
        }

        CampaignVersion campaignVersion = new CampaignVersion();
        campaignVersion.setCampaignId(model.getCampaignId());
        campaignVersion.setOwnerId(getCurrentUser().getId());
        dao.getCampaignVersionDao().save(campaignVersion);

        for (Menu menu : model.getMenus()) {
            menu.setVersionId(campaignVersion.getId());

            for (Module module : menu.getModules()) {
                module.setMenu(menu);
                for (ModuleParameter parameter : module.getParameters()) {
                    parameter.setModule(module);
                }
                for (ModuleTransition transition : module.getTransitions()) {
                    transition.setModule(module);
                }
            }
        }

        campaignVersion.setMenus(model.getMenus());
        dao.getCampaignVersionDao().update(campaignVersion);

        campaignVersion.setStartMenuId(model.getStartMenu().getId());
        dao.getCampaignVersionDao().update(campaignVersion);

        Campaign campaign = dao.getCampaignDao().get(model.getCampaignId());
        campaign.setCampaignVersionId(campaignVersion.getId());
        dao.getCampaignDao().update(campaign);
    }

    @Transactional(value = "transactionManager", propagation = Propagation.REQUIRED, readOnly = false, rollbackFor = Exception.class)
    @RequestMapping(value = "/changePassword", method = RequestMethod.POST, produces = "application/json")
    @ResponseBody
    @ResponseStatus(value = HttpStatus.OK)
    public void changePassword(@RequestParam String newPassword, @RequestParam String oldPassword) throws UserException{
        User currentUser = getCurrentUser();

        if(!passwordEncoder.matches(oldPassword, currentUser.getPassword())){
            throw new UserException();
        }

        currentUser.setPassword(passwordEncoder.encode(newPassword));
        dao.getUserDao().update(currentUser);
    }
}
