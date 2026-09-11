import React, { useState } from 'react';
import { X, Minus, Keyboard as KeyboardIcon, Languages, Check } from 'lucide-react';

interface ArabicVirtualKeyboardProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyPress: (key: string, isAction?: boolean) => void;
  targetEditorName?: string;
}

export const ArabicVirtualKeyboard: React.FC<ArabicVirtualKeyboardProps> = ({
  isOpen,
  onClose,
  onKeyPress,
  targetEditorName = 'محرر النصوص وجداول البيانات',
}) => {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [isCtrlActive, setIsCtrlActive] = useState(false);
  const [isAltActive, setIsAltActive] = useState(false);
  const [isCapsLock, setIsCapsLock] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDockedBottom, setIsDockedBottom] = useState(true);

  if (!isOpen) return null;

  // Toggle between Arabic and English
  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'ar' ? 'en' : 'ar'));
    setIsShiftActive(false);
    setIsCtrlActive(false);
    setIsAltActive(false);
  };

  // Handle clicking a key
  const handleKeyClick = (normalChar: string, shiftChar: string, actionName?: string) => {
    if (actionName) {
      if (actionName === 'Lang') {
        toggleLanguage();
        return;
      }
      if (actionName === 'Shift') {
        // Alt + Shift shortcut toggles language
        if (isAltActive) {
          toggleLanguage();
          return;
        }
        setIsShiftActive(prev => !prev);
        return;
      }
      if (actionName === 'Alt') {
        // Shift + Alt shortcut toggles language
        if (isShiftActive) {
          toggleLanguage();
          return;
        }
        setIsAltActive(prev => !prev);
        return;
      }
      if (actionName === 'Ctrl') {
        setIsCtrlActive(prev => !prev);
        return;
      }
      if (actionName === 'CapsLoc') {
        setIsCapsLock(prev => !prev);
        return;
      }
      if (actionName === 'Enter') {
        onKeyPress('Enter', true);
        return;
      }
      if (actionName === 'Backspace') {
        onKeyPress('Backspace', true);
        return;
      }
      if (actionName === 'Tab') {
        onKeyPress('Tab', true);
        return;
      }
      if (actionName === 'Space') {
        onKeyPress(' ', false);
        return;
      }
    }

    // Determine effective char based on Shift and CapsLock
    let charToInsert = normalChar;
    if (language === 'en') {
      const isUpper = isCapsLock ? !isShiftActive : isShiftActive;
      // For alphabet letters in English
      if (/^[a-zA-Z]$/.test(normalChar)) {
        charToInsert = isUpper ? normalChar.toUpperCase() : normalChar.toLowerCase();
      } else {
        charToInsert = isShiftActive ? shiftChar : normalChar;
      }
    } else {
      // Arabic layout
      charToInsert = isShiftActive ? shiftChar : normalChar;
    }

    // If Ctrl is active, check standard shortcuts
    if (isCtrlActive) {
      const lower = normalChar.toLowerCase();
      if (lower === 'ب' || lower === 'b') {
        onKeyPress('Ctrl+B', true);
      } else if (lower === 'ي' || lower === 'i') {
        onKeyPress('Ctrl+I', true);
      } else if (lower === 'ع' || lower === 'u') {
        onKeyPress('Ctrl+U', true);
      } else if (lower === 'ز' || lower === 'z') {
        onKeyPress('Ctrl+Z', true);
      } else if (lower === 'س' || lower === 's') {
        onKeyPress('Ctrl+S', true);
      } else if (lower === 'ف' || lower === 'f') {
        onKeyPress('Ctrl+F', true);
      } else if (lower === 'a' || lower === 'ش') {
        onKeyPress('Ctrl+A', true);
      } else {
        onKeyPress(charToInsert, false);
      }
      // Auto release Ctrl after shortcut
      setIsCtrlActive(false);
      return;
    }

    onKeyPress(charToInsert, false);

    // If Shift was single-pressed, reset it after typing a character
    if (isShiftActive && !isCapsLock) {
      setIsShiftActive(false);
    }
  };

  return (
    <div
      dir="rtl"
      className={`fixed z-50 transition-all duration-200 ${
        isDockedBottom
          ? 'bottom-2 left-1/2 -translate-x-1/2 w-full max-w-4xl px-3'
          : 'top-20 left-1/2 -translate-x-1/2 w-full max-w-4xl px-3'
      }`}
    >
      <div className="bg-[#f0f0f0] border-2 border-[#a0a0a0] rounded-lg shadow-2xl overflow-hidden font-sans select-none text-neutral-900">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#e8e8e8] to-[#d8d8d8] border-b border-[#b5b5b5] px-3 py-1 flex items-center justify-between text-xs text-neutral-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-bold">
              <KeyboardIcon className="w-4 h-4 text-neutral-700" />
              <span>لوحة المفاتيح الملحقة ({targetEditorName})</span>
            </div>

            {/* Language Switcher Pill Button in Header */}
            <button
              onClick={toggleLanguage}
              title="التبديل بين العربية والإنجليزية (أو اضغط Alt+Shift)"
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold transition-all cursor-pointer shadow-xs border ${
                language === 'ar'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700'
                  : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-700'
              }`}
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'العربية (AR)' : 'English (EN)'}</span>
              <span className="text-[10px] opacity-80 underline mr-0.5">تبديل ⇄</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsDockedBottom(prev => !prev)}
              title={isDockedBottom ? 'إلغاء التثبيت بالأسفل' : 'تثبيت في أسفل الشاشة'}
              className="px-2 py-0.5 text-[10px] bg-neutral-200 hover:bg-neutral-300 border border-neutral-400 rounded text-neutral-700 font-medium"
            >
              {isDockedBottom ? 'تعويم' : 'تثبيت بالأسفل'}
            </button>
            <button
              onClick={() => setIsMinimized(prev => !prev)}
              className="p-1 hover:bg-neutral-300 rounded text-neutral-600"
              title={isMinimized ? 'تكبير' : 'تصغير'}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-red-500 hover:text-white rounded text-neutral-600"
              title="إغلاق الكيبورد"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Keyboard Body */}
        {!isMinimized && (
          <div className="p-2.5 bg-[#e4e4e4] flex flex-col gap-1.5">
            {/* Status indicator bar */}
            <div className="flex items-center justify-between px-1 text-[11px] text-neutral-600">
              <div className="flex items-center gap-2.5">
                <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${
                  language === 'ar' ? 'bg-emerald-100 border-emerald-400 text-emerald-900' : 'bg-blue-100 border-blue-400 text-blue-900'
                }`}>
                  🌐 اللغة: {language === 'ar' ? 'العربية (محرر عربي)' : 'English (EN Layout)'}
                </span>
                <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${isShiftActive ? 'bg-amber-100 border-amber-400 text-amber-900' : 'bg-neutral-200 border-neutral-300'}`}>
                  Shift: {isShiftActive ? (language === 'ar' ? 'مفعّل (تشكيل)' : 'مفعّل (رموز/كبير)') : 'عادي'}
                </span>
                <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${isCapsLock ? 'bg-indigo-100 border-indigo-400 text-indigo-900' : 'bg-neutral-200 border-neutral-300'}`}>
                  Caps: {isCapsLock ? 'مغلق (حروف كبيرة)' : 'عادي'}
                </span>
                <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${isCtrlActive ? 'bg-cyan-100 border-cyan-400 text-cyan-900' : 'bg-neutral-200 border-neutral-300'}`}>
                  Ctrl: {isCtrlActive ? 'مفعّل' : 'معطل'}
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-neutral-500">
                <span>يمكنك التبديل بين اللغتين بالضغط على</span>
                <kbd className="px-1 py-0.5 bg-neutral-200 border border-neutral-400 rounded text-[9px] font-mono">Alt+Shift</kbd>
                <span>أو زر</span>
                <kbd className="px-1.5 py-0.5 bg-blue-100 border border-blue-300 text-blue-900 rounded text-[9px] font-bold">عربي / EN</kbd>
              </div>
            </div>

            {/* CONDITIONAL KEYBOARD LAYOUT: ARABIC OR ENGLISH */}
            {language === 'ar' ? (
              /* ARABIC KEYBOARD LAYOUT */
              <>
                {/* ROW 1 (AR) */}
                <div className="flex items-center gap-1 w-full justify-between">
                  <KeyButton normal="ذ" shift="ّ" onKey={handleKeyClick} width="w-[6.5%]" />
                  <KeyButton normal="١" shift="!" onKey={handleKeyClick} width="w-[6.5%]" />
                  <KeyButton normal="٢" shift="@" onKey={handleKeyClick} width="w-[6.5%]" />
                  <KeyButton normal="٣" shift="#" onKey={handleKeyClick} width="w-[6.5%]" />
                  <KeyButton normal="٤" shift="$" onKey={handleKeyClick} width="w-[6.5%]" />
                  <KeyButton normal="٥" shift="%" onKey={handleKeyClick} width="w-[6.5%]" />
                  <KeyButton normal="٦" shift="^" onKey={handleKeyClick} width="w-[6.5%]" />
                  <KeyButton normal="٧" shift="&" onKey={handleKeyClick} width="w-[6.5%]" />
                  <KeyButton normal="٨" shift="*" onKey={handleKeyClick} width="w-[6.5%]" />
                  <KeyButton normal="٩" shift=")" onKey={handleKeyClick} width="w-[6.5%]" />
                  <KeyButton normal="٠" shift="(" onKey={handleKeyClick} width="w-[6.5%]" />
                  <KeyButton normal="-" shift="_" onKey={handleKeyClick} width="w-[6.5%]" />
                  <KeyButton normal="=" shift="+" onKey={handleKeyClick} width="w-[6.5%]" />
                  <button
                    onClick={() => handleKeyClick('', '', 'Backspace')}
                    className="w-[15%] h-10 bg-gradient-to-b from-[#fbfbfb] to-[#dfdfdf] hover:from-[#ffffff] hover:to-[#cecece] active:from-[#d0d0d0] active:to-[#b8b8b8] border border-[#a8a8a8] rounded shadow-[0_1.5px_0_rgba(0,0,0,0.25)] flex items-center justify-center font-mono font-bold text-xs text-neutral-800 transition-all cursor-pointer"
                    title="مسح للخلف"
                  >
                    &lt;---------
                  </button>
                </div>

                {/* ROW 2 (AR) */}
                <div className="flex items-center gap-1 w-full justify-between">
                  <button
                    onClick={() => handleKeyClick('', '', 'Tab')}
                    className="w-[9%] h-10 bg-gradient-to-b from-[#fbfbfb] to-[#dfdfdf] hover:from-[#ffffff] hover:to-[#cecece] border border-[#a8a8a8] rounded shadow-[0_1.5px_0_rgba(0,0,0,0.25)] flex items-center justify-center font-sans font-semibold text-xs text-neutral-800 transition-all cursor-pointer"
                  >
                    Tab
                  </button>
                  <KeyButton normal="ض" shift="َ" onKey={handleKeyClick} />
                  <KeyButton normal="ص" shift="ً" onKey={handleKeyClick} />
                  <KeyButton normal="ث" shift="ُ" onKey={handleKeyClick} />
                  <KeyButton normal="ق" shift="ٌ" onKey={handleKeyClick} />
                  <KeyButton normal="ف" shift="لإ" onKey={handleKeyClick} />
                  <KeyButton normal="غ" shift="إ" onKey={handleKeyClick} />
                  <KeyButton normal="ع" shift="'" onKey={handleKeyClick} />
                  <KeyButton normal="ه" shift="÷" onKey={handleKeyClick} />
                  <KeyButton normal="خ" shift="×" onKey={handleKeyClick} />
                  <KeyButton normal="ح" shift="؛" onKey={handleKeyClick} />
                  <KeyButton normal="ج" shift="<" onKey={handleKeyClick} />
                  <KeyButton normal="د" shift=">" onKey={handleKeyClick} />
                  <button
                    onClick={() => handleKeyClick('', '', 'Enter')}
                    className="w-[12%] h-10 bg-gradient-to-b from-[#fbfbfb] to-[#dfdfdf] hover:from-[#ffffff] hover:to-[#cecece] active:from-[#d0d0d0] active:to-[#b8b8b8] border border-[#a8a8a8] rounded shadow-[0_1.5px_0_rgba(0,0,0,0.25)] flex items-center justify-center font-sans font-bold text-xs text-neutral-900 transition-all cursor-pointer"
                  >
                    Enter
                  </button>
                </div>

                {/* ROW 3 (AR) */}
                <div className="flex items-center gap-1 w-full justify-between">
                  <button
                    onClick={() => handleKeyClick('', '', 'CapsLoc')}
                    className={`w-[11%] h-10 bg-gradient-to-b from-[#fbfbfb] to-[#dfdfdf] hover:from-[#ffffff] hover:to-[#cecece] border rounded shadow-[0_1.5px_0_rgba(0,0,0,0.25)] flex items-center justify-center font-sans font-semibold text-xs transition-all cursor-pointer ${
                      isCapsLock ? 'border-emerald-500 ring-2 ring-emerald-400 text-emerald-800' : 'border-[#a8a8a8] text-neutral-800'
                    }`}
                  >
                    CapsLoc
                  </button>
                  <KeyButton normal="ش" shift="ِ" onKey={handleKeyClick} />
                  <KeyButton normal="س" shift="ٍ" onKey={handleKeyClick} />
                  <KeyButton normal="ي" shift="]" onKey={handleKeyClick} />
                  <KeyButton normal="ب" shift="[" onKey={handleKeyClick} />
                  <KeyButton normal="ل" shift="لأ" onKey={handleKeyClick} />
                  <KeyButton normal="ا" shift="أ" onKey={handleKeyClick} />
                  <KeyButton normal="ت" shift="ـ" onKey={handleKeyClick} />
                  <KeyButton normal="ن" shift="،" onKey={handleKeyClick} />
                  <KeyButton normal="م" shift="/" onKey={handleKeyClick} />
                  <KeyButton normal="ك" shift=":" onKey={handleKeyClick} />
                  <KeyButton normal="ط" shift="&quot;" onKey={handleKeyClick} />
                  <KeyButton normal="\" shift="|" onKey={handleKeyClick} />
                </div>

                {/* ROW 4 (AR) */}
                <div className="flex items-center gap-1 w-full justify-between">
                  <button
                    onClick={() => handleKeyClick('', '', 'Shift')}
                    className={`w-[10%] h-10 bg-gradient-to-b from-[#fbfbfb] to-[#dfdfdf] hover:from-[#ffffff] hover:to-[#cecece] border rounded shadow-[0_1.5px_0_rgba(0,0,0,0.25)] flex items-center justify-center font-sans font-semibold text-xs transition-all cursor-pointer ${
                      isShiftActive ? 'border-amber-500 ring-2 ring-amber-400 text-amber-900 bg-amber-50' : 'border-[#a8a8a8] text-neutral-800'
                    }`}
                  >
                    Shift
                  </button>
                  <KeyButton normal="\" shift="|" onKey={handleKeyClick} />
                  <KeyButton normal="ئ" shift="~" onKey={handleKeyClick} />
                  <KeyButton normal="ء" shift="ْ" onKey={handleKeyClick} />
                  <KeyButton normal="ؤ" shift="}" onKey={handleKeyClick} />
                  <KeyButton normal="ر" shift="{" onKey={handleKeyClick} />
                  <KeyButton normal="لا" shift="لآ" onKey={handleKeyClick} />
                  <KeyButton normal="ى" shift="آ" onKey={handleKeyClick} />
                  <KeyButton normal="ة" shift="’" onKey={handleKeyClick} />
                  <KeyButton normal="و" shift="," onKey={handleKeyClick} />
                  <KeyButton normal="ز" shift="." onKey={handleKeyClick} />
                  <KeyButton normal="ظ" shift="؟" onKey={handleKeyClick} />
                  <button
                    onClick={() => handleKeyClick('', '', 'Shift')}
                    className={`w-[10%] h-10 bg-gradient-to-b from-[#fbfbfb] to-[#dfdfdf] hover:from-[#ffffff] hover:to-[#cecece] border rounded shadow-[0_1.5px_0_rgba(0,0,0,0.25)] flex items-center justify-center font-sans font-semibold text-xs transition-all cursor-pointer ${
                      isShiftActive ? 'border-amber-500 ring-2 ring-amber-400 text-amber-900 bg-amber-50' : 'border-[#a8a8a8] text-neutral-800'
                    }`}
                  >
                    Shift
                  </button>
                </div>
              </>
            ) : (
              /* ENGLISH KEYBOARD LAYOUT (QWERTY) */
              <>
                {/* ROW 1 (EN) */}
                <div className="flex items-center gap-1 w-full justify-between">
                  <KeyButton normal="`" shift="~" onKey={handleKeyClick} width="w-[6.5%]" />
                  <KeyButton normal="1" shift="!" onKey={handleKeyClick} width="w-[6.5%]" />
                  <KeyButton normal="2" shift="@" onKey={handleKeyClick} width="w-[6.5%]" />
                  <KeyButton normal="3" shift="#" onKey={handleKeyClick} width="w-[6.5%]" />
                  <KeyButton normal="4" shift="$" onKey={handleKeyClick} width="w-[6.5%]" />
                  <KeyButton normal="5" shift="%" onKey={handleKeyClick} width="w-[6.5%]" />
                  <KeyButton normal="6" shift="^" onKey={handleKeyClick} width="w-[6.5%]" />
                  <KeyButton normal="7" shift="&" onKey={handleKeyClick} width="w-[6.5%]" />
                  <KeyButton normal="8" shift="*" onKey={handleKeyClick} width="w-[6.5%]" />
                  <KeyButton normal="9" shift="(" onKey={handleKeyClick} width="w-[6.5%]" />
                  <KeyButton normal="0" shift=")" onKey={handleKeyClick} width="w-[6.5%]" />
                  <KeyButton normal="-" shift="_" onKey={handleKeyClick} width="w-[6.5%]" />
                  <KeyButton normal="=" shift="+" onKey={handleKeyClick} width="w-[6.5%]" />
                  <button
                    onClick={() => handleKeyClick('', '', 'Backspace')}
                    className="w-[15%] h-10 bg-gradient-to-b from-[#fbfbfb] to-[#dfdfdf] hover:from-[#ffffff] hover:to-[#cecece] active:from-[#d0d0d0] active:to-[#b8b8b8] border border-[#a8a8a8] rounded shadow-[0_1.5px_0_rgba(0,0,0,0.25)] flex items-center justify-center font-mono font-bold text-xs text-neutral-800 transition-all cursor-pointer"
                    title="Backspace"
                  >
                    &lt;---------
                  </button>
                </div>

                {/* ROW 2 (EN) */}
                <div className="flex items-center gap-1 w-full justify-between">
                  <button
                    onClick={() => handleKeyClick('', '', 'Tab')}
                    className="w-[9%] h-10 bg-gradient-to-b from-[#fbfbfb] to-[#dfdfdf] hover:from-[#ffffff] hover:to-[#cecece] border border-[#a8a8a8] rounded shadow-[0_1.5px_0_rgba(0,0,0,0.25)] flex items-center justify-center font-sans font-semibold text-xs text-neutral-800 transition-all cursor-pointer"
                  >
                    Tab
                  </button>
                  <KeyButton normal={isCapsLock ? (isShiftActive ? 'q' : 'Q') : (isShiftActive ? 'Q' : 'q')} shift="Q" onKey={handleKeyClick} />
                  <KeyButton normal={isCapsLock ? (isShiftActive ? 'w' : 'W') : (isShiftActive ? 'W' : 'w')} shift="W" onKey={handleKeyClick} />
                  <KeyButton normal={isCapsLock ? (isShiftActive ? 'e' : 'E') : (isShiftActive ? 'E' : 'e')} shift="E" onKey={handleKeyClick} />
                  <KeyButton normal={isCapsLock ? (isShiftActive ? 'r' : 'R') : (isShiftActive ? 'R' : 'r')} shift="R" onKey={handleKeyClick} />
                  <KeyButton normal={isCapsLock ? (isShiftActive ? 't' : 'T') : (isShiftActive ? 'T' : 't')} shift="T" onKey={handleKeyClick} />
                  <KeyButton normal={isCapsLock ? (isShiftActive ? 'y' : 'Y') : (isShiftActive ? 'Y' : 'y')} shift="Y" onKey={handleKeyClick} />
                  <KeyButton normal={isCapsLock ? (isShiftActive ? 'u' : 'U') : (isShiftActive ? 'U' : 'u')} shift="U" onKey={handleKeyClick} />
                  <KeyButton normal={isCapsLock ? (isShiftActive ? 'i' : 'I') : (isShiftActive ? 'I' : 'i')} shift="I" onKey={handleKeyClick} />
                  <KeyButton normal={isCapsLock ? (isShiftActive ? 'o' : 'O') : (isShiftActive ? 'O' : 'o')} shift="O" onKey={handleKeyClick} />
                  <KeyButton normal={isCapsLock ? (isShiftActive ? 'p' : 'P') : (isShiftActive ? 'P' : 'p')} shift="P" onKey={handleKeyClick} />
                  <KeyButton normal="[" shift="{" onKey={handleKeyClick} />
                  <KeyButton normal="]" shift="}" onKey={handleKeyClick} />
                  <button
                    onClick={() => handleKeyClick('', '', 'Enter')}
                    className="w-[12%] h-10 bg-gradient-to-b from-[#fbfbfb] to-[#dfdfdf] hover:from-[#ffffff] hover:to-[#cecece] active:from-[#d0d0d0] active:to-[#b8b8b8] border border-[#a8a8a8] rounded shadow-[0_1.5px_0_rgba(0,0,0,0.25)] flex items-center justify-center font-sans font-bold text-xs text-neutral-900 transition-all cursor-pointer"
                  >
                    Enter
                  </button>
                </div>

                {/* ROW 3 (EN) */}
                <div className="flex items-center gap-1 w-full justify-between">
                  <button
                    onClick={() => handleKeyClick('', '', 'CapsLoc')}
                    className={`w-[11%] h-10 bg-gradient-to-b from-[#fbfbfb] to-[#dfdfdf] hover:from-[#ffffff] hover:to-[#cecece] border rounded shadow-[0_1.5px_0_rgba(0,0,0,0.25)] flex items-center justify-center font-sans font-semibold text-xs transition-all cursor-pointer ${
                      isCapsLock ? 'border-indigo-500 ring-2 ring-indigo-400 text-indigo-900 bg-indigo-50' : 'border-[#a8a8a8] text-neutral-800'
                    }`}
                  >
                    Caps
                  </button>
                  <KeyButton normal={isCapsLock ? (isShiftActive ? 'a' : 'A') : (isShiftActive ? 'A' : 'a')} shift="A" onKey={handleKeyClick} />
                  <KeyButton normal={isCapsLock ? (isShiftActive ? 's' : 'S') : (isShiftActive ? 'S' : 's')} shift="S" onKey={handleKeyClick} />
                  <KeyButton normal={isCapsLock ? (isShiftActive ? 'd' : 'D') : (isShiftActive ? 'D' : 'd')} shift="D" onKey={handleKeyClick} />
                  <KeyButton normal={isCapsLock ? (isShiftActive ? 'f' : 'F') : (isShiftActive ? 'F' : 'f')} shift="F" onKey={handleKeyClick} />
                  <KeyButton normal={isCapsLock ? (isShiftActive ? 'g' : 'G') : (isShiftActive ? 'G' : 'g')} shift="G" onKey={handleKeyClick} />
                  <KeyButton normal={isCapsLock ? (isShiftActive ? 'h' : 'H') : (isShiftActive ? 'H' : 'h')} shift="H" onKey={handleKeyClick} />
                  <KeyButton normal={isCapsLock ? (isShiftActive ? 'j' : 'J') : (isShiftActive ? 'J' : 'j')} shift="J" onKey={handleKeyClick} />
                  <KeyButton normal={isCapsLock ? (isShiftActive ? 'k' : 'K') : (isShiftActive ? 'K' : 'k')} shift="K" onKey={handleKeyClick} />
                  <KeyButton normal={isCapsLock ? (isShiftActive ? 'l' : 'L') : (isShiftActive ? 'L' : 'l')} shift="L" onKey={handleKeyClick} />
                  <KeyButton normal=";" shift=":" onKey={handleKeyClick} />
                  <KeyButton normal="'" shift="&quot;" onKey={handleKeyClick} />
                  <KeyButton normal="\" shift="|" onKey={handleKeyClick} />
                </div>

                {/* ROW 4 (EN) */}
                <div className="flex items-center gap-1 w-full justify-between">
                  <button
                    onClick={() => handleKeyClick('', '', 'Shift')}
                    className={`w-[10%] h-10 bg-gradient-to-b from-[#fbfbfb] to-[#dfdfdf] hover:from-[#ffffff] hover:to-[#cecece] border rounded shadow-[0_1.5px_0_rgba(0,0,0,0.25)] flex items-center justify-center font-sans font-semibold text-xs transition-all cursor-pointer ${
                      isShiftActive ? 'border-amber-500 ring-2 ring-amber-400 text-amber-900 bg-amber-50' : 'border-[#a8a8a8] text-neutral-800'
                    }`}
                  >
                    Shift
                  </button>
                  <KeyButton normal="\" shift="|" onKey={handleKeyClick} />
                  <KeyButton normal={isCapsLock ? (isShiftActive ? 'z' : 'Z') : (isShiftActive ? 'Z' : 'z')} shift="Z" onKey={handleKeyClick} />
                  <KeyButton normal={isCapsLock ? (isShiftActive ? 'x' : 'X') : (isShiftActive ? 'X' : 'x')} shift="X" onKey={handleKeyClick} />
                  <KeyButton normal={isCapsLock ? (isShiftActive ? 'c' : 'C') : (isShiftActive ? 'C' : 'c')} shift="C" onKey={handleKeyClick} />
                  <KeyButton normal={isCapsLock ? (isShiftActive ? 'v' : 'V') : (isShiftActive ? 'V' : 'v')} shift="V" onKey={handleKeyClick} />
                  <KeyButton normal={isCapsLock ? (isShiftActive ? 'b' : 'B') : (isShiftActive ? 'B' : 'b')} shift="B" onKey={handleKeyClick} />
                  <KeyButton normal={isCapsLock ? (isShiftActive ? 'n' : 'N') : (isShiftActive ? 'N' : 'n')} shift="N" onKey={handleKeyClick} />
                  <KeyButton normal={isCapsLock ? (isShiftActive ? 'm' : 'M') : (isShiftActive ? 'M' : 'm')} shift="M" onKey={handleKeyClick} />
                  <KeyButton normal="," shift="<" onKey={handleKeyClick} />
                  <KeyButton normal="." shift=">" onKey={handleKeyClick} />
                  <KeyButton normal="/" shift="?" onKey={handleKeyClick} />
                  <button
                    onClick={() => handleKeyClick('', '', 'Shift')}
                    className={`w-[10%] h-10 bg-gradient-to-b from-[#fbfbfb] to-[#dfdfdf] hover:from-[#ffffff] hover:to-[#cecece] border rounded shadow-[0_1.5px_0_rgba(0,0,0,0.25)] flex items-center justify-center font-sans font-semibold text-xs transition-all cursor-pointer ${
                      isShiftActive ? 'border-amber-500 ring-2 ring-amber-400 text-amber-900 bg-amber-50' : 'border-[#a8a8a8] text-neutral-800'
                    }`}
                  >
                    Shift
                  </button>
                </div>
              </>
            )}

            {/* ROW 5 (COMMON FOR BOTH LANGUAGES: WITH DEDICATED LANGUAGE SWITCH KEYS) */}
            <div className="flex items-center gap-1.5 w-full justify-between pt-0.5">
              <button
                onClick={() => handleKeyClick('', '', 'Ctrl')}
                className={`w-[10%] h-10 bg-gradient-to-b from-[#fbfbfb] to-[#dfdfdf] hover:from-[#ffffff] hover:to-[#cecece] rounded shadow-[0_1.5px_0_rgba(0,0,0,0.25)] flex items-center justify-center font-sans font-bold text-xs transition-all cursor-pointer ${
                  isCtrlActive
                    ? 'border-2 border-cyan-500 ring-2 ring-cyan-300 text-cyan-900 bg-cyan-50'
                    : 'border border-[#a8a8a8] text-neutral-800'
                }`}
              >
                Ctrl
              </button>

              <button
                onClick={() => handleKeyClick('', '', 'Alt')}
                className={`w-[8%] h-10 bg-gradient-to-b from-[#fbfbfb] to-[#dfdfdf] hover:from-[#ffffff] hover:to-[#cecece] rounded shadow-[0_1.5px_0_rgba(0,0,0,0.25)] flex items-center justify-center font-sans font-medium text-xs transition-all cursor-pointer ${
                  isAltActive ? 'border-2 border-purple-500 text-purple-900 bg-purple-50' : 'border border-[#a8a8a8] text-neutral-800'
                }`}
              >
                Alt
              </button>

              {/* DEDICATED LANGUAGE SWITCH KEY 1 */}
              <button
                onClick={toggleLanguage}
                title="التبديل بين العربية والإنجليزية"
                className={`h-10 px-3 flex items-center justify-center gap-1 rounded font-bold text-xs shadow-[0_1.5px_0_rgba(0,0,0,0.25)] transition-all cursor-pointer border ${
                  language === 'ar'
                    ? 'bg-gradient-to-b from-blue-50 to-blue-200 hover:from-blue-100 hover:to-blue-300 border-blue-400 text-blue-900'
                    : 'bg-gradient-to-b from-emerald-50 to-emerald-200 hover:from-emerald-100 hover:to-emerald-300 border-emerald-400 text-emerald-900'
                }`}
              >
                <Languages className="w-3.5 h-3.5 shrink-0" />
                <span>{language === 'ar' ? 'EN' : 'عربي'}</span>
              </button>

              {/* Space Bar */}
              <button
                onClick={() => handleKeyClick('', '', 'Space')}
                className="flex-1 h-10 bg-gradient-to-b from-[#f7f7f7] to-[#dcdcdc] hover:from-[#ffffff] hover:to-[#d0d0d0] active:from-[#cbcbcb] active:to-[#b0b0b0] border border-[#a8a8a8] rounded shadow-[0_1.5px_0_rgba(0,0,0,0.25)] flex items-center justify-center font-sans font-medium text-xs text-neutral-600 transition-all cursor-pointer"
              >
                {language === 'ar' ? 'مسافة (Space)' : 'Space (مسافة)'}
              </button>

              {/* DEDICATED LANGUAGE SWITCH KEY 2 */}
              <button
                onClick={toggleLanguage}
                title="التبديل بين العربية والإنجليزية"
                className={`h-10 px-3 flex items-center justify-center gap-1 rounded font-bold text-xs shadow-[0_1.5px_0_rgba(0,0,0,0.25)] transition-all cursor-pointer border ${
                  language === 'ar'
                    ? 'bg-gradient-to-b from-blue-50 to-blue-200 hover:from-blue-100 hover:to-blue-300 border-blue-400 text-blue-900'
                    : 'bg-gradient-to-b from-emerald-50 to-emerald-200 hover:from-emerald-100 hover:to-emerald-300 border-emerald-400 text-emerald-900'
                }`}
              >
                <Languages className="w-3.5 h-3.5 shrink-0" />
                <span>{language === 'ar' ? 'EN' : 'عربي'}</span>
              </button>

              <button
                onClick={() => handleKeyClick('', '', 'Alt')}
                className={`w-[8%] h-10 bg-gradient-to-b from-[#fbfbfb] to-[#dfdfdf] hover:from-[#ffffff] hover:to-[#cecece] rounded shadow-[0_1.5px_0_rgba(0,0,0,0.25)] flex items-center justify-center font-sans font-medium text-xs transition-all cursor-pointer ${
                  isAltActive ? 'border-2 border-purple-500 text-purple-900 bg-purple-50' : 'border border-[#a8a8a8] text-neutral-800'
                }`}
              >
                Alt
              </button>

              <button
                onClick={() => handleKeyClick('', '', 'Ctrl')}
                className={`w-[10%] h-10 bg-gradient-to-b from-[#fbfbfb] to-[#dfdfdf] hover:from-[#ffffff] hover:to-[#cecece] rounded shadow-[0_1.5px_0_rgba(0,0,0,0.25)] flex items-center justify-center font-sans font-bold text-xs transition-all cursor-pointer ${
                  isCtrlActive
                    ? 'border-2 border-cyan-500 ring-2 ring-cyan-300 text-cyan-900 bg-cyan-50'
                    : 'border border-[#a8a8a8] text-neutral-800'
                }`}
              >
                Ctrl
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable individual key button component
const KeyButton: React.FC<{
  normal: string;
  shift: string;
  onKey: (normal: string, shift: string) => void;
  width?: string;
}> = ({ normal, shift, onKey, width = 'flex-1' }) => {
  return (
    <button
      onClick={() => onKey(normal, shift)}
      className={`${width} h-10 min-w-[28px] bg-gradient-to-b from-[#fefefe] to-[#dfdfdf] hover:from-[#ffffff] hover:to-[#d0d0d0] active:from-[#cecece] active:to-[#b6b6b6] border border-[#a8a8a8] hover:border-[#888888] rounded shadow-[0_1.5px_0_rgba(0,0,0,0.22)] flex flex-col items-center justify-center transition-all cursor-pointer leading-tight`}
    >
      <span className="text-[10px] text-neutral-400 font-mono select-none">{shift}</span>
      <span className="text-sm font-bold text-neutral-900 font-sans select-none">{normal}</span>
    </button>
  );
};
