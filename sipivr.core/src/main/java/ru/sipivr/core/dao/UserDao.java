package ru.sipivr.core.dao;

import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import ru.sipivr.core.model.User;

/**
 * Created by Karpukhin on 01.01.2016.
 */
@Repository
public class UserDao extends BaseDao<User> {
    public User getByName(String name) {
        return (User) createCriteria()
                .add(Restrictions.eq("name", name).ignoreCase())
                .uniqueResult();
    }
}