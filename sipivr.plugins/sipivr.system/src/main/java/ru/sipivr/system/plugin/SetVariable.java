package ru.sipivr.system.plugin;

import ru.sipivr.core.model.Module;
import ru.sipivr.core.plugin.ResultPlugin;
import ru.sipivr.core.result.AbstractResult;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by okarpukhin on 31.01.2018.
 */
public class SetVariable extends ResultPlugin {
    @Override
    public List<AbstractResult> run(final Module module, final String input) {
        return new ArrayList<AbstractResult>() {{
            String name = module.getParameterValue(0);
            String value = module.getParameterValue(1);
            add(new ru.sipivr.core.result.SetVariable(name, value));
        }};
    }
}
