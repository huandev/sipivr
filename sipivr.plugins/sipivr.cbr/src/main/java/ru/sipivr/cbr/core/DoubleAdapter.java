package ru.sipivr.cbr.core;

import javax.xml.bind.annotation.adapters.XmlAdapter;
import java.text.NumberFormat;
import java.util.Locale;

/**
 * Created by Admin on 27.04.2016.
 */
public class DoubleAdapter extends XmlAdapter<String, Double> {
    private static final NumberFormat format = NumberFormat.getInstance(Locale.FRANCE);

    @Override
    public Double unmarshal(String v) throws Exception {
        return format.parse(v).doubleValue();
    }

    @Override
    public String marshal(Double v) throws Exception {
        return format.format(v);
    }
}