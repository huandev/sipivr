package ru.sipivr.core.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.List;
import java.util.Optional;

/**
 * Created by Karpukhin on 01.01.2016.
 */
@Entity
@Table
public class Module {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int id;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private int index;
//    @Column(nullable = false)
//    private int menuId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "menuId", insertable=false, updatable=false, nullable=false, referencedColumnName = "id")
    @JsonIgnore
    public Menu menu;

//    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name="moduleId", nullable=false)
    private List<ModuleParameter> parameters;
//    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name="moduleId", nullable=false)
    private List<ModuleTransition> transitions;

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

    public int getIndex() {
        return index;
    }

    public void setIndex(int index) {
        this.index = index;
    }

//    public int getMenuId() {
//        return menuId;
//    }
//
//    public void setMenuId(int menuId) {
//        this.menuId = menuId;
//    }


    public Menu getMenu() {
        return menu;
    }

    public void setMenu(Menu menu) {
        this.menu = menu;
    }

    public List<ModuleParameter> getParameters() {
        return parameters;
    }

    public void setParameters(List<ModuleParameter> parameters) {
        this.parameters = parameters;
    }

    public List<ModuleTransition> getTransitions() {
        return transitions;
    }

    public void setTransitions(List<ModuleTransition> transitions) {
        this.transitions = transitions;
    }


    public String getParameterValue(int index){
        if(getParameters() != null && getParameters().size() > 0) {
            return getParameters().get(index).getValue();
        }
        return null;
    }

    public String getParameterValue(String name){
        Optional<ModuleParameter> parameter = getParameters().stream().filter(f->f.getName().equalsIgnoreCase(name)).findFirst();
        if(parameter.isPresent()){
            return parameter.get().getValue();
        }
        return null;
    }

    public Integer getTransitionNextMenuId(int index){
        if(getTransitions() != null && getTransitions().size() > index) {
            ModuleTransition moduleTransition = getTransitions().get(index);
            if(moduleTransition.getNextMenu() != null) {
                return moduleTransition.getNextMenu().getId();
            }
        }
        return null;
    }
}
