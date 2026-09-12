import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Table as TableIcon,
  Sliders,
  Download,
  Printer,
  X,
  ChevronRight,
  ChevronLeft,
  Sigma,
  Bold,
  Italic,
  Underline,
  Palette,
  Type,
  AlignRight,
  AlignCenter,
  AlignLeft,
  Plus,
  Trash2,
  Layers,
  FileSpreadsheet,
  Check,
  ArrowUpDown,
  Filter,
  Eye
} from 'lucide-react';
import { CellData, ExcelSheet, ExcelState } from '../../types';
import { evaluateFormula, formatCellValue } from '../../utils/excelCalculations';

interface ExcelSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  excelState: ExcelState;
  onUpdateExcelState: (updater: (prev: ExcelState) => ExcelState) => void;
  activeSheet: ExcelSheet;
  selectedCell: string;
  onSelectCell: (addr: string) => void;
  onUpdateCell: (addr: string, partial: Partial<CellData>) => void;
  onInsertRow: () => void;
  onDeleteRow: () => void;
  onInsertCol: () => void;
  onDeleteCol: () => void;
  onFreezePanes: (type: 'row' | 'col' | 'none') => void;
  onExportXlsx: () => void;
  onExportCsv: () => void;
  onPrint: () => void;
}

export const ExcelSimulatorModal: React.FC<ExcelSimulatorModalProps> = ({
  isOpen,
  onClose,
  excelState,
  onUpdateExcelState,
  activeSheet,
  selectedCell,
  onSelectCell,
  onUpdateCell,
  onInsertRow,
  onDeleteRow,
  onInsertCol,
  onDeleteCol,
  onFreezePanes,
  onExportXlsx,
  onExportCsv,
  onPrint,
}) => {
  const [activeTab, setActiveTab] = useState<'simulator' | 'cell_controls' | 'table_controls' | 'templates'>('simulator');
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [targetCell, setTargetCell] = useState(selectedCell || 'B2');
  const [cellValueInput, setCellValueInput] = useState('');
  const [cellFormulaInput, setCellFormulaInput] = useState('');

  // Sync cell inputs when target cell changes
  useEffect(() => {
    if (activeSheet?.data[targetCell]) {
      const cell = activeSheet.data[targetCell];
      setCellValueInput(cell.value || '');
      setCellFormulaInput(cell.formula || '');
    } else {
      setCellValueInput('');
      setCellFormulaInput('');
    }
  }, [targetCell, activeSheet]);

  if (!isOpen) return null;

  const currentCellData = activeSheet?.data[targetCell] || {};

  // Simulation Steps
  const simulationSteps = [
    {
      id: 1,
      title: '1. إنشاء ترويسة الجدول وتحديد الهوية المؤسسية',
      desc: 'بناء صف العناوين الرئيسي (م، بيان المطالبة/البند، المستحق له، المبلغ المقدر، حالة التوثيق) مع تعبئة خضراء زمردية رسمية.',
      action: () => {
        onUpdateExcelState((prev) => {
          const updatedSheets = prev.sheets.map((s) => {
            if (s.id !== prev.activeSheetId) return s;
            return {
              ...s,
              data: {
                ...s.data,
                'A1': { value: 'م', bold: true, align: 'center', bg: '#15803d', color: '#ffffff', borderStyle: 'all', borderColor: '#166534' },
                'B1': { value: 'بيان المطالبة / البند الشرعي', bold: true, align: 'center', bg: '#166534', color: '#ffffff', borderStyle: 'all', borderColor: '#166534' },
                'C1': { value: 'المستحق له / الجهة', bold: true, align: 'center', bg: '#166534', color: '#ffffff', borderStyle: 'all', borderColor: '#166534' },
                'D1': { value: 'المبلغ المقدر (ريال)', bold: true, align: 'center', bg: '#166534', color: '#ffffff', borderStyle: 'all', borderColor: '#166534' },
                'E1': { value: 'الذهب (جرام 21)', bold: true, align: 'center', bg: '#166534', color: '#ffffff', borderStyle: 'all', borderColor: '#166534' },
                'F1': { value: 'حالة التوثيق والاعتماد', bold: true, align: 'center', bg: '#166534', color: '#ffffff', borderStyle: 'all', borderColor: '#166534' },
              },
            };
          });
          return { ...prev, sheets: updatedSheets };
        });
      },
    },
    {
      id: 2,
      title: '2. إدراج بنود التركات والمصاريف القضائية',
      desc: 'إدخال البيانات التفصيلية للبنود: المهر المؤخر، تكاليف علاج المورث، تكاليف زواج القاصر، وأمانات شراء البصائر.',
      action: () => {
        onUpdateExcelState((prev) => {
          const updatedSheets = prev.sheets.map((s) => {
            if (s.id !== prev.activeSheetId) return s;
            return {
              ...s,
              data: {
                ...s.data,
                'A2': { value: '1', align: 'center', borderStyle: 'all' },
                'B2': { value: 'قرضة ذهب بذمة المورث لزوجته', align: 'right', borderStyle: 'all' },
                'C2': { value: 'والدتنا نبات عبد الله', align: 'right', borderStyle: 'all' },
                'D2': { value: '0', format: 'currency_yer', align: 'left', borderStyle: 'all' },
                'E2': { value: '21.50', format: 'number', align: 'left', borderStyle: 'all' },
                'F2': { value: 'مثبت بإقرار الورثة', align: 'center', borderStyle: 'all', color: '#166534', bold: true },

                'A3': { value: '2', align: 'center', borderStyle: 'all' },
                'B3': { value: 'المهر المؤخر بذمة المورث', align: 'right', borderStyle: 'all' },
                'C3': { value: 'الزوجة نبات عبد الله', align: 'right', borderStyle: 'all' },
                'D3': { value: '5000000', format: 'currency_yer', align: 'left', borderStyle: 'all' },
                'E3': { value: '0.00', format: 'number', align: 'left', borderStyle: 'all' },
                'F3': { value: 'حجة نكاح شرعي معتمدة', align: 'center', borderStyle: 'all', color: '#166534', bold: true },

                'A4': { value: '3', align: 'center', borderStyle: 'all' },
                'B4': { value: 'تكاليف علاج المورث والدفن', align: 'right', borderStyle: 'all' },
                'C4': { value: 'مناف وإخوانه', align: 'right', borderStyle: 'all' },
                'D4': { value: '850000', format: 'currency_yer', align: 'left', borderStyle: 'all' },
                'E4': { value: '0.00', format: 'number', align: 'left', borderStyle: 'all' },
                'F4': { value: 'سندات ومصروفات رسمية', align: 'center', borderStyle: 'all', color: '#1e40af' },

                'A5': { value: '4', align: 'center', borderStyle: 'all' },
                'B5': { value: 'تكاليف زواج القاصر أسوة بالمدعى عليه', align: 'right', borderStyle: 'all' },
                'C5': { value: 'الابن القاصر', align: 'right', borderStyle: 'all' },
                'D5': { value: '3000000', format: 'currency_yer', align: 'left', borderStyle: 'all' },
                'E5': { value: '0.00', format: 'number', align: 'left', borderStyle: 'all' },
                'F5': { value: 'تقدير عرفي وقضائي', align: 'center', borderStyle: 'all' },

                'A6': { value: '5', align: 'center', borderStyle: 'all' },
                'B6': { value: 'أمانة أثمان شراء المكتسبات المحررة', align: 'right', borderStyle: 'all' },
                'C6': { value: 'جميع الورثة الشرعيين', align: 'right', borderStyle: 'all' },
                'D6': { value: '1800000', format: 'currency_yer', align: 'left', borderStyle: 'all' },
                'E6': { value: '0.00', format: 'number', align: 'left', borderStyle: 'all' },
                'F6': { value: 'بموجب الإقرار الخطي', align: 'center', borderStyle: 'all' },
              },
            };
          });
          return { ...prev, sheets: updatedSheets };
        });
      },
    },
    {
      id: 3,
      title: '3. تطبيق أدوات الحدود والتنسيق المالي (Borders & Styling)',
      desc: 'إحاطة الخلايا بشبكة حدود رسمية واضحة، وتخصيص خلفيات تبادلية ناعمة لتسهيل القراءة وتدقيق الحسابات.',
      action: () => {
        onUpdateExcelState((prev) => {
          const updatedSheets = prev.sheets.map((s) => {
            if (s.id !== prev.activeSheetId) return s;
            const newData = { ...s.data };
            ['A2', 'A3', 'A4', 'A5', 'A6'].forEach((k) => {
              if (newData[k]) newData[k] = { ...newData[k], bg: '#f8fafc', bold: true, align: 'center' };
            });
            ['B2', 'B4', 'B6'].forEach((k) => {
              if (newData[k]) newData[k] = { ...newData[k], bg: '#f8fafc' };
            });
            return { ...s, data: newData };
          });
          return { ...prev, sheets: updatedSheets };
        });
      },
    },
    {
      id: 4,
      title: '4. تنفيذ الصيغ والدوال الرياضية التلقائية (=SUM)',
      desc: 'إدراج دالة الجمع التلقائي لحساب إجمالي المبالغ النقدية =SUM(D2:D6) وإجمالي الذهب =SUM(E2:E6) مع سطر مجاميع بارز.',
      action: () => {
        onUpdateExcelState((prev) => {
          const updatedSheets = prev.sheets.map((s) => {
            if (s.id !== prev.activeSheetId) return s;
            return {
              ...s,
              data: {
                ...s.data,
                'A7': { value: '∑', bold: true, align: 'center', bg: '#e0f2fe', color: '#0369a1', borderStyle: 'double_bottom' },
                'B7': { value: 'الإجمالي العام للمطالبات والديون', bold: true, align: 'right', bg: '#f0f9ff', color: '#0369a1', borderStyle: 'double_bottom' },
                'C7': { value: 'المجموع الكلي المعتمد', bold: true, align: 'center', bg: '#f0f9ff', color: '#0369a1', borderStyle: 'double_bottom' },
                'D7': { formula: '=SUM(D2:D6)', format: 'currency_yer', bold: true, align: 'left', bg: '#e0f2fe', color: '#0369a1', borderStyle: 'double_bottom' },
                'E7': { formula: '=SUM(E2:E6)', format: 'number', bold: true, align: 'left', bg: '#e0f2fe', color: '#0369a1', borderStyle: 'double_bottom' },
                'F7': { value: 'مطابق للمستندات الشرعية', bold: true, align: 'center', bg: '#f0f9ff', color: '#0369a1', borderStyle: 'double_bottom' },
              },
            };
          });
          return { ...prev, sheets: updatedSheets };
        });
      },
    },
    {
      id: 5,
      title: '5. تجميد الألواح وتنسيق الطباعة (Freeze Panes)',
      desc: 'تجميد صف الترويسة العلوي وعمود المسلسل لضمان ثبات العناوين أثناء تمرير الجداول الطويلة، وضبط أبعاد الطباعة.',
      action: () => {
        onFreezePanes('row');
      },
    },
    {
      id: 6,
      title: '6. إدراج أختام الاعتماد والمصادقة القضائية',
      desc: 'إدراج أختام التصديق الرسمي "✓ معتمد رسمياً" و"⚖ مصادق عليه قضائياً" لتوثيق المصنف القانوني قبل التصدير.',
      action: () => {
        onUpdateExcelState((prev) => {
          const updatedSheets = prev.sheets.map((s) => {
            if (s.id !== prev.activeSheetId) return s;
            return {
              ...s,
              data: {
                ...s.data,
                'B8': { value: '✓ معتمد ومصادق عليه من مأمور التفليس والمحكمة', bold: true, align: 'center', bg: '#dcfce7', color: '#166534', borderStyle: 'box' },
                'D8': { value: 'ختم الدائرة القضائية ⚖', bold: true, align: 'center', bg: '#dbeafe', color: '#1e40af', borderStyle: 'box' },
              },
            };
          });
          return { ...prev, sheets: updatedSheets };
        });
      },
    },
  ];

  // Auto simulation player
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (simulationRunning) {
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < simulationSteps.length - 1) {
            const nextIdx = prev + 1;
            simulationSteps[nextIdx].action();
            setCompletedSteps((done) => [...done, nextIdx]);
            return nextIdx;
          } else {
            setSimulationRunning(false);
            return prev;
          }
        });
      }, 1500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [simulationRunning]);

  const handleStartSimulation = () => {
    setCompletedSteps([0]);
    setCurrentStepIndex(0);
    simulationSteps[0].action();
    setSimulationRunning(true);
  };

  const handleExecuteSingleStep = (idx: number) => {
    setCurrentStepIndex(idx);
    simulationSteps[idx].action();
    if (!completedSteps.includes(idx)) {
      setCompletedSteps((prev) => [...prev, idx]);
    }
  };

  const handleApplyAllSteps = () => {
    simulationSteps.forEach((step, idx) => {
      step.action();
    });
    setCompletedSteps(simulationSteps.map((_, i) => i));
    setCurrentStepIndex(simulationSteps.length - 1);
    setSimulationRunning(false);
  };

  const handleResetDocument = () => {
    onUpdateExcelState((prev) => {
      const updatedSheets = prev.sheets.map((s) => {
        if (s.id !== prev.activeSheetId) return s;
        return {
          ...s,
          data: {},
        };
      });
      return { ...prev, sheets: updatedSheets };
    });
    setCompletedSteps([]);
    setCurrentStepIndex(0);
    setSimulationRunning(false);
  };

  // Cell Formatting Quick Handlers
  const handleUpdateCurrentCell = (partial: Partial<CellData>) => {
    onUpdateCell(targetCell, partial);
  };

  const handleSaveCellValue = () => {
    onUpdateCell(targetCell, {
      value: cellValueInput,
      formula: cellFormulaInput ? (cellFormulaInput.startsWith('=') ? cellFormulaInput : `=${cellFormulaInput}`) : undefined,
    });
  };

  // Color Palettes
  const cellBgColors = [
    { name: 'أبيض', value: '#ffffff' },
    { name: 'زمردي داكن', value: '#15803d' },
    { name: 'زمردي فاتح', value: '#dcfce7' },
    { name: 'أزرق ملكي', value: '#1e3a8a' },
    { name: 'سماوي فاتح', value: '#e0f2fe' },
    { name: 'كهرماني دافئ', value: '#fef3c7' },
    { name: 'أحمر تنبيه', value: '#fee2e2' },
    { name: 'رمادي هادئ', value: '#f1f5f9' },
  ];

  const cellTextColors = [
    { name: 'أسود كربوني', value: '#0f172a' },
    { name: 'أبيض ناصع', value: '#ffffff' },
    { name: 'أخضر داكن', value: '#166534' },
    { name: 'أزرق داكن', value: '#1e40af' },
    { name: 'أحمر بارز', value: '#b91c1c' },
    { name: 'بني ذهبي', value: '#92400e' },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto select-none"
      dir="rtl"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-5xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Modal Top Header Bar */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white px-5 py-3 flex items-center justify-between border-b border-emerald-700">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-700/60 rounded-lg border border-emerald-500/40">
              <FileSpreadsheet className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  محاكي ومعالج جداول إكسل PRO
                </h2>
                <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-1.5 py-0.5 rounded">
                  Excel Simulator ⚡
                </span>
              </div>
              <p className="text-xs text-emerald-100">
                محاكاة وظائف التحكم، التحرير، تنسيق الخلايا والجداول، والدوال التلقائية للمستند
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onExportXlsx}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تصدير مصنف (.xlsx)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-700/60 rounded-lg transition"
              title="إغلاق المحاكي"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Tab Navigation */}
        <div className="flex items-center px-4 bg-slate-100 border-b border-slate-200 gap-2 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition ${
              activeTab === 'simulator'
                ? 'border-emerald-600 text-emerald-700 bg-white shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-emerald-700'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>محاكاة الوظائف التلقائية (Step-by-Step)</span>
          </button>

          <button
            onClick={() => setActiveTab('cell_controls')}
            className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition ${
              activeTab === 'cell_controls'
                ? 'border-emerald-600 text-emerald-700 bg-white shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-emerald-700'
            }`}
          >
            <Sliders className="w-4 h-4 text-blue-600" />
            <span>أدوات تحكم الخلية ({targetCell})</span>
          </button>

          <button
            onClick={() => setActiveTab('table_controls')}
            className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition ${
              activeTab === 'table_controls'
                ? 'border-emerald-600 text-emerald-700 bg-white shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-emerald-700'
            }`}
          >
            <TableIcon className="w-4 h-4 text-teal-600" />
            <span>أدوات التحكم بالجدول والمستند</span>
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition ${
              activeTab === 'templates'
                ? 'border-emerald-600 text-emerald-700 bg-white shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-emerald-700'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-600" />
            <span>نماذج وقوالب جاهزة للمصنف</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
          
          {/* ================= 1. SIMULATOR TAB ================= */}
          {activeTab === 'simulator' && (
            <div className="space-y-6">
              {/* Simulation Controls Dashboard */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {!simulationRunning ? (
                    <button
                      onClick={handleStartSimulation}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs active:scale-95"
                    >
                      <Play className="w-4 h-4" />
                      <span>بدء المحاكاة التلقائية</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setSimulationRunning(false)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shadow-xs"
                    >
                      <Pause className="w-4 h-4" />
                      <span>إيقاف مؤقت</span>
                    </button>
                  )}

                  <button
                    onClick={handleApplyAllSteps}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold transition"
                  >
                    <Check className="w-3.5 h-3.5 text-blue-600" />
                    <span>تطبيق فوري لكافة الوظائف ⚡</span>
                  </button>

                  <button
                    onClick={handleResetDocument}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                    title="تفريغ الجدول لإعادة المحاكاة من الصفر"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>إعادة ضبط</span>
                  </button>
                </div>

                {/* Progress Indicators */}
                <div className="flex items-center gap-3">
                  <div className="text-xs text-slate-500 font-semibold">
                    الخطوة: <span className="text-emerald-700 font-bold font-mono">{currentStepIndex + 1}</span> من {simulationSteps.length}
                  </div>
                  <div className="w-28 bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full transition-all duration-300"
                      style={{ width: `${((completedSteps.length) / simulationSteps.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Steps Timeline Grid */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  خطوات المحاكاة المبرمجة لمحرر ومعالج إكسل:
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {simulationSteps.map((step, idx) => {
                    const isCompleted = completedSteps.includes(idx);
                    const isCurrent = currentStepIndex === idx;

                    return (
                      <div
                        key={step.id}
                        onClick={() => handleExecuteSingleStep(idx)}
                        className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start gap-3 relative ${
                          isCurrent
                            ? 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                            : isCompleted
                            ? 'bg-white border-emerald-200'
                            : 'bg-white border-slate-200 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isCompleted ? (
                            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                              ✓
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-300 text-slate-600 flex items-center justify-center font-bold text-xs">
                              {idx + 1}
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-900 truncate">
                              {step.title}
                            </h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleExecuteSingleStep(idx);
                              }}
                              className="text-[10px] bg-slate-100 hover:bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded transition"
                            >
                              تنفيذ الآن
                            </button>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Current Active Sheet Live Preview Snippet */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <TableIcon className="w-4 h-4 text-emerald-600" />
                    <span>معاينة حية لجدول الورقة الحالية ({activeSheet.name})</span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    عدد الصفوف: {activeSheet.rowCount} | عدد الأعمدة: {activeSheet.colCount}
                  </span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-lg max-h-56">
                  <table className="w-full text-xs text-right border-collapse">
                    <thead>
                      <tr className="bg-slate-100 font-bold text-slate-700">
                        <th className="p-2 border border-slate-200 w-10 text-center">#</th>
                        <th className="p-2 border border-slate-200">A (م)</th>
                        <th className="p-2 border border-slate-200">B (البيان / المطالبة)</th>
                        <th className="p-2 border border-slate-200">C (المستحق له)</th>
                        <th className="p-2 border border-slate-200">D (المبلغ المقدر)</th>
                        <th className="p-2 border border-slate-200">E (الذهب)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4, 5, 6, 7].map((r) => (
                        <tr key={r} className="hover:bg-slate-50">
                          <td className="p-1.5 border border-slate-200 font-mono text-center bg-slate-50 text-slate-500 font-bold">{r}</td>
                          {['A', 'B', 'C', 'D', 'E'].map((col) => {
                            const addr = `${col}${r}`;
                            const cell = activeSheet.data[addr];
                            const val = cell?.formula ? evaluateFormula(cell.formula, activeSheet.data) : (cell?.value || '');
                            return (
                              <td 
                                key={col} 
                                className="p-1.5 border border-slate-200 font-medium truncate max-w-[140px]"
                                style={{
                                  backgroundColor: cell?.bg || 'transparent',
                                  color: cell?.color || '#1e293b',
                                  fontWeight: cell?.bold ? 'bold' : 'normal',
                                  textAlign: cell?.align || 'right',
                                }}
                              >
                                {cell?.format ? formatCellValue(val, cell.format) : val}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= 2. CELL CONTROLS TAB ================= */}
          {activeTab === 'cell_controls' && (
            <div className="space-y-5">
              {/* Target Cell Selector Banner */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-700">اختر الخلية للتحكم والتعديل:</span>
                  <div className="flex items-center gap-1.5">
                    {['A1', 'B1', 'D1', 'A2', 'B2', 'D2', 'B3', 'D3', 'D7'].map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setTargetCell(c);
                          onSelectCell(c);
                        }}
                        className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition border ${
                          targetCell === c
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">أو اكتب اسم الخلية:</span>
                  <input
                    type="text"
                    value={targetCell}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase();
                      setTargetCell(val);
                      onSelectCell(val);
                    }}
                    className="w-16 px-2 py-1 bg-slate-50 border border-slate-300 rounded font-mono font-bold text-xs text-center uppercase focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Cell Value & Formula Input */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
                <h4 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2">
                  محتوى وقيمة الخلية النشطة ({targetCell}):
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      نص أو قيمة الخلية (Value):
                    </label>
                    <input
                      type="text"
                      value={cellValueInput}
                      onChange={(e) => setCellValueInput(e.target.value)}
                      placeholder="أدخل نص، رقم، أو بيان الخلية..."
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      الصيغة الرياضية التلقائية (Formula fx):
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={cellFormulaInput}
                        onChange={(e) => setCellFormulaInput(e.target.value)}
                        placeholder="=SUM(D2:D6) أو =AVERAGE(...) أو =D3*0.05"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono font-medium text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        dir="ltr"
                      />
                      <button
                        onClick={handleSaveCellValue}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shrink-0 transition shadow-2xs"
                      >
                        حفظ القيمة
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formatting Suite for Current Cell */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Text Formatting & Alignment */}
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2">
                    تنسيق النصوص والمحاذاة:
                  </h4>

                  {/* B, I, U Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateCurrentCell({ bold: !currentCellData.bold })}
                      className={`p-2 rounded-lg border font-bold text-xs flex items-center gap-1.5 transition ${
                        currentCellData.bold ? 'bg-emerald-100 border-emerald-400 text-emerald-900' : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Bold className="w-4 h-4" />
                      <span>عريض (B)</span>
                    </button>

                    <button
                      onClick={() => handleUpdateCurrentCell({ italic: !currentCellData.italic })}
                      className={`p-2 rounded-lg border font-bold text-xs flex items-center gap-1.5 transition ${
                        currentCellData.italic ? 'bg-emerald-100 border-emerald-400 text-emerald-900' : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Italic className="w-4 h-4" />
                      <span>مائل (I)</span>
                    </button>

                    <button
                      onClick={() => handleUpdateCurrentCell({ underline: !currentCellData.underline })}
                      className={`p-2 rounded-lg border font-bold text-xs flex items-center gap-1.5 transition ${
                        currentCellData.underline ? 'bg-emerald-100 border-emerald-400 text-emerald-900' : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Underline className="w-4 h-4" />
                      <span>تسطير (U)</span>
                    </button>

                    <button
                      onClick={() => handleUpdateCurrentCell({ wrapText: !currentCellData.wrapText })}
                      className={`p-2 rounded-lg border font-bold text-xs flex items-center gap-1.5 transition ${
                        currentCellData.wrapText ? 'bg-teal-100 border-teal-400 text-teal-900' : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>التفاف النص</span>
                    </button>
                  </div>

                  {/* Alignment Controls */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                      المحاذاة الأفقية:
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateCurrentCell({ align: 'right' })}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1 transition ${
                          currentCellData.align === 'right' ? 'bg-emerald-100 border-emerald-500 text-emerald-900' : 'bg-slate-50 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <AlignRight className="w-3.5 h-3.5" />
                        <span>يمين</span>
                      </button>
                      <button
                        onClick={() => handleUpdateCurrentCell({ align: 'center' })}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1 transition ${
                          currentCellData.align === 'center' ? 'bg-emerald-100 border-emerald-500 text-emerald-900' : 'bg-slate-50 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <AlignCenter className="w-3.5 h-3.5" />
                        <span>وسط</span>
                      </button>
                      <button
                        onClick={() => handleUpdateCurrentCell({ align: 'left' })}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1 transition ${
                          currentCellData.align === 'left' ? 'bg-emerald-100 border-emerald-500 text-emerald-900' : 'bg-slate-50 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <AlignLeft className="w-3.5 h-3.5" />
                        <span>يسار</span>
                      </button>
                    </div>
                  </div>

                  {/* Number Formatting */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                      تنسيق الأرقام والعملات:
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: 'general', label: 'عام (نص عادي)' },
                        { id: 'currency_yer', label: 'عملة (ريال يمني ر.ي)' },
                        { id: 'currency_sar', label: 'عملة (ريال سعودي ر.س)' },
                        { id: 'currency_usd', label: 'عملة ($ دولار)' },
                        { id: 'number', label: 'رقم عشري (1,000.00)' },
                        { id: 'percent', label: 'نسبة مئوية (%)' },
                      ].map((fmt) => (
                        <button
                          key={fmt.id}
                          onClick={() => handleUpdateCurrentCell({ format: fmt.id })}
                          className={`p-1.5 rounded-lg border text-[11px] font-semibold text-right transition ${
                            currentCellData.format === fmt.id
                              ? 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold'
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          {fmt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Colors, Borders & Cell Badges */}
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2">
                    ألوان الخلية وحدود الجدول (Borders & Fill):
                  </h4>

                  {/* Cell Background Fill */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                      لون خلفية الخلية:
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {cellBgColors.map((c) => (
                        <button
                          key={c.value}
                          onClick={() => handleUpdateCurrentCell({ bg: c.value })}
                          className={`p-1.5 rounded-lg border flex items-center gap-1.5 text-xs transition ${
                            currentCellData.bg === c.value ? 'ring-2 ring-emerald-500 font-bold' : 'hover:scale-105'
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded border border-slate-400 shrink-0"
                            style={{ backgroundColor: c.value }}
                          />
                          <span className="truncate text-[10px] text-slate-700">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cell Text Color */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                      لون النص:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {cellTextColors.map((c) => (
                        <button
                          key={c.value}
                          onClick={() => handleUpdateCurrentCell({ color: c.value })}
                          className={`p-1.5 rounded-lg border flex items-center gap-1.5 text-xs transition ${
                            currentCellData.color === c.value ? 'ring-2 ring-emerald-500 font-bold' : 'hover:scale-105'
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded border border-slate-400 shrink-0"
                            style={{ backgroundColor: c.value }}
                          />
                          <span className="truncate text-[10px] text-slate-700">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Borders Suite */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                      نمط إطار وحدود الخلية (Borders):
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleUpdateCurrentCell({ borderStyle: 'all', borderColor: '#64748b' })}
                        className={`p-2 rounded-lg border text-xs font-semibold text-right transition ${
                          currentCellData.borderStyle === 'all' ? 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold' : 'bg-slate-50 border-slate-300'
                        }`}
                      >
                        كافة الحدود (All Borders)
                      </button>

                      <button
                        onClick={() => handleUpdateCurrentCell({ borderStyle: 'box', borderColor: '#15803d' })}
                        className={`p-2 rounded-lg border text-xs font-semibold text-right transition ${
                          currentCellData.borderStyle === 'box' ? 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold' : 'bg-slate-50 border-slate-300'
                        }`}
                      >
                        إطار خارجي سميك (Thick Box)
                      </button>

                      <button
                        onClick={() => handleUpdateCurrentCell({ borderStyle: 'double_bottom', borderColor: '#0369a1' })}
                        className={`p-2 rounded-lg border text-xs font-semibold text-right transition ${
                          currentCellData.borderStyle === 'double_bottom' ? 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold' : 'bg-slate-50 border-slate-300'
                        }`}
                      >
                        حد سفلي مزدوج (للمجاميع)
                      </button>

                      <button
                        onClick={() => handleUpdateCurrentCell({ borderStyle: 'none' })}
                        className="p-2 rounded-lg border bg-slate-50 border-slate-300 hover:bg-slate-100 text-xs font-semibold text-right text-rose-700"
                      >
                        إلغاء الحدود (No Border)
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ================= 3. TABLE & DOCUMENT CONTROLS TAB ================= */}
          {activeTab === 'table_controls' && (
            <div className="space-y-5">
              {/* Table Structure Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Rows & Columns Operations */}
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <TableIcon className="w-4 h-4 text-emerald-600" />
                    <span>التحكم بصفوف وأعمدة الجدول:</span>
                  </h4>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={onInsertRow}
                      className="flex items-center justify-center gap-1.5 p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold transition shadow-2xs"
                    >
                      <Plus className="w-4 h-4 text-emerald-600" />
                      <span>إدراج صف جديد (+)</span>
                    </button>

                    <button
                      onClick={onDeleteRow}
                      className="flex items-center justify-center gap-1.5 p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 rounded-lg text-xs font-bold transition shadow-2xs"
                    >
                      <Trash2 className="w-4 h-4 text-rose-600" />
                      <span>حذف الصف الحالي (-)</span>
                    </button>

                    <button
                      onClick={onInsertCol}
                      className="flex items-center justify-center gap-1.5 p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 rounded-lg text-xs font-bold transition shadow-2xs"
                    >
                      <Plus className="w-4 h-4 text-blue-600" />
                      <span>إدراج عمود جديد (+)</span>
                    </button>

                    <button
                      onClick={onDeleteCol}
                      className="flex items-center justify-center gap-1.5 p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 rounded-lg text-xs font-bold transition shadow-2xs"
                    >
                      <Trash2 className="w-4 h-4 text-rose-600" />
                      <span>حذف العمود الحالي (-)</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-2">
                    يمكنك توسيع الجدول تلقائياً بإضافة صفوف لمزيد من البنود أو أعمدة لحساب الرسوم والضرائب.
                  </p>
                </div>

                {/* Freeze Panes & View Controls */}
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <span>تجميد الألواح وتثبيت العناوين:</span>
                  </h4>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => onFreezePanes('row')}
                      className="p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-300 hover:border-blue-300 rounded-lg text-xs font-bold text-slate-800 transition"
                    >
                      تجميد الصف العلوي
                    </button>

                    <button
                      onClick={() => onFreezePanes('col')}
                      className="p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-300 hover:border-blue-300 rounded-lg text-xs font-bold text-slate-800 transition"
                    >
                      تجميد العمود الأول
                    </button>

                    <button
                      onClick={() => onFreezePanes('none')}
                      className="p-2.5 bg-slate-50 hover:bg-rose-50 border border-slate-300 hover:border-rose-300 rounded-lg text-xs font-bold text-rose-700 transition"
                    >
                      إلغاء التجميد
                    </button>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-xs font-bold text-slate-700">معاينة وطباعة المصنف:</div>
                    <button
                      onClick={onPrint}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>معاينة الطباعة / PDF</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Ready Calculations & Table Automation */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
                <h4 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <Sigma className="w-4 h-4 text-emerald-600" />
                  <span>معادلات وحسابات الجداول التلقائية المتاحة:</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                    <div className="font-bold text-xs text-emerald-900 mb-1">دالة المجموع =SUM</div>
                    <p className="text-[11px] text-emerald-700 mb-2">تجمع كافة القيم الرقمية ضمن نطاق الخلايا المحدد تلقائياً.</p>
                    <code className="text-[10px] bg-white px-2 py-0.5 rounded border border-emerald-300 font-mono text-emerald-800 block text-left" dir="ltr">
                      =SUM(D2:D6)
                    </code>
                  </div>

                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
                    <div className="font-bold text-xs text-blue-900 mb-1">دالة المتوسط =AVERAGE</div>
                    <p className="text-[11px] text-blue-700 mb-2">تحسب متوسط القيم أو الرسوم التقديرية بدقة متناهية.</p>
                    <code className="text-[10px] bg-white px-2 py-0.5 rounded border border-blue-300 font-mono text-blue-800 block text-left" dir="ltr">
                      =AVERAGE(D2:D6)
                    </code>
                  </div>

                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                    <div className="font-bold text-xs text-amber-900 mb-1">دالة أعلى قيمة =MAX</div>
                    <p className="text-[11px] text-amber-700 mb-2">تستخرج أكبر مبلغ أو مطالبة مالية ضمن الجدول.</p>
                    <code className="text-[10px] bg-white px-2 py-0.5 rounded border border-amber-300 font-mono text-amber-800 block text-left" dir="ltr">
                      =MAX(D2:D6)
                    </code>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 4. READY TEMPLATES TAB ================= */}
          {activeTab === 'templates' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                اختر قالباً محاسبياً أو قضائياً جاهزاً لتطبيقه على الفور:
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Template 1 */}
                <div className="bg-white rounded-xl p-4 border border-slate-200 hover:border-emerald-400 transition shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm mb-2">
                      ⚖
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mb-1">
                      كشف حصر التركات والمطالبات الشرعية
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      جدول قضائي رسمي متكامل لحصر ديون المورث، المهر المؤخر، تكاليف العلاج، وأمانات شراء البصائر مع دالة الجمع التلقائي.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      handleExecuteSingleStep(0);
                      handleExecuteSingleStep(1);
                      handleExecuteSingleStep(2);
                      handleExecuteSingleStep(3);
                      onClose();
                    }}
                    className="mt-4 w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
                  >
                    تطبيق هذا القالب
                  </button>
                </div>

                {/* Template 2 */}
                <div className="bg-white rounded-xl p-4 border border-slate-200 hover:border-blue-400 transition shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm mb-2">
                      🏛
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mb-1">
                      بيان الرسوم القضائية والتوثيق الهندسي
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      جدول لمحاسبة الخبير العدلي الهندسي، رسوم المحكمة، أتعاب التوثيق، والمصاريف الإدارية المعتمدة.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onUpdateExcelState((prev) => {
                        const updatedSheets = prev.sheets.map((s) => {
                          if (s.id !== prev.activeSheetId) return s;
                          return {
                            ...s,
                            name: 'بيان المصاريف والتوثيق',
                            data: {
                              'A1': { value: 'م', bold: true, align: 'center', bg: '#0369a1', color: '#ffffff', borderStyle: 'all' },
                              'B1': { value: 'البند / الرسوم القضائية', bold: true, align: 'center', bg: '#0284c7', color: '#ffffff', borderStyle: 'all' },
                              'C1': { value: 'الجهة المنفذة', bold: true, align: 'center', bg: '#0284c7', color: '#ffffff', borderStyle: 'all' },
                              'D1': { value: 'المبلغ المستحق (ريال)', bold: true, align: 'center', bg: '#0284c7', color: '#ffffff', borderStyle: 'all' },
                              'A2': { value: '1', align: 'center', borderStyle: 'all' },
                              'B2': { value: 'رسوم المحكمة وقيد الدعوى', align: 'right', borderStyle: 'all' },
                              'C2': { value: 'قلم المحكمة الإبتدائية', align: 'right', borderStyle: 'all' },
                              'D2': { value: '150000', format: 'currency_yer', align: 'left', borderStyle: 'all' },
                              'A3': { value: '2', align: 'center', borderStyle: 'all' },
                              'B3': { value: 'أتعاب الخبير العدلي الهندسي ومسح الأراضي', align: 'right', borderStyle: 'all' },
                              'C3': { value: 'مكتب المساحة العدلي', align: 'right', borderStyle: 'all' },
                              'D3': { value: '450000', format: 'currency_yer', align: 'left', borderStyle: 'all' },
                              'A4': { value: '3', align: 'center', borderStyle: 'all' },
                              'B4': { value: 'أجور الإعلانات والنشر القضائي', align: 'right', borderStyle: 'all' },
                              'C4': { value: 'الصحيفة الرسمية', align: 'right', borderStyle: 'all' },
                              'D4': { value: '80000', format: 'currency_yer', align: 'left', borderStyle: 'all' },
                              'A5': { value: '∑', bold: true, align: 'center', bg: '#e0f2fe', color: '#0369a1', borderStyle: 'double_bottom' },
                              'B5': { value: 'إجمالي الرسوم التقديرية', bold: true, align: 'right', bg: '#f0f9ff', color: '#0369a1', borderStyle: 'double_bottom' },
                              'C5': { value: 'معتمد للمطالبة', bold: true, align: 'center', bg: '#f0f9ff', color: '#0369a1', borderStyle: 'double_bottom' },
                              'D5': { formula: '=SUM(D2:D4)', format: 'currency_yer', bold: true, align: 'left', bg: '#e0f2fe', color: '#0369a1', borderStyle: 'double_bottom' },
                            },
                          };
                        });
                        return { ...prev, sheets: updatedSheets };
                      });
                      onClose();
                    }}
                    className="mt-4 w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
                  >
                    تطبيق هذا القالب
                  </button>
                </div>

                {/* Template 3 */}
                <div className="bg-white rounded-xl p-4 border border-slate-200 hover:border-amber-400 transition shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm mb-2">
                      💼
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mb-1">
                      مسير رواتب وبدلات الموظفين
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      كشف رواتب شهري يضم الراتب الأساسي، بدل السكن، بدل النقل، الاستقطاعات، وصافي الراتب مع المجاميع.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onUpdateExcelState((prev) => {
                        const updatedSheets = prev.sheets.map((s) => {
                          if (s.id !== prev.activeSheetId) return s;
                          return {
                            ...s,
                            name: 'مسير الرواتب',
                            data: {
                              'A1': { value: 'م', bold: true, align: 'center', bg: '#92400e', color: '#ffffff', borderStyle: 'all' },
                              'B1': { value: 'اسم الموظف / الوظيفة', bold: true, align: 'center', bg: '#b45309', color: '#ffffff', borderStyle: 'all' },
                              'C1': { value: 'الراتب الأساسي', bold: true, align: 'center', bg: '#b45309', color: '#ffffff', borderStyle: 'all' },
                              'D1': { value: 'البدلات والمكافآت', bold: true, align: 'center', bg: '#b45309', color: '#ffffff', borderStyle: 'all' },
                              'E1': { value: 'صافي المستحق', bold: true, align: 'center', bg: '#b45309', color: '#ffffff', borderStyle: 'all' },
                              'A2': { value: '1', align: 'center', borderStyle: 'all' },
                              'B2': { value: 'محمد أحمد - مدير إداري', align: 'right', borderStyle: 'all' },
                              'C2': { value: '8000', format: 'currency_sar', align: 'left', borderStyle: 'all' },
                              'D2': { value: '2000', format: 'currency_sar', align: 'left', borderStyle: 'all' },
                              'E2': { formula: '=C2+D2', format: 'currency_sar', align: 'left', borderStyle: 'all', bold: true },
                              'A3': { value: '2', align: 'center', borderStyle: 'all' },
                              'B3': { value: 'خالد عبدالله - محاسب مالي', align: 'right', borderStyle: 'all' },
                              'C3': { value: '6000', format: 'currency_sar', align: 'left', borderStyle: 'all' },
                              'D3': { value: '1500', format: 'currency_sar', align: 'left', borderStyle: 'all' },
                              'E3': { formula: '=C3+D3', format: 'currency_sar', align: 'left', borderStyle: 'all', bold: true },
                              'A4': { value: '∑', bold: true, align: 'center', bg: '#fef3c7', color: '#92400e', borderStyle: 'double_bottom' },
                              'B4': { value: 'إجمالي المسير الشهري', bold: true, align: 'right', bg: '#fffbeb', color: '#92400e', borderStyle: 'double_bottom' },
                              'C4': { formula: '=SUM(C2:C3)', format: 'currency_sar', bold: true, align: 'left', bg: '#fef3c7', borderStyle: 'double_bottom' },
                              'D4': { formula: '=SUM(D2:D3)', format: 'currency_sar', bold: true, align: 'left', bg: '#fef3c7', borderStyle: 'double_bottom' },
                              'E4': { formula: '=SUM(E2:E3)', format: 'currency_sar', bold: true, align: 'left', bg: '#fef3c7', color: '#92400e', borderStyle: 'double_bottom' },
                            },
                          };
                        });
                        return { ...prev, sheets: updatedSheets };
                      });
                      onClose();
                    }}
                    className="mt-4 w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
                  >
                    تطبيق هذا القالب
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="bg-slate-100 border-t border-slate-200 px-5 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="font-bold text-slate-700">المصنف:</span>
            <span>{excelState.title}</span>
            <span>•</span>
            <span>الورقة: <strong className="text-emerald-700">{activeSheet.name}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs"
            >
              تم وإغلاق المحاكي ✓
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
