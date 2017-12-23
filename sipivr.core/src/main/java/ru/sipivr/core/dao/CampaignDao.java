package ru.sipivr.core.dao;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import ru.sipivr.core.model.Campaign;

import java.util.List;

/**
 * Created by Karpukhin on 02.01.2016.
 */
@Repository
public class CampaignDao extends BaseDao<Campaign> {
    public List<Campaign> getByOwnerId(int ownerId) {
        return createCriteria()
                .add(Restrictions.eq("ownerId", ownerId))
                .addOrder(Order.asc("name"))
                .list();
    }

    public Campaign getByNumber(String number) {
        return (Campaign)createCriteria()
                .add(Restrictions.eq("number", number))
                .uniqueResult();
    }
}
