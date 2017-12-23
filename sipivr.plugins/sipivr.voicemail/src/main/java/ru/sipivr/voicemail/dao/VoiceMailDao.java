package ru.sipivr.voicemail.dao;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import ru.sipivr.core.dao.BaseDao;
import ru.sipivr.voicemail.model.VoiceMail;

import java.util.List;

/**
 * Created by Admin on 26.02.2016.
 */
@Repository
public class VoiceMailDao  extends BaseDao<VoiceMail> {
    public List<VoiceMail> getByCampaignId(int campaignId) {
        return createCriteria()
                .createAlias("campaignVersion", "cv")
                .add(Restrictions.eq("cv.campaignId", campaignId))
                .addOrder(Order.asc("id"))
                .list();
    }

    public List<VoiceMail> getByCampaignOwnerId(int ownerId) {
        return createCriteria()
                .createAlias("campaignVersion", "cv")
                .createAlias("cv.campaign", "c")
                .add(Restrictions.eq("c.ownerId", ownerId))
                .addOrder(Order.asc("id"))
                .list();
    }
}
