package ru.sipivr.sound.controller;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import ru.sipivr.core.controller.BaseController;
import ru.sipivr.core.utils.UserException;
import ru.sipivr.sound.wav.WavInfo;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Controller
@PreAuthorize("isAuthenticated()")
@RequestMapping("/soundEditor")
public class SoundEditorController extends BaseController {
    @RequestMapping("/index")
    public String index() {
        return "/soundEditor/index";
    }

    @RequestMapping(value = "/list", produces = "application/json")
    @ResponseBody
    public List<String> list() {
        Collection<File> files = FileUtils.listFiles(new File(appConfig.getSoundPath()), new String[]{".wav"}, true);
        List<String> model = new ArrayList<>(files.size());
        for(File file: files){
            String filePath = file.getPath().replace(appConfig.getSoundPath(), "");
            model.add(filePath);
        }
        return model;
    }

    @RequestMapping(value = "/getWavInfo", produces = "application/json")
    @ResponseBody
    public WavInfo getWavInfo(@RequestParam("filePath") String filePath) throws Exception {
        String extension = FilenameUtils.getExtension(filePath);
        if (!extension.equalsIgnoreCase("wav")) {
            throw new UserException();
        }
        return new WavInfo(appConfig.getSoundPath(filePath));
    }

    @RequestMapping(value = "/play", method = RequestMethod.GET, produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public void play(HttpServletResponse response, @RequestParam("filePath") String filePath) throws Exception {
        File file = new File(appConfig.getSoundPath(filePath.replace(".wav", ".mp3")));
        playMediaFile(response, file);
    }
}