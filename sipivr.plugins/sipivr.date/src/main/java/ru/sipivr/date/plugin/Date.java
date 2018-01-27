package ru.sipivr.date.plugin;

import org.joda.time.LocalDate;
import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.DateTimeFormatterBuilder;
import org.springframework.stereotype.Service;
import ru.sipivr.core.model.Module;
import ru.sipivr.core.plugin.ResultPlugin;
import ru.sipivr.core.result.AbstractResult;
import ru.sipivr.core.result.Sound;
import ru.sipivr.date.core.DateSpeller;
import ru.sipivr.number.core.NumberSpeller;
import ru.sipivr.number.core.Translator;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Karpukhin on 13.01.2016.
 */
@Service
public class Date extends ResultPlugin {
    private static final DateTimeFormatter parseFormat = new DateTimeFormatterBuilder().appendPattern("yyyy-MM-dd").toFormatter();

    private static NumberSpeller numberSpeller = new NumberSpeller();
    private static DateSpeller dateSpeller = new DateSpeller(numberSpeller);

    @Override
    public List<AbstractResult> run(Module module, String input) {
        List<AbstractResult> res = new ArrayList<>();

        LocalDate value = LocalDate.parse(module.getParameters().get(0).getValue(), parseFormat);

        List<String> tokens = new Translator().TranslateToFiles(dateSpeller.spell(value));
        for(String token: tokens)
        {
            res.add(new Sound(token));
        }

        return res;
    }
}
