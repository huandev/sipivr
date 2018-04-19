package ru.sipivr.report.rest;

import org.apache.commons.lang.time.DateUtils;
import org.apache.poi.ss.usermodel.Sheet;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.sipivr.core.controller.BaseController;
import ru.sipivr.core.enums.UserRole;
import ru.sipivr.core.utils.StringUtils;
import ru.sipivr.report.excel.Report;
import ru.sipivr.core.model.Call;
import ru.sipivr.core.model.CallTransition;
import ru.sipivr.core.model.Menu;

import javax.servlet.http.HttpServletResponse;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * Created by Karpukhin on 11.01.2016.
 */
@RestController(value="ru.sipivr.report.rest.ApiController")
@PreAuthorize("isAuthenticated()")
@RequestMapping("/api")
public class ApiController extends BaseController {
    @RequestMapping(value = "/report")
    public void report(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date from,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date to, HttpServletResponse response) throws Exception {

        String fileName = "sipivr_" + new SimpleDateFormat("yyyyMMdd").format(from) + "_" + new SimpleDateFormat("yyyyMMdd").format(to) + ".xlsx";

        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=" + fileName);

        List<Call> calls;
        if(getCurrentUser().hasAnyRole(UserRole.ADMIN)) {
            calls = dao.getCallDao().getByInterval(from, DateUtils.addDays(to, 1));
        } else {
            calls = dao.getCallDao().getByIntervalAndOwner(from, DateUtils.addDays(to, 1), getCurrentUser().getId());
        }

        try (Report report = new Report(response.getOutputStream())) {
            Sheet sheet = report.createSheet(bundleService.getLocaleMessage("ru.sipivr.report.reportbycalls"), 10, 16, 19, 20, 20, 15, 20, 40, 20, 20);
            report.addRow(sheet, report.getHeadStyle(),
                    bundleService.getLocaleMessage("model.call.id"),
                    bundleService.getLocaleMessage("model.call.callerId"),
                    bundleService.getLocaleMessage("model.call.calledId"),
                    bundleService.getLocaleMessage("model.call.createdate"),
                    bundleService.getLocaleMessage("model.call.enddate"),
                    bundleService.getLocaleMessage("ru.sipivr.report.duration"),
                    bundleService.getLocaleMessage("model.campaign"),
                    bundleService.getLocaleMessage("ru.sipivr.report.route"),
                    bundleService.getLocaleMessage("ru.sipivr.report.lastmenu"),
                    bundleService.getLocaleMessage("model.call.transferNumber"));

            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            SimpleDateFormat durationFormat = new SimpleDateFormat("mm:ss");
            for (Call call : calls) {
                CallTransition lastTransition = call.getTransitions().get(call.getTransitions().size() - 1);
                Menu lastMenu = dao.getMenuDao().get(lastTransition.getMenuId());

                Date endDate = call.getEndDate() == null ? lastTransition.getCreateDate() : call.getEndDate();

                String route = "";
                for (CallTransition t : call.getTransitions()) {
                    String input = t.getInput();

                    if(!StringUtils.isNullOrEmpty(input)) {
                        route += " (DTMF " + input + ")";
                    }

                    if (route.length() > 0) {
                        route += " => ";
                    }

                    Menu menu = dao.getMenuDao().get(t.getMenuId());
                    route += menu.getName();
                }

                report.addRow(sheet, report.getBodyStyle(), call.getId(),
                        call.getCallerId(),
                        call.getCalledId(),
                        simpleDateFormat.format(call.getCreateDate()),
                        simpleDateFormat.format(endDate),
                        durationFormat.format(new Date(endDate.getTime() - call.getCreateDate().getTime())),
                        call.getCampaignVersion().getCampaign().getName(),
                        route,
                        lastMenu.getName(),
                        call.getTransferNumber());
            }
        }
    }
}
