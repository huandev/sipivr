package ru.sipivr.report.excel;

import org.apache.poi.ss.usermodel.*;

/**
 * Created by Karpukhin on 02.01.2016.
 */
public class ExcelCellStyle {
    private CellStyle cellStyle;
    private Font font;

    public ExcelCellStyle(Workbook workbook) {
        cellStyle = workbook.createCellStyle();
        font = workbook.createFont();
        cellStyle.setFont(font);
    }

    public CellStyle getCellStyle() {
        return cellStyle;
    }

    public void setBackground(IndexedColors color) {
        cellStyle.setFillForegroundColor(color.index);
        cellStyle.setFillPattern(PatternFormatting.SOLID_FOREGROUND);
    }

    public void setBackground(IndexedColors color, short pattern) {
        cellStyle.setFillForegroundColor(color.index);
        cellStyle.setFillPattern(pattern);
    }

    public void setFontBold() {
        font.setBold(true);
    }

    public void setFontItalic() {
        font.setItalic(true);
    }

    public void setFontUnderline() {
        font.setUnderline(Font.U_SINGLE);
    }

    public void setFontColor(IndexedColors color) {
        font.setColor(color.index);
    }

    public void setFontName(String name){
        font.setFontName(name);
    }

    public void setFontSize(int size) {
        font.setFontHeightInPoints((short)size);
    }

    public void setBorder(short style, IndexedColors color) {
        cellStyle.setBorderTop(style);
        cellStyle.setBorderRight(style);
        cellStyle.setBorderBottom(style);
        cellStyle.setBorderLeft(style);

        cellStyle.setTopBorderColor(color.index);
        cellStyle.setRightBorderColor(color.index);
        cellStyle.setBottomBorderColor(color.index);
        cellStyle.setLeftBorderColor(color.index);
    }

    public void setWrapText(boolean wrap) {
        cellStyle.setWrapText(wrap);
    }

    public void setAlignment(short alignment) {
        cellStyle.setAlignment(alignment);
    }

    public void setVerticalAlignment(short valignment) {
        cellStyle.setVerticalAlignment(valignment);
    }
}
