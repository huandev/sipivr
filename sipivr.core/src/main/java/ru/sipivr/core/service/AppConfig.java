package ru.sipivr.core.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.File;

/**
 * Created by Karpukhin on 10.01.2016.
 */
@Component
public class AppConfig {
    @Value("${sipivr.sound_path}")
    private String soundPath;

    @Value("${sipivr.script_path}")
    private String scriptPath;

    public String getSoundPath(String... parts) {
        String res = soundPath;
        for(String part: parts){
            res = new File(res, part).getPath();
        }
        return res;
    }

    public String getDbSoundPath(String... parts) {
        String res = getSoundPath("db");
        for(String part: parts){
            res = new File(res, part).getPath();
        }
        return res;
    }

    public String getRecordSoundPath(String... parts) {
        String res = getSoundPath("record");
        for(String part: parts){
            res = new File(res, part).getPath();
        }
        return res;
    }

    public String getScriptPath(String... parts) {
        String res = scriptPath;
        for(String part: parts){
            res = new File(res, part).getPath();
        }
        return res.toLowerCase();
    }
}
