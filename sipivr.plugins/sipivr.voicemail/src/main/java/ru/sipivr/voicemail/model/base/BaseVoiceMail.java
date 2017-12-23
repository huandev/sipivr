package ru.sipivr.voicemail.model.base;

import ru.sipivr.core.model.AbstractVersionEntity;

import javax.persistence.*;

/**
 * Created by Admin on 28.02.2016.
 */
@MappedSuperclass
public class BaseVoiceMail extends AbstractVersionEntity {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private int id;
    @Column(nullable = false)
    private long callId;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public long getCallId() {
        return callId;
    }

    public void setCallId(long callId) {
        this.callId = callId;
    }
}
