package ru.sipivr.core.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import javax.persistence.*;
import java.util.List;

/**
 * Created by Karpukhin on 01.01.2016.
 */
@Entity
@JsonIdentityInfo(generator=ObjectIdGenerators.IntSequenceGenerator.class, property="index")
public class Menu {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int id;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false, updatable = false)
    private int versionId;
    @Column(nullable = false)
    private double x;
    @Column(nullable = false)
    private double y;

//    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name="menuId", nullable=false)
    @OrderBy("index")
    private List<Module> modules;
    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "startMenuId")
    private List<CampaignVersion> startVersions;

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

    public int getVersionId() {
        return versionId;
    }

    public void setVersionId(int versionId) {
        this.versionId = versionId;
    }

    public double getX() {
        return x;
    }

    public void setX(double x) {
        this.x = x;
    }

    public double getY() {
        return y;
    }

    public void setY(double y) {
        this.y = y;
    }

    public List<Module> getModules() {
        return modules;
    }

    public void setModules(List<Module> modules) {
        this.modules = modules;
    }
}
