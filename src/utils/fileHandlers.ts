import * as XLSX from 'xlsx';
import { ExcelSheet, WordDocumentState } from '../types';
import { colIndexToLetter, evaluateFormula, parseCellAddress } from './excelCalculations';

export function exportWordAsDoc(doc: WordDocumentState) {
  const content = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40' dir='rtl'>
<head>
<meta charset='utf-8'>
<title>${doc.title}</title>
<style>
  @page {
    size: 21cm 29.7cm;
    margin: 2.5cm 2.5cm 2.5cm 2.5cm;
    mso-page-orientation: ${doc.orientation};
  }
  body {
    font-family: 'Amiri', 'Traditional Arabic', 'Arial', sans-serif;
    font-size: ${doc.fontSize}pt;
    line-height: ${doc.lineSpacing};
    direction: rtl;
    text-align: ${doc.textAlign};
    color: ${doc.textColor};
  }
  h2, h3 { text-align: center; }
  table { border-collapse: collapse; width: 100%; }
  td, th { border: 1px solid #999; padding: 6px 10px; }
</style>
</head>
<body>
  <div style="font-size: 11pt; color: #666; border-bottom: 1px solid #ccc; margin-bottom: 20px; padding-bottom: 5px;">
    ${doc.headerText}
  </div>
  ${doc.contentHtml}
  <div style="margin-top: 30px; font-size: 10pt; color: #888; border-top: 1px solid #ccc; padding-top: 8px;">
    ${doc.footerText}
  </div>
</body>
</html>`;

  const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
  const filename = doc.title.endsWith('.doc') || doc.title.endsWith('.docx') 
    ? doc.title 
    : `${doc.title}.doc`;

  downloadBlob(blob, filename);
}

export function exportWordAsTxt(doc: WordDocumentState) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = doc.contentHtml;
  const text = tempDiv.textContent || tempDiv.innerText || '';
  const blob = new Blob(['\ufeff', text], { type: 'text/plain;charset=utf-8' });
  downloadBlob(blob, `${doc.title.replace(/\.[^/.]+$/, '')}.txt`);
}

export function exportWordAsHtml(doc: WordDocumentState) {
  const blob = new Blob(['\ufeff', doc.contentHtml], { type: 'text/html;charset=utf-8' });
  downloadBlob(blob, `${doc.title.replace(/\.[^/.]+$/, '')}.html`);
}

export function printDocument() {
  window.print();
}

export function exportExcelAsXlsx(title: string, sheets: ExcelSheet[]) {
  const wb = XLSX.utils.book_new();

  sheets.forEach((sheet) => {
    const sheetData: (string | number)[][] = [];
    
    // Find max row and col in sheet data
    let maxRow = Math.max(sheet.rowCount, 10);
    let maxCol = Math.max(sheet.colCount, 8);

    Object.keys(sheet.data).forEach((cellKey) => {
      const parsed = parseCellAddress(cellKey);
      if (parsed) {
        if (parsed.row > maxRow) maxRow = parsed.row;
        if (parsed.colIndex + 1 > maxCol) maxCol = parsed.colIndex + 1;
      }
    });

    for (let r = 1; r <= maxRow; r++) {
      const rowArr: (string | number)[] = [];
      for (let c = 0; c < maxCol; c++) {
        const addr = `${colIndexToLetter(c)}${r}`;
        const cell = sheet.data[addr];
        if (!cell) {
          rowArr.push('');
        } else if (cell.formula && cell.formula.startsWith('=')) {
          const evalVal = evaluateFormula(cell.formula, sheet.data);
          const num = parseFloat(evalVal);
          rowArr.push(isNaN(num) ? evalVal : num);
        } else {
          const num = parseFloat(cell.value);
          rowArr.push(!isNaN(num) && cell.value.trim() !== '' && !cell.value.startsWith('0') ? num : (cell.value || ''));
        }
      }
      sheetData.push(rowArr);
    }

    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    // Enable RTL flag for Arabic sheets in Excel
    ws['!views'] = [{ rightToLeft: true }];
    XLSX.utils.book_append_sheet(wb, ws, sheet.name.substring(0, 31));
  });

  const filename = title.endsWith('.xlsx') ? title : `${title}.xlsx`;
  XLSX.writeFile(wb, filename);
}

export function exportExcelAsCsv(sheet: ExcelSheet, title: string) {
  let csvContent = '\ufeff'; // UTF-8 BOM
  let maxRow = 1;
  let maxCol = 1;

  Object.keys(sheet.data).forEach((addr) => {
    const p = parseCellAddress(addr);
    if (p) {
      if (p.row > maxRow) maxRow = p.row;
      if (p.colIndex + 1 > maxCol) maxCol = p.colIndex + 1;
    }
  });

  for (let r = 1; r <= maxRow; r++) {
    const rowValues: string[] = [];
    for (let c = 0; c < maxCol; c++) {
      const addr = `${colIndexToLetter(c)}${r}`;
      const cell = sheet.data[addr];
      let val = '';
      if (cell) {
        if (cell.formula && cell.formula.startsWith('=')) {
          val = evaluateFormula(cell.formula, sheet.data);
        } else {
          val = cell.value || '';
        }
      }
      // Escape commas and quotes
      const escaped = `"${val.replace(/"/g, '""')}"`;
      rowValues.push(escaped);
    }
    csvContent += rowValues.join(',') + '\r\n';
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `${title.replace(/\.[^/.]+$/, '')}_${sheet.name}.csv`);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Aliases matching caller conventions
export const exportToWordDoc = exportWordAsDoc;
export const exportToHTML = exportWordAsHtml;
export const exportToText = exportWordAsTxt;
export const handlePrintDocument = printDocument;

export function exportToExcelXLSX(stateOrTitle: { title: string; sheets: ExcelSheet[] } | string, sheets?: ExcelSheet[]) {
  if (typeof stateOrTitle === 'string') {
    exportExcelAsXlsx(stateOrTitle, sheets || []);
  } else {
    exportExcelAsXlsx(stateOrTitle.title, stateOrTitle.sheets);
  }
}

export function exportToCSV(sheet: ExcelSheet, title: string = 'بيانات_الجدول') {
  exportExcelAsCsv(sheet, title);
}
