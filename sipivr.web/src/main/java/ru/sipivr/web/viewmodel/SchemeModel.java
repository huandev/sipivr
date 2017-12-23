package ru.sipivr.web.viewmodel;

import ru.sipivr.core.model.Menu;

import java.util.List;

/**
 * Created by Karpukhin on 07.01.2016.
 */
public class SchemeModel {
    private int campaignId;

    private List<Menu> menus;

    private Menu startMenu;

    public int getCampaignId() {
        return campaignId;
    }

    public void setCampaignId(int campaignId) {
        this.campaignId = campaignId;
    }

    public List<Menu> getMenus() {
        return menus;
    }

    public void setMenus(List<Menu> menus) {
        this.menus = menus;
    }

    public Menu getStartMenu() {
        return startMenu;
    }

    public void setStartMenu(Menu startMenu) {
        this.startMenu = startMenu;
    }
}
