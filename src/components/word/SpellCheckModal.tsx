import React from 'react';
import { X, CheckCircle, AlertCircle, ArrowLeft, ArrowRight, Wand2, RefreshCw } from 'lucide-react';
import { SpellIssue } from '../../utils/arabicSpellCheck';

interface SpellCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  issues: SpellIssue[];
  currentIndex: number;
  onSelectIssue: (index: number) => void;
  onApplyCorrection: (issue: SpellIssue, suggestion: string) => void;
  onIgnore: (issue: SpellIssue) => void;
  onIgnoreAll: () => void;
  onRecheck: () => void;
}

export const SpellCheckModal: React.FC<SpellCheckModalProps> = ({
  isOpen,
  onClose,
  issues,
  currentIndex,
  onSelectIssue,
  onApplyCorrection,
  onIgnore,
  onIgnoreAll,
  onRecheck,
}) => {
  if (!isOpen) return null;

  const currentIssue = issues[currentIndex];

  const getIssueBadge = (type: SpellIssue['type']) => {
    switch (type) {
      case 'hamza':
        return <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded">همزة قطع / وصل</span>;
      case 'taa_marbuta':
        return <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2 py-0.5 rounded">تاء مربوطة / هاء</span>;
      case 'yaa_maqsura':
        return <span className="bg-purple-100 text-purple-800 text-[11px] font-bold px-2 py-0.5 rounded">ياء / ألف مقصورة</span>;
      default:
        return <span className="bg-rose-100 text-rose-800 text-[11px] font-bold px-2 py-0.5 rounded">خطأ شائع / تنوين</span>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-neutral-300 w-full max-w-lg overflow-hidden text-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-200 bg-gradient-to-r from-rose-50 to-neutral-50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-rose-600 text-white rounded-lg">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-neutral-900 text-sm">التدقيق الإملائي واللغوي العربي</h3>
              <p className="text-[11px] text-neutral-500">فحص وتصحيح الهمزات والتاء المربوطة والأخطاء الشائعة</p>
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
        <div className="p-5 flex-1">
          {issues.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-neutral-800 text-base">المستند سليم لغوياً!</h4>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                لم يتم العثور على أي أخطاء إملائية مسجلة في القاموس داخل محتوى المستند الحالي.
              </p>
              <button
                onClick={onRecheck}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-semibold"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>إعادة الفحص</span>
              </button>
            </div>
          ) : currentIssue ? (
            <div className="space-y-4">
              {/* Progress counter */}
              <div className="flex items-center justify-between text-xs text-neutral-500 pb-2 border-b border-neutral-100">
                <span>
                  خطأ <strong className="text-neutral-800">{currentIndex + 1}</strong> من إجمالي <strong className="text-neutral-800">{issues.length}</strong>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={currentIndex === 0}
                    onClick={() => onSelectIssue(currentIndex - 1)}
                    className="p-1 hover:bg-neutral-100 rounded disabled:opacity-30 cursor-pointer"
                    title="السابق"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    disabled={currentIndex === issues.length - 1}
                    onClick={() => onSelectIssue(currentIndex + 1)}
                    className="p-1 hover:bg-neutral-100 rounded disabled:opacity-30 cursor-pointer"
                    title="التالي"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Current Misspelling Card */}
              <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-rose-700 font-semibold">الكلمة المكتوبة:</span>
                  {getIssueBadge(currentIssue.type)}
                </div>
                <div className="font-bold text-lg text-rose-900 font-sans tracking-wide">
                  "{currentIssue.word}"
                </div>
                <p className="text-[11px] text-rose-600">
                  سبب التنبيه: {currentIssue.reason}
                </p>
              </div>

              {/* Suggestions */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-2">
                  الاقتراحات البديلة (انقر لتصحيح الكلمة فورياً):
                </label>
                <div className="space-y-1.5">
                  {currentIssue.suggestions.map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => onApplyCorrection(currentIssue, sug)}
                      className="w-full flex items-center justify-between px-4 py-2.5 bg-neutral-50 hover:bg-emerald-50 hover:border-emerald-400 border border-neutral-200 rounded-xl text-right transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Wand2 className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-neutral-900 group-hover:text-emerald-800 text-sm">
                          {sug}
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded font-medium group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        تصحيح
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onIgnore(currentIssue)}
                    className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs font-medium"
                  >
                    تجاهل هذه المرة
                  </button>
                  <button
                    onClick={onIgnoreAll}
                    className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs font-medium"
                  >
                    تجاهل الكل
                  </button>
                </div>
                <button
                  onClick={onRecheck}
                  className="p-1.5 text-neutral-500 hover:text-neutral-800 rounded-lg hover:bg-neutral-100"
                  title="إعادة فحص النص"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-200 bg-neutral-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-1.5 bg-neutral-800 hover:bg-neutral-900 text-white rounded-lg text-xs font-semibold"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
