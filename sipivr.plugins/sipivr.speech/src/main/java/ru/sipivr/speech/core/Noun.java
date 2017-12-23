package ru.sipivr.speech.core;

import org.apache.commons.lang.NotImplementedException;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Karpukhin on 14.01.2016.
 */
public class Noun extends LexicalUnit {
    private String value;
    private String tag;

    /// <summary>
/// whether translator will look at the categories when calculating file name
/// </summary>
    private boolean applyCategories;


    public Noun() {
        this(null);
    }

    public Noun(String value)
    {
        this(null, null);
    }

    public Noun(String tag, String value)
    {
        this(tag, value, true);
    }

    public Noun(String tag, String value, boolean applyCategories) {
        this.value = value;
        this.tag = tag;
        this.applyCategories = applyCategories;
    }

    public String getTag() {
        return tag;
    }

    public String getValue() {
        return value;
    }

    public boolean isApplyCategories() {
        return applyCategories;
    }

    @Override
    public LexicalUnit clone() {
        Noun res = new Noun();
        res.cloneFields(this);
        return res;
    }

    @Override
    protected void cloneFields(LexicalUnit src) {
        Noun n = (Noun) src;
        this.tag = n.tag;
        this.value = n.value;
        this.applyCategories = n.applyCategories;
        super.cloneFields(src);
    }

    @Override
    public List<LexicalUnit> getChildren() {
        throw new NotImplementedException();
    }

    @Override
    public List<LexicalUnit> spell() {
        List<LexicalUnit> res = new ArrayList<>();
        res.add(this);
        return res;
    }
}