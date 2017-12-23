package ru.sipivr.core.dao;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import ru.sipivr.core.model.Module;

import java.util.List;

/**
 * Created by Karpukhin on 02.01.2016.
 */
@Repository
public class ModuleDao extends BaseDao<Module> {
    public List<Module> getByMenuId(int menuId) {
        return createCriteria()
                .add(Restrictions.eq("menu.id", menuId))
                .addOrder(Order.asc("index"))
                .list();
    }
}
