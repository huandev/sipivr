package ru.sipivr.voicemail.plugin;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.sipivr.core.model.Module;
import ru.sipivr.core.plugin.ResultPlugin;
import ru.sipivr.core.result.AbstractResult;
import ru.sipivr.core.service.AppConfig;

import javax.annotation.PostConstruct;
import java.io.File;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Admin on 27.02.2016.
 */
@Service
public class VoiceMail extends ResultPlugin {
    private static final Logger logger = LoggerFactory.getLogger(VoiceMail.class);

    @Autowired
    private AppConfig appConfig;

    @PostConstruct
    public void createVoiceMailFolder(){
        logger.info("");
        new File(appConfig.getSoundPath(), "voicemail").mkdirs();
    }

    @Override
    public List<AbstractResult> run(final Module module, final String input) {
        return new ArrayList<AbstractResult>() {{
            add(new ru.sipivr.core.result.Record(Integer.parseInt(module.getParameterValue(0)), "voicemail", "/service/voicemail"));
        }};
    }
}
