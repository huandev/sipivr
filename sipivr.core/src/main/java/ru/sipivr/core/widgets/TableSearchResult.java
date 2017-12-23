package ru.sipivr.core.widgets;

import java.util.List;

/**
 * Created by Admin on 02.03.2016.
 */
public class TableSearchResult<T> {
    private List<T> items;
    private long count;

    public List<T> getItems() {
        return items;
    }

    public void setItems(List<T> items) {
        this.items = items;
    }

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }
}
