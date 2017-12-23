package ru.sipivr.core.plugin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import ru.sipivr.core.enums.UserRole;
import ru.sipivr.core.model.User;
import ru.sipivr.core.service.BundleService;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Created by Karpukhin on 01.01.2016.
 */
public abstract class MenuPlugin {
    public class Menu {
        private String title;
        private String url;
        private String icon;

        public List<Menu> children;

        public Menu(String title){
            this.title = title;
            children = new ArrayList<>();
        }

        public Menu(String title, String url){
            this(title);
            this.url = url;
        }

        public Menu(String title, String url, String icon){
            this(title, url);
            this.icon = icon;
        }

        public String getTitle() {
            return title;
        }

        public String getUrl() {
            return url;
        }

        public List<Menu> getChildren() {
            return children;
        }

        public String getIcon() {
            return icon;
        }
    }

    @Autowired(required = false)
    protected HttpServletRequest request;
    @Autowired
    protected BundleService bundleService;

    public List<Menu> getMenus() {
        return new ArrayList<>();
    }

    public List<Menu> getRightMenus() {
        return new ArrayList<>();
    }

    protected final boolean isAuthenticated() {
        return getCurrentUser() != null;
    }

    protected final User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication!= null){
            Object details = authentication.getDetails();
            if( details.getClass().equals(User.class)){
                return  (User) details;
            }
        }
        return null;
    }

    protected final boolean hasRole(UserRole role) {
        User user = getCurrentUser();
        return user != null && user.hasAnyRole(role);
    }
}
