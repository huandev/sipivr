package ru.sipivr.sound.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import ru.sipivr.core.model.User;
import ru.sipivr.sound.model.base.BaseSound;

import javax.persistence.*;

/**
 * Created by Karpukhin on 07.01.2016.
 */
@Entity
public class Sound extends BaseSound {
    @JsonIgnore
    @ManyToOne(optional = false)
    @JoinColumn(name = "ownerId", insertable=false, updatable=false, nullable=false, referencedColumnName = "id")
    private User owner;

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    @Transient
    public String getOwnerName(){
        return owner.getName();
    }
}
