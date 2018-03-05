package ru.sipivr.system.plugin;

import org.springframework.stereotype.Service;
import ru.sipivr.core.model.Module;
import ru.sipivr.core.plugin.ResultPlugin;
import ru.sipivr.core.result.AbstractResult;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by okarpukhin on 04.03.2018.
 */
@Service
public class NoInput extends ResultPlugin {
    @Override
    public List<AbstractResult> run(final Module module, final String input) {
        return new ArrayList<AbstractResult>() {{
            add(new ru.sipivr.core.result.NoInput(module.getTransitionNextMenuId(0)));
        }};
    }
}