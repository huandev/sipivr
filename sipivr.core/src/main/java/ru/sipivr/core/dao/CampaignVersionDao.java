package ru.sipivr.core.dao;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import ru.sipivr.core.model.CampaignVersion;

import java.util.List;

/**
 * Created by Karpukhin on 07.01.2016.
 */
@Repository
public class CampaignVersionDao extends BaseDao<CampaignVersion> {
    public List<CampaignVersion> getByCampaignId(int campaignId) {
        return createCriteria().add(Restrictions.eq("campaignId", campaignId)).list();
    }
}