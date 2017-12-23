package ru.sipivr.core.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

/**
 * Created by Karpukhin on 01.01.2016.
 */
@Entity
@Table
public class ModuleTransition {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int id;
//    @Column(nullable = false)
//    private int moduleId;
//    @Column(nullable = true)
//    private Integer nextMenuId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "moduleId", insertable=false, updatable=false, nullable=false, referencedColumnName = "id")
    @JsonIgnore
    private Module module;

    @ManyToOne(cascade = { CascadeType.ALL }, optional = true)
    @JoinColumn(name = "nextMenuId", referencedColumnName = "id")
    private Menu nextMenu;

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

//    public int getNextMenuId() {
//        return nextMenuId;
//    }
//
//    public void setNextMenuId(int nextMenuId) {
//        this.nextMenuId = nextMenuId;
//    }


    public Module getModule() {
        return module;
    }

    public void setModule(Module module) {
        this.module = module;
    }

    public Menu getNextMenu() {
        return nextMenu;
    }

    public void setNextMenu(Menu nextMenu) {
        this.nextMenu = nextMenu;
    }
}
