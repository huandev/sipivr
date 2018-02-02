package ru.sipivr.system.plugin;

import org.springframework.stereotype.Service;
import ru.sipivr.core.enums.IfVariableMethod;
import ru.sipivr.core.model.Module;
import ru.sipivr.core.plugin.ResultPlugin;
import ru.sipivr.core.result.AbstractResult;

import java.util.ArrayList;
import java.util.List;

@Service
public class IfVariable extends ResultPlugin {
    @Override
    public List<AbstractResult> run(final Module module, final String input) {
        return new ArrayList<AbstractResult>() {{
            String name = module.getParameterValue("name");
            String value = module.getParameterValue("value");
            IfVariableMethod method = IfVariableMethod.valueOf(module.getParameterValue("method"));

            add(new ru.sipivr.core.result.IfVariable(name, value, method, module.getTransitionNextMenuId(0)));
        }};
    }
}