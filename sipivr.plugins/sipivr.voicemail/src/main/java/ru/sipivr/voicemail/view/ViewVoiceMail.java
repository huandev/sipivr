package ru.sipivr.voicemail.view;

import ru.sipivr.core.model.base.BaseCall;
import ru.sipivr.core.model.base.BaseCampaign;
import ru.sipivr.voicemail.model.base.BaseVoiceMail;

/**
 * Created by Admin on 28.02.2016.
 */
public class ViewVoiceMail extends BaseVoiceMail {
    private BaseCall call;
    private BaseCampaign campaign;

    public BaseCall getCall() {
        return call;
    }

    public void setCall(BaseCall call) {
        this.call = call;
    }

    public BaseCampaign getCampaign() {
        return campaign;
    }

    public void setCampaign(BaseCampaign campaign) {
        this.campaign = campaign;
    }
}