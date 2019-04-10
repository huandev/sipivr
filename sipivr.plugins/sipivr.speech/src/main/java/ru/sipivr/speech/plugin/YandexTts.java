package ru.sipivr.speech.plugin;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import ru.sipivr.core.model.Module;
import ru.sipivr.core.plugin.ResultPlugin;
import ru.sipivr.core.result.AbstractResult;
import ru.sipivr.core.service.AppConfig;
import ru.sipivr.speech.dao.YandexTtsDao;
import ru.sipivr.speech.service.YandexTtsService;

import javax.annotation.PostConstruct;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Created by Admin on 27.02.2016.
 */
@Service
public class YandexTts extends ResultPlugin {
    private static final Logger logger = LoggerFactory.getLogger(YandexTts.class);

    @Autowired
    private YandexTtsService yandexTtsService;

    @Override
    public List<AbstractResult> run(final Module module, final String input) {
        try {
            ru.sipivr.speech.model.YandexTts filter = new ru.sipivr.speech.model.YandexTts();
            filter.setText(module.getParameterValue("text"));
            filter.setFormat(module.getParameterValue("format"));
            filter.setQuality(module.getParameterValue("quality"));
            filter.setLang(module.getParameterValue("lang"));
            filter.setSpeaker(module.getParameterValue("speaker"));
            filter.setSpeed(module.getParameterValue("speed"));
            filter.setEmotion(module.getParameterValue("emotion"));

            final ru.sipivr.speech.model.YandexTts yandexTts = yandexTtsService.get(filter);

            final String soundPath = new File(yandexTtsService.getFolderName(), yandexTts.getFileName()).getPath();
            return new ArrayList<AbstractResult>() {{
                add(new ru.sipivr.core.result.Sound(soundPath));
            }};
        } catch (Exception e) {
            logger.error("", e);
            return new ArrayList<>();
        }
    }
}
