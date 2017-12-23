package ru.sipivr.core.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

/**
 * Created by Karpukhin on 01.01.2016.
 */
@Entity
@Table
public class ModuleParameter {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int id;
//    @Column(nullable = false)
//    private int moduleId;
    @Column(nullable = false)
    private String name;
    @Column(nullable = true)
    private String value;

    @ManyToOne(optional = false)
    @JoinColumn(name = "moduleId", insertable=false, updatable=false, nullable=false, referencedColumnName = "id")
    @JsonIgnore
    private Module module;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

//    public int getModuleId() {
//        return moduleId;
//    }
//
//    public void setModuleId(int moduleId) {
//        this.moduleId = moduleId;
//    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public Module getModule() {
        return module;
    }

    public void setModule(Module module) {
        this.module = module;
    }
}
