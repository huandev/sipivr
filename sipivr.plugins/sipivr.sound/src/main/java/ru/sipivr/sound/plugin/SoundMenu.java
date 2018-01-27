package ru.sipivr.sound.plugin;

import org.springframework.stereotype.Service;
import ru.sipivr.core.plugin.MenuPlugin;

import java.util.ArrayList;
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
            List<Menu> children = new ArrayList<>();
            res.add(new Menu(bundleService.getLocaleMessage("model.sounds"), "/sound/index", "icon-music"));
            res.add(new Menu("WAV", "/wav/index", "icon-music"));
        }
        return res;
    }
}