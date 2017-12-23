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

/**
 * Created by Admin on 22.02.2016.
 */
public abstract class IncludePlugin {
    @Autowired(required = false)
    protected HttpServletRequest request;
    @Autowired
    protected BundleService bundleService;

    public List<String> getLayoutIncludes() {
        return new ArrayList<>();
    }

    public List<String> getSchemeIncludes() {
        return new ArrayList<>();
    }

    protected final boolean isAuthenticated() {
        return getCurrentUser() != null;
    }

    protected final User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication != null){
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
