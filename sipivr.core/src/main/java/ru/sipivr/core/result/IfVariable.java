package ru.sipivr.core.result;

import ru.sipivr.core.enums.IfVariableMethod;

public class IfVariable extends AbstractResult {
    private final String name;
    private final String value;
    private final IfVariableMethod method;
    private final Integer nextMenuId;

    public IfVariable(String name, String value, IfVariableMethod method, Integer nextMenuId) {
        this.name = name;
        this.value = value;
        this.method = method;
        this.nextMenuId = nextMenuId;
    }

    public String getName() {
        return name;
    }

    public String getValue() {
        return value;
    }

    public IfVariableMethod getMethod() {
        return method;
    }

    public Integer getNextMenuId() {
        return nextMenuId;
    }
}