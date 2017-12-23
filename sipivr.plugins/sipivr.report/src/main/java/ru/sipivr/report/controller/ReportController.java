package ru.sipivr.report.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.sipivr.core.controller.BaseController;

/**
 * Created by Karpukhin on 07.01.2016.
 */
@Controller
@PreAuthorize("isAuthenticated()")
public class ReportController extends BaseController {
    @RequestMapping(value = "/report")
    public String report(){
        return "/report";
    }
}
