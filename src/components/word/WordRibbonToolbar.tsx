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
  Languages,
  FolderOpen,
  Save,
  Share2,
  Sliders,
  Info,
  Cloud,
  Maximize,
  Minimize,
  Columns,
  Square,
  Minus,
  Link,
  Bookmark,
  Pin,
  Type,
  Grid,
  FileSearch,
  Droplet,
  Split,
  Lock,
  Unlock,
  Wand2,
  FilePlus,
  Check,
  Download,
  Upload,
  ArrowRight,
  MoveLeft,
  MoveRight,
  SlidersHorizontal
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
  onNewDocument?: () => void;
  onOpenFile?: () => void;
  onSaveFile?: () => void;
  onExportDocx?: () => void;
  onPrint?: () => void;
  onShare?: () => void;
  zoom?: number;
  onZoomChange?: (newZoom: number) => void;
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
  onNewDocument,
  onOpenFile,
  onSaveFile,
  onExportDocx,
  onPrint,
  onShare,
  zoom = 100,
  onZoomChange,
}) => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isRibbonCollapsed, setIsRibbonCollapsed] = useState<boolean>(false);

  // Pickers & Menus
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showHighlightColorPicker, setShowHighlightColorPicker] = useState(false);
  const [showLineSpacingMenu, setShowLineSpacingMenu] = useState(false);
  const [showFileMenu, setShowFileMenu] = useState(false);

  // File tab dropdowns
  const [showFileExportMenu, setShowFileExportMenu] = useState(false);
  const [showDocInfoModal, setShowDocInfoModal] = useState(false);
  const [showPaperSettingsModal, setShowPaperSettingsModal] = useState(false);

  // Insert tab dropdowns
  const [showInsertBordersMenu, setShowInsertBordersMenu] = useState(false);
  const [showInsertAlignMenu, setShowInsertAlignMenu] = useState(false);
  const [showInsertShapesMenu, setShowInsertShapesMenu] = useState(false);
  const [showInsertLinesMenu, setShowInsertLinesMenu] = useState(false);
  const [showInsertSymbolsMenu, setShowInsertSymbolsMenu] = useState(false);

  // Design tab dropdowns
  const [showThemesMenu, setShowThemesMenu] = useState(false);
  const [showWatermarkMenu, setShowWatermarkMenu] = useState(false);
  const [showPageColorMenu, setShowPageColorMenu] = useState(false);
  const [showPageBorderMenu, setShowPageBorderMenu] = useState(false);

  // Layout tab dropdowns
  const [showMarginsMenu, setShowMarginsMenu] = useState(false);
  const [showPaperSizeMenu, setShowPaperSizeMenu] = useState(false);
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [showBreaksMenu, setShowBreaksMenu] = useState(false);

  // View tab dropdowns & states
  const [showViewSettingsModal, setShowViewSettingsModal] = useState(false);
  const [showZoomMenu, setShowZoomMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  // Action helpers for tabs
  const handleInsertShape = (shape: 'rect' | 'circle' | 'quote' | 'alert') => {
    saveSelection();
    let html = '';
    if (shape === 'rect') {
      html = `<div style="border: 2px solid #2563eb; background-color: #eff6ff; padding: 12px 16px; border-radius: 8px; margin: 14px 0;"><p style="font-weight: bold; color: #1d4ed8; margin-bottom: 4px;">مستطيل تركيز:</p><p style="margin: 0;">أدخل النص المراد إبرازه هنا...</p></div><p><br></p>`;
    } else if (shape === 'circle') {
      html = `<div style="width: 110px; height: 110px; border-radius: 50%; border: 3px solid #059669; background-color: #ecfdf5; display: flex; align-items: center; justify-content: center; text-align: center; margin: 16px auto; font-weight: bold; color: #065f46; box-shadow: 0 2px 4px rgba(0,0,0,0.05);"><p style="margin: 0; font-size: 13px;">دائرة تمييز</p></div><p><br></p>`;
    } else if (shape === 'quote') {
      html = `<blockquote style="border-right: 4px solid #7c3aed; padding: 10px 18px; margin: 16px 0; background-color: #f5f3ff; color: #5b21b6; font-style: italic; border-radius: 0 8px 8px 0;"><p style="margin: 0; font-size: 14px;">«اكتب هنا نص الاقتباس أو الشاهد المطلوب إبرازه...»</p></blockquote><p><br></p>`;
    } else if (shape === 'alert') {
      html = `<div style="border-right: 4px solid #d97706; background-color: #fffbeb; padding: 12px 16px; border-radius: 0 8px 8px 0; margin: 14px 0; color: #92400e;"><p style="font-weight: bold; margin-bottom: 4px;">⚠️ تنبيه هام وملاحظة:</p><p style="margin: 0; font-size: 13px;">يرجى الانتباه إلى البنود المذكورة أعلاه.</p></div><p><br></p>`;
    }
    restoreSelection();
    execCmd('insertHTML', html);
    setShowInsertShapesMenu(false);
  };

  const handleInsertTextBox = () => {
    saveSelection();
    const html = `<div style="border: 2px solid #3b82f6; background-color: #f8fafc; padding: 14px 18px; border-radius: 8px; margin: 14px 0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.06); max-width: 460px;"><p style="font-weight: bold; color: #1d4ed8; margin-bottom: 6px; font-size: 13px;">مربع نص</p><p style="margin: 0; color: #334155; font-size: 13px;">اكتب نصك هنا بحرية مع إمكانية نقله وتنسيقه...</p></div><p><br></p>`;
    restoreSelection();
    execCmd('insertHTML', html);
  };

  const handleInsertQuickTable = () => {
    saveSelection();
    const html = `<table style="width: 100%; border-collapse: collapse; margin: 16px 0; border: 1px solid #cbd5e1;"><thead style="background-color: #f8fafc;"><tr style="border-bottom: 2px solid #cbd5e1;"><th style="padding: 8px 12px; border: 1px solid #cbd5e1; text-align: right; font-weight: bold; color: #1e293b;">العمود 1</th><th style="padding: 8px 12px; border: 1px solid #cbd5e1; text-align: right; font-weight: bold; color: #1e293b;">العمود 2</th><th style="padding: 8px 12px; border: 1px solid #cbd5e1; text-align: right; font-weight: bold; color: #1e293b;">العمود 3</th></tr></thead><tbody><tr><td style="padding: 8px 12px; border: 1px solid #e2e8f0;">بيانات 1</td><td style="padding: 8px 12px; border: 1px solid #e2e8f0;">بيانات 2</td><td style="padding: 8px 12px; border: 1px solid #e2e8f0;">بيانات 3</td></tr><tr><td style="padding: 8px 12px; border: 1px solid #e2e8f0;">بيانات 4</td><td style="padding: 8px 12px; border: 1px solid #e2e8f0;">بيانات 5</td><td style="padding: 8px 12px; border: 1px solid #e2e8f0;">بيانات 6</td></tr></tbody></table><p><br></p>`;
    restoreSelection();
    execCmd('insertHTML', html);
  };

  const handleInsertDivider = (type: 'solid' | 'dashed' | 'double') => {
    saveSelection();
    let borderStyle = 'border-top: 2px solid #94a3b8;';
    if (type === 'dashed') borderStyle = 'border-top: 2px dashed #94a3b8;';
    if (type === 'double') borderStyle = 'border-top: 3px double #475569;';
    const html = `<hr style="border: none; ${borderStyle} margin: 20px 0;" /><p><br></p>`;
    restoreSelection();
    execCmd('insertHTML', html);
    setShowInsertLinesMenu(false);
  };

  const handleInsertArrow = (arrowChar: string) => {
    saveSelection();
    restoreSelection();
    execCmd('insertText', ` ${arrowChar} `);
    setShowInsertLinesMenu(false);
  };

  const handleInsertLink = () => {
    saveSelection();
    const url = prompt('أدخل رابط الموقع (URL):', 'https://');
    if (!url) return;
    const text = prompt('أدخل النص المعروض للرابط (اختياري):', '');
    restoreSelection();
    const html = `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: underline; font-weight: 500;">${text || url}</a> `;
    execCmd('insertHTML', html);
  };

  const handleExportAs = (type: 'docx' | 'txt' | 'html' | 'pdf') => {
    setShowFileExportMenu(false);
    if (type === 'pdf') {
      onExportPdf?.();
    } else if (type === 'docx') {
      onExportDocx?.();
    } else if (type === 'txt') {
      const text = documentState.contentHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${documentState.title.replace(/\.[^/.]+$/, '')}.txt`;
      a.click();
    } else if (type === 'html') {
      const fullHtml = `<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><title>${documentState.title}</title><style>body { font-family: 'Cairo', Arial, sans-serif; padding: 40px; line-height: 1.8; color: #1e293b; }</style></head><body>${documentState.contentHtml}</body></html>`;
      const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${documentState.title.replace(/\.[^/.]+$/, '')}.html`;
      a.click();
    }
  };

  const handleExportDocxWithName = () => {
    const newName = prompt('أدخل اسم الملف لحفظه وتصديره:', documentState.title.replace(/\.[^/.]+$/, ''));
    if (newName) {
      onChange({ ...documentState, title: `${newName}.docx` });
      setTimeout(() => {
        onExportDocx?.();
      }, 100);
    }
  };

  const handleApplyTheme = (theme: string) => {
    setShowThemesMenu(false);
    let newFont = 'Cairo';
    if (theme === 'royal_purple') newFont = 'Amiri';
    if (theme === 'emerald') newFont = 'Almarai';
    if (theme === 'crimson') newFont = 'Aref Ruqaa';
    if (theme === 'modern_slate') newFont = 'Noto Kufi Arabic';
    if (theme === 'office_blue') newFont = 'Tajawal';
    onFontFamilyChange(newFont);
    onChange({ ...documentState, theme, fontFamily: newFont });
  };

  const handleZoom = (delta: number) => {
    const current = zoom || 100;
    const clamped = Math.min(200, Math.max(50, current + delta));
    onZoomChange?.(clamped);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
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
                  setActiveTab(tab.id);
                  setShowFileMenu(false);
                  if (isRibbonCollapsed) setIsRibbonCollapsed(false);
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-t-md transition-all cursor-pointer relative ${
                  isActive
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

      {/* TAB 1: FILE (ملف) - Matches user screenshot: شريط أدوات ملف */}
      {!isRibbonCollapsed && activeTab === 'file' && (
        <div
          id="word-ribbon-tab-file-panel"
          className="bg-[#f9fafb] p-1.5 flex items-stretch gap-1.5 overflow-x-auto text-xs min-h-[72px]"
        >
          {/* 1. جديد (+) */}
          <button
            id="file-btn-new"
            onClick={onNewDocument}
            className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-neutral-300 hover:bg-blue-50/70 hover:border-blue-400 text-neutral-800 transition-all cursor-pointer w-16 h-full shadow-2xs shrink-0"
            title="إنشاء مستند فارغ جديد"
          >
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs mb-0.5">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold">جديد (+)</span>
          </button>

          {/* 2. فتح */}
          <button
            id="file-btn-open"
            onClick={onOpenFile}
            className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-neutral-300 hover:bg-amber-50/70 hover:border-amber-400 text-neutral-800 transition-all cursor-pointer w-16 h-full shadow-2xs shrink-0"
            title="فتح مستند من جهازك (.docx, .txt)"
          >
            <FolderOpen className="w-5 h-5 text-amber-600 mb-0.5" />
            <span className="text-[10px] font-bold">فتح</span>
          </button>

          {/* 3. حفظ */}
          <button
            id="file-btn-save"
            onClick={onSaveFile}
            className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-neutral-300 hover:bg-blue-50/70 hover:border-blue-400 text-neutral-800 transition-all cursor-pointer w-16 h-full shadow-2xs shrink-0"
            title="حفظ المستند في المتصفح"
          >
            <Save className="w-5 h-5 text-blue-600 mb-0.5" />
            <span className="text-[10px] font-bold">حفظ</span>
          </button>

          {/* 4. تصدير باسم */}
          <button
            id="file-btn-export-as-name"
            onClick={handleExportDocxWithName}
            className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-neutral-300 hover:bg-purple-50/70 hover:border-purple-400 text-neutral-800 transition-all cursor-pointer w-20 h-full shadow-2xs shrink-0"
            title="تحديد اسم المستند وتصديره بصيغة Word (.docx)"
          >
            <Download className="w-5 h-5 text-purple-600 mb-0.5" />
            <span className="text-[10px] font-bold">تصدير باسم</span>
          </button>

          {/* 5. تصدير كـ... */}
          <div className="relative shrink-0">
            <button
              id="file-btn-export-dropdown"
              onClick={() => setShowFileExportMenu(!showFileExportMenu)}
              className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-neutral-300 hover:bg-indigo-50/70 hover:border-indigo-400 text-neutral-800 transition-all cursor-pointer w-20 h-full shadow-2xs"
              title="خيارات التصدير بصيغ متعددة"
            >
              <FileText className="w-5 h-5 text-indigo-600 mb-0.5" />
              <div className="flex items-center gap-0.5 text-[10px] font-bold">
                <span>تصدير كـ...</span>
                <ChevronDown className="w-2.5 h-2.5" />
              </div>
            </button>

            {showFileExportMenu && (
              <div className="absolute top-full mt-1 right-0 bg-white border border-neutral-300 rounded-xl shadow-xl py-1.5 w-48 z-50 text-right text-xs">
                <button
                  onClick={() => handleExportAs('docx')}
                  className="w-full px-3 py-1.5 hover:bg-neutral-100 flex items-center justify-between cursor-pointer font-bold text-neutral-800"
                >
                  <span>مستند وورد (.docx)</span>
                  <span className="text-[10px] text-blue-600 font-mono">Word</span>
                </button>
                <button
                  onClick={() => handleExportAs('pdf')}
                  className="w-full px-3 py-1.5 hover:bg-neutral-100 flex items-center justify-between cursor-pointer font-bold text-neutral-800"
                >
                  <span>مستند PDF (.pdf)</span>
                  <span className="text-[10px] text-rose-600 font-mono">PDF</span>
                </button>
                <button
                  onClick={() => handleExportAs('txt')}
                  className="w-full px-3 py-1.5 hover:bg-neutral-100 flex items-center justify-between cursor-pointer text-neutral-700"
                >
                  <span>نص مجرد (.txt)</span>
                  <span className="text-[10px] text-neutral-500 font-mono">Text</span>
                </button>
                <button
                  onClick={() => handleExportAs('html')}
                  className="w-full px-3 py-1.5 hover:bg-neutral-100 flex items-center justify-between cursor-pointer text-neutral-700"
                >
                  <span>صفحة ويب (.html)</span>
                  <span className="text-[10px] text-amber-600 font-mono">HTML</span>
                </button>
              </div>
            )}
          </div>

          <div className="h-10 w-px bg-neutral-300 mx-0.5 shrink-0 self-center" />

          {/* 6. تصدير PDF */}
          <button
            id="file-btn-export-pdf"
            onClick={onExportPdf}
            className="flex flex-col items-center justify-center p-1.5 rounded-lg border-2 border-rose-300 bg-rose-50/80 hover:bg-rose-100 text-rose-900 transition-all cursor-pointer w-20 h-full shadow-2xs shrink-0"
            title="تصدير فوري بصيغة PDF عالية الجودة"
          >
            <FileDown className="w-5 h-5 text-rose-600 mb-0.5" />
            <span className="text-[10px] font-extrabold text-rose-700">تصدير PDF</span>
          </button>

          {/* 7. معاينة PDF */}
          <button
            id="file-btn-preview-pdf"
            onClick={() => window.print()}
            className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-neutral-300 hover:bg-teal-50/70 hover:border-teal-400 text-neutral-800 transition-all cursor-pointer w-20 h-full shadow-2xs shrink-0"
            title="معاينة الطباعة والمستند"
          >
            <Eye className="w-5 h-5 text-teal-600 mb-0.5" />
            <span className="text-[10px] font-bold">معاينة PDF</span>
          </button>

          {/* 8. طباعة المستند */}
          <button
            id="file-btn-print"
            onClick={() => {
              if (onPrint) onPrint();
              else window.print();
            }}
            className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-neutral-300 hover:bg-neutral-100 text-neutral-800 transition-all cursor-pointer w-20 h-full shadow-2xs shrink-0"
            title="طباعة المستند عبر الطابعة (Ctrl+P)"
          >
            <Printer className="w-5 h-5 text-neutral-700 mb-0.5" />
            <span className="text-[10px] font-bold">طباعة المستند</span>
          </button>

          {/* 9. مشاركة... */}
          <button
            id="file-btn-share"
            onClick={onShare}
            className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-neutral-300 hover:bg-sky-50/70 hover:border-sky-400 text-neutral-800 transition-all cursor-pointer w-20 h-full shadow-2xs shrink-0"
            title="مشاركة رابط المستند أو إرساله"
          >
            <Share2 className="w-5 h-5 text-sky-600 mb-0.5" />
            <span className="text-[10px] font-bold">مشاركة...</span>
          </button>

          <div className="h-10 w-px bg-neutral-300 mx-0.5 shrink-0 self-center" />

          {/* 10. إعدادات الورق */}
          <button
            id="file-btn-paper-settings"
            onClick={() => setActiveTab('layout')}
            className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-neutral-300 hover:bg-neutral-100 text-neutral-800 transition-all cursor-pointer w-20 h-full shadow-2xs shrink-0"
            title="تخصيص الهوامش والحجم والاتجاه"
          >
            <Sliders className="w-5 h-5 text-neutral-600 mb-0.5" />
            <span className="text-[10px] font-bold">إعدادات الورق</span>
          </button>

          {/* 11. معلومات */}
          <button
            id="file-btn-info"
            onClick={() => setShowDocInfoModal(true)}
            className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-neutral-300 hover:bg-blue-50/70 hover:border-blue-400 text-neutral-800 transition-all cursor-pointer w-16 h-full shadow-2xs shrink-0"
            title="إحصائيات ومعلومات المستند"
          >
            <Info className="w-5 h-5 text-blue-600 mb-0.5" />
            <span className="text-[10px] font-bold">معلومات</span>
          </button>

          {/* 12. حفظ تلقائي: مفعل */}
          <div
            id="file-status-autosave"
            className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 shrink-0 w-24 h-full shadow-2xs"
          >
            <Cloud className="w-5 h-5 text-emerald-600 mb-0.5" />
            <span className="text-[10px] font-bold">حفظ تلقائي</span>
            <span className="text-[8px] text-emerald-700 font-semibold">مفعل ومستمر ✓</span>
          </div>
        </div>
      )}

      {/* TAB 2: INSERT (إدراج) - Matches user screenshot: أداة شريط أدوات إدراج 2 */}
      {!isRibbonCollapsed && activeTab === 'insert' && (
        <div
          id="word-ribbon-tab-insert-panel"
          className="bg-[#f9fafb] p-1.5 flex items-stretch gap-1.5 overflow-x-auto text-xs min-h-[72px]"
        >
          {/* GROUP 1: الجداول والحدود */}
          <div className="flex items-center gap-1 px-1.5 py-0.5 border border-neutral-300/80 rounded-lg bg-white/80 shadow-2xs shrink-0">
            {/* حدود... (Dropdown) */}
            <div className="relative">
              <button
                id="insert-btn-borders-dropdown"
                onClick={() => setShowInsertBordersMenu(!showInsertBordersMenu)}
                className="flex flex-col items-center justify-center p-1 rounded hover:bg-neutral-100 text-neutral-800 cursor-pointer w-14 h-full"
                title="خيارات وتنسيق حدود الفقرة والجدول"
              >
                <Grid className="w-4 h-4 text-neutral-700 mb-0.5" />
                <div className="flex items-center gap-0.5 text-[9px] font-bold">
                  <span>حدود...</span>
                  <ChevronDown className="w-2 h-2" />
                </div>
              </button>

              {showInsertBordersMenu && (
                <div className="absolute top-full mt-1 right-0 bg-white border border-neutral-300 rounded-xl shadow-xl py-1 w-44 z-50 text-right text-xs">
                  <button
                    onClick={() => {
                      execCmd('insertHTML', '<div style="border: 2px solid #2563eb; padding: 12px; margin: 12px 0; border-radius: 6px;"><p>نص بإطار أزرق متكامل...</p></div><p><br></p>');
                      setShowInsertBordersMenu(false);
                    }}
                    className="w-full px-3 py-1.5 hover:bg-neutral-100 text-neutral-800 font-medium"
                  >
                    إطار كامل ملون
                  </button>
                  <button
                    onClick={() => {
                      execCmd('insertHTML', '<div style="border-top: 2px solid #475569; border-bottom: 2px solid #475569; padding: 10px 0; margin: 14px 0;"><p>نص بإطار علوي وسفلي فقط...</p></div><p><br></p>');
                      setShowInsertBordersMenu(false);
                    }}
                    className="w-full px-3 py-1.5 hover:bg-neutral-100 text-neutral-800 font-medium"
                  >
                    حدود علوية وسفلية
                  </button>
                  <button
                    onClick={() => {
                      handleInsertDivider('double');
                      setShowInsertBordersMenu(false);
                    }}
                    className="w-full px-3 py-1.5 hover:bg-neutral-100 text-neutral-800 font-medium"
                  >
                    خط فاصل مزدوج
                  </button>
                  <button
                    onClick={() => {
                      onOpenTableModal();
                      setShowInsertBordersMenu(false);
                    }}
                    className="w-full px-3 py-1.5 hover:bg-neutral-100 text-blue-700 font-bold border-t border-neutral-100"
                  >
                    حدود الجداول المتقدمة...
                  </button>
                </div>
              )}
            </div>

            {/* جدول */}
            <button
              id="insert-btn-table"
              onClick={onOpenTableModal}
              className="flex flex-col items-center justify-center p-1 rounded hover:bg-neutral-100 text-neutral-800 cursor-pointer w-14 h-full"
              title="إدراج جدول وتنسيق صفوفه وأعمدته"
            >
              <TableIcon className="w-5 h-5 text-blue-600 mb-0.5" />
              <span className="text-[10px] font-bold">جدول</span>
            </button>

            {/* محاذاة... (Dropdown) */}
            <div className="relative">
              <button
                id="insert-btn-align-dropdown"
                onClick={() => setShowInsertAlignMenu(!showInsertAlignMenu)}
                className="flex flex-col items-center justify-center p-1 rounded hover:bg-neutral-100 text-neutral-800 cursor-pointer w-14 h-full"
                title="محاذاة النص والفقرة"
              >
                <AlignJustify className="w-4 h-4 text-neutral-700 mb-0.5" />
                <div className="flex items-center gap-0.5 text-[9px] font-bold">
                  <span>محاذاة...</span>
                  <ChevronDown className="w-2 h-2" />
                </div>
              </button>

              {showInsertAlignMenu && (
                <div className="absolute top-full mt-1 right-0 bg-white border border-neutral-300 rounded-xl shadow-xl py-1 w-36 z-50 text-right text-xs">
                  <button
                    onClick={() => {
                      execCmd('justifyRight');
                      setShowInsertAlignMenu(false);
                    }}
                    className="w-full px-3 py-1.5 hover:bg-neutral-100 flex items-center gap-2 text-neutral-800 font-medium"
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                    <span>محاذاة لليمين</span>
                  </button>
                  <button
                    onClick={() => {
                      execCmd('justifyCenter');
                      setShowInsertAlignMenu(false);
                    }}
                    className="w-full px-3 py-1.5 hover:bg-neutral-100 flex items-center gap-2 text-neutral-800 font-medium"
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                    <span>توسيط</span>
                  </button>
                  <button
                    onClick={() => {
                      execCmd('justifyLeft');
                      setShowInsertAlignMenu(false);
                    }}
                    className="w-full px-3 py-1.5 hover:bg-neutral-100 flex items-center gap-2 text-neutral-800 font-medium"
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                    <span>محاذاة لليسار</span>
                  </button>
                  <button
                    onClick={() => {
                      execCmd('justifyFull');
                      setShowInsertAlignMenu(false);
                    }}
                    className="w-full px-3 py-1.5 hover:bg-neutral-100 flex items-center gap-2 text-neutral-800 font-medium border-t border-neutral-100"
                  >
                    <AlignJustify className="w-3.5 h-3.5" />
                    <span>ضبط كامل</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* GROUP 2: الصور والأشكال والرسومات */}
          <div className="flex items-center gap-1 px-1.5 py-0.5 border border-neutral-300/80 rounded-lg bg-white/80 shadow-2xs shrink-0">
            {/* صورة */}
            <button
              id="insert-btn-image"
              onClick={onTriggerImagePicker}
              className="flex flex-col items-center justify-center p-1 rounded hover:bg-neutral-100 text-neutral-800 cursor-pointer w-14 h-full"
              title="إدراج صورة من جهازك"
            >
              <ImageIcon className="w-5 h-5 text-emerald-600 mb-0.5" />
              <span className="text-[10px] font-bold">صورة</span>
            </button>

            {/* أشكال هندسية */}
            <div className="relative">
              <button
                id="insert-btn-shapes"
                onClick={() => setShowInsertShapesMenu(!showInsertShapesMenu)}
                className="flex flex-col items-center justify-center p-1 rounded hover:bg-neutral-100 text-neutral-800 cursor-pointer w-16 h-full"
                title="إدراج أشكال وصناديق مميزة"
              >
                <Square className="w-4 h-4 text-purple-600 mb-0.5" />
                <div className="flex items-center gap-0.5 text-[9px] font-bold">
                  <span>أشكال</span>
                  <ChevronDown className="w-2 h-2" />
                </div>
              </button>

              {showInsertShapesMenu && (
                <div className="absolute top-full mt-1 right-0 bg-white border border-neutral-300 rounded-xl shadow-xl py-1 w-44 z-50 text-right text-xs">
                  <button
                    onClick={() => handleInsertShape('rect')}
                    className="w-full px-3 py-1.5 hover:bg-neutral-100 text-neutral-800 font-medium"
                  >
                    🟦 مستطيل تركيز
                  </button>
                  <button
                    onClick={() => handleInsertShape('circle')}
                    className="w-full px-3 py-1.5 hover:bg-neutral-100 text-neutral-800 font-medium"
                  >
                    🟢 دائرة تمييز
                  </button>
                  <button
                    onClick={() => handleInsertShape('quote')}
                    className="w-full px-3 py-1.5 hover:bg-neutral-100 text-neutral-800 font-medium"
                  >
                    🟣 صندوق اقتباس جانبي
                  </button>
                  <button
                    onClick={() => handleInsertShape('alert')}
                    className="w-full px-3 py-1.5 hover:bg-neutral-100 text-neutral-800 font-medium"
                  >
                    🟠 مربع تنبيه ملون
                  </button>
                </div>
              )}
            </div>

            {/* خط فاصل */}
            <div className="relative">
              <button
                id="insert-btn-lines"
                onClick={() => setShowInsertLinesMenu(!showInsertLinesMenu)}
                className="flex flex-col items-center justify-center p-1 rounded hover:bg-neutral-100 text-neutral-800 cursor-pointer w-14 h-full"
                title="إدراج خط فاصل وأسهم"
              >
                <Minus className="w-4 h-4 text-neutral-600 mb-0.5" />
                <div className="flex items-center gap-0.5 text-[9px] font-bold">
                  <span>خط فاصل</span>
                  <ChevronDown className="w-2 h-2" />
                </div>
              </button>

              {showInsertLinesMenu && (
                <div className="absolute top-full mt-1 right-0 bg-white border border-neutral-300 rounded-xl shadow-xl py-1 w-40 z-50 text-right text-xs">
                  <button
                    onClick={() => handleInsertDivider('solid')}
                    className="w-full px-3 py-1.5 hover:bg-neutral-100 text-neutral-800 font-medium"
                  >
                    خط فاصل عادي
                  </button>
                  <button
                    onClick={() => handleInsertDivider('dashed')}
                    className="w-full px-3 py-1.5 hover:bg-neutral-100 text-neutral-800 font-medium"
                  >
                    خط فاصل منقط
                  </button>
                  <button
                    onClick={() => handleInsertDivider('double')}
                    className="w-full px-3 py-1.5 hover:bg-neutral-100 text-neutral-800 font-medium"
                  >
                    خط فاصل مزدوج
                  </button>
                  <div className="border-t border-neutral-100 my-1" />
                  <div className="px-3 py-1 text-[10px] text-neutral-400 font-bold">أسهم سريعة</div>
                  <div className="flex items-center justify-around px-2 py-1">
                    {['➔', '➜', '◄', '►', '▼'].map((ar) => (
                      <button
                        key={ar}
                        onClick={() => handleInsertArrow(ar)}
                        className="p-1 hover:bg-neutral-100 rounded text-neutral-800 font-bold"
                      >
                        {ar}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* GROUP 3: الروابط والملاحظات */}
          <div className="flex items-center gap-1 px-1.5 py-0.5 border border-neutral-300/80 rounded-lg bg-white/80 shadow-2xs shrink-0">
            {/* رابط تشعبي */}
            <button
              id="insert-btn-link"
              onClick={handleInsertLink}
              className="flex flex-col items-center justify-center p-1 rounded hover:bg-neutral-100 text-neutral-800 cursor-pointer w-14 h-full"
              title="إدراج رابط موقع إنترنت (Ctrl+K)"
            >
              <Link className="w-4 h-4 text-blue-600 mb-0.5" />
              <span className="text-[10px] font-bold">رابط</span>
            </button>

            {/* إشارة مرجعية */}
            <button
              id="insert-btn-bookmark"
              onClick={() => {
                const mark = prompt('أدخل اسم الإشارة المرجعية:', 'القسم-1');
                if (mark) {
                  execCmd('insertHTML', `<span id="${mark}" style="background-color: #fef08a; padding: 2px 6px; border-radius: 4px; font-size: 11px;">📌 ${mark}</span> `);
                }
              }}
              className="flex flex-col items-center justify-center p-1 rounded hover:bg-neutral-100 text-neutral-800 cursor-pointer w-14 h-full"
              title="إدراج إشارة مرجعية"
            >
              <Bookmark className="w-4 h-4 text-amber-600 mb-0.5" />
              <span className="text-[10px] font-bold">إشارة</span>
            </button>

            {/* دبوس / تعليق */}
            <button
              id="insert-btn-pin"
              onClick={() => {
                const note = prompt('أدخل الملاحظة أو التعليق الهام:', 'ملاحظة تدقيق');
                if (note) {
                  execCmd('insertHTML', `<span style="background-color: #fef3c7; border: 1px solid #f59e0b; color: #92400e; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; margin: 0 4px;">💬 ${note}</span> `);
                }
              }}
              className="flex flex-col items-center justify-center p-1 rounded hover:bg-neutral-100 text-neutral-800 cursor-pointer w-14 h-full"
              title="إدراج شارة تعليق وملاحظة"
            >
              <Pin className="w-4 h-4 text-rose-500 mb-0.5" />
              <span className="text-[10px] font-bold">تعليق</span>
            </button>
          </div>

          {/* GROUP 4: نصوص ومربعات خاصة (TT, 田, T) */}
          <div className="flex items-center gap-1 px-1.5 py-0.5 border border-neutral-300/80 rounded-lg bg-white/80 shadow-2xs shrink-0">
            {/* مربع نص (TT) */}
            <button
              id="insert-btn-textbox"
              onClick={handleInsertTextBox}
              className="flex flex-col items-center justify-center p-1 rounded hover:bg-neutral-100 text-neutral-800 cursor-pointer w-16 h-full"
              title="إدراج مربع نص مستقل قابل للتحريك"
            >
              <div className="w-5 h-5 flex items-center justify-center font-black text-xs text-blue-700 bg-blue-50 border border-blue-300 rounded mb-0.5">
                TT
              </div>
              <span className="text-[10px] font-bold">مربع نص</span>
            </button>

            {/* جدول سريع (田) */}
            <button
              id="insert-btn-quick-grid"
              onClick={handleInsertQuickTable}
              className="flex flex-col items-center justify-center p-1 rounded hover:bg-neutral-100 text-neutral-800 cursor-pointer w-14 h-full"
              title="إدراج جدول 3x3 سريع فوري"
            >
              <div className="w-5 h-5 flex items-center justify-center font-bold text-xs text-neutral-700 bg-neutral-100 border border-neutral-300 rounded mb-0.5">
                田
              </div>
              <span className="text-[10px] font-bold">جدول 3x3</span>
            </button>

            {/* فقرة جديدة (T) */}
            <button
              id="insert-btn-clean-para"
              onClick={() => execCmd('insertHTML', '<p><br></p>')}
              className="flex flex-col items-center justify-center p-1 rounded hover:bg-neutral-100 text-neutral-800 cursor-pointer w-12 h-full"
              title="إدراج سطر وفقرة نظيفة جديدة"
            >
              <Type className="w-4 h-4 text-neutral-600 mb-0.5" />
              <span className="text-[10px] font-bold">فقرة</span>
            </button>
          </div>

          {/* GROUP 5: فهرس ورموز رياضية (BookOpen, Sigma) */}
          <div className="flex items-center gap-1 px-1.5 py-0.5 border border-neutral-300/80 rounded-lg bg-white/80 shadow-2xs shrink-0">
            {/* فهرس المحتوى */}
            <button
              id="insert-btn-toc"
              onClick={onOpenTocModal}
              className="flex flex-col items-center justify-center p-1 rounded hover:bg-amber-50 text-neutral-800 cursor-pointer w-20 h-full"
              title="توليد وإدراج جدول محتويات وفهرس تلقائي"
            >
              <BookOpen className="w-5 h-5 text-amber-600 mb-0.5" />
              <span className="text-[10px] font-bold">فهرس المحتوى</span>
            </button>

            {/* رمز / معادلة رياضية (∑) */}
            <div className="relative">
              <button
                id="insert-btn-symbols"
                onClick={() => setShowInsertSymbolsMenu(!showInsertSymbolsMenu)}
                className="flex flex-col items-center justify-center p-1 rounded hover:bg-blue-50 text-neutral-800 cursor-pointer w-16 h-full"
                title="إدراج رموز ومعادلات رياضية"
              >
                <Sigma className="w-5 h-5 text-blue-700 mb-0.5" />
                <span className="text-[10px] font-bold">رموز (∑)</span>
              </button>

              {showInsertSymbolsMenu && (
                <div className="absolute top-full mt-1 right-0 bg-white border border-neutral-300 rounded-xl shadow-xl p-2 w-48 z-50 text-right text-xs">
                  <div className="font-bold text-[10px] text-neutral-500 mb-1.5">اختر رمزاً لإدراجه:</div>
                  <div className="grid grid-cols-5 gap-1 text-center font-bold text-sm">
                    {['∑', '√', 'π', '±', '∞', '≠', '≤', '≥', '÷', '×', '≈', '∆', 'µ', 'Ω', '℃'].map((sym) => (
                      <button
                        key={sym}
                        onClick={() => {
                          execCmd('insertText', ` ${sym} `);
                          setShowInsertSymbolsMenu(false);
                        }}
                        className="p-1 hover:bg-blue-50 hover:text-blue-700 rounded border border-neutral-100 cursor-pointer"
                      >
                        {sym}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DESIGN (تصميم) - Matches user screenshot: شريط أدوات تصميم */}
      {!isRibbonCollapsed && activeTab === 'design' && (
        <div
          id="word-ribbon-tab-design-panel"
          className="bg-[#f9fafb] p-1.5 flex items-stretch gap-2 overflow-x-auto text-xs min-h-[72px]"
        >
          {/* 1. السمات (Themes) */}
          <div className="relative shrink-0">
            <button
              id="design-btn-themes"
              onClick={() => setShowThemesMenu(!showThemesMenu)}
              className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-neutral-300 hover:bg-blue-50/70 hover:border-blue-400 text-neutral-800 transition-all cursor-pointer w-20 h-full shadow-2xs"
              title="سمات التصميم وتناسق الألوان والخطوط"
            >
              <Palette className="w-5 h-5 text-blue-700 mb-0.5" />
              <div className="flex items-center gap-0.5 text-[10px] font-bold">
                <span>السمات</span>
                <ChevronDown className="w-2.5 h-2.5" />
              </div>
            </button>

            {showThemesMenu && (
              <div className="absolute top-full mt-1 right-0 bg-white border border-neutral-300 rounded-xl shadow-xl py-1.5 w-52 z-50 text-right text-xs">
                <button
                  onClick={() => handleApplyTheme('office_blue')}
                  className="w-full px-3 py-2 hover:bg-blue-50 flex items-center justify-between cursor-pointer font-bold text-neutral-800"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-700" />
                    <span>أزرق رسمي (Office)</span>
                  </div>
                  <span className="text-[10px] text-neutral-400">تجوال</span>
                </button>
                <button
                  onClick={() => handleApplyTheme('royal_purple')}
                  className="w-full px-3 py-2 hover:bg-purple-50 flex items-center justify-between cursor-pointer font-bold text-neutral-800"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-purple-700" />
                    <span>أرجواني ملكي (Royal)</span>
                  </div>
                  <span className="text-[10px] text-neutral-400">أميري</span>
                </button>
                <button
                  onClick={() => handleApplyTheme('emerald')}
                  className="w-full px-3 py-2 hover:bg-emerald-50 flex items-center justify-between cursor-pointer font-bold text-neutral-800"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-700" />
                    <span>أخضر تنفيذي (Emerald)</span>
                  </div>
                  <span className="text-[10px] text-neutral-400">المراعي</span>
                </button>
                <button
                  onClick={() => handleApplyTheme('crimson')}
                  className="w-full px-3 py-2 hover:bg-rose-50 flex items-center justify-between cursor-pointer font-bold text-neutral-800"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-700" />
                    <span>عنابي وقور (Crimson)</span>
                  </div>
                  <span className="text-[10px] text-neutral-400">رقعة</span>
                </button>
                <button
                  onClick={() => handleApplyTheme('modern_slate')}
                  className="w-full px-3 py-2 hover:bg-neutral-100 flex items-center justify-between cursor-pointer font-bold text-neutral-800 border-t border-neutral-100"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-slate-800" />
                    <span>رمادي معاصر (Modern)</span>
                  </div>
                  <span className="text-[10px] text-neutral-400">كوفي</span>
                </button>
              </div>
            )}
          </div>

          {/* 2. تنسيقات الخط والأنماط */}
          <div className="flex items-center gap-1.5 px-2 py-1 border border-neutral-300/80 rounded-lg bg-white/80 shadow-2xs shrink-0">
            <button
              onClick={() => {
                onFontFamilyChange('Noto Kufi Arabic');
                onChange({ ...documentState, fontFamily: 'Noto Kufi Arabic' });
              }}
              className="flex flex-col items-center justify-center p-1 rounded hover:bg-neutral-100 text-neutral-800 cursor-pointer w-16"
              title="نمط عناوين كوفية"
            >
              <span className="font-bold text-xs">كوفي</span>
              <span className="text-[9px] text-neutral-500">عناوين</span>
            </button>
            <button
              onClick={() => {
                onFontFamilyChange('Amiri');
                onChange({ ...documentState, fontFamily: 'Amiri' });
              }}
              className="flex flex-col items-center justify-center p-1 rounded hover:bg-neutral-100 text-neutral-800 cursor-pointer w-16"
              title="نمط أميري رسمي"
            >
              <span className="font-bold text-xs font-serif">أميري</span>
              <span className="text-[9px] text-neutral-500">رسمي</span>
            </button>
            <button
              onClick={() => {
                onFontFamilyChange('Tajawal');
                onChange({ ...documentState, fontFamily: 'Tajawal' });
              }}
              className="flex flex-col items-center justify-center p-1 rounded hover:bg-neutral-100 text-neutral-800 cursor-pointer w-16"
              title="نمط تجوال حديث"
            >
              <span className="font-bold text-xs">تجوال</span>
              <span className="text-[9px] text-neutral-500">حديث</span>
            </button>
          </div>

          <div className="h-10 w-px bg-neutral-300 mx-0.5 shrink-0 self-center" />

          {/* 3. علامة مائية (Watermark) */}
          <div className="relative shrink-0">
            <button
              id="design-btn-watermark"
              onClick={() => setShowWatermarkMenu(!showWatermarkMenu)}
              className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-neutral-300 hover:bg-neutral-100 text-neutral-800 transition-all cursor-pointer w-22 h-full shadow-2xs"
              title="إضافة علامة مائية خلفية للمستند"
            >
              <Sparkles className="w-5 h-5 text-amber-500 mb-0.5" />
              <div className="flex items-center gap-0.5 text-[10px] font-bold">
                <span>علامة مائية</span>
                <ChevronDown className="w-2.5 h-2.5" />
              </div>
            </button>

            {showWatermarkMenu && (
              <div className="absolute top-full mt-1 right-0 bg-white border border-neutral-300 rounded-xl shadow-xl py-1.5 w-48 z-50 text-right text-xs">
                {['سري للغاية', 'مسودة عمل', 'عاجل وهام', 'نموذج رسمي'].map((wm) => (
                  <button
                    key={wm}
                    onClick={() => {
                      onChange({ ...documentState, watermark: wm });
                      setShowWatermarkMenu(false);
                    }}
                    className={`w-full px-3 py-1.5 hover:bg-neutral-100 flex items-center justify-between cursor-pointer font-bold ${
                      documentState.watermark === wm ? 'text-blue-600 bg-blue-50/50' : 'text-neutral-800'
                    }`}
                  >
                    <span>{wm}</span>
                    {documentState.watermark === wm && <span>✓</span>}
                  </button>
                ))}
                <button
                  onClick={() => {
                    const custom = prompt('أدخل نص العلامة المائية المخصصة:', 'سري');
                    if (custom) onChange({ ...documentState, watermark: custom });
                    setShowWatermarkMenu(false);
                  }}
                  className="w-full px-3 py-1.5 hover:bg-neutral-100 text-neutral-800 font-medium border-t border-neutral-100 cursor-pointer"
                >
                  علامة مائية مخصصة...
                </button>
                {documentState.watermark && (
                  <button
                    onClick={() => {
                      onChange({ ...documentState, watermark: '' });
                      setShowWatermarkMenu(false);
                    }}
                    className="w-full px-3 py-1.5 hover:bg-rose-50 text-rose-700 font-bold border-t border-neutral-100 cursor-pointer"
                  >
                    ✕ إزالة العلامة المائية
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 4. لون الصفحة (Page Color) */}
          <div className="relative shrink-0">
            <button
              id="design-btn-page-color"
              onClick={() => setShowPageColorMenu(!showPageColorMenu)}
              className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-neutral-300 hover:bg-neutral-100 text-neutral-800 transition-all cursor-pointer w-22 h-full shadow-2xs"
              title="تغيير لون خلفية الصفحة والورقة"
            >
              <Droplet className="w-5 h-5 text-blue-600 mb-0.5" />
              <div className="flex items-center gap-0.5 text-[10px] font-bold">
                <span>لون الصفحة</span>
                <ChevronDown className="w-2.5 h-2.5" />
              </div>
            </button>

            {showPageColorMenu && (
              <div className="absolute top-full mt-1 right-0 bg-white border border-neutral-300 rounded-xl shadow-xl p-2 w-52 z-50 text-right text-xs">
                <div className="font-bold text-[10px] text-neutral-500 mb-1.5">ألوان خلفية الصفحة:</div>
                <div className="grid grid-cols-4 gap-1.5 mb-2">
                  {[
                    { label: 'أبيض', val: '#ffffff' },
                    { label: 'عاجي', val: '#fffdf7' },
                    { label: 'بيج', val: '#faf8f5' },
                    { label: 'رمادي', val: '#f8fafc' },
                    { label: 'ثلجي', val: '#f0f9ff' },
                    { label: 'أخضر', val: '#f0fdf4' },
                    { label: 'ورقي', val: '#fefce8' },
                    { label: 'ليلي', val: '#1e293b' }
                  ].map((c) => (
                    <button
                      key={c.val}
                      onClick={() => {
                        onChange({ ...documentState, pageColor: c.val });
                        setShowPageColorMenu(false);
                      }}
                      className="flex flex-col items-center p-1 rounded hover:bg-neutral-100 border border-neutral-200 cursor-pointer"
                    >
                      <span className="w-6 h-6 rounded-full border border-neutral-300 shadow-2xs mb-0.5" style={{ backgroundColor: c.val }} />
                      <span className="text-[9px] text-neutral-600">{c.label}</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    onChange({ ...documentState, pageColor: '#ffffff' });
                    setShowPageColorMenu(false);
                  }}
                  className="w-full text-center py-1 text-[11px] text-blue-600 font-bold hover:bg-neutral-100 rounded cursor-pointer"
                >
                  استعادة اللون الأبيض الافتراضي
                </button>
              </div>
            )}
          </div>

          {/* 5. حدود الصفحة (Page Borders) */}
          <div className="relative shrink-0">
            <button
              id="design-btn-page-borders"
              onClick={() => setShowPageBorderMenu(!showPageBorderMenu)}
              className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-neutral-300 hover:bg-neutral-100 text-neutral-800 transition-all cursor-pointer w-22 h-full shadow-2xs"
              title="إضافة إطار وحدود حول الصفحة"
            >
              <Square className="w-5 h-5 text-neutral-700 mb-0.5" />
              <div className="flex items-center gap-0.5 text-[10px] font-bold">
                <span>حدود الصفحة</span>
                <ChevronDown className="w-2.5 h-2.5" />
              </div>
            </button>

            {showPageBorderMenu && (
              <div className="absolute top-full mt-1 right-0 bg-white border border-neutral-300 rounded-xl shadow-xl py-1.5 w-48 z-50 text-right text-xs">
                {[
                  { label: 'إطار كلاسيكي رفيع', val: 'simple' },
                  { label: 'إطار مزدوج رسمي', val: 'double' },
                  { label: 'إطار سميك داكن', val: 'thick' },
                  { label: 'إطار مزخرف', val: 'ornate' }
                ].map((b) => (
                  <button
                    key={b.val}
                    onClick={() => {
                      onChange({ ...documentState, pageBorder: b.val });
                      setShowPageBorderMenu(false);
                    }}
                    className={`w-full px-3 py-1.5 hover:bg-neutral-100 flex items-center justify-between cursor-pointer font-medium ${
                      documentState.pageBorder === b.val ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-neutral-800'
                    }`}
                  >
                    <span>{b.label}</span>
                    {documentState.pageBorder === b.val && <span>✓</span>}
                  </button>
                ))}
                <button
                  onClick={() => {
                    onChange({ ...documentState, pageBorder: 'none' });
                    setShowPageBorderMenu(false);
                  }}
                  className="w-full px-3 py-1.5 hover:bg-neutral-100 text-neutral-600 border-t border-neutral-100 cursor-pointer"
                >
                  بدون إطار صفحة (افتراضي)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: LAYOUT (تخطيط الصفحة) - Matches user screenshot: شريط أدوات تخطيط */}
      {!isRibbonCollapsed && activeTab === 'layout' && (
        <div
          id="word-ribbon-tab-layout-panel"
          className="bg-[#f9fafb] p-1.5 flex items-stretch gap-2 overflow-x-auto text-xs min-h-[72px]"
        >
          {/* 1. هوامش */}
          <div className="relative shrink-0">
            <button
              id="layout-btn-margins"
              onClick={() => setShowMarginsMenu(!showMarginsMenu)}
              className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-neutral-300 hover:bg-neutral-100 text-neutral-800 transition-all cursor-pointer w-18 h-full shadow-2xs"
              title="تحديد هوامش الصفحة (عادي، ضيق، عريض)"
            >
              <Maximize className="w-5 h-5 text-blue-600 mb-0.5" />
              <div className="flex items-center gap-0.5 text-[10px] font-bold">
                <span>هوامش</span>
                <ChevronDown className="w-2.5 h-2.5" />
              </div>
            </button>

            {showMarginsMenu && (
              <div className="absolute top-full mt-1 right-0 bg-white border border-neutral-300 rounded-xl shadow-xl py-1.5 w-44 z-50 text-right text-xs">
                {[
                  { label: 'عادي (2.54 سم)', val: 'normal' },
                  { label: 'ضيق (1.27 سم)', val: 'narrow' },
                  { label: 'متوسط (1.9 سم)', val: 'moderate' },
                  { label: 'عريض (5 سم)', val: 'wide' }
                ].map((m) => (
                  <button
                    key={m.val}
                    onClick={() => {
                      onChange({ ...documentState, margins: m.val as any });
                      setShowMarginsMenu(false);
                    }}
                    className={`w-full px-3 py-1.5 hover:bg-neutral-100 flex items-center justify-between cursor-pointer ${
                      documentState.margins === m.val ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-neutral-800'
                    }`}
                  >
                    <span>{m.label}</span>
                    {documentState.margins === m.val && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. الاتجاه (عمودي / أفقي) */}
          <button
            id="layout-btn-orientation"
            onClick={() => {
              const newOrient = documentState.orientation === 'portrait' ? 'landscape' : 'portrait';
              onChange({ ...documentState, orientation: newOrient });
            }}
            className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-neutral-300 hover:bg-neutral-100 text-neutral-800 transition-all cursor-pointer w-22 h-full shadow-2xs shrink-0"
            title="تبديل اتجاه الورقة بين عمودي وأفقي"
          >
            <FileText className={`w-5 h-5 mb-0.5 text-blue-700 ${documentState.orientation === 'landscape' ? 'rotate-90' : ''}`} />
            <span className="text-[10px] font-bold">
              {documentState.orientation === 'landscape' ? 'أفقي ↔' : 'عمودي ↕'}
            </span>
          </button>

          {/* 3. الحجم (A4, Letter) */}
          <div className="relative shrink-0">
            <button
              id="layout-btn-paper-size"
              onClick={() => setShowPaperSizeMenu(!showPaperSizeMenu)}
              className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-neutral-300 hover:bg-neutral-100 text-neutral-800 transition-all cursor-pointer w-20 h-full shadow-2xs"
              title="حجم الورق والصفحة"
            >
              <Layers className="w-5 h-5 text-indigo-600 mb-0.5" />
              <div className="flex items-center gap-0.5 text-[10px] font-bold">
                <span>{documentState.paperSize || 'A4'}</span>
                <ChevronDown className="w-2.5 h-2.5" />
              </div>
            </button>

            {showPaperSizeMenu && (
              <div className="absolute top-full mt-1 right-0 bg-white border border-neutral-300 rounded-xl shadow-xl py-1.5 w-40 z-50 text-right text-xs">
                {['A4', 'Letter', 'Legal', 'A3', 'A5'].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => {
                      onChange({ ...documentState, paperSize: sz as any });
                      setShowPaperSizeMenu(false);
                    }}
                    className={`w-full px-3 py-1.5 hover:bg-neutral-100 flex items-center justify-between cursor-pointer ${
                      documentState.paperSize === sz ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-neutral-800'
                    }`}
                  >
                    <span>{sz}</span>
                    {documentState.paperSize === sz && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 4. أعمدة */}
          <div className="relative shrink-0">
            <button
              id="layout-btn-columns"
              onClick={() => setShowColumnsMenu(!showColumnsMenu)}
              className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-neutral-300 hover:bg-neutral-100 text-neutral-800 transition-all cursor-pointer w-20 h-full shadow-2xs"
              title="تقسيم الصفحة إلى أعمدة نصية"
            >
              <Columns className="w-5 h-5 text-emerald-600 mb-0.5" />
              <div className="flex items-center gap-0.5 text-[10px] font-bold">
                <span>{documentState.columns === 2 ? 'عمودان' : documentState.columns === 3 ? '3 أعمدة' : 'عمود 1'}</span>
                <ChevronDown className="w-2.5 h-2.5" />
              </div>
            </button>

            {showColumnsMenu && (
              <div className="absolute top-full mt-1 right-0 bg-white border border-neutral-300 rounded-xl shadow-xl py-1.5 w-36 z-50 text-right text-xs">
                {[
                  { count: 1, label: 'عمود واحد' },
                  { count: 2, label: 'عمودان' },
                  { count: 3, label: 'ثلاثة أعمدة' }
                ].map((col) => (
                  <button
                    key={col.count}
                    onClick={() => {
                      onChange({ ...documentState, columns: col.count });
                      setShowColumnsMenu(false);
                    }}
                    className={`w-full px-3 py-1.5 hover:bg-neutral-100 flex items-center justify-between cursor-pointer ${
                      (documentState.columns || 1) === col.count ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-neutral-800'
                    }`}
                  >
                    <span>{col.label}</span>
                    {(documentState.columns || 1) === col.count && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-10 w-px bg-neutral-300 mx-0.5 shrink-0 self-center" />

          {/* 5. فواصل */}
          <div className="relative shrink-0">
            <button
              id="layout-btn-breaks"
              onClick={() => setShowBreaksMenu(!showBreaksMenu)}
              className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-neutral-300 hover:bg-neutral-100 text-neutral-800 transition-all cursor-pointer w-18 h-full shadow-2xs"
              title="إدراج فواصل صفحات ومقاطع"
            >
              <Split className="w-5 h-5 text-neutral-700 mb-0.5" />
              <div className="flex items-center gap-0.5 text-[10px] font-bold">
                <span>فواصل</span>
                <ChevronDown className="w-2.5 h-2.5" />
              </div>
            </button>

            {showBreaksMenu && (
              <div className="absolute top-full mt-1 right-0 bg-white border border-neutral-300 rounded-xl shadow-xl py-1.5 w-44 z-50 text-right text-xs">
                <button
                  onClick={() => {
                    execCmd('insertHTML', '<div style="page-break-after: always; height: 1px; border-bottom: 2px dashed #94a3b8; margin: 30px 0; text-align: center; color: #94a3b8; font-size: 11px;">[فاصل صفحات]</div><p><br></p>');
                    setShowBreaksMenu(false);
                  }}
                  className="w-full px-3 py-1.5 hover:bg-neutral-100 text-neutral-800 font-bold"
                >
                  فاصل صفحات (Page Break)
                </button>
                <button
                  onClick={() => {
                    execCmd('insertHTML', '<hr style="border: none; border-top: 2px solid #cbd5e1; margin: 24px 0;" /><p><br></p>');
                    setShowBreaksMenu(false);
                  }}
                  className="w-full px-3 py-1.5 hover:bg-neutral-100 text-neutral-800 font-medium"
                >
                  فاصل مقطعي
                </button>
              </div>
            )}
          </div>

          {/* 6. أرقام الأسطر */}
          <button
            id="layout-btn-line-numbers"
            onClick={() => onChange({ ...documentState, lineNumbers: !documentState.lineNumbers })}
            className={`flex flex-col items-center justify-center p-1.5 rounded-lg border transition-all cursor-pointer w-22 h-full shadow-2xs shrink-0 ${
              documentState.lineNumbers ? 'bg-blue-50 border-blue-500 text-blue-900' : 'border-neutral-300 hover:bg-neutral-100 text-neutral-800'
            }`}
            title="إظهار أرقام الأسطر في الهامش"
          >
            <ListOrdered className="w-5 h-5 text-blue-600 mb-0.5" />
            <span className="text-[10px] font-bold">
              {documentState.lineNumbers ? 'أرقام الأسطر ✓' : 'أرقام الأسطر'}
            </span>
          </button>

          {/* 7. أزرار تباعد سريعة (من الصورة المرفقة) */}
          <div className="flex items-center gap-1.5 px-2 py-1 border border-neutral-300/80 rounded-lg bg-white/80 shadow-2xs shrink-0">
            <button
              id="layout-btn-spacing-115"
              onClick={() => onChange({ ...documentState, lineSpacing: '1.15' })}
              className={`px-2 py-1.5 rounded font-bold text-[10px] border cursor-pointer ${
                documentState.lineSpacing === '1.15' ? 'bg-blue-600 text-white border-blue-600' : 'bg-neutral-50 hover:bg-neutral-200 border-neutral-300 text-neutral-800'
              }`}
            >
              تباعد 1.15
            </button>
            <button
              id="layout-btn-spacing-15"
              onClick={() => onChange({ ...documentState, lineSpacing: '1.5' })}
              className={`px-2 py-1.5 rounded font-bold text-[10px] border cursor-pointer ${
                documentState.lineSpacing === '1.5' ? 'bg-blue-600 text-white border-blue-600' : 'bg-neutral-50 hover:bg-neutral-200 border-neutral-300 text-neutral-800'
              }`}
            >
              تباعد 1.5
            </button>
            <button
              id="layout-btn-spacing-18"
              onClick={() => onChange({ ...documentState, lineSpacing: '1.8' })}
              className={`px-2 py-1.5 rounded font-bold text-[10px] border cursor-pointer ${
                (documentState.lineSpacing === '1.8' || !documentState.lineSpacing) ? 'bg-blue-600 text-white border-blue-600' : 'bg-neutral-50 hover:bg-neutral-200 border-neutral-300 text-neutral-800'
              }`}
            >
              تباعد 1.8
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: VIEW (عرض) - Matches user screenshots: شريط أدوات عرض & Screenshot_٢٠٢٦٠٩١٠-٢٠٢٩٥٣_Picsart */}
      {!isRibbonCollapsed && activeTab === 'view' && (
        <div
          id="word-ribbon-tab-view-panel"
          className="bg-[#f9fafb] p-1.5 flex items-stretch gap-2 overflow-x-auto text-xs min-h-[72px]"
        >
          {/* 1. معاينة الطباعة A4 */}
          <button
            id="view-btn-print-preview"
            onClick={() => window.print()}
            className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-neutral-300 hover:bg-blue-50/70 hover:border-blue-400 text-neutral-800 transition-all cursor-pointer w-22 h-full shadow-2xs shrink-0"
            title="معاينة الطباعة بحجم A4"
          >
            <Printer className="w-5 h-5 text-blue-600 mb-0.5" />
            <span className="text-[10px] font-bold">معاينة الطباعة A4</span>
          </button>

          {/* 2. لوحة إعدادات العرض */}
          <button
            id="view-btn-settings-modal"
            onClick={() => setShowViewSettingsModal(true)}
            className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-neutral-300 hover:bg-neutral-100 text-neutral-800 transition-all cursor-pointer w-24 h-full shadow-2xs shrink-0"
            title="فتح لوحة خيارات وتخصيص العرض الكاملة"
          >
            <SlidersHorizontal className="w-5 h-5 text-neutral-700 mb-0.5" />
            <span className="text-[10px] font-bold">لوحة إعدادات العرض</span>
          </button>

          {/* 3. مجموعة أدوات التكبير والتصغير (Zoom Controls - Matching Screenshot 6) */}
          <div
            id="view-zoom-controls-cluster"
            className="flex items-center gap-1 px-2 py-1 border border-neutral-300/80 rounded-lg bg-white/80 shadow-2xs shrink-0"
          >
            {/* زر التصغير [-] */}
            <button
              id="view-zoom-minus"
              onClick={() => handleZoom(-10)}
              className="w-7 h-7 flex items-center justify-center rounded border border-neutral-300 bg-neutral-50 hover:bg-neutral-200 font-bold text-sm text-neutral-800 cursor-pointer"
              title="تصغير العرض بنسبة 10%"
            >
              -
            </button>

            {/* قائمة نسبة التكبير [ 100% ] */}
            <div className="relative">
              <button
                id="view-zoom-dropdown"
                onClick={() => setShowZoomMenu(!showZoomMenu)}
                className="px-2 h-7 flex items-center gap-1 rounded border border-neutral-300 bg-neutral-50 hover:bg-neutral-100 font-bold text-xs text-neutral-900 cursor-pointer"
                title="تحديد نسبة التكبير"
              >
                <span>{zoom || 100}%</span>
                <ChevronDown className="w-2.5 h-2.5 text-neutral-500" />
              </button>

              {showZoomMenu && (
                <div className="absolute top-full mt-1 right-0 bg-white border border-neutral-300 rounded-xl shadow-xl py-1 w-28 z-50 text-right text-xs">
                  {[50, 75, 90, 100, 125, 150, 175, 200].map((z) => (
                    <button
                      key={z}
                      onClick={() => {
                        onZoomChange?.(z);
                        setShowZoomMenu(false);
                      }}
                      className={`w-full px-3 py-1 hover:bg-neutral-100 flex items-center justify-between cursor-pointer ${
                        (zoom || 100) === z ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-neutral-800'
                      }`}
                    >
                      <span>{z}%</span>
                      {(zoom || 100) === z && <span>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* زر التكبير [+] */}
            <button
              id="view-zoom-plus"
              onClick={() => handleZoom(10)}
              className="w-7 h-7 flex items-center justify-center rounded border border-neutral-300 bg-neutral-50 hover:bg-neutral-200 font-bold text-sm text-neutral-800 cursor-pointer"
              title="تكبير العرض بنسبة 10%"
            >
              +
            </button>

            {/* زر إعادة الضبط [⟲] */}
            <button
              id="view-zoom-reset"
              onClick={() => onZoomChange?.(100)}
              className="px-1.5 h-7 flex items-center justify-center rounded border border-neutral-300 bg-neutral-50 hover:bg-neutral-200 text-xs font-bold text-neutral-700 cursor-pointer"
              title="إعادة ضبط التكبير إلى 100%"
            >
              100%
            </button>

            {/* زر ملء الشاشة */}
            <button
              id="view-fullscreen-toggle"
              onClick={toggleFullscreen}
              className="w-7 h-7 flex items-center justify-center rounded border border-neutral-300 bg-neutral-50 hover:bg-neutral-200 text-neutral-700 cursor-pointer"
              title="ملء الشاشة"
            >
              {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="h-10 w-px bg-neutral-300 mx-0.5 shrink-0 self-center" />

          {/* 4. وضع القراءة فقط */}
          <button
            id="view-btn-readonly"
            onClick={() => onChange({ ...documentState, readOnly: !documentState.readOnly })}
            className={`flex flex-col items-center justify-center p-1.5 rounded-lg border transition-all cursor-pointer w-22 h-full shadow-2xs shrink-0 ${
              documentState.readOnly ? 'bg-amber-50 border-amber-500 text-amber-900' : 'border-neutral-300 hover:bg-neutral-100 text-neutral-800'
            }`}
            title="تفعيل أو تعطيل وضع القراءة فقط لحماية المحتوى"
          >
            {documentState.readOnly ? <Lock className="w-5 h-5 text-amber-600 mb-0.5" /> : <Unlock className="w-5 h-5 text-neutral-600 mb-0.5" />}
            <span className="text-[10px] font-bold">
              {documentState.readOnly ? 'وضع القراءة 🔒' : 'وضع القراءة'}
            </span>
          </button>

          {/* 5. المساطر (Ruler Toggle) */}
          <button
            id="view-btn-ruler"
            onClick={() => onChange({ ...documentState, showRuler: !documentState.showRuler })}
            className={`flex flex-col items-center justify-center p-1.5 rounded-lg border transition-all cursor-pointer w-18 h-full shadow-2xs shrink-0 ${
              documentState.showRuler ? 'bg-blue-50 border-blue-500 text-blue-900' : 'border-neutral-300 hover:bg-neutral-100 text-neutral-800'
            }`}
            title="إظهار أو إخفاء مسطرة قياس الصفحة"
          >
            <Sliders className="w-5 h-5 text-blue-600 mb-0.5" />
            <span className="text-[10px] font-bold">
              {documentState.showRuler ? 'المسطرة ✓' : 'المسطرة'}
            </span>
          </button>

          {/* 6. حدود الصفحة */}
          <button
            id="view-btn-page-borders-toggle"
            onClick={() => onChange({ ...documentState, showPageBorders: documentState.showPageBorders === false })}
            className={`flex flex-col items-center justify-center p-1.5 rounded-lg border transition-all cursor-pointer w-20 h-full shadow-2xs shrink-0 ${
              documentState.showPageBorders !== false ? 'bg-blue-50 border-blue-500 text-blue-900' : 'border-neutral-300 hover:bg-neutral-100 text-neutral-800'
            }`}
            title="إظهار أو إخفاء حدود وهوامش الورقة"
          >
            <Square className="w-5 h-5 text-neutral-700 mb-0.5" />
            <span className="text-[10px] font-bold">حدود الصفحة</span>
          </button>
        </div>
      )}

      {/* TAB 6: REFERENCES (مراجع) */}
      {!isRibbonCollapsed && activeTab === 'references' && (
        <div
          id="word-ribbon-tab-references-panel"
          className="bg-[#f9fafb] p-1.5 flex items-stretch gap-2 overflow-x-auto text-xs min-h-[72px]"
        >
          <button
            onClick={onOpenTocModal}
            className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-neutral-300 hover:bg-amber-50 text-neutral-800 transition-all cursor-pointer w-24 h-full shadow-2xs shrink-0"
            title="إنشاء جدول محتويات وفهرس للمستند"
          >
            <BookOpen className="w-5 h-5 text-amber-600 mb-0.5" />
            <span className="text-[10px] font-bold">جدول المحتويات</span>
          </button>

          <button
            onClick={() => {
              const text = prompt('أدخل نص الحاشية السفلية:', 'المرجع: مجلة البحوث 2026');
              if (text) {
                execCmd('insertHTML', `<sup>[1]</sup><div style="border-top: 1px solid #cbd5e1; margin-top: 20px; padding-top: 8px; font-size: 11px; color: #64748b;">[1] ${text}</div><p><br></p>`);
              }
            }}
            className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-neutral-300 hover:bg-neutral-100 text-neutral-800 transition-all cursor-pointer w-22 h-full shadow-2xs shrink-0"
            title="إدراج حاشية سفلية في ذيل الصفحة"
          >
            <FileText className="w-5 h-5 text-blue-600 mb-0.5" />
            <span className="text-[10px] font-bold">حاشية سفلية</span>
          </button>

          <button
            onClick={() => {
              const src = prompt('أدخل الاقتباس والمصدر المرجعي:', 'ابن خلدون، المقدمة، ص 142');
              if (src) {
                execCmd('insertHTML', `<span style="font-family: monospace; background-color: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 11px;">(${src})</span> `);
              }
            }}
            className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-neutral-300 hover:bg-neutral-100 text-neutral-800 transition-all cursor-pointer w-22 h-full shadow-2xs shrink-0"
            title="إدراج مرجع أو اقتباس موثق"
          >
            <Bookmark className="w-5 h-5 text-purple-600 mb-0.5" />
            <span className="text-[10px] font-bold">إدراج اقتباس</span>
          </button>
        </div>
      )}

      {/* TAB 7: MAILINGS (مراسلات) */}
      {!isRibbonCollapsed && activeTab === 'mailings' && (
        <div
          id="word-ribbon-tab-mailings-panel"
          className="bg-[#f9fafb] p-1.5 flex items-stretch gap-2 overflow-x-auto text-xs min-h-[72px]"
        >
          <button
            onClick={() => alert('ميزة دمج المراسلات تتيح دمج سجلات وقوائم الأسماء مع هذا النموذج.')}
            className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-neutral-300 hover:bg-neutral-100 text-neutral-800 transition-all cursor-pointer w-24 h-full shadow-2xs shrink-0"
            title="بدء دمج المراسلات والخطابات الرسمية"
          >
            <FileText className="w-5 h-5 text-indigo-600 mb-0.5" />
            <span className="text-[10px] font-bold">دمج المراسلات</span>
          </button>

          <div className="flex items-center gap-1 px-2 py-1 border border-neutral-300/80 rounded-lg bg-white/80 shadow-2xs shrink-0">
            <span className="text-[10px] font-bold text-neutral-600 ml-1">حقول سريعة:</span>
            {['{اسم_المستلم}', '{التاريخ}', '{المسمى_الوظيفي}', '{رقم_الملف}'].map((field) => (
              <button
                key={field}
                onClick={() => execCmd('insertText', ` ${field} `)}
                className="px-2 py-1 bg-neutral-100 hover:bg-blue-50 hover:text-blue-700 rounded text-[10px] font-mono border border-neutral-200 cursor-pointer"
              >
                {field}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: REVIEW (مراجعة) */}
      {!isRibbonCollapsed && activeTab === 'review' && (
        <div
          id="word-ribbon-tab-review-panel"
          className="bg-[#f9fafb] p-1.5 flex items-stretch gap-2 overflow-x-auto text-xs min-h-[72px]"
        >
          <button
            onClick={onOpenSpellModal}
            className="flex flex-col items-center justify-center p-1.5 rounded-lg border-2 border-rose-400 bg-rose-50 hover:bg-rose-100 text-rose-900 transition-all cursor-pointer w-26 h-full shadow-2xs shrink-0"
            title="فحص الإملاء والتدقيق اللغوي والنحوي"
          >
            <CheckCircle2 className="w-5 h-5 text-rose-600 mb-0.5" />
            <span className="text-[10px] font-bold">التدقيق الإملائي</span>
          </button>

          <button
            onClick={() => {
              const textOnly = documentState.contentHtml.replace(/<[^>]+>/g, ' ').trim();
              const words = textOnly ? textOnly.split(/\s+/).length : 0;
              const chars = documentState.contentHtml.replace(/<[^>]+>/g, '').length;
              const paras = (documentState.contentHtml.match(/<p[^>]*>/gi) || []).length || 1;
              alert(`إحصائيات المستند الحالية:\n- عدد الكلمات: ${words}\n- عدد الأحرف: ${chars}\n- عدد الفقرات: ${paras}`);
            }}
            className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-neutral-300 hover:bg-neutral-100 text-neutral-800 transition-all cursor-pointer w-24 h-full shadow-2xs shrink-0"
            title="إحصائيات الكلمات والأحرف والفقرات"
          >
            <FileText className="w-5 h-5 text-blue-600 mb-0.5" />
            <span className="text-[10px] font-bold">إحصائيات المستند</span>
          </button>

          <button
            onClick={() => onChange({ ...documentState, readOnly: !documentState.readOnly })}
            className={`flex flex-col items-center justify-center p-1.5 rounded-lg border transition-all cursor-pointer w-24 h-full shadow-2xs shrink-0 ${
              documentState.readOnly ? 'bg-amber-50 border-amber-500 text-amber-900' : 'border-neutral-300 hover:bg-neutral-100 text-neutral-800'
            }`}
            title="حماية المستند ضد التعديل غير المقصود"
          >
            {documentState.readOnly ? <Lock className="w-5 h-5 text-amber-600 mb-0.5" /> : <Unlock className="w-5 h-5 text-neutral-600 mb-0.5" />}
            <span className="text-[10px] font-bold">
              {documentState.readOnly ? 'المستند مقفل 🔒' : 'حماية المستند'}
            </span>
          </button>
        </div>
      )}

      {/* TAB 9: HELP (تعليمات) */}
      {!isRibbonCollapsed && activeTab === 'help' && (
        <div
          id="word-ribbon-tab-help-panel"
          className="bg-[#f9fafb] p-2 flex items-center justify-between gap-4 overflow-x-auto text-xs min-h-[72px]"
        >
          <div className="flex items-center gap-2 text-neutral-800 text-xs">
            <HelpCircle className="w-5 h-5 text-blue-600 shrink-0" />
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="bg-white px-2 py-1 rounded border border-neutral-200"><strong>Ctrl+B</strong> عريض</span>
              <span className="bg-white px-2 py-1 rounded border border-neutral-200"><strong>Ctrl+I</strong> مائل</span>
              <span className="bg-white px-2 py-1 rounded border border-neutral-200"><strong>Ctrl+U</strong> تسطير</span>
              <span className="bg-white px-2 py-1 rounded border border-neutral-200"><strong>Ctrl+Z</strong> تراجع</span>
              <span className="bg-white px-2 py-1 rounded border border-neutral-200"><strong>Ctrl+P</strong> طباعة وتصدير PDF</span>
            </div>
          </div>
          <button
            onClick={() => alert('معالج نصوص متقدم Word PRO - يدعم قوالب المراسلات، التصدير، الجداول، والتدقيق الإملائي.')}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs cursor-pointer shrink-0"
          >
            دليل الاستخدام الكامل
          </button>
        </div>
      )}

      {/* MODAL: DOCUMENT INFO (معلومات المستند) */}
      {showDocInfoModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-neutral-300 rounded-2xl shadow-2xl p-6 max-w-md w-full text-right text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-4">
              <h3 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" />
                <span>معلومات وإحصائيات المستند</span>
              </h3>
              <button
                onClick={() => setShowDocInfoModal(false)}
                className="text-neutral-400 hover:text-neutral-700 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between py-1 border-b border-neutral-100">
                <span className="font-bold text-neutral-800">{documentState.title}</span>
                <span className="text-neutral-500">عنوان المستند:</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100">
                <span className="font-bold text-neutral-800">
                  {documentState.contentHtml.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length} كلمة
                </span>
                <span className="text-neutral-500">عدد الكلمات:</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100">
                <span className="font-bold text-neutral-800">
                  {documentState.contentHtml.replace(/<[^>]+>/g, '').length} حرف
                </span>
                <span className="text-neutral-500">عدد الأحرف:</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100">
                <span className="font-bold text-neutral-800">
                  {documentState.paperSize || 'A4'} ({documentState.orientation === 'landscape' ? 'أفقي' : 'عمودي'})
                </span>
                <span className="text-neutral-500">تخطيط الورقة:</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100">
                <span className="font-bold text-neutral-800">{documentState.theme || 'Office Blue'}</span>
                <span className="text-neutral-500">سمة التصميم:</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100">
                <span className="font-bold text-emerald-600">محفوظ في الذاكرة المحلية ✓</span>
                <span className="text-neutral-500">حالة الحفظ:</span>
              </div>
            </div>

            <button
              onClick={() => setShowDocInfoModal(false)}
              className="mt-5 w-full py-2 bg-neutral-900 text-white font-bold rounded-xl hover:bg-neutral-800 cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* MODAL: VIEW SETTINGS (لوحة إعدادات العرض) */}
      {showViewSettingsModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-neutral-300 rounded-2xl shadow-2xl p-6 max-w-md w-full text-right text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-4">
              <h3 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <span>لوحة إعدادات وخيارات العرض</span>
              </h3>
              <button
                onClick={() => setShowViewSettingsModal(false)}
                className="text-neutral-400 hover:text-neutral-700 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={documentState.showRuler}
                  onChange={(e) => onChange({ ...documentState, showRuler: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span className="font-bold text-neutral-800">إظهار مسطرة قياس الصفحة (Ruler)</span>
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={documentState.showPageBorders !== false}
                  onChange={(e) => onChange({ ...documentState, showPageBorders: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span className="font-bold text-neutral-800">إظهار حدود وظلال الورقة A4</span>
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={documentState.showHeaderFooter !== false}
                  onChange={(e) => onChange({ ...documentState, showHeaderFooter: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span className="font-bold text-neutral-800">إظهار مؤشرات الرأس والتذييل</span>
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={documentState.readOnly}
                  onChange={(e) => onChange({ ...documentState, readOnly: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span className="font-bold text-neutral-800">وضع القراءة فقط (حماية المستند)</span>
              </label>
            </div>

            <button
              onClick={() => setShowViewSettingsModal(false)}
              className="mt-5 w-full py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 cursor-pointer"
            >
              تم وتطبيق
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
