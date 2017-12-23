package ru.sipivr.core.enums;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Karpukhin on 01.01.2016.
 */
public enum UserRole {
    MANAGER(1),
    ADMIN(2);

    private Integer value;

    UserRole(Integer role) {
        this.value = role;
    }

    public Integer getValue() {
        return this.value;
    }

    public static List<UserRole> parse(int role) {
        List<UserRole> roles = new ArrayList<>();

        for (int i = 0; i < 32; i++) {
            int mask = 1 << i;

            for (UserRole r : UserRole.values()) {
                if ((role & mask) == r.getValue())
                    roles.add(r);
            }
        }
        return roles;
    }
}