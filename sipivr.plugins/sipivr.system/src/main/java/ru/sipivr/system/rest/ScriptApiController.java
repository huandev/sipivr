package ru.sipivr.system.rest;

import org.apache.commons.io.FileUtils;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import ru.sipivr.core.controller.BaseController;

import java.io.File;
import java.util.Arrays;
import java.util.Collection;

@PreAuthorize("isAuthenticated()")
@RequestMapping("/api")
@RestController
public class ScriptApiController extends BaseController {
    @RequestMapping(value = "/scripts", produces = "application/json")
    @ResponseBody
    public String[] scripts() {
        Collection<File> files = FileUtils.listFiles(new File(appConfig.getScriptPath()), new String[]{"js"}, true);
        return files.stream().map(f -> new File(appConfig.getScriptPath()).toURI().relativize(new File(f.getPath()).toURI()).getPath()).toArray(String[]::new);
    }
}