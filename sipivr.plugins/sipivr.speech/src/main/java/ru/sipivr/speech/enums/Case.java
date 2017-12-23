package ru.sipivr.speech.enums;

/**
 * Created by Karpukhin on 14.01.2016.
 */
public enum Case
{
    Nominative("nom"),		//именительный
    Genitive("gen"),		//родительный
    Dative("dat"),			//дательный
    Accusative("acc"),		//винительный
    Instrumental("ins"),	//творительный
    Prepositional("pre");	//предложный

    private final String value;

    Case(String value){
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
