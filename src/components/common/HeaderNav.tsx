import React from 'react';
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
  Keyboard as KeyboardIcon
} from 'lucide-react';
import { OfficeMode } from '../../types';

interface HeaderNavProps {
  mode: OfficeMode;
  onModeChange: (mode: OfficeMode) => void;
  title: string;
  onTitleChange: (title: string) => void;
  onExport: () => void;
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
  onToggleKeyboard?: () => void;
  isKeyboardOpen?: boolean;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  mode,
  onModeChange,
  title,
  onTitleChange,
  onExport,
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
  onToggleKeyboard,
  isKeyboardOpen = false,
}) => {
  return (
    <header className="bg-white border-b border-neutral-200 shadow-xs select-none sticky top-0 z-30">
      {/* Top Application Bar */}
      <div className="flex flex-wrap items-center justify-between px-3 py-1.5 gap-2">
        {/* Left Side (in RTL): Brand & Document Mode Switcher */}
        <div className="flex items-center gap-3">
          {/* App Logo / Suite Badge */}
          <div className="flex items-center gap-2 pr-1">
            <div className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-white shadow-xs transition-colors ${
              mode === 'word' ? 'bg-blue-700' : 'bg-emerald-700'
            }`}>
              {mode === 'word' ? 'W' : 'X'}
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-sm tracking-tight text-neutral-800">أوفيس برو</span>
              <span className="text-xs text-neutral-500 mr-1.5 font-medium">
                {mode === 'word' ? 'محرر Word' : 'جداول Excel'}
              </span>
            </div>
          </div>

          {/* Mode Tabs Switcher */}
          <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg border border-neutral-200">
            <button
              id="switch-to-word-btn"
              onClick={() => onModeChange('word')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                mode === 'word'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>محرر النصوص (Word DOCX)</span>
            </button>

            <button
              id="switch-to-excel-btn"
              onClick={() => onModeChange('excel')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                mode === 'excel'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>معالج الجداول (Excel XLSX)</span>
            </button>
          </div>
        </div>

        {/* Center: Title editing and saving status */}
        <div className="flex items-center gap-2 flex-1 max-w-md mx-2">
          <input
            id="document-title-input"
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full text-center text-sm font-semibold text-neutral-800 bg-neutral-50 hover:bg-neutral-100 focus:bg-white focus:ring-1 focus:ring-blue-500 border border-transparent hover:border-neutral-300 focus:border-blue-500 rounded px-2 py-0.5 transition-colors outline-hidden truncate"
            title="انقر لتعديل اسم المستند"
          />
          <div className="flex items-center gap-1 text-xs text-neutral-500 whitespace-nowrap" title={isSaved ? 'تم الحفظ تلقائياً' : 'تغييرات غير محفوظة'}>
            <CheckCircle2 className={`w-3.5 h-3.5 ${isSaved ? 'text-emerald-500' : 'text-amber-500 animate-pulse'}`} />
            <span className="hidden md:inline text-[11px]">{isSaved ? 'محفوظ' : 'جار الحفظ'}</span>
          </div>
        </div>

        {/* Right Side: Document Actions */}
        <div className="flex items-center gap-1">
          {/* Undo / Redo */}
          {onUndo && (
            <button
              id="undo-btn"
              onClick={onUndo}
              disabled={!canUndo}
              title="تراجع (Ctrl+Z)"
              className="p-1.5 text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 rounded transition-colors"
            >
              <Undo className="w-4 h-4" />
            </button>
          )}
          {onRedo && (
            <button
              id="redo-btn"
              onClick={onRedo}
              disabled={!canRedo}
              title="إعادة (Ctrl+Y)"
              className="p-1.5 text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 rounded transition-colors"
            >
              <Redo className="w-4 h-4" />
            </button>
          )}

          <div className="h-4 w-px bg-neutral-200 mx-1" />

          {/* Templates library */}
          <button
            id="open-templates-btn"
            onClick={onOpenTemplates}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded transition-colors"
            title="عرض وتطبيق النماذج الجاهزة"
          >
            <FolderOpen className="w-3.5 h-3.5 text-neutral-600" />
            <span className="hidden sm:inline">نماذج جاهزة</span>
          </button>

          {/* Import */}
          <button
            id="import-file-btn"
            onClick={onImportClick}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded transition-colors"
            title={mode === 'word' ? 'فتح ملف Word (.docx, .txt)' : 'فتح ملف Excel (.xlsx, .csv)'}
          >
            <Upload className="w-3.5 h-3.5 text-neutral-600" />
            <span className="hidden sm:inline">فتح ملف</span>
          </button>

          {/* Print */}
          <button
            id="print-btn"
            onClick={onPrint}
            className="p-1.5 text-neutral-600 hover:bg-neutral-100 rounded transition-colors"
            title="طباعة / تصدير PDF"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Save Local */}
          <button
            id="quick-save-btn"
            onClick={onSave}
            className="p-1.5 text-neutral-600 hover:bg-neutral-100 rounded transition-colors"
            title="حفظ محلي فوري"
          >
            <Save className="w-4 h-4" />
          </button>

          {/* Virtual Arabic Keyboard Toggle */}
          {onToggleKeyboard && (
            <button
              id="toggle-virtual-keyboard-btn"
              onClick={onToggleKeyboard}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md border transition-all ${
                isKeyboardOpen
                  ? 'bg-cyan-600 text-white border-cyan-700 shadow-xs'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-300'
              }`}
              title="لوحة المفاتيح الملحقة (كيبورد عربي مع Shift, Ctrl, Alt)"
            >
              <KeyboardIcon className="w-3.5 h-3.5" />
              <span className="hidden md:inline">الكيبورد الملحق</span>
            </button>
          )}

          {/* Export File Button */}
          <button
            id="export-file-btn"
            onClick={onExport}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white rounded shadow-xs transition-colors ${
              mode === 'word'
                ? 'bg-blue-700 hover:bg-blue-800'
                : 'bg-emerald-700 hover:bg-emerald-800'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>تصدير {mode === 'word' ? 'DOCX' : 'XLSX'}</span>
          </button>

          {/* Reset document */}
          <button
            id="reset-doc-btn"
            onClick={onReset}
            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="مستند جديد / مسح"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
