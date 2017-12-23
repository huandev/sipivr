package ru.sipivr.core.dao;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import ru.sipivr.core.model.Menu;

import java.util.List;

/**
 * Created by Karpukhin on 02.01.2016.
 */
@Repository
public class MenuDao extends BaseDao<Menu> {
    public List<Menu> getByVersionId(int versionId) {
        return createCriteria().add(Restrictions.eq("versionId", versionId)).list();
    }
}
