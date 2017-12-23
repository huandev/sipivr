package ru.sipivr.registration.model;

import ru.sipivr.core.model.AbstractVersionEntity;
import ru.sipivr.core.model.User;

import javax.persistence.*;
import javax.validation.constraints.Pattern;

/**
 * Created by Admin on 22.01.2016.
 */
@Entity
@Table(uniqueConstraints = { @UniqueConstraint(columnNames = {"name"}), @UniqueConstraint(columnNames = {"guid"}), @UniqueConstraint(columnNames = {"email"}) })
public class Registration extends AbstractVersionEntity {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private int id;
    @Column(nullable = false, updatable = false)
    @Pattern(regexp = User.NamePattern, message = User.NamePatternMessage)
    private String name;
    @Column(nullable = false, updatable = false)
    @Pattern(regexp = "^.+@.+\\..+$")
    private String email;
    @Column(nullable = false)
    @Pattern(regexp= User.PasswordPattern, message=User.PasswordPatternMessage)
    private String password;
    @Column(nullable = false)
    private String guid;

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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getGuid() {
        return guid;
    }

    public void setGuid(String guid) {
        this.guid = guid;
    }
}
