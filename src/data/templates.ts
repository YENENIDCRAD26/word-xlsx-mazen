import { TemplateItem, SheetData } from '../types';
import { createEmptySheet } from '../utils/excelEngine';

export const WORD_TEMPLATES: TemplateItem[] = [
  {
    id: 'legal_petition_mazen',
    title: 'عريضة دعوى قضائية (حصر التركات والطلبات الشرعية)',
    description: 'مستند قانوني ومذكرة دعوى أمام المحكمة الابتدائية مقتبسة ومطابقة لنموذج المحاكم الشرعية',
    category: 'legal',
    type: 'word',
    thumbnailText: 'دعوى قضائية',
    data: {
      title: 'Word PRO - Mazen.doc',
      contentHtml: `
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="font-size: 20pt; font-weight: bold; margin-bottom: 8px;">بسم الله الرحمن الرحيم</h2>
          <h3 style="font-size: 16pt; font-weight: bold; margin-bottom: 12px;">أمام محكمة القفر الإبتدائية</h3>
        </div>

        <div style="margin-bottom: 20px; line-height: 1.8;">
          <p style="text-align: left; font-weight: bold; margin-bottom: 8px;">المدعى عليه: أنس مسعد غلاب</p>
          <p style="font-weight: bold; font-size: 14pt;">فضيلة الأخ رئيس محكمة القفر الإبتدائية........................................ الأكرم،</p>
          <p style="text-align: center; font-weight: bold; margin: 12px 0;">تحية طيبة وبعد ،،</p>
        </div>

        <div style="background-color: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
          <p style="font-weight: bold; font-size: 14pt; text-align: center; color: #0f172a;">
            الموضوع: (الطلبات الشرعية التي يجب إخراجها قبل الشروع في القسمة وتحرير الفصول)
          </p>
        </div>

        <p style="text-align: justify; line-height: 2; margin-bottom: 16px;">
          إشارة إلى الموضوع أعلاه؛ نطلب من عدالتكم الموقرة الفصل في موضوع طلباتنا الشرعية اللازمة والمفترض شرعاً إخراجها أولاً، كونها شرطاً أساسياً لصلاحية القسمة، ومنها ما يلي:
        </p>

        <p style="font-weight: bold; font-size: 13pt; margin-top: 16px; margin-bottom: 8px; color: #1e293b;">
          أولاً: إخراج المديونية التي على ذمة المورث الموضحة بالآتي:
        </p>
        <ol style="margin-right: 24px; line-height: 2;">
          <li>............... جراماً ونصف الجرام ذهب، عيار واحد وعشرين (21)، بذمة المورث، قرضة لزوجته (والدتنا).</li>
          <li>المهر المؤخر الذي ما زال بذمة المورث.</li>
          <li>تكاليف علاج المورث، وتكاليف الدفن، والديون التي على ذمة المورث بمبلغ وقدره ........................</li>
          <li>تكاليف زواج القاصر المقدرة بمبلغ ثلاثة ملايين ريال يمني أسوة بالمدعى عليه، الذي تكلفت حينها مبلغ ثلاثة ملايين ريال أغلبها ديون وتم تسديد مديونية زواجه ببيع "الجنية" لقرض تسديد ما تبقى من مديونية زواجه.</li>
        </ol>

        <p style="font-weight: bold; font-size: 13pt; margin-top: 16px; margin-bottom: 8px; color: #1e293b;">
          ثانياً: إلزام المدعى عليه بتسليم المنقولات والمقتنيات والمنهوبات العينية والنقدية التي بحوزته:
        </p>
        <p style="text-align: justify; line-height: 1.8; margin-bottom: 16px;">
          والموضحة سابقاً في جدول الحصر وعريضة المبالغ النقدية والعينية المسلمة بيد المدعى عليه والموضحة والمفندة، ونذكر منها: [...........................................................................]
        </p>

        <p style="font-weight: bold; font-size: 13pt; margin-top: 16px; margin-bottom: 8px; color: #1e293b;">
          ثالثاً: إلزام المدعى عليه بتسليم المحررات وبصائر شراء المكتسبات وتحريزها:
        </p>
        <p style="text-align: justify; line-height: 1.8; margin-bottom: 20px;">
          لدى والدتنا، لضمان عدم عبث المدعى عليه بها أو التصرف فيها، بحجة أن المدعى عليه خان الأمانة حينما سلمناه الأثمان الخاصة بالشراء وقام بتحرير البصائر باسمه الشخصي.
        </p>

        <p style="text-align: center; font-weight: bold; margin: 16px 0;">نحتفظ بكافة حقوقنا الشرعية السابقة واللاحقة....</p>

        <table style="width: 100%; border-collapse: collapse; margin-top: 24px;">
          <tr>
            <td style="width: 50%; vertical-align: top; padding: 12px; border: 1px dashed #cbd5e1;">
              <p style="font-weight: bold; margin-bottom: 8px; color: #0f172a;">مقدمو الطلب / المدعون:</p>
              <p>1. نورية مسعد غلاب</p>
              <p>2. أمة الوهاب مسعد غلاب</p>
              <p>3. تيسير مسعد غلاب</p>
              <p>4. محمد مسعد غلاب</p>
              <p>5. مناف مسعد غلاب</p>
              <p style="font-size: 11pt; color: #64748b; margin-top: 6px;">عنهم / مناف مسعد غلاب .....</p>
            </td>
            <td style="width: 50%; vertical-align: top; padding: 12px; border: 1px dashed #cbd5e1;">
              <p style="font-weight: bold; margin-bottom: 8px; color: #0f172a;">بحضور وتأكيد وإقرار:</p>
              <p style="line-height: 1.7;">والدتنا الطاهرة الحرة / نبات عبد الله فارع الرصاص، أمام عدالة المحكمة بهيئتها الموقرة.</p>
              <p style="margin-top: 16px; font-weight: bold;">التوقيع / البصمة: ....................</p>
            </td>
          </tr>
        </table>

        <div style="margin-top: 30px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 12px; color: #64748b; font-size: 11pt;">
          وفقاً للأحكام والأنظمة الشرعية السارية ذات الصلة.
        </div>
      `,
    },
  },
  {
    id: 'official_letter',
    title: 'خطاب رسمي واستدعاء إداري',
    description: 'خطاب رسمي لمخاطبة الدوائر والمؤسسات الحكومية والخاصة بصيغة معتمدة',
    category: 'official',
    type: 'word',
    thumbnailText: 'خطاب رسمي',
    data: {
      title: 'خطاب رسمي موجه.docx',
      contentHtml: `
        <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 24px;">
          <div>
            <p style="font-weight: bold; font-size: 13pt;">المملكة العربية السعودية</p>
            <p style="font-size: 11pt; color: #475569;">وزارة التجارة والاستثمار</p>
          </div>
          <div style="text-align: left;">
            <p style="font-size: 11pt;">التاريخ: ${new Date().toLocaleDateString('ar-SA')}</p>
            <p style="font-size: 11pt;">الرقم الإشاري: 1446/782</p>
          </div>
        </div>

        <div style="text-align: center; margin: 20px 0;">
          <h2 style="font-size: 18pt; font-weight: bold;">بسم الله الرحمن الرحيم</h2>
        </div>

        <p style="font-size: 14pt; font-weight: bold; margin-bottom: 8px;">سعادة مدير عام الشؤون الإدارية والمالية المحترم،،</p>
        <p style="text-align: center; font-weight: bold; margin-bottom: 20px;">السلام عليكم ورحمة الله وبركاته وبعد،</p>

        <p style="font-weight: bold; font-size: 13pt; margin-bottom: 16px; color: #1e3a8a;">
          الموضوع: طلب اعتماد تقرير التدقيق الفصلي لعام 2026م
        </p>

        <p style="line-height: 2; text-align: justify; margin-bottom: 20px;">
          يطيب لنا أن نرفع إلى سعادتكم التقرير الفني والمالي المتضمن حصر الأنشطة التشغيلية والميزانية المنفذة خلال الربع الأول من العام الجاري. وحيث تم استكمال كافة الإجراءات النظامية والمراجعات المحاسبية بدقة متناهية، نأمل من سعادتكم التكرم بالاطلاع والتوجيه بما يلزم لاعتماده رسمياً.
        </p>

        <p style="line-height: 2; margin-bottom: 30px;">
          شاكرين لكم حسن تعاونكم الدائم ودعمكم المستمر لما فيه الصالح العام.
        </p>

        <div style="display: flex; justify-content: space-between; margin-top: 40px;">
          <div>
            <p style="font-weight: bold;">المرفقات:</p>
            <p>1. جدول البيانات المالية التفصيلي</p>
            <p>2. محضر اجتماع اللجنة الإدارية</p>
          </div>
          <div style="text-align: center;">
            <p style="font-weight: bold; font-size: 13pt;">وتقبلوا خالص التحية والتقدير،،،</p>
            <p style="margin-top: 24px; font-weight: bold;">المدير التنفيذي للقطاع</p>
            <p style="margin-top: 16px;">.........................................</p>
          </div>
        </div>
      `,
    },
  },
  {
    id: 'blank_word',
    title: 'مستند فارغ جديد',
    description: 'بدء مستند جديد بتنسيق نظيف وخط عربي فاخر وهوامش قياسية',
    category: 'personal',
    type: 'word',
    thumbnailText: 'مستند فارغ',
    data: {
      title: 'مستند جديد.docx',
      contentHtml: `
        <p style="text-align: center; font-size: 16pt; font-weight: bold; margin-bottom: 20px;">بسم الله الرحمن الرحيم</p>
        <p style="line-height: 1.8;">اكتب محتوى المستند هنا...</p>
      `,
    },
  },
];

// Helper to create the Estate & Debt settlement Excel template
function createEstateSpreadsheet(): SheetData {
  const sheet = createEmptySheet('حصر التركات والديون');
  
  const headers = [
    { id: 'A1', val: 'م' },
    { id: 'B1', val: 'بيان المطالبة / الدين الشرعي' },
    { id: 'C1', val: 'المستحق له' },
    { id: 'D1', val: 'المبلغ المقدر (ريال)' },
    { id: 'E1', val: 'الذهب (جرام عيار 21)' },
    { id: 'F1', val: 'حالة التوثيق' },
    { id: 'G1', val: 'ملاحظات وتفاصيل' },
  ];

  headers.forEach(h => {
    sheet.cells[h.id] = {
      value: h.val,
      displayValue: h.val,
      style: { bold: true, backgroundColor: '#1e3a8a', color: '#ffffff', align: 'center', border: 'all' },
    };
  });

  const rows = [
    { num: '1', desc: 'قرضة ذهب بذمة المورث لزوجته', forWhom: 'والدتنا نبات عبد الله', amount: '0', gold: '21.5', status: 'مثبت بإقرار الورثة', note: 'واجب السداد عيناً أو بالقيمة' },
    { num: '2', desc: 'المهر المؤخر بذمة المورث', forWhom: 'الزوجة نبات عبد الله', amount: '500000', gold: '0', status: 'حجة نكاح شرعية', note: 'دين ممتاز يقدم على القسمة' },
    { num: '3', desc: 'تكاليف علاج المورث والدفن', forWhom: 'مناف وإخوانه', amount: '850000', gold: '0', status: 'سندات ومصروفات علاج', note: 'مصاريف تجهيز ودفن شرعية' },
    { num: '4', desc: 'تكاليف زواج القاصر أسوة بالمدعى عليه', forWhom: 'الابن القاصر', amount: '3000000', gold: '0', status: 'تقدير عرفي وقضائي', note: 'قيمة الجنية المباعة للسداد' },
    { num: '5', desc: 'أمانة أثمان شراء المكتسبات المحررة', forWhom: 'جميع الورثة الشرعيين', amount: '1800000', gold: '0', status: 'بصائر ومحررات مسجلة', note: 'مطلوب إعادتها للتركة' },
  ];

  rows.forEach((r, idx) => {
    const rowNum = idx + 2;
    sheet.cells[`A${rowNum}`] = { value: r.num, displayValue: r.num, style: { align: 'center', border: 'all' } };
    sheet.cells[`B${rowNum}`] = { value: r.desc, displayValue: r.desc, style: { align: 'right', border: 'all' } };
    sheet.cells[`C${rowNum}`] = { value: r.forWhom, displayValue: r.forWhom, style: { align: 'center', border: 'all' } };
    sheet.cells[`D${rowNum}`] = { value: r.amount, displayValue: r.amount, style: { align: 'right', format: 'number', border: 'all' } };
    sheet.cells[`E${rowNum}`] = { value: r.gold, displayValue: r.gold, style: { align: 'center', format: 'number', border: 'all' } };
    sheet.cells[`F${rowNum}`] = { value: r.status, displayValue: r.status, style: { align: 'center', border: 'all' } };
    sheet.cells[`G${rowNum}`] = { value: r.note, displayValue: r.note, style: { align: 'right', border: 'all' } };
  });

  // Total Row
  sheet.cells['A7'] = { value: '', displayValue: '', style: { border: 'all', backgroundColor: '#f1f5f9' } };
  sheet.cells['B7'] = { value: 'إجمالي المبالغ والذهب الواجب إخراجها', displayValue: 'إجمالي المبالغ والذهب الواجب إخراجها', style: { bold: true, align: 'right', backgroundColor: '#f1f5f9', border: 'all' } };
  sheet.cells['C7'] = { value: '', displayValue: '', style: { border: 'all', backgroundColor: '#f1f5f9' } };
  sheet.cells['D7'] = { value: '=SUM(D2:D6)', displayValue: '6150000', style: { bold: true, format: 'currency', align: 'right', backgroundColor: '#fef08a', border: 'all' } };
  sheet.cells['E7'] = { value: '=SUM(E2:E6)', displayValue: '21.5', style: { bold: true, format: 'number', align: 'center', backgroundColor: '#fef08a', border: 'all' } };
  sheet.cells['F7'] = { value: '', displayValue: '', style: { border: 'all', backgroundColor: '#f1f5f9' } };
  sheet.cells['G7'] = { value: 'تخصم قبل قسمة التركة', displayValue: 'تخصم قبل قسمة التركة', style: { bold: true, color: '#dc2626', align: 'center', backgroundColor: '#f1f5f9', border: 'all' } };

  return sheet;
}

// Helper to create an Employee Payroll Excel template
function createPayrollSpreadsheet(): SheetData {
  const sheet = createEmptySheet('كشف الرواتب');

  const headers = [
    { id: 'A1', val: 'رقم الموظف' },
    { id: 'B1', val: 'اسم الموظف' },
    { id: 'C1', val: 'الوظيفة' },
    { id: 'D1', val: 'الراتب الأساسي' },
    { id: 'E1', val: 'بدل السكن' },
    { id: 'F1', val: 'بدل النقل' },
    { id: 'G1', val: 'إجمالي المستحق' },
    { id: 'H1', val: 'الخصومات' },
    { id: 'I1', val: 'صافي الراتب' },
  ];

  headers.forEach(h => {
    sheet.cells[h.id] = {
      value: h.val,
      displayValue: h.val,
      style: { bold: true, backgroundColor: '#047857', color: '#ffffff', align: 'center', border: 'all' },
    };
  });

  const emps = [
    { id: '101', name: 'أحمد محمود العلي', role: 'مدير مالي', basic: '12000', housing: '3000', transport: '1000', ded: '1200' },
    { id: '102', name: 'سارة خالد المنصور', role: 'مهندسة برمجيات', basic: '10500', housing: '2625', transport: '800', ded: '1050' },
    { id: '103', name: 'فيصل عبد الله الحربي', role: 'مدير الموارد البشرية', basic: '9500', housing: '2375', transport: '800', ded: '950' },
    { id: '104', name: 'منى إبراهيم السالم', role: 'محاسبة عامة', basic: '7500', housing: '1875', transport: '600', ded: '750' },
    { id: '105', name: 'عمر طارق الشريف', role: 'أخصائي تسويق', basic: '6800', housing: '1700', transport: '600', ded: '680' },
  ];

  emps.forEach((emp, i) => {
    const r = i + 2;
    sheet.cells[`A${r}`] = { value: emp.id, displayValue: emp.id, style: { align: 'center', border: 'all' } };
    sheet.cells[`B${r}`] = { value: emp.name, displayValue: emp.name, style: { align: 'right', border: 'all' } };
    sheet.cells[`C${r}`] = { value: emp.role, displayValue: emp.role, style: { align: 'center', border: 'all' } };
    sheet.cells[`D${r}`] = { value: emp.basic, displayValue: emp.basic, style: { align: 'right', format: 'number', border: 'all' } };
    sheet.cells[`E${r}`] = { value: emp.housing, displayValue: emp.housing, style: { align: 'right', format: 'number', border: 'all' } };
    sheet.cells[`F${r}`] = { value: emp.transport, displayValue: emp.transport, style: { align: 'right', format: 'number', border: 'all' } };
    sheet.cells[`G${r}`] = { value: `=SUM(D${r}:F${r})`, displayValue: '', style: { bold: true, align: 'right', format: 'number', backgroundColor: '#f0fdf4', border: 'all' } };
    sheet.cells[`H${r}`] = { value: emp.ded, displayValue: emp.ded, style: { align: 'right', format: 'number', color: '#dc2626', border: 'all' } };
    sheet.cells[`I${r}`] = { value: `=G${r}-H${r}`, displayValue: '', style: { bold: true, align: 'right', format: 'currency', backgroundColor: '#dcfce7', border: 'all' } };
  });

  // Totals
  const totRow = 7;
  sheet.cells[`A${totRow}`] = { value: '', displayValue: '', style: { border: 'all', backgroundColor: '#f1f5f9' } };
  sheet.cells[`B${totRow}`] = { value: 'المجموع الكلي', displayValue: 'المجموع الكلي', style: { bold: true, align: 'center', backgroundColor: '#f1f5f9', border: 'all' } };
  sheet.cells[`C${totRow}`] = { value: '', displayValue: '', style: { border: 'all', backgroundColor: '#f1f5f9' } };
  sheet.cells[`D${totRow}`] = { value: `=SUM(D2:D6)`, displayValue: '', style: { bold: true, align: 'right', format: 'number', backgroundColor: '#f1f5f9', border: 'all' } };
  sheet.cells[`E${totRow}`] = { value: `=SUM(E2:E6)`, displayValue: '', style: { bold: true, align: 'right', format: 'number', backgroundColor: '#f1f5f9', border: 'all' } };
  sheet.cells[`F${totRow}`] = { value: `=SUM(F2:F6)`, displayValue: '', style: { bold: true, align: 'right', format: 'number', backgroundColor: '#f1f5f9', border: 'all' } };
  sheet.cells[`G${totRow}`] = { value: `=SUM(G2:G6)`, displayValue: '', style: { bold: true, align: 'right', format: 'number', backgroundColor: '#d1fae5', border: 'all' } };
  sheet.cells[`H${totRow}`] = { value: `=SUM(H2:H6)`, displayValue: '', style: { bold: true, align: 'right', format: 'number', backgroundColor: '#fee2e2', border: 'all' } };
  sheet.cells[`I${totRow}`] = { value: `=SUM(I2:I6)`, displayValue: '', style: { bold: true, align: 'right', format: 'currency', backgroundColor: '#bbf7d0', border: 'all' } };

  return sheet;
}

export const EXCEL_TEMPLATES: TemplateItem[] = [
  {
    id: 'estate_excel',
    title: 'جدول حصر التركات والمطالبات المالية',
    description: 'جدول إكسيل تفصيلي متكامل لحصر مطالبات الديون الشرعية وقيم الذهب ومصاريف التجهيز وحساب الإجماليات',
    category: 'legal',
    type: 'excel',
    thumbnailText: 'حصر التركات',
    data: {
      title: 'حصر_التركات_والمطالبات.xlsx',
      createSheets: () => [createEstateSpreadsheet()],
    },
  },
  {
    id: 'payroll_excel',
    title: 'كشف مسير رواتب ومستحقات الموظفين',
    description: 'جدول رواتب احترافي يشمل البدلات والخصومات وصافي المستحق وصيغ الجمع التلقائي',
    category: 'business',
    type: 'excel',
    thumbnailText: 'مسير الرواتب',
    data: {
      title: 'مسير_رواتب_الموظفين.xlsx',
      createSheets: () => [createPayrollSpreadsheet()],
    },
  },
  {
    id: 'blank_excel',
    title: 'جدول بيانات فارغ (مصنف جديد)',
    description: 'مصنف إكسيل فارغ لبدء الجداول والحسابات من الصفر',
    category: 'personal',
    type: 'excel',
    thumbnailText: 'مصنف فارغ',
    data: {
      title: 'مصنف_اكسيل_جديد.xlsx',
      createSheets: () => [createEmptySheet('ورقة 1')],
    },
  },
];
