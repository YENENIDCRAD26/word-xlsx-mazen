import React, { useRef, useState } from 'react';
import { 
  FileText, 
  Table as TableIcon, 
  Save, 
  FolderOpen, 
  Printer, 
  Keyboard, 
  Download, 
  RotateCcw, 
  RotateCw, 
  CheckCircle2, 
  ChevronDown,
  Sparkles,
  Edit3
} from 'lucide-react';
import { AppMode } from '../types';

interface TopHeaderProps {
  mode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  documentTitle: string;
  onTitleChange: (newTitle: string) => void;
  onSave: () => void;
  onPrint: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onToggleKeyboard: () => void;
  isKeyboardOpen: boolean;
  onExportDoc: () => void;
  onExportPdf: () => void;
  onExportHtml?: () => void;
  onExportTxt?: () => void;
  onExportXlsx?: () => void;
  onExportCsv?: () => void;
  onImportFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  lastSavedText: string;
  onOpenSimulator?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  mode,
  onSelectMode,
  documentTitle,
  onTitleChange,
  onSave,
  onPrint,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onToggleKeyboard,
  isKeyboardOpen,
  onExportDoc,
  onExportPdf,
  onExportHtml,
  onExportTxt,
  onExportXlsx,
  onExportCsv,
  onImportFile,
  lastSavedText,
  onOpenSimulator
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingTitle(false);
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 select-none shadow-md no-print sticky top-0 z-40">
      {/* Top Main Navigation Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 gap-2">
        {/* Left Section: Suite Mode Switcher & Title */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Word Switcher Tab */}
          <button
            id="mode-switch-word"
            onClick={() => onSelectMode('word')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs sm:text-sm font-bold transition-all ${
              mode === 'word'
                ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <div className="w-5 h-5 rounded bg-blue-700 flex items-center justify-center text-white text-[11px] font-black border border-blue-400">
              W
            </div>
            <span>وورد Word</span>
            <span className="bg-blue-500/30 text-blue-200 text-[10px] px-1 py-0.5 rounded font-mono">
              PRO
            </span>
          </button>

          {/* Excel Switcher Tab */}
          <button
            id="mode-switch-excel"
            onClick={() => onSelectMode('excel')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs sm:text-sm font-bold transition-all ${
              mode === 'excel'
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <div className="w-5 h-5 rounded bg-emerald-700 flex items-center justify-center text-white text-[11px] font-black border border-emerald-400">
              X
            </div>
            <span>إكسل Excel</span>
            <span className="bg-emerald-500/30 text-emerald-200 text-[10px] px-1 py-0.5 rounded font-mono">
              PRO
            </span>
          </button>

          <div className="h-5 w-px bg-slate-700 mx-1 hidden sm:block" />

          {/* Document Title Display / Edit */}
          {isEditingTitle ? (
            <form onSubmit={handleTitleSubmit} className="flex items-center">
              <input
                id="document-title-input"
                type="text"
                autoFocus
                value={documentTitle}
                onChange={(e) => onTitleChange(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                className="bg-slate-800 text-white border border-blue-500 rounded px-2 py-0.5 text-xs sm:text-sm font-medium focus:outline-none"
              />
            </form>
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-800 px-2 py-0.5 rounded transition"
              title="انقر لتعديل اسم المستند"
            >
              <span className="truncate max-w-[150px] sm:max-w-[240px] font-bold">{documentTitle}</span>
              <Edit3 className="w-3.5 h-3.5 text-slate-400 opacity-60 hover:opacity-100" />
            </button>
          )}

          {/* Auto-save Status Indicator */}
          <div className="hidden md:flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>{lastSavedText}</span>
          </div>
        </div>

        {/* Right Section: Quick Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Undo / Redo */}
          <div className="flex items-center bg-slate-800/90 rounded border border-slate-700">
            <button
              id="header-undo-button"
              onClick={onUndo}
              disabled={!canUndo}
              className={`p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-r transition ${
                !canUndo ? 'opacity-40 cursor-not-allowed' : ''
              }`}
              title="تراجع (Ctrl+Z)"
            >
              <RotateCw className="w-3.5 h-3.5 transform -scale-x-100" />
            </button>
            <div className="w-px h-3.5 bg-slate-700" />
            <button
              id="header-redo-button"
              onClick={onRedo}
              disabled={!canRedo}
              className={`p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-l transition ${
                !canRedo ? 'opacity-40 cursor-not-allowed' : ''
              }`}
              title="إعادة (Ctrl+Y)"
            >
              <RotateCcw className="w-3.5 h-3.5 transform -scale-x-100" />
            </button>
          </div>

          {/* Quick Save */}
          <button
            id="header-save-button"
            onClick={onSave}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 font-medium transition"
            title="حفظ المستند"
          >
            <Save className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">حفظ</span>
          </button>

          {/* Open / Import */}
          <button
            id="header-open-button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 font-medium transition"
            title="فتح أو استيراد ملف"
          >
            <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">فتح</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onImportFile}
            accept=".doc,.docx,.xlsx,.xls,.csv,.txt,.html"
            className="hidden"
          />

          {/* Print / Preview */}
          <button
            id="header-print-button"
            onClick={onPrint}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 font-medium transition"
            title="طباعة أو معاينة ورقية"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">طباعة</span>
          </button>

          {/* Virtual Keyboard Toggle */}
          <button
            id="header-keyboard-toggle"
            onClick={onToggleKeyboard}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold transition border ${
              isKeyboardOpen
                ? 'bg-teal-600 text-white border-teal-400 shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-teal-300 border-slate-700'
            }`}
            title="إظهار / إخفاء لوحة المفاتيح العربية الملحقة مع التشكيل"
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">لوحة المفاتيح</span>
          </button>

          {/* Simulation & Test Suite Trigger */}
          {onOpenSimulator && (
            <button
              id="header-simulator-trigger"
              onClick={onOpenSimulator}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-black shadow-sm transition border border-amber-300 active:scale-95"
              title="محاكاة عملية إنشاء وتنسيق المستند وورد واختبار شامل"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span className="hidden md:inline">محاكاة وفحص المستند</span>
            </button>
          )}

          {/* Export Dropdown */}
          <div className="relative">
            <button
              id="header-export-dropdown"
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-sm transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تصدير</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showExportMenu && (
              <div 
                className="absolute left-0 mt-1.5 w-52 bg-white text-slate-800 rounded-lg shadow-2xl border border-slate-200 py-1 text-xs z-50 animate-in fade-in slide-in-from-top-1"
                onClick={() => setShowExportMenu(false)}
              >
                <div className="px-3 py-1.5 font-bold text-slate-400 border-b border-slate-100 text-[10px] uppercase tracking-wider">
                  خيارات التصدير المتاحة
                </div>

                {mode === 'word' ? (
                  <>
                    <button
                      onClick={onExportDoc}
                      className="w-full text-right px-3 py-2 hover:bg-blue-50 flex items-center justify-between text-slate-700 hover:text-blue-700 transition"
                    >
                      <span className="font-semibold">تصدير مستند وورد (.doc/.docx)</span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-mono">Word</span>
                    </button>
                    <button
                      onClick={onExportPdf}
                      className="w-full text-right px-3 py-2 hover:bg-rose-50 flex items-center justify-between text-slate-700 hover:text-rose-700 transition"
                    >
                      <span className="font-semibold">تصدير أو طباعة PDF</span>
                      <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded font-mono">PDF</span>
                    </button>
                    {onExportHtml && (
                      <button
                        onClick={onExportHtml}
                        className="w-full text-right px-3 py-2 hover:bg-amber-50 flex items-center justify-between text-slate-700 hover:text-amber-700 transition"
                      >
                        <span>صفحة ويب كاملة (.html)</span>
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono">HTML</span>
                      </button>
                    )}
                    {onExportTxt && (
                      <button
                        onClick={onExportTxt}
                        className="w-full text-right px-3 py-2 hover:bg-slate-50 flex items-center justify-between text-slate-700 transition"
                      >
                        <span>نص مجرد (.txt)</span>
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono">TXT</span>
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    {onExportXlsx && (
                      <button
                        onClick={onExportXlsx}
                        className="w-full text-right px-3 py-2 hover:bg-emerald-50 flex items-center justify-between text-slate-700 hover:text-emerald-700 transition"
                      >
                        <span className="font-semibold">مصنف إكسل كامل (.xlsx)</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono">Excel</span>
                      </button>
                    )}
                    {onExportCsv && (
                      <button
                        onClick={onExportCsv}
                        className="w-full text-right px-3 py-2 hover:bg-teal-50 flex items-center justify-between text-slate-700 hover:text-teal-700 transition"
                      >
                        <span>ملف جدول مفصول بفواصل (.csv)</span>
                        <span className="text-[10px] bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded font-mono">CSV</span>
                      </button>
                    )}
                    <button
                      onClick={onExportPdf}
                      className="w-full text-right px-3 py-2 hover:bg-rose-50 flex items-center justify-between text-slate-700 hover:text-rose-700 transition"
                    >
                      <span className="font-semibold">طباعة أو تصدير PDF للجدول</span>
                      <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded font-mono">PDF</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
