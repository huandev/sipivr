package ru.sipivr.cbr.core;

import org.joda.time.LocalDate;
import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.DateTimeFormatterBuilder;

import javax.xml.bind.annotation.adapters.XmlAdapter;

/**
 * Created by Admin on 27.04.2016.
 */
public class VarCursDateAdapter  extends XmlAdapter<String, LocalDate> {
    private static final String pattern = "dd.MM.yyyy";
    private static final DateTimeFormatter parseFormat = new DateTimeFormatterBuilder().appendPattern(pattern).toFormatter();

    @Override
    public LocalDate unmarshal(String v) throws Exception {
        return parseFormat.parseLocalDate(v);
    }

    @Override
    public String marshal(LocalDate v) throws Exception {
        return v.toString(pattern);
    }
}