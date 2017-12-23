package ru.sipivr.core.dao;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import ru.sipivr.core.model.Call;

import java.util.Date;
import java.util.List;

/**
 * Created by Karpukhin on 02.01.2016.
 */
@Repository
public class CallDao extends BaseDao<Call> {
    public List<Call> getByInterval(Date from, Date to) {
        return createCriteria()
                .add(Restrictions.and(
                                Restrictions.ge("createDate", from),
                                Restrictions.lt("createDate", to))
                )
                .addOrder(Order.asc("createDate"))
                .list();
    }

    public List<Call> getByIntervalAndOwner(Date from, Date to, int ownerId) {
        return createCriteria()
                .add(Restrictions.eq("campaignVersion.campaign.ownerId", ownerId))
                .add(Restrictions.and(
                                Restrictions.ge("createDate", from),
                                Restrictions.lt("createDate", to))
                )
                .addOrder(Order.asc("createDate"))
                .list();
    }
}
