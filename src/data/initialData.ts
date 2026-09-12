import { CellData, ExcelSheet, ExcelState, WordDocumentState } from '../types';

export const INITIAL_WORD_DOCUMENT: WordDocumentState = {
  title: '0 - Mazen.doc',
  fontFamily: "'Amiri', serif",
  fontSize: 15,
  isBold: false,
  isItalic: false,
  isUnderline: false,
  isStrike: false,
  isSubscript: false,
  isSuperscript: false,
  textColor: '#1e293b',
  highlightColor: 'transparent',
  textAlign: 'right',
  lineSpacing: 1.8,
  direction: 'rtl',
  margins: 'normal',
  orientation: 'portrait',
  paperSize: 'A4',
  columns: 1,
  zoom: 100,
  showRuler: true,
  showBorders: true,
  isReadingMode: false,
  headerText: 'مستند رسمي - محرر وورد أوفيس برو',
  footerText: 'وفقاً للأحكام والأنظمة الشرعية ذات الصلة.',
  contentHtml: `
    <div style="text-align: center; margin-bottom: 25px;">
      <h2 style="font-size: 26px; font-weight: bold; margin: 0 0 8px 0; font-family: 'Amiri', serif;">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</h2>
      <h3 style="font-size: 20px; font-weight: bold; text-decoration: underline; margin: 0; font-family: 'Amiri', serif;">أمام محكمة القفر الإبتدائية</h3>
    </div>

    <div style="margin-bottom: 20px; font-size: 16px; line-height: 2;">
      <p style="margin: 4px 0;"><strong>المدعى عليه:</strong> أنس مسعد غلاب</p>
      <p style="margin: 4px 0;"><strong>فضيلة الأخ رئيس محكمة القفر الإبتدائية ....................................... الأكرم،</strong></p>
      <p style="text-align: center; font-weight: bold; margin: 12px 0;">تحية طيبة وبعد ،،</p>
    </div>

    <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 12px; text-align: center; margin: 20px 0;">
      <p style="font-size: 17px; font-weight: bold; margin: 0;">الموضوع: (الطلبات الشرعية التي يجب إخراجها قبل الشروع في القسمة وتحرير الفصول)</p>
    </div>

    <div style="text-align: justify; line-height: 2.2; font-size: 16px;">
      <p>
        إشارة إلى الموضوع أعلاه؛ نطلب من عدالتكم الموقرة الفصل في موضوع طلباتنا الشرعية اللازمة والمفترض شرعاً إخراجها أولاً، كونها شرطاً أساسياً لصلاحية القسمة، ومنها ما يلي:
      </p>
      <p>
        <strong>أولاً:</strong> إخراج المديونية التي على ذمة المورث الموضحة بالآتي:<br/>
        • ............... جراماً ونصف الجرام ذهب، عيار واحد وعشرين (21)، بذمة المورث، قرضة لزوجته (والدتنا).<br/>
        • المهر المؤخر الذي ما زال بذمة المورث لصالح والدتنا.<br/>
        • تكاليف علاج المورث، وتكاليف الدفن، والديون التي على ذمة المورث بمبلغ وقدره .............................<br/>
        • تكاليف زواج القاصر المقدرة بمبلغ ثلاثة ملايين ريال يمني أسوة بالمدعى عليه، الذي تكفلت حينها مبلغ ثلاثة ملايين ريال أغلبها ديون وتم تسديد مديونية زواجه ببيع "الجنية" لقرض تسديد ما تبقى من مديونية زواجه.
      </p>
      <p>
        <strong>ثانياً:</strong> إلزام المدعى عليه بتسليم المنقولات والمقتنيات والمنهوبات العينية والنقدية التي بحوزته:<br/>
        والموضحة سابقاً في جدول الحصر وعريضة المبالغ النقدية والعينية المسلمة بيد المدعى عليه والموضحة والمفندة، ونذكر منها: [....................................................................................]
      </p>
      <p>
        <strong>ثالثاً:</strong> إلزام المدعى عليه بتسليم المحررات وبصائر شراء المكتسبات وتحريزها:<br/>
        لدى والدتنا، لضمان عدم عبث المدعى عليه بها أو التصرف فيها، بحجة أن المدعى عليه خان الأمانة حينما سلمناه الأثمان الخاصة بالشراء وقام بتحرير البصائر باسمه الشخصي.
      </p>
      <p style="text-align: center; font-weight: bold; margin: 15px 0;">
        نحتفظ بكافة حقوقنا الشرعية السابقة واللاحقة....
      </p>
    </div>

    <div style="margin-top: 30px; border-top: 1px dashed #94a3b8; padding-top: 20px;">
      <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
        <tr>
          <td style="width: 50%; vertical-align: top; border-left: 1px solid #e2e8f0; padding-left: 15px;">
            <p style="font-weight: bold; margin-bottom: 8px;">مقدمو الطلب / المدعون:</p>
            <ol style="margin: 0; padding-right: 20px; line-height: 1.8;">
              <li>نورية مسعد غلاب</li>
              <li>أمة الوهاب مسعد غلاب</li>
              <li>تيسير مسعد غلاب</li>
              <li>محمد مسعد غلاب</li>
              <li>مناف مسعد غلاب</li>
            </ol>
            <p style="font-size: 13px; color: #64748b; margin-top: 6px;">عنهم / مناف مسعد غلاب .....</p>
          </td>
          <td style="width: 50%; vertical-align: top; padding-right: 15px;">
            <p style="font-weight: bold; margin-bottom: 8px;">بحضور وتأكيد وإقرار:</p>
            <p style="line-height: 1.8; margin: 0 0 15px 0;">
              والدتنا الطاهرة الحرة / نبات عبد الله فارع الرصاص، أمام عدالة المحكمة بهيئتها الموقرة.
            </p>
            <p style="font-weight: bold;">
              التوقيع / البصمة: .......................................
            </p>
          </td>
        </tr>
      </table>
    </div>
  `
};

export const INITIAL_EXCEL_SHEETS: ExcelSheet[] = [
  {
    id: 'sheet-1',
    name: 'حصر التركات والمطالبات',
    rowCount: 45,
    colCount: 16,
    freezeRow: 1,
    freezeCol: 2,
    data: {
      // Row 1 - Header
      'A1': { value: 'م', bold: true, align: 'center', bg: '#15803d', color: '#ffffff' },
      'B1': { value: 'بيان المطالبة / الدين الشرعي', bold: true, align: 'center', bg: '#166534', color: '#ffffff' },
      'C1': { value: 'المستحق له', bold: true, align: 'center', bg: '#166534', color: '#ffffff' },
      'D1': { value: 'المبلغ المقدر (ريال)', bold: true, align: 'center', bg: '#166534', color: '#ffffff' },
      'E1': { value: 'الذهب (جرام عيار 21)', bold: true, align: 'center', bg: '#166534', color: '#ffffff' },
      'F1': { value: 'حالة التوثيق', bold: true, align: 'center', bg: '#166534', color: '#ffffff' },

      // Row 2
      'A2': { value: '1', align: 'center' },
      'B2': { value: 'قرضة ذهب بذمة المورث لزوجته', align: 'right' },
      'C2': { value: 'والدتنا نبات عبد الله', align: 'right' },
      'D2': { value: '0', format: 'currency_sar', align: 'left' },
      'E2': { value: '21.50', format: 'number', align: 'left' },
      'F2': { value: 'مثبت بإقرار الورثة', align: 'center' },

      // Row 3
      'A3': { value: '2', align: 'center' },
      'B3': { value: 'المهر المؤخر بذمة المورث', align: 'right' },
      'C3': { value: 'الزوجة نبات عبد الله', align: 'right' },
      'D3': { value: '5000000', format: 'currency_sar', align: 'left' },
      'E3': { value: '0.00', format: 'number', align: 'left' },
      'F3': { value: 'حجة نكاح شرعي', align: 'center' },

      // Row 4
      'A4': { value: '3', align: 'center' },
      'B4': { value: 'تكاليف علاج المورث والدفن', align: 'right' },
      'C4': { value: 'مناف وإخوانه', align: 'right' },
      'D4': { value: '850000', format: 'currency_sar', align: 'left' },
      'E4': { value: '0.00', format: 'number', align: 'left' },
      'F4': { value: 'سندات ومصروفات', align: 'center' },

      // Row 5
      'A5': { value: '4', align: 'center' },
      'B5': { value: 'تكاليف زواج القاصر أسوة بالمدعى عليه', align: 'right' },
      'C5': { value: 'الابن القاصر', align: 'right' },
      'D5': { value: '3000000', format: 'currency_sar', align: 'left' },
      'E5': { value: '0.00', format: 'number', align: 'left' },
      'F5': { value: 'تقدير عرفي وقضائي', align: 'center' },

      // Row 6
      'A6': { value: '5', align: 'center' },
      'B6': { value: 'أمانة أثمان شراء المكتسبات المحررة', align: 'right' },
      'C6': { value: 'جميع الورثة الشرعيين', align: 'right' },
      'D6': { value: '1800000', format: 'currency_sar', align: 'left' },
      'E6': { value: '0.00', format: 'number', align: 'left' },
      'F6': { value: 'بصائر ومحررات معتمدة', align: 'center' },

      // Row 7 - Totals
      'A7': { value: '∑', bold: true, align: 'center', bg: '#fef08a' },
      'B7': { value: 'إجمالي المبالغ والذهب الواجب إخراجها', bold: true, align: 'right', bg: '#fef08a' },
      'C7': { value: '-', align: 'center', bg: '#fef08a' },
      'D7': { value: '', formula: '=SUM(D2:D6)', bold: true, format: 'currency_sar', align: 'left', bg: '#fef08a' },
      'E7': { value: '', formula: '=SUM(E2:E6)', bold: true, format: 'number', align: 'left', bg: '#fef08a' },
      'F7': { value: 'معتمد للحسم قبل القسمة', bold: true, align: 'center', bg: '#fef08a' },
    }
  },
  {
    id: 'sheet-2',
    name: 'بيان المصاريف والتوثيق',
    rowCount: 30,
    colCount: 12,
    data: {
      'A1': { value: 'م', bold: true, align: 'center', bg: '#0284c7', color: '#ffffff' },
      'B1': { value: 'البند', bold: true, align: 'center', bg: '#0369a1', color: '#ffffff' },
      'C1': { value: 'القيمة التقديرية', bold: true, align: 'center', bg: '#0369a1', color: '#ffffff' },
      'D1': { value: 'الملاحظات', bold: true, align: 'center', bg: '#0369a1', color: '#ffffff' },

      'A2': { value: '1', align: 'center' },
      'B2': { value: 'رسوم المحكمة والتوثيق', align: 'right' },
      'C2': { value: '150000', format: 'currency_sar', align: 'left' },
      'D2': { value: 'سند رسمي', align: 'right' },

      'A3': { value: '2', align: 'center' },
      'B3': { value: 'أتعاب الخبير العدلي الهندسي', align: 'right' },
      'C3': { value: '200000', format: 'currency_sar', align: 'left' },
      'D3': { value: 'مخططات مساحية', align: 'right' },

      'A4': { value: 'المجموع', bold: true, align: 'center', bg: '#bae6fd' },
      'B4': { value: 'إجمالي الرسوم التقديرية', bold: true, align: 'right', bg: '#bae6fd' },
      'C4': { value: '', formula: '=SUM(C2:C3)', bold: true, format: 'currency_sar', align: 'left', bg: '#bae6fd' },
      'D4': { value: '', bg: '#bae6fd' },
    }
  }
];

export const INITIAL_EXCEL_STATE: ExcelState = {
  title: 'حصر_التركات_والمطالبات.xlsx',
  sheets: INITIAL_EXCEL_SHEETS,
  activeSheetId: 'sheet-1',
  selectedCell: 'B2',
  isEditing: false,
  formulaInput: '',
  zoom: 100,
};

// Aliases for convenience
export const initialWordDocument = INITIAL_WORD_DOCUMENT;
export const initialExcelData = INITIAL_EXCEL_STATE;
