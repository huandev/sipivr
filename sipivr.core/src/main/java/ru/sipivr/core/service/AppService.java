package ru.sipivr.core.service;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.RandomStringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.orm.hibernate5.HibernateTransactionManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.TransactionCallbackWithoutResult;
import org.springframework.transaction.support.TransactionTemplate;
import ru.sipivr.core.dao.UserDao;
import ru.sipivr.core.enums.UserRole;
import ru.sipivr.core.model.User;
import ru.sipivr.core.utils.StringUtils;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.io.File;
import java.io.FileOutputStream;

/**
 * Created by Karpukhin on 06.01.2016.
 */
@Service
public class AppService {
    private static final Logger logger = LoggerFactory.getLogger(AppService.class);

    @Autowired
    @Qualifier("transactionManager")
    protected HibernateTransactionManager txManager;
    @Autowired
    private AppConfig appConfig;
    @Autowired
    ResourcePatternResolver resourceResolver;
    @Autowired
    private UserDao userDao;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PreDestroy
    public void preDestroy() throws Exception {
        logger.info("");
    }

    @PostConstruct
    public void createAdmin() throws Exception {
        logger.info("");

        new TransactionTemplate(txManager).execute(new TransactionCallbackWithoutResult() {
            @Override
            protected void doInTransactionWithoutResult(TransactionStatus status) {
                long userCount = userDao.count();
                logger.info("userDao.count {}", userCount);

                if (userCount == 0) {
                    User admin = new User();
                    admin.setName("admin");
                    admin.setPassword(passwordEncoder.encode("admin"));
                    admin.setRoles(UserRole.ADMIN);
                    userDao.save(admin);
                }
            }
        });
    }

    @PostConstruct
    public void createRecordFolder(){
        logger.info("");
        new File(appConfig.getSoundPath(), "record").mkdirs();
    }

    @PostConstruct
    public void copySounds() throws Exception {
        logger.info("");

        int count = 0;
        for (Resource resource : resourceResolver.getResources("classpath*:sounds/**")) {
            String path = resource.getURL().getPath().replaceFirst(".*!/sounds/", "");
            String fileExtension = FilenameUtils.getExtension(path).toLowerCase();

            if (!StringUtils.isNullOrEmpty(path) && (fileExtension.equals("wav") || fileExtension.equals("mp3"))) {
                File targetFile = new File(appConfig.getSoundPath(), path);

                targetFile.getParentFile().mkdirs();

                FileOutputStream fileOutputStream = new FileOutputStream(targetFile);

                IOUtils.copy(resource.getInputStream(), fileOutputStream);

                count++;
            }
        }
        logger.info("{}", count);
    }
}