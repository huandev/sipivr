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
public class Input extends ResultPlugin {
    @Override
    public List<AbstractResult> run(final Module module, final String input) {
        return new ArrayList<AbstractResult>() {{
            int duration = Integer.parseInt(module.getParameters().get(0).getValue());
            int length = module.getParameters().size() > 1 ? Integer.parseInt(module.getParameters().get(1).getValue()) : 1;
            add(new ru.sipivr.core.result.Input(duration, length));
        }};
    }
}
