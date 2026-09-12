import React, { useEffect, useRef, useState } from 'react';
import { WordDocumentState } from '../../types';
import { 
  Plus, 
  Trash2, 
  Columns, 
  Rows, 
  Palette, 
  Edit2, 
  Check, 
  Maximize2, 
  Minimize2, 
  AlignRight, 
  AlignCenter, 
  AlignLeft,
  X
} from 'lucide-react';

interface WordEditorProps {
  docState: WordDocumentState;
  onUpdateContent: (html: string) => void;
  editorRef: React.RefObject<HTMLDivElement | null>;
  onSelectTable?: (inTable: boolean) => void;
  onUpdateDoc?: (partial: Partial<WordDocumentState>) => void;
}

export const WordEditor: React.FC<WordEditorProps> = ({
  docState,
  onUpdateContent,
  editorRef,
  onSelectTable,
  onUpdateDoc
}) => {
  const isUpdatingFromState = useRef(false);

  // In-place Header and Footer Editing
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [headerInput, setHeaderInput] = useState(docState.headerText);
  const [isEditingFooter, setIsEditingFooter] = useState(false);
  const [footerInput, setFooterInput] = useState(docState.footerText);

  // Table Floating Controls
  const [activeTableNode, setActiveTableNode] = useState<HTMLTableElement | null>(null);
  const [activeCellNode, setActiveCellNode] = useState<HTMLTableCellElement | null>(null);
  const [showTableColorMenu, setShowTableColorMenu] = useState(false);

  // Image Floating Controls
  const [activeImageNode, setActiveImageNode] = useState<HTMLImageElement | null>(null);

  // Sync initial content once or when contentHtml changes externally
  useEffect(() => {
    if (editorRef.current && !isUpdatingFromState.current) {
      if (editorRef.current.innerHTML !== docState.contentHtml) {
        editorRef.current.innerHTML = docState.contentHtml;
      }
    }
  }, [docState.contentHtml]);

  useEffect(() => {
    setHeaderInput(docState.headerText);
  }, [docState.headerText]);

  useEffect(() => {
    setFooterInput(docState.footerText);
  }, [docState.footerText]);

  const handleInput = () => {
    if (editorRef.current) {
      isUpdatingFromState.current = true;
      onUpdateContent(editorRef.current.innerHTML);
      setTimeout(() => {
        isUpdatingFromState.current = false;
      }, 50);
    }
  };

  const handleSelectionOrClick = (e?: React.SyntheticEvent) => {
    const target = e?.target as HTMLElement | null;
    
    // Check if clicked an image
    if (target && target.tagName === 'IMG') {
      setActiveImageNode(target as HTMLImageElement);
    } else if (activeImageNode && target && !target.closest('.image-floating-toolbar')) {
      setActiveImageNode(null);
    }

    const selection = window.getSelection();
    if (!selection || !selection.anchorNode) return;
    
    // Check if selection is within a table
    let node: Node | null = selection.anchorNode;
    let foundTable: HTMLTableElement | null = null;
    let foundCell: HTMLTableCellElement | null = null;

    while (node && node !== editorRef.current) {
      if (node.nodeName === 'TD' || node.nodeName === 'TH') {
        foundCell = node as HTMLTableCellElement;
      }
      if (node.nodeName === 'TABLE') {
        foundTable = node as HTMLTableElement;
        break;
      }
      node = node.parentNode;
    }

    setActiveTableNode(foundTable);
    setActiveCellNode(foundCell);

    if (onSelectTable) {
      onSelectTable(Boolean(foundTable));
    }
  };

  // Header and Footer Submit
  const handleSaveHeader = () => {
    if (onUpdateDoc) {
      onUpdateDoc({ headerText: headerInput });
    }
    setIsEditingHeader(false);
  };

  const handleSaveFooter = () => {
    if (onUpdateDoc) {
      onUpdateDoc({ footerText: footerInput });
    }
    setIsEditingFooter(false);
  };

  // Table Manipulation Functions
  const handleAddRow = (position: 'above' | 'below') => {
    if (!activeTableNode || !activeCellNode) return;
    const currentRow = activeCellNode.parentElement as HTMLTableRowElement | null;
    if (!currentRow) return;

    const colCount = currentRow.cells.length;
    const newRow = document.createElement('tr');
    for (let i = 0; i < colCount; i++) {
      const td = document.createElement('td');
      td.style.border = '1px solid #cbd5e1';
      td.style.padding = '8px';
      td.innerHTML = 'خلية جديدة';
      newRow.appendChild(td);
    }

    if (position === 'above') {
      currentRow.parentNode?.insertBefore(newRow, currentRow);
    } else {
      currentRow.parentNode?.insertBefore(newRow, currentRow.nextSibling);
    }
    handleInput();
  };

  const handleDeleteRow = () => {
    if (!activeTableNode || !activeCellNode) return;
    const currentRow = activeCellNode.parentElement as HTMLTableRowElement | null;
    if (!currentRow) return;
    currentRow.remove();
    handleInput();
    setActiveCellNode(null);
  };

  const handleAddColumn = (position: 'left' | 'right') => {
    if (!activeTableNode || !activeCellNode) return;
    const colIndex = activeCellNode.cellIndex;
    const rows = activeTableNode.rows;

    for (let i = 0; i < rows.length; i++) {
      const cell = rows[i].cells[colIndex];
      const newCell = rows[i].insertCell(position === 'left' ? colIndex : colIndex + 1);
      newCell.style.border = '1px solid #cbd5e1';
      newCell.style.padding = '8px';
      newCell.innerHTML = i === 0 ? 'عمود جديد' : 'بيان جديد';
      if (i === 0) newCell.style.fontWeight = 'bold';
    }
    handleInput();
  };

  const handleDeleteColumn = () => {
    if (!activeTableNode || !activeCellNode) return;
    const colIndex = activeCellNode.cellIndex;
    const rows = activeTableNode.rows;

    for (let i = 0; i < rows.length; i++) {
      if (rows[i].cells.length > colIndex) {
        rows[i].deleteCell(colIndex);
      }
    }
    handleInput();
    setActiveCellNode(null);
  };

  const handleSetCellBg = (color: string) => {
    if (activeCellNode) {
      activeCellNode.style.backgroundColor = color;
      handleInput();
      setShowTableColorMenu(false);
    }
  };

  const handleDeleteTable = () => {
    if (activeTableNode) {
      activeTableNode.remove();
      handleInput();
      setActiveTableNode(null);
      setActiveCellNode(null);
      if (onSelectTable) onSelectTable(false);
    }
  };

  // Image manipulation
  const handleResizeImage = (widthPercent: string) => {
    if (activeImageNode) {
      activeImageNode.style.width = widthPercent;
      activeImageNode.style.maxWidth = '100%';
      handleInput();
    }
  };

  const handleAlignImage = (alignment: 'right' | 'center' | 'left') => {
    if (activeImageNode) {
      const parent = activeImageNode.parentElement;
      if (parent) {
        parent.style.textAlign = alignment;
      }
      handleInput();
    }
  };

  const handleDeleteImage = () => {
    if (activeImageNode) {
      const parent = activeImageNode.parentElement;
      activeImageNode.remove();
      if (parent && parent.childNodes.length === 0) parent.remove();
      handleInput();
      setActiveImageNode(null);
    }
  };

  // Centimeter tick marks for horizontal ruler (21 cm for A4)
  const cmTicks = Array.from({ length: 22 }, (_, i) => i);

  // Margin styles based on docState.margins
  const getMarginClass = () => {
    switch (docState.margins) {
      case 'narrow':
        return 'p-6'; // 1.27 cm
      case 'wide':
        return 'p-14'; // 3.8 cm
      default:
        return 'p-10'; // 2.5 cm normal
    }
  };

  // Dynamic Page Border Styling
  const getBorderInlineStyles = () => {
    if (!docState.showBorders || docState.borderStyle === 'none') {
      return {};
    }

    const color = docState.borderColor || '#1e3a8a';
    const width = docState.borderWidth || 3;

    switch (docState.borderStyle) {
      case 'double':
        return {
          border: `${Math.max(width, 3)}px double ${color}`,
        };
      case 'gold':
        return {
          border: `${Math.max(width, 4)}px solid #b45309`,
          outline: '2px solid #fde047',
          outlineOffset: '-6px',
        };
      case 'islamic':
        return {
          border: `${Math.max(width, 3)}px solid #065f46`,
          outline: '2px dashed #10b981',
          outlineOffset: '-7px',
        };
      case 'classic':
        return {
          border: `${Math.max(width, 3)}px solid #334155`,
        };
      case 'single':
      default:
        return {
          border: `${Math.max(width, 1)}px solid ${color}`,
        };
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-200/80 relative" dir="rtl">
      {/* Horizontal Ruler (المسطرة) */}
      {docState.showRuler && (
        <div className="bg-slate-100 border-b border-slate-300 h-6 flex items-end justify-center select-none shadow-2xs overflow-hidden no-print">
          <div 
            className="flex items-end h-full text-[9px] font-mono text-slate-500 border-x border-slate-300 relative bg-white"
            style={{ width: docState.orientation === 'portrait' ? '794px' : '1123px' }}
          >
            {/* Margin Guides */}
            <div className="absolute top-0 bottom-0 left-0 w-8 bg-slate-200/60 border-r border-slate-400/50" />
            <div className="absolute top-0 bottom-0 right-0 w-8 bg-slate-200/60 border-l border-slate-400/50" />

            <div className="flex-1 flex justify-between px-2">
              {cmTicks.map((cm) => (
                <div key={cm} className="flex flex-col items-center">
                  <span className="leading-none text-[8px]">{cm}</span>
                  <div className={`w-px bg-slate-400 ${cm % 5 === 0 ? 'h-3' : 'h-1.5'}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Table Tools Bar (عند تحديد جدول) */}
      {activeTableNode && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md rounded-xl border border-slate-300 shadow-2xl px-3 py-1.5 z-40 flex items-center gap-1 text-xs no-print animate-in fade-in slide-in-from-top-2">
          <span className="font-bold text-blue-700 ml-1">أدوات الجدول:</span>
          
          <button
            onClick={() => handleAddRow('above')}
            className="flex items-center gap-0.5 px-2 py-1 bg-slate-100 hover:bg-blue-100 text-slate-700 rounded transition"
            title="إدراج صف لأعلى"
          >
            <Plus className="w-3 h-3 text-blue-600" />
            <span>صف ↑</span>
          </button>

          <button
            onClick={() => handleAddRow('below')}
            className="flex items-center gap-0.5 px-2 py-1 bg-slate-100 hover:bg-blue-100 text-slate-700 rounded transition"
            title="إدراج صف لأسفل"
          >
            <Plus className="w-3 h-3 text-blue-600" />
            <span>صف ↓</span>
          </button>

          <button
            onClick={() => handleAddColumn('right')}
            className="flex items-center gap-0.5 px-2 py-1 bg-slate-100 hover:bg-blue-100 text-slate-700 rounded transition"
            title="إدراج عمود لليمين"
          >
            <Columns className="w-3 h-3 text-emerald-600" />
            <span>عمود ⇦</span>
          </button>

          <button
            onClick={() => handleAddColumn('left')}
            className="flex items-center gap-0.5 px-2 py-1 bg-slate-100 hover:bg-blue-100 text-slate-700 rounded transition"
            title="إدراج عمود لليسار"
          >
            <Columns className="w-3 h-3 text-emerald-600" />
            <span>عمود ⇨</span>
          </button>

          <div className="w-px h-4 bg-slate-300 mx-0.5" />

          {/* Cell Color */}
          <div className="relative">
            <button
              onClick={() => setShowTableColorMenu(!showTableColorMenu)}
              className="flex items-center gap-0.5 px-2 py-1 bg-slate-100 hover:bg-amber-100 text-slate-700 rounded transition"
              title="تلوين الخلية الحالية"
            >
              <Palette className="w-3 h-3 text-amber-600" />
              <span>لون الخلية</span>
            </button>

            {showTableColorMenu && (
              <div className="absolute top-8 right-0 bg-white p-2 rounded-lg shadow-xl border border-slate-200 z-50 flex gap-1 w-44 flex-wrap">
                {['#ffffff', '#f8fafc', '#f1f5f9', '#dcfce7', '#bae6fd', '#fef08a', '#fee2e2', '#f3e8ff'].map((c) => (
                  <button
                    key={c}
                    onClick={() => handleSetCellBg(c)}
                    className="w-5 h-5 rounded border border-slate-300 hover:scale-110 transition"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleDeleteRow}
            className="flex items-center gap-0.5 px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded transition"
            title="حذف الصف الحالي"
          >
            <Trash2 className="w-3 h-3" />
            <span>حذف صف</span>
          </button>

          <button
            onClick={handleDeleteColumn}
            className="flex items-center gap-0.5 px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded transition"
            title="حذف العمود الحالي"
          >
            <Trash2 className="w-3 h-3" />
            <span>حذف عمود</span>
          </button>

          <button
            onClick={handleDeleteTable}
            className="flex items-center gap-0.5 px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-bold transition mr-1"
            title="حذف الجدول كاملاً"
          >
            <X className="w-3 h-3" />
            <span>حذف الجدول</span>
          </button>
        </div>
      )}

      {/* Floating Image Tools Bar (عند تحديد صورة) */}
      {activeImageNode && (
        <div className="image-floating-toolbar absolute top-8 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md rounded-xl border border-slate-300 shadow-2xl px-3 py-1.5 z-40 flex items-center gap-1 text-xs no-print animate-in fade-in slide-in-from-top-2">
          <span className="font-bold text-emerald-700 ml-1">التحكم بالصورة:</span>
          
          <button
            onClick={() => handleResizeImage('200px')}
            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition"
          >
            صغير
          </button>
          <button
            onClick={() => handleResizeImage('400px')}
            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition"
          >
            متوسط
          </button>
          <button
            onClick={() => handleResizeImage('100%')}
            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition"
          >
            كامل (100%)
          </button>

          <div className="w-px h-4 bg-slate-300 mx-0.5" />

          <button
            onClick={() => handleAlignImage('right')}
            className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded"
            title="محاذاة يمين"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleAlignImage('center')}
            className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded"
            title="توسيط"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleAlignImage('left')}
            className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded"
            title="محاذاة يسار"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleDeleteImage}
            className="flex items-center gap-0.5 px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded transition mr-1 font-bold"
            title="حذف الصورة"
          >
            <Trash2 className="w-3 h-3" />
            <span>حذف</span>
          </button>
        </div>
      )}

      {/* Main Workspace Scrolling Area */}
      <div 
        className="flex-1 overflow-auto p-4 md:p-8 flex justify-center items-start"
        onClick={handleSelectionOrClick}
      >
        {/* Realistic A4 Page Canvas Sheet */}
        <div
          id="word-document-page"
          className={`page-sheet bg-white text-slate-900 transition-all rounded-xs relative flex flex-col justify-between shadow-xl ${getMarginClass()}`}
          style={{
            width: docState.orientation === 'portrait' ? '794px' : '1123px',
            minHeight: docState.orientation === 'portrait' ? '1123px' : '794px',
            transform: `scale(${docState.zoom / 100})`,
            transformOrigin: 'top center',
            fontFamily: docState.fontFamily,
            fontSize: `${docState.fontSize}px`,
            lineHeight: docState.lineSpacing,
            textAlign: docState.textAlign,
            direction: docState.direction,
            ...getBorderInlineStyles(),
          }}
        >
          {/* Ornamental Islamic Frame Accents if selected */}
          {docState.borderStyle === 'islamic' && (
            <>
              <div className="absolute top-1.5 right-2 text-emerald-700 text-xs font-serif select-none pointer-events-none">
                ❖ ❖
              </div>
              <div className="absolute top-1.5 left-2 text-emerald-700 text-xs font-serif select-none pointer-events-none">
                ❖ ❖
              </div>
              <div className="absolute bottom-1.5 right-2 text-emerald-700 text-xs font-serif select-none pointer-events-none">
                ❖ ❖
              </div>
              <div className="absolute bottom-1.5 left-2 text-emerald-700 text-xs font-serif select-none pointer-events-none">
                ❖ ❖
              </div>
            </>
          )}

          {/* Watermark if present */}
          {docState.watermarkText && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
              <span className="text-slate-300/40 text-7xl font-bold -rotate-45 font-serif uppercase tracking-widest">
                {docState.watermarkText}
              </span>
            </div>
          )}

          {/* Header Area (رأس الصفحة القابل للتعديل والتخصيص) */}
          <div 
            data-header-area="true"
            className={`border-b pb-2 mb-6 flex flex-col gap-1 text-xs select-none z-10 relative group transition ${
              isEditingHeader 
                ? 'border-dashed border-2 border-blue-500 bg-blue-50/50 p-2.5 rounded-lg shadow-sm' 
                : 'border-slate-200 hover:border-blue-300'
            }`}
          >
            {isEditingHeader ? (
              <div className="space-y-1.5 w-full">
                <div className="flex items-center justify-between text-[11px] font-bold text-blue-800">
                  <span>✏️ تحرير رأس الصفحة (Header):</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setHeaderInput(prev => `بسم الله الرحمن الرحيم - ${prev}`)}
                      className="text-[10px] bg-white border border-blue-200 px-1.5 py-0.5 rounded text-blue-700 hover:bg-blue-100"
                    >
                      + البسملة
                    </button>
                    <button
                      onClick={() => setHeaderInput(prev => `${prev} | التاريخ: ${new Date().toLocaleDateString('ar-EG')}`)}
                      className="text-[10px] bg-white border border-blue-200 px-1.5 py-0.5 rounded text-blue-700 hover:bg-blue-100"
                    >
                      + تاريخ اليوم
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={headerInput}
                    onChange={(e) => setHeaderInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveHeader()}
                    autoFocus
                    placeholder="اكتب رأس الصفحة هنا..."
                    className="w-full text-xs font-bold text-blue-950 bg-white border border-blue-400 rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSaveHeader}
                    className="px-3 py-1 rounded bg-blue-600 text-white font-bold hover:bg-blue-700 text-xs shrink-0 flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>حفظ</span>
                  </button>
                  <button
                    onClick={() => setIsEditingHeader(false)}
                    className="px-2 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs shrink-0"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div 
                  onClick={() => setIsEditingHeader(true)}
                  className="flex items-center gap-2 cursor-pointer hover:bg-blue-50/80 px-2 py-1 rounded transition"
                  title="انقر لتعديل رأس الصفحة"
                >
                  <span className="font-semibold text-slate-600">{docState.headerText || 'انقر لإضافة رأس الصفحة...'}</span>
                  <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded opacity-80 group-hover:opacity-100">
                    ✏️ تحرير الرأس
                  </span>
                </div>

                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] shrink-0 font-medium">
                  {docState.paperSize} | مستند رسمي
                </span>
              </div>
            )}
          </div>

          {/* Editable Document Body (جسم المستند القابل للتحرير) */}
          <div
            ref={editorRef as any}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onKeyUp={handleSelectionOrClick}
            onMouseUp={handleSelectionOrClick}
            className={`flex-1 focus:outline-none min-h-[700px] prose max-w-none z-10 ${
              docState.columns === 2 ? 'columns-2 gap-8' : docState.columns === 3 ? 'columns-3 gap-6' : ''
            }`}
            style={{
              fontFamily: docState.fontFamily,
              color: docState.textColor,
            }}
          />

          {/* Footer Area (تذييل الصفحة وترقيمها التفاعلي) */}
          <div 
            data-footer-area="true"
            className={`border-t pt-3 mt-8 flex flex-col gap-1 text-xs select-none z-10 relative group transition ${
              isEditingFooter 
                ? 'border-dashed border-2 border-blue-500 bg-blue-50/50 p-2.5 rounded-lg shadow-sm' 
                : 'border-slate-200 hover:border-blue-300'
            }`}
          >
            {isEditingFooter ? (
              <div className="space-y-1.5 w-full">
                <div className="flex items-center justify-between text-[11px] font-bold text-blue-800">
                  <span>✏️ تحرير تذييل الصفحة (Footer):</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setFooterInput(prev => `${prev} - صفحة رسمية معتمدة`)}
                      className="text-[10px] bg-white border border-blue-200 px-1.5 py-0.5 rounded text-blue-700 hover:bg-blue-100"
                    >
                      + عبارة اعتماد
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={footerInput}
                    onChange={(e) => setFooterInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveFooter()}
                    autoFocus
                    placeholder="اكتب تذييل الصفحة هنا..."
                    className="w-full text-xs text-slate-800 bg-white border border-blue-400 rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSaveFooter}
                    className="px-3 py-1 rounded bg-blue-600 text-white font-bold hover:bg-blue-700 text-xs shrink-0 flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>حفظ</span>
                  </button>
                  <button
                    onClick={() => setIsEditingFooter(false)}
                    className="px-2 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs shrink-0"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div 
                  onClick={() => setIsEditingFooter(true)}
                  className="flex items-center gap-2 cursor-pointer hover:bg-blue-50/80 px-2 py-1 rounded transition"
                  title="انقر لتعديل تذييل الصفحة"
                >
                  <span className="text-[11px] text-slate-500">{docState.footerText || 'انقر لإضافة تذييل الصفحة...'}</span>
                  <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded opacity-80 group-hover:opacity-100">
                    ✏️ تحرير التذييل
                  </span>
                </div>

                {/* Page Numbering */}
                <div className="flex items-center gap-1.5 font-bold text-slate-600 shrink-0">
                  <span>صفحة</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-blue-700 font-mono">
                    1 من 1
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
