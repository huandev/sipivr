package ru.sipivr.core.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.sipivr.core.dao.*;

import java.lang.reflect.ParameterizedType;
import java.util.List;

/**
 * Created by Karpukhin on 01.01.2016.
 */
@Service
public class DaoService {
    @Autowired
    private CallDao callDao;
    @Autowired
    private CallTransitionDao callTransitionDao;
    @Autowired
    private CampaignDao campaignDao;
    @Autowired
    private CampaignVersionDao campaignVersionDao;
    @Autowired
    private MenuDao menuDao;
    @Autowired
    private  ModuleDao moduleDao;
    @Autowired
    private  ModuleParameterDao moduleParameterDao;
    @Autowired
    private ModuleTransitionDao moduleTransitionDao;
    @Autowired
    private UserDao userDao;

    @Autowired
    private List<BaseDao> daos;

    public CallDao getCallDao() {
        return callDao;
    }

    public CallTransitionDao getCallTransitionDao() {
        return callTransitionDao;
    }

    public CampaignDao getCampaignDao() {
        return campaignDao;
    }

    public CampaignVersionDao getCampaignVersionDao() {
        return campaignVersionDao;
    }

    public MenuDao getMenuDao() {
        return menuDao;
    }

    public ModuleDao getModuleDao() {
        return moduleDao;
    }

    public ModuleParameterDao getModuleParameterDao() {
        return moduleParameterDao;
    }

    public ModuleTransitionDao getModuleTransitionDao() {
        return moduleTransitionDao;
    }

    public UserDao getUserDao() {
        return userDao;
    }

    public <EDao extends BaseDao> EDao get(Class<EDao> daoClass){
        for (BaseDao dao: daos){
            if(dao.getClass().getSuperclass() == daoClass){
                return (EDao)dao;
            }
        }
        return null;
    }
}
