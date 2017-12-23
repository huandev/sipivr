package ru.sipivr.web.schedule;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Component;

/**
 * Created by Karpukhin on 02.01.2016.
 */
@Component
public class ContextClosedHandler implements ApplicationListener<ContextClosedEvent> {
    @Autowired
    private ThreadPoolTaskExecutor executor;
    @Autowired
    private ThreadPoolTaskScheduler scheduler;

    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Override
    public void onApplicationEvent(ContextClosedEvent event) {
        logger.info("ContextClosedEvent executing");

        scheduler.shutdown();
        executor.shutdown();

        logger.info("ContextClosedEvent executed");
    }
}
