'use client';

// Strategy Pattern: setiap format ekspor mengimplementasikan interface yang sama,
// sehingga menambah format baru di masa depan tidak perlu mengubah kode pemanggil
// (Open/Closed Principle, sesuai Design Pattern pada SDD).
export interface ReportExporter {
  export(rows: Record<string, string | number>[], filename: string): Promise<void>;
}

export const PdfExportStrategy: ReportExporter = {
  async export(rows, filename) {
    const { default: jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;

    const doc = new jsPDF();
    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
    const body = rows.map((row) => columns.map((col) => String(row[col] ?? '')));

    doc.text('SI-KEHATI — Laporan Keanekaragaman Hayati', 14, 16);
    autoTable(doc, { head: [columns], body, startY: 22 });
    doc.save(`${filename}.pdf`);
  },
};

export const ExcelExportStrategy: ReportExporter = {
  async export(rows, filename) {
    const XLSX = await import('xlsx');
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan');
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  },
};

export function getExporter(format: 'pdf' | 'excel'): ReportExporter {
  return format === 'pdf' ? PdfExportStrategy : ExcelExportStrategy;
}
