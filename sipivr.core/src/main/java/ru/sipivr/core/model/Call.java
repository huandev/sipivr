package ru.sipivr.core.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import ru.sipivr.core.model.base.BaseCall;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

/**
 * Created by Karpukhin on 01.01.2016.
 */
@Entity
@Table(indexes = { @Index(columnList = "createDate"), @Index(columnList = "sipCallId") })
public class Call extends BaseCall {
    @ManyToOne(optional = false)
    @JoinColumn(name = "campaignVersionId", insertable=false, updatable=false, nullable=false, referencedColumnName = "id")
    private CampaignVersion campaignVersion;

    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "callId")
    private List<CallTransition> transitions;

    public List<CallTransition> getTransitions() {
        return transitions;
    }

    public void setTransitions(List<CallTransition> transitions) {
        this.transitions = transitions;
    }

    public CampaignVersion getCampaignVersion() {
        return campaignVersion;
    }

    public void setCampaignVersion(CampaignVersion campaignVersion) {
        this.campaignVersion = campaignVersion;
    }
}