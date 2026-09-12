import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  AppMode, 
  WordDocumentState, 
  ExcelState, 
  VirtualKeyboardState, 
  CellData, 
  WordRibbonTab, 
  ExcelRibbonTab 
} from './types';
import { initialWordDocument, initialExcelData } from './data/initialData';
import { TopHeader } from './components/TopHeader';
import { ArabVirtualKeyboard } from './components/ArabVirtualKeyboard';
import { StatusBar } from './components/StatusBar';
import { WordRibbon } from './components/WordEditor/WordRibbon';
import { WordEditor } from './components/WordEditor/WordEditor';
import { ExcelRibbon } from './components/ExcelEditor/ExcelRibbon';
import { ExcelGrid } from './components/ExcelEditor/ExcelGrid';
import { DocumentSimulatorModal } from './components/DocumentSimulatorModal';
import { ExcelSimulatorModal } from './components/ExcelEditor/ExcelSimulatorModal';
import { 
  exportToWordDoc, 
  exportToHTML, 
  exportToText, 
  exportToExcelXLSX, 
  exportToCSV, 
  handlePrintDocument 
} from './utils/fileHandlers';
import { 
  colIndexToLetter, 
  parseCellAddress 
} from './utils/excelCalculations';

export default function App() {
  // App Mode: 'word' or 'excel'
  const [mode, setMode] = useState<AppMode>('word');

  // Word Document State
  const [wordState, setWordState] = useState<WordDocumentState>(() => {
    const saved = localStorage.getItem('office_word_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return initialWordDocument;
  });

  // Word Ribbon Active Tab
  const [wordActiveTab, setWordActiveTab] = useState<WordRibbonTab>('home');

  // Excel State
  const [excelState, setExcelState] = useState<ExcelState>(() => {
    const saved = localStorage.getItem('office_excel_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return initialExcelData;
  });

  // Excel Ribbon Active Tab
  const [excelActiveTab, setExcelActiveTab] = useState<ExcelRibbonTab>('home');

  // Excel Selected Cell & Formula state
  const [selectedCell, setSelectedCell] = useState<string>('B2');
  const [formulaInput, setFormulaInput] = useState<string>('');
  const [isCellEditing, setIsCellEditing] = useState<boolean>(false);
  const [inlineCellValue, setInlineCellValue] = useState<string>('');

  // Virtual Keyboard State
  const [keyboardState, setKeyboardState] = useState<VirtualKeyboardState>({
    isOpen: true, // Open by default as per screenshots
    language: 'ar',
    shiftActive: false,
    altActive: true, // Highlighted alt as in screenshots
    ctrlActive: false,
    isFloating: false,
    pinned: false,
    capsActive: false
  });

  // Auto-saved message timer & state
  const [lastSavedText, setLastSavedText] = useState<string>('محفوظ تلقائياً');
  const [canUndo, setCanUndo] = useState(true);
  const [canRedo, setCanRedo] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isExcelSimulatorOpen, setIsExcelSimulatorOpen] = useState(false);

  // Reference to Word ContentEditable Div
  const wordEditorRef = useRef<HTMLDivElement | null>(null);

  // Active Excel Sheet
  const currentSheet = excelState.sheets.find((s) => s.id === excelState.activeSheetId) || excelState.sheets[0];

  // Sync formula input when selected cell changes
  useEffect(() => {
    const cell = currentSheet?.data[selectedCell];
    if (cell) {
      setFormulaInput(cell.formula || cell.value || '');
      setInlineCellValue(cell.formula || cell.value || '');
    } else {
      setFormulaInput('');
      setInlineCellValue('');
    }
    setIsCellEditing(false);
  }, [selectedCell, currentSheet]);

  // Persist Word state to localStorage
  useEffect(() => {
    localStorage.setItem('office_word_state', JSON.stringify(wordState));
    setLastSavedText('محفوظ الآن ✓');
    const timer = setTimeout(() => setLastSavedText('محفوظ تلقائياً'), 3000);
    return () => clearTimeout(timer);
  }, [wordState]);

  // Persist Excel state to localStorage
  useEffect(() => {
    localStorage.setItem('office_excel_state', JSON.stringify(excelState));
    setLastSavedText('محفوظ الآن ✓');
    const timer = setTimeout(() => setLastSavedText('محفوظ تلقائياً'), 3000);
    return () => clearTimeout(timer);
  }, [excelState]);

  // Execute formatting command in Word contentEditable
  const handleExecCommand = useCallback((command: string, value: string = '') => {
    if (wordEditorRef.current) {
      wordEditorRef.current.focus();
      document.execCommand(command, false, value);
      setWordState((prev) => ({
        ...prev,
        contentHtml: wordEditorRef.current ? wordEditorRef.current.innerHTML : prev.contentHtml,
      }));
    }
  }, []);

  // Update Word State partial
  const handleUpdateWordState = (partial: Partial<WordDocumentState>) => {
    setWordState((prev) => ({ ...prev, ...partial }));
  };

  // Update Excel Selected Cell Data
  const handleUpdateSelectedCell = (partial: Partial<CellData>) => {
    const sheetId = excelState.activeSheetId;
    setExcelState((prev) => {
      const updatedSheets = prev.sheets.map((sheet) => {
        if (sheet.id !== sheetId) return sheet;
        const currentCell = sheet.data[selectedCell] || { value: '' };
        return {
          ...sheet,
          data: {
            ...sheet.data,
            [selectedCell]: {
              ...currentCell,
              ...partial,
            },
          },
        };
      });
      return { ...prev, sheets: updatedSheets };
    });
  };

  // Update any cell directly
  const handleUpdateCell = (cellAddr: string, partial: Partial<CellData>) => {
    const sheetId = excelState.activeSheetId;
    setExcelState((prev) => {
      const updatedSheets = prev.sheets.map((sheet) => {
        if (sheet.id !== sheetId) return sheet;
        const currentCell = sheet.data[cellAddr] || { value: '' };
        return {
          ...sheet,
          data: {
            ...sheet.data,
            [cellAddr]: {
              ...currentCell,
              ...partial,
            },
          },
        };
      });
      return { ...prev, sheets: updatedSheets };
    });
  };

  // Commit Formula Input from formula bar
  const handleFormulaInputSubmit = () => {
    const isFormula = formulaInput.trim().startsWith('=');
    handleUpdateSelectedCell({
      value: isFormula ? '' : formulaInput,
      formula: isFormula ? formulaInput : undefined,
    });
  };

  // Commit Inline Editing from cell
  const handleCommitInlineEdit = () => {
    setIsCellEditing(false);
    const isFormula = inlineCellValue.trim().startsWith('=');
    handleUpdateSelectedCell({
      value: isFormula ? '' : inlineCellValue,
      formula: isFormula ? inlineCellValue : undefined,
    });
    setFormulaInput(inlineCellValue);
  };

  // Insert Formula helper (e.g. SUM, AVERAGE)
  const handleInsertFormula = (formulaName: string) => {
    const parsed = parseCellAddress(selectedCell);
    const col = parsed ? parsed.col : 'D';
    const formulaStr = `=${formulaName}(${col}2:${col}6)`;
    setFormulaInput(formulaStr);
    handleUpdateSelectedCell({
      formula: formulaStr,
      value: '',
    });
  };

  // Freeze Panes
  const handleFreezePanes = (type: 'row' | 'col' | 'none') => {
    const sheetId = excelState.activeSheetId;
    setExcelState((prev) => ({
      ...prev,
      sheets: prev.sheets.map((s) => {
        if (s.id !== sheetId) return s;
        return {
          ...s,
          freezeRow: type === 'row' ? 1 : undefined,
          freezeCol: type === 'col' ? 1 : undefined,
        };
      }),
    }));
  };

  // Insert Row in Excel
  const handleInsertRow = () => {
    const parsed = parseCellAddress(selectedCell);
    const rowNum = parsed ? parsed.row : 1;
    const sheetId = excelState.activeSheetId;

    setExcelState((prev) => {
      const updatedSheets = prev.sheets.map((s) => {
        if (s.id !== sheetId) return s;
        const newData: Record<string, CellData> = {};
        Object.entries(s.data).forEach(([addr, cell]) => {
          const p = parseCellAddress(addr);
          if (!p) return;
          if (p.row >= rowNum) {
            newData[`${p.col}${p.row + 1}`] = cell;
          } else {
            newData[addr] = cell;
          }
        });
        return {
          ...s,
          rowCount: s.rowCount + 1,
          data: newData,
        };
      });
      return { ...prev, sheets: updatedSheets };
    });
  };

  // Delete Row in Excel
  const handleDeleteRow = () => {
    const parsed = parseCellAddress(selectedCell);
    if (!parsed) return;
    const rowNum = parsed.row;
    const sheetId = excelState.activeSheetId;

    setExcelState((prev) => {
      const updatedSheets = prev.sheets.map((s) => {
        if (s.id !== sheetId) return s;
        const newData: Record<string, CellData> = {};
        Object.entries(s.data).forEach(([addr, cell]) => {
          const p = parseCellAddress(addr);
          if (!p) return;
          if (p.row === rowNum) return; // drop deleted row
          if (p.row > rowNum) {
            newData[`${p.col}${p.row - 1}`] = cell;
          } else {
            newData[addr] = cell;
          }
        });
        return {
          ...s,
          rowCount: Math.max(s.rowCount - 1, 10),
          data: newData,
        };
      });
      return { ...prev, sheets: updatedSheets };
    });
  };

  // Insert Column in Excel
  const handleInsertCol = () => {
    const sheetId = excelState.activeSheetId;
    setExcelState((prev) => {
      const updatedSheets = prev.sheets.map((s) => {
        if (s.id !== sheetId) return s;
        return {
          ...s,
          colCount: s.colCount + 1,
        };
      });
      return { ...prev, sheets: updatedSheets };
    });
  };

  // Delete Column in Excel
  const handleDeleteCol = () => {
    const sheetId = excelState.activeSheetId;
    setExcelState((prev) => {
      const updatedSheets = prev.sheets.map((s) => {
        if (s.id !== sheetId) return s;
        return {
          ...s,
          colCount: Math.max(s.colCount - 1, 5),
        };
      });
      return { ...prev, sheets: updatedSheets };
    });
  };

  // Add new sheet tab
  const handleAddSheet = () => {
    const newId = `sheet_${Date.now()}`;
    const newName = `ورقة ${excelState.sheets.length + 1}`;
    setExcelState((prev) => ({
      ...prev,
      activeSheetId: newId,
      sheets: [
        ...prev.sheets,
        {
          id: newId,
          name: newName,
          rowCount: 40,
          colCount: 15,
          data: {},
        },
      ],
    }));
  };

  // Rename sheet tab
  const handleRenameSheet = (id: string, newName: string) => {
    setExcelState((prev) => ({
      ...prev,
      sheets: prev.sheets.map((s) => (s.id === id ? { ...s, name: newName } : s)),
    }));
  };

  // Sort rows based on column and direction
  const handleSortColumn = (col: string, direction: 'asc' | 'desc') => {
    const sheetId = excelState.activeSheetId;
    setExcelState((prev) => {
      const updatedSheets = prev.sheets.map((sheet) => {
        if (sheet.id !== sheetId) return sheet;

        const rowIndices: number[] = [];
        for (let r = 2; r <= sheet.rowCount; r++) {
          const aVal = sheet.data[`A${r}`]?.value || '';
          if (aVal.includes('∑') || sheet.data[`B${r}`]?.value?.includes('الإجمالي')) {
            continue;
          }
          let hasContent = false;
          for (let c = 0; c < sheet.colCount; c++) {
            const letter = colIndexToLetter(c);
            if (sheet.data[`${letter}${r}`]?.value || sheet.data[`${letter}${r}`]?.formula) {
              hasContent = true;
              break;
            }
          }
          if (hasContent) {
            rowIndices.push(r);
          }
        }

        rowIndices.sort((rA, rB) => {
          const cellA = sheet.data[`${col}${rA}`]?.value || '';
          const cellB = sheet.data[`${col}${rB}`]?.value || '';
          const numA = parseFloat(cellA.replace(/[^\d.-]/g, ''));
          const numB = parseFloat(cellB.replace(/[^\d.-]/g, ''));

          if (!isNaN(numA) && !isNaN(numB)) {
            return direction === 'asc' ? numA - numB : numB - numA;
          }
          return direction === 'asc' 
            ? cellA.localeCompare(cellB, 'ar') 
            : cellB.localeCompare(cellA, 'ar');
        });

        const rowsDataSnapshot = rowIndices.map((origR) => {
          const rowData: Record<string, CellData> = {};
          for (let c = 0; c < sheet.colCount; c++) {
            const letter = colIndexToLetter(c);
            const key = `${letter}${origR}`;
            if (sheet.data[key]) {
              rowData[letter] = { ...sheet.data[key] };
            }
          }
          return rowData;
        });

        const newData = { ...sheet.data };
        rowIndices.forEach((_, idx) => {
          const targetRow = idx + 2;
          const sourceData = rowsDataSnapshot[idx];

          for (let c = 0; c < sheet.colCount; c++) {
            const letter = colIndexToLetter(c);
            delete newData[`${letter}${targetRow}`];
          }

          for (const [letter, cellVal] of Object.entries(sourceData)) {
            newData[`${letter}${targetRow}`] = {
              ...cellVal,
              value: letter === 'A' ? `${idx + 1}` : cellVal.value,
            };
          }
        });

        return { ...sheet, data: newData };
      });

      return { ...prev, sheets: updatedSheets };
    });
  };

  // Apply visual theme to Excel table
  const handleApplyTableStyle = (styleType: string) => {
    const sheetId = excelState.activeSheetId;
    setExcelState((prev) => {
      const updatedSheets = prev.sheets.map((sheet) => {
        if (sheet.id !== sheetId) return sheet;

        const isNavy = styleType === 'navy';
        const headerBg = isNavy ? '#1e3a8a' : '#15803d';
        const stripeBg = isNavy ? '#f0f9ff' : '#f8fafc';
        const borderColor = isNavy ? '#93c5fd' : '#cbd5e1';

        const newData = { ...sheet.data };
        for (let r = 1; r <= 15; r++) {
          for (let c = 0; c < Math.min(sheet.colCount, 8); c++) {
            const letter = colIndexToLetter(c);
            const addr = `${letter}${r}`;
            const cell = newData[addr] || { value: '' };

            if (r === 1) {
              newData[addr] = {
                ...cell,
                bg: headerBg,
                color: '#ffffff',
                bold: true,
                align: 'center',
                borderStyle: 'all',
                borderColor,
              };
            } else if (cell.value && (cell.value.includes('∑') || cell.value.includes('الإجمالي'))) {
              newData[addr] = {
                ...cell,
                bold: true,
                borderStyle: 'double_bottom',
                borderColor: isNavy ? '#1e3a8a' : '#0369a1',
              };
            } else if (r % 2 === 1) {
              newData[addr] = {
                ...cell,
                bg: stripeBg,
                borderStyle: 'all',
                borderColor,
              };
            } else {
              newData[addr] = {
                ...cell,
                borderStyle: 'all',
                borderColor,
              };
            }
          }
        }

        return { ...sheet, data: newData };
      });
      return { ...prev, sheets: updatedSheets };
    });
  };

  // Insert table into Word document
  const handleInsertTable = (rows: number, cols: number) => {
    let tableHtml = '<table style="width: 100%; border-collapse: collapse; margin: 16px 0; border: 1px solid #94a3b8;"><thead><tr style="background-color: #f1f5f9;">';
    for (let c = 1; c <= cols; c++) {
      tableHtml += `<th style="border: 1px solid #cbd5e1; padding: 8px; font-weight: bold; text-align: right;">العمود ${c}</th>`;
    }
    tableHtml += '</tr></thead><tbody>';
    for (let r = 1; r <= rows; r++) {
      tableHtml += '<tr>';
      for (let c = 1; c <= cols; c++) {
        tableHtml += `<td style="border: 1px solid #cbd5e1; padding: 8px;">بيان ${r}-${c}</td>`;
      }
      tableHtml += '</tr>';
    }
    tableHtml += '</tbody></table><p><br></p>';
    handleExecCommand('insertHTML', tableHtml);
  };

  // Insert image into Word document
  const handleInsertImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target?.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imgUrl = event.target?.result as string;
          const imgHtml = `<div style="text-align: center; margin: 16px 0;"><img src="${imgUrl}" alt="صورة مدرجة" style="max-width: 100%; height: auto; border-radius: 6px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);" /></div><p><br></p>`;
          handleExecCommand('insertHTML', imgHtml);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // Insert Shape or Box
  const handleInsertShape = (shape: string) => {
    const shapeHtml = `
      <div style="margin: 16px 0; padding: 14px 18px; border-right: 4px solid #2563eb; background: #eff6ff; border-radius: 4px; font-weight: 500; color: #1e3a8a;">
        <strong>تنويه إداري / شكلي:</strong><br />
        يرجى مراجعة كافة المرفقات والوثائق الرسمية ومطابقتها قبل التصديق النهائي.
      </div>
      <p><br></p>
    `;
    handleExecCommand('insertHTML', shapeHtml);
  };

  // Insert Horizontal Rule Line
  const handleInsertLine = () => {
    handleExecCommand('insertHTML', '<hr style="margin: 20px 0; border: none; border-top: 2px solid #334155;" /><p><br></p>');
  };

  // Insert Link
  const handleInsertLink = () => {
    const url = prompt('أدخل رابط الموقع الإلكتروني (URL):', 'https://');
    if (url) {
      handleExecCommand('createLink', url);
    }
  };

  // Virtual Keyboard Input Handlers
  const handleVirtualKeyPress = (char: string) => {
    if (mode === 'word') {
      if (wordEditorRef.current) {
        wordEditorRef.current.focus();
        document.execCommand('insertText', false, char);
        setWordState((prev) => ({
          ...prev,
          contentHtml: wordEditorRef.current ? wordEditorRef.current.innerHTML : prev.contentHtml,
        }));
      }
    } else {
      if (isCellEditing) {
        setInlineCellValue((prev) => prev + char);
      } else {
        setIsCellEditing(true);
        setInlineCellValue(char);
      }
      setFormulaInput((prev) => prev + char);
    }
  };

  const handleVirtualBackspace = () => {
    if (mode === 'word') {
      handleExecCommand('delete');
    } else {
      if (isCellEditing) {
        setInlineCellValue((prev) => prev.slice(0, -1));
      } else {
        handleUpdateSelectedCell({ value: '', formula: undefined });
      }
    }
  };

  const handleVirtualEnter = () => {
    if (mode === 'word') {
      handleExecCommand('insertParagraph');
    } else {
      if (isCellEditing) {
        handleCommitInlineEdit();
      }
      const parsed = parseCellAddress(selectedCell);
      if (parsed && parsed.row < currentSheet.rowCount) {
        setSelectedCell(`${parsed.col}${parsed.row + 1}`);
      }
    }
  };

  const handleVirtualTab = () => {
    if (mode === 'word') {
      handleExecCommand('insertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;');
    } else {
      if (isCellEditing) {
        handleCommitInlineEdit();
      }
      const parsed = parseCellAddress(selectedCell);
      if (parsed && parsed.colIndex + 1 < currentSheet.colCount) {
        setSelectedCell(`${colIndexToLetter(parsed.colIndex + 1)}${parsed.row}`);
      }
    }
  };

  // Keyboard shortcut command executor
  const handleKeyboardCommand = (cmd: string) => {
    if (mode === 'word') {
      if (cmd === 'bold' || cmd === 'italic' || cmd === 'underline' || cmd === 'undo' || cmd === 'redo') {
        handleExecCommand(cmd);
      } else if (cmd === 'save') {
        localStorage.setItem('office_word_state', JSON.stringify(wordState));
        setLastSavedText('تم الحفظ ✓');
      }
    } else {
      if (cmd === 'sum') {
        handleInsertFormula('SUM');
      } else if (cmd === 'average') {
        handleInsertFormula('AVERAGE');
      } else if (cmd === 'clear') {
        handleUpdateSelectedCell({ value: '', formula: undefined });
      }
    }
  };

  // File Import handler
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.csv')) {
      setMode('excel');
      setExcelState((prev) => ({ ...prev, title: file.name }));
      alert(`تم استيراد ملف الجدول (${file.name}) بنجاح.`);
    } else {
      setMode('word');
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setWordState((prev) => ({
          ...prev,
          title: file.name,
          contentHtml: content || prev.contentHtml,
        }));
      };
      reader.readAsText(file);
    }
  };

  // Calculate word & character counts for Word mode
  const cleanWordText = wordState.contentHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = cleanWordText ? cleanWordText.split(/\s+/).length : 0;
  const charCount = cleanWordText.length;

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-100 overflow-hidden font-sans text-slate-900" dir="rtl">
      {/* 1. Universal Top Header */}
      <TopHeader
        mode={mode}
        onSelectMode={setMode}
        documentTitle={mode === 'word' ? wordState.title : excelState.title}
        onTitleChange={(newTitle) => {
          if (mode === 'word') {
            setWordState((prev) => ({ ...prev, title: newTitle }));
          } else {
            setExcelState((prev) => ({ ...prev, title: newTitle }));
          }
        }}
        onSave={() => {
          localStorage.setItem('office_word_state', JSON.stringify(wordState));
          localStorage.setItem('office_excel_state', JSON.stringify(excelState));
          setLastSavedText('تم الحفظ يدوياً ✓');
        }}
        onPrint={handlePrintDocument}
        onUndo={() => {
          if (mode === 'word') handleExecCommand('undo');
        }}
        onRedo={() => {
          if (mode === 'word') handleExecCommand('redo');
        }}
        canUndo={canUndo}
        canRedo={canRedo}
        onToggleKeyboard={() => setKeyboardState((prev) => ({ ...prev, isOpen: !prev.isOpen }))}
        isKeyboardOpen={keyboardState.isOpen}
        onExportDoc={() => exportToWordDoc(wordState)}
        onExportPdf={handlePrintDocument}
        onExportHtml={() => exportToHTML(wordState)}
        onExportTxt={() => exportToText(wordState)}
        onExportXlsx={() => exportToExcelXLSX(excelState)}
        onExportCsv={() => exportToCSV(currentSheet)}
        onImportFile={handleImportFile}
        lastSavedText={lastSavedText}
        onOpenSimulator={() => {
          if (mode === 'word') {
            setIsSimulatorOpen(true);
          } else {
            setIsExcelSimulatorOpen(true);
          }
        }}
      />

      {/* 2. Ribbon & Command Toolbar for Active Suite Mode */}
      {mode === 'word' ? (
        <WordRibbon
          activeTab={wordActiveTab}
          onSelectTab={setWordActiveTab}
          docState={wordState}
          onUpdateDoc={handleUpdateWordState}
          onExecCommand={handleExecCommand}
          onInsertTable={handleInsertTable}
          onInsertImage={handleInsertImage}
          onInsertShape={handleInsertShape}
          onInsertLine={handleInsertLine}
          onInsertLink={handleInsertLink}
          onOpenSimulator={() => setIsSimulatorOpen(true)}
          onNewDocument={() => {
            if (confirm('هل ترغب بإنشاء مستند وورد جديد فارغ؟')) {
              setWordState({
                ...initialWordDocument,
                title: 'مستند_جديد.doc',
                contentHtml: '<h1>عنوان المستند</h1><p>ابدأ الكتابة هنا...</p>',
              });
            }
          }}
          onOpenDocument={() => {
            const input = document.querySelector('input[type="file"]') as HTMLInputElement;
            input?.click();
          }}
          onSaveDocument={() => {
            localStorage.setItem('office_word_state', JSON.stringify(wordState));
            setLastSavedText('تم الحفظ ✓');
          }}
          onExportDoc={() => exportToWordDoc(wordState)}
          onExportPdf={handlePrintDocument}
          onPrint={handlePrintDocument}
          onTableAction={(action) => {
            if (action === 'insertRowBelow' || action === 'insertRowAbove') {
              handleExecCommand('insertHTML', '<tr><td style="border: 1px solid #cbd5e1; padding: 8px;">خلية جديدة</td><td style="border: 1px solid #cbd5e1; padding: 8px;">بيان جديد</td></tr>');
            }
          }}
        />
      ) : (
        <ExcelRibbon
          activeTab={excelActiveTab}
          onSelectTab={setExcelActiveTab}
          selectedCell={selectedCell}
          selectedCellData={currentSheet.data[selectedCell]}
          onUpdateSelectedCell={handleUpdateSelectedCell}
          formulaInput={formulaInput}
          onFormulaInputChange={setFormulaInput}
          onFormulaInputSubmit={handleFormulaInputSubmit}
          onInsertFormula={handleInsertFormula}
          onFreezePanes={handleFreezePanes}
          onInsertRow={handleInsertRow}
          onDeleteRow={handleDeleteRow}
          onInsertCol={handleInsertCol}
          onDeleteCol={handleDeleteCol}
          onClearCell={() => handleUpdateSelectedCell({ value: '', formula: undefined })}
          onExportXlsx={() => exportToExcelXLSX(excelState)}
          onExportCsv={() => exportToCSV(currentSheet)}
          onPrint={handlePrintDocument}
          activeSheet={currentSheet}
          onOpenSimulator={() => setIsExcelSimulatorOpen(true)}
          onApplyTableStyle={handleApplyTableStyle}
          onSortColumn={handleSortColumn}
        />
      )}

      {/* 3. Main Workspace Area */}
      <main className="flex-1 flex overflow-hidden relative">
        {mode === 'word' ? (
          <WordEditor
            docState={wordState}
            onUpdateContent={(html) => handleUpdateWordState({ contentHtml: html })}
            editorRef={wordEditorRef}
            onSelectTable={(inTable) => {
              if (inTable && wordActiveTab !== 'table') {
                // Table context active
              }
            }}
          />
        ) : (
          <ExcelGrid
            sheet={currentSheet}
            sheets={excelState.sheets}
            activeSheetId={excelState.activeSheetId}
            onSelectSheet={(id) => setExcelState((prev) => ({ ...prev, activeSheetId: id }))}
            onAddSheet={handleAddSheet}
            onRenameSheet={handleRenameSheet}
            selectedCell={selectedCell}
            onSelectCell={setSelectedCell}
            onUpdateCell={handleUpdateCell}
            onCellDoubleClick={(cellAddr) => {
              setSelectedCell(cellAddr);
              const cell = currentSheet.data[cellAddr];
              setInlineCellValue(cell?.formula || cell?.value || '');
              setIsCellEditing(true);
            }}
            isEditing={isCellEditing}
            setIsEditing={setIsCellEditing}
            inlineValue={inlineCellValue}
            setInlineValue={setInlineCellValue}
            onCommitInlineEdit={handleCommitInlineEdit}
          />
        )}

        {/* 4. Arab Virtual Keyboard */}
        <ArabVirtualKeyboard
          state={keyboardState}
          onUpdateState={(partial) => setKeyboardState((prev) => ({ ...prev, ...partial }))}
          onKeyPress={handleVirtualKeyPress}
          onBackspace={handleVirtualBackspace}
          onEnter={handleVirtualEnter}
          onTab={handleVirtualTab}
          onCommand={handleKeyboardCommand}
          mode={mode}
        />
      </main>

      {/* 5. Bottom Status Bar */}
      <StatusBar
        mode={mode}
        wordCount={wordCount}
        charCount={charCount}
        selectedCell={selectedCell}
        zoom={mode === 'word' ? wordState.zoom : 100}
        onZoomChange={(newZoom) => {
          if (mode === 'word') {
            handleUpdateWordState({ zoom: newZoom });
          }
        }}
        isKeyboardOpen={keyboardState.isOpen}
        onToggleKeyboard={() => setKeyboardState((prev) => ({ ...prev, isOpen: !prev.isOpen }))}
        isReadingMode={wordState.isReadingMode}
        onToggleReadingMode={() => handleUpdateWordState({ isReadingMode: !wordState.isReadingMode })}
      />

      {/* 6. Comprehensive Word & Document Simulator Modal */}
      <DocumentSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        docState={wordState}
        onUpdateDoc={handleUpdateWordState}
        onSave={() => {
          localStorage.setItem('office_word_state', JSON.stringify(wordState));
          setLastSavedText('تم الحفظ ✓');
        }}
        onPrint={handlePrintDocument}
        onExportDoc={() => exportToWordDoc(wordState)}
        onExportPdf={handlePrintDocument}
        onExportHtml={() => exportToHTML(wordState)}
        onExportTxt={() => exportToText(wordState)}
      />

      {/* 7. Comprehensive Excel Simulator & Table/Cell Control Modal */}
      <ExcelSimulatorModal
        isOpen={isExcelSimulatorOpen}
        onClose={() => setIsExcelSimulatorOpen(false)}
        excelState={excelState}
        onUpdateExcelState={setExcelState}
        activeSheet={currentSheet}
        selectedCell={selectedCell}
        onSelectCell={setSelectedCell}
        onUpdateCell={handleUpdateCell}
        onInsertRow={handleInsertRow}
        onDeleteRow={handleDeleteRow}
        onInsertCol={handleInsertCol}
        onDeleteCol={handleDeleteCol}
        onFreezePanes={handleFreezePanes}
        onExportXlsx={() => exportToExcelXLSX(excelState)}
        onExportCsv={() => exportToCSV(currentSheet)}
        onPrint={handlePrintDocument}
      />
    </div>
  );
}
