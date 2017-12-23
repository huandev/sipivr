package ru.sipivr.core.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import ru.sipivr.core.model.base.BaseCampaign;

import javax.persistence.*;
import java.util.List;

/**
 * Created by Karpukhin on 01.01.2016.
 */
@Entity
@Table(uniqueConstraints = { @UniqueConstraint(columnNames = {"name", "ownerId"}), @UniqueConstraint(columnNames = "number") })
public class Campaign extends BaseCampaign {
    @ManyToOne(optional = true)
    @JoinColumn(name = "campaignVersionId", insertable=false, updatable=false, nullable=true, referencedColumnName = "id")
    private CampaignVersion campaignVersion;
    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "campaignId")
    private List<CampaignVersion> versions;

    public List<CampaignVersion> getVersions() {
        return versions;
    }

    public void setVersions(List<CampaignVersion> versions) {
        this.versions = versions;
    }
}
