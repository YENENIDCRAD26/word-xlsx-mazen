/**
 * Utility for parsing headings (H1, H2, H3) from Word document HTML
 * and generating an interactive, styled Table of Contents (فهرس المحتويات).
 */

export interface TocItem {
  id: string;
  text: string;
  level: 1 | 2 | 3;
}

/**
 * Parses headings from HTML content and returns list of items
 */
export function extractHeadingsFromHtml(html: string): { items: TocItem[]; modifiedHtml: string } {
  if (!html || typeof document === 'undefined') {
    return { items: [], modifiedHtml: html };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const headings = doc.querySelectorAll('h1, h2, h3, h4');
  const items: TocItem[] = [];

  let counter = 1;
  headings.forEach(heading => {
    const text = heading.textContent?.trim() || '';
    if (!text) return;

    // Check if it already has an anchor id, else assign one
    let id = heading.getAttribute('id');
    if (!id || id.trim() === '') {
      id = `heading-section-${counter++}`;
      heading.setAttribute('id', id);
    }

    const tagName = heading.tagName.toLowerCase();
    const level: 1 | 2 | 3 = tagName === 'h1' ? 1 : tagName === 'h2' ? 2 : 3;

    items.push({
      id,
      text,
      level,
    });
  });

  return {
    items,
    modifiedHtml: doc.body.innerHTML,
  };
}

/**
 * Builds the HTML for the Table of Contents block
 */
export function buildTableOfContentsHtml(items: TocItem[]): string {
  if (items.length === 0) {
    return `
      <div class="toc-container my-6 p-5 bg-neutral-50 rounded-xl border border-neutral-300 text-right select-none" contenteditable="false">
        <div class="flex items-center justify-between border-b border-neutral-300 pb-2 mb-3">
          <span class="text-emerald-800 font-bold text-base">📑 جدول المحتويات (فهرس المستند)</span>
        </div>
        <p class="text-xs text-neutral-500 italic">لم يتم العثور على عناوين (H1, H2, H3) في المستند بعد. قم بإضافة عناوين باستخدام قائمة التنسيق ليتم تضمينها تلقائياً.</p>
      </div>
    `;
  }

  let listItemsHtml = '';
  items.forEach((item, index) => {
    const indentClass = item.level === 1 ? 'font-bold text-neutral-900 text-sm' : item.level === 2 ? 'mr-6 text-neutral-800 text-xs font-semibold' : 'mr-12 text-neutral-600 text-xs';
    const marker = item.level === 1 ? `المبحث ${index + 1}:` : item.level === 2 ? `•` : `-`;

    listItemsHtml += `
      <li class="flex items-center justify-between gap-2 py-1.5 border-b border-neutral-200/60 hover:bg-emerald-50/50 px-2 rounded transition-colors group">
        <a href="#${item.id}" class="flex items-baseline gap-2 flex-1 text-emerald-950 group-hover:text-emerald-700 cursor-pointer no-underline ${indentClass}">
          <span class="text-emerald-700 shrink-0 select-none">${marker}</span>
          <span class="hover:underline">${item.text}</span>
        </a>
        <span class="flex-1 border-b border-dotted border-neutral-400 mx-2 select-none h-3"></span>
        <span class="font-mono text-xs text-neutral-500 font-semibold bg-neutral-200/70 px-2 py-0.5 rounded select-none">صـ ${item.level === 1 ? index + 1 : ''}</span>
      </li>
    `;
  });

  return `
    <div id="document-table-of-contents" class="toc-container my-6 p-5 bg-gradient-to-br from-neutral-50 to-emerald-50/30 rounded-xl border-2 border-dashed border-emerald-300 text-right shadow-xs select-none" contenteditable="false">
      <div class="flex items-center justify-between border-b border-emerald-200 pb-2 mb-4">
        <div class="flex items-center gap-2">
          <span class="text-emerald-800 font-extrabold text-base">📑 جدول المحتويات (فهرس المستند التلقائي)</span>
          <span class="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">${items.length} عناوين</span>
        </div>
        <span class="text-[11px] text-emerald-700 font-medium select-none">انقر للانتقال المباشر</span>
      </div>
      <ul class="space-y-1 list-none p-0 m-0">
        ${listItemsHtml}
      </ul>
    </div>
  `;
}
