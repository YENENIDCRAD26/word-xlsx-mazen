import React, { useState } from 'react';
import { 
  WordDocumentState, 
  WordRibbonTab 
} from '../../types';
import { 
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
  Plus, 
  Minus, 
  FileText, 
  FolderOpen, 
  Save, 
  Download, 
  Printer, 
  Table as TableIcon, 
  Image as ImageIcon, 
  Shapes, 
  Minus as DividerIcon, 
  Link2, 
  Bookmark, 
  Columns, 
  Palette, 
  Eraser, 
  Check, 
  FilePlus, 
  BookOpen, 
  Sliders, 
  ChevronDown, 
  Sparkles, 
  Layout, 
  Square, 
  Stamp, 
  CheckSquare, 
  Tag, 
  Heading1, 
  Heading2,
  FileCheck
} from 'lucide-react';

interface WordRibbonProps {
  activeTab: WordRibbonTab;
  onSelectTab: (tab: WordRibbonTab) => void;
  docState: WordDocumentState;
  onUpdateDoc: (partial: Partial<WordDocumentState>) => void;
  onExecCommand: (cmd: string, val?: string) => void;
  onInsertTable: (rows: number, cols: number) => void;
  onInsertImage: () => void;
  onInsertShape: (shape: string) => void;
  onInsertLine: () => void;
  onInsertLink: () => void;
  onNewDocument: () => void;
  onOpenDocument: () => void;
  onSaveDocument: () => void;
  onExportDoc: () => void;
  onExportPdf: () => void;
  onPrint: () => void;
  onTableAction?: (action: string) => void;
  onOpenSimulator?: () => void;
}

export const WordRibbon: React.FC<WordRibbonProps> = ({
  activeTab,
  onSelectTab,
  docState,
  onUpdateDoc,
  onExecCommand,
  onInsertTable,
  onInsertImage,
  onInsertShape,
  onInsertLine,
  onInsertLink,
  onNewDocument,
  onOpenDocument,
  onSaveDocument,
  onExportDoc,
  onExportPdf,
  onPrint,
  onTableAction,
  onOpenSimulator
}) => {
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showSpacingMenu, setShowSpacingMenu] = useState(false);
  const [showMarginsMenu, setShowMarginsMenu] = useState(false);
  const [showBorderMenu, setShowBorderMenu] = useState(false);
  const [showWatermarkMenu, setShowWatermarkMenu] = useState(false);
  const [showParagraphStyles, setShowParagraphStyles] = useState(false);
  const [showStampsMenu, setShowStampsMenu] = useState(false);
  const [showListStyles, setShowListStyles] = useState(false);

  const tabs: { id: WordRibbonTab; label: string; badge?: string }[] = [
    { id: 'file', label: 'ملف' },
    { id: 'home', label: 'الشريط الرئيسي' },
    { id: 'insert', label: 'إدراج' },
    { id: 'design', label: 'تصميم وإطارات', badge: 'جديد' },
    { id: 'table', label: 'أدوات الجدول' },
    { id: 'layout', label: 'تخطيط الصفحة' },
    { id: 'view', label: 'عرض ومعاينة' },
  ];

  const fontFamilies = [
    { name: 'أميري (Amiri - خط رسمي معتمد)', value: "'Amiri', serif" },
    { name: 'القاهرة (Cairo - حديث واضح)', value: "'Cairo', sans-serif" },
    { name: 'تجوال (Tajawal - مقروء وعصري)', value: "'Tajawal', sans-serif" },
    { name: 'خط النسخ (Noto Naskh Arabic)', value: "'Noto Naskh Arabic', serif" },
    { name: 'Traditional Arabic', value: "'Traditional Arabic', serif" },
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Times New Roman', value: "'Times New Roman', serif" },
  ];

  const fontSizes = [9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 28, 32, 36, 48];
  const lineSpacings = [1.0, 1.15, 1.3, 1.5, 1.8, 2.0, 2.5];
  const colors = ['#000000', '#1e293b', '#1e3a8a', '#065f46', '#b45309', '#991b1b', '#581c87', '#475569'];
  const highlightColors = ['transparent', '#fef08a', '#bbf7d0', '#bfdbfe', '#fbcfe8', '#fed7aa'];

  const borderStylesList = [
    { id: 'none', label: 'بلا إطار (None)' },
    { id: 'single', label: 'إطار بسيط (1pt Simple)' },
    { id: 'double', label: 'إطار رسمي مزدوج (Double Official)' },
    { id: 'gold', label: 'إطار مذهب ملكي (Royal Gold)' },
    { id: 'islamic', label: 'إطار إسلامي مزخرف (Islamic Geometric)' },
    { id: 'classic', label: 'إطار عريض كلاسيكي (Classic Frame)' },
  ];

  const handleApplyParagraphStyle = (styleType: string) => {
    setShowParagraphStyles(false);
    if (styleType === 'requests') {
      const html = `
        <div style="margin: 16px 0; padding: 14px 18px; border-right: 5px solid #1e3a8a; background: #f8fafc; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <strong style="color: #1e3a8a; font-size: 1.05em;">الطلبات الشرعية المعتمدة:</strong><br />
          1. إبراء ذمة المورث بإخراج الديون والمهور ومصاريف الدفن والتجهيز أولاً.<br />
          2. فرز وتجنيب حصص القاصرين وحق الوالدة الشرعي ثُم الشروع في القسمة العادلة.
        </div><p><br></p>
      `;
      onExecCommand('insertHTML', html);
    } else if (styleType === 'judgment') {
      const html = `
        <div style="margin: 16px 0; padding: 16px; border: 2px solid #b45309; background: #fffbeb; border-radius: 6px; text-align: center; color: #78350f;">
          <h3 style="margin-top: 0; color: #92400e; font-weight: bold;">باسم الشعب - منطوق الحكم / القرار القضائي:</h3>
          <p style="margin-bottom: 0;">حكمت المحكمة علنياً بمطابقة الفرز الشرعي وتصديق محرر الاتفاق واعتباره سنداً تنفيذياً ملزماً للكافة.</p>
        </div><p><br></p>
      `;
      onExecCommand('insertHTML', html);
    } else if (styleType === 'notice') {
      const html = `
        <div style="margin: 14px 0; padding: 12px 16px; background: #eff6ff; border-right: 4px solid #2563eb; border-radius: 4px; color: #1e40af;">
          <strong>تنبيه رسمي:</strong> يرجى إحضار أصول الوثائق والمستندات الثبوتية عند موعد الجلسة المحددة.
        </div><p><br></p>
      `;
      onExecCommand('insertHTML', html);
    } else if (styleType === 'quote') {
      const html = `
        <blockquote style="margin: 16px 0; padding: 10px 18px; border-right: 4px solid #94a3b8; background: #f1f5f9; font-style: italic; color: #334155;">
          "يُقسم المال الموروث بين الورثة الشرعيين وفق كتاب الله وسنة رسوله بعد سداد الديون والوصايا."
        </blockquote><p><br></p>
      `;
      onExecCommand('insertHTML', html);
    }
  };

  const handleInsertOfficialStamp = (type: 'court' | 'approved' | 'signature') => {
    setShowStampsMenu(false);
    if (type === 'court') {
      const html = `
        <div style="display: inline-block; margin: 16px; padding: 10px 16px; border: 3px double #1e3a8a; border-radius: 50%; width: 140px; height: 140px; text-align: center; color: #1e3a8a; box-shadow: 0 2px 4px rgba(0,0,0,0.1); vertical-align: middle;">
          <div style="font-size: 10px; font-weight: bold; margin-top: 14px;">الجمهورية اليمنية</div>
          <div style="font-size: 11px; font-weight: bold; margin: 4px 0;">محكمة القفر الإبتدائية</div>
          <div style="font-size: 18px;">⚖</div>
          <div style="font-size: 9px; font-weight: bold;">معتمد ومقيد رسمياً</div>
        </div>
      `;
      onExecCommand('insertHTML', html);
    } else if (type === 'approved') {
      const html = `
        <div style="display: inline-block; margin: 12px; padding: 8px 16px; border: 2px solid #065f46; background: #f0fdf4; border-radius: 6px; color: #065f46; font-weight: bold; font-size: 12px; text-align: center;">
          ✓ صُودق عليه بعد المعاينة والمطابقة الشرعية
        </div>
      `;
      onExecCommand('insertHTML', html);
    } else {
      const html = `
        <div style="display: flex; justify-content: space-between; gap: 20px; margin: 24px 0; border-top: 1px dashed #94a3b8; padding-top: 14px; text-align: center; color: #334155;">
          <div style="flex: 1;">
            <div style="font-weight: bold; font-size: 12px;">توقيع وبصمة المدعي / الورثة:</div>
            <div style="height: 60px; border: 1px dashed #cbd5e1; margin-top: 8px; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 11px;">(مكان البصمة والتوقيع)</div>
          </div>
          <div style="flex: 1;">
            <div style="font-weight: bold; font-size: 12px;">توقيع الكاتب والأمين الشرعي:</div>
            <div style="height: 60px; border: 1px dashed #cbd5e1; margin-top: 8px; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 11px;">(المصادقة والتوقيع)</div>
          </div>
          <div style="flex: 1;">
            <div style="font-weight: bold; font-size: 12px;">خاتم وتوقيع رئيس المحكمة:</div>
            <div style="height: 60px; border: 1px dashed #cbd5e1; margin-top: 8px; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 11px;">(الختم الرسمي)</div>
          </div>
        </div>
      `;
      onExecCommand('insertHTML', html);
    }
  };

  return (
    <div className="bg-white border-b border-slate-300 select-none no-print shadow-2xs" dir="rtl">
      {/* Ribbon Tabs List */}
      <div className="flex items-center px-3 border-b border-slate-200 overflow-x-auto bg-slate-50 text-xs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`px-3.5 py-1.5 font-medium relative whitespace-nowrap transition-colors flex items-center gap-1 ${
                isActive
                  ? 'text-blue-700 bg-white font-bold border-t-2 border-t-blue-600 border-x border-slate-200 shadow-2xs -mb-px'
                  : 'text-slate-700 hover:text-blue-600 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1 rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Global Simulation Button in Ribbon Header */}
        {onOpenSimulator && (
          <div className="mr-auto py-1">
            <button
              onClick={onOpenSimulator}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-[11px] shadow-xs transition active:scale-95 border border-amber-400"
              title="محاكاة واختبار إنشاء وتنسيق المستند وورد"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>محاكاة واختبار المستند 🚀</span>
            </button>
          </div>
        )}
      </div>

      {/* Ribbon Action Bar Content based on Active Tab */}
      <div className="p-1.5 min-h-[52px] flex items-center gap-2 overflow-x-auto bg-slate-50/80 text-slate-800 text-xs">
        
        {/* ================= HOME TAB (الشريط الرئيسي) ================= */}
        {activeTab === 'home' && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Font Family Dropdown */}
            <div className="flex items-center bg-white border border-slate-300 rounded px-1.5 py-1 shadow-2xs">
              <select
                value={docState.fontFamily}
                onChange={(e) => {
                  onUpdateDoc({ fontFamily: e.target.value });
                  onExecCommand('fontName', e.target.value);
                }}
                className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer pr-1"
              >
                {fontFamilies.map((f, i) => (
                  <option key={i} value={f.value}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size Dropdown */}
            <div className="flex items-center bg-white border border-slate-300 rounded px-1.5 py-1 shadow-2xs">
              <select
                value={docState.fontSize}
                onChange={(e) => {
                  const size = parseInt(e.target.value, 10);
                  onUpdateDoc({ fontSize: size });
                  onExecCommand('fontSize', '4');
                }}
                className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer"
              >
                {fontSizes.map((s) => (
                  <option key={s} value={s}>
                    {s} pt
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size Increase / Decrease */}
            <div className="flex items-center bg-white border border-slate-300 rounded shadow-2xs">
              <button
                onClick={() => onUpdateDoc({ fontSize: Math.min(docState.fontSize + 2, 72) })}
                className="px-1.5 py-1 hover:bg-slate-100 text-slate-700 font-bold border-l border-slate-200"
                title="تكبير الخط"
              >
                A+
              </button>
              <button
                onClick={() => onUpdateDoc({ fontSize: Math.max(docState.fontSize - 2, 8) })}
                className="px-1.5 py-1 hover:bg-slate-100 text-slate-700 font-bold"
                title="تصغير الخط"
              >
                A-
              </button>
            </div>

            <div className="w-px h-6 bg-slate-300 mx-0.5" />

            {/* Text Styling: Bold, Italic, Underline, Strike */}
            <div className="flex items-center bg-white border border-slate-300 rounded p-0.5 shadow-2xs gap-0.5">
              <button
                onClick={() => onExecCommand('bold')}
                className="p-1 hover:bg-slate-100 rounded text-slate-700 font-bold"
                title="غامق (Ctrl+B)"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onExecCommand('italic')}
                className="p-1 hover:bg-slate-100 rounded text-slate-700 italic"
                title="مائل (Ctrl+I)"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onExecCommand('underline')}
                className="p-1 hover:bg-slate-100 rounded text-slate-700 underline"
                title="تسطير (Ctrl+U)"
              >
                <Underline className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onExecCommand('strikeThrough')}
                className="p-1 hover:bg-slate-100 rounded text-slate-700 line-through"
                title="يتوسطه خط"
              >
                <Strikethrough className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Text Color Picker */}
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="flex items-center gap-1 bg-white border border-slate-300 rounded px-2 py-1 hover:bg-slate-100 shadow-2xs"
                title="لون الخط"
              >
                <span className="font-bold text-xs" style={{ color: docState.textColor }}>A</span>
                <div className="w-3 h-1 rounded-xs" style={{ backgroundColor: docState.textColor }} />
                <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
              </button>

              {showColorPicker && (
                <div className="absolute top-8 right-0 bg-white p-2 rounded-lg shadow-xl border border-slate-200 z-50 flex gap-1 w-44 flex-wrap">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        onUpdateDoc({ textColor: c });
                        onExecCommand('foreColor', c);
                        setShowColorPicker(false);
                      }}
                      className="w-5 h-5 rounded-full border border-slate-300 hover:scale-110 transition"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Text Highlight Color */}
            <div className="relative">
              <button
                onClick={() => setShowHighlightPicker(!showHighlightPicker)}
                className="flex items-center gap-1 bg-white border border-slate-300 rounded px-2 py-1 hover:bg-slate-100 shadow-2xs"
                title="تمييز النص (Highlight)"
              >
                <Palette className="w-3.5 h-3.5 text-amber-500" />
                <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
              </button>

              {showHighlightPicker && (
                <div className="absolute top-8 right-0 bg-white p-2 rounded-lg shadow-xl border border-slate-200 z-50 flex gap-1 w-36 flex-wrap">
                  {highlightColors.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        onExecCommand('hiliteColor', c);
                        setShowHighlightPicker(false);
                      }}
                      className="w-5 h-5 rounded-full border border-slate-300 hover:scale-110 transition"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="w-px h-6 bg-slate-300 mx-0.5" />

            {/* Paragraph Formatting & Callout Styles (تنسيق الفقرات المخصص) */}
            <div className="relative">
              <button
                onClick={() => setShowParagraphStyles(!showParagraphStyles)}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 rounded font-bold shadow-2xs transition"
                title="تخصيص ألوان وتنسيق الفقرات"
              >
                <Tag className="w-3.5 h-3.5 text-blue-600" />
                <span>تنسيق وألوان الفقرة</span>
                <ChevronDown className="w-3 h-3 text-blue-400" />
              </button>

              {showParagraphStyles && (
                <div className="absolute top-8 right-0 bg-white rounded-lg shadow-2xl border border-slate-200 py-1.5 z-50 w-56 space-y-1">
                  <div className="px-3 py-1 font-bold text-slate-400 text-[10px] uppercase border-b border-slate-100">
                    أنماط وألوان الفقرات المخصصة
                  </div>
                  <button
                    onClick={() => handleApplyParagraphStyle('requests')}
                    className="w-full text-right px-3 py-1.5 hover:bg-blue-50 text-xs font-semibold text-slate-700 flex items-center justify-between"
                  >
                    <span>فقرة الطلبات الشرعية (مع برواز)</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  </button>
                  <button
                    onClick={() => handleApplyParagraphStyle('judgment')}
                    className="w-full text-right px-3 py-1.5 hover:bg-amber-50 text-xs font-semibold text-slate-700 flex items-center justify-between"
                  >
                    <span>فقرة الحكم / القرار (إطار مذهب)</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  </button>
                  <button
                    onClick={() => handleApplyParagraphStyle('notice')}
                    className="w-full text-right px-3 py-1.5 hover:bg-blue-50 text-xs font-semibold text-slate-700 flex items-center justify-between"
                  >
                    <span>تنبيه إداري رسمي</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  </button>
                  <button
                    onClick={() => handleApplyParagraphStyle('quote')}
                    className="w-full text-right px-3 py-1.5 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-between"
                  >
                    <span>اقتباس واستشهاد شرعي</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  </button>
                </div>
              )}
            </div>

            {/* Alignment Controls */}
            <div className="flex items-center bg-white border border-slate-300 rounded p-0.5 shadow-2xs gap-0.5">
              <button
                onClick={() => {
                  onUpdateDoc({ textAlign: 'right' });
                  onExecCommand('justifyRight');
                }}
                className={`p-1 rounded ${docState.textAlign === 'right' ? 'bg-blue-100 text-blue-800' : 'hover:bg-slate-100 text-slate-700'}`}
                title="محاذاة إلى اليمين"
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  onUpdateDoc({ textAlign: 'center' });
                  onExecCommand('justifyCenter');
                }}
                className={`p-1 rounded ${docState.textAlign === 'center' ? 'bg-blue-100 text-blue-800' : 'hover:bg-slate-100 text-slate-700'}`}
                title="توسيط"
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  onUpdateDoc({ textAlign: 'left' });
                  onExecCommand('justifyLeft');
                }}
                className={`p-1 rounded ${docState.textAlign === 'left' ? 'bg-blue-100 text-blue-800' : 'hover:bg-slate-100 text-slate-700'}`}
                title="محاذاة إلى اليسار"
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  onUpdateDoc({ textAlign: 'justify' });
                  onExecCommand('justifyFull');
                }}
                className={`p-1 rounded ${docState.textAlign === 'justify' ? 'bg-blue-100 text-blue-800' : 'hover:bg-slate-100 text-slate-700'}`}
                title="ضبط كلي (Justify)"
              >
                <AlignJustify className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Line Spacing */}
            <div className="relative">
              <button
                onClick={() => setShowSpacingMenu(!showSpacingMenu)}
                className="flex items-center gap-1 bg-white border border-slate-300 rounded px-2 py-1 hover:bg-slate-100 shadow-2xs"
                title="تباعد الأسطر"
              >
                <span>{docState.lineSpacing}</span>
                <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
              </button>

              {showSpacingMenu && (
                <div className="absolute top-8 right-0 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 w-28">
                  {lineSpacings.map((sp) => (
                    <button
                      key={sp}
                      onClick={() => {
                        onUpdateDoc({ lineSpacing: sp });
                        setShowSpacingMenu(false);
                      }}
                      className="w-full text-right px-3 py-1 hover:bg-blue-50 text-xs flex items-center justify-between"
                    >
                      <span>تباعد {sp}</span>
                      {docState.lineSpacing === sp && <Check className="w-3 h-3 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bullet & Number Lists */}
            <div className="flex items-center bg-white border border-slate-300 rounded p-0.5 shadow-2xs gap-0.5">
              <button
                onClick={() => onExecCommand('insertUnorderedList')}
                className="p-1 hover:bg-slate-100 rounded text-slate-700"
                title="قائمة نقطية"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onExecCommand('insertOrderedList')}
                className="p-1 hover:bg-slate-100 rounded text-slate-700"
                title="قائمة رقمية"
              >
                <ListOrdered className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ================= DESIGN TAB (تصميم وإطارات الصفحة) ================= */}
        {activeTab === 'design' && (
          <div className="flex items-center gap-2 flex-wrap">
            {/* Page Borders Menu (حدود الصفحة المعتمدة) */}
            <div className="relative">
              <button
                onClick={() => setShowBorderMenu(!showBorderMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold shadow-2xs transition"
              >
                <Layout className="w-3.5 h-3.5" />
                <span>إطارات وحدود المستند</span>
                <ChevronDown className="w-3 h-3 text-blue-200" />
              </button>

              {showBorderMenu && (
                <div className="absolute top-9 right-0 bg-white rounded-xl shadow-2xl border border-slate-200 py-1.5 z-50 w-60 space-y-1">
                  <div className="px-3 py-1 font-bold text-slate-400 text-[10px] uppercase border-b border-slate-100">
                    أنماط الإطارات والحدود الرسمية
                  </div>
                  {borderStylesList.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        onUpdateDoc({
                          showBorders: b.id !== 'none',
                          borderStyle: b.id as any,
                        });
                        setShowBorderMenu(false);
                      }}
                      className="w-full text-right px-3 py-1.5 hover:bg-blue-50 text-xs font-semibold text-slate-700 flex items-center justify-between"
                    >
                      <span>{b.label}</span>
                      {docState.borderStyle === b.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Border Colors */}
            <div className="flex items-center gap-1 bg-white border border-slate-300 rounded px-2 py-1 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-600">لون الإطار:</span>
              {['#1e293b', '#1e3a8a', '#065f46', '#b45309', '#991b1b'].map((c) => (
                <button
                  key={c}
                  onClick={() => onUpdateDoc({ borderColor: c, showBorders: true })}
                  className="w-4 h-4 rounded-full border border-slate-300 hover:scale-110 transition"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            {/* Border Width */}
            <div className="flex items-center gap-1 bg-white border border-slate-300 rounded px-2 py-1 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-600">السماكة:</span>
              {[1, 2, 3, 4].map((w) => (
                <button
                  key={w}
                  onClick={() => onUpdateDoc({ borderWidth: w, showBorders: true })}
                  className={`px-1.5 py-0.2 rounded text-[11px] font-bold ${
                    docState.borderWidth === w ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {w}pt
                </button>
              ))}
            </div>

            {/* Watermark Menu (علامة مائية) */}
            <div className="relative">
              <button
                onClick={() => setShowWatermarkMenu(!showWatermarkMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded font-semibold text-slate-800 shadow-2xs"
              >
                <span>العلامة المائية</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showWatermarkMenu && (
                <div className="absolute top-9 right-0 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 w-44">
                  {['مستند رسمي', 'سري للغاية', 'مسودة عمل', 'نسخة معتمدة', 'إزالة العلامة'].map((txt) => (
                    <button
                      key={txt}
                      onClick={() => {
                        onUpdateDoc({ watermarkText: txt === 'إزالة العلامة' ? '' : txt });
                        setShowWatermarkMenu(false);
                      }}
                      className="w-full text-right px-3 py-1.5 hover:bg-blue-50 text-xs flex items-center justify-between"
                    >
                      <span>{txt}</span>
                      {docState.watermarkText === txt && <Check className="w-3 h-3 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Test & Simulation Trigger Button */}
            {onOpenSimulator && (
              <button
                onClick={onOpenSimulator}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded font-bold shadow-2xs mr-auto transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>محاكاة وفحص التصميم 🚀</span>
              </button>
            )}
          </div>
        )}

        {/* ================= INSERT TAB (إدراج) ================= */}
        {activeTab === 'insert' && (
          <div className="flex items-center gap-2 flex-wrap relative">
            {/* Insert Table Picker */}
            <div className="relative">
              <button
                onClick={() => setShowTablePicker(!showTablePicker)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-blue-50 border border-slate-300 rounded text-xs font-bold text-slate-800 shadow-2xs"
              >
                <TableIcon className="w-4 h-4 text-blue-600" />
                <span>إدراج جدول</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showTablePicker && (
                <div className="absolute top-9 right-0 bg-white p-3 rounded-lg shadow-2xl border border-slate-200 z-50 w-52 space-y-2">
                  <div className="font-bold text-slate-700 text-xs border-b pb-1">
                    تحديد حجم الجدول:
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>عدد الصفوف:</span>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={tableRows}
                      onChange={(e) => setTableRows(parseInt(e.target.value) || 1)}
                      className="w-16 border rounded px-1.5 py-0.5 text-center"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>عدد الأعمدة:</span>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={tableCols}
                      onChange={(e) => setTableCols(parseInt(e.target.value) || 1)}
                      className="w-16 border rounded px-1.5 py-0.5 text-center"
                    />
                  </div>
                  <button
                    onClick={() => {
                      onInsertTable(tableRows, tableCols);
                      setShowTablePicker(false);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1 rounded text-xs font-bold transition"
                  >
                    إدراج الجدول ({tableRows} × {tableCols})
                  </button>
                </div>
              )}
            </div>

            {/* Insert Image */}
            <button
              onClick={onInsertImage}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-emerald-50 border border-slate-300 rounded text-xs font-bold text-slate-800 shadow-2xs"
            >
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              <span>إدراج صورة</span>
            </button>

            {/* Official Stamps & Seals Menu */}
            <div className="relative">
              <button
                onClick={() => setShowStampsMenu(!showStampsMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-amber-50 border border-slate-300 rounded text-xs font-bold text-slate-800 shadow-2xs"
              >
                <Stamp className="w-4 h-4 text-amber-600" />
                <span>أختام وتصاديق رسمية</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showStampsMenu && (
                <div className="absolute top-9 right-0 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-50 w-56 space-y-1">
                  <button
                    onClick={() => handleInsertOfficialStamp('court')}
                    className="w-full text-right px-3 py-1.5 hover:bg-blue-50 text-xs font-semibold text-slate-700"
                  >
                    ⚖ ختم محكمة القفر الإبتدائية
                  </button>
                  <button
                    onClick={() => handleInsertOfficialStamp('approved')}
                    className="w-full text-right px-3 py-1.5 hover:bg-emerald-50 text-xs font-semibold text-slate-700"
                  >
                    ✓ شارة تصديق ومطابقة شرعية
                  </button>
                  <button
                    onClick={() => handleInsertOfficialStamp('signature')}
                    className="w-full text-right px-3 py-1.5 hover:bg-slate-50 text-xs font-semibold text-slate-700"
                  >
                    ✍ خانة تواقيع وبصمات ثلاثية
                  </button>
                </div>
              )}
            </div>

            {/* Insert Shapes */}
            <button
              onClick={() => onInsertShape('rectangle')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-purple-50 border border-slate-300 rounded text-xs font-bold text-slate-800 shadow-2xs"
            >
              <Shapes className="w-4 h-4 text-purple-600" />
              <span>شكل تنبيهي</span>
            </button>

            {/* Insert Horizontal Line */}
            <button
              onClick={onInsertLine}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-xs font-bold text-slate-800 shadow-2xs"
            >
              <DividerIcon className="w-4 h-4 text-slate-500" />
              <span>خط فاصل رسمي</span>
            </button>

            {/* Insert Link */}
            <button
              onClick={onInsertLink}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-blue-50 border border-slate-300 rounded text-xs font-bold text-slate-800 shadow-2xs"
            >
              <Link2 className="w-4 h-4 text-blue-500" />
              <span>رابط تشعبي</span>
            </button>
          </div>
        )}

        {/* ================= TABLE TOOLS TAB (أدوات الجدول) ================= */}
        {activeTab === 'table' && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onTableAction && onTableAction('insertRowAbove')}
              className="px-2.5 py-1.5 bg-white hover:bg-blue-50 border border-slate-300 rounded text-xs font-bold text-slate-800 shadow-2xs"
            >
              + صف لأعلى
            </button>
            <button
              onClick={() => onTableAction && onTableAction('insertRowBelow')}
              className="px-2.5 py-1.5 bg-white hover:bg-blue-50 border border-slate-300 rounded text-xs font-bold text-slate-800 shadow-2xs"
            >
              + صف لأسفل
            </button>
            <button
              onClick={() => onTableAction && onTableAction('insertColRight')}
              className="px-2.5 py-1.5 bg-white hover:bg-blue-50 border border-slate-300 rounded text-xs font-bold text-slate-800 shadow-2xs"
            >
              + عمود لليمين
            </button>
            <button
              onClick={() => onTableAction && onTableAction('insertColLeft')}
              className="px-2.5 py-1.5 bg-white hover:bg-blue-50 border border-slate-300 rounded text-xs font-bold text-slate-800 shadow-2xs"
            >
              + عمود لليسار
            </button>
            <button
              onClick={() => onTableAction && onTableAction('deleteRow')}
              className="px-2.5 py-1.5 bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 rounded text-xs font-bold shadow-2xs"
            >
              حذف الصف
            </button>
            <button
              onClick={() => onTableAction && onTableAction('deleteCol')}
              className="px-2.5 py-1.5 bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 rounded text-xs font-bold shadow-2xs"
            >
              حذف العمود
            </button>
          </div>
        )}

        {/* ================= LAYOUT TAB (تخطيط الصفحة) ================= */}
        {activeTab === 'layout' && (
          <div className="flex items-center gap-2 flex-wrap">
            {/* Margins */}
            <div className="relative">
              <button
                onClick={() => setShowMarginsMenu(!showMarginsMenu)}
                className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-xs font-medium shadow-2xs"
              >
                <span>هوامش: {docState.margins === 'normal' ? 'عادي (2.5 سم)' : docState.margins === 'narrow' ? 'ضيق (1.27 سم)' : 'عريض'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {showMarginsMenu && (
                <div className="absolute top-8 right-0 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 w-44">
                  <button
                    onClick={() => { onUpdateDoc({ margins: 'normal' }); setShowMarginsMenu(false); }}
                    className="w-full text-right px-3 py-1.5 hover:bg-blue-50 text-xs flex justify-between"
                  >
                    <span>عادي (2.5 سم)</span>
                    {docState.margins === 'normal' && <Check className="w-3 h-3 text-blue-600" />}
                  </button>
                  <button
                    onClick={() => { onUpdateDoc({ margins: 'narrow' }); setShowMarginsMenu(false); }}
                    className="w-full text-right px-3 py-1.5 hover:bg-blue-50 text-xs flex justify-between"
                  >
                    <span>ضيق (1.27 سم)</span>
                    {docState.margins === 'narrow' && <Check className="w-3 h-3 text-blue-600" />}
                  </button>
                  <button
                    onClick={() => { onUpdateDoc({ margins: 'wide' }); setShowMarginsMenu(false); }}
                    className="w-full text-right px-3 py-1.5 hover:bg-blue-50 text-xs flex justify-between"
                  >
                    <span>عريض (3.8 سم)</span>
                    {docState.margins === 'wide' && <Check className="w-3 h-3 text-blue-600" />}
                  </button>
                </div>
              )}
            </div>

            {/* Orientation */}
            <button
              onClick={() => onUpdateDoc({ orientation: docState.orientation === 'portrait' ? 'landscape' : 'portrait' })}
              className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-xs font-medium shadow-2xs"
            >
              الاتجاه: {docState.orientation === 'portrait' ? 'عمودي ↕' : 'أفقي ↔'}
            </button>

            {/* Paper Size */}
            <div className="flex items-center bg-white border border-slate-300 rounded px-2 py-0.5 shadow-2xs">
              <span className="text-slate-500 ml-1 text-xs">الحجم:</span>
              <select
                value={docState.paperSize}
                onChange={(e) => onUpdateDoc({ paperSize: e.target.value as any })}
                className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer"
              >
                <option value="A4">A4 (21 × 29.7 سم)</option>
                <option value="Letter">Letter</option>
                <option value="Legal">Legal</option>
              </select>
            </div>

            {/* Columns */}
            <button
              onClick={() => onUpdateDoc({ columns: docState.columns === 1 ? 2 : 1 })}
              className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-xs font-medium shadow-2xs"
            >
              <Columns className="w-3.5 h-3.5 text-slate-600" />
              <span>أعمدة ({docState.columns})</span>
            </button>
          </div>
        )}

        {/* ================= FILE TAB (ملف) ================= */}
        {activeTab === 'file' && (
          <div className="flex items-center gap-2">
            <button
              onClick={onNewDocument}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-blue-50 border border-slate-300 rounded text-xs font-bold text-slate-800 shadow-2xs transition"
            >
              <FilePlus className="w-4 h-4 text-blue-600" />
              <span>جديد (+)</span>
            </button>

            <button
              onClick={onOpenDocument}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-amber-50 border border-slate-300 rounded text-xs font-bold text-slate-800 shadow-2xs transition"
            >
              <FolderOpen className="w-4 h-4 text-amber-600" />
              <span>فتح مستند</span>
            </button>

            <button
              onClick={onSaveDocument}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-emerald-50 border border-slate-300 rounded text-xs font-bold text-slate-800 shadow-2xs transition"
            >
              <Save className="w-4 h-4 text-emerald-600" />
              <span>حفظ</span>
            </button>

            <button
              onClick={onExportDoc}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold shadow-2xs transition"
            >
              <Download className="w-4 h-4" />
              <span>تصدير Word (.docx/.doc)</span>
            </button>

            <button
              onClick={onExportPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold shadow-2xs transition"
            >
              <Download className="w-4 h-4" />
              <span>تصدير PDF</span>
            </button>

            <button
              onClick={onPrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-indigo-50 border border-slate-300 rounded text-xs font-bold text-indigo-700 shadow-2xs transition"
            >
              <Printer className="w-4 h-4" />
              <span>معاينة وطباعة A4</span>
            </button>
          </div>
        )}

        {/* ================= VIEW TAB (عرض ومعاينة) ================= */}
        {activeTab === 'view' && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onPrint}
              className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded text-xs font-bold shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>معاينة الطباعة A4</span>
            </button>

            <button
              onClick={() => onUpdateDoc({ showRuler: !docState.showRuler })}
              className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-semibold border transition ${
                docState.showRuler ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>المسطرة {docState.showRuler ? 'مفعلة ✓' : 'معطلة'}</span>
            </button>

            <button
              onClick={() => onUpdateDoc({ isReadingMode: !docState.isReadingMode })}
              className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-semibold border transition ${
                docState.isReadingMode ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>وضع القراءة</span>
            </button>

            {/* Zoom Controls */}
            <div className="flex items-center bg-white border border-slate-300 rounded shadow-2xs">
              <button
                onClick={() => onUpdateDoc({ zoom: Math.max(docState.zoom - 10, 40) })}
                className="p-1 hover:bg-slate-100 text-slate-700"
                title="تصغير"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-xs font-bold text-slate-800 min-w-[45px] text-center">
                {docState.zoom}%
              </span>
              <button
                onClick={() => onUpdateDoc({ zoom: Math.min(docState.zoom + 10, 200) })}
                className="p-1 hover:bg-slate-100 text-slate-700"
                title="تكبير"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
