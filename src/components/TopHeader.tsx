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
    <header className="bg-[#1e293b] text-white border-b border-slate-700/80 select-none shadow-xs no-print sticky top-0 z-40 h-[28px] max-h-[28px] flex items-center">
      {/* Top Main Navigation Bar - Single Line (0.5cm) */}
      <div className="w-full flex items-center justify-between px-2 gap-1.5 overflow-x-auto overflow-y-hidden text-[11px]">
        {/* Right Section: Suite Mode Switcher, Title & Room Cloud Status */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Official Suite PRO Badge */}
          <div className="flex items-center bg-[#1e3a8a] text-white rounded px-1.5 py-0.5 text-[10px] font-bold border border-blue-400/40 shadow-xs">
            <span className="text-amber-400 font-black ml-1 text-[9px]">PRO</span>
            <span className="ml-1 text-slate-100 font-semibold">{mode === 'word' ? 'Word' : 'Excel'}</span>
            <span className="w-3.5 h-3.5 rounded bg-blue-500 text-white font-black flex items-center justify-center text-[9px]">
              {mode === 'word' ? 'W' : 'X'}
            </span>
          </div>

          {/* Word Switcher Tab */}
          <button
            id="mode-switch-word"
            onClick={() => onSelectMode('word')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
              mode === 'word'
                ? 'bg-[#2563eb] text-white shadow-xs ring-1 ring-blue-300'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <FileText className="w-3 h-3 text-blue-200" />
            <span>وورد</span>
          </button>

          {/* Excel Switcher Tab */}
          <button
            id="mode-switch-excel"
            onClick={() => onSelectMode('excel')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
              mode === 'excel'
                ? 'bg-emerald-600 text-white shadow-xs ring-1 ring-emerald-300'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <TableIcon className="w-3 h-3 text-emerald-200" />
            <span>إكسل</span>
          </button>

          <div className="h-3.5 w-px bg-slate-700 mx-0.5 hidden sm:block" />

          {/* Document Title Pill (كما في المرفق) */}
          {isEditingTitle ? (
            <form onSubmit={handleTitleSubmit} className="flex items-center">
              <input
                id="document-title-input"
                type="text"
                autoFocus
                value={documentTitle}
                onChange={(e) => onTitleChange(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                className="bg-slate-900 text-white border border-blue-400 rounded px-1.5 py-0 text-[11px] font-bold focus:outline-none"
              />
            </form>
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              className="flex items-center gap-1 text-[11px] font-bold text-slate-100 bg-[#0f172a]/90 hover:bg-slate-900 border border-slate-600 px-2 py-0.5 rounded transition max-w-[170px] truncate"
              title="انقر لتعديل اسم المستند"
            >
              <span className="truncate">{documentTitle}</span>
              <Edit3 className="w-2.5 h-2.5 text-slate-400 shrink-0" />
            </button>
          )}

          {/* Auto-save Status Indicator (Room Cloud) */}
          <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-300 bg-emerald-950/70 border border-emerald-700/60 px-2 py-0.2 rounded-full whitespace-nowrap">
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
            <span>محفوظ تلقائياً (Room)</span>
          </div>
        </div>

        {/* Left Section: Compact Quick Action Buttons in Single Line */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Templates / Simulation Button */}
          {onOpenSimulator && (
            <button
              id="header-simulator-trigger"
              onClick={onOpenSimulator}
              className={`flex items-center gap-1 px-2 py-0.5 rounded font-bold transition text-[11px] shadow-xs ${
                mode === 'excel'
                  ? 'bg-emerald-700 hover:bg-emerald-600 text-white border border-emerald-500'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
              title={mode === 'word' ? 'نماذج ومحاكاة مستند وورد' : 'محاكي وظائف وأدوات جداول إكسل'}
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>{mode === 'word' ? 'نماذج ومحاكاة' : 'محاكي إكسل ⚡'}</span>
            </button>
          )}

          {/* Open / Import (فتح ⇪) */}
          <button
            id="header-open-button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition text-[11px]"
            title="فتح أو استيراد ملف"
          >
            <FolderOpen className="w-3 h-3 text-amber-400" />
            <span>فتح</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onImportFile}
            accept=".doc,.docx,.xlsx,.xls,.csv,.txt,.html"
            className="hidden"
          />

          {/* Print (🖨) */}
          <button
            id="header-print-button"
            onClick={onPrint}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition"
            title="طباعة أو معاينة ورقية"
          >
            <Printer className="w-3 h-3 text-indigo-300" />
          </button>

          {/* Virtual Keyboard Toggle (كيبورد ⌨) */}
          <button
            id="header-keyboard-toggle"
            onClick={onToggleKeyboard}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-bold transition border ${
              isKeyboardOpen
                ? 'bg-teal-700 text-white border-teal-400'
                : 'bg-slate-800 hover:bg-slate-700 text-teal-300 border-slate-700'
            }`}
            title="إظهار / إخفاء لوحة المفاتيح"
          >
            <Keyboard className="w-3 h-3" />
            <span>كيبورد</span>
          </button>

          {/* Export Dropdown (تصدير ⬇ v) */}
          <div className="relative">
            <button
              id="header-export-dropdown"
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#2563eb] hover:bg-blue-600 text-white text-[11px] font-bold shadow-xs transition"
            >
              <Download className="w-3 h-3" />
              <span>تصدير</span>
              <ChevronDown className="w-2.5 h-2.5" />
            </button>

            {showExportMenu && (
              <div 
                className="absolute left-0 mt-1 w-52 bg-white text-slate-800 rounded-lg shadow-2xl border border-slate-200 py-1 text-xs z-50 animate-in fade-in slide-in-from-top-1"
                onClick={() => setShowExportMenu(false)}
              >
                <div className="px-3 py-1 font-bold text-slate-400 border-b border-slate-100 text-[10px] uppercase tracking-wider">
                  خيارات التصدير المتاحة
                </div>

                {mode === 'word' ? (
                  <>
                    <button
                      onClick={onExportDoc}
                      className="w-full text-right px-3 py-1.5 hover:bg-blue-50 flex items-center justify-between text-slate-700 hover:text-blue-700 transition text-xs"
                    >
                      <span className="font-semibold">تصدير مستند وورد (.doc/.docx)</span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-1 py-0.2 rounded font-mono">Word</span>
                    </button>
                    <button
                      onClick={onExportPdf}
                      className="w-full text-right px-3 py-1.5 hover:bg-rose-50 flex items-center justify-between text-slate-700 hover:text-rose-700 transition text-xs"
                    >
                      <span className="font-semibold">تصدير أو طباعة PDF</span>
                      <span className="text-[10px] bg-rose-100 text-rose-800 px-1 py-0.2 rounded font-mono">PDF</span>
                    </button>
                    {onExportHtml && (
                      <button
                        onClick={onExportHtml}
                        className="w-full text-right px-3 py-1.5 hover:bg-amber-50 flex items-center justify-between text-slate-700 hover:text-amber-700 transition text-xs"
                      >
                        <span>صفحة ويب كاملة (.html)</span>
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-1 py-0.2 rounded font-mono">HTML</span>
                      </button>
                    )}
                    {onExportTxt && (
                      <button
                        onClick={onExportTxt}
                        className="w-full text-right px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between text-slate-700 transition text-xs"
                      >
                        <span>نص مجرد (.txt)</span>
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-1 py-0.2 rounded font-mono">TXT</span>
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    {onExportXlsx && (
                      <button
                        onClick={onExportXlsx}
                        className="w-full text-right px-3 py-1.5 hover:bg-emerald-50 flex items-center justify-between text-slate-700 hover:text-emerald-700 transition text-xs"
                      >
                        <span className="font-semibold">مصنف إكسل كامل (.xlsx)</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded font-mono">Excel</span>
                      </button>
                    )}
                    {onExportCsv && (
                      <button
                        onClick={onExportCsv}
                        className="w-full text-right px-3 py-1.5 hover:bg-teal-50 flex items-center justify-between text-slate-700 hover:text-teal-700 transition text-xs"
                      >
                        <span>ملف جدول مفصول بفواصل (.csv)</span>
                        <span className="text-[10px] bg-teal-100 text-teal-800 px-1 py-0.2 rounded font-mono">CSV</span>
                      </button>
                    )}
                    <button
                      onClick={onExportPdf}
                      className="w-full text-right px-3 py-1.5 hover:bg-rose-50 flex items-center justify-between text-slate-700 hover:text-rose-700 transition text-xs"
                    >
                      <span className="font-semibold">طباعة أو تصدير PDF للجدول</span>
                      <span className="text-[10px] bg-rose-100 text-rose-800 px-1 py-0.2 rounded font-mono">PDF</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Quick Undo Button (⟲) */}
          <button
            id="header-undo-button"
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition ${
              !canUndo ? 'opacity-40 cursor-not-allowed' : ''
            }`}
            title="تراجع (Ctrl+Z)"
          >
            <RotateCw className="w-3 h-3 transform -scale-x-100" />
          </button>
        </div>
      </div>
    </header>
  );
};
