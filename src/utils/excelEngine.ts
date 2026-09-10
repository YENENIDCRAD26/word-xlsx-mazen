import * as XLSX from 'xlsx';
import { SheetData, CellData, WorkbookState } from '../types';

/**
 * Converts column letter(s) to 0-based column index (e.g. 'A' -> 0, 'Z' -> 25, 'AA' -> 26)
 */
export function colLetterToIndex(col: string): number {
  let index = 0;
  for (let i = 0; i < col.length; i++) {
    index = index * 26 + (col.charCodeAt(i) - 'A'.charCodeAt(0) + 1);
  }
  return index - 1;
}

/**
 * Converts 0-based column index to column letter(s) (e.g. 0 -> 'A', 25 -> 'Z', 26 -> 'AA')
 */
export function indexToColLetter(index: number): string {
  let temp = index + 1;
  let letter = '';
  while (temp > 0) {
    const mod = (temp - 1) % 26;
    letter = String.fromCharCode(65 + mod) + letter;
    temp = Math.floor((temp - mod) / 26);
  }
  return letter;
}

/**
 * Parses a coordinate like "B12" into { col: 'B', row: 12 }
 */
export function parseCellId(cellId: string): { col: string; row: number } | null {
  const match = cellId.toUpperCase().match(/^([A-Z]+)(\d+)$/);
  if (!match) return null;
  return { col: match[1], row: parseInt(match[2], 10) };
}

/**
 * Expands range string like "A1:B3" into an array of cell coordinates ['A1', 'A2', 'A3', 'B1', 'B2', 'B3']
 */
export function expandRange(rangeStr: string): string[] {
  const parts = rangeStr.split(':');
  if (parts.length === 1) return [parts[0].toUpperCase()];
  if (parts.length !== 2) return [];

  const start = parseCellId(parts[0]);
  const end = parseCellId(parts[1]);
  if (!start || !end) return [];

  const startColIdx = colLetterToIndex(start.col);
  const endColIdx = colLetterToIndex(end.col);
  const minCol = Math.min(startColIdx, endColIdx);
  const maxCol = Math.max(startColIdx, endColIdx);

  const minRow = Math.min(start.row, end.row);
  const maxRow = Math.max(start.row, end.row);

  const cells: string[] = [];
  for (let c = minCol; c <= maxCol; c++) {
    const colLetter = indexToColLetter(c);
    for (let r = minRow; r <= maxRow; r++) {
      cells.push(`${colLetter}${r}`);
    }
  }
  return cells;
}

/**
 * Evaluates formula or raw string in the context of sheet cells
 */
export function evaluateFormula(formula: string, cells: Record<string, CellData>, visited: Set<string> = new Set()): string {
  if (!formula.startsWith('=')) {
    return formula;
  }

  const rawExpr = formula.substring(1).trim();

  // Helper to get numeric value of a cell
  function getCellValue(cellId: string): number {
    const cleanId = cellId.toUpperCase().trim();
    if (visited.has(cleanId)) return 0; // Circular dependency prevention
    const cell = cells[cleanId];
    if (!cell || !cell.value) return 0;

    let val = cell.value;
    if (val.startsWith('=')) {
      const nextVisited = new Set(visited);
      nextVisited.add(cleanId);
      val = evaluateFormula(val, cells, nextVisited);
    }
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
  }

  // Helper to get raw/string value of a cell
  function getCellRawValue(cellId: string): string {
    const cleanId = cellId.toUpperCase().trim();
    const cell = cells[cleanId];
    if (!cell || !cell.value) return '';
    if (cell.value.startsWith('=')) {
      const nextVisited = new Set(visited);
      nextVisited.add(cleanId);
      return evaluateFormula(cell.value, cells, nextVisited);
    }
    return cell.value;
  }

  try {
    // 1. Function pattern: e.g. SUM(A1:A5) or SUM(A1, B2, 10)
    const fnMatch = rawExpr.match(/^([A-Z_]+)\((.*)\)$/i);
    if (fnMatch) {
      const fnName = fnMatch[1].toUpperCase();
      const argsStr = fnMatch[2].trim();

      // IF statement: IF(condition, trueVal, falseVal)
      if (fnName === 'IF') {
        const parts = argsStr.split(',').map(p => p.trim());
        if (parts.length >= 2) {
          const conditionStr = parts[0];
          const trueVal = parts[1].replace(/^["']|["']$/g, '');
          const falseVal = (parts[2] || '').replace(/^["']|["']$/g, '');

          // Replace cell references in condition
          const resolvedCondition = conditionStr.replace(/[A-Z]+\d+/gi, (match) => {
            const v = getCellValue(match);
            return String(v);
          });

          // Safe condition evaluation (only numbers and comparison operators)
          if (/^[\d.\s<>=!&|()+\-*/]+$/.test(resolvedCondition)) {
            // eslint-disable-next-line no-new-func
            const isTrue = new Function(`return !!(${resolvedCondition})`)();
            return isTrue ? trueVal : falseVal;
          }
        }
      }

      // Collect numeric values from arguments (supporting ranges like A1:B3 or single cells/numbers)
      const values: number[] = [];
      const argTokens = argsStr.split(',').map(s => s.trim());

      for (const token of argTokens) {
        if (token.includes(':')) {
          const rangeCells = expandRange(token);
          for (const c of rangeCells) {
            values.push(getCellValue(c));
          }
        } else if (/^[A-Z]+\d+$/i.test(token)) {
          values.push(getCellValue(token));
        } else {
          const num = parseFloat(token);
          if (!isNaN(num)) values.push(num);
        }
      }

      switch (fnName) {
        case 'SUM':
          return String(values.reduce((acc, curr) => acc + curr, 0));
        case 'AVERAGE':
        case 'AVG':
          return values.length ? String(Math.round((values.reduce((acc, curr) => acc + curr, 0) / values.length) * 100) / 100) : '0';
        case 'COUNT':
          return String(values.length);
        case 'MAX':
          return String(values.length ? Math.max(...values) : 0);
        case 'MIN':
          return String(values.length ? Math.min(...values) : 0);
        case 'PRODUCT':
          return String(values.reduce((acc, curr) => acc * curr, 1));
        case 'CONCAT': {
          const stringTokens = argsStr.split(',').map(s => s.trim());
          let res = '';
          for (const st of stringTokens) {
            if (/^[A-Z]+\d+$/i.test(st)) {
              res += getCellRawValue(st);
            } else {
              res += st.replace(/^["']|["']$/g, '');
            }
          }
          return res;
        }
        default:
          break;
      }
    }

    // 2. Arithmetic expression with cell references: e.g. A1 + B1 * 2
    const replacedExpr = rawExpr.replace(/[A-Z]+\d+/gi, (match) => {
      const val = getCellValue(match);
      return String(val);
    });

    // Validate safe math expression (digits, operators, dots, parentheses, whitespace)
    if (/^[\d.\s()+\-*/%]+$/.test(replacedExpr)) {
      // eslint-disable-next-line no-new-func
      const result = new Function(`return (${replacedExpr})`)();
      if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
        return String(Math.round(result * 1000) / 1000);
      }
    }
  } catch (err) {
    console.warn('Formula eval error:', err);
    return '#ERROR!';
  }

  return formula;
}

/**
 * Formats a display value based on CellStyle format
 */
export function formatDisplayValue(value: string, format?: string): string {
  if (!value) return '';
  const num = parseFloat(value);
  if (isNaN(num)) return value;

  switch (format) {
    case 'currency':
      return `${num.toLocaleString('ar-SA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ر.س`;
    case 'currency-usd':
      return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    case 'currency-eur':
      return `€${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    case 'percentage':
      return `${(num * 100).toFixed(1)}%`;
    case 'number':
      return num.toLocaleString('ar-SA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    case 'integer':
      return Math.round(num).toLocaleString('ar-SA');
    case 'date': {
      try {
        const d = new Date(value);
        return isNaN(d.getTime()) ? value : d.toISOString().split('T')[0];
      } catch {
        return value;
      }
    }
    default:
      return value;
  }
}

/**
 * Exports Workbook to real Excel .xlsx file using SheetJS
 */
export function exportWorkbookToXlsx(workbook: WorkbookState) {
  const wb = XLSX.utils.book_new();

  for (const sheet of workbook.sheets) {
    // Determine max row and max col
    let maxRow = 10;
    let maxColIdx = 5;

    for (const cellId of Object.keys(sheet.cells)) {
      const parsed = parseCellId(cellId);
      if (parsed) {
        if (parsed.row > maxRow) maxRow = parsed.row;
        const colIdx = colLetterToIndex(parsed.col);
        if (colIdx > maxColIdx) maxColIdx = colIdx;
      }
    }

    // Build 2D array
    const data: any[][] = [];
    for (let r = 1; r <= maxRow; r++) {
      const rowData: any[] = [];
      for (let c = 0; c <= maxColIdx; c++) {
        const colLetter = indexToColLetter(c);
        const cellId = `${colLetter}${r}`;
        const cell = sheet.cells[cellId];
        if (!cell || !cell.value) {
          rowData.push('');
        } else if (cell.value.startsWith('=')) {
          // Can write evaluated value or formula
          const computed = evaluateFormula(cell.value, sheet.cells);
          const num = parseFloat(computed);
          rowData.push(isNaN(num) ? computed : num);
        } else {
          const num = parseFloat(cell.value);
          rowData.push(isNaN(num) ? cell.value : num);
        }
      }
      data.push(rowData);
    }

    const ws = XLSX.utils.aoa_to_sheet(data);

    // Set right-to-left flag for Arabic spreadsheet support
    if (!ws['!views']) ws['!views'] = [];
    ws['!views'].push({ rightToLeft: true });

    XLSX.utils.book_append_sheet(wb, ws, sheet.name || 'ورقة 1');
  }

  XLSX.writeFile(wb, `${workbook.title.trim() || 'مصنف_اكسيل'}.xlsx`);
}

/**
 * Imports an Excel .xlsx or .csv file and creates a WorkbookState
 */
export async function importXlsxFile(file: File): Promise<WorkbookState> {
  const data = await file.arrayBuffer();
  const wb = XLSX.read(data, { type: 'array' });

  const sheets: SheetData[] = [];

  for (const sheetName of wb.SheetNames) {
    const ws = wb.Sheets[sheetName];
    const cells: Record<string, CellData> = {};

    // Read cells from worksheet
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:J20');

    for (let R = range.s.r; R <= range.e.r; R++) {
      for (let C = range.s.c; C <= range.e.c; C++) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = ws[cellAddress];
        if (cell && cell.v !== undefined) {
          const cellId = `${indexToColLetter(C)}${R + 1}`;
          let val = String(cell.v);
          if (cell.f) {
            val = `=${cell.f}`;
          }
          cells[cellId] = {
            value: val,
            displayValue: String(cell.w || cell.v),
            style: {
              bold: cell.s?.font?.bold || false,
              align: 'right',
            },
          };
        }
      }
    }

    sheets.push({
      id: 'sheet_' + Math.random().toString(36).substring(2, 9),
      name: sheetName,
      cells,
      colWidths: {},
      rowHeights: {},
      selectedCell: 'A1',
      selectedRange: null,
    });
  }

  if (sheets.length === 0) {
    sheets.push(createEmptySheet('ورقة 1'));
  }

  return {
    id: 'wb_' + Date.now(),
    title: file.name.replace(/\.[^/.]+$/, ''),
    activeSheetId: sheets[0].id,
    sheets,
    lastModified: Date.now(),
  };
}

/**
 * Helper to create an empty default sheet
 */
export function createEmptySheet(name: string = 'ورقة 1'): SheetData {
  return {
    id: 'sheet_' + Math.random().toString(36).substring(2, 9),
    name,
    cells: {},
    colWidths: {},
    rowHeights: {},
    selectedCell: 'A1',
    selectedRange: null,
  };
}
