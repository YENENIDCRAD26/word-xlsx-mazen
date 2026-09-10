/**
 * Arabic Spell Check and Suggestion Engine
 * Provides validation, error detection, and contextual suggestions for common Arabic typographical and orthographical errors.
 */

export interface SpellIssue {
  id: string;
  word: string;
  cleanWord: string;
  index: number;
  length: number;
  suggestions: string[];
  type: 'hamza' | 'taa_marbuta' | 'yaa_maqsura' | 'common_typo' | 'punctuation';
  reason: string;
}

// Map of common incorrect words to their correct replacements
export const COMMON_ARABIC_CORRECTIONS: Record<string, { correct: string[]; type: SpellIssue['type']; reason: string }> = {
  // Hamza issues (همزات القطع والوصل)
  'انشاء': { correct: ['إنشاء', 'إن شاء الله'], type: 'hamza', reason: 'همزة قطع مكسورة تحت الألف' },
  'انشاءالله': { correct: ['إن شاء الله'], type: 'common_typo', reason: 'تُكتب منفصلة: إن شاء الله' },
  'انشالله': { correct: ['إن شاء الله'], type: 'common_typo', reason: 'تُكتب منفصلة: إن شاء الله' },
  'اجراء': { correct: ['إجراء'], type: 'hamza', reason: 'همزة قطع مكسورة' },
  'اجراءات': { correct: ['إجراءات'], type: 'hamza', reason: 'همزة قطع مكسورة' },
  'اعداد': { correct: ['إعداد'], type: 'hamza', reason: 'همزة قطع مكسورة' },
  'ارسال': { correct: ['إرسال'], type: 'hamza', reason: 'همزة قطع مكسورة' },
  'اعتماد': { correct: ['اعتماد'], type: 'hamza', reason: 'همزة وصل خماسية' },
  'استفسار': { correct: ['استفسار'], type: 'hamza', reason: 'همزة وصل سداسية' },
  'استلام': { correct: ['استلام'], type: 'hamza', reason: 'همزة وصل خماسية' },
  'استخراج': { correct: ['استخراج'], type: 'hamza', reason: 'همزة وصل سداسية' },
  'امكانيه': { correct: ['إمكانية'], type: 'hamza', reason: 'همزة قطع وتاء مربوطة' },
  'امكانية': { correct: ['إمكانية'], type: 'hamza', reason: 'همزة قطع مكسورة' },
  'الادارة': { correct: ['الإدارة'], type: 'hamza', reason: 'همزة قطع مكسورة' },
  'ادارة': { correct: ['إدارة'], type: 'hamza', reason: 'همزة قطع مكسورة' },
  'الاستاذ': { correct: ['الأستاذ'], type: 'hamza', reason: 'همزة قطع مفتوحة' },
  'استاذ': { correct: ['أستاذ'], type: 'hamza', reason: 'همزة قطع مفتوحة' },
  'ايميل': { correct: ['إيميل', 'بريد إلكتروني'], type: 'hamza', reason: 'همزة قطع مكسورة' },
  'الايميل': { correct: ['الإيميل', 'البريد الإلكتروني'], type: 'hamza', reason: 'همزة قطع مكسورة' },
  'الانترنت': { correct: ['الإنترنت'], type: 'hamza', reason: 'همزة قطع مكسورة' },
  'انترنت': { correct: ['إنترنت'], type: 'hamza', reason: 'همزة قطع مكسورة' },
  'مسئول': { correct: ['مسؤول'], type: 'hamza', reason: 'تُكتب على الواو وفقاً للقواعد القياسية' },
  'مسئولين': { correct: ['مسؤولين'], type: 'hamza', reason: 'تُكتب على الواو' },
  'مسئولية': { correct: ['مسؤولية'], type: 'hamza', reason: 'تُكتب على الواو' },
  'شئون': { correct: ['شؤون'], type: 'hamza', reason: 'تُكتب على الواو' },
  'رئيسيه': { correct: ['رئيسية'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'هيئه': { correct: ['هيئة'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },

  // Taa Marbuta vs Haa (التاء المربوطة والهاء)
  'محكمه': { correct: ['محكمة'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'المحكمه': { correct: ['المحكمة'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'شركه': { correct: ['شركة'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'الشركه': { correct: ['الشركة'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'مدينه': { correct: ['مدينة'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'مدرسه': { correct: ['مدرسة'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'جامعه': { correct: ['جامعة'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'مكتبه': { correct: ['مكتبة'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'لجنه': { correct: ['لجنة'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'اللجنه': { correct: ['اللجنة'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'خدمه': { correct: ['خدمة'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'الخدمه': { correct: ['الخدمة'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'وثيقه': { correct: ['وثيقة'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'صيغه': { correct: ['صيغة'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'ملاحظه': { correct: ['ملاحظة'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'فاتوره': { correct: ['فاتورة'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'ميزانيه': { correct: ['ميزانية'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'الميزانيه': { correct: ['الميزانية'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'سياسه': { correct: ['سياسة'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'حكومه': { correct: ['حكومة'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'مؤسسه': { correct: ['مؤسسة'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'مملكه': { correct: ['مملكة'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'المملكه': { correct: ['المملكة'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'دوله': { correct: ['دولة'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'الدوله': { correct: ['الدولة'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'قيمه': { correct: ['قيمة'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'نسبه': { correct: ['نسبة'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'طريقه': { correct: ['طريقة'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'رساله': { correct: ['رسالة'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'نسخه': { correct: ['نسخة'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'صفحه': { correct: ['صفحة'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'قائمه': { correct: ['قائمة'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'كامله': { correct: ['كاملة'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'شامله': { correct: ['شاملة'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'خاصه': { correct: ['خاصة'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'عامه': { correct: ['عامة'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'قضيه': { correct: ['قضية'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'القضيه': { correct: ['القضية'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'دعوه': { correct: ['دعوة', 'دعوى'], type: 'taa_marbuta', reason: 'تمييز بين الدعوة والدعوى القضائية' },
  'جلسه': { correct: ['جلسة'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'الجلسه': { correct: ['الجلسة'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'مذكره': { correct: ['مذكرة'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'المذكره': { correct: ['المذكرة'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'اتفاقيه': { correct: ['اتفاقية'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },
  'الاتفاقيه': { correct: ['الاتفاقية'], type: 'taa_marbuta', reason: 'تاء مربوطة منقوطة' },

  // Yaa vs Alef Maqsura (الياء والألف المقصورة)
  'الي': { correct: ['إلى'], type: 'yaa_maqsura', reason: 'حرف جر ينتهي بألف مقصورة وهمزة مكسورة' },
  'علي': { correct: ['على', 'عليّ'], type: 'yaa_maqsura', reason: 'حرف جر ينتهي بألف مقصورة (على)' },
  'حتي': { correct: ['حتى'], type: 'yaa_maqsura', reason: 'تنتهي بألف مقصورة' },
  'لدي': { correct: ['لدى'], type: 'yaa_maqsura', reason: 'تنتهي بألف مقصورة' },
  'متي': { correct: ['متى'], type: 'yaa_maqsura', reason: 'تنتهي بألف مقصورة' },
  'أخري': { correct: ['أخرى'], type: 'yaa_maqsura', reason: 'تنتهي بألف مقصورة' },
  'اخري': { correct: ['أخرى'], type: 'yaa_maqsura', reason: 'همزة قطع وألف مقصورة' },
  'كبري': { correct: ['كبرى'], type: 'yaa_maqsura', reason: 'تنتهي بألف مقصورة' },
  'دعوي': { correct: ['دعوى'], type: 'yaa_maqsura', reason: 'الدعوى القضائية تنتهي بألف مقصورة' },
  'الدعوي': { correct: ['الدعوى'], type: 'yaa_maqsura', reason: 'تنتهي بألف مقصورة' },
  'فتوي': { correct: ['فتوى'], type: 'yaa_maqsura', reason: 'تنتهي بألف مقصورة' },
  'مستشفي': { correct: ['مستشفى'], type: 'yaa_maqsura', reason: 'تنتهي بألف مقصورة' },
  'منتدي': { correct: ['منتدى'], type: 'yaa_maqsura', reason: 'تنتهي بألف مقصورة' },
  'معني': { correct: ['معنى'], type: 'yaa_maqsura', reason: 'تنتهي بألف مقصورة' },
  'مبني': { correct: ['مبنى'], type: 'yaa_maqsura', reason: 'تنتهي بألف مقصورة' },
  'المدعى': { correct: ['المدعي', 'المدعى عليه'], type: 'yaa_maqsura', reason: 'إذا كان فاعلاً (المدعي) ياء منقوطة' },

  // Common Typos & Tanween
  'الذى': { correct: ['الذي'], type: 'common_typo', reason: 'اسم موصول بالياء المنقوطة' },
  'التى': { correct: ['التي'], type: 'common_typo', reason: 'اسم موصول بالياء المنقوطة' },
  'هاذا': { correct: ['هذا'], type: 'common_typo', reason: 'اسم إشارة يُنطق بألف ولا يُكتب' },
  'هاذه': { correct: ['هذه'], type: 'common_typo', reason: 'اسم إشارة يُنطق بألف ولا يُكتب' },
  'هاؤلاء': { correct: ['هؤلاء'], type: 'common_typo', reason: 'اسم إشارة يُكتب بدون ألف بعد الهاء' },
  'ذالك': { correct: ['ذلك'], type: 'common_typo', reason: 'اسم إشارة بدون ألف' },
  'لاكن': { correct: ['لكن', 'لكنّ'], type: 'common_typo', reason: 'حرف استدراك بدون ألف' },
  'هاكذا': { correct: ['هكذا'], type: 'common_typo', reason: 'بدون ألف بعد الهاء' },
  'شكرا': { correct: ['شكراً'], type: 'common_typo', reason: 'تنوين فتح على الألف' },
  'ايضا': { correct: ['أيضاً'], type: 'common_typo', reason: 'همزة قطع وتنوين فتح' },
  'دائما': { correct: ['دائماً'], type: 'common_typo', reason: 'تنوين فتح على الألف' },
  'مرحبا': { correct: ['مرحباً'], type: 'common_typo', reason: 'تنوين فتح على الألف' },
  'اهلا': { correct: ['أهلاً'], type: 'common_typo', reason: 'همزة وتنوين فتح' },
  'سهلا': { correct: ['سهلاً'], type: 'common_typo', reason: 'تنوين فتح على الألف' },
  'جدا': { correct: ['جداً'], type: 'common_typo', reason: 'تنوين فتح على الألف' },
  'جميعا': { correct: ['جميعاً'], type: 'common_typo', reason: 'تنوين فتح على الألف' },
  'تقريبا': { correct: ['تقريباً'], type: 'common_typo', reason: 'تنوين فتح على الألف' },
  'مبروك': { correct: ['مبارك'], type: 'common_typo', reason: 'الأصح لغوياً: مبارك (اسم مفعول من بارك)' },
  'غير صحيح بالمرة': { correct: ['غير صحيح بتاتاً', 'غير صحيح إطلاقاً'], type: 'common_typo', reason: 'استعمال لغوي أفضل' },
};

/**
 * Clean punctuation from word ends to check vocabulary
 */
export function cleanArabicWord(word: string): { clean: string; prefix: string; suffix: string } {
  // Extract leading/trailing symbols, quotes, punctuation
  const match = word.match(/^([^\u0621-\u064A\u0671-\u06D3]*)([\u0621-\u064A\u0671-\u06D3]+)([^\u0621-\u064A\u0671-\u06D3]*)$/);
  if (!match) {
    return { clean: word, prefix: '', suffix: '' };
  }
  return {
    clean: match[2],
    prefix: match[1],
    suffix: match[3],
  };
}

/**
 * Scan plain text and detect spelling errors
 */
export function detectSpellingIssues(text: string): SpellIssue[] {
  const issues: SpellIssue[] = [];
  if (!text || text.trim() === '') return issues;

  // Split by whitespace while tracking indices
  const regex = /([\u0621-\u064A\u0671-\u06D3\w\-']+)/g;
  let match: RegExpExecArray | null;

  let issueCounter = 0;

  while ((match = regex.exec(text)) !== null) {
    const rawWord = match[0];
    const index = match.index;
    const { clean } = cleanArabicWord(rawWord);

    if (!clean || clean.length < 2) continue;

    // Check direct dictionary match
    const found = COMMON_ARABIC_CORRECTIONS[clean];
    if (found) {
      issues.push({
        id: `spell_${issueCounter++}_${index}`,
        word: rawWord,
        cleanWord: clean,
        index,
        length: rawWord.length,
        suggestions: found.correct,
        type: found.type,
        reason: found.reason,
      });
      continue;
    }

    // Heuristic 1: Starts with 'ال' followed by a known root typo
    if (clean.startsWith('ال') && clean.length > 3) {
      const withoutAl = clean.substring(2);
      const foundWithoutAl = COMMON_ARABIC_CORRECTIONS[withoutAl];
      if (foundWithoutAl) {
        issues.push({
          id: `spell_${issueCounter++}_${index}`,
          word: rawWord,
          cleanWord: clean,
          index,
          length: rawWord.length,
          suggestions: foundWithoutAl.correct.map(s => 'ال' + s),
          type: foundWithoutAl.type,
          reason: foundWithoutAl.reason,
        });
        continue;
      }
    }

    // Heuristic 2: Ends with 'ه' and likely feminine noun requiring 'ة'
    // E.g. 'سريعه', 'قانونيه', 'عاليه', 'قويه'
    if (clean.endsWith('يه') && clean.length > 3 && !['فيه', 'عليه', 'إليه', 'لديه', 'بيه'].includes(clean)) {
      const suggested = clean.slice(0, -1) + 'ة';
      issues.push({
        id: `spell_${issueCounter++}_${index}`,
        word: rawWord,
        cleanWord: clean,
        index,
        length: rawWord.length,
        suggestions: [suggested],
        type: 'taa_marbuta',
        reason: 'اللاحقة (ـية) في الأسماء والصفات تنتهي بتاء مربوطة منقوطة',
      });
      continue;
    }
  }

  return issues;
}
