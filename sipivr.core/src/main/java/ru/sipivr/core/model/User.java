package ru.sipivr.core.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import ru.sipivr.core.enums.UserRole;
import ru.sipivr.core.model.base.AbstractVersionEntity;

import javax.persistence.*;
import javax.validation.constraints.Pattern;
import java.util.List;

/**
 * Created by Karpukhin on 01.01.2016.
 */
@Entity
@Table(name="[User]", uniqueConstraints = { @UniqueConstraint(columnNames = {"name"}) })
public class User extends AbstractVersionEntity {
    public static final String NamePattern = "^[a-zA-Z]\\w{1,15}$";
    public static final String NamePatternMessage = "User with this login already registered";

    public static final String PasswordPattern = "(?!^[0-9a-z]*$)(?!^[0-9A-Z]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{8,16})$";
    public static final String PasswordPatternMessage = "model.user.password.pattern";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(nullable = false, updatable = false)
    @Pattern(regexp = NamePattern, message = NamePatternMessage)
    private String name;
    @Column(nullable = false)
    @Pattern(regexp = PasswordPattern, message = PasswordPatternMessage)
    private String password;
    @Column(nullable = false)
    private int role;
    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "ownerId")
    private List<Campaign> campaigns;
    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "ownerId")
    private List<CampaignVersion> campaignVersions;

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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getRole() {
        return role;
    }

    public void setRole(int role) {
        this.role = role;
    }

    @JsonIgnore
    @Transient
    public List<UserRole> getRoles() {
        return UserRole.parse(this.getRole());
    }

    @Transient
    public void setRoles(UserRole... roles) {
        this.role = 0;
        for (UserRole r : roles) {
            this.role |= r.getValue();
        }
    }

    @Transient
    public boolean hasAnyRole(UserRole... roles) {
        List<UserRole> userRoles = getRoles();

        for (UserRole r : roles) {
            for (UserRole ur : userRoles) {
                if (ur.equals(r)) {
                    return true;
                }
            }
        }

        return false;
    }
}