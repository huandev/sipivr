package ru.sipivr.schedule.plugin;

import org.joda.time.DateTime;
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
public class DayOfWeek extends ResultPlugin {
    @Override
    public List<AbstractResult> run(Module module, String input) {
        String value = module.getParameters().get(0).getValue();
        int nextMenu = module.getTransitionNextMenuId(0);
        if (value != null && nextMenu != 0) {
            DateTime now = DateTime.now();

            if (value.contains(Integer.toString(now.getDayOfWeek()))) {
                List<AbstractResult> res = new ArrayList<>();
                res.add(new Transition(nextMenu));
                return res;
            }
        }

        return null;
    }
}