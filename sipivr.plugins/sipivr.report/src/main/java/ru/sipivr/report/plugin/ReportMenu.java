package ru.sipivr.report.plugin;

import org.springframework.stereotype.Service;
import ru.sipivr.core.model.Module;
import ru.sipivr.core.plugin.MenuPlugin;
import ru.sipivr.core.plugin.ResultPlugin;
import ru.sipivr.core.result.AbstractResult;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by okarpukhin on 23.05.2015.
 */
@Service
public class ReportMenu extends MenuPlugin {
    @Override
    public List<Menu> getMenus() {
        List<Menu> res = super.getMenus();
        if(isAuthenticated()) {
            res.add(new Menu(bundleService.getLocaleMessage("ru.sipivr.report.reports"), "/report", "icon-chart-bar"));
        }
        return res;
    }
}