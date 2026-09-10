import React from 'react';
import { X, BookOpen, Check, ListTree, Sparkles } from 'lucide-react';
import { TocItem } from '../../utils/tableOfContents';

interface TableOfContentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  headings: TocItem[];
  onInsertToc: () => void;
}

export const TableOfContentsModal: React.FC<TableOfContentsModalProps> = ({
  isOpen,
  onClose,
  headings,
  onInsertToc,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-neutral-300 w-full max-w-lg overflow-hidden text-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-200 bg-gradient-to-r from-emerald-50 to-neutral-50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-600 text-white rounded-lg">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-neutral-900 text-sm">إنشاء فهرس وجدول المحتويات التلقائي</h3>
              <p className="text-[11px] text-neutral-500">استخراج العناوين الرئيسية والفرعية (H1, H2, H3) بروابط تنقل داخلية</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 max-h-[60vh] overflow-y-auto">
          {headings.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                <ListTree className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-neutral-800 text-sm">لم يتم العثور على عناوين مهيأة</h4>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                لكي يتم إنشاء الفهرس تلقائياً، يرجى تحديد بعض فقرات المستند وتعيينها كـ <strong>عنوان 1 (H1)</strong> أو <strong>عنوان 2 (H2)</strong> من شريط التنسيق، ثم فتح الفهرس مرة أخرى.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-600 pb-2 border-b border-neutral-200">
                <span className="font-bold">معاينة شجرة العناوين المستخرجة ({headings.length} عناوين):</span>
                <span className="text-[11px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-semibold">جاهز للإدراج</span>
              </div>

              <div className="space-y-1.5 bg-neutral-50 p-3 rounded-xl border border-neutral-200 text-xs">
                {headings.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 py-1 px-2 rounded ${
                      item.level === 1 ? 'font-bold text-neutral-900 bg-white border border-neutral-200/60' : item.level === 2 ? 'mr-4 font-semibold text-neutral-700' : 'mr-8 text-neutral-600'
                    }`}
                  >
                    <span className="text-[10px] text-emerald-700 font-mono bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      H{item.level}
                    </span>
                    <span className="truncate">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
                <span className="font-bold block">ميزات الفهرس المولد:</span>
                <p className="text-[11px] leading-normal text-blue-800">
                  • يتضمن خطوطاً منقطة كلاسيكية رسمية تربط العنوان برقم القسم أو الصفحة.<br/>
                  • روابط مباشرة: عند النقر على أي بند في الفهرس، ينتقل القارئ فوراً لموضعه في الوثيقة.<br/>
                  • يمكن تحديثه في أي وقت مع استمرار التعديل.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-lg text-xs font-semibold"
          >
            إلغاء
          </button>
          <button
            disabled={headings.length === 0}
            onClick={() => {
              onInsertToc();
              onClose();
            }}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Check className="w-4 h-4" />
            <span>إدراج الفهرس في المستند الآن</span>
          </button>
        </div>
      </div>
    </div>
  );
};
