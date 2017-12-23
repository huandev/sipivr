package ru.sipivr.speech.core;

import ru.sipivr.speech.enums.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

/**
 * Created by Karpukhin on 14.01.2016.
 */
public class Translator {
    private static final String fileNameSeparator = "/";

    public List<String> TranslateToFiles(LexicalUnit l) {
        List<String> res = new ArrayList<>();
        for (LexicalUnit lexicalUnit : l.spell()) {
            res.add(getFileName((Noun) lexicalUnit).toLowerCase() + ".wav");
        }
        return res;
    }

    private String getFileName(Noun n) {
        if (n.getClass() == NumberNoun.class) {
            NumberNoun num = (NumberNoun) n;
            return String.join(fileNameSeparator, new String[]{
                    "sipivr.speech.number",
                    num.getNumberType().toString(),
                    num.getCaseType().getValue(),
                    num.getGrNumber().getValue(),
                    num.getGender().getValue(),
                    String.valueOf((int) num.getNumValue())
            });
        } else //is Noun
        {
            switch (n.getTag()) {
                case "Separator": //слово "целых"
                    return String.format("sipivr.speech.number/int_%s_%s", n.getCaseType().getValue(), n.getGrNumber().getValue());
                case "Minus":
                    return "sipivr.speech.number/minus";
                case "Point":
                    return "sipivr.speech.number/point";
                default:
                    return TranslateNoun(n);
            }
        }
    }

    private String TranslateNoun(Noun n) {
        String fileName = n.getTag() != null ? n.getTag() + "/" + n.getValue() : n.getValue();
        return n.isApplyCategories() ? applyGrammarCategories(fileName, n.getCaseType(), n.getGrNumber()) : fileName;
    }

    /// <summary>
    /// Currency/RUB -> Currency/Nom/Sing/RUB
    /// </summary>
    /// <param name="fileName"></param>
    /// <returns></returns>
    private String applyGrammarCategories(String fileName, Case c, GrammaticalNumber n) {
        List<String> parts = new ArrayList<String>();
        Collections.addAll(parts, fileName.split(fileNameSeparator));

        parts.add(parts.size() - 1, c.getValue());
        parts.add(parts.size() - 1, n.getValue());
        return String.join(fileNameSeparator, parts);
    }
}