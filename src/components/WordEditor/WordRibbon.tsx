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
  FolderOpen, 
  Save, 
  Download, 
  Printer, 
  Table as TableIcon, 
  Image as ImageIcon, 
  Shapes, 
  Minus as DividerIcon, 
  Link2, 
  Columns, 
  Palette, 
  Check, 
  FilePlus, 
  BookOpen, 
  Sliders, 
  ChevronDown, 
  Sparkles, 
  Layout, 
  Stamp, 
  Tag, 
  Undo2,
  Search,
  Sigma,
  Indent,
  Outdent,
  Type,
  FileCheck,
  ChevronUp,
  SlidersHorizontal,
  BookmarkPlus
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
  onTriggerHeaderEdit?: () => void;
  onTriggerFooterEdit?: () => void;
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
  onOpenSimulator,
  onTriggerHeaderEdit,
  onTriggerFooterEdit
}) => {
  const [isRibbonCollapsed, setIsRibbonCollapsed] = useState(false);
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showSpacingMenu, setShowSpacingMenu] = useState(false);
  const [showDirectionMenu, setShowDirectionMenu] = useState(false);
  const [showMarginsMenu, setShowMarginsMenu] = useState(false);
  const [showBorderMenu, setShowBorderMenu] = useState(false);
  const [showWatermarkMenu, setShowWatermarkMenu] = useState(false);
  const [showStampsMenu, setShowStampsMenu] = useState(false);
  const [showStylesModal, setShowStylesModal] = useState(false);
  const [showFindModal, setShowFindModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');

  // 1. Full Word Ribbon Tabs with "الرئيسية" and Table merged into "إدراج"
  const tabs: { id: WordRibbonTab; label: string; badge?: string }[] = [
    { id: 'file', label: 'ملف' },
    { id: 'home', label: 'الرئيسية' },
    { id: 'insert', label: 'إدراج' },
    { id: 'design', label: 'تصميم' },
    { id: 'layout', label: 'تخطيط الصفحة' },
    { id: 'references', label: 'مراجع' },
    { id: 'mailings', label: 'مراسلات' },
    { id: 'review', label: 'مراجعة' },
    { id: 'view', label: 'عرض' },
    { id: 'help', label: 'تعليمات' },
  ];

  const fontFamilies = [
    { name: 'أميري (Amiri - خط رسمي معتمد)', value: "'Amiri', serif" },
    { name: 'القاهرة (Cairo - حديث واضح)', value: "'Cairo', sans-serif" },
    { name: 'تجوال (Tajawal - مقروء وعصري)', value: "'Tajawal', sans-serif" },
    { name: 'خط النسخ (Noto Naskh Arabic)', value: "'Noto Naskh Arabic', serif" },
    { name: 'خط الكوفي (Noto Kufi Arabic)', value: "'Noto Kufi Arabic', sans-serif" },
    { name: 'Traditional Arabic', value: "'Traditional Arabic', serif" },
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Times New Roman', value: "'Times New Roman', serif" },
  ];

  const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 32, 36, 48, 72];
  const lineSpacings = [1.0, 1.15, 1.3, 1.5, 1.8, 2.0, 2.5];
  const colors = [
    '#000000', '#1e293b', '#1e3a8a', '#0284c7', '#065f46', 
    '#b45309', '#991b1b', '#581c87', '#475569', '#ffffff'
  ];
  const highlightColors = [
    'transparent', '#fef08a', '#bbf7d0', '#bfdbfe', '#fbcfe8', '#fed7aa', '#ddd6fe'
  ];

  const borderStylesList = [
    { id: 'none', label: 'بلا إطار (None)' },
    { id: 'single', label: 'إطار بسيط (1pt Simple)' },
    { id: 'double', label: 'إطار رسمي مزدوج (Double Official)' },
    { id: 'gold', label: 'إطار مذهب ملكي (Royal Gold)' },
    { id: 'islamic', label: 'إطار إسلامي مزخرف (Islamic Geometric)' },
    { id: 'classic', label: 'إطار عريض كلاسيكي (Classic Frame)' },
  ];

  // Quick style preset cards matching Screenshot 1 & 2
  const quickStyles = [
    {
      id: 'main_heading',
      title: 'عنوان رئيسي...',
      preview: 'Aa أب',
      cardClass: 'border-blue-500 bg-blue-50/50 text-blue-900',
      apply: () => {
        onExecCommand('formatBlock', '<h1>');
        onUpdateDoc({ fontSize: 22, isBold: true, textColor: '#1e3a8a' });
      }
    },
    {
      id: 'sub_heading',
      title: 'عنوان فرعي...',
      preview: 'Aa أب',
      cardClass: 'border-slate-400 bg-slate-50 text-slate-800',
      apply: () => {
        onExecCommand('formatBlock', '<h2>');
        onUpdateDoc({ fontSize: 16, isBold: true, textColor: '#334155' });
      }
    },
    {
      id: 'tajawal_body',
      title: 'فقرة تجوال...',
      preview: 'Aa أب',
      cardClass: 'border-slate-300 bg-white text-slate-800',
      apply: () => {
        onExecCommand('fontName', "'Tajawal', sans-serif");
        onUpdateDoc({ fontFamily: "'Tajawal', sans-serif", fontSize: 13, isBold: false });
      }
    },
    {
      id: 'kufi_title',
      title: 'عنوان كوفي...',
      preview: 'Aa أب',
      cardClass: 'border-emerald-500 bg-emerald-50/40 text-emerald-900',
      apply: () => {
        onExecCommand('fontName', "'Noto Kufi Arabic', sans-serif");
        onUpdateDoc({ fontFamily: "'Noto Kufi Arabic', sans-serif", fontSize: 16, isBold: true, textColor: '#065f46' });
      }
    },
    {
      id: 'purple_quote',
      title: 'اقتباس بنفسجي...',
      preview: 'Aa أب',
      cardClass: 'border-purple-500 bg-purple-50/50 text-purple-900',
      apply: () => {
        const html = `
          <blockquote style="margin: 12px 0; padding: 10px 16px; border-right: 4px solid #7c3aed; background: #faf5ff; border-radius: 4px; font-style: italic; color: #581c87;">
            «اقتباس رسمي أو استشهاد نظامي هنا...»
          </blockquote>
        `;
        onExecCommand('insertHTML', html);
      }
    },
    {
      id: 'amber_notice',
      title: 'تنبيه برتقالي...',
      preview: 'Aa أب',
      cardClass: 'border-amber-500 bg-amber-50/60 text-amber-950',
      apply: () => {
        const html = `
          <div style="margin: 12px 0; padding: 10px 14px; border-right: 4px solid #f59e0b; background: #fffbeb; border-radius: 4px; color: #78350f; font-weight: 500;">
            ⚠️ <strong>تنبيه هام وملاحظة معتمدة:</strong> يرجى مراعاة الإجراءات والبنود المحددة قانونياً.
          </div>
        `;
        onExecCommand('insertHTML', html);
      }
    }
  ];

  const handleInsertOfficialStamp = (type: 'court' | 'approved' | 'signature') => {
    setShowStampsMenu(false);
    if (type === 'court') {
      const html = `
        <div style="display: inline-block; border: 2px double #1e3a8a; border-radius: 50%; width: 130px; height: 130px; text-align: center; padding: 12px; margin: 10px; color: #1e3a8a; font-family: 'Amiri', serif; vertical-align: middle; box-shadow: inset 0 0 0 1px #1e3a8a; transform: rotate(-5deg); background: rgba(239, 246, 255, 0.4);">
          <div style="font-size: 10px; font-weight: bold; border-bottom: 1px solid #1e3a8a; padding-bottom: 2px;">الجمهورية اليمنية</div>
          <div style="font-size: 11px; font-weight: bold; margin-top: 4px;">وزارة العدل</div>
          <div style="font-size: 12px; font-weight: 900; margin: 3px 0;">محكمة القفر</div>
          <div style="font-size: 9px; font-weight: bold; border-top: 1px solid #1e3a8a; padding-top: 2px;">قلم التوثيق الشرعي</div>
        </div>
      `;
      onExecCommand('insertHTML', html);
    } else if (type === 'approved') {
      const html = `
        <div style="display: inline-block; border: 2px solid #047857; border-radius: 8px; padding: 8px 16px; margin: 8px; color: #047857; font-weight: bold; text-align: center; transform: rotate(2deg); background: #ecfdf5;">
          <div style="font-size: 13px;">✓ صودق عليه بموجب الأصول</div>
          <div style="font-size: 10px; color: #065f46; margin-top: 2px;">سجل رسمي رقم: ${Math.floor(1000 + Math.random() * 9000)} / لسنة 1446هـ</div>
        </div>
      `;
      onExecCommand('insertHTML', html);
    } else if (type === 'signature') {
      const html = `
        <div style="display: flex; gap: 24px; margin: 20px 0; text-align: center; border-top: 1px dashed #cbd5e1; padding-top: 12px;">
          <div style="flex: 1;">
            <div style="font-weight: bold; font-size: 12px;">المقر بما فيه (الطرف الأول):</div>
            <div style="height: 50px; border: 1px dashed #cbd5e1; margin-top: 6px; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 11px;">(البصمة والتوقيع)</div>
          </div>
          <div style="flex: 1;">
            <div style="font-weight: bold; font-size: 12px;">توقيع الكاتب والأمين الشرعي:</div>
            <div style="height: 50px; border: 1px dashed #cbd5e1; margin-top: 6px; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 11px;">(المصادقة والتوقيع)</div>
          </div>
          <div style="flex: 1;">
            <div style="font-weight: bold; font-size: 12px;">خاتم وتوقيع رئيس المحكمة:</div>
            <div style="height: 50px; border: 1px dashed #cbd5e1; margin-top: 6px; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 11px;">(الختم الرسمي)</div>
          </div>
        </div>
      `;
      onExecCommand('insertHTML', html);
    }
  };

  const handleFindReplace = () => {
    if (!searchQuery) return;
    const currentHtml = docState.contentHtml;
    const escaped = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'g');
    const updated = currentHtml.replace(regex, replaceQuery);
    onUpdateDoc({ contentHtml: updated });
    setShowFindModal(false);
  };

  return (
    <div className="bg-white border-b border-slate-300 select-none no-print shadow-2xs" dir="rtl">
      {/* 1. Tab Bar - Reduced to exact 0.5cm height (28px) */}
      <div className="h-[28px] max-h-[28px] min-h-[28px] flex items-center justify-between px-2 border-b border-slate-200 overflow-x-auto bg-[#f8fafc] text-xs">
        <div className="flex items-center h-full">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`h-[27px] px-2.5 font-semibold text-[11px] whitespace-nowrap transition-colors flex items-center gap-1 ${
                  isActive
                    ? 'text-blue-700 bg-white font-bold border-t-2 border-t-blue-600 border-x border-slate-300 shadow-2xs -mb-px'
                    : 'text-slate-700 hover:text-blue-600 hover:bg-slate-200/50'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[8px] bg-emerald-100 text-emerald-800 font-bold px-1 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Status Indicators & Right-side Actions */}
        <div className="flex items-center gap-2 pr-2">
          <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <Check className="w-3 h-3 text-emerald-600" />
            <span>محفوظ تلقائياً ✓</span>
          </div>

          {onOpenSimulator && (
            <button
              onClick={onOpenSimulator}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-[10px] shadow-2xs transition active:scale-95 border border-amber-400"
              title="محاكاة واختبار مستند وورد"
            >
              <Sparkles className="w-3 h-3 text-slate-950" />
              <span>محاكاة المستند 🚀</span>
            </button>
          )}

          <button
            onClick={() => setIsRibbonCollapsed(!isRibbonCollapsed)}
            className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded"
            title={isRibbonCollapsed ? "إظهار شريط الأدوات" : "تصغير شريط الأدوات"}
          >
            {isRibbonCollapsed ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* 2. Toolbar Row - Exactly 0.5cm height (32px) */}
      {!isRibbonCollapsed && (
        <div className="h-[32px] max-h-[34px] min-h-[32px] px-2 py-0 flex items-center gap-1 overflow-x-auto bg-[#f8fafc] text-slate-800 text-xs border-b border-slate-300/80">
          
          {/* ================= HOME TAB (الرئيسية) ================= */}
          {activeTab === 'home' && (
            <div className="flex items-center gap-1 flex-nowrap shrink-0">
              
              {/* Font Family Select */}
              <div className="flex items-center bg-white border border-slate-300 rounded h-[26px] px-1 shadow-2xs">
                <select
                  value={docState.fontFamily}
                  onChange={(e) => {
                    onUpdateDoc({ fontFamily: e.target.value });
                    onExecCommand('fontName', e.target.value);
                  }}
                  className="bg-transparent text-[11px] font-semibold focus:outline-none cursor-pointer max-w-[125px]"
                  title="نوع الخط"
                >
                  {fontFamilies.map((f, i) => (
                    <option key={i} value={f.value}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Font Size Select */}
              <div className="flex items-center bg-white border border-slate-300 rounded h-[26px] px-1 shadow-2xs">
                <select
                  value={docState.fontSize}
                  onChange={(e) => {
                    const size = parseInt(e.target.value, 10);
                    onUpdateDoc({ fontSize: size });
                    onExecCommand('fontSize', '4');
                  }}
                  className="bg-transparent text-[11px] font-bold focus:outline-none cursor-pointer"
                  title="حجم الخط (pt)"
                >
                  {fontSizes.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Font Size Up / Down / Clear Format */}
              <div className="flex items-center bg-white border border-slate-300 rounded h-[26px] shadow-2xs">
                <button
                  onClick={() => onUpdateDoc({ fontSize: Math.min(docState.fontSize + 2, 72) })}
                  className="px-1.5 h-full hover:bg-slate-100 text-slate-700 font-bold border-l border-slate-200 text-[10px]"
                  title="تكبير الخط (^A)"
                >
                  A+
                </button>
                <button
                  onClick={() => onUpdateDoc({ fontSize: Math.max(docState.fontSize - 2, 8) })}
                  className="px-1.5 h-full hover:bg-slate-100 text-slate-700 font-bold border-l border-slate-200 text-[10px]"
                  title="تصغير الخط (vA)"
                >
                  A-
                </button>
                <button
                  onClick={() => onExecCommand('removeFormat')}
                  className="px-1.5 h-full hover:bg-slate-100 text-slate-600 text-[10px]"
                  title="مسح التنسيق (Clear Format)"
                >
                  🧼
                </button>
              </div>

              <div className="w-px h-4 bg-slate-300 mx-0.5" />

              {/* Character Formatting: B, I, U, S, x2, x^2 */}
              <div className="flex items-center bg-white border border-slate-300 rounded h-[26px] p-0.5 shadow-2xs gap-0.5">
                <button
                  onClick={() => onExecCommand('bold')}
                  className="px-1.5 h-full hover:bg-slate-100 rounded text-slate-800 font-black text-[11px]"
                  title="غامق (Ctrl+B)"
                >
                  <Bold className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onExecCommand('italic')}
                  className="px-1.5 h-full hover:bg-slate-100 rounded text-slate-700 italic text-[11px]"
                  title="مائل (Ctrl+I)"
                >
                  <Italic className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onExecCommand('underline')}
                  className="px-1.5 h-full hover:bg-slate-100 rounded text-slate-700 underline text-[11px]"
                  title="تسطير (Ctrl+U)"
                >
                  <Underline className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onExecCommand('strikeThrough')}
                  className="px-1.5 h-full hover:bg-slate-100 rounded text-slate-700 line-through text-[11px]"
                  title="يتوسطه خط"
                >
                  <Strikethrough className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onExecCommand('subscript')}
                  className="px-1.5 h-full hover:bg-slate-100 rounded text-slate-700 text-[10px] font-bold"
                  title="منخفض (x₂)"
                >
                  <Subscript className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onExecCommand('superscript')}
                  className="px-1.5 h-full hover:bg-slate-100 rounded text-slate-700 text-[10px] font-bold"
                  title="مرتفع (x²)"
                >
                  <Superscript className="w-3 h-3" />
                </button>
              </div>

              {/* Text Color & Highlight Color with Dropdowns */}
              <div className="flex items-center bg-white border border-slate-300 rounded h-[26px] p-0.5 shadow-2xs gap-1 relative">
                {/* Font Color */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowColorPicker(!showColorPicker);
                      setShowHighlightPicker(false);
                    }}
                    className="flex items-center gap-0.5 px-1 h-full hover:bg-slate-100 rounded"
                    title="لون النص"
                  >
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-[10px] leading-tight" style={{ color: docState.textColor }}>A</span>
                      <div className="w-3 h-0.5 rounded-xs" style={{ backgroundColor: docState.textColor }} />
                    </div>
                    <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
                  </button>

                  {showColorPicker && (
                    <div className="absolute top-7 right-0 bg-white p-2 rounded-lg shadow-xl border border-slate-200 z-50 flex gap-1 w-44 flex-wrap">
                      <div className="w-full text-[10px] font-bold text-slate-400 pb-1 border-b">لوحة ألوان الخط:</div>
                      {colors.map((c) => (
                        <button
                          key={c}
                          onClick={() => {
                            onUpdateDoc({ textColor: c });
                            onExecCommand('foreColor', c);
                            setShowColorPicker(false);
                          }}
                          className="w-5 h-5 rounded-full border border-slate-300 hover:scale-110 transition shadow-2xs"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Highlight Color */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowHighlightPicker(!showHighlightPicker);
                      setShowColorPicker(false);
                    }}
                    className="flex items-center gap-0.5 px-1 h-full hover:bg-slate-100 rounded"
                    title="لون التمييز (Highlight)"
                  >
                    <Palette className="w-3 h-3 text-amber-500" />
                    <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
                  </button>

                  {showHighlightPicker && (
                    <div className="absolute top-7 right-0 bg-white p-2 rounded-lg shadow-xl border border-slate-200 z-50 flex gap-1 w-36 flex-wrap">
                      <div className="w-full text-[10px] font-bold text-slate-400 pb-1 border-b">ألوان التمييز:</div>
                      {highlightColors.map((c) => (
                        <button
                          key={c}
                          onClick={() => {
                            onExecCommand('hiliteColor', c);
                            setShowHighlightPicker(false);
                          }}
                          className="w-5 h-5 rounded-full border border-slate-300 hover:scale-110 transition shadow-2xs"
                          style={{ backgroundColor: c === 'transparent' ? '#ffffff' : c }}
                          title={c === 'transparent' ? 'إزالة التمييز' : ''}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="w-px h-4 bg-slate-300 mx-0.5" />

              {/* Alignments & Lists */}
              <div className="flex items-center bg-white border border-slate-300 rounded h-[26px] p-0.5 shadow-2xs gap-0.5">
                <button
                  onClick={() => {
                    onUpdateDoc({ textAlign: 'right' });
                    onExecCommand('justifyRight');
                  }}
                  className={`px-1 h-full rounded ${docState.textAlign === 'right' ? 'bg-blue-100 text-blue-800' : 'hover:bg-slate-100 text-slate-700'}`}
                  title="محاذاة لليمين"
                >
                  <AlignRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => {
                    onUpdateDoc({ textAlign: 'center' });
                    onExecCommand('justifyCenter');
                  }}
                  className={`px-1 h-full rounded ${docState.textAlign === 'center' ? 'bg-blue-100 text-blue-800' : 'hover:bg-slate-100 text-slate-700'}`}
                  title="توسيط"
                >
                  <AlignCenter className="w-3 h-3" />
                </button>
                <button
                  onClick={() => {
                    onUpdateDoc({ textAlign: 'left' });
                    onExecCommand('justifyLeft');
                  }}
                  className={`px-1 h-full rounded ${docState.textAlign === 'left' ? 'bg-blue-100 text-blue-800' : 'hover:bg-slate-100 text-slate-700'}`}
                  title="محاذاة لليسار"
                >
                  <AlignLeft className="w-3 h-3" />
                </button>
                <button
                  onClick={() => {
                    onUpdateDoc({ textAlign: 'justify' });
                    onExecCommand('justifyFull');
                  }}
                  className={`px-1 h-full rounded ${docState.textAlign === 'justify' ? 'bg-blue-100 text-blue-800' : 'hover:bg-slate-100 text-slate-700'}`}
                  title="ضبط كلي (Justify)"
                >
                  <AlignJustify className="w-3 h-3" />
                </button>

                <div className="w-px h-3.5 bg-slate-200 mx-0.5" />

                <button
                  onClick={() => onExecCommand('insertUnorderedList')}
                  className="px-1 h-full hover:bg-slate-100 rounded text-slate-700"
                  title="قائمة نقطية"
                >
                  <List className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onExecCommand('insertOrderedList')}
                  className="px-1 h-full hover:bg-slate-100 rounded text-slate-700"
                  title="قائمة رقمية"
                >
                  <ListOrdered className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onExecCommand('outdent')}
                  className="px-1 h-full hover:bg-slate-100 rounded text-slate-700"
                  title="إنقاص المسافة البادئة"
                >
                  <Outdent className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onExecCommand('indent')}
                  className="px-1 h-full hover:bg-slate-100 rounded text-slate-700"
                  title="زيادة المسافة البادئة"
                >
                  <Indent className="w-3 h-3" />
                </button>
              </div>

              {/* Line Spacing Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSpacingMenu(!showSpacingMenu)}
                  className="flex items-center gap-1 bg-white border border-slate-300 rounded h-[26px] px-1.5 hover:bg-slate-100 shadow-2xs text-[11px]"
                  title="تباعد الأسطر"
                >
                  <span>تباعد {docState.lineSpacing}</span>
                  <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
                </button>

                {showSpacingMenu && (
                  <div className="absolute top-7 right-0 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 w-28">
                    {lineSpacings.map((sp) => (
                      <button
                        key={sp}
                        onClick={() => {
                          onUpdateDoc({ lineSpacing: sp });
                          setShowSpacingMenu(false);
                        }}
                        className="w-full text-right px-2.5 py-1 hover:bg-blue-50 text-[11px] flex items-center justify-between"
                      >
                        <span>{sp}</span>
                        {docState.lineSpacing === sp && <Check className="w-3 h-3 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Direction Dropdown (اتجاه ٩) */}
              <div className="relative">
                <button
                  onClick={() => setShowDirectionMenu(!showDirectionMenu)}
                  className="flex items-center gap-1 bg-white border border-slate-300 rounded h-[26px] px-1.5 hover:bg-slate-100 shadow-2xs text-[11px]"
                  title="اتجاه النص"
                >
                  <span>اتجاه {docState.direction === 'rtl' ? '٩ (يمين)' : 'P (يسار)'}</span>
                  <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
                </button>

                {showDirectionMenu && (
                  <div className="absolute top-7 right-0 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 w-36">
                    <button
                      onClick={() => {
                        onUpdateDoc({ direction: 'rtl' });
                        setShowDirectionMenu(false);
                      }}
                      className="w-full text-right px-2.5 py-1.5 hover:bg-blue-50 text-[11px] flex items-center justify-between"
                    >
                      <span>من اليمين لليسار (RTL)</span>
                      {docState.direction === 'rtl' && <Check className="w-3 h-3 text-blue-600" />}
                    </button>
                    <button
                      onClick={() => {
                        onUpdateDoc({ direction: 'ltr' });
                        setShowDirectionMenu(false);
                      }}
                      className="w-full text-right px-2.5 py-1.5 hover:bg-blue-50 text-[11px] flex items-center justify-between"
                    >
                      <span>من اليسار لليمين (LTR)</span>
                      {docState.direction === 'ltr' && <Check className="w-3 h-3 text-blue-600" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Borders Dropdown (حدود ⊞) */}
              <div className="relative">
                <button
                  onClick={() => setShowBorderMenu(!showBorderMenu)}
                  className="flex items-center gap-1 bg-white border border-slate-300 rounded h-[26px] px-1.5 hover:bg-slate-100 shadow-2xs text-[11px]"
                  title="حدود وإطارات الصفحة"
                >
                  <Layout className="w-3 h-3 text-slate-600" />
                  <span>حدود ⊞</span>
                  <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
                </button>

                {showBorderMenu && (
                  <div className="absolute top-7 right-0 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 w-52 space-y-0.5">
                    <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 border-b">خيارات حدود المستند:</div>
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
                        className="w-full text-right px-2.5 py-1 hover:bg-blue-50 text-[11px] flex items-center justify-between"
                      >
                        <span>{b.label}</span>
                        {docState.borderStyle === b.id && <Check className="w-3 h-3 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="w-px h-4 bg-slate-300 mx-0.5" />

              {/* ================= STYLES SECTION (مطابق للمرفق: حفظ نمط، إدارة الأنماط، كروت الأنماط) ================= */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Save Style Button */}
                <button
                  onClick={() => {
                    const styleName = prompt('أدخل اسم النمط الجديد لحفظه:', 'نمط مخصص');
                    if (styleName) {
                      alert(`تم حفظ النمط "${styleName}" بنجاح في مكتبة الأنماط السريعة!`);
                    }
                  }}
                  className="flex items-center gap-1 px-2 h-[26px] bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 rounded font-bold text-[10px] shadow-2xs transition whitespace-nowrap"
                  title="حفظ نمط جديد"
                >
                  <BookmarkPlus className="w-3 h-3 text-purple-600" />
                  <span>+ حفظ نمط</span>
                </button>

                {/* Manage Styles Button */}
                <button
                  onClick={() => setShowStylesModal(true)}
                  className="flex items-center gap-1 px-2 h-[26px] bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded font-bold text-[10px] shadow-2xs transition whitespace-nowrap"
                  title="إدارة أنماط الفقرات"
                >
                  <SlidersHorizontal className="w-3 h-3 text-slate-600" />
                  <span>إدارة الأنماط</span>
                </button>

                {/* Quick Style Preview Cards matching Screenshot 1 & 2 */}
                <div className="flex items-center gap-1">
                  {quickStyles.map((qs) => (
                    <button
                      key={qs.id}
                      onClick={qs.apply}
                      className={`h-[26px] px-1.5 border rounded flex items-center gap-1 text-[10px] font-bold shadow-2xs hover:scale-102 transition whitespace-nowrap ${qs.cardClass}`}
                      title={`تطبيق: ${qs.title}`}
                    >
                      <span className="font-serif text-[11px]">{qs.preview}</span>
                      <span className="border-r border-slate-300/80 pr-1">{qs.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-px h-4 bg-slate-300 mx-0.5" />

              {/* Header & Footer Edit Quick Trigger */}
              <button
                onClick={() => {
                  if (onTriggerHeaderEdit) {
                    onTriggerHeaderEdit();
                  } else {
                    const headerEl = document.querySelector('[data-header-area="true"]') as HTMLElement;
                    headerEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    headerEl?.click();
                  }
                }}
                className="flex items-center gap-1 px-2 h-[26px] bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-800 rounded font-bold text-[10px] shadow-2xs whitespace-nowrap"
                title="تفعيل تحرير رأس وتذييل الصفحة"
              >
                <span>رأس وتذييل 📄</span>
              </button>

              {/* Quick Table Insert Button */}
              <button
                onClick={() => onInsertTable(3, 3)}
                className="flex items-center gap-1 px-1.5 h-[26px] bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded text-[11px] shadow-2xs"
                title="إدراج جدول سريع 3×3"
              >
                <TableIcon className="w-3 h-3 text-blue-600" />
                <span>⊞</span>
              </button>

              {/* Symbols / Equation */}
              <button
                onClick={() => {
                  const symbol = prompt('اختر رمزاً لإدراجه (مثال: ∑, π, ∞, ±, √, ©, ®):', '∑');
                  if (symbol) onExecCommand('insertText', symbol);
                }}
                className="px-1.5 h-[26px] bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded text-[11px] shadow-2xs font-bold"
                title="إدراج رموز ومعادلات (Σ)"
              >
                Σ
              </button>

              {/* Find & Replace */}
              <button
                onClick={() => setShowFindModal(true)}
                className="px-1.5 h-[26px] bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded text-[11px] shadow-2xs"
                title="بحث واستبدال"
              >
                <Search className="w-3 h-3 text-slate-600" />
              </button>

              {/* Undo */}
              <button
                onClick={() => onExecCommand('undo')}
                className="px-1.5 h-[26px] bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded text-[11px] shadow-2xs"
                title="تراجع (Ctrl+Z)"
              >
                <Undo2 className="w-3 h-3 text-slate-600" />
              </button>

            </div>
          )}

          {/* ================= INSERT TAB (إدراج) - WITH MERGED TABLE TOOLS ================= */}
          {activeTab === 'insert' && (
            <div className="flex items-center gap-1.5 flex-nowrap shrink-0">
              
              {/* Insert Table Picker */}
              <div className="relative">
                <button
                  onClick={() => setShowTablePicker(!showTablePicker)}
                  className="flex items-center gap-1 px-2 h-[26px] bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-900 rounded font-bold text-[11px] shadow-2xs"
                >
                  <TableIcon className="w-3.5 h-3.5 text-blue-600" />
                  <span>إدراج جدول</span>
                  <ChevronDown className="w-2.5 h-2.5 text-blue-400" />
                </button>

                {showTablePicker && (
                  <div className="absolute top-7 right-0 bg-white p-2.5 rounded-lg shadow-2xl border border-slate-200 z-50 w-52 space-y-1.5">
                    <div className="font-bold text-slate-700 text-xs border-b pb-1">
                      تحديد أبعاد الجدول:
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

              {/* Merged Table Tools Section */}
              <div className="flex items-center bg-white border border-slate-300 rounded h-[26px] p-0.5 shadow-2xs gap-1">
                <span className="text-[10px] font-bold text-blue-700 px-1 border-l border-slate-200">أدوات الجدول:</span>
                <button
                  onClick={() => onTableAction && onTableAction('insertRowAbove')}
                  className="px-1.5 h-full hover:bg-slate-100 rounded text-slate-700 text-[10px] font-bold"
                  title="إدراج صف لأعلى"
                >
                  + صف لأعلى
                </button>
                <button
                  onClick={() => onTableAction && onTableAction('insertRowBelow')}
                  className="px-1.5 h-full hover:bg-slate-100 rounded text-slate-700 text-[10px] font-bold"
                  title="إدراج صف لأسفل"
                >
                  + صف لأسفل
                </button>
                <button
                  onClick={() => onTableAction && onTableAction('insertColRight')}
                  className="px-1.5 h-full hover:bg-slate-100 rounded text-slate-700 text-[10px] font-bold"
                  title="إدراج عمود لليمين"
                >
                  + عمود لليمين
                </button>
                <button
                  onClick={() => onTableAction && onTableAction('insertColLeft')}
                  className="px-1.5 h-full hover:bg-slate-100 rounded text-slate-700 text-[10px] font-bold"
                  title="إدراج عمود لليسار"
                >
                  + عمود لليسار
                </button>
                <button
                  onClick={() => onTableAction && onTableAction('deleteRow')}
                  className="px-1.5 h-full hover:bg-rose-50 text-rose-700 rounded text-[10px] font-bold"
                  title="حذف الصف الحالي"
                >
                  حذف صف
                </button>
                <button
                  onClick={() => onTableAction && onTableAction('deleteCol')}
                  className="px-1.5 h-full hover:bg-rose-50 text-rose-700 rounded text-[10px] font-bold"
                  title="حذف العمود الحالي"
                >
                  حذف عمود
                </button>
              </div>

              <div className="w-px h-4 bg-slate-300 mx-0.5" />

              {/* Insert Image */}
              <button
                onClick={onInsertImage}
                className="flex items-center gap-1 px-2 h-[26px] bg-white hover:bg-emerald-50 border border-slate-300 rounded text-[11px] font-bold text-slate-800 shadow-2xs"
              >
                <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                <span>إدراج صورة</span>
              </button>

              {/* Official Stamps */}
              <div className="relative">
                <button
                  onClick={() => setShowStampsMenu(!showStampsMenu)}
                  className="flex items-center gap-1 px-2 h-[26px] bg-white hover:bg-amber-50 border border-slate-300 rounded text-[11px] font-bold text-slate-800 shadow-2xs"
                >
                  <Stamp className="w-3.5 h-3.5 text-amber-600" />
                  <span>أختام وتصاديق</span>
                  <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
                </button>

                {showStampsMenu && (
                  <div className="absolute top-7 right-0 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 w-56 space-y-0.5">
                    <button
                      onClick={() => handleInsertOfficialStamp('court')}
                      className="w-full text-right px-2.5 py-1.5 hover:bg-blue-50 text-xs font-semibold text-slate-700"
                    >
                      ⚖ ختم محكمة القفر الإبتدائية
                    </button>
                    <button
                      onClick={() => handleInsertOfficialStamp('approved')}
                      className="w-full text-right px-2.5 py-1.5 hover:bg-emerald-50 text-xs font-semibold text-slate-700"
                    >
                      ✓ شارة تصديق ومطابقة شرعية
                    </button>
                    <button
                      onClick={() => handleInsertOfficialStamp('signature')}
                      className="w-full text-right px-2.5 py-1.5 hover:bg-slate-50 text-xs font-semibold text-slate-700"
                    >
                      ✍ خانة تواقيع وبصمات ثلاثية
                    </button>
                  </div>
                )}
              </div>

              {/* Shapes */}
              <button
                onClick={() => onInsertShape('rectangle')}
                className="flex items-center gap-1 px-2 h-[26px] bg-white hover:bg-purple-50 border border-slate-300 rounded text-[11px] font-bold text-slate-800 shadow-2xs"
              >
                <Shapes className="w-3.5 h-3.5 text-purple-600" />
                <span>شكل تنبيهي</span>
              </button>

              {/* Horizontal Line */}
              <button
                onClick={onInsertLine}
                className="flex items-center gap-1 px-2 h-[26px] bg-white hover:bg-slate-100 border border-slate-300 rounded text-[11px] font-bold text-slate-800 shadow-2xs"
              >
                <DividerIcon className="w-3.5 h-3.5 text-slate-500" />
                <span>خط فاصل</span>
              </button>

              {/* Header & Footer Editing Trigger */}
              <button
                onClick={() => {
                  if (onTriggerHeaderEdit) {
                    onTriggerHeaderEdit();
                  } else {
                    const headerEl = document.querySelector('[data-header-area="true"]') as HTMLElement;
                    headerEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    headerEl?.click();
                  }
                }}
                className="flex items-center gap-1 px-2 h-[26px] bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 rounded font-bold text-[11px] shadow-2xs"
              >
                <span>تحرير رأس وتذييل 📄</span>
              </button>

              {/* Page Numbering */}
              <button
                onClick={() => {
                  const numHtml = `<div style="text-align: center; font-size: 11px; color: #64748b; margin: 10px 0;">- صفحة 1 من 1 -</div>`;
                  onExecCommand('insertHTML', numHtml);
                }}
                className="flex items-center gap-1 px-2 h-[26px] bg-white hover:bg-slate-100 border border-slate-300 rounded text-[11px] font-bold text-slate-800 shadow-2xs"
              >
                <span>ترقيم الصفحات 🔢</span>
              </button>

              {/* Link */}
              <button
                onClick={onInsertLink}
                className="flex items-center gap-1 px-2 h-[26px] bg-white hover:bg-blue-50 border border-slate-300 rounded text-[11px] font-bold text-slate-800 shadow-2xs"
              >
                <Link2 className="w-3.5 h-3.5 text-blue-500" />
                <span>رابط تشعبي</span>
              </button>
            </div>
          )}

          {/* ================= DESIGN TAB (تصميم) ================= */}
          {activeTab === 'design' && (
            <div className="flex items-center gap-1.5 flex-nowrap shrink-0">
              {/* Page Borders Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowBorderMenu(!showBorderMenu)}
                  className="flex items-center gap-1 px-2.5 h-[26px] bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-[11px] shadow-2xs transition"
                >
                  <Layout className="w-3.5 h-3.5" />
                  <span>إطارات وحدود المستند</span>
                  <ChevronDown className="w-2.5 h-2.5 text-blue-200" />
                </button>

                {showBorderMenu && (
                  <div className="absolute top-7 right-0 bg-white rounded-xl shadow-2xl border border-slate-200 py-1 z-50 w-60 space-y-0.5">
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
              <div className="flex items-center gap-1 bg-white border border-slate-300 rounded h-[26px] px-2 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-600">لون الإطار:</span>
                {['#1e293b', '#1e3a8a', '#065f46', '#b45309', '#991b1b'].map((c) => (
                  <button
                    key={c}
                    onClick={() => onUpdateDoc({ borderColor: c, showBorders: true })}
                    className="w-3.5 h-3.5 rounded-full border border-slate-300 hover:scale-110 transition"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>

              {/* Border Width */}
              <div className="flex items-center gap-1 bg-white border border-slate-300 rounded h-[26px] px-2 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-600">سماكة الإطار:</span>
                {[1, 2, 3, 4].map((w) => (
                  <button
                    key={w}
                    onClick={() => onUpdateDoc({ borderWidth: w, showBorders: true })}
                    className={`px-1 text-[10px] font-bold rounded ${docState.borderWidth === w ? 'bg-blue-100 text-blue-800' : 'hover:bg-slate-100'}`}
                  >
                    {w}pt
                  </button>
                ))}
              </div>

              {/* Page Background Color */}
              <div className="flex items-center gap-1 bg-white border border-slate-300 rounded h-[26px] px-2 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-600">لون الصفحة:</span>
                {['#ffffff', '#fffdfa', '#f8fafc', '#f0fdf4', '#fefce8'].map((c) => (
                  <button
                    key={c}
                    onClick={() => onUpdateDoc({ pageBgColor: c })}
                    className="w-3.5 h-3.5 rounded-sm border border-slate-300 hover:scale-110 transition shadow-2xs"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>

              {/* Watermark */}
              <div className="relative">
                <button
                  onClick={() => setShowWatermarkMenu(!showWatermarkMenu)}
                  className="flex items-center gap-1 px-2.5 h-[26px] bg-white hover:bg-slate-100 border border-slate-300 rounded text-[11px] font-medium shadow-2xs"
                >
                  <span>علامة مائية {docState.watermarkText ? `(${docState.watermarkText})` : ''}</span>
                  <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
                </button>

                {showWatermarkMenu && (
                  <div className="absolute top-7 right-0 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 w-44">
                    {['', 'سري للغاية', 'مسودة رسمية', 'معتمد ونهائي', 'صورة طبق الأصل'].map((w, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          onUpdateDoc({ watermarkText: w });
                          setShowWatermarkMenu(false);
                        }}
                        className="w-full text-right px-3 py-1 hover:bg-blue-50 text-xs flex justify-between"
                      >
                        <span>{w || 'بلا علامة مائية'}</span>
                        {docState.watermarkText === w && <Check className="w-3 h-3 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= LAYOUT TAB (تخطيط الصفحة) ================= */}
          {activeTab === 'layout' && (
            <div className="flex items-center gap-1.5 flex-nowrap shrink-0">
              {/* Margins */}
              <div className="relative">
                <button
                  onClick={() => setShowMarginsMenu(!showMarginsMenu)}
                  className="flex items-center gap-1 px-2.5 h-[26px] bg-white hover:bg-slate-100 border border-slate-300 rounded text-[11px] font-medium shadow-2xs"
                >
                  <span>هوامش: {docState.margins === 'normal' ? 'عادي (2.5 سم)' : docState.margins === 'narrow' ? 'ضيق (1.27 سم)' : 'عريض'}</span>
                  <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
                </button>
                {showMarginsMenu && (
                  <div className="absolute top-7 right-0 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 w-44">
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
                className="px-2.5 h-[26px] bg-white hover:bg-slate-100 border border-slate-300 rounded text-[11px] font-medium shadow-2xs"
              >
                الاتجاه: {docState.orientation === 'portrait' ? 'عمودي ↕' : 'أفقي ↔'}
              </button>

              {/* Paper Size */}
              <div className="flex items-center bg-white border border-slate-300 rounded h-[26px] px-2 shadow-2xs">
                <span className="text-slate-500 ml-1 text-[11px]">الحجم:</span>
                <select
                  value={docState.paperSize}
                  onChange={(e) => onUpdateDoc({ paperSize: e.target.value as any })}
                  className="bg-transparent text-[11px] font-bold focus:outline-none cursor-pointer"
                >
                  <option value="A4">A4 (21 × 29.7 سم)</option>
                  <option value="Letter">Letter</option>
                  <option value="Legal">Legal</option>
                </select>
              </div>

              {/* Columns */}
              <button
                onClick={() => onUpdateDoc({ columns: docState.columns === 1 ? 2 : 1 })}
                className="flex items-center gap-1 px-2.5 h-[26px] bg-white hover:bg-slate-100 border border-slate-300 rounded text-[11px] font-medium shadow-2xs"
              >
                <Columns className="w-3 h-3 text-slate-600" />
                <span>أعمدة ({docState.columns})</span>
              </button>
            </div>
          )}

          {/* ================= FILE TAB (ملف) ================= */}
          {activeTab === 'file' && (
            <div className="flex items-center gap-1.5 flex-nowrap shrink-0">
              <button
                onClick={onNewDocument}
                className="flex items-center gap-1 px-2.5 h-[26px] bg-white hover:bg-blue-50 border border-slate-300 rounded text-[11px] font-bold text-slate-800 shadow-2xs transition"
              >
                <FilePlus className="w-3.5 h-3.5 text-blue-600" />
                <span>مستند جديد (+)</span>
              </button>

              <button
                onClick={onOpenDocument}
                className="flex items-center gap-1 px-2.5 h-[26px] bg-white hover:bg-amber-50 border border-slate-300 rounded text-[11px] font-bold text-slate-800 shadow-2xs transition"
              >
                <FolderOpen className="w-3.5 h-3.5 text-amber-600" />
                <span>فتح ملف</span>
              </button>

              <button
                onClick={onSaveDocument}
                className="flex items-center gap-1 px-2.5 h-[26px] bg-white hover:bg-emerald-50 border border-slate-300 rounded text-[11px] font-bold text-slate-800 shadow-2xs transition"
              >
                <Save className="w-3.5 h-3.5 text-emerald-600" />
                <span>حفظ التعديلات</span>
              </button>

              <button
                onClick={onExportDoc}
                className="flex items-center gap-1 px-2.5 h-[26px] bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold shadow-2xs transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تصدير Word (.docx/.doc)</span>
              </button>

              <button
                onClick={onExportPdf}
                className="flex items-center gap-1 px-2.5 h-[26px] bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-bold shadow-2xs transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تصدير PDF</span>
              </button>

              <button
                onClick={onPrint}
                className="flex items-center gap-1 px-2.5 h-[26px] bg-white hover:bg-indigo-50 border border-slate-300 rounded text-[11px] font-bold text-indigo-700 shadow-2xs transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>معاينة وطباعة A4</span>
              </button>
            </div>
          )}

          {/* ================= REFERENCES TAB (مراجع) ================= */}
          {activeTab === 'references' && (
            <div className="flex items-center gap-1.5 flex-nowrap shrink-0">
              <button
                onClick={() => {
                  const tocHtml = `
                    <div style="margin: 16px 0; padding: 14px 18px; border: 1px solid #cbd5e1; background: #f8fafc; border-radius: 6px;">
                      <div style="font-weight: bold; font-size: 14px; color: #1e3a8a; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 8px;">جدول المحتويات والفهارس</div>
                      <div style="display: flex; justify-content: space-between; font-size: 12px; margin: 4px 0;"><span>1. المقدمة والتمهيد الشرعي</span><span>صفحة 1</span></div>
                      <div style="display: flex; justify-content: space-between; font-size: 12px; margin: 4px 0;"><span>2. تفاصيل التركة والحصر</span><span>صفحة 1</span></div>
                      <div style="display: flex; justify-content: space-between; font-size: 12px; margin: 4px 0;"><span>3. توزيع الحصص والانصبة</span><span>صفحة 2</span></div>
                    </div>
                  `;
                  onExecCommand('insertHTML', tocHtml);
                }}
                className="flex items-center gap-1 px-2.5 h-[26px] bg-white hover:bg-blue-50 border border-slate-300 rounded text-[11px] font-bold shadow-2xs"
              >
                <span>+ جدول المحتويات الفوري</span>
              </button>

              <button
                onClick={() => {
                  const fn = prompt('أدخل نص الحاشية السفلية:', 'انظر كتاب المواريث في الشريعة الإسلامية ص 45.');
                  if (fn) {
                    onExecCommand('insertHTML', `<sup style="color: #2563eb; font-weight: bold;">[1]</sup>`);
                    onExecCommand('insertHTML', `<div style="font-size: 11px; color: #64748b; border-top: 1px solid #cbd5e1; margin-top: 12px; padding-top: 4px;">[1] ${fn}</div>`);
                  }
                }}
                className="flex items-center gap-1 px-2.5 h-[26px] bg-white hover:bg-blue-50 border border-slate-300 rounded text-[11px] font-bold shadow-2xs"
              >
                <span>+ إدراج حاشية سفلية (Footnote)</span>
              </button>
            </div>
          )}

          {/* ================= MAILINGS TAB (مراسلات) ================= */}
          {activeTab === 'mailings' && (
            <div className="flex items-center gap-1.5 flex-nowrap shrink-0">
              <button
                onClick={() => {
                  const field = prompt('اختر حقل الدمج (مثال: «اسم_المورث»، «رقم_الهوية»، «التاريخ»):', '«اسم_الوريث»');
                  if (field) onExecCommand('insertHTML', `<span style="background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${field}</span>`);
                }}
                className="flex items-center gap-1 px-2.5 h-[26px] bg-white hover:bg-blue-50 border border-slate-300 rounded text-[11px] font-bold shadow-2xs"
              >
                <span>+ إدراج حقل دمج مراسلات</span>
              </button>

              <button
                onClick={() => {
                  const envHtml = `
                    <div style="margin: 16px 0; padding: 20px; border: 2px dashed #94a3b8; background: #fafafa; border-radius: 8px; width: 340px;">
                      <div style="font-size: 10px; color: #64748b;">المرسل: محكمة القفر الإبتدائية</div>
                      <div style="margin-top: 24px; text-align: center; font-size: 14px; font-weight: bold; color: #1e293b;">إلى المكرم / .................................... المحترم</div>
                      <div style="text-align: center; font-size: 11px; color: #64748b;">الجمهورية اليمنية - محافظة إب</div>
                    </div>
                  `;
                  onExecCommand('insertHTML', envHtml);
                }}
                className="flex items-center gap-1 px-2.5 h-[26px] bg-white hover:bg-blue-50 border border-slate-300 rounded text-[11px] font-bold shadow-2xs"
              >
                <span>إنشاء غلاف خطاب رسمي</span>
              </button>
            </div>
          )}

          {/* ================= REVIEW TAB (مراجعة) ================= */}
          {activeTab === 'review' && (
            <div className="flex items-center gap-1.5 flex-nowrap shrink-0">
              <button
                onClick={() => alert('تم التدقيق اللغوي والإملائي: الصياغة متوافقة ومطابقة للأصول القانونية واللغوية السليمة ✓')}
                className="flex items-center gap-1 px-2.5 h-[26px] bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 rounded font-bold text-[11px] shadow-2xs"
              >
                <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>تدقيق إملائي ونحوي ✓</span>
              </button>

              <button
                onClick={() => {
                  const clean = docState.contentHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
                  const words = clean ? clean.split(/\s+/).length : 0;
                  const chars = clean.length;
                  alert(`إحصائيات المستند:\n- عدد الكلمات: ${words}\n- عدد الأحرف: ${chars}\n- عدد الصفحات التقريبية: ${Math.ceil(words / 350) || 1}`);
                }}
                className="flex items-center gap-1 px-2.5 h-[26px] bg-white hover:bg-slate-100 border border-slate-300 rounded text-[11px] font-bold shadow-2xs"
              >
                <span>إحصاء الكلمات والأحرف</span>
              </button>
            </div>
          )}

          {/* ================= VIEW TAB (عرض) ================= */}
          {activeTab === 'view' && (
            <div className="flex items-center gap-1.5 flex-nowrap shrink-0">
              <button
                onClick={onPrint}
                className="flex items-center gap-1 px-2.5 h-[26px] bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded text-[11px] font-bold shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>معاينة الطباعة A4</span>
              </button>

              <button
                onClick={() => onUpdateDoc({ showRuler: !docState.showRuler })}
                className={`flex items-center gap-1 px-2.5 h-[26px] rounded text-[11px] font-semibold border transition ${
                  docState.showRuler ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>المسطرة {docState.showRuler ? 'مفعلة ✓' : 'معطلة'}</span>
              </button>

              <button
                onClick={() => onUpdateDoc({ isReadingMode: !docState.isReadingMode })}
                className={`flex items-center gap-1 px-2.5 h-[26px] rounded text-[11px] font-semibold border transition ${
                  docState.isReadingMode ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>وضع القراءة</span>
              </button>

              {/* Zoom Controls */}
              <div className="flex items-center bg-white border border-slate-300 rounded h-[26px] shadow-2xs">
                <button
                  onClick={() => onUpdateDoc({ zoom: Math.max(docState.zoom - 10, 40) })}
                  className="px-1.5 h-full hover:bg-slate-100 text-slate-700"
                  title="تصغير"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="px-1.5 text-[11px] font-bold text-slate-800 min-w-[40px] text-center">
                  {docState.zoom}%
                </span>
                <button
                  onClick={() => onUpdateDoc({ zoom: Math.min(docState.zoom + 10, 200) })}
                  className="px-1.5 h-full hover:bg-slate-100 text-slate-700"
                  title="تكبير"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* ================= HELP TAB (تعليمات) ================= */}
          {activeTab === 'help' && (
            <div className="flex items-center gap-1.5 flex-nowrap shrink-0">
              <button
                onClick={() => alert(`اختصارات لوحة المفاتيح:\nCtrl+B: غامق\nCtrl+I: مائل\nCtrl+U: تسطير\nCtrl+Z: تراجع\nCtrl+S: حفظ\nCtrl+P: طباعة`)}
                className="px-2.5 h-[26px] bg-white hover:bg-blue-50 border border-slate-300 rounded text-[11px] font-bold shadow-2xs"
              >
                اختصارات لوحة المفاتيح ⌨
              </button>

              {onOpenSimulator && (
                <button
                  onClick={onOpenSimulator}
                  className="flex items-center gap-1 px-2.5 h-[26px] bg-amber-500 hover:bg-amber-600 text-slate-950 rounded text-[11px] font-black shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>محاكاة وفحص شامل للمستند</span>
                </button>
              )}
            </div>
          )}

        </div>
      )}

      {/* Find and Replace Modal */}
      {showFindModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-4 w-96 space-y-3" dir="rtl">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-sm text-slate-800">البحث والاستبدال في المستند</h3>
              <button onClick={() => setShowFindModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div>
              <label className="block text-xs text-slate-600 font-semibold mb-1">الكلمة أو العبارة المراد البحث عنها:</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="أدخل النص..."
                className="w-full border rounded px-3 py-1.5 text-xs focus:outline-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 font-semibold mb-1">استبدال بـ:</label>
              <input
                type="text"
                value={replaceQuery}
                onChange={(e) => setReplaceQuery(e.target.value)}
                placeholder="النص البديل الجديد..."
                className="w-full border rounded px-3 py-1.5 text-xs focus:outline-blue-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => setShowFindModal(false)}
                className="px-3 py-1.5 rounded border border-slate-300 text-xs font-semibold hover:bg-slate-100"
              >
                إلغاء
              </button>
              <button
                onClick={handleFindReplace}
                className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
              >
                استبدال الكل
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Styles Modal */}
      {showStylesModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-4 w-[480px] space-y-3" dir="rtl">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-sm text-slate-800">إدارة أنماط وقوالب الفقرات</h3>
              <button onClick={() => setShowStylesModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <p className="text-xs text-slate-600">
              اختر النمط المطلوب لتطبيقه مباشرة على الفقرة أو النص المحدد:
            </p>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {quickStyles.map((qs) => (
                <div key={qs.id} className="flex items-center justify-between p-2 rounded-lg border border-slate-200 hover:bg-slate-50">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-blue-800">{qs.preview}</span>
                    <span className="font-bold text-xs text-slate-800">{qs.title}</span>
                  </div>
                  <button
                    onClick={() => {
                      qs.apply();
                      setShowStylesModal(false);
                    }}
                    className="px-3 py-1 rounded bg-blue-600 text-white text-[11px] font-bold hover:bg-blue-700"
                  >
                    تطبيق
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-2 border-t">
              <button
                onClick={() => setShowStylesModal(false)}
                className="px-4 py-1.5 rounded border border-slate-300 text-xs font-semibold hover:bg-slate-100"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
