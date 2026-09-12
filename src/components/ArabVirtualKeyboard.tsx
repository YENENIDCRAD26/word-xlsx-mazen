import React, { useState } from 'react';
import { 
  X, 
  Minus, 
  ArrowUp, 
  ArrowDown, 
  Globe, 
  Lock, 
  Check, 
  Delete, 
  CornerDownLeft,
  Keyboard as KeyboardIcon,
  Zap,
  Smartphone,
  Sparkles,
  Bold,
  Italic,
  Underline,
  RotateCcw,
  RotateCw,
  Save,
  Printer
} from 'lucide-react';
import { VirtualKeyboardState } from '../types';

interface ArabVirtualKeyboardProps {
  state: VirtualKeyboardState;
  onUpdateState: (partial: Partial<VirtualKeyboardState>) => void;
  onKeyPress: (char: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
  onTab: () => void;
  onCommand?: (cmd: string) => void;
  mode: 'word' | 'excel';
}

export const ArabVirtualKeyboard: React.FC<ArabVirtualKeyboardProps> = ({
  state,
  onUpdateState,
  onKeyPress,
  onBackspace,
  onEnter,
  onTab,
  onCommand,
  mode
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  if (!state.isOpen) return null;

  const isNative = state.preferredInputMode === 'native';
  const autoSwitchEnabled = state.autoSwitch !== false; // enabled by default

  const toggleInputMode = () => {
    onUpdateState({ preferredInputMode: isNative ? 'virtual' : 'native' });
  };

  const toggleAutoSwitch = () => {
    onUpdateState({ autoSwitch: !autoSwitchEnabled });
  };

  const toggleLanguage = () => {
    onUpdateState({ language: state.language === 'ar' ? 'en' : 'ar' });
  };

  const toggleShift = () => {
    onUpdateState({ shiftActive: !state.shiftActive });
  };

  const toggleAlt = () => {
    onUpdateState({ altActive: !state.altActive });
  };

  const toggleCtrl = () => {
    onUpdateState({ ctrlActive: !state.ctrlActive });
  };

  const toggleFloat = () => {
    onUpdateState({ isFloating: !state.isFloating });
  };

  // If user switched to phone's native keyboard, render a sleek floating dock switcher
  if (isNative) {
    return (
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 no-print select-none" dir="rtl">
        <div className="bg-slate-900/95 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full shadow-2xl border border-slate-700 flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold">لوحة مفاتيح الهاتف نشطة 📱</span>
          </div>

          <div className="w-px h-3.5 bg-slate-700" />

          <button
            onClick={toggleInputMode}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow-xs active:scale-95"
          >
            <KeyboardIcon className="w-3.5 h-3.5" />
            <span>التبديل للكيبورد الملحق ⌨️</span>
          </button>

          <button
            onClick={toggleAutoSwitch}
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition ${
              autoSwitchEnabled 
                ? 'bg-emerald-900/60 text-emerald-300 border-emerald-600' 
                : 'bg-slate-800 text-slate-400 border-slate-600'
            }`}
            title="التبديل التلقائي عند التركيز أو الإدخال"
          >
            تبديل تلقائي: {autoSwitchEnabled ? 'مفعل ✓' : 'معطل'}
          </button>

          <button
            onClick={() => onUpdateState({ isOpen: false })}
            className="p-1 text-slate-400 hover:text-white rounded-full transition mr-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  const tashkeelList = [
    { label: 'َ فتحة', char: '\u064E' },
    { label: 'ً تنوين فتح', char: '\u064B' },
    { label: 'ُ ضمة', char: '\u064F' },
    { label: 'ٌ تنوين ضم', char: '\u064C' },
    { label: 'ِ كسرة', char: '\u0650' },
    { label: 'ٍ تنوين كسر', char: '\u064D' },
    { label: 'ْ سكون', char: '\u0652' },
    { label: 'ّ شدة', char: '\u0651' },
    { label: 'ـ تطويل', char: '\u0640' },
  ];

  const arRow1 = [
    { char: 'ذ', shift: 'ّ' },
    { char: '١', shift: '!' },
    { char: '٢', shift: '@' },
    { char: '٣', shift: '#' },
    { char: '٤', shift: '$' },
    { char: '٥', shift: '%' },
    { char: '٦', shift: '^' },
    { char: '٧', shift: '&' },
    { char: '٨', shift: '*' },
    { char: '٩', shift: ')' },
    { char: '٠', shift: '(' },
    { char: '-', shift: '_' },
    { char: '=', shift: '+' },
  ];

  const arRow2 = [
    { char: 'ض', shift: 'َ' },
    { char: 'ص', shift: 'ً' },
    { char: 'ث', shift: 'ُ' },
    { char: 'ق', shift: 'ٌ' },
    { char: 'ف', shift: 'لإ' },
    { char: 'غ', shift: 'إ' },
    { char: 'ع', shift: '‘' },
    { char: 'ه', shift: '÷' },
    { char: 'خ', shift: '×' },
    { char: 'ح', shift: '؛' },
    { char: 'ج', shift: '<' },
    { char: 'د', shift: '>' },
  ];

  const arRow3 = [
    { char: 'ش', shift: 'ِ' },
    { char: 'س', shift: 'ٍ' },
    { char: 'ي', shift: ']' },
    { char: 'ب', shift: '[' },
    { char: 'ل', shift: 'لأ' },
    { char: 'ا', shift: 'أ' },
    { char: 'ت', shift: 'ـ' },
    { char: 'ن', shift: '،' },
    { char: 'م', shift: '/' },
    { char: 'ك', shift: ':' },
    { char: 'ط', shift: '"' },
    { char: '\\', shift: '|' },
  ];

  const arRow4 = [
    { char: 'ئ', shift: '~' },
    { char: 'ء', shift: 'ْ' },
    { char: 'ؤ', shift: '}' },
    { char: 'ر', shift: '{' },
    { char: 'لا', shift: 'لآ' },
    { char: 'ى', shift: 'آ' },
    { char: 'ة', shift: '\'' },
    { char: 'و', shift: ',' },
    { char: 'ز', shift: '.' },
    { char: 'ظ', shift: '؟' },
  ];

  // English QWERTY
  const enRow1 = ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='];
  const enRow2 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'];
  const enRow3 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\''];
  const enRow4 = ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'];

  const getChar = (item: { char: string; shift?: string } | string) => {
    if (typeof item === 'string') {
      return state.shiftActive || state.capsActive ? item.toUpperCase() : item.toLowerCase();
    }
    return state.shiftActive && item.shift ? item.shift : item.char;
  };

  return (
    <div 
      className={`select-none no-print transition-all z-50 ${
        state.isFloating 
          ? 'fixed top-16 left-1/2 -translate-x-1/2 w-full max-w-4xl px-2 shadow-2xl' 
          : 'fixed bottom-0 left-0 right-0 max-w-5xl mx-auto px-2 pb-1'
      }`}
      dir="rtl"
    >
      <div className="bg-slate-50/95 backdrop-blur-md rounded-t-xl border border-slate-300 shadow-2xl overflow-hidden ring-1 ring-slate-900/10">
        
        {/* Keyboard Header */}
        <div className="bg-slate-200/90 border-b border-slate-300 px-3 py-1 flex items-center justify-between flex-wrap gap-1">
          <div className="flex items-center gap-2">
            <KeyboardIcon className="w-4 h-4 text-slate-700" />
            <span className="text-xs font-bold text-slate-800">
              الكيبورد الملحق مع التشكيل والأوامر {mode === 'excel' ? '(إكسل Excel)' : '(وورد Word)'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Switch to Phone Keyboard */}
            <button
              onClick={toggleInputMode}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-800 text-[11px] font-bold border border-blue-300 transition shadow-2xs"
              title="التبديل إلى كيبورد الهاتف اللمسي"
            >
              <Smartphone className="w-3 h-3 text-blue-600" />
              <span>كيبورد الهاتف 📱</span>
            </button>

            {/* Auto Switch Mode Toggle */}
            <button
              onClick={toggleAutoSwitch}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border transition ${
                autoSwitchEnabled 
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300' 
                  : 'bg-slate-100 text-slate-600 border-slate-300'
              }`}
              title="تفعيل أو تعطيل التبديل التلقائي عند استخدام الهاتف"
            >
              <span>تلقائي: {autoSwitchEnabled ? 'مفعل ✓' : 'معطل'}</span>
            </button>

            {/* Toggle Language */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
              title="تبديل اللغة (Alt+Shift)"
            >
              <Globe className="w-3 h-3" />
              <span>{state.language === 'ar' ? 'العربية' : 'English'}</span>
            </button>

            {/* Float / Dock Toggle */}
            <button
              onClick={toggleFloat}
              className="p-1 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition"
              title={state.isFloating ? 'تثبيت لأسفل' : 'تعويم لأعلى'}
            >
              {state.isFloating ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />}
            </button>

            {/* Minimize */}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 rounded hover:bg-slate-300 text-slate-600 transition"
              title={isMinimized ? 'توسيع' : 'تصغير'}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            {/* Close */}
            <button
              onClick={() => onUpdateState({ isOpen: false })}
              className="p-1 rounded hover:bg-rose-100 hover:text-rose-600 text-slate-600 transition"
              title="إغلاق"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <div className="p-2 space-y-1.5 bg-slate-100/90 text-xs">
            {/* Direct Editor Keyboard Commands Bar (أوامر واختصارات الكيبورد الفورية) */}
            <div className="flex items-center justify-between bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-2xs flex-wrap gap-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-bold text-slate-600">أوامر سريعة:</span>
                
                {mode === 'word' ? (
                  <>
                    <button
                      onClick={() => onCommand && onCommand('bold')}
                      className="flex items-center gap-0.5 px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 font-bold text-[11px] text-slate-700"
                      title="غامق Ctrl+B"
                    >
                      <Bold className="w-3 h-3" />
                      <span>Ctrl+B</span>
                    </button>

                    <button
                      onClick={() => onCommand && onCommand('italic')}
                      className="flex items-center gap-0.5 px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 italic text-[11px] text-slate-700"
                      title="مائل Ctrl+I"
                    >
                      <Italic className="w-3 h-3" />
                      <span>Ctrl+I</span>
                    </button>

                    <button
                      onClick={() => onCommand && onCommand('underline')}
                      className="flex items-center gap-0.5 px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 underline text-[11px] text-slate-700"
                      title="تسطير Ctrl+U"
                    >
                      <Underline className="w-3 h-3" />
                      <span>Ctrl+U</span>
                    </button>

                    <button
                      onClick={() => onCommand && onCommand('undo')}
                      className="flex items-center gap-0.5 px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 text-[11px] text-slate-700"
                      title="تراجع Ctrl+Z"
                    >
                      <RotateCw className="w-3 h-3 transform -scale-x-100" />
                      <span>تراجع</span>
                    </button>

                    <button
                      onClick={() => onCommand && onCommand('save')}
                      className="flex items-center gap-0.5 px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[11px]"
                      title="حفظ فوري Ctrl+S"
                    >
                      <Save className="w-3 h-3" />
                      <span>Ctrl+S حفظ</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => onCommand && onCommand('sum')}
                      className="px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono font-bold text-[11px]"
                    >
                      =SUM() مجموع
                    </button>

                    <button
                      onClick={() => onCommand && onCommand('average')}
                      className="px-2 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 font-mono font-bold text-[11px]"
                    >
                      =AVERAGE() متوسط
                    </button>

                    <button
                      onClick={() => onCommand && onCommand('clear')}
                      className="px-2 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 text-[11px]"
                    >
                      مسح الخلية
                    </button>
                  </>
                )}
              </div>

              {/* Status Toggles */}
              <div className="flex items-center gap-1">
                <button
                  onClick={toggleShift}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                    state.shiftActive ? 'bg-blue-600 text-white border-blue-700' : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  Shift
                </button>
                <button
                  onClick={toggleCtrl}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                    state.ctrlActive ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  Ctrl
                </button>
                <button
                  onClick={toggleAlt}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                    state.altActive ? 'bg-purple-600 text-white border-purple-700' : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  Alt
                </button>
              </div>
            </div>

            {/* Quick Harakat & Tashkeel Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-2 bg-amber-50/70 border border-amber-200/80 rounded-lg">
              <span className="text-[11px] font-bold text-amber-900 whitespace-nowrap">تشكيل وحركات:</span>
              <div className="flex items-center gap-1 flex-wrap">
                {tashkeelList.map((t, idx) => (
                  <button
                    key={idx}
                    onClick={() => onKeyPress(t.char)}
                    className="px-2 py-0.5 bg-white hover:bg-amber-100 border border-amber-300 rounded text-[11px] font-semibold text-slate-800 hover:text-amber-900 shadow-2xs transition active:scale-95 whitespace-nowrap"
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Keyboard Layout */}
            <div className="space-y-1 bg-white p-2 rounded-xl border border-slate-300 shadow-inner">
              {state.language === 'ar' ? (
                <>
                  {/* Arabic Row 1 */}
                  <div className="flex gap-1 justify-center">
                    {arRow1.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => onKeyPress(getChar(item))}
                        className="flex-1 min-w-[24px] h-8 bg-slate-50 hover:bg-blue-50 border border-slate-300 rounded text-xs font-bold text-slate-800 shadow-2xs active:bg-blue-200 transition"
                      >
                        {getChar(item)}
                      </button>
                    ))}
                    <button
                      onClick={onBackspace}
                      className="px-3 h-8 bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-700 rounded text-xs font-bold flex items-center justify-center gap-1 shadow-2xs active:scale-95 transition"
                      title="مسح (Backspace)"
                    >
                      <Delete className="w-3.5 h-3.5" />
                      <span>مسح</span>
                    </button>
                  </div>

                  {/* Arabic Row 2 */}
                  <div className="flex gap-1 justify-center">
                    <button
                      onClick={onTab}
                      className="px-2.5 h-8 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded text-xs font-bold shadow-2xs"
                    >
                      Tab
                    </button>
                    {arRow2.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => onKeyPress(getChar(item))}
                        className="flex-1 min-w-[24px] h-8 bg-slate-50 hover:bg-blue-50 border border-slate-300 rounded text-xs font-bold text-slate-800 shadow-2xs active:bg-blue-200 transition"
                      >
                        {getChar(item)}
                      </button>
                    ))}
                    <button
                      onClick={onEnter}
                      className="px-3 h-8 bg-blue-600 hover:bg-blue-700 border border-blue-700 text-white rounded text-xs font-bold flex items-center justify-center gap-1 shadow-2xs active:scale-95 transition"
                      title="Enter"
                    >
                      <CornerDownLeft className="w-3.5 h-3.5" />
                      <span>Enter</span>
                    </button>
                  </div>

                  {/* Arabic Row 3 */}
                  <div className="flex gap-1 justify-center">
                    <button
                      onClick={() => onUpdateState({ capsActive: !state.capsActive })}
                      className={`px-2 h-8 rounded text-xs font-bold border shadow-2xs ${
                        state.capsActive ? 'bg-amber-500 text-white border-amber-600' : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      Caps
                    </button>
                    {arRow3.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => onKeyPress(getChar(item))}
                        className="flex-1 min-w-[24px] h-8 bg-slate-50 hover:bg-blue-50 border border-slate-300 rounded text-xs font-bold text-slate-800 shadow-2xs active:bg-blue-200 transition"
                      >
                        {getChar(item)}
                      </button>
                    ))}
                  </div>

                  {/* Arabic Row 4 */}
                  <div className="flex gap-1 justify-center">
                    <button
                      onClick={toggleShift}
                      className={`px-3 h-8 rounded text-xs font-bold border shadow-2xs ${
                        state.shiftActive ? 'bg-blue-600 text-white border-blue-700' : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      Shift
                    </button>
                    {arRow4.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => onKeyPress(getChar(item))}
                        className="flex-1 min-w-[24px] h-8 bg-slate-50 hover:bg-blue-50 border border-slate-300 rounded text-xs font-bold text-slate-800 shadow-2xs active:bg-blue-200 transition"
                      >
                        {getChar(item)}
                      </button>
                    ))}
                    <button
                      onClick={toggleShift}
                      className={`px-3 h-8 rounded text-xs font-bold border shadow-2xs ${
                        state.shiftActive ? 'bg-blue-600 text-white border-blue-700' : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      Shift
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* English QWERTY */}
                  <div className="flex gap-1 justify-center">
                    {enRow1.map((ch, i) => (
                      <button
                        key={i}
                        onClick={() => onKeyPress(getChar(ch))}
                        className="flex-1 min-w-[24px] h-8 bg-slate-50 hover:bg-blue-50 border border-slate-300 rounded text-xs font-bold text-slate-800 shadow-2xs active:bg-blue-200 transition"
                      >
                        {getChar(ch)}
                      </button>
                    ))}
                    <button
                      onClick={onBackspace}
                      className="px-3 h-8 bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-700 rounded text-xs font-bold flex items-center justify-center gap-1 shadow-2xs transition"
                    >
                      <Delete className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                  </div>

                  <div className="flex gap-1 justify-center">
                    <button onClick={onTab} className="px-2.5 h-8 bg-slate-100 border border-slate-300 text-slate-700 rounded text-xs font-bold">
                      Tab
                    </button>
                    {enRow2.map((ch, i) => (
                      <button
                        key={i}
                        onClick={() => onKeyPress(getChar(ch))}
                        className="flex-1 min-w-[24px] h-8 bg-slate-50 hover:bg-blue-50 border border-slate-300 rounded text-xs font-bold text-slate-800 shadow-2xs active:bg-blue-200 transition"
                      >
                        {getChar(ch)}
                      </button>
                    ))}
                    <button
                      onClick={onEnter}
                      className="px-3 h-8 bg-blue-600 hover:bg-blue-700 border border-blue-700 text-white rounded text-xs font-bold flex items-center justify-center gap-1"
                    >
                      Enter
                    </button>
                  </div>

                  <div className="flex gap-1 justify-center">
                    <button
                      onClick={() => onUpdateState({ capsActive: !state.capsActive })}
                      className={`px-2 h-8 rounded text-xs font-bold border ${
                        state.capsActive ? 'bg-amber-500 text-white border-amber-600' : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      Caps
                    </button>
                    {enRow3.map((ch, i) => (
                      <button
                        key={i}
                        onClick={() => onKeyPress(getChar(ch))}
                        className="flex-1 min-w-[24px] h-8 bg-slate-50 hover:bg-blue-50 border border-slate-300 rounded text-xs font-bold text-slate-800 shadow-2xs active:bg-blue-200 transition"
                      >
                        {getChar(ch)}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-1 justify-center">
                    <button
                      onClick={toggleShift}
                      className={`px-3 h-8 rounded text-xs font-bold border ${
                        state.shiftActive ? 'bg-blue-600 text-white border-blue-700' : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      Shift
                    </button>
                    {enRow4.map((ch, i) => (
                      <button
                        key={i}
                        onClick={() => onKeyPress(getChar(ch))}
                        className="flex-1 min-w-[24px] h-8 bg-slate-50 hover:bg-blue-50 border border-slate-300 rounded text-xs font-bold text-slate-800 shadow-2xs active:bg-blue-200 transition"
                      >
                        {getChar(ch)}
                      </button>
                    ))}
                    <button
                      onClick={toggleShift}
                      className={`px-3 h-8 rounded text-xs font-bold border ${
                        state.shiftActive ? 'bg-blue-600 text-white border-blue-700' : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      Shift
                    </button>
                  </div>
                </>
              )}

              {/* Bottom Control Row */}
              <div className="flex gap-1 pt-1 justify-center">
                <button
                  onClick={toggleCtrl}
                  className={`px-3 h-8 rounded text-xs font-bold border ${
                    state.ctrlActive ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  Ctrl
                </button>
                <button
                  onClick={toggleAlt}
                  className={`px-3 h-8 rounded text-xs font-bold border ${
                    state.altActive ? 'bg-purple-600 text-white border-purple-700' : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  Alt
                </button>
                <button
                  onClick={toggleLanguage}
                  className="px-3 h-8 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 text-emerald-800 rounded text-xs font-bold flex items-center gap-1"
                >
                  <span>{state.language === 'ar' ? 'EN 🌐' : 'عربي 🌐'}</span>
                </button>
                <button
                  onClick={() => onKeyPress(' ')}
                  className="flex-[4] h-8 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded text-xs font-medium text-slate-700 shadow-2xs active:bg-slate-200 transition"
                >
                  مسافة (Space)
                </button>
                <button
                  onClick={onTab}
                  className="px-3 h-8 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded text-xs font-bold"
                >
                  Tab التالي
                </button>
                <button
                  onClick={toggleAlt}
                  className={`px-3 h-8 rounded text-xs font-bold border ${
                    state.altActive ? 'bg-purple-600 text-white border-purple-700' : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  Alt نشط ✓
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
