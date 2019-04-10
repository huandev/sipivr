package ru.sipivr.speech.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import ru.sipivr.core.model.Module;
import ru.sipivr.core.result.AbstractResult;
import ru.sipivr.core.service.AppConfig;
import ru.sipivr.core.utils.StringUtils;
import ru.sipivr.speech.dao.YandexTtsDao;
import ru.sipivr.speech.model.YandexTts;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Created by okarpukhin on 08.12.2018.
 */
@Service
public class YandexTtsService {
    private static final Logger logger = LoggerFactory.getLogger(YandexTtsService.class);

    private final String folderName = "yandex.tts";

    @Value("${yandex.tts.key}")
    private String yandexTtsKey;

    @Autowired
    private AppConfig appConfig;

    @Autowired
    private YandexTtsDao yandexTtsDao;

    @PostConstruct
    public void createVoiceMailFolder(){
        logger.info("");
        new File(appConfig.getSoundPath(), folderName).mkdirs();
    }

    public String getFolderName() {
        return folderName;
    }

    public YandexTts get(YandexTts filter) throws Exception {
        /*
        text=<текст>
        format=<mp3|wav|opus>
        [quality=<hi|lo>]
        lang=<ru-RU|en-US|uk-UK|tr-TR>
        speaker=<jane|oksana|alyss|omazh|zahar|ermil>
        [speed=<скорость речи>]
        [emotion=<good|neutral|evil>]
        */

        YandexTts yandexTts = yandexTtsDao.get(filter);

        if (yandexTts == null) {
            synchronized (this) {
                yandexTts = yandexTtsDao.get(filter);

                if (yandexTts == null) {
                    yandexTts = filter;

                    String folderPath = new File(appConfig.getSoundPath(), folderName).getPath();
                    File tempFilePath = new File(folderPath, UUID.randomUUID().toString());
                    downloadFile(yandexTts, tempFilePath);

                    yandexTtsDao.save(yandexTts);

                    tempFilePath.renameTo(new File(folderPath, yandexTts.getFileName()));
                }
            }
        }

        return yandexTts;
    }

    private void downloadFile(ru.sipivr.speech.model.YandexTts yandexTts, File targetFile) throws Exception {
        String url = "https://tts.voicetech.yandex.net/generate?key=" + yandexTtsKey;
        url += "&text=" + java.net.URLEncoder.encode(yandexTts.getText(), "UTF-8");
        url += "&format=" + yandexTts.getFormat();
        url += "&quality=" + yandexTts.getQuality();
        url += "&lang=" + yandexTts.getLang();
        url += "&speaker=" + yandexTts.getSpeaker();
        url += "&speed=" + java.net.URLEncoder.encode(yandexTts.getSpeed(), "UTF-8");
        url += "&emotion=" + yandexTts.getEmotion();

        HttpURLConnection conn = (HttpURLConnection) new URL(url).openConnection();
        conn.setRequestMethod("GET");
        int status = conn.getResponseCode();
        if (status == 200) {
            try (InputStream inputStream = conn.getInputStream()) {
                try (FileOutputStream outStream = new FileOutputStream(targetFile)) {
                    byte[] buffer = new byte[1024];
                    int length;
                    while ((length = inputStream.read(buffer)) != -1) {
                        outStream.write(buffer, 0, length);
                    }
                }
            }
        } else {
            throw new Exception("Http server returned status " + status);
        }
    }
}
