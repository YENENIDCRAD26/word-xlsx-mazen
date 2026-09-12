import React, { useEffect, useRef, useState } from 'react';
import { Plus, Sheet as SheetIcon } from 'lucide-react';
import { CellData, ExcelSheet } from '../../types';
import { 
  colIndexToLetter, 
  evaluateFormula, 
  formatCellValue, 
  parseCellAddress 
} from '../../utils/excelCalculations';

interface ExcelGridProps {
  sheet: ExcelSheet;
  sheets: ExcelSheet[];
  activeSheetId: string;
  onSelectSheet: (id: string) => void;
  onAddSheet: () => void;
  onRenameSheet: (id: string, newName: string) => void;
  selectedCell: string;
  onSelectCell: (cellAddr: string) => void;
  onUpdateCell: (cellAddr: string, partial: Partial<CellData>) => void;
  onCellDoubleClick: (cellAddr: string) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  inlineValue: string;
  setInlineValue: (val: string) => void;
  onCommitInlineEdit: () => void;
}

export const ExcelGrid: React.FC<ExcelGridProps> = ({
  sheet,
  sheets,
  activeSheetId,
  onSelectSheet,
  onAddSheet,
  onRenameSheet,
  selectedCell,
  onSelectCell,
  onUpdateCell,
  onCellDoubleClick,
  isEditing,
  setIsEditing,
  inlineValue,
  setInlineValue,
  onCommitInlineEdit
}) => {
  const [editingSheetId, setEditingSheetId] = useState<string | null>(null);
  const [tempSheetName, setTempSheetName] = useState('');
  const inlineInputRef = useRef<HTMLInputElement>(null);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inlineInputRef.current) {
      inlineInputRef.current.focus();
    }
  }, [isEditing]);

  const rows = Array.from({ length: sheet.rowCount }, (_, i) => i + 1);
  const cols = Array.from({ length: sheet.colCount }, (_, i) => colIndexToLetter(i));

  // Handle keyboard navigation between cells
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isEditing) {
      if (e.key === 'Enter') {
        e.preventDefault();
        onCommitInlineEdit();
        // Move to row below
        const parsed = parseCellAddress(selectedCell);
        if (parsed && parsed.row < sheet.rowCount) {
          onSelectCell(`${parsed.col}${parsed.row + 1}`);
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        onCommitInlineEdit();
        // Move to next column
        const parsed = parseCellAddress(selectedCell);
        if (parsed && parsed.colIndex + 1 < sheet.colCount) {
          onSelectCell(`${colIndexToLetter(parsed.colIndex + 1)}${parsed.row}`);
        }
      } else if (e.key === 'Escape') {
        setIsEditing(false);
      }
      return;
    }

    const parsed = parseCellAddress(selectedCell);
    if (!parsed) return;

    if (e.key === 'ArrowUp' && parsed.row > 1) {
      e.preventDefault();
      onSelectCell(`${parsed.col}${parsed.row - 1}`);
    } else if (e.key === 'ArrowDown' && parsed.row < sheet.rowCount) {
      e.preventDefault();
      onSelectCell(`${parsed.col}${parsed.row + 1}`);
    } else if (e.key === 'ArrowLeft') {
      // In RTL, ArrowLeft moves to next column index
      e.preventDefault();
      if (parsed.colIndex + 1 < sheet.colCount) {
        onSelectCell(`${colIndexToLetter(parsed.colIndex + 1)}${parsed.row}`);
      }
    } else if (e.key === 'ArrowRight') {
      // In RTL, ArrowRight moves to previous column index
      e.preventDefault();
      if (parsed.colIndex > 0) {
        onSelectCell(`${colIndexToLetter(parsed.colIndex - 1)}${parsed.row}`);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      onCellDoubleClick(selectedCell);
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      onUpdateCell(selectedCell, { value: '', formula: undefined });
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      // Start typing directly into active cell
      setInlineValue(e.key);
      setIsEditing(true);
    }
  };

  // Calculate live statistics for bottom bar
  let cellCount = 0;
  let sumTotal = 0;
  let numericCount = 0;

  Object.entries(sheet.data).forEach(([_, c]: [string, CellData]) => {
    if (c.value || c.formula) {
      cellCount++;
      const val = c.formula ? evaluateFormula(c.formula, sheet.data) : (c.value || '');
      const num = parseFloat(val.replace(/[^\d.-]/g, ''));
      if (!isNaN(num)) {
        sumTotal += num;
        numericCount++;
      }
    }
  });

  const avgValue = numericCount > 0 ? (sumTotal / numericCount).toFixed(2) : '0';

  return (
    <div 
      className="flex-1 flex flex-col bg-slate-100 overflow-hidden select-none outline-none"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      dir="rtl"
    >
      {/* Scrollable Spreadsheet Table */}
      <div className="flex-1 overflow-auto bg-white relative">
        <table className="border-collapse table-fixed w-full min-w-[900px] text-xs font-sans border-spacing-0">
          <thead>
            <tr className="bg-slate-100 sticky top-0 z-20 shadow-2xs">
              {/* Top-Right Row Header Corner */}
              <th className="w-12 h-7 bg-slate-200 border-b border-l border-slate-300 text-slate-500 font-bold text-center select-none sticky right-0 z-30">
                #
              </th>
              {/* Column Letters (A, B, C...) */}
              {cols.map((col) => (
                <th
                  key={col}
                  className={`h-7 px-2 border-b border-l border-slate-300 font-bold text-slate-700 text-center select-none ${
                    selectedCell.startsWith(col) ? 'bg-emerald-200/70 text-emerald-900 font-black' : 'bg-slate-100'
                  }`}
                  style={{
                    width: col === 'A' ? '50px' : col === 'B' ? '280px' : col === 'C' ? '180px' : col === 'D' || col === 'E' ? '140px' : '150px'
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((rowNum) => {
              const isRowSelected = selectedCell.endsWith(rowNum.toString());
              return (
                <tr key={rowNum} className="h-7 hover:bg-slate-50/50">
                  {/* Row Number Header (1, 2, 3...) */}
                  <td 
                    className={`w-12 h-7 border-b border-l border-slate-300 font-medium text-slate-600 text-center select-none sticky right-0 z-10 ${
                      isRowSelected ? 'bg-emerald-200/70 text-emerald-900 font-black' : 'bg-slate-100'
                    }`}
                  >
                    {rowNum}
                  </td>

                  {/* Row Cells */}
                  {cols.map((col) => {
                    const addr = `${col}${rowNum}`;
                    const cell = sheet.data[addr];
                    const isSelected = selectedCell === addr;
                    const isCellEditing = isSelected && isEditing;

                    // Compute displayed value
                    let displayVal = '';
                    if (cell) {
                      if (cell.formula && cell.formula.startsWith('=')) {
                        const calculated = evaluateFormula(cell.formula, sheet.data);
                        displayVal = formatCellValue(calculated, cell.format);
                      } else {
                        displayVal = formatCellValue(cell.value || '', cell.format);
                      }
                    }

                    // Calculate custom border styling
                    let customBorderStyle: React.CSSProperties = {};
                    if (cell?.borderStyle === 'double_bottom') {
                      customBorderStyle = { borderBottom: `3px double ${cell.borderColor || '#0369a1'}` };
                    } else if (cell?.borderStyle === 'box') {
                      customBorderStyle = { border: `2px solid ${cell.borderColor || '#15803d'}` };
                    } else if (cell?.borderStyle === 'all') {
                      customBorderStyle = { border: `1px solid ${cell.borderColor || '#94a3b8'}` };
                    } else if (cell?.borderStyle === 'bottom') {
                      customBorderStyle = { borderBottom: `2px solid ${cell.borderColor || '#334155'}` };
                    }

                    return (
                      <td
                        key={addr}
                        id={`excel-cell-${addr}`}
                        onClick={() => {
                          if (isSelected) return;
                          if (isEditing) onCommitInlineEdit();
                          onSelectCell(addr);
                        }}
                        onDoubleClick={() => onCellDoubleClick(addr)}
                        className={`h-7 px-1.5 border-b border-l border-slate-300 relative transition-colors ${
                          isSelected ? 'ring-2 ring-emerald-600 ring-inset z-10' : ''
                        }`}
                        style={{
                          backgroundColor: cell?.bg || 'transparent',
                          color: cell?.color || '#0f172a',
                          fontWeight: cell?.bold ? 'bold' : 'normal',
                          fontStyle: cell?.italic ? 'italic' : 'normal',
                          textDecoration: cell?.underline ? 'underline' : 'none',
                          textAlign: cell?.align || (displayVal.match(/^[\d,.\s]+/) ? 'left' : 'right'),
                          whiteSpace: cell?.wrapText ? 'normal' : 'nowrap',
                          overflow: cell?.wrapText ? 'visible' : 'hidden',
                          textOverflow: cell?.wrapText ? 'clip' : 'ellipsis',
                          fontSize: cell?.fontSize ? `${cell.fontSize}px` : undefined,
                          ...customBorderStyle,
                        }}
                      >
                        {isCellEditing ? (
                          <input
                            ref={inlineInputRef}
                            type="text"
                            value={inlineValue}
                            onChange={(e) => setInlineValue(e.target.value)}
                            onBlur={onCommitInlineEdit}
                            className="absolute inset-0 w-full h-full px-1.5 bg-white text-slate-900 font-medium focus:outline-none border-2 border-emerald-600 z-20 text-xs"
                            dir="auto"
                          />
                        ) : (
                          <span className="block truncate">{displayVal}</span>
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

      {/* Bottom Sheet Tabs & Statistics Bar */}
      <div className="bg-slate-200 border-t border-slate-300 flex items-center justify-between px-3 py-1 text-xs select-none shadow-2xs">
        {/* Sheet Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {sheets.map((s) => {
            const isActive = s.id === activeSheetId;
            return (
              <div
                key={s.id}
                onClick={() => onSelectSheet(s.id)}
                onDoubleClick={() => {
                  setEditingSheetId(s.id);
                  setTempSheetName(s.name);
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-t border-t border-x cursor-pointer transition font-medium ${
                  isActive
                    ? 'bg-white text-emerald-800 border-slate-300 font-bold shadow-2xs -mb-px'
                    : 'bg-slate-300/80 text-slate-700 hover:bg-slate-300 border-transparent'
                }`}
              >
                <SheetIcon className="w-3.5 h-3.5 text-emerald-600" />
                {editingSheetId === s.id ? (
                  <input
                    type="text"
                    autoFocus
                    value={tempSheetName}
                    onChange={(e) => setTempSheetName(e.target.value)}
                    onBlur={() => {
                      if (tempSheetName.trim()) {
                        onRenameSheet(s.id, tempSheetName.trim());
                      }
                      setEditingSheetId(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        if (tempSheetName.trim()) {
                          onRenameSheet(s.id, tempSheetName.trim());
                        }
                        setEditingSheetId(null);
                      }
                    }}
                    className="w-28 px-1 py-0.2 text-xs border rounded bg-white"
                  />
                ) : (
                  <span>{s.name}</span>
                )}
              </div>
            );
          })}

          {/* Add Sheet Button */}
          <button
            onClick={onAddSheet}
            className="p-1 hover:bg-slate-300 rounded text-slate-700 transition"
            title="إضافة ورقة عمل جديدة"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Live Calculation Statistics Bar */}
        <div className="flex items-center gap-3 text-slate-600 text-[11px] font-mono font-medium hidden sm:flex">
          <div className="bg-white/80 px-2 py-0.5 rounded border border-slate-300">
            الخلايا: <span className="font-bold text-slate-900">{cellCount}</span>
          </div>
          <div className="bg-white/80 px-2 py-0.5 rounded border border-slate-300">
            المجموع (SUM): <span className="font-bold text-emerald-700">{sumTotal.toLocaleString('en-US')}</span>
          </div>
          <div className="bg-white/80 px-2 py-0.5 rounded border border-slate-300">
            المتوسط (AVG): <span className="font-bold text-blue-700">{avgValue}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
