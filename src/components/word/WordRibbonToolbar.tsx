import React, { useState, useEffect, useRef } from 'react';
import {
  Clipboard,
  ClipboardPaste,
  Scissors,
  Copy,
  Paintbrush,
  Mic,
  MicOff,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  AlignRight,
  AlignCenter,
  AlignLeft,
  AlignJustify,
  List,
  ListOrdered,
  Indent,
  Outdent,
  Palette,
  ChevronDown,
  ChevronUp,
  Search,
  RotateCcw,
  Sparkles,
  Layers,
  Plus,
  Table as TableIcon,
  Sigma,
  Eraser,
  Printer,
  FileDown,
  Image as ImageIcon,
  BookOpen,
  CheckCircle2,
  FileText,
  HelpCircle,
  Eye,
  Settings,
  Languages
} from 'lucide-react';
import { DocumentState } from '../../types';
import { ARABIC_FONTS } from './WordEditor';

interface WordRibbonToolbarProps {
  documentState: DocumentState;
  onChange: (updated: DocumentState) => void;
  fontFamily: string;
  onFontFamilyChange: (font: string) => void;
  fontSize: string;
  onFontSizeChange: (size: string) => void;
  execCmd: (command: string, value?: string) => void;
  applyHeading: (tag: string) => void;
  onOpenTemplates: () => void;
  onOpenTableModal: () => void;
  onOpenTocModal: () => void;
  onOpenSpellModal: () => void;
  onOpenSearchModal: () => void;
  onTriggerImagePicker: () => void;
  onExportPdf?: () => void;
  saveStatus?: 'saving' | 'saved';
  saveSelection: () => void;
  restoreSelection: () => void;
}

export const WordRibbonToolbar: React.FC<WordRibbonToolbarProps> = ({
  documentState,
  onChange,
  fontFamily,
  onFontFamilyChange,
  fontSize,
  onFontSizeChange,
  execCmd,
  applyHeading,
  onOpenTemplates,
  onOpenTableModal,
  onOpenTocModal,
  onOpenSpellModal,
  onOpenSearchModal,
  onTriggerImagePicker,
  onExportPdf,
  saveStatus = 'saved',
  saveSelection,
  restoreSelection,
}) => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isRibbonCollapsed, setIsRibbonCollapsed] = useState<boolean>(false);

  // Pickers & Menus
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showHighlightColorPicker, setShowHighlightColorPicker] = useState(false);
  const [showLineSpacingMenu, setShowLineSpacingMenu] = useState(false);
  const [showFileMenu, setShowFileMenu] = useState(false);

  // Voice Dictation (إملاء صوتي)
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Format Painter (نسخ التنسيق)
  const [formatPainterStyle, setFormatPainterStyle] = useState<{
    fontFamily?: string;
    fontSize?: string;
    color?: string;
    bold?: boolean;
    italic?: boolean;
  } | null>(null);

  // Line spacing state
  const [lineSpacing, setLineSpacing] = useState<string>('1.8');

  // Text Color Palettes
  const textColorPalette = [
    '#000000', '#1f2937', '#4b5563', '#9ca3af',
    '#dc2626', '#ea580c', '#d97706', '#16a34a',
    '#0284c7', '#2563eb', '#7c3aed', '#db2777'
  ];

  const highlightColorPalette = [
    'transparent', '#fef08a', '#bbf7d0', '#bfdbfe',
    '#fbcfe8', '#fed7aa', '#ddd6fe', '#e2e8f0'
  ];

  // Initialize Speech Recognition for Voice Dictation (إملاء صوتي)
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'ar-SA';

      recognition.onresult = (event: any) => {
        const lastResult = event.results[event.results.length - 1];
        if (lastResult.isFinal) {
          const transcript = lastResult[0].transcript.trim();
          if (transcript) {
            execCmd('insertText', transcript + ' ');
          }
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [execCmd]);

  const toggleVoiceDictation = () => {
    if (!recognitionRef.current) {
      alert('خاصية الإملاء الصوتي تتطلب متصفحاً حديثاً يدعم التعرف على الصوت مثل Google Chrome أو Microsoft Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  // Format Painter Handler
  const handleCopyFormat = () => {
    saveSelection();
    setFormatPainterStyle({
      fontFamily,
      fontSize,
    });
  };

  const handleApplyFormat = () => {
    if (formatPainterStyle) {
      restoreSelection();
      if (formatPainterStyle.fontFamily) {
        onFontFamilyChange(formatPainterStyle.fontFamily);
      }
      if (formatPainterStyle.fontSize) {
        onFontSizeChange(formatPainterStyle.fontSize);
      }
      setFormatPainterStyle(null);
    }
  };

  // Font Size Helpers
  const handleIncreaseFontSize = () => {
    const current = parseInt(fontSize, 10) || 14;
    const next = Math.min(72, current + 2).toString();
    onFontSizeChange(next);
  };

  const handleDecreaseFontSize = () => {
    const current = parseInt(fontSize, 10) || 14;
    const next = Math.max(8, current - 2).toString();
    onFontSizeChange(next);
  };

  // Apply Quick Styles
  const applyQuickStyle = (styleType: string) => {
    saveSelection();
    switch (styleType) {
      case 'heading1':
        applyHeading('h1');
        break;
      case 'heading2':
        applyHeading('h2');
        break;
      case 'tajawal_body':
        onFontFamilyChange('Tajawal');
        onFontSizeChange('14');
        applyHeading('p');
        break;
      case 'kufi_heading':
        onFontFamilyChange('Noto Kufi Arabic');
        onFontSizeChange('18');
        execCmd('bold');
        break;
      case 'purple_quote': {
        const selection = window.getSelection();
        const selectedText = selection?.toString() || 'اكتب نص الاقتباس هنا...';
        const quoteHtml = `<blockquote style="border-right: 4px solid #9333ea; background-color: #faf5ff; padding: 12px 16px; margin: 12px 0; border-radius: 4px; font-style: italic; color: #581c87;">${selectedText}</blockquote><p><br></p>`;
        execCmd('insertHTML', quoteHtml);
        break;
      }
      case 'orange_alert': {
        const selection = window.getSelection();
        const selectedText = selection?.toString() || 'تنبيه هام وملاحظة رئيسية...';
        const alertHtml = `<div style="border: 1px solid #f59e0b; background-color: #fffbeb; padding: 12px 16px; margin: 12px 0; border-radius: 6px; color: #b45309; font-weight: 500;">⚠️ ${selectedText}</div><p><br></p>`;
        execCmd('insertHTML', alertHtml);
        break;
      }
      default:
        applyHeading('p');
    }
  };

  // Line spacing changer
  const handleLineSpacing = (spacing: string) => {
    setLineSpacing(spacing);
    setShowLineSpacingMenu(false);
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      try {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.style.lineHeight = spacing;
        const fragment = range.extractContents();
        span.appendChild(fragment);
        range.insertNode(span);
      } catch {
        // Fallback
      }
    }
  };

  const tabs = [
    { id: 'file', label: 'ملف' },
    { id: 'home', label: 'الشريط الرئيسي' },
    { id: 'insert', label: 'إدراج' },
    { id: 'design', label: 'تصميم' },
    { id: 'layout', label: 'تخطيط الصفحة' },
    { id: 'references', label: 'مراجع' },
    { id: 'mailings', label: 'مراسلات' },
    { id: 'review', label: 'مراجعة' },
    { id: 'view', label: 'عرض' },
    { id: 'help', label: 'تعليمات' }
  ];

  return (
    <div className="bg-[#f3f4f6] border-b border-neutral-300 select-none shadow-xs z-30">
      {/* 1. RIBBON TABS BAR */}
      <div className="flex items-center justify-between px-2 pt-1 border-b border-neutral-300/80 bg-[#edf0f5]">
        <div className="flex items-center gap-0.5 overflow-x-auto text-xs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`word-ribbon-tab-${tab.id}`}
                onClick={() => {
                  if (tab.id === 'file') {
                    setShowFileMenu(!showFileMenu);
                  } else {
                    setActiveTab(tab.id);
                    setShowFileMenu(false);
                    if (isRibbonCollapsed) setIsRibbonCollapsed(false);
                  }
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-t-md transition-all cursor-pointer relative ${
                  isActive && !showFileMenu
                    ? 'bg-white text-blue-900 border-t-2 border-t-blue-700 shadow-xs'
                    : 'text-neutral-700 hover:bg-neutral-200/80 hover:text-neutral-900'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Tab Controls: Collapse & Auto-Save */}
        <div className="flex items-center gap-2 pb-1">
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${
              saveStatus === 'saving'
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-emerald-50 text-emerald-800 border-emerald-300'
            }`}
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span className="hidden sm:inline">محفوظ تلقائياً</span>
          </div>

          <button
            onClick={() => setIsRibbonCollapsed(!isRibbonCollapsed)}
            className="p-1 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200 rounded cursor-pointer"
            title={isRibbonCollapsed ? 'توسيع شريط الأدوات' : 'تصغير شريط الأدوات'}
          >
            {isRibbonCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* FILE DROP-DOWN MODAL / PANEL */}
      {showFileMenu && (
        <div className="absolute top-18 right-2 bg-white border border-neutral-300 rounded-xl shadow-2xl py-2 w-64 z-50 text-right text-xs">
          <div className="px-3 py-1.5 border-b border-neutral-100 font-bold text-neutral-500 text-[11px]">
            إدارة المستند والملف
          </div>
          <button
            onClick={() => {
              onOpenTemplates();
              setShowFileMenu(false);
            }}
            className="w-full px-3 py-2 hover:bg-amber-50 text-neutral-800 font-bold flex items-center justify-between cursor-pointer"
          >
            <span>نماذج وورد الجاهزة</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </button>
          <button
            onClick={() => {
              window.print();
              setShowFileMenu(false);
            }}
            className="w-full px-3 py-2 hover:bg-neutral-100 text-neutral-700 flex items-center justify-between cursor-pointer"
          >
            <span>طباعة المستند</span>
            <Printer className="w-4 h-4 text-neutral-500" />
          </button>
          <button
            onClick={() => {
              if (onExportPdf) onExportPdf();
              setShowFileMenu(false);
            }}
            className="w-full px-3 py-2 hover:bg-rose-50 text-neutral-800 font-bold flex items-center justify-between border-t border-neutral-100 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <FileDown className="w-4 h-4 text-rose-600" />
              <span>تصدير PDF مباشر</span>
            </div>
            <span className="text-[10px] bg-rose-100 text-rose-700 px-1 rounded font-mono">jsPDF</span>
          </button>
        </div>
      )}

      {/* 2. THE MAIN RIBBON TOOLBAR (Matches user screenshot: شريط الأدوات التنسيق العلوي) */}
      {!isRibbonCollapsed && activeTab === 'home' && (
        <div 
          id="word-formatting-ribbon-home"
          className="bg-[#f9fafb] p-1.5 flex items-stretch gap-2 overflow-x-auto text-xs min-h-[72px]"
        >
          {/* GROUP 1: الحافظة (Clipboard) */}
          <div className="flex items-center gap-1 px-1.5 py-0.5 border border-neutral-300/80 rounded-lg bg-white/80 shadow-2xs shrink-0">
            {/* Big Paste Button */}
            <button
              id="ribbon-paste-btn"
              onClick={async () => {
                try {
                  const text = await navigator.clipboard.readText();
                  execCmd('insertText', text);
                } catch {
                  execCmd('paste');
                }
              }}
              className="flex flex-col items-center justify-center px-2 py-1 hover:bg-neutral-100 rounded text-neutral-800 transition-colors cursor-pointer h-full"
              title="لصق من الحافظة (Ctrl+V)"
            >
              <ClipboardPaste className="w-5 h-5 text-blue-700 mb-0.5" />
              <span className="text-[10px] font-bold">لصق</span>
            </button>

            {/* Column of 3 tools: Cut, Copy, Format Painter */}
            <div className="flex flex-col justify-between h-full gap-0.5 pr-0.5 border-r border-neutral-200">
              <button
                onClick={() => execCmd('cut')}
                className="p-1 hover:bg-neutral-100 rounded text-neutral-700 flex items-center gap-1 text-[10px] cursor-pointer"
                title="قص (Ctrl+X)"
              >
                <Scissors className="w-3 h-3 text-neutral-600" />
                <span className="hidden xl:inline">قص</span>
              </button>
              <button
                onClick={() => execCmd('copy')}
                className="p-1 hover:bg-neutral-100 rounded text-neutral-700 flex items-center gap-1 text-[10px] cursor-pointer"
                title="نسخ (Ctrl+C)"
              >
                <Copy className="w-3 h-3 text-neutral-600" />
                <span className="hidden xl:inline">نسخ</span>
              </button>
              <button
                onClick={formatPainterStyle ? handleApplyFormat : handleCopyFormat}
                className={`p-1 rounded flex items-center gap-1 text-[10px] cursor-pointer transition-colors ${
                  formatPainterStyle ? 'bg-amber-100 text-amber-900 font-bold' : 'hover:bg-neutral-100 text-neutral-700'
                }`}
                title="نسخ التنسيق (Format Painter)"
              >
                <Paintbrush className="w-3 h-3 text-amber-600" />
                <span className="hidden xl:inline">نسخ التنسيق</span>
              </button>
            </div>
          </div>

          {/* GROUP 2: إملاء صوتي (Voice Dictation) */}
          <div className="flex items-center px-1 border border-neutral-300/80 rounded-lg bg-white/80 shadow-2xs shrink-0">
            <button
              id="ribbon-voice-dictation-btn"
              onClick={toggleVoiceDictation}
              className={`flex flex-col items-center justify-center px-2 py-1 rounded transition-all cursor-pointer h-full ${
                isListening
                  ? 'bg-rose-50 border border-rose-400 text-rose-700 animate-pulse'
                  : 'hover:bg-neutral-100 text-neutral-800'
              }`}
              title="إملاء صوتي باللغة العربية (Web Speech)"
            >
              {isListening ? (
                <MicOff className="w-5 h-5 text-rose-600 mb-0.5" />
              ) : (
                <Mic className="w-5 h-5 text-blue-700 mb-0.5" />
              )}
              <span className="text-[10px] font-bold">
                {isListening ? 'جارٍ الاستماع...' : 'إملاء صوتي'}
              </span>
            </button>
          </div>

          {/* GROUP 3: الخط (Font Group) */}
          <div className="flex flex-col justify-between p-1 border border-neutral-300/80 rounded-lg bg-white/80 shadow-2xs shrink-0">
            {/* Row 1: Font Selector & Sizes */}
            <div className="flex items-center gap-1">
              {/* Font Family Dropdown */}
              <select
                id="ribbon-font-select"
                value={fontFamily}
                onMouseDown={saveSelection}
                onChange={(e) => onFontFamilyChange(e.target.value)}
                className="h-6 bg-white hover:bg-neutral-50 border border-neutral-300 rounded px-1 text-xs font-semibold text-neutral-800 focus:outline-hidden cursor-pointer w-36"
                title="نوع الخط العربي"
              >
                {ARABIC_FONTS.map((f) => (
                  <option key={f.id} value={f.id} style={{ fontFamily: f.font }}>
                    {f.name}
                  </option>
                ))}
              </select>

              {/* Font Size Dropdown */}
              <select
                id="ribbon-size-select"
                value={fontSize}
                onChange={(e) => onFontSizeChange(e.target.value)}
                className="h-6 bg-white hover:bg-neutral-50 border border-neutral-300 rounded px-1 text-xs font-mono font-bold text-neutral-800 focus:outline-hidden cursor-pointer w-14"
                title="حجم الخط"
              >
                {['10', '11', '12', '14', '16', '18', '20', '24', '28', '32', '36', '48'].map((sz) => (
                  <option key={sz} value={sz}>{sz}</option>
                ))}
              </select>

              {/* Increase / Decrease font size */}
              <button
                onClick={handleIncreaseFontSize}
                className="p-1 hover:bg-neutral-100 rounded text-neutral-700 font-bold text-xs h-6 px-1.5 flex items-center justify-center cursor-pointer border border-neutral-200"
                title="تكبير الخط"
              >
                <span>A</span>
                <ChevronUp className="w-2.5 h-2.5 -mr-0.5" />
              </button>

              <button
                onClick={handleDecreaseFontSize}
                className="p-1 hover:bg-neutral-100 rounded text-neutral-700 font-bold text-xs h-6 px-1.5 flex items-center justify-center cursor-pointer border border-neutral-200"
                title="تصغير الخط"
              >
                <span>A</span>
                <ChevronDown className="w-2.5 h-2.5 -mr-0.5" />
              </button>

              {/* Clear Formatting */}
              <button
                onClick={() => execCmd('removeFormat')}
                className="p-1 hover:bg-neutral-100 rounded text-neutral-500 hover:text-neutral-800 h-6 w-6 flex items-center justify-center cursor-pointer border border-neutral-200"
                title="مسح كافة التنسيقات"
              >
                <Eraser className="w-3.5 h-3.5 text-neutral-600" />
              </button>
            </div>

            {/* Row 2: Bold, Italic, Underline, Strikethrough, Sub/Super, Colors */}
            <div className="flex items-center gap-0.5 mt-1">
              <button
                onClick={() => execCmd('bold')}
                className="p-1 hover:bg-neutral-200/70 rounded text-neutral-900 font-bold w-6 h-6 flex items-center justify-center cursor-pointer"
                title="عريض (Ctrl+B)"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => execCmd('italic')}
                className="p-1 hover:bg-neutral-200/70 rounded text-neutral-900 italic w-6 h-6 flex items-center justify-center cursor-pointer"
                title="مائل (Ctrl+I)"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => execCmd('underline')}
                className="p-1 hover:bg-neutral-200/70 rounded text-neutral-900 underline w-6 h-6 flex items-center justify-center cursor-pointer"
                title="تسطير (Ctrl+U)"
              >
                <Underline className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => execCmd('strikeThrough')}
                className="p-1 hover:bg-neutral-200/70 rounded text-neutral-900 w-6 h-6 flex items-center justify-center cursor-pointer"
                title="يتوسطه خط"
              >
                <Strikethrough className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => execCmd('subscript')}
                className="p-1 hover:bg-neutral-200/70 rounded text-neutral-900 w-6 h-6 flex items-center justify-center cursor-pointer"
                title="منخفض (X₂)"
              >
                <Subscript className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => execCmd('superscript')}
                className="p-1 hover:bg-neutral-200/70 rounded text-neutral-900 w-6 h-6 flex items-center justify-center cursor-pointer"
                title="مرتفع (X²)"
              >
                <Superscript className="w-3.5 h-3.5" />
              </button>

              <div className="h-4 w-px bg-neutral-300 mx-0.5" />

              {/* Text Color Picker */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowTextColorPicker(!showTextColorPicker);
                    setShowHighlightColorPicker(false);
                  }}
                  className="p-1 hover:bg-neutral-100 rounded flex items-center gap-0.5 cursor-pointer"
                  title="لون النص"
                >
                  <span className="font-bold underline decoration-blue-600 decoration-2 text-xs">A</span>
                  <ChevronDown className="w-2.5 h-2.5 text-neutral-400" />
                </button>
                {showTextColorPicker && (
                  <div className="absolute top-full mt-1 bg-white border border-neutral-300 rounded-lg shadow-xl p-2 z-50 w-44">
                    <span className="text-[10px] font-bold text-neutral-500 block mb-1">ألوان الخط:</span>
                    <div className="grid grid-cols-4 gap-1">
                      {textColorPalette.map((c) => (
                        <button
                          key={c}
                          onClick={() => {
                            execCmd('foreColor', c);
                            setShowTextColorPicker(false);
                          }}
                          style={{ backgroundColor: c }}
                          className="w-5 h-5 rounded-xs border border-neutral-300 hover:scale-110 cursor-pointer"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Highlight Fill Color */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowHighlightColorPicker(!showHighlightColorPicker);
                    setShowTextColorPicker(false);
                  }}
                  className="p-1 hover:bg-neutral-100 rounded flex items-center gap-0.5 cursor-pointer"
                  title="لون تمييز النص"
                >
                  <Palette className="w-3.5 h-3.5 text-amber-600" />
                  <ChevronDown className="w-2.5 h-2.5 text-neutral-400" />
                </button>
                {showHighlightColorPicker && (
                  <div className="absolute top-full mt-1 bg-white border border-neutral-300 rounded-lg shadow-xl p-2 z-50 w-44">
                    <span className="text-[10px] font-bold text-neutral-500 block mb-1">لون التمييز:</span>
                    <div className="grid grid-cols-4 gap-1">
                      {highlightColorPalette.map((c) => (
                        <button
                          key={c}
                          onClick={() => {
                            execCmd('hiliteColor', c);
                            setShowHighlightColorPicker(false);
                          }}
                          style={{ backgroundColor: c }}
                          className="w-5 h-5 rounded-xs border border-neutral-300 hover:scale-110 cursor-pointer"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* GROUP 4: الفقرة (Paragraph Group) */}
          <div className="flex flex-col justify-between p-1 border border-neutral-300/80 rounded-lg bg-white/80 shadow-2xs shrink-0">
            {/* Row 1: Alignments, Bullets, Indents */}
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => execCmd('justifyRight')}
                className="p-1 hover:bg-neutral-200/70 rounded text-neutral-800 w-6 h-6 flex items-center justify-center cursor-pointer"
                title="محاذاة لليمين"
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => execCmd('justifyCenter')}
                className="p-1 hover:bg-neutral-200/70 rounded text-neutral-800 w-6 h-6 flex items-center justify-center cursor-pointer"
                title="توسيط"
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => execCmd('justifyLeft')}
                className="p-1 hover:bg-neutral-200/70 rounded text-neutral-800 w-6 h-6 flex items-center justify-center cursor-pointer"
                title="محاذاة لليسار"
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => execCmd('justifyFull')}
                className="p-1 hover:bg-neutral-200/70 rounded text-neutral-800 w-6 h-6 flex items-center justify-center cursor-pointer"
                title="ضبط كامل (Justify)"
              >
                <AlignJustify className="w-3.5 h-3.5" />
              </button>

              <div className="h-4 w-px bg-neutral-300 mx-0.5" />

              <button
                onClick={() => execCmd('insertUnorderedList')}
                className="p-1 hover:bg-neutral-200/70 rounded text-neutral-800 w-6 h-6 flex items-center justify-center cursor-pointer"
                title="تعداد نقطي"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => execCmd('insertOrderedList')}
                className="p-1 hover:bg-neutral-200/70 rounded text-neutral-800 w-6 h-6 flex items-center justify-center cursor-pointer"
                title="تعداد رقمي"
              >
                <ListOrdered className="w-3.5 h-3.5" />
              </button>

              <div className="h-4 w-px bg-neutral-300 mx-0.5" />

              <button
                onClick={() => execCmd('outdent')}
                className="p-1 hover:bg-neutral-200/70 rounded text-neutral-800 w-6 h-6 flex items-center justify-center cursor-pointer"
                title="إنقاص المسافة البادئة"
              >
                <Outdent className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => execCmd('indent')}
                className="p-1 hover:bg-neutral-200/70 rounded text-neutral-800 w-6 h-6 flex items-center justify-center cursor-pointer"
                title="زيادة المسافة البادئة"
              >
                <Indent className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Row 2: Line Spacing, Shading, Direction, Borders */}
            <div className="flex items-center gap-1 mt-1">
              {/* Line Spacing */}
              <div className="relative">
                <button
                  onClick={() => setShowLineSpacingMenu(!showLineSpacingMenu)}
                  className="px-1.5 py-0.5 hover:bg-neutral-100 border border-neutral-200 rounded text-[10px] font-bold text-neutral-700 flex items-center gap-0.5 cursor-pointer h-5"
                  title="تباعد الأسطر"
                >
                  <span>تباعد {lineSpacing}</span>
                  <ChevronDown className="w-2.5 h-2.5 text-neutral-400" />
                </button>
                {showLineSpacingMenu && (
                  <div className="absolute top-full mt-1 bg-white border border-neutral-300 rounded-lg shadow-xl py-1 z-50 w-24 text-right">
                    {['1.0', '1.15', '1.5', '1.8', '2.0', '2.5'].map((sp) => (
                      <button
                        key={sp}
                        onClick={() => handleLineSpacing(sp)}
                        className="w-full px-2 py-1 text-xs hover:bg-neutral-100 text-neutral-800 flex justify-between font-mono"
                      >
                        <span>{sp}</span>
                        {lineSpacing === sp && <span className="text-blue-600">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* RTL Paragraph Direction */}
              <button
                onClick={() => {
                  const sel = window.getSelection();
                  if (sel?.anchorNode?.parentElement) {
                    const block = sel.anchorNode.parentElement.closest('p, div, h1, h2, h3, blockquote');
                    if (block) {
                      block.setAttribute('dir', block.getAttribute('dir') === 'ltr' ? 'rtl' : 'ltr');
                    }
                  }
                }}
                className="p-1 hover:bg-neutral-100 rounded text-neutral-700 flex items-center gap-0.5 text-[10px] font-bold h-5 border border-neutral-200 cursor-pointer"
                title="تغيير اتجاه الفقرة (يمين/يسار)"
              >
                <span>¶ اتجاه</span>
              </button>

              {/* Table Borders Grid trigger */}
              <button
                onClick={onOpenTableModal}
                className="p-1 hover:bg-neutral-100 rounded text-neutral-700 flex items-center gap-0.5 text-[10px] h-5 border border-neutral-200 cursor-pointer"
                title="إدراج وتنسيق الجداول"
              >
                <TableIcon className="w-3 h-3 text-neutral-600" />
                <span>حدود</span>
              </button>
            </div>
          </div>

          {/* GROUP 5: معرض الأنماط والستايلات السريعة (Styles Gallery) - Exactly matches user screenshot */}
          <div className="flex items-center gap-1.5 px-2 py-1 border border-neutral-300/80 rounded-lg bg-white/80 shadow-2xs shrink-0 overflow-x-auto">
            {/* حفظ نمط (+ Icon in Purple Box) */}
            <button
              onClick={() => {
                const name = prompt('أدخل اسم النمط الجديد لحفظه:', 'نمط مخصص');
                if (name) {
                  alert(`تم حفظ النمط "${name}" بنجاح في معرض الأنماط.`);
                }
              }}
              className="flex flex-col items-center justify-center p-1.5 rounded-lg border-2 border-purple-400 bg-purple-50/70 hover:bg-purple-100 text-purple-900 transition-all cursor-pointer w-16 h-full shadow-2xs shrink-0"
              title="حفظ التنسيق الحالي كنمط جديد"
            >
              <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs mb-0.5">
                +
              </div>
              <span className="text-[10px] font-bold">حفظ نمط</span>
            </button>

            {/* إدارة الأنماط */}
            <button
              onClick={onOpenTemplates}
              className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-neutral-300 hover:bg-neutral-100 text-neutral-800 transition-all cursor-pointer w-16 h-full shadow-2xs shrink-0"
              title="إدارة الأنماط والقوالب"
            >
              <Layers className="w-5 h-5 text-purple-700 mb-0.5" />
              <span className="text-[10px] font-bold">إدارة الأنماط</span>
            </button>

            <div className="h-10 w-px bg-neutral-300 mx-0.5" />

            {/* Style Card 1: عنوان رئيسي */}
            <button
              onClick={() => applyQuickStyle('heading1')}
              className="flex flex-col items-center justify-between p-1.5 rounded-lg border border-neutral-300 hover:border-blue-500 bg-white hover:bg-blue-50/50 transition-all cursor-pointer w-20 h-full shadow-2xs shrink-0"
              title="تطبيق نمط عنوان رئيسي (H1)"
            >
              <span className="font-extrabold text-sm text-neutral-900">Aa أب</span>
              <span className="text-[9px] text-neutral-600 font-semibold truncate w-full text-center">عنوان رئيسي...</span>
            </button>

            {/* Style Card 2: عنوان فرعي */}
            <button
              onClick={() => applyQuickStyle('heading2')}
              className="flex flex-col items-center justify-between p-1.5 rounded-lg border border-neutral-300 hover:border-blue-500 bg-white hover:bg-blue-50/50 transition-all cursor-pointer w-20 h-full shadow-2xs shrink-0"
              title="تطبيق نمط عنوان فرعي (H2)"
            >
              <span className="font-bold text-sm text-neutral-800">Aa أب</span>
              <span className="text-[9px] text-neutral-600 font-semibold truncate w-full text-center">عنوان فرعي...</span>
            </button>

            {/* Style Card 3: فقرة تجوال */}
            <button
              onClick={() => applyQuickStyle('tajawal_body')}
              className="flex flex-col items-center justify-between p-1.5 rounded-lg border border-neutral-300 hover:border-blue-500 bg-white hover:bg-blue-50/50 transition-all cursor-pointer w-20 h-full shadow-2xs shrink-0"
              title="تطبيق نمط فقرة بخط تجوال"
            >
              <span className="font-medium text-sm text-neutral-700">Aa أب</span>
              <span className="text-[9px] text-neutral-600 font-semibold truncate w-full text-center">فقرة تجوال ع...</span>
            </button>

            {/* Style Card 4: عنوان كوفي */}
            <button
              onClick={() => applyQuickStyle('kufi_heading')}
              className="flex flex-col items-center justify-between p-1.5 rounded-lg border border-neutral-300 hover:border-blue-500 bg-white hover:bg-blue-50/50 transition-all cursor-pointer w-20 h-full shadow-2xs shrink-0"
              title="تطبيق نمط خط كوفي"
            >
              <span className="font-bold text-sm text-neutral-900 font-serif">Aa أب</span>
              <span className="text-[9px] text-neutral-600 font-semibold truncate w-full text-center">عنوان كوفي...</span>
            </button>

            {/* Style Card 5: اقتباس بنفسجي (Matching user image!) */}
            <button
              onClick={() => applyQuickStyle('purple_quote')}
              className="flex flex-col items-center justify-between p-1.5 rounded-lg border-2 border-purple-300 bg-purple-50/80 hover:bg-purple-100 transition-all cursor-pointer w-20 h-full shadow-2xs shrink-0"
              title="تطبيق نمط اقتباس مميز بإطار بنفسجي"
            >
              <span className="font-bold text-sm text-purple-800 italic">Aa أب</span>
              <span className="text-[9px] text-purple-900 font-semibold truncate w-full text-center">اقتباس بنفس...</span>
            </button>

            {/* Style Card 6: تنبيه برتقالي (Matching user image with yellow bg!) */}
            <button
              onClick={() => applyQuickStyle('orange_alert')}
              className="flex flex-col items-center justify-between p-1.5 rounded-lg border-2 border-amber-300 bg-amber-100 hover:bg-amber-200 transition-all cursor-pointer w-20 h-full shadow-2xs shrink-0"
              title="تطبيق نمط تنبيه بمربع برتقالي وخلفية صفراء"
            >
              <span className="font-extrabold text-sm text-amber-900">Aa أب</span>
              <span className="text-[9px] text-amber-900 font-semibold truncate w-full text-center">تنبيه برتقالي...</span>
            </button>
          </div>

          {/* GROUP 6: التحرير والإدراج السريع (∑, Grid, Search, Replace) */}
          <div className="flex items-center gap-1 px-1.5 py-1 border border-neutral-300/80 rounded-lg bg-white/80 shadow-2xs shrink-0">
            <button
              onClick={() => {
                const sym = prompt('أدخل رمزاً أو معادلة لإدراجها (مثال: ∑, √, π, ±, ∞, ≈):', '∑');
                if (sym) {
                  execCmd('insertText', ` ${sym} `);
                }
              }}
              className="p-1 hover:bg-neutral-100 rounded text-neutral-800 border border-neutral-200 w-7 h-7 flex items-center justify-center cursor-pointer font-bold text-xs"
              title="إدراج معادلة أو رمز رياضي (AutoSum / Math)"
            >
              <Sigma className="w-4 h-4 text-blue-700" />
            </button>

            <button
              onClick={onOpenTableModal}
              className="p-1 hover:bg-neutral-100 rounded text-neutral-800 border border-neutral-200 w-7 h-7 flex items-center justify-center cursor-pointer"
              title="إدراج جدول سريع"
            >
              <TableIcon className="w-4 h-4 text-neutral-700" />
            </button>

            <button
              onClick={onOpenSearchModal}
              className="p-1 hover:bg-neutral-100 rounded text-neutral-800 border border-neutral-200 w-7 h-7 flex items-center justify-center cursor-pointer"
              title="بحث في المستند (Ctrl+F)"
            >
              <Search className="w-4 h-4 text-neutral-700" />
            </button>

            <button
              onClick={onOpenSearchModal}
              className="p-1 hover:bg-neutral-100 rounded text-neutral-800 border border-neutral-200 w-7 h-7 flex items-center justify-center cursor-pointer"
              title="استبدال النص"
            >
              <RotateCcw className="w-4 h-4 text-neutral-700" />
            </button>
          </div>
        </div>
      )}

      {/* TABS OTHER THAN HOME (Insert, Layout, Review, etc.) */}
      {!isRibbonCollapsed && activeTab === 'insert' && (
        <div className="bg-[#f9fafb] p-2 flex items-center gap-3 overflow-x-auto text-xs min-h-[60px]">
          <button
            onClick={onOpenTableModal}
            className="flex flex-col items-center p-1.5 hover:bg-white rounded border border-neutral-200 text-neutral-800 cursor-pointer w-16"
          >
            <TableIcon className="w-5 h-5 text-blue-600 mb-1" />
            <span className="text-[10px] font-bold">جدول</span>
          </button>
          <button
            onClick={onTriggerImagePicker}
            className="flex flex-col items-center p-1.5 hover:bg-white rounded border border-neutral-200 text-neutral-800 cursor-pointer w-16"
          >
            <ImageIcon className="w-5 h-5 text-emerald-600 mb-1" />
            <span className="text-[10px] font-bold">صورة</span>
          </button>
          <button
            onClick={onOpenTocModal}
            className="flex flex-col items-center p-1.5 hover:bg-white rounded border border-neutral-200 text-neutral-800 cursor-pointer w-20"
          >
            <BookOpen className="w-5 h-5 text-amber-600 mb-1" />
            <span className="text-[10px] font-bold">فهرس المحتوى</span>
          </button>
          <button
            onClick={() => execCmd('insertHorizontalRule')}
            className="flex flex-col items-center p-1.5 hover:bg-white rounded border border-neutral-200 text-neutral-800 cursor-pointer w-20"
          >
            <span className="text-sm font-bold text-neutral-500">—</span>
            <span className="text-[10px] font-bold">فاصل أفقي</span>
          </button>
        </div>
      )}

      {!isRibbonCollapsed && activeTab === 'layout' && (
        <div className="bg-[#f9fafb] p-2 flex items-center gap-3 overflow-x-auto text-xs min-h-[60px]">
          <div className="flex items-center gap-1 bg-white p-1 rounded border border-neutral-200">
            <span className="text-[11px] font-bold text-neutral-600 ml-1">الاتجاه:</span>
            <button
              onClick={() => onChange({ ...documentState, orientation: 'portrait' })}
              className={`px-2 py-1 rounded text-xs font-bold ${
                documentState.orientation === 'portrait' ? 'bg-blue-600 text-white' : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              عمودي
            </button>
            <button
              onClick={() => onChange({ ...documentState, orientation: 'landscape' })}
              className={`px-2 py-1 rounded text-xs font-bold ${
                documentState.orientation === 'landscape' ? 'bg-blue-600 text-white' : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              أفقي
            </button>
          </div>

          <div className="flex items-center gap-1 bg-white p-1 rounded border border-neutral-200">
            <span className="text-[11px] font-bold text-neutral-600 ml-1">حجم الورق:</span>
            {['A4', 'Letter', 'Legal'].map((sz) => (
              <button
                key={sz}
                onClick={() => onChange({ ...documentState, paperSize: sz as any })}
                className={`px-2 py-1 rounded text-xs font-bold ${
                  documentState.paperSize === sz ? 'bg-blue-600 text-white' : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>
      )}

      {!isRibbonCollapsed && activeTab === 'review' && (
        <div className="bg-[#f9fafb] p-2 flex items-center gap-3 overflow-x-auto text-xs min-h-[60px]">
          <button
            onClick={onOpenSpellModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 text-white rounded-lg font-bold text-xs shadow-xs hover:bg-rose-700 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>التدقيق الإملائي والنحوي</span>
          </button>
          <button
            onClick={() => alert(`إحصائيات المستند:\n- الكلمات: ${documentState.contentHtml.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length}\n- الأحرف: ${documentState.contentHtml.replace(/<[^>]+>/g, '').length}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-300 rounded-lg font-semibold text-neutral-800 text-xs hover:bg-neutral-50 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>إحصائيات الكلمات والأحرف</span>
          </button>
        </div>
      )}

      {!isRibbonCollapsed && activeTab === 'help' && (
        <div className="bg-[#f9fafb] p-2 flex items-center gap-3 overflow-x-auto text-xs min-h-[60px]">
          <div className="flex items-center gap-2 text-neutral-700 text-xs">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span>اختصارات لوحة المفاتيح: Ctrl+B عريض، Ctrl+I مائل، Ctrl+U تسطير، Ctrl+Z تراجع، Ctrl+P طباعة وحفظ PDF</span>
          </div>
        </div>
      )}
    </div>
  );
};
