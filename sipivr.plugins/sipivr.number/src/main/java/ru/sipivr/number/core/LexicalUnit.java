package ru.sipivr.number.core;

import org.apache.commons.lang.NotImplementedException;
import ru.sipivr.number.enums.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Karpukhin on 14.01.2016.
 */
public abstract class LexicalUnit {
    protected Gender gender;
    protected Case caseType;
    protected GrammaticalNumber grNumber;

    public LexicalUnit() {
        gender = Gender.Neuter;
        caseType = Case.Nominative;
        grNumber = GrammaticalNumber.Singular;
    }

    public Gender getGender() {
        return gender;
    }

    public LexicalUnit setGender(Gender gender) {
        this.gender = gender;
        return this;
    }

    public Case getCaseType() {
        return caseType;
    }

    public void setCaseType(Case caseType) {
        this.caseType = caseType;
    }

    public GrammaticalNumber getGrNumber() {
        return grNumber;
    }

    public void setGrNumber(GrammaticalNumber grNumber) {
        this.grNumber = grNumber;
    }

    public LexicalUnit clone(){
        throw new NotImplementedException();
    }

    protected void cloneFields(LexicalUnit src) {
        gender = src.getGender();
        caseType = src.getCaseType();
        grNumber = src.getGrNumber();
    }

    public abstract List<LexicalUnit> getChildren();

    /// <summary>
    /// transforms this Lexical unit into most basic Lexical units
    /// </summary>
    /// <returns></returns>
    public List<LexicalUnit> spell() {
        List<LexicalUnit> res = new ArrayList<>();
        for (LexicalUnit c : getChildren())
            res.addAll(c.spell());
        return res;
    }
}
