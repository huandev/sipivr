package ru.sipivr.speech.core;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by okarpukhin on 14.01.2016.
 */
public class CompositeLexicalUnit extends LexicalUnit {
    private List<LexicalUnit> children = new ArrayList<>();

    public CompositeLexicalUnit() {
        this(new ArrayList<>());
    }

    public CompositeLexicalUnit(List<LexicalUnit> children) {
        this.children = children;
    }

    @Override
    public List<LexicalUnit> getChildren() {
        return children;
    }
}