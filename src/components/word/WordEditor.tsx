import React, { useState, useRef, useEffect } from 'react';
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
  Indent,
  Outdent,
  Table as TableIcon,
  Image as ImageIcon,
  Minus,
  Plus,
  Search,
  Replace,
  Type,
  Maximize2,
  Calendar,
  Sparkles,
  Palette,
  Highlighter,
  Sliders,
  ChevronDown,
  X,
  FileText,
  Heading1,
  Heading2,
  Heading3,
  Columns,
  Trash2,
  Grid,
  CheckCircle2,
  BookOpen,
  Keyboard as KeyboardIcon,
  Check,
  Undo,
  Redo,
  Upload,
  Layers,
  Wand2
} from 'lucide-react';
import { DocumentState } from '../../types';
import { SpellIssue, detectSpellingIssues } from '../../utils/arabicSpellCheck';
import { SpellCheckModal } from './SpellCheckModal';
import { TableOfContentsModal } from './TableOfContentsModal';
import { extractHeadingsFromHtml, buildTableOfContentsHtml, TocItem } from '../../utils/tableOfContents';

interface WordEditorProps {
  documentState: DocumentState;
  onChange: (updated: DocumentState) => void;
  onOpenTemplates: () => void;
  onToggleKeyboard?: () => void;
  isKeyboardOpen?: boolean;
}

export const ARABIC_FONTS = [
  { id: 'Cairo', name: 'القاهرة (Cairo)', font: 'Cairo, sans-serif' },
  { id: 'Amiri', name: 'أميري (Amiri - نسخ أصيل)', font: 'Amiri, serif' },
  { id: 'Tajawal', name: 'تجوّل (Tajawal)', font: 'Tajawal, sans-serif' },
  { id: 'Almarai', name: 'المراعي (Almarai - تقني أنيق)', font: 'Almarai, sans-serif' },
  { id: 'Noto Naskh Arabic', name: 'نسخ (Noto Naskh)', font: '"Noto Naskh Arabic", serif' },
  { id: 'Noto Kufi Arabic', name: 'كوفي (Noto Kufi)', font: '"Noto Kufi Arabic", sans-serif' },
  { id: 'Scheherazade New', name: 'شهرزاد (Scheherazade)', font: '"Scheherazade New", serif' },
  { id: 'Changa', name: 'تشانغا (Changa)', font: 'Changa, sans-serif' },
  { id: 'Reem Kufi', name: 'ريم كوفي (Reem Kufi)', font: '"Reem Kufi", sans-serif' },
  { id: 'Aref Ruqaa', name: 'رقعة (Aref Ruqaa)', font: '"Aref Ruqaa", serif' },
  { id: 'Lateef', name: 'لطيف (Lateef)', font: 'Lateef, serif' },
  { id: 'Arial', name: 'Arial', font: 'Arial, sans-serif' },
  { id: 'Times New Roman', name: 'Times New Roman', font: '"Times New Roman", serif' },
];

export const WordEditor: React.FC<WordEditorProps> = ({
  documentState,
  onChange,
  onOpenTemplates,
  onToggleKeyboard,
  isKeyboardOpen = false,
}) => {
  const [fontFamily, setFontFamily] = useState(documentState.fontFamily || 'Cairo');
  const [fontSize, setFontSize] = useState(documentState.fontSize || '14');
  const [stats, setStats] = useState({ words: 0, chars: 0, pages: 1 });
  const [zoom, setZoom] = useState(documentState.zoom || 100);

  // Dynamic Dropdown Menus state
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Search & Replace state
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [matchCount, setMatchCount] = useState(0);

  // Table Inserter modal state
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(4);
  const [tableHoverRows, setTableHoverRows] = useState(0);
  const [tableHoverCols, setTableHoverCols] = useState(0);
  const [hasHeaderRow, setHasHeaderRow] = useState(true);
  const [isStripedTable, setIsStripedTable] = useState(true);
  const [isInTable, setIsInTable] = useState(false);

  // Color Pickers
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [customColor, setCustomColor] = useState('#000000');
  const [customHighlight, setCustomHighlight] = useState('#fef08a');

  // Spell Check state
  const [isSpellCheckActive, setIsSpellCheckActive] = useState(true);
  const [spellIssues, setSpellIssues] = useState<SpellIssue[]>([]);
  const [showSpellModal, setShowSpellModal] = useState(false);
  const [currentSpellIssueIndex, setCurrentSpellIssueIndex] = useState(0);
  const [activeCorrectionPopup, setActiveCorrectionPopup] = useState<{
    issue: SpellIssue;
    x: number;
    y: number;
  } | null>(null);

  // Table of Contents state
  const [showTocModal, setShowTocModal] = useState(false);
  const [detectedHeadings, setDetectedHeadings] = useState<TocItem[]>([]);

  // Refs
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputImageRef = useRef<HTMLInputElement>(null);
  const isInternalChangeRef = useRef(false);
  const savedSelectionRangeRef = useRef<Range | null>(null);

  // Synchronize internal contentEditable with state on external changes
  useEffect(() => {
    if (editorRef.current && !isInternalChangeRef.current) {
      editorRef.current.innerHTML = documentState.contentHtml;
      updateStats();
      runSpellCheck(documentState.contentHtml);
    }
    isInternalChangeRef.current = false;
  }, [documentState.contentHtml]);

  // Close dynamic dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.dynamic-dropdown-container')) {
        setActiveDropdown(null);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Save selection before opening modals or pickers
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelectionRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    const sel = window.getSelection();
    if (sel && savedSelectionRangeRef.current) {
      sel.removeAllRanges();
      sel.addRange(savedSelectionRangeRef.current);
    }
  };

  // Run spell check on text
  const runSpellCheck = (htmlContent: string) => {
    if (!isSpellCheckActive) {
      setSpellIssues([]);
      return;
    }
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const plainText = tempDiv.innerText || '';
    const issues = detectSpellingIssues(plainText);
    setSpellIssues(issues);
  };

  // Track if cursor is currently in a table
  const checkCursorInTable = () => {
    const sel = window.getSelection();
    if (!sel || !sel.anchorNode) {
      setIsInTable(false);
      return;
    }
    let node: Node | null = sel.anchorNode;
    while (node && node !== editorRef.current) {
      if (node.nodeName === 'TABLE' || node.nodeName === 'TD' || node.nodeName === 'TH') {
        setIsInTable(true);
        return;
      }
      node = node.parentNode;
    }
    setIsInTable(false);
  };

  // Update statistics (word & character count)
  const updateStats = () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText || '';
    const cleanText = text.trim();
    const words = cleanText ? cleanText.split(/\s+/).length : 0;
    const chars = text.length;
    const pages = Math.max(1, Math.ceil(words / 350));
    setStats({ words, chars, pages });
  };

  const handleInput = () => {
    if (!editorRef.current) return;
    isInternalChangeRef.current = true;
    const html = editorRef.current.innerHTML;
    updateStats();
    checkCursorInTable();
    runSpellCheck(html);
    onChange({
      ...documentState,
      contentHtml: html,
      lastModified: Date.now(),
    });
  };

  // Rich Text command helper
  const execCmd = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
    handleInput();
  };

  // Font styling handlers
  const handleFontFamilyChange = (font: string) => {
    setFontFamily(font);
    execCmd('fontName', font);
    onChange({ ...documentState, fontFamily: font });
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      const span = document.createElement('span');
      span.style.fontSize = `${size}pt`;
      const range = selection.getRangeAt(0);
      try {
        range.surroundContents(span);
      } catch {
        execCmd('fontSize', '4');
      }
    } else {
      execCmd('fontSize', '4');
    }
    handleInput();
  };

  const applyHeading = (tag: string) => {
    execCmd('formatBlock', `<${tag}>`);
  };

  // Apply custom text color
  const applyTextColor = (color: string) => {
    execCmd('foreColor', color);
    setShowColorPicker(false);
  };

  // Apply custom highlight background color
  const applyHighlightColor = (color: string) => {
    execCmd('hiliteColor', color);
    setShowHighlightPicker(false);
  };

  // Insert Table Functionality
  const handleInsertTable = (rows: number = tableRows, cols: number = tableCols) => {
    let tableHtml = `<table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1.5px solid #94a3b8;" data-office-table="true">`;
    for (let r = 0; r < rows; r++) {
      const isHeader = r === 0 && hasHeaderRow;
      const rowBg = isHeader ? 'background-color: #1e3a8a; color: #ffffff;' : isStripedTable && r % 2 === 1 ? 'background-color: #f8fafc;' : 'background-color: #ffffff;';
      tableHtml += `<tr style="${rowBg}">`;
      for (let c = 0; c < cols; c++) {
        const cellTag = isHeader ? 'th' : 'td';
        const cellBorder = isHeader ? 'border: 1px solid #1e40af;' : 'border: 1px solid #cbd5e1;';
        const placeholder = isHeader ? `عنوان ${c + 1}` : `بيانات ${r}-${c + 1}`;
        tableHtml += `<${cellTag} style="${cellBorder} padding: 10px 12px; text-align: right; min-width: 80px; font-weight: ${isHeader ? 'bold' : 'normal'};">${placeholder}</${cellTag}>`;
      }
      tableHtml += `</tr>`;
    }
    tableHtml += `</table><p><br></p>`;

    restoreSelection();
    execCmd('insertHTML', tableHtml);
    setShowTableModal(false);
    setIsInTable(true);
  };

  // Table manipulation tools
  const getParentTableCell = (): { td: HTMLTableCellElement | null; tr: HTMLTableRowElement | null; table: HTMLTableElement | null } => {
    const sel = window.getSelection();
    if (!sel || !sel.anchorNode) return { td: null, tr: null, table: null };
    let curr: Node | null = sel.anchorNode;
    let td: HTMLTableCellElement | null = null;
    let tr: HTMLTableRowElement | null = null;
    let table: HTMLTableElement | null = null;

    while (curr && curr !== editorRef.current) {
      if (curr.nodeName === 'TD' || curr.nodeName === 'TH') td = curr as HTMLTableCellElement;
      if (curr.nodeName === 'TR') tr = curr as HTMLTableRowElement;
      if (curr.nodeName === 'TABLE') table = curr as HTMLTableElement;
      curr = curr.parentNode;
    }
    return { td, tr, table };
  };

  const handleAddRowBelow = () => {
    const { tr, table } = getParentTableCell();
    if (!tr || !table) return;
    const numCols = tr.cells.length;
    const newTr = table.insertRow(tr.rowIndex + 1);
    newTr.style.backgroundColor = '#ffffff';
    for (let i = 0; i < numCols; i++) {
      const newCell = newTr.insertCell(i);
      newCell.style.border = '1px solid #cbd5e1';
      newCell.style.padding = '10px 12px';
      newCell.style.textAlign = 'right';
      newCell.innerHTML = '&nbsp;';
    }
    handleInput();
  };

  const handleDeleteEntireTable = () => {
    const { table } = getParentTableCell();
    if (table) {
      table.remove();
      setIsInTable(false);
      handleInput();
    }
  };

  // Image Insertion Handler (Using browser-supported file picker at cursor)
  const triggerImagePicker = () => {
    saveSelection();
    if (fileInputImageRef.current) {
      fileInputImageRef.current.click();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const imgUrl = reader.result as string;
      restoreSelection();
      const imgHtml = `<div style="text-align: center; margin: 16px 0;"><img src="${imgUrl}" alt="صورة مدرجة" style="max-width: 85%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" /><p style="font-size: 10pt; color: #64748b; margin-top: 4px;">[صورة مدرجة: ${file.name}]</p></div><p><br></p>`;
      execCmd('insertHTML', imgHtml);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Table of Contents Generation
  const handleOpenTocModal = () => {
    if (!editorRef.current) return;
    const { items } = extractHeadingsFromHtml(editorRef.current.innerHTML);
    setDetectedHeadings(items);
    setShowTocModal(true);
  };

  const handleInsertTocDirectly = () => {
    if (!editorRef.current) return;
    const { items, modifiedHtml } = extractHeadingsFromHtml(editorRef.current.innerHTML);
    const tocBlock = buildTableOfContentsHtml(items);

    // If an existing TOC exists, replace it, otherwise insert at top of document
    if (modifiedHtml.includes('id="document-table-of-contents"')) {
      const replacedHtml = modifiedHtml.replace(
        /<div id="document-table-of-contents"[\s\S]*?<\/div>\s*<\/div>/,
        tocBlock
      );
      editorRef.current.innerHTML = replacedHtml;
    } else {
      editorRef.current.innerHTML = tocBlock + modifiedHtml;
    }
    handleInput();
  };

  // Spell Check Replacements
  const handleApplySpellCorrection = (issue: SpellIssue, suggestion: string) => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    // Replace word instance safely
    const escaped = issue.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(\\b|\\s|^|>)(${escaped})(\\b|\\s|$|<)`, 'g');
    const newHtml = html.replace(regex, `$1${suggestion}$3`);
    editorRef.current.innerHTML = newHtml;
    handleInput();

    // Advance to next issue or close
    if (spellIssues.length <= 1) {
      setShowSpellModal(false);
    } else {
      setCurrentSpellIssueIndex(prev => Math.min(spellIssues.length - 2, prev));
    }
    setActiveCorrectionPopup(null);
  };

  const handleIgnoreSpellIssue = (issue: SpellIssue) => {
    setSpellIssues(prev => prev.filter(i => i.id !== issue.id));
    if (currentSpellIssueIndex >= spellIssues.length - 1) {
      setCurrentSpellIssueIndex(Math.max(0, spellIssues.length - 2));
    }
    setActiveCorrectionPopup(null);
  };

  // Search & Replace
  const handleSearch = () => {
    if (!searchTerm || !editorRef.current) {
      setMatchCount(0);
      return;
    }
    const text = editorRef.current.innerText;
    const regex = new RegExp(searchTerm, 'gi');
    const matches = text.match(regex);
    setMatchCount(matches ? matches.length : 0);
  };

  const handleReplace = (replaceAll: boolean = false) => {
    if (!searchTerm || !editorRef.current) return;
    const html = editorRef.current.innerHTML;
    const regex = new RegExp(searchTerm, replaceAll ? 'g' : '');
    const newHtml = html.replace(regex, replaceTerm);
    if (editorRef.current) {
      editorRef.current.innerHTML = newHtml;
    }
    handleInput();
    handleSearch();
  };

  const colorPalette = [
    '#000000', '#1e293b', '#334155', '#475569', '#64748b',
    '#1e3a8a', '#2563eb', '#0284c7', '#0891b2', '#0d9488',
    '#047857', '#16a34a', '#65a30d', '#ca8a04', '#d97706',
    '#dc2626', '#b91c1c', '#7c2d12', '#7e22ce', '#9333ea'
  ];

  const highlightPalette = [
    '#fef08a', '#bbf7d0', '#bfdbfe', '#fbcfe8', '#fed7aa', '#ddd6fe', '#e2e8f0', 'transparent'
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-48px)] bg-neutral-200/70 overflow-hidden font-sans">
      {/* Hidden File Input for Image Insertion */}
      <input
        type="file"
        ref={fileInputImageRef}
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* COMPACT 1CM FORMATTING TOOLBAR WITH DYNAMIC DROPDOWNS (height: 38px / 1cm) */}
      <div className="bg-white border-b border-neutral-300 shadow-xs z-30 select-none h-[38px] min-h-[38px] flex items-center justify-between px-2 gap-2 text-xs">
        {/* Left Side: Dynamic Menu Dropdowns */}
        <div className="flex items-center gap-1">
          {/* Dynamic Dropdown: ملف (File) */}
          <div className="relative dynamic-dropdown-container">
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'file' ? null : 'file')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-bold transition-colors ${
                activeDropdown === 'file' ? 'bg-blue-100 text-blue-800' : 'hover:bg-neutral-100 text-neutral-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-blue-700" />
              <span>ملف</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {activeDropdown === 'file' && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-neutral-300 rounded-xl shadow-xl py-1.5 w-52 z-50 text-right">
                <button
                  onClick={() => {
                    onOpenTemplates();
                    setActiveDropdown(null);
                  }}
                  className="w-full px-3 py-1.5 hover:bg-neutral-100 text-neutral-800 font-semibold flex items-center justify-between"
                >
                  <span>نماذج وورد الجاهزة</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                </button>
                <button
                  onClick={() => {
                    window.print();
                    setActiveDropdown(null);
                  }}
                  className="w-full px-3 py-1.5 hover:bg-neutral-100 text-neutral-700 flex items-center justify-between"
                >
                  <span>طباعة / حفظ PDF</span>
                  <span className="text-[10px] text-neutral-400 font-mono">Ctrl+P</span>
                </button>
              </div>
            )}
          </div>

          {/* Dynamic Dropdown: خط وتنسيق (Font & Formatting) */}
          <div className="relative dynamic-dropdown-container">
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'font' ? null : 'font')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-bold transition-colors ${
                activeDropdown === 'font' ? 'bg-blue-100 text-blue-800' : 'hover:bg-neutral-100 text-neutral-800'
              }`}
            >
              <Type className="w-3.5 h-3.5 text-neutral-700" />
              <span>الخطوط</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {activeDropdown === 'font' && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-neutral-300 rounded-xl shadow-xl py-2 w-72 z-50 text-right max-h-80 overflow-y-auto">
                <div className="px-3 pb-1 text-[11px] font-bold text-neutral-500 border-b border-neutral-100">
                  الخطوط العربية الإضافية (11 خطاً مفعلاً):
                </div>
                {ARABIC_FONTS.map(f => (
                  <button
                    key={f.id}
                    onClick={() => {
                      handleFontFamilyChange(f.id);
                      setActiveDropdown(null);
                    }}
                    style={{ fontFamily: f.font }}
                    className={`w-full px-3 py-2 text-sm hover:bg-blue-50 text-right flex items-center justify-between ${
                      fontFamily === f.id ? 'bg-blue-50/70 text-blue-800 font-bold' : 'text-neutral-800'
                    }`}
                  >
                    <span>{f.name}</span>
                    {fontFamily === f.id && <Check className="w-4 h-4 text-blue-700" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dynamic Dropdown: إدراج (Insert - Table, Image, TOC) */}
          <div className="relative dynamic-dropdown-container">
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'insert' ? null : 'insert')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-bold transition-colors ${
                activeDropdown === 'insert' ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-neutral-100 text-neutral-800'
              }`}
            >
              <Plus className="w-3.5 h-3.5 text-emerald-700" />
              <span>إدراج</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {activeDropdown === 'insert' && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-neutral-300 rounded-xl shadow-xl py-1.5 w-64 z-50 text-right">
                <button
                  onClick={() => {
                    saveSelection();
                    setShowTableModal(true);
                    setActiveDropdown(null);
                  }}
                  className="w-full px-3 py-2 hover:bg-emerald-50 text-neutral-800 font-semibold flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <TableIcon className="w-4 h-4 text-blue-600" />
                    <span>إدراج جدول منظم</span>
                  </div>
                  <span className="text-[10px] text-neutral-400">مع شبكة اختيار</span>
                </button>

                <button
                  onClick={() => {
                    triggerImagePicker();
                    setActiveDropdown(null);
                  }}
                  className="w-full px-3 py-2 hover:bg-emerald-50 text-neutral-800 font-semibold flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-emerald-600" />
                    <span>إدراج صورة من الجهاز</span>
                  </div>
                  <span className="text-[10px] text-neutral-400">PNG / JPG</span>
                </button>

                <button
                  onClick={() => {
                    handleOpenTocModal();
                    setActiveDropdown(null);
                  }}
                  className="w-full px-3 py-2 hover:bg-emerald-50 text-neutral-800 font-semibold flex items-center justify-between border-t border-neutral-100"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-purple-600" />
                    <span>فهرس المحتويات (TOC)</span>
                  </div>
                  <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-bold">تلقائي</span>
                </button>

                <button
                  onClick={() => {
                    execCmd('insertHorizontalRule');
                    setActiveDropdown(null);
                  }}
                  className="w-full px-3 py-2 hover:bg-neutral-100 text-neutral-700 flex items-center gap-2"
                >
                  <Minus className="w-4 h-4 text-neutral-500" />
                  <span>خط فاصل أفقي</span>
                </button>

                <button
                  onClick={() => {
                    const today = new Date().toLocaleDateString('ar-SA', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    });
                    execCmd('insertText', today);
                    setActiveDropdown(null);
                  }}
                  className="w-full px-3 py-2 hover:bg-neutral-100 text-neutral-700 flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-neutral-500" />
                  <span>تاريخ اليوم هجري / ميلادي</span>
                </button>
              </div>
            )}
          </div>

          {/* Dynamic Dropdown: تدقيق ولغة (Spell Check) */}
          <div className="relative dynamic-dropdown-container">
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'review' ? null : 'review')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-bold transition-colors ${
                activeDropdown === 'review' ? 'bg-rose-100 text-rose-800' : 'hover:bg-neutral-100 text-neutral-800'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />
              <span>التدقيق</span>
              {spellIssues.length > 0 && (
                <span className="w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] flex items-center justify-center font-mono">
                  {spellIssues.length}
                </span>
              )}
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {activeDropdown === 'review' && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-neutral-300 rounded-xl shadow-xl py-1.5 w-60 z-50 text-right">
                <button
                  onClick={() => {
                    setShowSpellModal(true);
                    setActiveDropdown(null);
                  }}
                  className="w-full px-3 py-2 hover:bg-rose-50 text-neutral-800 font-semibold flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-rose-600" />
                    <span>فاحص الأخطاء الشامل</span>
                  </div>
                  <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded font-bold">
                    {spellIssues.length} تنبيهات
                  </span>
                </button>
                <button
                  onClick={() => {
                    setIsSpellCheckActive(prev => !prev);
                    if (!isSpellCheckActive && editorRef.current) {
                      runSpellCheck(editorRef.current.innerHTML);
                    }
                    setActiveDropdown(null);
                  }}
                  className="w-full px-3 py-2 hover:bg-neutral-100 text-neutral-700 flex items-center justify-between"
                >
                  <span>التدقيق التلقائي الفوري</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isSpellCheckActive ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'}`}>
                    {isSpellCheckActive ? 'مفعّل' : 'معطل'}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Center/Quick-Action Bar: 1cm Fast Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          {/* Headings Quick Select */}
          <div className="flex items-center bg-neutral-100 rounded border border-neutral-300 p-0.5">
            <button
              onClick={() => applyHeading('p')}
              className="px-1.5 py-0.5 hover:bg-white rounded text-[11px] font-medium text-neutral-700"
              title="نص عادي"
            >
              نص
            </button>
            <button
              onClick={() => applyHeading('h1')}
              className="px-1.5 py-0.5 hover:bg-white rounded text-[11px] font-bold text-neutral-900"
              title="عنوان رئيسي 1"
            >
              ع1
            </button>
            <button
              onClick={() => applyHeading('h2')}
              className="px-1.5 py-0.5 hover:bg-white rounded text-[11px] font-bold text-neutral-800"
              title="عنوان فرعي 2"
            >
              ع2
            </button>
            <button
              onClick={() => applyHeading('h3')}
              className="px-1.5 py-0.5 hover:bg-white rounded text-[11px] font-semibold text-neutral-700"
              title="عنوان 3"
            >
              ع3
            </button>
          </div>

          <div className="h-4 w-px bg-neutral-300 mx-0.5" />

          {/* Font Selector in 1cm bar */}
          <select
            value={fontFamily}
            onChange={(e) => handleFontFamilyChange(e.target.value)}
            className="h-7 bg-neutral-50 hover:bg-white border border-neutral-300 rounded px-1.5 text-xs font-semibold text-neutral-800 focus:outline-hidden cursor-pointer max-w-[120px]"
            title="نوع الخط العربي"
          >
            {ARABIC_FONTS.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>

          {/* Font Size Selector */}
          <select
            value={fontSize}
            onChange={(e) => handleFontSizeChange(e.target.value)}
            className="h-7 bg-neutral-50 hover:bg-white border border-neutral-300 rounded px-1 text-xs font-mono font-bold text-neutral-800 focus:outline-hidden cursor-pointer"
            title="حجم الخط"
          >
            {['10', '11', '12', '14', '16', '18', '20', '24', '28', '32', '36', '48'].map((sz) => (
              <option key={sz} value={sz}>{sz}pt</option>
            ))}
          </select>

          <div className="h-4 w-px bg-neutral-300 mx-0.5" />

          {/* Bold, Italic, Underline */}
          <div className="flex items-center bg-neutral-100 rounded border border-neutral-300 p-0.5">
            <button
              onClick={() => execCmd('bold')}
              className="p-1 hover:bg-white rounded transition-colors text-neutral-800 font-bold"
              title="عريض (Ctrl+B)"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => execCmd('italic')}
              className="p-1 hover:bg-white rounded transition-colors text-neutral-800"
              title="مائل (Ctrl+I)"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => execCmd('underline')}
              className="p-1 hover:bg-white rounded transition-colors text-neutral-800"
              title="تسطير (Ctrl+U)"
            >
              <Underline className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Color & Highlight */}
          <div className="relative">
            <button
              onClick={() => {
                setShowColorPicker(!showColorPicker);
                setShowHighlightPicker(false);
              }}
              className="h-7 px-1.5 flex items-center gap-1 hover:bg-neutral-100 rounded border border-neutral-300 text-neutral-700"
              title="لون النص"
            >
              <span className="font-bold underline decoration-red-600 decoration-2 text-xs">A</span>
            </button>
            {showColorPicker && (
              <div className="absolute top-full mt-1 bg-white border border-neutral-300 rounded-lg shadow-xl p-2.5 z-50 w-48">
                <span className="text-[10px] font-bold text-neutral-500 block mb-1.5">لون النص:</span>
                <div className="grid grid-cols-5 gap-1.5 mb-2">
                  {colorPalette.map((c) => (
                    <button
                      key={c}
                      onClick={() => applyTextColor(c)}
                      style={{ backgroundColor: c }}
                      className="w-6 h-6 rounded-sm border border-neutral-300 hover:scale-110 transition-transform"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setShowHighlightPicker(!showHighlightPicker);
                setShowColorPicker(false);
              }}
              className="h-7 px-1.5 flex items-center gap-1 hover:bg-neutral-100 rounded border border-neutral-300 text-neutral-700"
              title="تمييز خلفية النص (Highlighter)"
            >
              <Highlighter className="w-3.5 h-3.5 text-amber-500" />
            </button>
            {showHighlightPicker && (
              <div className="absolute top-full mt-1 bg-white border border-neutral-300 rounded-lg shadow-xl p-2.5 z-50 w-48">
                <span className="text-[10px] font-bold text-neutral-500 block mb-1.5">تمييز النص:</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {highlightPalette.map((c) => (
                    <button
                      key={c}
                      onClick={() => applyHighlightColor(c)}
                      style={{ backgroundColor: c === 'transparent' ? '#ffffff' : c }}
                      className="w-6 h-6 rounded-sm border border-neutral-300 hover:scale-110 transition-transform"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="h-4 w-px bg-neutral-300 mx-0.5" />

          {/* Alignments */}
          <div className="flex items-center bg-neutral-100 rounded border border-neutral-300 p-0.5">
            <button
              onClick={() => execCmd('justifyRight')}
              className="p-1 hover:bg-white rounded transition-colors text-neutral-700"
              title="محاذاة لليمين"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => execCmd('justifyCenter')}
              className="p-1 hover:bg-white rounded transition-colors text-neutral-700"
              title="توسيط"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => execCmd('justifyLeft')}
              className="p-1 hover:bg-white rounded transition-colors text-neutral-700"
              title="محاذاة لليسار"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => execCmd('justifyFull')}
              className="p-1 hover:bg-white rounded transition-colors text-neutral-700"
              title="ضبط كامل (Justify)"
            >
              <AlignJustify className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Lists */}
          <div className="flex items-center bg-neutral-100 rounded border border-neutral-300 p-0.5">
            <button
              onClick={() => execCmd('insertUnorderedList')}
              className="p-1 hover:bg-white rounded transition-colors text-neutral-700"
              title="قائمة نقطية"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => execCmd('insertOrderedList')}
              className="p-1 hover:bg-white rounded transition-colors text-neutral-700"
              title="قائمة رقمية"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-4 w-px bg-neutral-300 mx-0.5" />

          {/* Quick Insert Buttons: Table, Image, TOC */}
          <button
            onClick={() => {
              saveSelection();
              setShowTableModal(true);
            }}
            className="h-7 px-2 hover:bg-blue-50 hover:text-blue-700 rounded border border-neutral-300 flex items-center gap-1 font-semibold text-neutral-700"
            title="إدراج جدول"
          >
            <TableIcon className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden xl:inline text-[11px]">جدول</span>
          </button>

          <button
            onClick={triggerImagePicker}
            className="h-7 px-2 hover:bg-emerald-50 hover:text-emerald-700 rounded border border-neutral-300 flex items-center gap-1 font-semibold text-neutral-700"
            title="إدراج صورة من جهازك"
          >
            <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden xl:inline text-[11px]">صورة</span>
          </button>

          <button
            onClick={handleOpenTocModal}
            className="h-7 px-2 hover:bg-purple-50 hover:text-purple-700 rounded border border-neutral-300 flex items-center gap-1 font-semibold text-neutral-700"
            title="إدراج فهرس المحتويات (TOC)"
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-600" />
            <span className="hidden xl:inline text-[11px]">فهرس</span>
          </button>

          {/* Quick Spell Check Trigger */}
          <button
            onClick={() => setShowSpellModal(true)}
            className={`h-7 px-2 rounded border flex items-center gap-1 font-semibold transition-colors ${
              spellIssues.length > 0
                ? 'bg-rose-50 border-rose-300 text-rose-800'
                : 'border-neutral-300 text-neutral-700 hover:bg-neutral-100'
            }`}
            title="فاحص التدقيق الإملائي"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />
            <span className="text-[11px]">
              {spellIssues.length > 0 ? `${spellIssues.length} أخطاء` : 'سليم'}
            </span>
          </button>
        </div>

        {/* Right Side: Virtual Keyboard Toggle & Zoom */}
        <div className="flex items-center gap-1 shrink-0">
          {onToggleKeyboard && (
            <button
              onClick={onToggleKeyboard}
              className={`h-7 px-2.5 rounded-md border flex items-center gap-1.5 font-bold transition-all ${
                isKeyboardOpen
                  ? 'bg-cyan-600 text-white border-cyan-700 shadow-xs'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-300'
              }`}
              title="تشغيل / إخفاء الكيبورد العربي الملحق"
            >
              <KeyboardIcon className="w-3.5 h-3.5" />
              <span className="text-[11px]">كيبورد ملحق</span>
            </button>
          )}

          {/* Search trigger */}
          <button
            onClick={() => setShowSearchModal(true)}
            className="p-1.5 hover:bg-neutral-100 text-neutral-600 rounded border border-neutral-300"
            title="بحث واستبدال"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Canvas Scroll Area with Realistic Printable Sheet Margin */}
      <div className="flex-1 overflow-y-auto overflow-x-auto p-4 md:p-8 flex justify-center items-start">
        {/* The Paper Sheet Container */}
        <div
          style={{
            width: '210mm',
            minHeight: '297mm',
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
          }}
          className="bg-white shadow-2xl rounded-sm transition-transform duration-150 relative border border-neutral-300/80 mb-12"
        >
          {/* Print Watermark or Header Margin Marker */}
          <div className="h-8 border-b border-neutral-100 flex items-center justify-between px-12 text-[10px] text-neutral-400 select-none">
            <span>مستند رسمي - محرر وورد أوفيس برو</span>
            <span>صفحة {stats.pages}</span>
          </div>

          {/* Content Editable Area */}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onKeyUp={checkCursorInTable}
            onMouseUp={checkCursorInTable}
            style={{
              fontFamily: ARABIC_FONTS.find(f => f.id === fontFamily)?.font || fontFamily,
              fontSize: `${fontSize}pt`,
              lineHeight: '1.8',
              minHeight: '270mm',
            }}
            className="p-12 md:p-16 focus:outline-hidden text-neutral-900 leading-relaxed text-right dir-rtl document-print-content"
          />

          {/* Print Footer Margin Marker */}
          <div className="h-8 border-t border-neutral-100 flex items-center justify-between px-12 text-[10px] text-neutral-400 select-none">
            <span>حرر بواسطة منصة التطبيقات الذكية</span>
            <span>{stats.words} كلمة</span>
          </div>
        </div>
      </div>

      {/* Floating Spell Check Alert Pill (if errors exist and active) */}
      {isSpellCheckActive && spellIssues.length > 0 && (
        <div className="fixed bottom-10 left-6 z-40 bg-white/95 backdrop-blur-xs border border-rose-300 rounded-full shadow-lg px-4 py-2 flex items-center gap-3 text-xs animate-in slide-in-from-bottom-2">
          <div className="flex items-center gap-1.5 font-bold text-rose-700">
            <Wand2 className="w-4 h-4 text-rose-600 animate-pulse" />
            <span>تم رصد {spellIssues.length} أخطاء إملائية مقترحة</span>
          </div>
          <button
            onClick={() => setShowSpellModal(true)}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1 rounded-full text-[11px] shadow-xs cursor-pointer"
          >
            مراجعة وتصحيح
          </button>
        </div>
      )}

      {/* Bottom Status Bar */}
      <div className="bg-white border-t border-neutral-300 px-4 py-1.5 flex items-center justify-between text-xs text-neutral-600 select-none z-20">
        <div className="flex items-center gap-4">
          <span>الكلمات: <strong className="font-mono text-neutral-800">{stats.words}</strong></span>
          <span>الأحرف: <strong className="font-mono text-neutral-800">{stats.chars}</strong></span>
          <span>الصفحات: <strong className="font-mono text-neutral-800">{stats.pages}</strong></span>
          <div className="h-3.5 w-px bg-neutral-300" />
          <button
            onClick={() => setShowSpellModal(true)}
            className="flex items-center gap-1 text-[11px] text-rose-700 hover:underline cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>التدقيق الإملائي ({spellIssues.length} أخطاء)</span>
          </button>
        </div>

        {/* Zoom & Keyboard Controls */}
        <div className="flex items-center gap-2">
          {onToggleKeyboard && (
            <button
              onClick={onToggleKeyboard}
              className="flex items-center gap-1 px-2 py-0.5 bg-neutral-100 hover:bg-neutral-200 rounded border border-neutral-300 text-[11px] font-semibold text-neutral-700"
            >
              <KeyboardIcon className="w-3.5 h-3.5" />
              <span>كيبورد عربي</span>
            </button>
          )}

          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              className="p-1 hover:bg-neutral-100 rounded"
              title="تصغير العرض"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="font-mono text-xs w-10 text-center font-bold">{zoom}%</span>
            <button
              onClick={() => setZoom(Math.min(150, zoom + 10))}
              className="p-1 hover:bg-neutral-100 rounded"
              title="تكبير العرض"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* TABLE INSERTION MODAL */}
      {showTableModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-neutral-300 w-full max-w-md overflow-hidden text-right">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-200 bg-neutral-50">
              <div className="flex items-center gap-2">
                <TableIcon className="w-5 h-5 text-blue-700" />
                <h3 className="font-bold text-neutral-800 text-sm">إدراج جدول جديد</h3>
              </div>
              <button
                onClick={() => setShowTableModal(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex flex-col items-center justify-center p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="text-xs font-bold text-neutral-700 mb-2">
                  مرر لاختيار الحجم: {tableHoverRows || tableRows} صفوف × {tableHoverCols || tableCols} أعمدة
                </span>
                <div
                  onMouseLeave={() => {
                    setTableHoverRows(0);
                    setTableHoverCols(0);
                  }}
                  className="grid grid-cols-8 gap-1.5 p-2 bg-white rounded-lg border border-neutral-300"
                >
                  {Array.from({ length: 6 }).map((_, rIdx) => {
                    const rowNum = rIdx + 1;
                    return Array.from({ length: 8 }).map((_, cIdx) => {
                      const colNum = cIdx + 1;
                      const isHighlighted = (tableHoverRows || tableRows) >= rowNum && (tableHoverCols || tableCols) >= colNum;
                      return (
                        <div
                          key={`${rowNum}-${colNum}`}
                          onMouseEnter={() => {
                            setTableHoverRows(rowNum);
                            setTableHoverCols(colNum);
                          }}
                          onClick={() => {
                            setTableRows(rowNum);
                            setTableCols(colNum);
                            handleInsertTable(rowNum, colNum);
                          }}
                          className={`w-6 h-6 rounded-xs cursor-pointer border transition-colors ${
                            isHighlighted
                              ? 'bg-blue-600 border-blue-700'
                              : 'bg-neutral-100 border-neutral-300 hover:bg-blue-100'
                          }`}
                        />
                      );
                    });
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 text-xs font-semibold">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasHeaderRow}
                    onChange={(e) => setHasHeaderRow(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span>تضمين صف عناوين رئيسي</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isStripedTable}
                    onChange={(e) => setIsStripedTable(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span>خطوط متبادلة (Zebra)</span>
                </label>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-neutral-200 bg-neutral-50 flex justify-end gap-2">
              <button
                onClick={() => setShowTableModal(false)}
                className="px-4 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-lg text-xs font-semibold"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleInsertTable(tableRows, tableCols)}
                className="px-5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold"
              >
                إدراج الجدول
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH & REPLACE MODAL */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-neutral-300 w-full max-w-md overflow-hidden text-right">
            <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-200 bg-neutral-50">
              <div className="flex items-center gap-2 font-bold text-neutral-800 text-sm">
                <Search className="w-4 h-4 text-blue-700" />
                <span>بحث واستبدال في المستند</span>
              </div>
              <button
                onClick={() => setShowSearchModal(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">الكلمة المبحوث عنها:</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="أدخل كلمة للبحث عنها..."
                  className="w-full bg-neutral-50 border border-neutral-300 focus:border-blue-600 rounded px-3 py-2 text-xs outline-hidden"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">استبدال بـ:</label>
                <input
                  type="text"
                  value={replaceTerm}
                  onChange={(e) => setReplaceTerm(e.target.value)}
                  placeholder="الكلمة البديلة..."
                  className="w-full bg-neutral-50 border border-neutral-300 focus:border-blue-600 rounded px-3 py-2 text-xs outline-hidden"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleSearch}
                  className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded font-semibold"
                >
                  بحث ({matchCount} مطابقة)
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReplace(false)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
                  >
                    استبدال
                  </button>
                  <button
                    onClick={() => handleReplace(true)}
                    className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded font-bold"
                  >
                    استبدال الكل
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SPELL CHECK MODAL */}
      <SpellCheckModal
        isOpen={showSpellModal}
        onClose={() => setShowSpellModal(false)}
        issues={spellIssues}
        currentIndex={currentSpellIssueIndex}
        onSelectIssue={setCurrentSpellIssueIndex}
        onApplyCorrection={handleApplySpellCorrection}
        onIgnore={handleIgnoreSpellIssue}
        onIgnoreAll={() => {
          setSpellIssues([]);
          setShowSpellModal(false);
        }}
        onRecheck={() => {
          if (editorRef.current) {
            runSpellCheck(editorRef.current.innerHTML);
          }
        }}
      />

      {/* TABLE OF CONTENTS MODAL */}
      <TableOfContentsModal
        isOpen={showTocModal}
        onClose={() => setShowTocModal(false)}
        headings={detectedHeadings}
        onInsertToc={handleInsertTocDirectly}
      />
    </div>
  );
};
