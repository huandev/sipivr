package ru.sipivr.registration.dao;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import ru.sipivr.core.dao.BaseDao;
import ru.sipivr.registration.model.Registration;

/**
 * Created by Admin on 22.01.2016.
 */
@Repository
public class RegistrationDao extends BaseDao<Registration> {
    public Registration getByGuid(String guid) {
        return (Registration) createCriteria()
                .add(Restrictions.eq("guid", guid).ignoreCase())
                .uniqueResult();
    }
}
