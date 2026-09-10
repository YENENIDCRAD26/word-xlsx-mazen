import React, { useState, useMemo } from 'react';
import {
  X,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  Download,
  Palette,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { SheetData, CellData } from '../../types';
import { evaluateFormula } from '../../utils/excelEngine';

interface ChartModalProps {
  isOpen?: boolean;
  sheet?: SheetData;
  cells?: Record<string, CellData>;
  onClose: () => void;
}

type ChartType = 'bar' | 'pie' | 'line';

const COLOR_PALETTES: Record<string, { name: string; colors: string[] }> = {
  emerald: {
    name: 'أخضر مؤسسي (Emerald)',
    colors: ['#059669', '#10b981', '#34d399', '#6ee7b7', '#047857', '#065f46', '#0f766e', '#14b8a6'],
  },
  modern: {
    name: 'متعدد حديث (Vibrant)',
    colors: ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'],
  },
  ocean: {
    name: 'محيطي هادئ (Ocean)',
    colors: ['#0284c7', '#0369a1', '#0ea5e9', '#38bdf8', '#6366f1', '#4f46e5', '#4338ca', '#3b82f6'],
  },
  sunset: {
    name: 'غروب دافئ (Sunset)',
    colors: ['#ea580c', '#f97316', '#fb923c', '#e11d48', '#f43f5e', '#fb7185', '#d97706', '#b45309'],
  },
};

export const ChartModal: React.FC<ChartModalProps> = ({ isOpen, sheet, cells, onClose }) => {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [labelCol, setLabelCol] = useState('B');
  const [valueCol, setValueCol] = useState('D');
  const [startRow, setStartRow] = useState(2);
  const [endRow, setEndRow] = useState(15);
  const [paletteKey, setPaletteKey] = useState<keyof typeof COLOR_PALETTES>('modern');
  const [chartTitle, setChartTitle] = useState('تحليل ومخطط بياني للبيانات');

  const activePalette = COLOR_PALETTES[paletteKey].colors;
  const sheetCells = sheet?.cells || cells || {};

  // Extract data based on user configuration
  const dataPoints = useMemo(() => {
    const points: { label: string; value: number }[] = [];
    if (!sheetCells || typeof sheetCells !== 'object') return points;
    for (let r = startRow; r <= endRow; r++) {
      const labelCell = sheetCells[`${labelCol}${r}`];
      const valCell = sheetCells[`${valueCol}${r}`];
      if (labelCell && valCell) {
        const label = (labelCell.displayValue || labelCell.value || '').trim();
        const rawVal = valCell.value?.startsWith?.('=')
          ? evaluateFormula(valCell.value, sheetCells)
          : valCell.value || '';
        const num = parseFloat(String(rawVal).replace(/[,]/g, ''));
        if (label && !isNaN(num) && num > 0) {
          points.push({ label, value: num });
        }
      }
    }
    return points;
  }, [sheetCells, labelCol, valueCol, startRow, endRow]);

  const { totalSum, average, maxValue, minValue } = useMemo(() => {
    if (!dataPoints.length) return { totalSum: 0, average: 0, maxValue: 0, minValue: 0 };
    const values = dataPoints.map(d => d.value);
    const sum = values.reduce((a, b) => a + b, 0);
    return {
      totalSum: sum,
      average: Math.round((sum / values.length) * 10) / 10,
      maxValue: Math.max(...values),
      minValue: Math.min(...values),
    };
  }, [dataPoints]);

  if (isOpen !== undefined && !isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-neutral-300 w-full max-w-4xl overflow-hidden text-right flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-neutral-200 bg-gradient-to-r from-emerald-50 to-neutral-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-600 text-white rounded-lg shadow-xs">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-neutral-900 text-base">إنشاء المخططات والرسوم البيانية (Recharts)</h3>
              <p className="text-xs text-neutral-500">تصوير بصري تفاعلي للبيانات الرقمية مع فئات وألوان مخصصة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Configuration Bar */}
        <div className="p-4 bg-neutral-100/80 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Chart Type Selector */}
          <div className="flex items-center gap-1 bg-white border border-neutral-300 rounded-lg p-1 shadow-xs">
            <button
              onClick={() => setChartType('bar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
                chartType === 'bar' ? 'bg-emerald-600 text-white shadow-xs' : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>أعمدة (Bar)</span>
            </button>
            <button
              onClick={() => setChartType('pie')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
                chartType === 'pie' ? 'bg-emerald-600 text-white shadow-xs' : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <PieChartIcon className="w-4 h-4" />
              <span>دائري (Pie)</span>
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
                chartType === 'line' ? 'bg-emerald-600 text-white shadow-xs' : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>خطي (Line)</span>
            </button>
          </div>

          {/* Columns & Range Selectors */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-neutral-300">
              <span className="font-semibold text-neutral-600">عمود التسميات:</span>
              <select
                value={labelCol}
                onChange={(e) => setLabelCol(e.target.value)}
                className="bg-transparent font-bold text-neutral-800 outline-hidden cursor-pointer"
              >
                {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(c => (
                  <option key={c} value={c}>العمود {c}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-neutral-300">
              <span className="font-semibold text-neutral-600">عمود الأرقام:</span>
              <select
                value={valueCol}
                onChange={(e) => setValueCol(e.target.value)}
                className="bg-transparent font-bold text-emerald-700 outline-hidden cursor-pointer"
              >
                {['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'].map(c => (
                  <option key={c} value={c}>العمود {c}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-neutral-300">
              <span className="text-neutral-600 font-semibold">الصفوف:</span>
              <input
                type="number"
                min={1}
                max={endRow}
                value={startRow}
                onChange={(e) => setStartRow(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-10 text-center font-mono font-bold border-b border-neutral-300 outline-hidden"
              />
              <span className="text-neutral-400">إلى</span>
              <input
                type="number"
                min={startRow}
                max={40}
                value={endRow}
                onChange={(e) => setEndRow(Math.max(startRow, parseInt(e.target.value) || startRow))}
                className="w-10 text-center font-mono font-bold border-b border-neutral-300 outline-hidden"
              />
            </div>

            {/* Palette */}
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-neutral-300">
              <Palette className="w-3.5 h-3.5 text-neutral-500" />
              <select
                value={paletteKey}
                onChange={(e) => setPaletteKey(e.target.value as keyof typeof COLOR_PALETTES)}
                className="bg-transparent text-neutral-700 font-medium outline-hidden cursor-pointer"
              >
                {Object.entries(COLOR_PALETTES).map(([k, p]) => (
                  <option key={k} value={k}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Chart Viewport */}
        <div className="p-6 flex-1 overflow-y-auto flex flex-col items-center justify-center min-h-[380px] bg-neutral-50/50">
          {dataPoints.length === 0 ? (
            <div className="text-center text-neutral-400 py-16">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
              <p className="font-bold text-sm text-neutral-700">لم يتم العثور على أرقام مناسبة في النطاق المحدد</p>
              <p className="text-xs mt-1 text-neutral-500">
                يرجى تغيير عمود الأرقام (مثل العمود C أو D) أو التأكد من احتواء الخلايا على قيم عددية.
              </p>
            </div>
          ) : (
            <div className="w-full max-w-3xl flex flex-col items-center">
              {/* Chart Title */}
              <div className="w-full text-center mb-4">
                <input
                  type="text"
                  value={chartTitle}
                  onChange={(e) => setChartTitle(e.target.value)}
                  className="font-bold text-neutral-800 text-base text-center bg-transparent border-b border-transparent hover:border-neutral-300 focus:border-emerald-500 outline-hidden px-2 py-0.5"
                />
              </div>

              {/* RECHARTS SVG RENDERING */}
              <div className="w-full h-[320px] bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
                {/* 1. Bar Chart */}
                {chartType === 'bar' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dataPoints} margin={{ top: 10, right: 30, left: 20, bottom: 25 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis
                        dataKey="label"
                        tick={{ fontSize: 11, fill: '#4b5563' }}
                        interval={0}
                        angle={-15}
                        textAnchor="end"
                      />
                      <YAxis tick={{ fontSize: 11, fill: '#4b5563' }} />
                      <Tooltip
                        formatter={(value: any) => [Number(value).toLocaleString('ar-SA'), 'القيمة']}
                        contentStyle={{ direction: 'rtl', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '12px' }}
                      />
                      <Legend />
                      <Bar dataKey="value" name="المقدار / القيمة" radius={[4, 4, 0, 0]}>
                        {dataPoints.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={activePalette[index % activePalette.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}

                {/* 2. Pie Chart */}
                {chartType === 'pie' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip
                        formatter={(value: any) => [Number(value).toLocaleString('ar-SA'), 'القيمة']}
                        contentStyle={{ direction: 'rtl', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '12px' }}
                      />
                      <Legend />
                      <Pie
                        data={dataPoints}
                        dataKey="value"
                        nameKey="label"
                        cx="50%"
                        cy="50%"
                        outerRadius={105}
                        innerRadius={35}
                        paddingAngle={2}
                        label={({ name, percent }: any) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {dataPoints.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={activePalette[index % activePalette.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                )}

                {/* 3. Line Chart */}
                {chartType === 'line' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dataPoints} margin={{ top: 10, right: 30, left: 20, bottom: 25 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis
                        dataKey="label"
                        tick={{ fontSize: 11, fill: '#4b5563' }}
                        interval={0}
                        angle={-15}
                        textAnchor="end"
                      />
                      <YAxis tick={{ fontSize: 11, fill: '#4b5563' }} />
                      <Tooltip
                        formatter={(value: any) => [Number(value).toLocaleString('ar-SA'), 'القيمة']}
                        contentStyle={{ direction: 'rtl', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '12px' }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="value"
                        name="المسار والمقدار"
                        stroke={activePalette[0]}
                        strokeWidth={3}
                        dot={{ r: 5, fill: activePalette[1] || activePalette[0] }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Data Summary Badges */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full mt-4 text-center text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-neutral-200">
                  <span className="text-neutral-500 block text-[10px]">إجمالي القيم</span>
                  <span className="font-mono font-bold text-emerald-700 text-sm">{totalSum.toLocaleString('ar-SA')}</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-neutral-200">
                  <span className="text-neutral-500 block text-[10px]">المتوسط الحسابي</span>
                  <span className="font-mono font-bold text-blue-700 text-sm">{average.toLocaleString('ar-SA')}</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-neutral-200">
                  <span className="text-neutral-500 block text-[10px]">أعلى قيمة</span>
                  <span className="font-mono font-bold text-purple-700 text-sm">{maxValue.toLocaleString('ar-SA')}</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-neutral-200">
                  <span className="text-neutral-500 block text-[10px]">عدد العناصر</span>
                  <span className="font-mono font-bold text-neutral-700 text-sm">{dataPoints.length}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
          <div className="text-xs text-neutral-500">
            تم استخراج البيانات من الخلايا: <code className="font-mono font-bold text-neutral-800">{labelCol}{startRow}:{valueCol}{endRow}</code>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>طباعة / حفظ</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-1.5 bg-neutral-800 hover:bg-neutral-900 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
