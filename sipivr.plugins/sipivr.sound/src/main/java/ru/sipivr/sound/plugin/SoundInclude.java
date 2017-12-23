package ru.sipivr.sound.plugin;

import org.springframework.stereotype.Service;
import ru.sipivr.core.plugin.IncludePlugin;

import java.util.List;

/**
 * Created by Admin on 28.02.2016.
 */
@Service
public class SoundInclude extends IncludePlugin {
    @Override
    public List<String> getSchemeIncludes() {
        List<String> res = super.getSchemeIncludes();
        res.add("/fileTemplate.jsp");
        return res;
    }
}
