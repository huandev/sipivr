package ru.sipivr.report.excel;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.Closeable;
import java.io.IOException;
import java.io.OutputStream;

/**
 * Created by Karpukhin on 02.01.2016.
 */
public class Report  implements Closeable {
    private OutputStream outputStream;
    private Workbook workbook;
    private ExcelCellStyle bodyStyle;
    private ExcelCellStyle headStyle;

    public Report(OutputStream outputStream) throws Exception {
        this.outputStream = outputStream;
        workbook = new XSSFWorkbook();
    }

    @Override
    public void close() throws IOException {
        workbook.write(outputStream);
        workbook.close();
    }

    public Sheet createSheet(String name, int... widths) {
        Sheet sheet = workbook.createSheet(name);
        for (int i = 0; i < widths.length; i++) {
            sheet.setColumnWidth(i, widths[i] * 256);
        }
        return sheet;
    }

    public void addRow(Sheet sheet, ExcelCellStyle style, Object... cells) {
        Row row = sheet.createRow(sheet.getPhysicalNumberOfRows());

        for (int i = 0; i < cells.length; i++) {
            Cell cell = row.createCell(i);
            cell.setCellStyle(style.getCellStyle());
            if(cells[i] != null) {
                cell.setCellValue(cells[i].toString());
            }
        }
    }

    public ExcelCellStyle getHeadStyle() {
        if(headStyle == null) {
            headStyle = new ExcelCellStyle(workbook);
            headStyle.setBackground(IndexedColors.SKY_BLUE);
            headStyle.setFontBold();
            headStyle.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
            headStyle.setAlignment(CellStyle.ALIGN_CENTER);
            headStyle.setBorder(CellStyle.BORDER_THIN, IndexedColors.BLACK);
            headStyle.setFontName("Arial");
            headStyle.setFontSize(10);
        }
        return headStyle;
    }

    public ExcelCellStyle getBodyStyle() {
        if(bodyStyle == null) {
            bodyStyle = new ExcelCellStyle(workbook);
            bodyStyle.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
            bodyStyle.setBorder(CellStyle.BORDER_THIN, IndexedColors.BLACK);
            bodyStyle.setFontName("Arial");
            bodyStyle.setFontSize(9);
        }
        return bodyStyle;
    }
}
