package ru.sipivr.voicemail.model;

import ru.sipivr.core.model.Call;
import ru.sipivr.voicemail.model.base.BaseVoiceMail;

import javax.persistence.*;

/**
 * Created by Admin on 26.02.2016.
 */
@Entity
public class VoiceMail extends BaseVoiceMail {
    @ManyToOne(optional = false)
    @JoinColumn(name = "callId", insertable=false, updatable=false, nullable=false, referencedColumnName = "id")
    private Call call;

    public Call getCall() {
        return call;
    }

    public void setCall(Call call) {
        this.call = call;
    }
}
