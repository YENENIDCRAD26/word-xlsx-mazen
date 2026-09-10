import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  Table as TableIcon, 
  Download, 
  Upload, 
  Save, 
  Printer, 
  FolderOpen, 
  Undo, 
  Redo, 
  CheckCircle2, 
  RotateCcw,
  Keyboard as KeyboardIcon,
  Loader2,
  ChevronDown,
  FileDown
} from 'lucide-react';
import { OfficeMode } from '../../types';

interface HeaderNavProps {
  mode: OfficeMode;
  onModeChange: (mode: OfficeMode) => void;
  title: string;
  onTitleChange: (title: string) => void;
  onExport: () => void;
  onExportPdf?: () => void;
  onImportClick: () => void;
  onSave: () => void;
  onPrint: () => void;
  onOpenTemplates: () => void;
  onReset: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  isSaved?: boolean;
  saveStatus?: 'saving' | 'saved';
  onToggleKeyboard?: () => void;
  isKeyboardOpen?: boolean;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  mode,
  onModeChange,
  title,
  onTitleChange,
  onExport,
  onExportPdf,
  onImportClick,
  onSave,
  onPrint,
  onOpenTemplates,
  onReset,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  isSaved = true,
  saveStatus = 'saved',
  onToggleKeyboard,
  isKeyboardOpen = false,
}) => {
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const exportDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(e.target as Node)) {
        setShowExportDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isSaving = saveStatus === 'saving' || !isSaved;
  return (
    <header 
      style={{ height: '0.5cm', minHeight: '0.5cm', maxHeight: '0.5cm' }}
      className="bg-white border-b border-neutral-300 shadow-2xs select-none sticky top-0 z-30 flex items-center px-2 overflow-x-auto overflow-y-hidden text-[11px] leading-none"
    >
      {/* Top Application Bar Container */}
      <div className="flex items-center justify-between w-full gap-1.5 h-full">
        {/* Left Side (in RTL): Brand & Document Mode Switcher Tabs */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* App Logo / Suite Badge */}
          <div className="flex items-center gap-1 pr-0.5">
            <div className={`w-4 h-4 rounded flex items-center justify-center font-bold text-[10px] text-white shadow-2xs transition-colors ${
              mode === 'word' ? 'bg-blue-700' : 'bg-emerald-700'
            }`}>
              {mode === 'word' ? 'W' : 'X'}
            </div>
            <span className="hidden lg:inline font-bold text-[11px] tracking-tight text-neutral-800">أوفيس برو</span>
          </div>

          {/* Mode Tabs Switcher (حجم الشريط العلوية التبويبات = 0.5cm) */}
          <div className="flex items-center bg-neutral-100 p-0.5 rounded border border-neutral-200 h-4">
            <button
              id="switch-to-word-btn"
              onClick={() => onModeChange('word')}
              className={`flex items-center gap-1 px-2 py-0 h-3.5 text-[10px] font-bold rounded transition-all leading-none ${
                mode === 'word'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60'
              }`}
            >
              <FileText className="w-2.5 h-2.5" />
              <span>وورد (Word)</span>
            </button>

            <button
              id="switch-to-excel-btn"
              onClick={() => onModeChange('excel')}
              className={`flex items-center gap-1 px-2 py-0 h-3.5 text-[10px] font-bold rounded transition-all leading-none ${
                mode === 'excel'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60'
              }`}
            >
              <TableIcon className="w-2.5 h-2.5" />
              <span>إكسل (Excel)</span>
            </button>
          </div>
        </div>

        {/* Center: Title editing and Auto-Save visual indicator */}
        <div className="flex items-center gap-1.5 flex-1 max-w-sm mx-1 h-full">
          <input
            id="document-title-input"
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full text-center text-[10px] font-semibold text-neutral-800 bg-neutral-50 hover:bg-neutral-100 focus:bg-white border border-neutral-200 focus:border-blue-500 rounded px-1.5 h-4 transition-colors outline-hidden truncate"
            title="انقر لتعديل اسم المستند"
          />
          <div 
            id="header-auto-save-indicator"
            className={`flex items-center gap-1 px-1.5 py-0 h-4 rounded border text-[9px] font-semibold whitespace-nowrap transition-all select-none leading-none ${
              isSaving 
                ? 'bg-amber-50 text-amber-700 border-amber-300 shadow-2xs' 
                : 'bg-emerald-50 text-emerald-700 border-emerald-300'
            }`} 
            title={isSaving ? 'جاري الحفظ التلقائي...' : 'تم الحفظ تلقائياً في المتصفح'}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-2.5 h-2.5 text-amber-600 animate-spin shrink-0" />
                <span className="hidden sm:inline">جاري الحفظ...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                <span className="hidden sm:inline">تم الحفظ</span>
              </>
            )}
          </div>
        </div>

        {/* Right Side: Document Actions */}
        <div className="flex items-center gap-0.5 shrink-0">
          {/* Undo / Redo */}
          {onUndo && (
            <button
              id="undo-btn"
              onClick={onUndo}
              disabled={!canUndo}
              title="تراجع (Ctrl+Z)"
              className="p-0.5 text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 rounded h-4 w-4 flex items-center justify-center transition-colors"
            >
              <Undo className="w-2.5 h-2.5" />
            </button>
          )}
          {onRedo && (
            <button
              id="redo-btn"
              onClick={onRedo}
              disabled={!canRedo}
              title="إعادة (Ctrl+Y)"
              className="p-0.5 text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 rounded h-4 w-4 flex items-center justify-center transition-colors"
            >
              <Redo className="w-2.5 h-2.5" />
            </button>
          )}

          <div className="h-3 w-px bg-neutral-200 mx-0.5" />

          {/* Templates library */}
          <button
            id="open-templates-btn"
            onClick={onOpenTemplates}
            className="flex items-center gap-1 px-1.5 py-0 h-4 text-[10px] font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded transition-colors leading-none"
            title="عرض وتطبيق النماذج الجاهزة"
          >
            <FolderOpen className="w-2.5 h-2.5 text-neutral-600" />
            <span className="hidden md:inline">نماذج</span>
          </button>

          {/* Import */}
          <button
            id="import-file-btn"
            onClick={onImportClick}
            className="flex items-center gap-1 px-1.5 py-0 h-4 text-[10px] font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded transition-colors leading-none"
            title={mode === 'word' ? 'فتح ملف Word (.docx, .txt)' : 'فتح ملف Excel (.xlsx, .csv)'}
          >
            <Upload className="w-2.5 h-2.5 text-neutral-600" />
            <span className="hidden md:inline">فتح</span>
          </button>

          {/* Print */}
          <button
            id="print-btn"
            onClick={onPrint}
            className="p-0.5 text-neutral-600 hover:bg-neutral-100 rounded h-4 w-4 flex items-center justify-center transition-colors"
            title="طباعة / تصدير PDF"
          >
            <Printer className="w-2.5 h-2.5" />
          </button>

          {/* Save Local */}
          <button
            id="quick-save-btn"
            onClick={onSave}
            className="p-0.5 text-neutral-600 hover:bg-neutral-100 rounded h-4 w-4 flex items-center justify-center transition-colors"
            title="حفظ محلي فوري"
          >
            <Save className="w-2.5 h-2.5" />
          </button>

          {/* Virtual Arabic Keyboard Toggle */}
          {onToggleKeyboard && (
            <button
              id="toggle-virtual-keyboard-btn"
              onClick={onToggleKeyboard}
              className={`flex items-center gap-1 px-1.5 py-0 h-4 text-[10px] font-bold rounded border transition-all leading-none ${
                isKeyboardOpen
                  ? 'bg-cyan-600 text-white border-cyan-700 shadow-2xs'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-300'
              }`}
              title="لوحة المفاتيح الملحقة (كيبورد عربي مع Shift, Ctrl, Alt)"
            >
              <KeyboardIcon className="w-2.5 h-2.5" />
              <span className="hidden sm:inline">كيبورد</span>
            </button>
          )}

          {/* Export Menu Dropdown (DOCX/XLSX and jsPDF) */}
          <div className="relative" ref={exportDropdownRef}>
            <button
              id="export-dropdown-toggle-btn"
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              className={`flex items-center gap-1 px-2 py-0 h-4 text-[10px] font-bold text-white rounded shadow-2xs transition-colors leading-none cursor-pointer ${
                mode === 'word'
                  ? 'bg-blue-700 hover:bg-blue-800'
                  : 'bg-emerald-700 hover:bg-emerald-800'
              }`}
              title="خيارات التصدير والتحويل (DOCX / XLSX / PDF)"
            >
              <Download className="w-2.5 h-2.5" />
              <span>تصدير</span>
              <ChevronDown className="w-2 h-2 text-white/80" />
            </button>

            {showExportDropdown && (
              <div 
                id="export-options-dropdown"
                className="absolute left-0 top-full mt-1 bg-white border border-neutral-300 rounded-lg shadow-xl py-1.5 w-64 z-50 text-right text-xs"
              >
                <div className="px-3 py-1 text-[10px] font-bold text-neutral-400 border-b border-neutral-100 select-none">
                  خيارات التصدير المتاحة
                </div>

                {/* Option 1: Native Office File (DOCX / XLSX) */}
                <button
                  id="export-native-file-option"
                  onClick={() => {
                    onExport();
                    setShowExportDropdown(false);
                  }}
                  className="w-full px-3 py-2 hover:bg-neutral-100 text-neutral-800 font-semibold flex items-center justify-between text-right cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    {mode === 'word' ? (
                      <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                    ) : (
                      <TableIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                    <div>
                      <div className="text-xs font-bold text-neutral-900">
                        تصدير {mode === 'word' ? 'مستند Word (.docx)' : 'مصنف Excel (.xlsx)'}
                      </div>
                      <div className="text-[10px] text-neutral-500 font-normal">
                        الملف الأصلي القابل للتعديل
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono font-bold bg-neutral-100 px-1.5 py-0.5 rounded">
                    {mode === 'word' ? 'DOCX' : 'XLSX'}
                  </span>
                </button>

                {/* Option 2: Direct PDF Export via jsPDF */}
                <button
                  id="export-pdf-jspdf-option"
                  onClick={() => {
                    if (onExportPdf) onExportPdf();
                    setShowExportDropdown(false);
                  }}
                  className="w-full px-3 py-2 hover:bg-rose-50 text-neutral-800 font-semibold flex items-center justify-between text-right border-t border-neutral-100 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FileDown className="w-4 h-4 text-rose-600 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                        <span>تصدير إلى ملف PDF مباشر</span>
                        <span className="text-[9px] bg-rose-100 text-rose-700 font-mono font-bold px-1 rounded">jsPDF</span>
                      </div>
                      <div className="text-[10px] text-neutral-500 font-normal">
                        تحويل فوري عالي الدقة عبر jsPDF
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-rose-600 font-mono font-bold bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                    PDF
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Reset document */}
          <button
            id="reset-doc-btn"
            onClick={onReset}
            className="p-0.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded h-4 w-4 flex items-center justify-center transition-colors"
            title="مستند جديد / مسح"
          >
            <RotateCcw className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
