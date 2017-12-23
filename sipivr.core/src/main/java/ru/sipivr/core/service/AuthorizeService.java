package ru.sipivr.core.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ru.sipivr.core.dao.UserDao;
import ru.sipivr.core.model.User;
import ru.sipivr.core.utils.StringUtils;

import java.security.NoSuchAlgorithmException;

/**
 * Created by Karpukhin on 02.01.2016.
 */
@Service
public class AuthorizeService {
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserDao userDao;

    public User getUser(String username) {
        if (StringUtils.isNullOrEmpty(username)) {
            return null;
        }

        return userDao.getByName(username);
    }

    public User getUser(String username, String password) {
        User identity = getUser(username);
        if (identity != null && password != null && passwordEncoder.matches(password, identity.getPassword())) {
            return identity;
        }
        return null;
    }
}
