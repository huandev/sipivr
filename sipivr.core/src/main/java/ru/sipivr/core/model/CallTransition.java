package ru.sipivr.core.model;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by Karpukhin on 01.01.2016.
 */
@Entity
@Table
public class CallTransition extends AbstractVersionEntity {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private long id;
    @Column(nullable = false)
    private long callId;
    @Column(nullable = false, updatable = false)
    private int menuId;
    private String input;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getCallId() {
        return callId;
    }

    public void setCallId(long callId) {
        this.callId = callId;
    }

    public int getMenuId() {
        return menuId;
    }

    public void setMenuId(int menuId) {
        this.menuId = menuId;
    }

    public String getInput() {
        return input;
    }

    public void setInput(String input) {
        this.input = input;
    }
}