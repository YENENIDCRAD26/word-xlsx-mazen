import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignRight,
  AlignCenter,
  AlignLeft,
  WrapText,
  Plus,
  Minus,
  Trash2,
  BarChart2,
  Calculator,
  Sigma,
  SortAsc,
  SortDesc,
  ChevronDown,
  Percent,
  Coins,
  Hash,
  Palette,
  Check,
  Calendar,
  Grid,
  FileSpreadsheet,
  Lock,
  Unlock,
  Keyboard as KeyboardIcon,
  Sparkles,
  Printer,
  Table as TableIcon
} from 'lucide-react';
import { WorkbookState, SheetData, CellData, CellStyle } from '../../types';
import {
  evaluateFormula,
  formatDisplayValue,
  indexToColLetter,
  colLetterToIndex,
  parseCellId,
  createEmptySheet,
  exportWorkbookToXlsx
} from '../../utils/excelEngine';
import { ChartModal } from './ChartModal';

interface ExcelEditorProps {
  workbook: WorkbookState;
  onChange: (updated: WorkbookState) => void;
  onOpenTemplates: () => void;
  onToggleKeyboard?: () => void;
  isKeyboardOpen?: boolean;
}

const NUM_ROWS = 40;
const NUM_COLS = 16; // A to P

export const ExcelEditor: React.FC<ExcelEditorProps> = ({
  workbook,
  onChange,
  onOpenTemplates,
  onToggleKeyboard,
  isKeyboardOpen = false,
}) => {
  const [selectedCellId, setSelectedCellId] = useState<string>('A1');
  const [isEditingCell, setIsEditingCell] = useState<boolean>(false);
  const [formulaInputVal, setFormulaInputVal] = useState<string>('');

  // Dynamic Dropdown Menu State
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Freeze Panes state
  const [freezeTopRow, setFreezeTopRow] = useState<boolean>(true);
  const [freezeFirstCol, setFreezeFirstCol] = useState<boolean>(false);

  // Dropdown Pickers
  const [showFillColorPicker, setShowFillColorPicker] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showBorderPicker, setShowBorderPicker] = useState(false);
  const [showFormatPicker, setShowFormatPicker] = useState(false);
  const [showChartModal, setShowChartModal] = useState(false);

  // Active sheet
  const activeSheet = useMemo(() => {
    return workbook.sheets.find(s => s.id === workbook.activeSheetId) || workbook.sheets[0] || createEmptySheet('ورقة 1');
  }, [workbook]);

  // Selected cell data
  const selectedCell = activeSheet.cells[selectedCellId];

  // Sync formula input with selected cell
  useEffect(() => {
    const val = activeSheet.cells[selectedCellId]?.value || '';
    setFormulaInputVal(val);
    setIsEditingCell(false);
  }, [selectedCellId, activeSheet]);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.dynamic-excel-dropdown')) {
        setActiveDropdown(null);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update a single cell in the active sheet
  const updateCell = (cellId: string, updates: Partial<CellData>) => {
    const current = activeSheet.cells[cellId] || { value: '' };
    const updatedCell: CellData = {
      ...current,
      ...updates,
      style: {
        ...current.style,
        ...updates.style,
      },
    };

    const newCells = {
      ...activeSheet.cells,
      [cellId]: updatedCell,
    };

    const updatedSheet: SheetData = {
      ...activeSheet,
      cells: newCells,
    };

    const updatedSheets = workbook.sheets.map(s => s.id === activeSheet.id ? updatedSheet : s);

    onChange({
      ...workbook,
      sheets: updatedSheets,
      lastModified: Date.now(),
    });
  };

  // Update style of currently selected cell
  const updateSelectedCellStyle = (styleUpdate: Partial<CellStyle>) => {
    const current = activeSheet.cells[selectedCellId] || { value: '' };
    updateCell(selectedCellId, {
      style: {
        ...current.style,
        ...styleUpdate,
      },
    });
  };

  // Commit formula / value change
  const handleFormulaCommit = (newVal: string) => {
    updateCell(selectedCellId, { value: newVal });
    setIsEditingCell(false);
  };

  // Sheet Management
  const handleAddSheet = () => {
    const newName = `ورقة ${workbook.sheets.length + 1}`;
    const newSheet = createEmptySheet(newName);
    onChange({
      ...workbook,
      sheets: [...workbook.sheets, newSheet],
      activeSheetId: newSheet.id,
      lastModified: Date.now(),
    });
  };

  const handleSwitchSheet = (sheetId: string) => {
    onChange({
      ...workbook,
      activeSheetId: sheetId,
    });
  };

  const handleDeleteSheet = (sheetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (workbook.sheets.length <= 1) return;
    const remaining = workbook.sheets.filter(s => s.id !== sheetId);
    onChange({
      ...workbook,
      sheets: remaining,
      activeSheetId: remaining[0].id,
      lastModified: Date.now(),
    });
  };

  const handleRenameSheet = (sheetId: string) => {
    const sheet = workbook.sheets.find(s => s.id === sheetId);
    if (!sheet) return;
    const newName = prompt('أدخل الاسم الجديد للورقة:', sheet.name);
    if (newName && newName.trim()) {
      const updated = workbook.sheets.map(s => s.id === sheetId ? { ...s, name: newName.trim() } : s);
      onChange({ ...workbook, sheets: updated });
    }
  };

  // Keyboard navigation on grid
  const handleKeyDown = (e: React.KeyboardEvent, colIdx: number, rowIdx: number) => {
    if (isEditingCell) {
      if (e.key === 'Enter') {
        e.preventDefault();
        setIsEditingCell(false);
        setSelectedCellId(`${indexToColLetter(colIdx)}${Math.min(NUM_ROWS, rowIdx + 1)}`);
      } else if (e.key === 'Escape') {
        setIsEditingCell(false);
        setFormulaInputVal(activeSheet.cells[selectedCellId]?.value || '');
      }
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      setIsEditingCell(true);
    } else if (e.key === 'ArrowUp' && rowIdx > 1) {
      e.preventDefault();
      setSelectedCellId(`${indexToColLetter(colIdx)}${rowIdx - 1}`);
    } else if (e.key === 'ArrowDown' && rowIdx < NUM_ROWS) {
      e.preventDefault();
      setSelectedCellId(`${indexToColLetter(colIdx)}${rowIdx + 1}`);
    } else if (e.key === 'ArrowRight' && colIdx > 0) {
      e.preventDefault();
      setSelectedCellId(`${indexToColLetter(colIdx - 1)}${rowIdx}`);
    } else if (e.key === 'ArrowLeft' && colIdx < NUM_COLS - 1) {
      e.preventDefault();
      setSelectedCellId(`${indexToColLetter(colIdx + 1)}${rowIdx}`);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (colIdx < NUM_COLS - 1) {
        setSelectedCellId(`${indexToColLetter(colIdx + 1)}${rowIdx}`);
      }
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      updateCell(selectedCellId, { value: '' });
      setFormulaInputVal('');
    }
  };

  // Insert standard formulas
  const insertFormulaTemplate = (fnName: string) => {
    const parsed = parseCellId(selectedCellId);
    if (!parsed) return;
    const col = parsed.col;
    const row = parsed.row;
    const startRow = 2;
    const endRow = Math.max(2, row - 1);
    const formulaStr = `=${fnName}(${col}${startRow}:${col}${endRow})`;
    setFormulaInputVal(formulaStr);
    handleFormulaCommit(formulaStr);
  };

  // Quick Sort Active Column
  const handleSortColumn = (ascending: boolean = true) => {
    const parsed = parseCellId(selectedCellId);
    if (!parsed) return;
    const col = parsed.col;

    const rowIndexes: number[] = [];
    for (let r = 2; r <= NUM_ROWS; r++) {
      rowIndexes.push(r);
    }

    rowIndexes.sort((rA, rB) => {
      const valA = activeSheet.cells[`${col}${rA}`]?.value || '';
      const valB = activeSheet.cells[`${col}${rB}`]?.value || '';
      const numA = parseFloat(valA);
      const numB = parseFloat(valB);

      if (!isNaN(numA) && !isNaN(numB)) {
        return ascending ? numA - numB : numB - numA;
      }
      return ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

    const newCells: Record<string, CellData> = {};
    for (let c = 0; c < NUM_COLS; c++) {
      const colLet = indexToColLetter(c);
      if (activeSheet.cells[`${colLet}1`]) {
        newCells[`${colLet}1`] = activeSheet.cells[`${colLet}1`];
      }
    }

    rowIndexes.forEach((oldRow, targetIdx) => {
      const newRowNum = targetIdx + 2;
      for (let c = 0; c < NUM_COLS; c++) {
        const colLet = indexToColLetter(c);
        const oldCell = activeSheet.cells[`${colLet}${oldRow}`];
        if (oldCell) {
          newCells[`${colLet}${newRowNum}`] = oldCell;
        }
      }
    });

    const updatedSheet: SheetData = {
      ...activeSheet,
      cells: newCells,
    };
    const updatedSheets = workbook.sheets.map(s => s.id === activeSheet.id ? updatedSheet : s);
    onChange({ ...workbook, sheets: updatedSheets });
  };

  // Summary statistics
  const summaryStats = useMemo(() => {
    let count = 0;
    let sum = 0;
    (Object.values(activeSheet.cells) as CellData[]).forEach((cell: CellData) => {
      if (cell.value && cell.value.trim() !== '') {
        count++;
        const evaluated = cell.value.startsWith('=')
          ? evaluateFormula(cell.value, activeSheet.cells)
          : cell.value;
        const num = parseFloat(evaluated);
        if (!isNaN(num)) {
          sum += num;
        }
      }
    });
    return { count, sum };
  }, [activeSheet]);

  const colorPalette = [
    '#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1',
    '#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e',
    '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6',
    '#fef9c3', '#fef08a', '#fde047', '#facc15', '#eab308',
    '#fee2e2', '#fecaca', '#fca5a5', '#f87171', '#ef4444',
    '#f3e8ff', '#e9d5ff', '#d8b4fe', '#c084fc', '#a855f7'
  ];

  const textColorPalette = [
    '#000000', '#1e293b', '#334155', '#64748b',
    '#15803d', '#16a34a', '#1d4ed8', '#2563eb',
    '#b45309', '#d97706', '#b91c1c', '#dc2626',
    '#6b21a8', '#9333ea', '#ffffff'
  ];

  return (
    <div className="flex flex-col h-full bg-neutral-100 overflow-hidden font-sans">
      {/* 0.5CM EXCEL FORMATTING TOOLBAR WITH DYNAMIC DROPDOWNS (height: 0.5cm) */}
      <div 
        style={{ height: '0.5cm', minHeight: '0.5cm', maxHeight: '0.5cm' }}
        className="bg-white border-b border-neutral-300 shadow-2xs z-30 select-none flex items-center justify-between px-2 gap-1 text-[10px] overflow-x-auto overflow-y-hidden leading-none"
      >
        {/* Left Side: Dynamic Menu Dropdowns */}
        <div className="flex items-center gap-0.5 shrink-0">
          {/* Dynamic Dropdown: ملف (File) */}
          <div className="relative dynamic-excel-dropdown">
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'file' ? null : 'file')}
              className={`flex items-center gap-0.5 px-1.5 py-0 h-4 rounded font-bold transition-colors leading-none ${
                activeDropdown === 'file' ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-neutral-100 text-neutral-800'
              }`}
            >
              <FileSpreadsheet className="w-2.5 h-2.5 text-emerald-700" />
              <span>ملف</span>
              <ChevronDown className="w-2 h-2 text-neutral-400" />
            </button>

            {activeDropdown === 'file' && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-neutral-300 rounded-xl shadow-xl py-1.5 w-52 z-50 text-right text-xs">
                <button
                  onClick={() => {
                    onOpenTemplates();
                    setActiveDropdown(null);
                  }}
                  className="w-full px-3 py-1.5 hover:bg-neutral-100 text-neutral-800 font-semibold flex items-center justify-between"
                >
                  <span>نماذج إكسل الجاهزة</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                </button>
                <button
                  onClick={() => {
                    exportWorkbookToXlsx(workbook);
                    setActiveDropdown(null);
                  }}
                  className="w-full px-3 py-1.5 hover:bg-neutral-100 text-neutral-800 flex items-center justify-between font-semibold"
                >
                  <span>تصدير ملف XLSX الأصلي</span>
                </button>
                <button
                  onClick={() => {
                    window.print();
                    setActiveDropdown(null);
                  }}
                  className="w-full px-3 py-1.5 hover:bg-neutral-100 text-neutral-700 flex items-center justify-between"
                >
                  <span>طباعة الشبكة</span>
                  <Printer className="w-3.5 h-3.5 text-neutral-400" />
                </button>
              </div>
            )}
          </div>

          {/* Dynamic Dropdown: تنسيق وتعبئة (Format) */}
          <div className="relative dynamic-excel-dropdown">
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'format' ? null : 'format')}
              className={`flex items-center gap-0.5 px-1.5 py-0 h-4 rounded font-bold transition-colors leading-none ${
                activeDropdown === 'format' ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-neutral-100 text-neutral-800'
              }`}
            >
              <Palette className="w-2.5 h-2.5 text-neutral-700" />
              <span>تنسيق</span>
              <ChevronDown className="w-2 h-2 text-neutral-400" />
            </button>

            {activeDropdown === 'format' && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-neutral-300 rounded-xl shadow-xl p-3 w-64 z-50 text-right space-y-2.5 text-xs">
                <div>
                  <span className="text-[11px] font-bold text-neutral-500 block mb-1">نوع البيانات والأرقام:</span>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <button
                      onClick={() => {
                        updateSelectedCellStyle({ format: 'currency' });
                        setActiveDropdown(null);
                      }}
                      className="px-2 py-1 bg-neutral-50 hover:bg-emerald-50 rounded border border-neutral-200 text-right font-semibold"
                    >
                      عملة (ر.س)
                    </button>
                    <button
                      onClick={() => {
                        updateSelectedCellStyle({ format: 'percentage' });
                        setActiveDropdown(null);
                      }}
                      className="px-2 py-1 bg-neutral-50 hover:bg-emerald-50 rounded border border-neutral-200 text-right font-semibold"
                    >
                      نسبة مئوية (%)
                    </button>
                    <button
                      onClick={() => {
                        updateSelectedCellStyle({ format: 'number' });
                        setActiveDropdown(null);
                      }}
                      className="px-2 py-1 bg-neutral-50 hover:bg-emerald-50 rounded border border-neutral-200 text-right font-semibold"
                    >
                      رقم قياسي
                    </button>
                    <button
                      onClick={() => {
                        updateSelectedCellStyle({ format: 'date' });
                        setActiveDropdown(null);
                      }}
                      className="px-2 py-1 bg-neutral-50 hover:bg-emerald-50 rounded border border-neutral-200 text-right font-semibold"
                    >
                      تاريخ
                    </button>
                  </div>
                </div>

                <div className="border-t border-neutral-100 pt-2">
                  <span className="text-[11px] font-bold text-neutral-500 block mb-1">تعبئة لون خلفية الخلية:</span>
                  <div className="grid grid-cols-6 gap-1">
                    {colorPalette.slice(0, 18).map(c => (
                      <button
                        key={c}
                        onClick={() => {
                          updateSelectedCellStyle({ backgroundColor: c });
                          setActiveDropdown(null);
                        }}
                        style={{ backgroundColor: c }}
                        className="w-6 h-6 rounded-xs border border-neutral-300 hover:scale-110 transition-transform"
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dynamic Dropdown: تجميد وعرض (Freeze Panes & View) */}
          <div className="relative dynamic-excel-dropdown">
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'freeze' ? null : 'freeze')}
              className={`flex items-center gap-0.5 px-1.5 py-0 h-4 rounded font-bold transition-colors leading-none ${
                freezeTopRow || freezeFirstCol ? 'bg-cyan-100 text-cyan-900 border border-cyan-300' : 'hover:bg-neutral-100 text-neutral-800'
              }`}
            >
              <Lock className="w-2.5 h-2.5 text-cyan-700" />
              <span>تجميد الألواح</span>
              <ChevronDown className="w-2 h-2 text-neutral-400" />
            </button>

            {activeDropdown === 'freeze' && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-neutral-300 rounded-xl shadow-xl py-1.5 w-64 z-50 text-right text-xs">
                <button
                  onClick={() => {
                    setFreezeTopRow(!freezeTopRow);
                    setActiveDropdown(null);
                  }}
                  className={`w-full px-3 py-2 text-xs hover:bg-cyan-50 flex items-center justify-between ${
                    freezeTopRow ? 'bg-cyan-50/70 text-cyan-900 font-bold' : 'text-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-cyan-600" />
                    <span>تجميد الصف العلوي (صف 1)</span>
                  </div>
                  {freezeTopRow && <Check className="w-4 h-4 text-cyan-700" />}
                </button>

                <button
                  onClick={() => {
                    setFreezeFirstCol(!freezeFirstCol);
                    setActiveDropdown(null);
                  }}
                  className={`w-full px-3 py-2 text-xs hover:bg-cyan-50 flex items-center justify-between ${
                    freezeFirstCol ? 'bg-cyan-50/70 text-cyan-900 font-bold' : 'text-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-cyan-600" />
                    <span>تجميد العمود الأول (عمود A)</span>
                  </div>
                  {freezeFirstCol && <Check className="w-4 h-4 text-cyan-700" />}
                </button>

                <button
                  onClick={() => {
                    setFreezeTopRow(true);
                    setFreezeFirstCol(true);
                    setActiveDropdown(null);
                  }}
                  className="w-full px-3 py-2 text-xs hover:bg-cyan-50 text-neutral-800 flex items-center justify-between border-t border-neutral-100"
                >
                  <span>تجميد الصف والعمود معاً</span>
                </button>

                {(freezeTopRow || freezeFirstCol) && (
                  <button
                    onClick={() => {
                      setFreezeTopRow(false);
                      setFreezeFirstCol(false);
                      setActiveDropdown(null);
                    }}
                    className="w-full px-3 py-2 text-xs hover:bg-red-50 text-red-700 flex items-center gap-2 border-t border-neutral-100"
                  >
                    <Unlock className="w-4 h-4" />
                    <span>إلغاء التجميد بالكامل</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Dynamic Dropdown: دوال تلقائية (Formulas) */}
          <div className="relative dynamic-excel-dropdown">
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'formulas' ? null : 'formulas')}
              className={`flex items-center gap-0.5 px-1.5 py-0 h-4 rounded font-bold transition-colors leading-none ${
                activeDropdown === 'formulas' ? 'bg-blue-100 text-blue-800' : 'hover:bg-neutral-100 text-neutral-800'
              }`}
            >
              <Sigma className="w-2.5 h-2.5 text-blue-700" />
              <span>دوال</span>
              <ChevronDown className="w-2 h-2 text-neutral-400" />
            </button>

            {activeDropdown === 'formulas' && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-neutral-300 rounded-xl shadow-xl py-1.5 w-56 z-50 text-right text-xs">
                <button
                  onClick={() => {
                    insertFormulaTemplate('SUM');
                    setActiveDropdown(null);
                  }}
                  className="w-full px-3 py-2 hover:bg-emerald-50 text-neutral-800 font-bold flex items-center justify-between"
                >
                  <span>=SUM (حساب المجموع)</span>
                  <Sigma className="w-3.5 h-3.5 text-emerald-600" />
                </button>
                <button
                  onClick={() => {
                    insertFormulaTemplate('AVERAGE');
                    setActiveDropdown(null);
                  }}
                  className="w-full px-3 py-2 hover:bg-blue-50 text-neutral-800 font-bold flex items-center justify-between"
                >
                  <span>=AVERAGE (المتوسط الحسابي)</span>
                  <Calculator className="w-3.5 h-3.5 text-blue-600" />
                </button>
                <button
                  onClick={() => {
                    insertFormulaTemplate('COUNT');
                    setActiveDropdown(null);
                  }}
                  className="w-full px-3 py-2 hover:bg-neutral-100 text-neutral-800 flex items-center justify-between"
                >
                  <span>=COUNT (عدد الخلايا)</span>
                </button>
                <button
                  onClick={() => {
                    insertFormulaTemplate('MAX');
                    setActiveDropdown(null);
                  }}
                  className="w-full px-3 py-2 hover:bg-neutral-100 text-neutral-800 flex items-center justify-between"
                >
                  <span>=MAX (أعلى قيمة)</span>
                </button>
                <button
                  onClick={() => {
                    insertFormulaTemplate('MIN');
                    setActiveDropdown(null);
                  }}
                  className="w-full px-3 py-2 hover:bg-neutral-100 text-neutral-800 flex items-center justify-between"
                >
                  <span>=MIN (أدنى قيمة)</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Center: 0.5CM FAST ACTION BUTTONS */}
        <div className="flex items-center gap-0.5 overflow-x-auto">
          {/* Bold, Italic, Underline */}
          <div className="flex items-center bg-neutral-100 rounded border border-neutral-300 p-0.5 h-4">
            <button
              onClick={() => updateSelectedCellStyle({ bold: !selectedCell?.style?.bold })}
              className={`p-0.5 rounded transition-colors h-3 w-3 flex items-center justify-center ${
                selectedCell?.style?.bold ? 'bg-emerald-600 text-white font-bold' : 'text-neutral-800 hover:bg-white'
              }`}
              title="عريض (Ctrl+B)"
            >
              <Bold className="w-2.5 h-2.5" />
            </button>
            <button
              onClick={() => updateSelectedCellStyle({ italic: !selectedCell?.style?.italic })}
              className={`p-0.5 rounded transition-colors h-3 w-3 flex items-center justify-center ${
                selectedCell?.style?.italic ? 'bg-emerald-600 text-white' : 'text-neutral-800 hover:bg-white'
              }`}
              title="مائل (Ctrl+I)"
            >
              <Italic className="w-2.5 h-2.5" />
            </button>
            <button
              onClick={() => updateSelectedCellStyle({ underline: !selectedCell?.style?.underline })}
              className={`p-0.5 rounded transition-colors h-3 w-3 flex items-center justify-center ${
                selectedCell?.style?.underline ? 'bg-emerald-600 text-white' : 'text-neutral-800 hover:bg-white'
              }`}
              title="تسطير (Ctrl+U)"
            >
              <Underline className="w-2.5 h-2.5" />
            </button>
          </div>

          {/* Cell Fill & Font Color Quick Buttons */}
          <div className="relative">
            <button
              onClick={() => {
                setShowFillColorPicker(!showFillColorPicker);
                setShowTextColorPicker(false);
              }}
              className="h-4 px-1 flex items-center gap-0.5 hover:bg-neutral-100 rounded border border-neutral-300 text-neutral-700 leading-none"
              title="لون تعبئة الخلية"
            >
              <Palette className="w-2.5 h-2.5 text-emerald-600" />
            </button>
            {showFillColorPicker && (
              <div className="absolute top-full mt-1 bg-white border border-neutral-300 rounded-lg shadow-xl p-2 z-50 w-48 text-xs">
                <span className="text-[10px] font-bold text-neutral-500 block mb-1.5">لون التعبئة:</span>
                <div className="grid grid-cols-5 gap-1.5">
                  {colorPalette.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        updateSelectedCellStyle({ backgroundColor: c });
                        setShowFillColorPicker(false);
                      }}
                      style={{ backgroundColor: c }}
                      className="w-5 h-5 rounded-xs border border-neutral-300 hover:scale-110 transition-transform"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setShowTextColorPicker(!showTextColorPicker);
                setShowFillColorPicker(false);
              }}
              className="h-4 px-1 flex items-center gap-0.5 hover:bg-neutral-100 rounded border border-neutral-300 text-neutral-700 font-bold leading-none"
              title="لون خط الخلية"
            >
              <span className="underline decoration-blue-600 decoration-2 text-[10px]">A</span>
            </button>
            {showTextColorPicker && (
              <div className="absolute top-full mt-1 bg-white border border-neutral-300 rounded-lg shadow-xl p-2 z-50 w-48 text-xs">
                <span className="text-[10px] font-bold text-neutral-500 block mb-1.5">لون النص:</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {textColorPalette.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        updateSelectedCellStyle({ color: c });
                        setShowTextColorPicker(false);
                      }}
                      style={{ backgroundColor: c }}
                      className="w-5 h-5 rounded-xs border border-neutral-300 hover:scale-110 transition-transform"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="h-3 w-px bg-neutral-300 mx-0.5" />

          {/* Quick Alignments */}
          <div className="flex items-center bg-neutral-100 rounded border border-neutral-300 p-0.5 h-4">
            <button
              onClick={() => updateSelectedCellStyle({ align: 'right' })}
              className={`p-0.5 rounded transition-colors h-3 w-3 flex items-center justify-center ${
                (selectedCell?.style?.align || 'right') === 'right' ? 'bg-white text-neutral-900 font-bold' : 'text-neutral-600'
              }`}
              title="محاذاة لليمين"
            >
              <AlignRight className="w-2.5 h-2.5" />
            </button>
            <button
              onClick={() => updateSelectedCellStyle({ align: 'center' })}
              className={`p-0.5 rounded transition-colors h-3 w-3 flex items-center justify-center ${
                selectedCell?.style?.align === 'center' ? 'bg-white text-neutral-900 font-bold' : 'text-neutral-600'
              }`}
              title="توسيط"
            >
              <AlignCenter className="w-2.5 h-2.5" />
            </button>
            <button
              onClick={() => updateSelectedCellStyle({ align: 'left' })}
              className={`p-0.5 rounded transition-colors h-3 w-3 flex items-center justify-center ${
                selectedCell?.style?.align === 'left' ? 'bg-white text-neutral-900 font-bold' : 'text-neutral-600'
              }`}
              title="محاذاة لليسار"
            >
              <AlignLeft className="w-2.5 h-2.5" />
            </button>
          </div>

          <div className="h-3 w-px bg-neutral-300 mx-0.5" />

          {/* Fast Number Formats */}
          <button
            onClick={() => updateSelectedCellStyle({ format: 'currency' })}
            className="h-4 px-1.5 hover:bg-neutral-100 rounded border border-neutral-300 flex items-center gap-0.5 font-bold text-neutral-700 leading-none"
            title="تنسيق العملة ر.س"
          >
            <Coins className="w-2.5 h-2.5 text-amber-600" />
            <span className="text-[9px]">ر.س</span>
          </button>

          <button
            onClick={() => updateSelectedCellStyle({ format: 'percentage' })}
            className="h-4 px-1.5 hover:bg-neutral-100 rounded border border-neutral-300 flex items-center gap-0.5 font-bold text-neutral-700 leading-none"
            title="تنسيق النسبة المئوية %"
          >
            <Percent className="w-2.5 h-2.5 text-blue-600" />
          </button>

          <div className="h-3 w-px bg-neutral-300 mx-0.5" />

          {/* Freeze Panes Quick Toggle */}
          <button
            onClick={() => setFreezeTopRow(!freezeTopRow)}
            className={`h-4 px-1.5 rounded border flex items-center gap-0.5 font-semibold transition-colors leading-none ${
              freezeTopRow ? 'bg-cyan-50 border-cyan-300 text-cyan-800 font-bold' : 'border-neutral-300 text-neutral-700 hover:bg-neutral-100'
            }`}
            title="تجميد/إلغاء تجميد الصف العلوي ليبقى ثابتاً أثناء التمرير"
          >
            <Lock className="w-2.5 h-2.5 text-cyan-600" />
            <span className="text-[9px]">تجميد صف 1</span>
          </button>

          {/* Chart Modal Trigger */}
          <button
            onClick={() => setShowChartModal(true)}
            className="h-4 px-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded border border-emerald-700 flex items-center gap-0.5 font-bold shadow-2xs cursor-pointer leading-none"
            title="إنشاء مخطط ورسم بياني (Recharts)"
          >
            <BarChart2 className="w-2.5 h-2.5" />
            <span className="text-[9px]">مخطط بياني</span>
          </button>
        </div>

        {/* Right Side: Virtual Keyboard & Clear */}
        <div className="flex items-center gap-1 shrink-0">
          {onToggleKeyboard && (
            <button
              onClick={onToggleKeyboard}
              className={`h-4 px-1.5 rounded border flex items-center gap-1 font-bold transition-all leading-none ${
                isKeyboardOpen
                  ? 'bg-cyan-600 text-white border-cyan-700 shadow-2xs'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-300'
              }`}
              title="تشغيل / إخفاء الكيبورد العربي الملحق"
            >
              <KeyboardIcon className="w-2.5 h-2.5" />
              <span className="text-[9px]">كيبورد</span>
            </button>
          )}

          <button
            onClick={() => updateCell(selectedCellId, { value: '' })}
            className="p-0.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded border border-neutral-200 h-4 w-4 flex items-center justify-center"
            title="مسح الخلية المحددة"
          >
            <Trash2 className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>

      {/* Formula Bar */}
      <div className="flex items-center px-4 py-1.5 bg-white border-b border-neutral-300 gap-2 text-xs select-none">
        <div className="w-14 text-center font-mono font-bold text-neutral-800 bg-neutral-100 border border-neutral-300 rounded px-1.5 py-0.5">
          {selectedCellId}
        </div>
        <div className="text-neutral-400 font-serif italic font-bold px-1 text-sm">
          fx
        </div>
        <div className="flex-1 relative">
          <input
            id="formula-bar-input"
            type="text"
            value={formulaInputVal}
            onChange={(e) => setFormulaInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleFormulaCommit(formulaInputVal);
              }
            }}
            onBlur={() => handleFormulaCommit(formulaInputVal)}
            placeholder="أدخل قيمة أو صيغة رياضية (مثال: =SUM(A1:A5) أو 1500)"
            className="w-full bg-neutral-50 hover:bg-white focus:bg-white border border-neutral-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 rounded px-3 py-1 text-neutral-900 font-mono text-xs outline-hidden"
          />
        </div>
      </div>

      {/* Main Spreadsheet Grid Container with Sticky Headers & Freeze Panes */}
      <div className="flex-1 overflow-auto bg-neutral-200/60 relative select-none">
        <div className="inline-block min-w-full bg-white">
          <table className="border-collapse border border-neutral-300 w-full table-fixed text-xs">
            {/* Table Header: Column Letters (Sticky Top) */}
            <thead>
              <tr className="bg-neutral-100 text-neutral-700 select-none">
                <th className="w-12 h-7 border border-neutral-300 bg-neutral-200 text-neutral-500 font-bold text-center sticky top-0 right-0 z-30">
                  #
                </th>
                {Array.from({ length: NUM_COLS }).map((_, c) => {
                  const colLetter = indexToColLetter(c);
                  const isColActive = parseCellId(selectedCellId)?.col === colLetter;
                  const isFirstColFrozen = freezeFirstCol && c === 0;

                  return (
                    <th
                      key={colLetter}
                      style={{ width: c === 1 ? '220px' : c === 0 ? '60px' : '130px' }}
                      className={`h-7 border border-neutral-300 text-center font-bold sticky top-0 transition-colors ${
                        isFirstColFrozen ? 'right-12 z-30 bg-cyan-100 border-l-2 border-cyan-500' : 'z-20'
                      } ${
                        isColActive ? 'bg-emerald-200/80 text-emerald-900 font-extrabold' : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>{colLetter}</span>
                        {isFirstColFrozen && <Lock className="w-2.5 h-2.5 text-cyan-700" />}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Table Body: Rows & Cells with Freeze Panes */}
            <tbody>
              {Array.from({ length: NUM_ROWS }).map((_, r) => {
                const rowNum = r + 1;
                const isRowActive = parseCellId(selectedCellId)?.row === rowNum;
                const isTopRowFrozen = freezeTopRow && rowNum === 1;

                return (
                  <tr key={rowNum} className="hover:bg-neutral-50/50">
                    {/* Row Number Header */}
                    <td
                      className={`w-12 h-6 border border-neutral-300 text-center font-mono select-none sticky right-0 transition-colors ${
                        isTopRowFrozen
                          ? 'top-7 z-30 bg-cyan-100 text-cyan-900 font-bold border-b-2 border-cyan-500'
                          : isRowActive
                          ? 'z-20 bg-emerald-200/80 text-emerald-900 font-extrabold'
                          : 'z-20 bg-neutral-100 text-neutral-500'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-0.5">
                        <span>{rowNum}</span>
                        {isTopRowFrozen && <Lock className="w-2.5 h-2.5 text-cyan-700" />}
                      </div>
                    </td>

                    {/* Data Cells in Row */}
                    {Array.from({ length: NUM_COLS }).map((_, c) => {
                      const colLetter = indexToColLetter(c);
                      const cellId = `${colLetter}${rowNum}`;
                      const cellData = activeSheet.cells[cellId];
                      const isSelected = selectedCellId === cellId;
                      const isFirstColFrozen = freezeFirstCol && c === 0;

                      // Compute display text
                      let display = '';
                      if (cellData && cellData.value) {
                        const evaluated = evaluateFormula(cellData.value, activeSheet.cells);
                        display = formatDisplayValue(evaluated, cellData.style?.format);
                      }

                      // Border styling calculation
                      let borderClass = 'border border-neutral-300';
                      if (cellData?.style?.borderBottom) borderClass += ' border-b-2 border-b-neutral-800';
                      if (cellData?.style?.borderTop) borderClass += ' border-t-2 border-t-neutral-800';

                      // Determine Freeze Panes sticky class
                      let freezeClass = '';
                      if (isTopRowFrozen && isFirstColFrozen) {
                        // Cell A1 with both frozen
                        freezeClass = 'sticky top-7 right-12 z-25 border-b-2 border-l-2 border-cyan-600 bg-cyan-50/95 shadow-xs';
                      } else if (isTopRowFrozen) {
                        // Entire row 1 frozen
                        freezeClass = 'sticky top-7 z-15 border-b-2 border-cyan-500 bg-neutral-50/95 shadow-2xs';
                      } else if (isFirstColFrozen) {
                        // Entire column A frozen
                        freezeClass = 'sticky right-12 z-15 border-l-2 border-cyan-500 bg-neutral-50/95 shadow-2xs';
                      }

                      return (
                        <td
                          key={cellId}
                          onClick={() => {
                            setSelectedCellId(cellId);
                            setIsEditingCell(false);
                          }}
                          onDoubleClick={() => {
                            setSelectedCellId(cellId);
                            setIsEditingCell(true);
                          }}
                          onKeyDown={(e) => handleKeyDown(e, c, rowNum)}
                          tabIndex={0}
                          style={{
                            backgroundColor: cellData?.style?.backgroundColor || (isTopRowFrozen ? '#f0fdfa' : undefined),
                            color: cellData?.style?.color || undefined,
                            fontWeight: cellData?.style?.bold || isTopRowFrozen ? 'bold' : 'normal',
                            fontStyle: cellData?.style?.italic ? 'italic' : 'normal',
                            textDecoration: cellData?.style?.underline ? 'underline' : 'none',
                            textAlign: cellData?.style?.align || 'right',
                          }}
                          className={`h-6 px-2 text-xs truncate relative cursor-cell outline-hidden transition-colors ${borderClass} ${freezeClass} ${
                            isSelected
                              ? 'ring-2 ring-emerald-600 ring-inset bg-emerald-50/70 z-10'
                              : 'hover:bg-neutral-50'
                          }`}
                        >
                          {isSelected && isEditingCell ? (
                            <input
                              type="text"
                              autoFocus
                              value={formulaInputVal}
                              onChange={(e) => setFormulaInputVal(e.target.value)}
                              onBlur={() => handleFormulaCommit(formulaInputVal)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleFormulaCommit(formulaInputVal);
                                } else if (e.key === 'Escape') {
                                  setIsEditingCell(false);
                                  setFormulaInputVal(cellData?.value || '');
                                }
                              }}
                              className="w-full h-full bg-white text-neutral-900 outline-hidden font-mono text-xs px-1 absolute inset-0 z-20"
                            />
                          ) : (
                            <span className="block truncate font-sans">{display}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sheets Navigation & Status Bar (Exact 0.5cm height) */}
      <div 
        style={{ height: '0.5cm', minHeight: '0.5cm', maxHeight: '0.5cm' }}
        className="bg-white border-t border-neutral-300 px-2 py-0 flex items-center justify-between text-[10px] text-neutral-700 select-none z-20 overflow-hidden leading-none"
      >
        {/* Left: Sheets Tabs */}
        <div className="flex items-center gap-0.5 overflow-x-auto">
          <button
            onClick={handleAddSheet}
            className="p-0.5 hover:bg-neutral-100 rounded text-neutral-600 h-3.5 w-3.5 flex items-center justify-center"
            title="إضافة ورقة عمل جديدة"
          >
            <Plus className="w-2.5 h-2.5" />
          </button>

          <div className="flex items-center gap-0.5">
            {workbook.sheets.map((sheet) => {
              const isActive = sheet.id === activeSheet.id;
              return (
                <div
                  key={sheet.id}
                  onClick={() => handleSwitchSheet(sheet.id)}
                  onDoubleClick={() => handleRenameSheet(sheet.id)}
                  className={`flex items-center gap-1 px-2 py-0 h-3.5 rounded-t border-t border-x cursor-pointer text-[9px] transition-colors leading-none ${
                    isActive
                      ? 'bg-neutral-100 border-neutral-300 text-emerald-800 font-bold border-b-2 border-b-emerald-600'
                      : 'bg-white border-transparent text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <span>{sheet.name}</span>
                  {workbook.sheets.length > 1 && (
                    <button
                      onClick={(e) => handleDeleteSheet(sheet.id, e)}
                      className="p-0 hover:text-red-600 rounded"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Summary Statistics & Quick Freeze indicators */}
        <div className="flex items-center gap-2 text-[9px] text-neutral-500 font-medium">
          {freezeTopRow && (
            <span className="flex items-center gap-0.5 text-cyan-800 bg-cyan-50 px-1 py-0 rounded border border-cyan-200">
              <Lock className="w-2.5 h-2.5" />
              <span>صف 1</span>
            </span>
          )}
          <span>خلايا: <strong className="font-mono text-neutral-800">{summaryStats.count}</strong></span>
          <span>المجموع: <strong className="font-mono text-neutral-800">{summaryStats.sum.toLocaleString('ar-SA')}</strong></span>
        </div>
      </div>

      {/* Chart Modal */}
      <ChartModal
        isOpen={showChartModal}
        onClose={() => setShowChartModal(false)}
        cells={activeSheet.cells}
      />
    </div>
  );
};
