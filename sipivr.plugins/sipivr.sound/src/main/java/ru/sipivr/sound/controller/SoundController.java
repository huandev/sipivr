package ru.sipivr.sound.controller;

import org.apache.commons.io.FilenameUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.sipivr.core.controller.BaseController;
import ru.sipivr.core.enums.MediaConverterFormat;
import ru.sipivr.core.enums.UserRole;
import ru.sipivr.core.model.User;
import ru.sipivr.core.widgets.TableSearchFilter;
import ru.sipivr.core.widgets.TableSearchResult;
import ru.sipivr.sound.dao.SoundDao;
import ru.sipivr.sound.model.Sound;
import ru.sipivr.core.utils.UserException;
import ru.sipivr.sound.model.base.BaseSound;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Karpukhin on 07.01.2016.
 */
@Controller
@PreAuthorize("isAuthenticated()")
@RequestMapping("/sound")
public class SoundController extends BaseController {
    private File getFileBySound(Sound s, MediaConverterFormat extension) {
        return getFileBySound(s.getId(), extension);
    }

    private File getFileBySound(int id, MediaConverterFormat extension) {
        return new File(appConfig.getSoundPath("db", String.format("%s.%s", id, extension.getValue())));
    }

    @RequestMapping("/index")
    public String sounds() throws Exception {
        if (!new File(appConfig.getSoundPath("db")).exists() && !new File(appConfig.getSoundPath("db")).mkdirs()){
            throw new UserException();
        }
        if (!new File(appConfig.getSoundPath("record")).exists() && !new File(appConfig.getSoundPath("record")).mkdirs()){
            throw new UserException();
        }
        return "/sounds";
    }

    @RequestMapping(value = "/save", method = RequestMethod.POST)
    @Transactional(readOnly = false, rollbackFor = java.lang.Exception.class)
    @ResponseBody
    public List<Sound> save(@RequestParam("files") List<MultipartFile> files) throws Exception {
        for (MultipartFile file : files) {
            String extension = FilenameUtils.getExtension(file.getOriginalFilename());

            if (MediaConverterFormat.valueOf(extension.toUpperCase()) == null)
                throw new UserException("format not supported");
        }

        List<Sound> model = new ArrayList<>();

        for (MultipartFile file : files) {
            Sound sound = new Sound();
            sound.setName(file.getOriginalFilename().replaceAll("[.].+", ""));
            sound.setOwnerId(getCurrentUser().getId());
            sound.setOwner(getCurrentUser());

            dao.get(SoundDao.class).save(sound);

            String extension = FilenameUtils.getExtension(file.getOriginalFilename());
            MediaConverterFormat mediaConverterFormat = MediaConverterFormat.valueOf(extension.toUpperCase());

            File targetFile = getFileBySound(sound, mediaConverterFormat);
            file.transferTo(targetFile);

            if (extension.equals(MediaConverterFormat.MP3.getValue()))
                mediaConverter.convert(targetFile, getFileBySound(sound, MediaConverterFormat.WAV));
            else if (extension.equals(MediaConverterFormat.WAV.getValue()))
                mediaConverter.convert(targetFile, getFileBySound(sound, MediaConverterFormat.MP3));

            model.add(sound);
        }

        return model;
    }

    @RequestMapping(value = "/updateFile/{id}", method = RequestMethod.POST)
    @Transactional(readOnly = false, rollbackFor = java.lang.Exception.class)
    @ResponseBody
    public Sound updateFile(@RequestParam("file") MultipartFile file, @PathVariable("id") int id) throws Exception {
        String extension = FilenameUtils.getExtension(file.getOriginalFilename());
        if (MediaConverterFormat.valueOf(extension.toUpperCase()) == null) {
            throw new UserException("format not supported");
        }
        Sound sound = dao.get(SoundDao.class).get(id);

        MediaConverterFormat mediaConverterFormat = MediaConverterFormat.valueOf(extension.toUpperCase());
        File targetFile = getFileBySound(sound, mediaConverterFormat);
        file.transferTo(targetFile);

        if (extension.equals(MediaConverterFormat.MP3.getValue()))
            mediaConverter.convert(targetFile, getFileBySound(sound, MediaConverterFormat.WAV));
        else if (extension.equals(MediaConverterFormat.WAV.getValue()))
            mediaConverter.convert(targetFile, getFileBySound(sound, MediaConverterFormat.MP3));

        return sound;
    }

    @RequestMapping(value = "/update", method = RequestMethod.POST)
    @ResponseBody
    public Sound update(Sound model) throws Exception {
        return dao.get(SoundDao.class).update(model);
    }

    @RequestMapping(value = "/play/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public void play(HttpServletResponse response, @PathVariable("id") int id) throws Exception {
        Sound sound = dao.get(SoundDao.class).get(id);
        File file = getFileBySound(sound, MediaConverterFormat.MP3);
        playMediaFile(response, file);
    }

    @RequestMapping(value = "/remove/{id}")
    @Transactional(readOnly = false, rollbackFor = java.lang.Exception.class)
    @ResponseStatus(value = HttpStatus.OK)
    public void remove(@PathVariable("id") int id){
        dao.get(SoundDao.class).removeByKey(id);

        getFileBySound(id, MediaConverterFormat.WAV).delete();
        getFileBySound(id, MediaConverterFormat.MP3).delete();
    }

    @RequestMapping(value = "/search", produces = "application/json")
    @ResponseBody
    public TableSearchResult search(@RequestBody TableSearchFilter<BaseSound> filter) {
        if(!getCurrentUser().hasAnyRole(UserRole.ADMIN)){
            filter.getModel().setOwnerId(getCurrentUser().getId());
        }
        return dao.get(SoundDao.class).search(filter);
    }

    @RequestMapping(value = "/list", produces = "application/json")
    @ResponseBody
    public List<Sound> list() {
        if(getCurrentUser().hasAnyRole(UserRole.ADMIN)) {
            return dao.get(SoundDao.class).list();
        } else {
            return dao.get(SoundDao.class).getByOwnerId(getCurrentUser().getId());
        }
    }
}
