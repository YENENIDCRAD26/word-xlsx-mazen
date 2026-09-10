/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { OfficeMode, DocumentState, WorkbookState, TemplateItem } from './types';
import { HeaderNav } from './components/common/HeaderNav';
import { WordEditor } from './components/word/WordEditor';
import { ExcelEditor } from './components/excel/ExcelEditor';
import { TemplateModal } from './components/common/TemplateModal';
import { downloadAsDocx, importDocxFile, importTextFile } from './utils/docxHandler';
import { exportWorkbookToXlsx, importXlsxFile, createEmptySheet } from './utils/excelEngine';
import { exportWordDocumentToPdf, exportExcelSheetToPdf } from './utils/pdfExporter';
import { WORD_TEMPLATES, EXCEL_TEMPLATES } from './data/templates';
import { ArabicVirtualKeyboard } from './components/common/ArabicVirtualKeyboard';
import { CheckCircle, AlertCircle } from 'lucide-react';

const STORAGE_KEY_WORD = 'office_pro_word_doc_v1';
const STORAGE_KEY_EXCEL = 'office_pro_excel_wb_v1';

export default function App() {
  const [mode, setMode] = useState<OfficeMode>('word');
  const [showTemplatesModal, setShowTemplatesModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [saveStatus, setSaveStatus] = useState<'saving' | 'saved'>('saved');
  const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean>(false);

  // Hidden File input ref for opening .docx / .xlsx files
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize Word Document (default to the authentic legal petition in user screenshot)
  const [wordDoc, setWordDoc] = useState<DocumentState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WORD);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not load saved word doc:', e);
    }
    const defTpl = WORD_TEMPLATES[0];
    return {
      id: 'doc_' + Date.now(),
      title: defTpl.data.title,
      contentHtml: defTpl.data.contentHtml,
      fontFamily: 'Amiri',
      fontSize: '14',
      paperSize: 'A4',
      orientation: 'portrait',
      margins: 'normal',
      zoom: 100,
      lastModified: Date.now(),
    };
  });

  // Initialize Excel Workbook (default to Estate & Claim template)
  const [workbook, setWorkbook] = useState<WorkbookState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EXCEL);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not load saved excel wb:', e);
    }
    const defTpl = EXCEL_TEMPLATES[0];
    const sheets = defTpl.data.createSheets();
    return {
      id: 'wb_' + Date.now(),
      title: defTpl.data.title,
      activeSheetId: sheets[0].id,
      sheets,
      lastModified: Date.now(),
    };
  });

  // Show temporary toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Auto-save Word Document
  useEffect(() => {
    setIsSaved(false);
    setSaveStatus('saving');
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY_WORD, JSON.stringify(wordDoc));
        setIsSaved(true);
        setSaveStatus('saved');
      } catch (err) {
        console.warn('Auto-save error:', err);
      }
    }, 600);
    return () => clearTimeout(timeout);
  }, [wordDoc]);

  // Auto-save Excel Workbook
  useEffect(() => {
    setIsSaved(false);
    setSaveStatus('saving');
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY_EXCEL, JSON.stringify(workbook));
        setIsSaved(true);
        setSaveStatus('saved');
      } catch (err) {
        console.warn('Auto-save error:', err);
      }
    }, 600);
    return () => clearTimeout(timeout);
  }, [workbook]);

  // Handle Export based on active mode (Native DOCX / XLSX)
  const handleExport = async () => {
    if (mode === 'word') {
      try {
        showToast('جارٍ تجهيز وتحميل ملف Word (.docx)...');
        await downloadAsDocx(wordDoc.title, wordDoc.contentHtml);
        showToast('تم تصدير ملف DOCX بنجاح!');
      } catch (err) {
        console.error(err);
        showToast('تعذر تصدير ملف Word، يرجى المحاولة ثانية.');
      }
    } else {
      try {
        showToast('جارٍ إنشاء وتحميل مصنف Excel (.xlsx)...');
        exportWorkbookToXlsx(workbook);
        showToast('تم تصدير مصنف XLSX بنجاح!');
      } catch (err) {
        console.error(err);
        showToast('تعذر تصدير ملف Excel، يرجى المحاولة ثانية.');
      }
    }
  };

  // Handle Direct PDF Export using jsPDF
  const handleExportPdf = async () => {
    try {
      showToast('جارٍ تحويل وتصدير ملف PDF عالي الجودة عبر jsPDF...');
      if (mode === 'word') {
        await exportWordDocumentToPdf(wordDoc.title);
      } else {
        await exportExcelSheetToPdf(workbook);
      }
      showToast('تم تصدير ملف PDF بنجاح باستخدام jsPDF!');
    } catch (err) {
      console.error('PDF export error:', err);
      showToast('تعذر إنشاء ملف PDF، يرجى التأكد من محتوى الصفحة وإعادة المحاولة.');
    }
  };

  // Open file selector
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // Handle file import
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();

    if (mode === 'word') {
      if (extension === 'docx') {
        try {
          showToast('جارٍ قراءة واستيراد مستند DOCX...');
          const html = await importDocxFile(file);
          setWordDoc({
            ...wordDoc,
            title: file.name.replace(/\.[^/.]+$/, ''),
            contentHtml: html,
            lastModified: Date.now(),
          });
          showToast('تم فتح واستيراد ملف DOCX بنجاح!');
        } catch (err) {
          console.error(err);
          showToast('حدث خطأ أثناء قراءة ملف DOCX.');
        }
      } else if (extension === 'txt') {
        try {
          const html = await importTextFile(file);
          setWordDoc({
            ...wordDoc,
            title: file.name.replace(/\.[^/.]+$/, ''),
            contentHtml: html,
            lastModified: Date.now(),
          });
          showToast('تم استيراد النص بنجاح!');
        } catch (err) {
          showToast('حدث خطأ أثناء قراءة الملف النصي.');
        }
      } else {
        showToast('يرجى اختيار ملف بصيغة .docx أو .txt في محرر النصوص');
      }
    } else {
      // Excel mode
      if (extension === 'xlsx' || extension === 'xls' || extension === 'csv') {
        try {
          showToast('جارٍ قراءة مصنف Excel وبناء الجداول والصيغ...');
          const importedWb = await importXlsxFile(file);
          setWorkbook(importedWb);
          showToast(`تم استيراد ${importedWb.sheets.length} ورقة عمل بنجاح!`);
        } catch (err) {
          console.error(err);
          showToast('حدث خطأ أثناء قراءة ملف Excel.');
        }
      } else {
        showToast('يرجى اختيار ملف بصيغة .xlsx أو .csv في معالج الجداول');
      }
    }
  };

  // Manual save trigger
  const handleSave = () => {
    if (mode === 'word') {
      localStorage.setItem(STORAGE_KEY_WORD, JSON.stringify(wordDoc));
    } else {
      localStorage.setItem(STORAGE_KEY_EXCEL, JSON.stringify(workbook));
    }
    setIsSaved(true);
    showToast('تم الحفظ المحلي بنجاح!');
  };

  // Print document or sheet
  const handlePrint = () => {
    window.print();
  };

  // Reset document to blank
  const handleReset = () => {
    if (!window.confirm('هل ترغب حقاً في فتح مستند فارغ جديد؟')) return;

    if (mode === 'word') {
      const blankTpl = WORD_TEMPLATES.find(t => t.id === 'blank_word') || WORD_TEMPLATES[0];
      setWordDoc({
        id: 'doc_' + Date.now(),
        title: 'مستند جديد.docx',
        contentHtml: blankTpl.data.contentHtml,
        fontFamily: 'Cairo',
        fontSize: '14',
        paperSize: 'A4',
        orientation: 'portrait',
        margins: 'normal',
        zoom: 100,
        lastModified: Date.now(),
      });
    } else {
      const blankSheet = createEmptySheet('ورقة 1');
      setWorkbook({
        id: 'wb_' + Date.now(),
        title: 'مصنف جديد.xlsx',
        activeSheetId: blankSheet.id,
        sheets: [blankSheet],
        lastModified: Date.now(),
      });
    }
    showToast('تم إنشاء مستند فارغ جديد.');
  };

  // Select Word template
  const handleSelectWordTemplate = (tpl: TemplateItem) => {
    setMode('word');
    setWordDoc({
      ...wordDoc,
      title: tpl.data.title,
      contentHtml: tpl.data.contentHtml,
      lastModified: Date.now(),
    });
    showToast(`تم تطبيق نموذج: ${tpl.title}`);
  };

  // Select Excel template
  const handleSelectExcelTemplate = (tpl: TemplateItem) => {
    setMode('excel');
    const sheets = tpl.data.createSheets();
    setWorkbook({
      ...workbook,
      title: tpl.data.title,
      activeSheetId: sheets[0].id,
      sheets,
      lastModified: Date.now(),
    });
    showToast(`تم تطبيق نموذج: ${tpl.title}`);
  };

  // Virtual Keyboard input receiver
  const handleVirtualKeyPress = (key: string, isAction: boolean) => {
    if (mode === 'word') {
      if (isAction) {
        if (key === 'Backspace') {
          document.execCommand('delete');
        } else if (key === 'Enter') {
          document.execCommand('insertParagraph');
        } else if (key === 'Tab') {
          document.execCommand('insertText', false, '    ');
        } else if (key === 'Ctrl+B') {
          document.execCommand('bold');
        } else if (key === 'Ctrl+I') {
          document.execCommand('italic');
        } else if (key === 'Ctrl+U') {
          document.execCommand('underline');
        } else if (key === 'Ctrl+Z') {
          document.execCommand('undo');
        } else if (key === 'Ctrl+A') {
          document.execCommand('selectAll');
        }
      } else {
        document.execCommand('insertText', false, key);
      }
    } else {
      // Excel mode: send to active input if focused, or update formula bar
      const activeInput = document.getElementById('formula-bar-input') as HTMLInputElement | null;
      if (activeInput) {
        if (isAction) {
          if (key === 'Backspace') {
            activeInput.value = activeInput.value.slice(0, -1);
            activeInput.dispatchEvent(new Event('input', { bubbles: true }));
          } else if (key === 'Enter') {
            activeInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
          }
        } else {
          const start = activeInput.selectionStart || activeInput.value.length;
          const end = activeInput.selectionEnd || activeInput.value.length;
          const val = activeInput.value;
          activeInput.value = val.slice(0, start) + key + val.slice(end);
          activeInput.setSelectionRange(start + key.length, start + key.length);
          activeInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100 text-neutral-900" dir="rtl">
      {/* Hidden file input for opening DOCX / XLSX */}
      <input
        ref={fileInputRef}
        type="file"
        accept={mode === 'word' ? '.docx,.doc,.txt' : '.xlsx,.xls,.csv'}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Main Suite Top Navigation Bar */}
      <HeaderNav
        mode={mode}
        onModeChange={setMode}
        title={mode === 'word' ? wordDoc.title : workbook.title}
        onTitleChange={(newTitle) => {
          if (mode === 'word') {
            setWordDoc(prev => ({ ...prev, title: newTitle }));
          } else {
            setWorkbook(prev => ({ ...prev, title: newTitle }));
          }
        }}
        onExport={handleExport}
        onExportPdf={handleExportPdf}
        onImportClick={handleImportClick}
        onSave={handleSave}
        onPrint={handlePrint}
        onOpenTemplates={() => setShowTemplatesModal(true)}
        onReset={handleReset}
        isSaved={isSaved}
        saveStatus={saveStatus}
        onToggleKeyboard={() => setIsKeyboardOpen(!isKeyboardOpen)}
        isKeyboardOpen={isKeyboardOpen}
      />

      {/* Active Editor Module */}
      <main className="flex-1 relative overflow-hidden">
        {mode === 'word' ? (
          <WordEditor
            documentState={wordDoc}
            onChange={setWordDoc}
            onOpenTemplates={() => setShowTemplatesModal(true)}
            onToggleKeyboard={() => setIsKeyboardOpen(!isKeyboardOpen)}
            isKeyboardOpen={isKeyboardOpen}
            saveStatus={saveStatus}
            onExportPdf={handleExportPdf}
          />
        ) : (
          <ExcelEditor
            workbook={workbook}
            onChange={setWorkbook}
            onOpenTemplates={() => setShowTemplatesModal(true)}
            onToggleKeyboard={() => setIsKeyboardOpen(!isKeyboardOpen)}
            isKeyboardOpen={isKeyboardOpen}
            saveStatus={saveStatus}
            onExportPdf={handleExportPdf}
          />
        )}
      </main>

      {/* Arabic Virtual Keyboard Overlay */}
      <ArabicVirtualKeyboard
        isOpen={isKeyboardOpen}
        onClose={() => setIsKeyboardOpen(false)}
        onKeyPress={handleVirtualKeyPress}
      />

      {/* Templates Library Modal */}
      {showTemplatesModal && (
        <TemplateModal
          currentMode={mode}
          onSelectWordTemplate={handleSelectWordTemplate}
          onSelectExcelTemplate={handleSelectExcelTemplate}
          onClose={() => setShowTemplatesModal(false)}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 bg-neutral-900/90 text-white text-xs px-4 py-2.5 rounded-lg shadow-xl backdrop-blur-xs flex items-center gap-2 animate-fade-in border border-neutral-700">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
