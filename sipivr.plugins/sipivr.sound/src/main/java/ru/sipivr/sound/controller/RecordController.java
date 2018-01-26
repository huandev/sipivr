package ru.sipivr.sound.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import ru.sipivr.core.controller.BaseController;
import ru.sipivr.core.enums.MediaConverterFormat;
import ru.sipivr.core.enums.UserRole;
import ru.sipivr.core.model.User;
import ru.sipivr.core.utils.UserException;
import ru.sipivr.sound.dao.SoundDao;
import ru.sipivr.sound.model.Sound;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;

/**
 * Created by Karpukhin on 17.01.2016.
 */
@Controller
@PreAuthorize("isAuthenticated()")
@RequestMapping("/record")
public class RecordController extends BaseController {
    private File getFileBySound(Sound s, MediaConverterFormat extension) {
        return new File(appConfig.getSoundPath("db"), String.format("%s.%s", s.getId(), extension.getValue()));
    }

    @RequestMapping(value = "/quick", produces = "application/json")
    @ResponseBody
    public Sound quick() {
        Sound sound = new Sound();
        sound.setOwnerId(getCurrentUser().getId());
        sound.setOwner(getCurrentUser());
        sound.setName(bundleService.getLocaleMessage("ru.sipivr.sound.plugin.quickrecord"));
        dao.get(SoundDao.class).save(sound);
        return sound;
    }

    @RequestMapping(value = "/refresh")
    @ResponseStatus(value = HttpStatus.OK)
    public void quickRefresh(@RequestParam int soundId, @RequestParam String uuid) throws Exception {
        Sound sound = dao.get(SoundDao.class).get(soundId);
        User u = getCurrentUser();
        if (u.hasAnyRole(UserRole.ADMIN) || sound.getOwnerId() == u.getId()) {
            File targetFile = getFileBySound(sound, MediaConverterFormat.WAV);
            File sourceFile = new File(appConfig.getSoundPath(), "record/" + uuid + ".wav");

            Files.move(sourceFile.toPath(), targetFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
            mediaConverter.convert(targetFile, getFileBySound(sound, MediaConverterFormat.MP3));
        } else {
            throw new UserException();
        }
    }
}