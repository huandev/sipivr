package ru.sipivr.core.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.List;

/**
 * Created by Karpukhin on 07.01.2016.
 */
@Entity
public class CampaignVersion extends AbstractVersionEntity {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private int id;
    @Column(nullable = false, updatable = false)
    private int campaignId;
    @Column(nullable = false, updatable = false)
    private int ownerId;
    @Column(nullable = true)
    private Integer startMenuId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "campaignId", insertable=false, updatable=false, nullable=false, referencedColumnName = "id")
    private Campaign campaign;

    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "versionId")
    private List<Menu> menus;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getCampaignId() {
        return campaignId;
    }

    public void setCampaignId(int campaignId) {
        this.campaignId = campaignId;
    }

    public int getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(int ownerId) {
        this.ownerId = ownerId;
    }

    public Integer getStartMenuId() {
        return startMenuId;
    }

    public void setStartMenuId(Integer startMenuId) {
        this.startMenuId = startMenuId;
    }

    public Campaign getCampaign() {
        return campaign;
    }

    public void setCampaign(Campaign campaign) {
        this.campaign = campaign;
    }

    public List<Menu> getMenus() {
        return menus;
    }

    public void setMenus(List<Menu> menus) {
        this.menus = menus;
    }
}
