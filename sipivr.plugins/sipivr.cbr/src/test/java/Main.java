import ru.sipivr.core.model.Module;
import ru.sipivr.core.model.ModuleParameter;
import ru.sipivr.cbr.plugin.RubTo;

import java.util.ArrayList;

/**
 * Created by Admin on 27.04.2016.
 */
public class Main {
    public static void main(String[] params){
        RubTo rubTo = new RubTo();

        Module module = new Module();
        module.setParameters(new ArrayList<>());

        ModuleParameter p = new ModuleParameter();
        p.setValue("USD,EUR,GBP,CHF,JPY");
        module.getParameters().add(p);

        rubTo.run(module, "");
    }
}
