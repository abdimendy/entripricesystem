import { useState } from 'react';
import { FaFilePdf } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { pdfApi } from '../api/pdfApi';

export function DownloadBusinessPdfButton({ businessId, className = '' }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await pdfApi.downloadBusiness(businessId);
      toast.success('PDF downloaded');
    } catch (err) {
      toast.error(
        err.friendlyMessage ||
          'PDF needs the API. Run .\\START.ps1 and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={
        className ||
        'inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-900 transition hover:bg-amber-100 disabled:opacity-60 dark:border-amber-700/50 dark:bg-amber-950/40 dark:text-amber-200 dark:hover:bg-amber-950/70'
      }
    >
      <FaFilePdf className="h-4 w-4" />
      {loading ? 'Preparing…' : 'Download PDF'}
    </button>
  );
}

export function DownloadDirectoryPdfButton({ className = '', filterParams = {} }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await pdfApi.downloadDirectory(filterParams);
      toast.success('Directory PDF downloaded');
    } catch (err) {
      toast.error(
        err.friendlyMessage ||
          'PDF needs the API. Run .\\START.ps1 and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={
        className ||
        'inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800'
      }
    >
      <FaFilePdf className="h-4 w-4 text-red-600" />
      {loading ? 'Preparing…' : 'Download directory (PDF)'}
    </button>
  );
}
