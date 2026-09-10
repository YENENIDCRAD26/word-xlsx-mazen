import React, { useState } from 'react';
import { X, FileText, Table, Check, Sparkles, FolderOpen } from 'lucide-react';
import { OfficeMode, TemplateItem } from '../../types';
import { WORD_TEMPLATES, EXCEL_TEMPLATES } from '../../data/templates';

interface TemplateModalProps {
  currentMode: OfficeMode;
  onSelectWordTemplate: (template: TemplateItem) => void;
  onSelectExcelTemplate: (template: TemplateItem) => void;
  onClose: () => void;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({
  currentMode,
  onSelectWordTemplate,
  onSelectExcelTemplate,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<OfficeMode>(currentMode);

  const templates = activeTab === 'word' ? WORD_TEMPLATES : EXCEL_TEMPLATES;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl border border-neutral-300 w-full max-w-3xl overflow-hidden text-right flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-blue-700" />
            <div>
              <h3 className="font-bold text-neutral-900 text-base">مكتبة النماذج والقوالب الجاهزة</h3>
              <p className="text-xs text-neutral-500">اختر قالباً جاهزاً لبدء العمل فوراً بتنسيقات احترافية</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher inside Modal */}
        <div className="px-6 py-3 bg-neutral-100/70 border-b border-neutral-200 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('word')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'word'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-white text-neutral-700 hover:bg-neutral-200 border border-neutral-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>نماذج مستندات وورد (Word DOCX)</span>
          </button>

          <button
            onClick={() => setActiveTab('excel')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'excel'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-neutral-700 hover:bg-neutral-200 border border-neutral-300'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>نماذج جداول إكسيل (Excel XLSX)</span>
          </button>
        </div>

        {/* Templates Grid */}
        <div className="p-6 flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => {
                if (activeTab === 'word') {
                  onSelectWordTemplate(tpl);
                } else {
                  onSelectExcelTemplate(tpl);
                }
                onClose();
              }}
              className="group border border-neutral-200 hover:border-blue-500 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer bg-white flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    tpl.category === 'legal'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : tpl.category === 'business'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : tpl.category === 'official'
                      ? 'bg-blue-100 text-blue-900 border border-blue-300'
                      : 'bg-neutral-100 text-neutral-800'
                  }`}>
                    {tpl.thumbnailText}
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">
                    {activeTab === 'word' ? '.docx' : '.xlsx'}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-neutral-900 group-hover:text-blue-700 transition-colors mb-1.5">
                  {tpl.title}
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                  {tpl.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-neutral-100 text-xs font-semibold text-blue-700 group-hover:text-blue-800">
                <span>تطبيق هذا النموذج</span>
                <Check className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-neutral-800 hover:bg-neutral-900 text-white rounded-lg text-xs font-semibold"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
