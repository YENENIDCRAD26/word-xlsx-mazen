import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { WorkbookState } from '../types';

/**
 * Exports an HTML element (e.g. Word document page or Excel table) to a high-resolution PDF file.
 */
export async function exportElementToPdf(
  element: HTMLElement,
  fileName: string,
  orientation: 'p' | 'l' = 'p'
): Promise<void> {
  // Store previous styles if needed
  const originalScrollTop = element.scrollTop;
  const originalScrollLeft = element.scrollLeft;

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // 2x for sharp retina text and borders
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      onclone: (_clonedDoc, clonedElement) => {
        if (clonedElement instanceof HTMLElement) {
          clonedElement.style.transform = 'none';
          clonedElement.style.boxShadow = 'none';
        }
      },
    });

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    // Subsequent pages if document is longer than one page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    const cleanFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    pdf.save(cleanFileName);
  } finally {
    element.scrollTop = originalScrollTop;
    element.scrollLeft = originalScrollLeft;
  }
}

/**
 * Export Word Document content to PDF using jsPDF
 */
export async function exportWordDocumentToPdf(
  title: string,
  targetElement?: HTMLElement | null
): Promise<void> {
  const element = targetElement || document.querySelector('.document-print-content') as HTMLElement;
  if (!element) {
    throw new Error('لم يتم العثور على عنصر المستند للطباعة والتصدير.');
  }

  const paperContainer = element.closest('.bg-white') as HTMLElement || element;
  await exportElementToPdf(paperContainer, title.replace(/\.[^/.]+$/, ''), 'p');
}

/**
 * Export Excel Workbook Active Sheet to PDF using jsPDF
 */
export async function exportExcelSheetToPdf(
  workbook: WorkbookState,
  targetTableElement?: HTMLElement | null
): Promise<void> {
  const element = targetTableElement || document.querySelector('table') as HTMLElement;
  if (!element) {
    throw new Error('لم يتم العثور على جدول البيانات للتصدير.');
  }

  const activeSheet = workbook.sheets.find(s => s.id === workbook.activeSheetId) || workbook.sheets[0];
  const title = `${workbook.title.replace(/\.[^/.]+$/, '')} - ${activeSheet.name}`;

  // Excel tables usually fit better on landscape ('l')
  await exportElementToPdf(element, title, 'l');
}
