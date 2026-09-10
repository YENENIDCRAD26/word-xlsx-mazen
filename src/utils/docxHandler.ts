import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
} from 'docx';
import mammoth from 'mammoth';

/**
 * Parses HTML string from the rich text editor into docx elements
 */
function htmlToDocxElements(html: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const elements: (Paragraph | Table)[] = [];

  const bodyChildren = Array.from(doc.body.children);

  // Helper to extract text runs from an element
  function extractRuns(node: Node, currentFormat: { bold?: boolean; italic?: boolean; underline?: boolean; color?: string; size?: number } = {}): TextRun[] {
    const runs: TextRun[] = [];

    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      if (text) {
        runs.push(
          new TextRun({
            text: text,
            bold: currentFormat.bold,
            italics: currentFormat.italic,
            underline: currentFormat.underline ? {} : undefined,
            color: currentFormat.color ? currentFormat.color.replace('#', '') : undefined,
            size: currentFormat.size ? currentFormat.size * 2 : 24, // half-points
            font: 'Amiri',
          })
        );
      }
      return runs;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();
      const newFormat = { ...currentFormat };

      if (tag === 'b' || tag === 'strong') newFormat.bold = true;
      if (tag === 'i' || tag === 'em') newFormat.italic = true;
      if (tag === 'u') newFormat.underline = true;
      if (el.style.fontWeight === 'bold') newFormat.bold = true;
      if (el.style.fontStyle === 'italic') newFormat.italic = true;
      if (el.style.textDecoration?.includes('underline')) newFormat.underline = true;
      if (el.style.color) newFormat.color = el.style.color;

      for (const child of Array.from(el.childNodes)) {
        runs.push(...extractRuns(child, newFormat));
      }
    }

    return runs;
  }

  function getAlignment(el: HTMLElement) {
    const align = el.style.textAlign || el.getAttribute('align') || 'right';
    if (align === 'center') return AlignmentType.CENTER;
    if (align === 'left') return AlignmentType.LEFT;
    if (align === 'justify') return AlignmentType.JUSTIFIED;
    return AlignmentType.RIGHT; // Default to right for Arabic
  }

  if (bodyChildren.length === 0) {
    // If no direct child elements, treat entire innerText as paragraphs
    const textLines = (doc.body.innerText || '').split('\n');
    for (const line of textLines) {
      if (line.trim()) {
        elements.push(
          new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: line, font: 'Amiri', size: 26 })],
          })
        );
      }
    }
    return elements;
  }

  for (const child of bodyChildren) {
    const el = child as HTMLElement;
    const tag = el.tagName.toLowerCase();

    if (tag === 'table') {
      const rows: TableRow[] = [];
      const trElements = Array.from(el.querySelectorAll('tr'));

      for (const tr of trElements) {
        const cells: TableCell[] = [];
        const tdElements = Array.from(tr.querySelectorAll('th, td'));

        for (const td of tdElements) {
          const textRuns = extractRuns(td);
          cells.push(
            new TableCell({
              children: [
                new Paragraph({
                  bidirectional: true,
                  alignment: AlignmentType.CENTER,
                  children: textRuns.length > 0 ? textRuns : [new TextRun({ text: td.textContent || '', font: 'Amiri' })],
                }),
              ],
              borders: {
                top: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
                bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
                left: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
                right: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
              },
            })
          );
        }

        if (cells.length > 0) {
          rows.push(new TableRow({ children: cells }));
        }
      }

      if (rows.length > 0) {
        elements.push(
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows,
          })
        );
      }
    } else {
      // Paragraph or Heading or List
      const runs = extractRuns(el);
      elements.push(
        new Paragraph({
          bidirectional: true,
          alignment: getAlignment(el),
          spacing: { after: 120, line: 360 },
          children: runs.length > 0 ? runs : [new TextRun({ text: el.textContent || '', font: 'Amiri', size: 26 })],
        })
      );
    }
  }

  return elements;
}

/**
 * Exports HTML document as a real .docx file using 'docx' library
 */
export async function downloadAsDocx(title: string, htmlContent: string) {
  try {
    const elements = htmlToDocxElements(htmlContent);

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440, // 1 inch (in twips)
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
            },
          },
          children: elements,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.trim() || 'document'}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting DOCX:', error);
    throw error;
  }
}

/**
 * Imports a .docx file and returns HTML content using mammoth
 */
export async function importDocxFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer });
  return result.value;
}

/**
 * Imports a plain text file into formatted HTML paragraphs
 */
export async function importTextFile(file: File): Promise<string> {
  const text = await file.text();
  return text
    .split('\n')
    .map(line => `<p>${line.trim() ? line : '<br>'}</p>`)
    .join('');
}
