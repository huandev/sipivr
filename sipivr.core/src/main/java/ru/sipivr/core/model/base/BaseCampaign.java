package ru.sipivr.core.model.base;

import javax.persistence.*;

/**
 * Created by Admin on 28.02.2016.
 */
@MappedSuperclass
public class BaseCampaign extends AbstractVersionEntity {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private int id;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false, updatable = false)
    private int ownerId;
    @Column(nullable = false)
    private String number;
    @Column(nullable = true)
    private Integer campaignVersionId;

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

    public int getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(int ownerId) {
        this.ownerId = ownerId;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public Integer getCampaignVersionId() {
        return campaignVersionId;
    }

    public void setCampaignVersionId(Integer campaignVersionId) {
        this.campaignVersionId = campaignVersionId;
    }
}
