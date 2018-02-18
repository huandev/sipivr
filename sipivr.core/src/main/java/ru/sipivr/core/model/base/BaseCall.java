package ru.sipivr.core.model.base;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by Admin on 28.02.2016.
 */
@MappedSuperclass
public class BaseCall extends AbstractVersionEntity {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private long id;
    @Column(nullable = false, updatable = false)
    private int campaignVersionId;
    @Column(nullable = true)
    private Date endDate;
    @Column(nullable = false, unique = true)
    private String sipCallId;
    @Column(nullable = false)
    private String callerId;
    @Column(nullable = false)
    private String calledId;
    private String transferNumber;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public int getCampaignVersionId() {
        return campaignVersionId;
    }

    public void setCampaignVersionId(int campaignVersionId) {
        this.campaignVersionId = campaignVersionId;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public String getSipCallId() {
        return sipCallId;
    }

    public void setSipCallId(String sipCallId) {
        this.sipCallId = sipCallId;
    }

    public String getCallerId() {
        return callerId;
    }

    public void setCallerId(String callerId) {
        this.callerId = callerId;
    }

    public String getCalledId() {
        return calledId;
    }

    public void setCalledId(String calledId) {
        this.calledId = calledId;
    }

    public String getTransferNumber() {
        return transferNumber;
    }

    public void setTransferNumber(String transferNumber) {
        this.transferNumber = transferNumber;
    }
}
