package ru.sipivr.cbr.plugin;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.sipivr.core.model.Module;
import ru.sipivr.core.plugin.ResultPlugin;
import ru.sipivr.core.result.AbstractResult;
import ru.sipivr.core.result.Sleep;
import ru.sipivr.core.result.Sound;
import ru.sipivr.cbr.core.ValCurs;
import ru.sipivr.cbr.core.Valute;
import ru.sipivr.speech.core.CurrencySpeller;
import ru.sipivr.speech.core.DateSpeller;
import ru.sipivr.speech.core.NumberSpeller;
import ru.sipivr.speech.core.Translator;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.Unmarshaller;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * Created by Admin on 27.04.2016.
 */
@Service
public class RubTo extends ResultPlugin {
    private static Logger logger = LoggerFactory.getLogger(RubTo.class);

    private static NumberSpeller numberSpeller = new NumberSpeller();
    private static CurrencySpeller currencySpeller = new CurrencySpeller(numberSpeller);
    private static DateSpeller dateSpeller = new DateSpeller(numberSpeller);

    @Override
    public List<AbstractResult> run(Module module, String input) {
        List<AbstractResult> res = new ArrayList<>();

        res.add(new Sound("sipivr.cbr/state.wav"));

        try {
            JAXBContext context = JAXBContext.newInstance(ValCurs.class);
            Unmarshaller un = context.createUnmarshaller();
            ValCurs valCurs = (ValCurs) un.unmarshal(new URL("http://cbr.ru/scripts/XML_daily.asp"));


            for(String token: new Translator().TranslateToFiles(dateSpeller.spell(valCurs.getDate())))
            {
                res.add(new Sound(token));
            }
            res.add(new Sound("sipivr.cbr/cbr_is.wav"));

            HashMap<String, Valute> valuteHashMap = new HashMap<>();
            for(Valute v: valCurs.getValutes()){
                valuteHashMap.put(v.getCharCode().toLowerCase(), v);
            }

            for(ru.sipivr.speech.enums.Currency c: ru.sipivr.speech.enums.Currency.values()){
                String key = c.toString().toLowerCase();
                Valute v = valuteHashMap.get(key);
                if(module.getParameterValue(0).toLowerCase().contains(key) && v != null){
                    res.add(new Sound("sipivr.cbr/rub_to_" + (v.getNominal() != 1 ? v.getNominal() + "_" : "") + key +  ".wav"));
                    res.add(new Sleep(500));
                    for(String token: new Translator().TranslateToFiles(currencySpeller.spell(v.getValue(), c)))
                    {
                        res.add(new Sound(token));
                    }
                }
            }
        } catch (Exception e) {
            logger.error("", e);
            return null;
        }

        return res;
    }
}
