package ru.sipivr.web.viewmodel;

import ru.sipivr.core.model.User;

import javax.validation.constraints.Pattern;

/**
 * Created by okarpukhin on 01.03.2016.
 */
public class UserModel {
    public static final String PasswordPattern = "(" + User.PasswordPattern + ")|(^[*]{8}$)";
    public final static String PasswordMask = "********";

    private int id;
    @Pattern(regexp = User.NamePattern, message = User.NamePatternMessage)
    private String name;
    @Pattern(regexp= PasswordPattern, message=User.PasswordPatternMessage)
    private String newPassword;
    private int role;

    public UserModel() {
        newPassword = PasswordMask;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    public int getRole() {
        return role;
    }

    public void setRole(int role) {
        this.role = role;
    }
}
