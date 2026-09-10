import React, { useState } from 'react';
import { X, Minus, Move, Keyboard as KeyboardIcon, Check } from 'lucide-react';

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
  targetEditorName = 'محرر النصوص',
}) => {
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [isCtrlActive, setIsCtrlActive] = useState(false);
  const [isAltActive, setIsAltActive] = useState(false);
  const [isCapsLock, setIsCapsLock] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDockedBottom, setIsDockedBottom] = useState(true);

  if (!isOpen) return null;

  // Handle clicking a key
  const handleKeyClick = (normalChar: string, shiftChar: string, actionName?: string) => {
    if (actionName) {
      if (actionName === 'Shift') {
        setIsShiftActive(prev => !prev);
        return;
      }
      if (actionName === 'Ctrl') {
        setIsCtrlActive(prev => !prev);
        return;
      }
      if (actionName === 'Alt') {
        setIsAltActive(prev => !prev);
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

    // Determine effective char
    const charToInsert = isShiftActive ? shiftChar : normalChar;

    // If Ctrl is active, check standard shortcuts
    if (isCtrlActive) {
      if (normalChar === 'ب' || normalChar === 'b') {
        onKeyPress('Ctrl+B', true);
      } else if (normalChar === 'ي' || normalChar === 'i') {
        onKeyPress('Ctrl+I', true);
      } else if (normalChar === 'ع' || normalChar === 'u') {
        onKeyPress('Ctrl+U', true);
      } else if (normalChar === 'ز' || normalChar === 'z') {
        onKeyPress('Ctrl+Z', true);
      } else if (normalChar === 'س' || normalChar === 's') {
        onKeyPress('Ctrl+S', true);
      } else if (normalChar === 'ف' || normalChar === 'f') {
        onKeyPress('Ctrl+F', true);
      } else {
        onKeyPress(charToInsert, false);
      }
      // Auto release Ctrl after shortcut unless user clicked repeatedly
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
        {/* Retro Header Bar matching user image */}
        <div className="bg-gradient-to-r from-[#e8e8e8] to-[#d8d8d8] border-b border-[#b5b5b5] px-3 py-1 flex items-center justify-between text-xs text-neutral-800">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 font-bold">
              <KeyboardIcon className="w-4 h-4 text-neutral-700" />
              <span>كيبورد عربي ملحق ({targetEditorName})</span>
            </div>
            {/* Retro Menu Bar */}
            <div className="flex items-center gap-3 text-[11px] text-neutral-700 font-medium">
              <span className="cursor-pointer hover:text-black">file</span>
              <span className="cursor-pointer hover:text-black">Edit</span>
              <span className="cursor-pointer hover:text-black">?</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
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
            {/* Status indicator badge */}
            <div className="flex items-center justify-between px-1 text-[11px] text-neutral-600">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${isShiftActive ? 'bg-amber-100 border-amber-400 text-amber-900' : 'bg-neutral-200 border-neutral-300'}`}>
                  Shift: {isShiftActive ? 'مفعّل (تشكيل ورموز)' : 'عادي'}
                </span>
                <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${isCtrlActive ? 'bg-cyan-100 border-cyan-400 text-cyan-900' : 'bg-neutral-200 border-neutral-300'}`}>
                  Ctrl: {isCtrlActive ? 'مفعّل (اختصارات)' : 'معطل'}
                </span>
                <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${isCapsLock ? 'bg-emerald-100 border-emerald-400 text-emerald-900' : 'bg-neutral-200 border-neutral-300'}`}>
                  Caps: {isCapsLock ? 'ثابت' : 'عادي'}
                </span>
              </div>
              <span className="text-[10px] text-neutral-500">
                انقر على أي حرف لإدراجه مباشرة في المستند أو الخلية
              </span>
            </div>

            {/* ROW 1 */}
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

            {/* ROW 2 */}
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
              <KeyButton normal="ج" shift="&lt;" onKey={handleKeyClick} />
              <KeyButton normal="د" shift="&gt;" onKey={handleKeyClick} />
              <button
                onClick={() => handleKeyClick('', '', 'Enter')}
                className="w-[12%] h-10 bg-gradient-to-b from-[#fbfbfb] to-[#dfdfdf] hover:from-[#ffffff] hover:to-[#cecece] active:from-[#d0d0d0] active:to-[#b8b8b8] border border-[#a8a8a8] rounded shadow-[0_1.5px_0_rgba(0,0,0,0.25)] flex items-center justify-center font-sans font-bold text-xs text-neutral-900 transition-all cursor-pointer"
              >
                Enter
              </button>
            </div>

            {/* ROW 3 */}
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

            {/* ROW 4 */}
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

            {/* ROW 5 (Special match with screenshot: Ctrl with cyan active box) */}
            <div className="flex items-center gap-1.5 w-full justify-between pt-0.5">
              <button
                onClick={() => handleKeyClick('', '', 'Ctrl')}
                className={`w-[12%] h-10 bg-gradient-to-b from-[#fbfbfb] to-[#dfdfdf] hover:from-[#ffffff] hover:to-[#cecece] rounded shadow-[0_1.5px_0_rgba(0,0,0,0.25)] flex items-center justify-center font-sans font-bold text-xs transition-all cursor-pointer ${
                  isCtrlActive
                    ? 'border-2 border-cyan-500 ring-2 ring-cyan-300 text-cyan-900 bg-cyan-50'
                    : 'border border-[#a8a8a8] text-neutral-800'
                }`}
              >
                Ctrl
              </button>
              <button
                onClick={() => handleKeyClick('', '', 'Alt')}
                className={`w-[9%] h-10 bg-gradient-to-b from-[#fbfbfb] to-[#dfdfdf] hover:from-[#ffffff] hover:to-[#cecece] rounded shadow-[0_1.5px_0_rgba(0,0,0,0.25)] flex items-center justify-center font-sans font-medium text-xs transition-all cursor-pointer ${
                  isAltActive ? 'border-2 border-purple-500 text-purple-900 bg-purple-50' : 'border border-[#a8a8a8] text-neutral-800'
                }`}
              >
                Alt
              </button>

              {/* Space Bar matching screenshot with light gradient */}
              <button
                onClick={() => handleKeyClick('', '', 'Space')}
                className="flex-1 h-10 bg-gradient-to-b from-[#f7f7f7] to-[#dcdcdc] hover:from-[#ffffff] hover:to-[#d0d0d0] active:from-[#cbcbcb] active:to-[#b0b0b0] border border-[#a8a8a8] rounded shadow-[0_1.5px_0_rgba(0,0,0,0.25)] flex items-center justify-center font-sans font-medium text-xs text-neutral-600 transition-all cursor-pointer"
              >
                مسافة
              </button>

              <button
                onClick={() => handleKeyClick('', '', 'Alt')}
                className={`w-[9%] h-10 bg-gradient-to-b from-[#fbfbfb] to-[#dfdfdf] hover:from-[#ffffff] hover:to-[#cecece] rounded shadow-[0_1.5px_0_rgba(0,0,0,0.25)] flex items-center justify-center font-sans font-medium text-xs transition-all cursor-pointer ${
                  isAltActive ? 'border-2 border-purple-500 text-purple-900 bg-purple-50' : 'border border-[#a8a8a8] text-neutral-800'
                }`}
              >
                Alt
              </button>
              <button
                onClick={() => handleKeyClick('', '', 'Ctrl')}
                className={`w-[12%] h-10 bg-gradient-to-b from-[#fbfbfb] to-[#dfdfdf] hover:from-[#ffffff] hover:to-[#cecece] rounded shadow-[0_1.5px_0_rgba(0,0,0,0.25)] flex items-center justify-center font-sans font-bold text-xs transition-all cursor-pointer ${
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
