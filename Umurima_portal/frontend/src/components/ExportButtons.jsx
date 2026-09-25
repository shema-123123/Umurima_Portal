import { useState } from 'react';
import { downloadFile } from '../utils/download';
import { useAuth } from '../context/AuthContext';

// Icons served as images from the lucide-static CDN (unpkg) — no bundling needed.
const ICON = (name) => `https://unpkg.com/lucide-static@latest/icons/${name}.svg`;

export default function ExportButtons({
  excelUrl,
  pdfUrl,
  baseName = 'export',
}) {
  const { user } = useAuth();
  const [loadingExcel, setLoadingExcel] = useState(false);
  const [loadingPDF, setLoadingPDF] = useState(false);

  const handleExcel = async () => {
    setLoadingExcel(true);
    await downloadFile(excelUrl, user.token, `${baseName}_${Date.now()}.xlsx`);
    setLoadingExcel(false);
  };

  const handlePDF = async () => {
    setLoadingPDF(true);
    await downloadFile(pdfUrl, user.token, `${baseName}_${Date.now()}.pdf`);
    setLoadingPDF(false);
  };

  return (
    <div className="flex gap-3 flex-wrap">
      <button
        onClick={handleExcel}
        disabled={loadingExcel}
        className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold shadow shadow-blue-950/40 border border-sky-700 transition"
      >
        <img
          src={ICON(loadingExcel ? 'loader-circle' : 'file-spreadsheet')}
          alt=""
          className={`w-4 h-4 invert ${loadingExcel ? 'animate-spin' : ''}`}
        />
        {loadingExcel ? 'Exporting...' : 'Excel'}
      </button>
      <button
        onClick={handlePDF}
        disabled={loadingPDF}
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold shadow shadow-red-900/40 transition"
      >
        <img
          src={ICON(loadingPDF ? 'loader-circle' : 'file-text')}
          alt=""
          className={`w-4 h-4 invert ${loadingPDF ? 'animate-spin' : ''}`}
        />
        {loadingPDF ? 'Exporting...' : 'PDF'}
      </button>
    </div>
  );
}