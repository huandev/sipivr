package ru.sipivr.script.rest;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import ru.sipivr.core.controller.BaseController;

import java.io.File;
import java.util.Arrays;

@PreAuthorize("isAuthenticated()")
@RequestMapping("/api")
@RestController
public class ScriptApiController extends BaseController {
    @RequestMapping(value = "/scripts", produces = "application/json")
    @ResponseBody
    public String[] scripts() {
        File[] files = new File(appConfig.getScriptPath()).listFiles((dir, name) -> name.endsWith(".js"));
        return Arrays.stream(files).map(f -> new File(appConfig.getScriptPath()).toURI().relativize(new File(f.getPath()).toURI()).getPath()).toArray(String[]::new);
    }
}