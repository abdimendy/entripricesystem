import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { useLanguage } from '../context/LanguageContext';

export default function Pagination({ page, totalPages, onPageChange }) {
  const { t } = useLanguage();
  if (!totalPages || totalPages <= 1) return null;

  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i += 1) pages.push(i);

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2" aria-label={t('pagination.label')}>
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-yellow-50 disabled:opacity-40 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
      >
        <HiChevronLeft /> {t('pagination.prev')}
      </button>
      {start > 1 && (
        <>
          <PageBtn n={1} active={page === 1} onClick={onPageChange} />
          {start > 2 && <span className="px-1 text-slate-400">…</span>}
        </>
      )}
      {pages.map((n) => (
        <PageBtn key={n} n={n} active={page === n} onClick={onPageChange} />
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-slate-400">…</span>}
          <PageBtn n={totalPages} active={page === totalPages} onClick={onPageChange} />
        </>
      )}
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-yellow-50 disabled:opacity-40 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
      >
        {t('pagination.next')} <HiChevronRight />
      </button>
    </nav>
  );
}

function PageBtn({ n, active, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(n)}
      className={`min-w-10 rounded-xl px-3 py-2 text-sm font-semibold transition ${
        active
          ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 shadow-md'
          : 'border border-slate-200 bg-white text-slate-700 hover:bg-yellow-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200'
      }`}
    >
      {n}
    </button>
  );
}
