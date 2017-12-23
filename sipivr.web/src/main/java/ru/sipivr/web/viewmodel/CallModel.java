package ru.sipivr.web.viewmodel;

import ru.sipivr.core.result.AbstractResult;

import java.util.List;

/**
 * Created by Karpukhin on 07.01.2016.
 */
public class CallModel {
    private int status;
    private Long callId;
    private String message;

    private List<AbstractResult> modules;

    public CallModel(int status) {
        this.status = status;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getCallId() {
        return callId;
    }

    public void setCallId(Long callId) {
        this.callId = callId;
    }

    public List<AbstractResult> getModules() {
        return modules;
    }

    public void setModules(List<AbstractResult> modules) {
        this.modules = modules;
    }
}
