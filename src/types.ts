export type AppMode = 'word' | 'excel';

export type WordRibbonTab = 
  | 'file' 
  | 'home' 
  | 'insert' 
  | 'table' 
  | 'design' 
  | 'layout' 
  | 'references' 
  | 'mailings' 
  | 'review' 
  | 'view' 
  | 'help';

export type ExcelRibbonTab = 
  | 'file' 
  | 'home' 
  | 'insert' 
  | 'layout' 
  | 'formulas' 
  | 'data' 
  | 'review' 
  | 'view';

export interface WordDocumentState {
  title: string;
  fontFamily: string;
  fontSize: number;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrike: boolean;
  isSubscript: boolean;
  isSuperscript: boolean;
  textColor: string;
  highlightColor: string;
  textAlign: 'right' | 'center' | 'left' | 'justify';
  lineSpacing: number;
  direction: 'rtl' | 'ltr';
  margins: 'normal' | 'narrow' | 'wide' | 'custom';
  orientation: 'portrait' | 'landscape';
  paperSize: 'A4' | 'Letter' | 'Legal';
  columns: 1 | 2 | 3;
  zoom: number;
  showRuler: boolean;
  showBorders: boolean;
  borderStyle?: 'none' | 'single' | 'double' | 'classic' | 'gold' | 'islamic';
  borderColor?: string;
  borderWidth?: number;
  pageBgColor?: string;
  watermarkText?: string;
  isReadingMode: boolean;
  headerText: string;
  footerText: string;
  contentHtml: string;
}

export interface CellData {
  value?: string;
  formula?: string;
  formattedValue?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: string;
  bg?: string;
  align?: 'right' | 'center' | 'left';
  valign?: 'top' | 'middle' | 'bottom';
  format?: 'general' | 'currency_sar' | 'currency_usd' | 'percent' | 'number' | 'date';
  border?: boolean;
  wrapText?: boolean;
}

export interface ExcelSheet {
  id: string;
  name: string;
  data: Record<string, CellData>;
  rowCount: number;
  colCount: number;
  freezeRow?: number;
  freezeCol?: number;
}

export interface ExcelState {
  title: string;
  sheets: ExcelSheet[];
  activeSheetId: string;
  selectedCell?: string; // e.g. "A1"
  selectedRange?: { start: string; end: string };
  isEditing?: boolean;
  formulaInput?: string;
  zoom?: number;
}

export interface VirtualKeyboardState {
  isOpen: boolean;
  isFloating: boolean;
  language: 'ar' | 'en';
  shiftActive: boolean;
  altActive: boolean;
  ctrlActive: boolean;
  capsActive: boolean;
  pinned: boolean;
  preferredInputMode?: 'virtual' | 'native';
  autoSwitch?: boolean;
}
