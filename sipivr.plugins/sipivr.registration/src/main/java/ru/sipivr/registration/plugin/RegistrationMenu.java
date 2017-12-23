package ru.sipivr.registration.plugin;

import org.springframework.stereotype.Service;
import ru.sipivr.core.plugin.MenuPlugin;

import java.util.List;

/**
 * Created by Admin on 23.01.2016.
 */
@Service
public class RegistrationMenu extends MenuPlugin {
    @Override
    public List<Menu> getRightMenus() {
        List<Menu> res = super.getRightMenus();
        if(!isAuthenticated() && request.getAttribute("javax.servlet.forward.request_uri").equals("/auth")) {
            res.add(new Menu("Registration", "/registration/index"));
        }
        return res;
    }
}
