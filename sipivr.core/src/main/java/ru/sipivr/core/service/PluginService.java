package ru.sipivr.core.service;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.sipivr.core.plugin.IncludePlugin;
import ru.sipivr.core.plugin.MenuPlugin;
import ru.sipivr.core.plugin.ResultPlugin;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * Created by Karpukhin on 02.01.2016.
 */
@Service
public class PluginService implements InitializingBean {
    private HashMap<String, ResultPlugin> map;

    @Autowired(required = false)
    private List<MenuPlugin> menuPlugins;
    @Autowired(required = false)
    private List<ResultPlugin> resultPlugins;
    @Autowired(required = false)
    private List<IncludePlugin> includePlugins;

    public List<MenuPlugin> getMenuPlugins() {
        return menuPlugins;
    }

    public List<ResultPlugin> getResultPlugins() {
        return resultPlugins;
    }

    public List<IncludePlugin> getIncludePlugins() {
        return includePlugins;
    }

    public ResultPlugin getByName(String name){
        return map.get(name.toLowerCase());
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        map = new HashMap<>();

        if(resultPlugins != null) {
            for (ResultPlugin p : resultPlugins) {
                map.put(p.getClass().getName().toLowerCase(), p);
            }
        }
    }
}