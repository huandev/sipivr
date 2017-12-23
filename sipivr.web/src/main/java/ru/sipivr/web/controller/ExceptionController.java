package ru.sipivr.web.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.hibernate.exception.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.sipivr.core.controller.BaseController;
import ru.sipivr.core.utils.AjaxUtils;
import ru.sipivr.core.utils.StringUtils;
import ru.sipivr.core.utils.UserException;
import ru.sipivr.web.viewmodel.CallModel;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * Created by Karpukhin on 06.01.2016.
 */
@Controller
@ControllerAdvice
public class ExceptionController extends BaseController {
    protected final Logger logger = LoggerFactory.getLogger(getClass());

    @RequestMapping("/error")
    public String error(HttpServletResponse response, Model model) throws IOException {
        return global((Exception)request.getAttribute(RequestDispatcher.ERROR_EXCEPTION), response, model);
    }

    @ExceptionHandler(value = UserException.class)
    public String userException(UserException e, HttpServletResponse response, Model model) throws IOException {
        return global(e, response, model);
    }

    private String global(Exception exception, HttpServletResponse response, Model model) throws IOException {
        int status_code = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE) == null ? 500 : (int) request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);

        if(exception == null){
            exception = (Exception)request.getAttribute("org.springframework.web.servlet.DispatcherServlet.EXCEPTION");
        }

        String message = null;

        if(exception == null) {
            logger.error("Error " + status_code);
        } else {
            logger.error("Error " + status_code, exception);

            if(exception instanceof ServletException && ((ServletException)exception).getRootCause() != null){
                Throwable rootCause = ((ServletException)exception).getRootCause();
                if(rootCause instanceof UserException) {
                    message = rootCause.getMessage();
                } else if(rootCause instanceof ConstraintViolationException){
                    message = bundleService.getLocaleMessage("ui.error.invalid");
                } else if(rootCause instanceof org.hibernate.StaleObjectStateException){
                    message = bundleService.getLocaleMessage("ui.error.invalidState");
                }
            } else if(exception instanceof UserException) {
                message = exception.getMessage();
            } else if(exception instanceof org.springframework.web.bind.MethodArgumentNotValidException ) {
                message = bundleService.getLocaleMessage("ui.error.invalidOperation");
            }
        }

        if(StringUtils.isNullOrEmpty(message)){
            message = bundleService.getLocaleMessage("ui.error." + status_code, "");
        }

        if (AjaxUtils.isAjaxRequest(request)) {
            response.setCharacterEncoding("UTF-8");
            response.setStatus(status_code);
            response.setContentType("text/html;charset=UTF-8");
            try (PrintWriter pw = response.getWriter()) {
                pw.write(message);
            }
            response.flushBuffer();
            return null;
        } else{
            if(request.getServletPath().startsWith("/service/")){
                response.setCharacterEncoding("UTF-8");
                response.setStatus(status_code);
                response.setContentType("application/json;charset=UTF-8");

                CallModel callModel = new CallModel(status_code);
                callModel.setMessage(message);
                new ObjectMapper().writeValue(response.getOutputStream(), callModel);
                response.flushBuffer();
                return null;
            }
        }

        model.addAttribute("code", status_code);
        model.addAttribute("message", message);

        return "/error";
    }
}
