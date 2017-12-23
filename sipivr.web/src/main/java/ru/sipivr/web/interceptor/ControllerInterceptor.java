package ru.sipivr.web.interceptor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
import ru.sipivr.core.service.PluginService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by Karpukhin on 02.01.2016.
 */
public class ControllerInterceptor  implements HandlerInterceptor {
    private static Logger logger = LoggerFactory.getLogger(ControllerInterceptor.class);

    @Autowired
    private PluginService pluginService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        logger.trace("pre [{}] {} {}", request.getRemoteAddr(), request.getRequestURL(), request.getQueryString());
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        if(modelAndView != null) {
            modelAndView.getModel().put("pluginService", pluginService);
        }

        logger.trace("post [{}] {} {}", request.getRemoteAddr(), request.getRequestURL(), request.getQueryString());
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        logger.trace("after [{}] {} {}", request.getRemoteAddr(), request.getRequestURL(), request.getQueryString());
    }
}