package ru.sipivr.core.plugin;

import ru.sipivr.core.model.Module;
import ru.sipivr.core.result.AbstractResult;

import java.util.List;

/**
 * Created by Karpukhin on 02.01.2016.
 */
public abstract class ResultPlugin {
    private final String scriptPath;

    public ResultPlugin(){
        scriptPath = this.getClass().getName().replace("ru.sipivr.", "").replace('.', '/').toLowerCase();
    }

    public String getScriptPath() {
        return scriptPath;
    }

    public abstract List<AbstractResult> run(final Module module, final String input);
}