import React, { useState } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignRight, 
  AlignCenter, 
  AlignLeft, 
  Download, 
  Printer, 
  Plus, 
  Trash2, 
  Columns, 
  Rows, 
  Sigma, 
  Percent, 
  DollarSign, 
  FileSpreadsheet, 
  ChevronDown, 
  Check, 
  Layers, 
  Palette, 
  Type, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { CellData, ExcelRibbonTab, ExcelSheet } from '../../types';

interface ExcelRibbonProps {
  activeTab: ExcelRibbonTab;
  onSelectTab: (tab: ExcelRibbonTab) => void;
  selectedCell: string;
  selectedCellData?: CellData;
  onUpdateSelectedCell: (partial: Partial<CellData>) => void;
  formulaInput: string;
  onFormulaInputChange: (val: string) => void;
  onFormulaInputSubmit: () => void;
  onInsertFormula: (formulaName: string) => void;
  onFreezePanes: (type: 'row' | 'col' | 'none') => void;
  onInsertRow: () => void;
  onDeleteRow: () => void;
  onInsertCol: () => void;
  onDeleteCol: () => void;
  onClearCell: () => void;
  onExportXlsx: () => void;
  onExportCsv: () => void;
  onPrint: () => void;
  activeSheet: ExcelSheet;
}

export const ExcelRibbon: React.FC<ExcelRibbonProps> = ({
  activeTab,
  onSelectTab,
  selectedCell,
  selectedCellData,
  onUpdateSelectedCell,
  formulaInput,
  onFormulaInputChange,
  onFormulaInputSubmit,
  onInsertFormula,
  onFreezePanes,
  onInsertRow,
  onDeleteRow,
  onInsertCol,
  onDeleteCol,
  onClearCell,
  onExportXlsx,
  onExportCsv,
  onPrint,
  activeSheet
}) => {
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const [showFormulaMenu, setShowFormulaMenu] = useState(false);
  const [showFreezeMenu, setShowFreezeMenu] = useState(false);

  const tabs: { id: ExcelRibbonTab; label: string }[] = [
    { id: 'file', label: 'ملف' },
    { id: 'home', label: 'الرئيسية' },
    { id: 'insert', label: 'إدراج' },
    { id: 'formulas', label: 'صيغ ودوال ∑' },
    { id: 'data', label: 'بيانات وجداول' },
    { id: 'view', label: 'عرض وتجميد' },
  ];

  const bgColors = [
    '#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', 
    '#15803d', '#166534', '#dcfce7', '#bbf7d0',
    '#0284c7', '#0369a1', '#e0f2fe', '#bae6fd',
    '#fef08a', '#fef9c3', '#fecaca', '#dc2626'
  ];

  const textColors = [
    '#000000', '#1e293b', '#ffffff', '#15803d', 
    '#0369a1', '#dc2626', '#d97706', '#7c3aed'
  ];

  const numberFormats: { id: CellData['format']; label: string; example: string }[] = [
    { id: 'general', label: 'عام (بلا تنسيق خاص)', example: '1234.5' },
    { id: 'currency_sar', label: 'عملة (ريال ر.س)', example: '1,234.50 ر.س' },
    { id: 'currency_usd', label: 'عملة دولار ($)', example: '$1,234.50' },
    { id: 'number', label: 'أرقام بفواصل آلاف', example: '1,234.50' },
    { id: 'percent', label: 'نسبة مئوية (%)', example: '15.0%' },
  ];

  const formulasList = [
    { name: 'SUM', label: 'مجموع (SUM)', syntax: '=SUM(D2:D6)' },
    { name: 'AVERAGE', label: 'متوسط حسابي (AVERAGE)', syntax: '=AVERAGE(D2:D6)' },
    { name: 'COUNT', label: 'عدد الخلايا (COUNT)', syntax: '=COUNT(A2:A6)' },
    { name: 'MAX', label: 'أعلى قيمة (MAX)', syntax: '=MAX(D2:D6)' },
    { name: 'MIN', label: 'أدنى قيمة (MIN)', syntax: '=MIN(D2:D6)' },
  ];

  return (
    <div className="bg-white border-b border-slate-300 select-none no-print shadow-2xs">
      {/* Ribbon Navigation Tabs - Exact 0.5cm (28px) */}
      <div className="flex items-center px-2 border-b border-slate-200 overflow-x-auto bg-slate-50 text-[11px] h-[28px] scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`px-3 h-full font-medium relative whitespace-nowrap transition-colors flex items-center gap-1 ${
                isActive
                  ? 'text-emerald-700 bg-white font-bold border-t-2 border-t-emerald-600 border-x border-slate-200 shadow-2xs -mb-px'
                  : 'text-slate-700 hover:text-emerald-600 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Ribbon Controls Area - Exact 0.5cm row (32px) */}
      <div className="px-2 py-0.5 min-h-[32px] max-h-[34px] flex items-center gap-1.5 overflow-x-auto bg-slate-50/80 text-slate-800 text-xs scrollbar-none">
        
        {/* ================= HOME / FORMAT TAB ================= */}
        {activeTab === 'home' && (
          <div className="flex items-center gap-1.5 flex-nowrap shrink-0">
            {/* Bold, Italic, Underline */}
            <div className="flex items-center bg-white border border-slate-300 rounded p-0.5 shadow-2xs gap-0.5">
              <button
                onClick={() => onUpdateSelectedCell({ bold: !selectedCellData?.bold })}
                className={`p-1 rounded font-bold transition ${
                  selectedCellData?.bold ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-slate-100 text-slate-700'
                }`}
                title="غميق"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onUpdateSelectedCell({ italic: !selectedCellData?.italic })}
                className={`p-1 rounded transition ${
                  selectedCellData?.italic ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-slate-100 text-slate-700'
                }`}
                title="مائل"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onUpdateSelectedCell({ underline: !selectedCellData?.underline })}
                className={`p-1 rounded transition ${
                  selectedCellData?.underline ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-slate-100 text-slate-700'
                }`}
                title="تسطير"
              >
                <Underline className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Colors: Background Color & Text Color */}
            <div className="flex items-center bg-white border border-slate-300 rounded p-0.5 shadow-2xs gap-1 relative">
              {/* Fill Background Color */}
              <button
                onClick={() => setShowBgColorPicker(!showBgColorPicker)}
                className="flex items-center gap-1 p-1 hover:bg-slate-100 rounded text-slate-700"
                title="لون تعبئة الخلية"
              >
                <Palette className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[11px] font-semibold">لون الخلفية</span>
                <span 
                  className="w-3 h-3 rounded border border-slate-400" 
                  style={{ backgroundColor: selectedCellData?.bg || '#ffffff' }} 
                />
              </button>

              {/* Text Color */}
              <button
                onClick={() => setShowTextColorPicker(!showTextColorPicker)}
                className="flex items-center gap-1 p-1 hover:bg-slate-100 rounded text-slate-700"
                title="لون النص"
              >
                <Type className="w-3.5 h-3.5 text-slate-700" />
                <span className="text-[11px] font-semibold">لون النص</span>
                <span 
                  className="w-3 h-3 rounded border border-slate-400" 
                  style={{ backgroundColor: selectedCellData?.color || '#000000' }} 
                />
              </button>

              {/* BG Color Dropdown */}
              {showBgColorPicker && (
                <div className="absolute top-9 right-0 bg-white p-2 rounded-lg shadow-xl border border-slate-200 z-50 grid grid-cols-4 gap-1.5 w-44">
                  {bgColors.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        onUpdateSelectedCell({ bg: c });
                        setShowBgColorPicker(false);
                      }}
                      className="w-8 h-8 rounded border border-slate-300 hover:scale-105 transition"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              )}

              {/* Text Color Dropdown */}
              {showTextColorPicker && (
                <div className="absolute top-9 right-20 bg-white p-2 rounded-lg shadow-xl border border-slate-200 z-50 grid grid-cols-4 gap-1.5 w-44">
                  {textColors.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        onUpdateSelectedCell({ color: c });
                        setShowTextColorPicker(false);
                      }}
                      className="w-8 h-8 rounded border border-slate-300 hover:scale-105 transition"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="w-px h-6 bg-slate-300 mx-0.5" />

            {/* Alignment */}
            <div className="flex items-center bg-white border border-slate-300 rounded p-0.5 shadow-2xs gap-0.5">
              <button
                onClick={() => onUpdateSelectedCell({ align: 'right' })}
                className={`p-1 rounded ${selectedCellData?.align === 'right' ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-slate-100 text-slate-700'}`}
                title="محاذاة يمين"
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onUpdateSelectedCell({ align: 'center' })}
                className={`p-1 rounded ${selectedCellData?.align === 'center' ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-slate-100 text-slate-700'}`}
                title="توسيط"
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onUpdateSelectedCell({ align: 'left' })}
                className={`p-1 rounded ${selectedCellData?.align === 'left' ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-slate-100 text-slate-700'}`}
                title="محاذاة يسار"
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Wrap Text & Borders */}
            <button
              onClick={() => onUpdateSelectedCell({ wrapText: !selectedCellData?.wrapText })}
              className={`px-2 py-1 rounded text-xs font-semibold border shadow-2xs ${
                selectedCellData?.wrapText ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
              title="التفاف النص داخل الخلية"
            >
              التفاف النص
            </button>

            {/* Number Formatting Menu */}
            <div className="relative">
              <button
                onClick={() => setShowFormatMenu(!showFormatMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-xs font-semibold shadow-2xs"
              >
                <span>تنسيق الأرقام: {numberFormats.find(f => f.id === selectedCellData?.format)?.label || 'عام'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showFormatMenu && (
                <div className="absolute top-9 right-0 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 w-52">
                  {numberFormats.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        onUpdateSelectedCell({ format: f.id });
                        setShowFormatMenu(false);
                      }}
                      className="w-full text-right px-3 py-1.5 hover:bg-emerald-50 text-xs flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-slate-800">{f.label}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{f.example}</div>
                      </div>
                      {selectedCellData?.format === f.id && <Check className="w-3 h-3 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="w-px h-6 bg-slate-300 mx-0.5" />

            {/* Insert / Delete Rows & Cols */}
            <div className="flex items-center gap-1">
              <button
                onClick={onInsertRow}
                className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-xs font-medium shadow-2xs"
                title="إدراج صف جديد"
              >
                <Plus className="w-3 h-3 text-emerald-600" />
                <span>+ صف</span>
              </button>
              <button
                onClick={onDeleteRow}
                className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 rounded text-xs font-medium shadow-2xs"
                title="حذف الصف الحالي"
              >
                <Trash2 className="w-3 h-3" />
                <span>حذف صف</span>
              </button>
              <button
                onClick={onInsertCol}
                className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-xs font-medium shadow-2xs"
                title="إدراج عمود جديد"
              >
                <Plus className="w-3 h-3 text-blue-600" />
                <span>+ عمود</span>
              </button>
              <button
                onClick={onDeleteCol}
                className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 rounded text-xs font-medium shadow-2xs"
                title="حذف العمود الحالي"
              >
                <Trash2 className="w-3 h-3" />
                <span>حذف عمود</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= FORMULAS TAB ================= */}
        {activeTab === 'formulas' && (
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <button
                onClick={() => setShowFormulaMenu(!showFormulaMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold shadow-2xs transition"
              >
                <Sigma className="w-4 h-4" />
                <span>إدراج دالة رياضية ∑</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {showFormulaMenu && (
                <div className="absolute top-9 right-0 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 w-60">
                  {formulasList.map((form) => (
                    <button
                      key={form.name}
                      onClick={() => {
                        onInsertFormula(form.name);
                        setShowFormulaMenu(false);
                      }}
                      className="w-full text-right px-3 py-2 hover:bg-emerald-50 text-xs border-b border-slate-100 last:border-0"
                    >
                      <div className="font-bold text-slate-800">{form.label}</div>
                      <div className="text-[10px] text-emerald-700 font-mono mt-0.5">{form.syntax}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Direct Formula Quick Buttons */}
            {formulasList.map((f) => (
              <button
                key={f.name}
                onClick={() => onInsertFormula(f.name)}
                className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-slate-300 rounded text-xs font-bold text-slate-700 shadow-2xs"
              >
                {f.name}
              </button>
            ))}
          </div>
        )}

        {/* ================= FILE TAB ================= */}
        {activeTab === 'file' && (
          <div className="flex items-center gap-2">
            <button
              onClick={onExportXlsx}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold shadow-2xs transition"
            >
              <Download className="w-4 h-4" />
              <span>تصدير مصنف إكسل (.xlsx)</span>
            </button>

            <button
              onClick={onExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-teal-50 border border-slate-300 rounded text-xs font-bold text-teal-700 shadow-2xs transition"
            >
              <Download className="w-4 h-4" />
              <span>تصدير ملف جدول (.csv)</span>
            </button>

            <button
              onClick={onPrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-xs font-bold text-slate-700 shadow-2xs transition"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>معاينة الطباعة / PDF</span>
            </button>
          </div>
        )}

        {/* ================= INSERT TAB (إدراج أشكال وأختام في إكسل) ================= */}
        {activeTab === 'insert' && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-slate-500">إدراج في الخلية النشطة ({selectedCell}):</span>

            <button
              onClick={() => onUpdateSelectedCell({ value: '✓ معتمد رسمياً', bold: true, bg: '#dcfce7', color: '#166534' })}
              className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-xs font-bold shadow-2xs transition"
            >
              <span>✓ ختم معتمد</span>
            </button>

            <button
              onClick={() => onUpdateSelectedCell({ value: '⚖ مصادق عليه قضائياً', bold: true, bg: '#dbeafe', color: '#1e40af' })}
              className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 rounded text-xs font-bold shadow-2xs transition"
            >
              <span>⚖ مصادقة قضائية</span>
            </button>

            <button
              onClick={() => onUpdateSelectedCell({ value: '★ مسدد بالكامل', bold: true, bg: '#fef3c7', color: '#92400e' })}
              className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded text-xs font-bold shadow-2xs transition"
            >
              <span>★ مسدد بالكامل</span>
            </button>

            <button
              onClick={() => onUpdateSelectedCell({ value: '⚠ قيد المراجعة', bold: true, bg: '#fee2e2', color: '#991b1b' })}
              className="flex items-center gap-1 px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 rounded text-xs font-bold shadow-2xs transition"
            >
              <span>⚠ قيد المراجعة</span>
            </button>

            <div className="w-px h-6 bg-slate-300 mx-1" />

            <button
              onClick={() => {
                const note = prompt('أدخل نص الملاحظة أو التنبيه في الخلية:', 'ملاحظة تدقيق');
                if (note) onUpdateSelectedCell({ value: `[ملاحظة: ${note}]`, italic: true, color: '#475569' });
              }}
              className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-semibold shadow-2xs"
            >
              <span>+ إدراج ملاحظة شكلية</span>
            </button>
          </div>
        )}

        {/* ================= VIEW & FREEZE TAB ================= */}
        {activeTab === 'view' && (
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <button
                onClick={() => setShowFreezeMenu(!showFreezeMenu)}
                className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-xs font-semibold shadow-2xs"
              >
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>تجميد الألواح</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showFreezeMenu && (
                <div className="absolute top-9 right-0 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 w-48">
                  <button
                    onClick={() => { onFreezePanes('row'); setShowFreezeMenu(false); }}
                    className="w-full text-right px-3 py-1.5 hover:bg-blue-50 text-xs font-medium"
                  >
                    تجميد الصف العلوي
                  </button>
                  <button
                    onClick={() => { onFreezePanes('col'); setShowFreezeMenu(false); }}
                    className="w-full text-right px-3 py-1.5 hover:bg-blue-50 text-xs font-medium"
                  >
                    تجميد العمود الأول
                  </button>
                  <button
                    onClick={() => { onFreezePanes('none'); setShowFreezeMenu(false); }}
                    className="w-full text-right px-3 py-1.5 hover:bg-rose-50 text-xs font-medium text-rose-600"
                  >
                    إلغاء التجميد
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={onPrint}
              className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-xs font-semibold shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-indigo-600" />
              <span>معاينة الطباعة</span>
            </button>
          </div>
        )}

        {/* DATA TAB fallback */}
        {activeTab === 'data' && (
          <div className="flex items-center gap-2 text-slate-600 text-xs">
            <span className="font-bold">أدوات البيانات:</span>
            <span>تصفية، فرز تلقائي من أ إلى ي، وإدارة مجموعات الحقول المتقدمة.</span>
          </div>
        )}

      </div>

      {/* Formula Bar (شريط الصيغ التفاعلي) */}
      <div className="flex items-center px-3 py-1 bg-slate-100 border-t border-slate-200 gap-2 text-xs">
        {/* Active Cell Reference Pill */}
        <div className="bg-emerald-600 text-white font-mono font-bold px-2.5 py-0.5 rounded shadow-2xs min-w-[50px] text-center">
          {selectedCell}
        </div>

        {/* fx formula icon button */}
        <button
          onClick={() => onInsertFormula('SUM')}
          className="p-1 hover:bg-slate-200 rounded text-slate-700 font-bold font-serif italic text-xs transition"
          title="إدراج دالة رياضية (fx)"
        >
          ƒx
        </button>

        {/* Formula Input */}
        <div className="flex-1 flex items-center bg-white border border-slate-300 rounded px-2 py-0.5 shadow-inner">
          <input
            id="formula-bar-input"
            type="text"
            value={formulaInput}
            onChange={(e) => onFormulaInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onFormulaInputSubmit();
              }
            }}
            placeholder="أدخل قيمة أو صيغة رياضية (مثال: =SUM(D2:D6) أو نص)..."
            className="w-full bg-transparent focus:outline-none text-xs font-medium text-slate-800"
            dir="auto"
          />
        </div>
      </div>
    </div>
  );
};
