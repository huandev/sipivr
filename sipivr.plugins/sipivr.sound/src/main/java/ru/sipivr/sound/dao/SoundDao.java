package ru.sipivr.sound.dao;

import org.apache.commons.lang.time.DateUtils;
import org.hibernate.Criteria;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import ru.sipivr.core.dao.BaseDao;
import ru.sipivr.core.utils.StringUtils;
import ru.sipivr.core.widgets.TableSearchFilter;
import ru.sipivr.core.widgets.TableSearchResult;
import ru.sipivr.sound.model.Sound;
import ru.sipivr.sound.model.base.BaseSound;

import java.util.List;

/**
 * Created by Karpukhin on 07.01.2016.
 */
@Repository
public class SoundDao extends BaseDao<Sound> {
    public List<Sound> getByOwnerId(int ownerId) {
        return createCriteria()
                .add(Restrictions.eq("ownerId", ownerId))
                .addOrder(Order.asc("name"))
                .list();
    }

    public TableSearchResult<BaseSound> search(TableSearchFilter<BaseSound> filter) {
        Criteria criteria = createCriteria();

        if (filter.getModel().getOwnerId() != 0) {
            criteria = criteria.add(Restrictions.eq("ownerId", filter.getModel().getOwnerId()));
        }
        if (!StringUtils.isNullOrEmpty(filter.getModel().getName())) {
            criteria = criteria.add(Restrictions.ilike("name", filter.getModel().getName(), MatchMode.ANYWHERE));
        }
        if (!StringUtils.isNullOrEmpty(filter.getModel().getDescription())) {
            criteria = criteria.add(Restrictions.ilike("description", filter.getModel().getDescription(), MatchMode.ANYWHERE));
        }
        if (filter.getModel().getCreateDate() != null) {
            criteria = criteria.add(Restrictions.between("createDate", filter.getModel().getCreateDate(), DateUtils.addDays(filter.getModel().getCreateDate(), 1)));
        }

        TableSearchResult<BaseSound> result = new TableSearchResult<>();
        result.setCount((long) criteria.setProjection(Projections.rowCount()).uniqueResult());

        criteria.setProjection(null);
        criteria.setResultTransformer(Criteria.ROOT_ENTITY);

        criteria = criteria.setFirstResult((filter.getPageNumber() - 1) * filter.getPageSize());
        criteria = criteria.setMaxResults(filter.getPageSize());

        if (!StringUtils.isNullOrEmpty(filter.getSortField())) {
            if (filter.getSortType() == TableSearchFilter.SortType.Asc) {
                criteria = criteria.addOrder(Order.asc(filter.getSortField()));
            } else {
                criteria = criteria.addOrder(Order.desc(filter.getSortField()));
            }
        }

        result.setItems(criteria.list());

        return result;
    }
}
