package ru.sipivr.sound.controller;

import org.apache.commons.io.FilenameUtils;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import ru.sipivr.core.controller.BaseController;
import ru.sipivr.core.enums.MediaConverterFormat;
import ru.sipivr.core.utils.UserException;
import ru.sipivr.sound.viewModel.WavTreeNode;
import ru.sipivr.sound.viewModel.WavInfo;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.List;

@Controller
@PreAuthorize("isAuthenticated()")
@RequestMapping("/wav")
public class WavController extends BaseController {
    @RequestMapping("/index")
    public String index() {
        return "/wav/index";
    }

    @RequestMapping(value = "/tree", produces = "application/json")
    @ResponseBody
    public List<WavTreeNode> tree() {
        return WavTreeNode.fromDirectory(new File(appConfig.getSoundPath()), null);
    }

    @RequestMapping(value = "/get", produces = "application/json")
    @ResponseBody
    public WavInfo get(@RequestParam("path") String path) throws Exception {
        String extension = FilenameUtils.getExtension(path);
        if (!extension.equalsIgnoreCase("wav")) {
            throw new UserException();
        }
        return new WavInfo(appConfig.getSoundPath(path));
    }

    @RequestMapping(value = "/play", method = RequestMethod.GET, produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public void play(HttpServletResponse response, @RequestParam("path") String path) throws Exception {
        File sourceFile = new File(appConfig.getSoundPath(path));
        File targetFile = new File(appConfig.getSoundPath(path.replace(".wav", ".mp3")));
        if(!targetFile.exists()){
            mediaConverter.convert(sourceFile, targetFile);
        }
        playMediaFile(response, targetFile);
    }

    @RequestMapping(value = "/cut", produces = "application/json")
    @ResponseBody
    public WavInfo cut(@RequestParam("path") String path,
                              @RequestParam("from") int from,
                              @RequestParam("to") int to) throws Exception {
        String extension = FilenameUtils.getExtension(path);
        if (!extension.equalsIgnoreCase("wav")) {
            throw new UserException();
        }
        WavInfo model = new WavInfo(appConfig.getSoundPath(path));

        int byteFrom =  model.getSubchunk2Size() * from / model.getDuration();
        int byteTo =  model.getSubchunk2Size() * to / model.getDuration();
        byteFrom = byteFrom - byteFrom % (model.getBitsPerSample() / 8);
        byteTo = byteTo - byteTo % (model.getBitsPerSample() / 8);
        model.cut(byteFrom, byteTo);
        model.save(appConfig.getSoundPath(path));

        File mp3File = new File(appConfig.getSoundPath(path).replace(".wav", ".mp3"));
        if(mp3File.exists()){
            mp3File.delete();
        }
        return model;
    }

    @RequestMapping(value = "/addSilence", produces = "application/json")
    @ResponseBody
    public WavInfo addSilence(@RequestParam("path") String path,
                              @RequestParam("from") int from,
                              @RequestParam("length") int length) throws Exception {
        String extension = FilenameUtils.getExtension(path);
        if (!extension.equalsIgnoreCase("wav")) {
            throw new UserException();
        }
        return new WavInfo(appConfig.getSoundPath(path));
    }

    @RequestMapping(value = "/record", produces = "application/json")
    @ResponseBody
    public WavInfo record(@RequestParam("path") String path, @RequestParam("uuid") String uuid) throws Exception {
        String extension = FilenameUtils.getExtension(path);
        if (!extension.equalsIgnoreCase("wav")) {
            throw new UserException();
        }

        String target = appConfig.getSoundPath(path);
        String source = appConfig.getSoundPath("record", uuid + ".wav");

        File targetFile = new File(target);

        Files.move(new File(source).toPath(), targetFile.toPath(), StandardCopyOption.REPLACE_EXISTING);

        File mp3File = new File(target.replace(".wav", ".mp3"));
        if(mp3File.exists()){
            mp3File.delete();
        }
        return new WavInfo(target);
    }
}