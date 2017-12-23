package ru.sipivr.web.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import ru.sipivr.core.enums.UserRole;
import ru.sipivr.core.model.User;
import ru.sipivr.core.service.AuthorizeService;
import ru.sipivr.core.service.BundleService;
import ru.sipivr.core.service.DaoService;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * Created by Karpukhin on 02.01.2016.
 */
public class CustomAuthenticationProvider implements AuthenticationProvider {
    @Autowired
    BundleService bundleService;
    @Autowired
    protected HttpServletRequest httpServletRequest;
    @Autowired
    protected AuthorizeService authorizeService;

    @Autowired
    private DaoService dao;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String username = authentication.getName();
        String password = authentication.getCredentials().toString();

        User identity = authorizeService.getUser(username, password);

        if (identity != null && identity.getRole() > 0) {
            return createToken(identity);
        }

        throw new AuthenticationServiceException(bundleService.getLocaleMessage("ui.login.error"));
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }

    private Authentication createToken(User user) {
        return new Authentication() {
            private boolean auth = true;

            @Override
            public String getName() {
                return user.getName();
            }

            @Override
            public Collection<? extends GrantedAuthority> getAuthorities() {
                List<GrantedAuthority> result = new ArrayList<GrantedAuthority>();

                for (UserRole role : dao.getUserDao().get(user.getId()).getRoles()) {
                    result.add(new SimpleGrantedAuthority(role.name()));
                }

                return result;
            }

            @Override
            public Object getCredentials() {
                return user.getPassword();
            }

            @Override
            public Object getDetails() {
                return dao.getUserDao().get(user.getId());
            }

            @Override
            public Object getPrincipal() {
                return user.getName();
            }

            @Override
            public boolean isAuthenticated() {
                return auth && dao.getUserDao().get(user.getId()).getRole() > 0;
            }

            @Override
            public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {
                auth = isAuthenticated;
            }
        };
    }
}