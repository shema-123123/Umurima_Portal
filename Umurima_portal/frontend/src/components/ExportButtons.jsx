import { useState } from 'react';
import { downloadFile } from '../utils/download';
import { useAuth } from '../context/AuthContext';

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
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={handleExcel}
        disabled={loadingExcel}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-semibold transition shadow"
      >
        {loadingExcel ? '⏳...' : '📊 Excel'}
      </button>
      <button
        onClick={handlePDF}
        disabled={loadingPDF}
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-semibold transition shadow"
      >
        {loadingPDF ? '⏳...' : '📄 PDF'}
      </button>
    </div>
  );
}