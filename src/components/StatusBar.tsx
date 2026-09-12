import React from 'react';
import { 
  Keyboard, 
  ZoomIn, 
  ZoomOut, 
  BookOpen, 
  Monitor, 
  CheckCircle2,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import { AppMode } from '../types';

interface StatusBarProps {
  mode: AppMode;
  wordCount: number;
  charCount: number;
  selectedCell?: string;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  isKeyboardOpen: boolean;
  onToggleKeyboard: () => void;
  isReadingMode: boolean;
  onToggleReadingMode: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  mode,
  wordCount,
  charCount,
  selectedCell,
  zoom,
  onZoomChange,
  isKeyboardOpen,
  onToggleKeyboard,
  isReadingMode,
  onToggleReadingMode
}) => {
  return (
    <footer className="bg-slate-800 text-slate-300 border-t border-slate-700 px-3 py-1 flex items-center justify-between text-xs select-none no-print z-30">
      {/* Left Details */}
      <div className="flex items-center gap-3">
        {mode === 'word' ? (
          <>
            <div className="flex items-center gap-1.5 font-semibold text-blue-300">
              <FileText className="w-3.5 h-3.5" />
              <span>محرر وورد PRO</span>
            </div>
            <div className="h-3.5 w-px bg-slate-600 hidden sm:block" />
            <div className="text-slate-400 hidden sm:flex items-center gap-2">
              <span>الكلمات: <b className="text-slate-200">{wordCount}</b></span>
              <span>•</span>
              <span>الحروف: <b className="text-slate-200">{charCount}</b></span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-1.5 font-semibold text-emerald-300">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>معالج جداول إكسل PRO</span>
            </div>
            <div className="h-3.5 w-px bg-slate-600 hidden sm:block" />
            <div className="text-slate-400 hidden sm:flex items-center gap-2">
              <span>الخلية الحالية: <b className="text-emerald-400 font-mono">{selectedCell || 'A1'}</b></span>
              <span>•</span>
              <span>وضع الحساب: <b className="text-slate-200">تلقائي</b></span>
            </div>
          </>
        )}

        <div className="h-3.5 w-px bg-slate-600 hidden md:block" />

        <div className="hidden md:flex items-center gap-1 text-[11px] text-emerald-400">
          <CheckCircle2 className="w-3 h-3" />
          <span>جاهز ومحفوظ</span>
        </div>
      </div>

      {/* Right Controls: Keyboard, View Mode & Zoom */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Virtual Keyboard Toggle */}
        <button
          onClick={onToggleKeyboard}
          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold transition border ${
            isKeyboardOpen
              ? 'bg-teal-600 text-white border-teal-400'
              : 'hover:bg-slate-700 text-teal-300 border-slate-600'
          }`}
          title="لوحة المفاتيح الملحقة مع التشكيل والأوامر السريعة"
        >
          <Keyboard className="w-3 h-3" />
          <span>لوحة المفاتيح</span>
        </button>

        {/* Reading mode */}
        {mode === 'word' && (
          <button
            onClick={onToggleReadingMode}
            className={`p-1 rounded hover:bg-slate-700 transition ${
              isReadingMode ? 'text-amber-400 font-bold' : 'text-slate-400'
            }`}
            title="تبديل وضع القراءة"
          >
            <BookOpen className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Language Badge */}
        <span className="text-[10px] text-slate-400 bg-slate-700/60 px-1.5 py-0.5 rounded font-medium hidden sm:inline">
          العربية (SA)
        </span>

        {/* Zoom Slider */}
        <div className="flex items-center gap-1.5 text-slate-300">
          <button
            onClick={() => onZoomChange(Math.max(zoom - 10, 40))}
            className="p-0.5 hover:text-white rounded"
            title="تصغير"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <input
            type="range"
            min={50}
            max={150}
            step={5}
            value={zoom}
            onChange={(e) => onZoomChange(parseInt(e.target.value, 10))}
            className="w-16 sm:w-20 accent-blue-500 h-1 bg-slate-600 rounded-lg cursor-pointer"
          />

          <button
            onClick={() => onZoomChange(Math.min(zoom + 10, 200))}
            className="p-0.5 hover:text-white rounded"
            title="تكبير"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <span className="font-mono text-[11px] w-9 text-left text-slate-200">
            {zoom}%
          </span>
        </div>
      </div>
    </footer>
  );
};
