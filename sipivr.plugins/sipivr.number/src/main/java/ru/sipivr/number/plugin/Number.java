package ru.sipivr.number.plugin;

import org.springframework.stereotype.Service;
import ru.sipivr.core.model.Module;
import ru.sipivr.core.plugin.ResultPlugin;
import ru.sipivr.core.result.AbstractResult;
import ru.sipivr.core.result.Sound;
import ru.sipivr.core.utils.StringUtils;
import ru.sipivr.number.core.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Karpukhin on 12.01.2016.
 */
@Service
public class Number extends ResultPlugin {
    private static final NumberSpeller numberSpeller = new NumberSpeller();
    private static final Translator translator = new Translator();

    @Override
    public List<AbstractResult> run(Module module, String input) {
        List<AbstractResult> res = new ArrayList<>();

        List<String> tokens = translator.TranslateToFiles(numberSpeller.decomposeNumber(new NumberNoun(Double.parseDouble(module.getParameterValue(0)))));

        for(String token: tokens)
        {
            res.add(new Sound(token));
        }

        return res;
    }
}