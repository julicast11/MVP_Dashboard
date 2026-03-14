import { useState, useRef, useEffect } from 'react';
import { Download, FileText, Image, FileSpreadsheet } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function ExportMenu({ targetRef, fileName = 'dashboard-export' }) {
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const menuRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const exportPNG = async () => {
    if (!targetRef?.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(targetRef.current, {
        backgroundColor: '#f8fafc',
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `${fileName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setExporting(false);
      setOpen(false);
    }
  };

  const exportPDF = async () => {
    if (!targetRef?.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(targetRef.current, {
        backgroundColor: '#f8fafc',
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const pdfWidth = 297; // A4 landscape width in mm
      const pdfHeight = 210; // A4 landscape height in mm
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const width = imgWidth * ratio;
      const height = imgHeight * ratio;

      const pdf = new jsPDF({
        orientation: width > height ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      pdf.addImage(imgData, 'PNG', (pdf.internal.pageSize.getWidth() - width) / 2, 10, width, height);
      pdf.save(`${fileName}.pdf`);
    } finally {
      setExporting(false);
      setOpen(false);
    }
  };

  const exportCSV = () => {
    if (!targetRef?.current) return;
    // Extract table data from the current view
    const tables = targetRef.current.querySelectorAll('table');
    let csv = '';

    if (tables.length > 0) {
      tables.forEach((table, tableIdx) => {
        if (tableIdx > 0) csv += '\n\n';
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
          const cells = row.querySelectorAll('th, td');
          const values = Array.from(cells).map(cell =>
            `"${cell.textContent.trim().replace(/"/g, '""')}"`
          );
          csv += values.join(',') + '\n';
        });
      });
    }

    // Also extract KPI card data
    const kpiCards = targetRef.current.querySelectorAll('[class*="border-l-4"]');
    if (kpiCards.length > 0) {
      if (csv) csv += '\n\n';
      csv += '"Metric","Value","Change"\n';
      kpiCards.forEach(card => {
        const spans = card.querySelectorAll('span');
        const label = spans[0]?.textContent?.trim() || '';
        const value = spans[1]?.textContent?.trim() || '';
        const delta = spans[2]?.textContent?.trim() || '';
        csv += `"${label}","${value}","${delta}"\n`;
      });
    }

    if (!csv) {
      csv = 'No tabular data available for this view.\nUse PNG or PDF export for charts.';
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    setOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        disabled={exporting}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
      >
        <Download className="w-3.5 h-3.5" />
        {exporting ? 'Exporting...' : 'Export'}
      </button>

      {open && (
        <div className="absolute right-0 top-9 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1">
          <button
            onClick={exportCSV}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Export CSV
          </button>
          <button
            onClick={exportPNG}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Image className="w-4 h-4 text-blue-600" />
            Export PNG
          </button>
          <button
            onClick={exportPDF}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <FileText className="w-4 h-4 text-red-600" />
            Export PDF
          </button>
        </div>
      )}
    </div>
  );
}
