package ru.sipivr.web.auth;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.core.PriorityOrdered;
import org.springframework.security.access.annotation.Jsr250MethodSecurityMetadataSource;
import org.springframework.security.access.expression.method.DefaultMethodSecurityExpressionHandler;
import org.springframework.security.web.access.expression.DefaultWebSecurityExpressionHandler;

/**
 * Created by Karpukhin on 02.01.2016.
 */
public class DefaultRolesPrefixPostProcessor implements BeanPostProcessor, PriorityOrdered {
    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName)
            throws BeansException {

        // remove this if you are not using JSR-250
        if(bean instanceof Jsr250MethodSecurityMetadataSource) {
            ((Jsr250MethodSecurityMetadataSource) bean).setDefaultRolePrefix(null);
        }

        if(bean instanceof DefaultMethodSecurityExpressionHandler) {
            ((DefaultMethodSecurityExpressionHandler) bean).setDefaultRolePrefix(null);
        }
        if(bean instanceof DefaultWebSecurityExpressionHandler) {
            ((DefaultWebSecurityExpressionHandler) bean).setDefaultRolePrefix(null);
        }
        return bean;
    }

    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName)
            throws BeansException {
        return bean;
    }

    @Override
    public int getOrder() {
        return PriorityOrdered.HIGHEST_PRECEDENCE;
    }
}