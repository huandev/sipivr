package ru.sipivr.system.plugin;

import org.springframework.stereotype.Service;
import ru.sipivr.core.model.Module;
import ru.sipivr.core.plugin.ResultPlugin;
import ru.sipivr.core.result.AbstractResult;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Karpukhin on 07.01.2016.
 */
@Service
public class Condition extends ResultPlugin {
    @Override
    public List<AbstractResult> run(final Module module, final String input) {
        return new ArrayList<AbstractResult>() {{
            add(new ru.sipivr.core.result.Condition(
                    module.getTransitions().get(0).getNextMenu().getId(),
                    module.getParameters().get(0).getValue()));
        }};
    }
}
