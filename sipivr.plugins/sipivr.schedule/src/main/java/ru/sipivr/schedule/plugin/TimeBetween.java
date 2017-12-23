package ru.sipivr.schedule.plugin;

import org.joda.time.LocalTime;
import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.DateTimeFormatterBuilder;
import org.springframework.stereotype.Service;
import ru.sipivr.core.model.Menu;
import ru.sipivr.core.model.Module;
import ru.sipivr.core.plugin.ResultPlugin;
import ru.sipivr.core.result.AbstractResult;
import ru.sipivr.core.result.Transition;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Admin on 18.01.2016.
 */
@Service
public class TimeBetween extends ResultPlugin {
    private static final DateTimeFormatter parseFormat = new DateTimeFormatterBuilder().appendPattern("HH:mm").toFormatter();

    @Override
    public List<AbstractResult> run(Module module, String input) {
        int nextMenu = module.getTransitionNextMenuId(0);
        if(nextMenu != 0) {
            LocalTime localTime1 = LocalTime.parse(module.getParameters().get(0).getValue(), parseFormat);
            LocalTime localTime2 = LocalTime.parse(module.getParameters().get(1).getValue(), parseFormat);

            if((LocalTime.now().isAfter(localTime1) || LocalTime.now().isEqual(localTime1)) && LocalTime.now().isBefore(localTime2)){
                List<AbstractResult> res = new ArrayList<>();
                res.add(new Transition(nextMenu));
                return res;
            }
        }
        return null;
    }
}
