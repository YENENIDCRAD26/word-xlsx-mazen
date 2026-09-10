export type OfficeMode = 'word' | 'excel';

export interface DocumentState {
  id: string;
  title: string;
  contentHtml: string;
  fontFamily: string;
  fontSize: string;
  paperSize: 'A4' | 'Letter';
  orientation: 'portrait' | 'landscape';
  margins: 'normal' | 'narrow' | 'wide';
  zoom: number; // percentage, e.g. 100
  lastModified: number;
}

export interface CellStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  align?: 'right' | 'center' | 'left';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  color?: string;
  backgroundColor?: string;
  fontSize?: number;
  fontFamily?: string;
  border?: 'all' | 'bottom' | 'double-bottom' | 'outer' | 'thick-outer' | 'top-bottom' | 'none';
  format?: 'general' | 'currency' | 'currency-usd' | 'currency-eur' | 'percentage' | 'number' | 'integer' | 'date';
  wrapText?: boolean;
}

export interface CellData {
  value: string; // raw input or formula like =SUM(A1:A5)
  displayValue?: string; // computed value
  style?: CellStyle;
}

export interface SheetData {
  id: string;
  name: string;
  cells: Record<string, CellData>; // key like "A1", "B4"
  colWidths: Record<string, number>; // col key "A", "B", ...
  rowHeights: Record<number, number>; // row index 1, 2, ...
  selectedCell: string; // e.g. "A1"
  selectedRange?: { start: string; end: string } | null;
}

export interface WorkbookState {
  id: string;
  title: string;
  activeSheetId: string;
  sheets: SheetData[];
  lastModified: number;
}

export interface TemplateItem {
  id: string;
  title: string;
  description: string;
  category: 'legal' | 'business' | 'official' | 'finance' | 'personal';
  type: 'word' | 'excel';
  thumbnailText: string;
  data: any;
}
