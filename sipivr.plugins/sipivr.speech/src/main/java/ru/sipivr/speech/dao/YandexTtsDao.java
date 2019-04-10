package ru.sipivr.speech.dao;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import ru.sipivr.core.dao.BaseDao;
import ru.sipivr.speech.model.YandexTts;

import java.util.List;

/**
 * Created by Admin on 26.02.2016.
 */
@Repository
public class YandexTtsDao extends BaseDao<YandexTts> {
    public YandexTts get(YandexTts model) {

        return (YandexTts) createCriteria()
                .add(Restrictions.eq("text", model.getText()))
                .add(Restrictions.eq("format", model.getFormat()))
                .add(Restrictions.eq("quality", model.getQuality()))
                .add(Restrictions.eq("lang", model.getLang()))
                .add(Restrictions.eq("speaker", model.getSpeaker()))
                .add(Restrictions.eq("speed", model.getSpeed()))
                .add(Restrictions.eq("emotion", model.getEmotion()))
                .uniqueResult();
    }
}