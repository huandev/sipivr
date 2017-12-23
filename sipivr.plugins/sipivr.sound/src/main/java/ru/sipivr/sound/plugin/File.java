package ru.sipivr.sound.plugin;

import org.springframework.stereotype.Service;
import ru.sipivr.core.model.Module;
import ru.sipivr.core.plugin.ResultPlugin;
import ru.sipivr.core.result.AbstractResult;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by okarpukhin on 23.05.2015.
 */
@Service
public class File extends ResultPlugin {
    @Override
    public List<AbstractResult> run(final Module module, final String input) {
        return new ArrayList<AbstractResult>() {{
            add(new ru.sipivr.core.result.Sound(module.getParameters().get(0).getValue() + ".wav"));
        }};
    }
}