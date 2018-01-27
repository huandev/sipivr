package ru.sipivr.currency.plugin;

import org.springframework.stereotype.Service;
import ru.sipivr.core.model.Module;
import ru.sipivr.core.plugin.ResultPlugin;
import ru.sipivr.core.result.AbstractResult;
import ru.sipivr.core.result.Sound;
import ru.sipivr.currency.core.CurrencySpeller;
import ru.sipivr.number.core.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Karpukhin on 13.01.2016.
 */
@Service
public class Currency extends ResultPlugin {
    private static NumberSpeller numberSpeller = new NumberSpeller();
    private static CurrencySpeller currencySpeller = new CurrencySpeller(numberSpeller);

    @Override
    public List<AbstractResult> run(Module module, String input) {
        List<AbstractResult> res = new ArrayList<>();

        double value = Double.parseDouble(module.getParameterValue(0));
        ru.sipivr.currency.enums.Currency currency = ru.sipivr.currency.enums.Currency.valueOf(module.getParameterValue(1));

        List<String> tokens = new Translator().TranslateToFiles(currencySpeller.spell(value, currency));
        for(String token: tokens)
        {
            res.add(new Sound(token));
        }

        return res;
    }
}
