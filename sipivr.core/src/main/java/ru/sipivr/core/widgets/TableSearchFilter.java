package ru.sipivr.core.widgets;

/**
 * Created by Admin on 02.03.2016.
 */
public class TableSearchFilter<T> {
    public enum SortType{
        Asc,
        Desc
    }

    private T model;
    private int pageNumber;
    private int pageSize;
    private String sortField;
    private SortType sortType;

    public T getModel() {
        return model;
    }

    public void setModel(T model) {
        this.model = model;
    }

    public int getPageNumber() {
        return pageNumber;
    }

    public void setPageNumber(int pageNumber) {
        this.pageNumber = pageNumber;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public String getSortField() {
        return sortField;
    }

    public void setSortField(String sortField) {
        this.sortField = sortField;
    }

    public SortType getSortType() {
        return sortType;
    }

    public void setSortType(SortType sortType) {
        this.sortType = sortType;
    }
}
