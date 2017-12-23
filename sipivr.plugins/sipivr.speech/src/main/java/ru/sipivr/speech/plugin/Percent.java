package ru.sipivr.speech.plugin;

import org.springframework.stereotype.Service;
import ru.sipivr.core.model.Module;
import ru.sipivr.core.plugin.ResultPlugin;
import ru.sipivr.core.result.AbstractResult;
import ru.sipivr.core.result.Sound;
import ru.sipivr.speech.core.NumberSpeller;
import ru.sipivr.speech.core.PercentSpeller;
import ru.sipivr.speech.core.Translator;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Karpukhin on 13.01.2016.
 */
@Service
public class Percent extends ResultPlugin {
    private static NumberSpeller numberSpeller = new NumberSpeller();
    private static PercentSpeller percentSpeller = new PercentSpeller(numberSpeller);

    @Override
    public List<AbstractResult> run(Module module, String input) {
        List<AbstractResult> res = new ArrayList<>();

        double value = Double.parseDouble(module.getParameterValue(0));

        List<String> tokens = new Translator().TranslateToFiles(percentSpeller.spell(value));
        for(String token: tokens)
        {
            res.add(new Sound(token));
        }

        return res;
    }
}
