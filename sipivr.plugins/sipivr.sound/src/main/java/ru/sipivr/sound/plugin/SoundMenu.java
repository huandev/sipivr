package ru.sipivr.sound.plugin;

import org.springframework.stereotype.Service;
import ru.sipivr.core.plugin.MenuPlugin;

import java.util.List;

/**
 * Created by okarpukhin on 23.05.2015.
 */
@Service
public class SoundMenu extends MenuPlugin {
    @Override
    public List<Menu> getMenus() {
        List<Menu> res = super.getMenus();
        if(isAuthenticated()) {
            res.add(new Menu(bundleService.getLocaleMessage("model.sounds"), "/sound/index", "icon-music"));
        }
        return res;
    }
}