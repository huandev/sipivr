package ru.sipivr.core.dao;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Projections;
import org.hibernate.engine.spi.SessionImplementor;
import org.hibernate.metadata.ClassMetadata;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;
import java.lang.reflect.ParameterizedType;
import java.util.List;

/**
 * Created by Karpukhin on 01.01.2016.
 */
@Transactional(value = "transactionManager", propagation = Propagation.REQUIRED, readOnly = true, rollbackFor = Exception.class)
public abstract class BaseDao<Entity> {
    private Class<? extends Entity> daoType;

    @Autowired
    private SessionFactory sessionFactory;

    public BaseDao() {
        daoType = (Class<Entity>) ((ParameterizedType) getClass().getGenericSuperclass())
                .getActualTypeArguments()[0];
    }

    protected Session currentSession() {
        return sessionFactory.getCurrentSession();
    }

    protected Criteria createCriteria() {
        return currentSession().createCriteria(daoType);
    }

    @Transactional(value = "transactionManager", propagation = Propagation.REQUIRED, readOnly = false, rollbackFor = Exception.class)
    public Serializable save(Entity entity) {
        Serializable res = currentSession().save(entity);
        //currentSession().flush();
        return res;
    }

    @Transactional(value = "transactionManager", propagation = Propagation.REQUIRED, readOnly = false, rollbackFor = Exception.class)
    public Entity update(Entity entity) {
        boolean inSession = currentSession().contains(entity);
        if(inSession){
            currentSession().update(entity);
            currentSession().flush();
        } else {
            ClassMetadata classMetadata = sessionFactory.getClassMetadata(entity.getClass());

            Serializable id = classMetadata.getIdentifier(entity, (SessionImplementor) currentSession());
            Entity temp = get(id);
            if(temp == null){
                throw new org.hibernate.StaleObjectStateException(classMetadata.getEntityName(), id);
            }

            entity = (Entity)currentSession().merge(entity);
            currentSession().flush();
            currentSession().refresh(entity);
        }

        return entity;
    }

    @Transactional(value = "transactionManager", propagation = Propagation.REQUIRED, readOnly = false, rollbackFor = Exception.class)
    public void remove(Entity entity) {
        currentSession().delete(entity);
        currentSession().flush();
    }

    public void removeByKey(Serializable key) {
        remove(get(key));
    }

    public List<Entity> list() {
        return createCriteria().list();
    }

    public Entity get(Serializable key) {
        return currentSession().get(daoType, key);
    }

    public long count(){
        return (long)createCriteria().setProjection(Projections.rowCount()).uniqueResult();
    }
}