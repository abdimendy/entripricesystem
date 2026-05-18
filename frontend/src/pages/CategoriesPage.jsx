import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { HiSearch } from 'react-icons/hi';
import { FaPlus } from 'react-icons/fa';
import { categoryApi } from '../api/categoryApi';
import LoadingSpinner from '../components/LoadingSpinner';
import CategoryCard from '../components/CategoryCard';
import { demoCategories } from '../data/demoData';
import { ensureArray } from '../utils/apiHelpers';
import { getCategoryStyle } from '../utils/categoryIcons';
import { fadeUp } from '../utils/motion';
import { useLanguage } from '../context/LanguageContext';

export default function CategoriesPage() {
  const { t } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    categoryApi
      .getAll()
      .then((r) => setCategories(ensureArray(r.data)))
      .catch(() => {
        setCategories(demoCategories);
        toast.error(t('categoriesPage.offlineCategories'));
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = categories;
    if (activeId) list = list.filter((c) => String(c.id) === activeId);
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
    );
  }, [categories, query, activeId]);

  const totalBusinesses = categories.reduce(
    (s, c) => s + (c.businessCount ?? c.BusinessCount ?? 0),
    0
  );

  const hasFilters = Boolean(query.trim() || activeId);

  const clearFilters = () => {
    setQuery('');
    setActiveId('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div {...fadeUp} className="flex flex-wrap items-end justify-between gap-4">
        <motion.div>
          <h1 className="section-title">{t('categoriesPage.title')}</h1>
          <p className="section-subtitle">
            {categories.length > 0
              ? t('categoriesPage.subtitle', { count: categories.length, total: totalBusinesses })
              : t('categoriesPage.subtitleEmpty')}
          </p>
        </motion.div>
        <Link to="/add-business" className="btn-primary shrink-0 text-sm">
          <FaPlus /> {t('categoriesPage.listBusiness')}
        </Link>
      </motion.div>

      <form onSubmit={(e) => e.preventDefault()} className="card mt-8 p-4 sm:p-5">
        <motion.div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <motion.div className="relative flex-1">
            <HiSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-500" />
            <input
              type="search"
              placeholder={t('categoriesPage.searchPlaceholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input-field w-full py-2.5 pl-10 text-sm"
              aria-label="Search categories"
            />
          </motion.div>
          <Link to="/businesses" className="btn-secondary shrink-0 justify-center py-2.5 text-sm">
            {t('categoriesPage.allBusinesses')}
          </Link>
        </motion.div>

        {categories.length > 0 && (
          <motion.div className="mt-4 flex flex-wrap gap-1.5 border-t border-slate-100 pt-4 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setActiveId('')}
              className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition ${
                !activeId
                  ? 'bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-900'
                  : 'border border-slate-200 bg-slate-50 text-slate-600 hover:border-amber-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {t('categoriesPage.all')}
            </button>
            {categories.map((cat) => {
              const { emoji } = getCategoryStyle(cat);
              const selected = String(cat.id) === activeId;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveId(selected ? '' : String(cat.id))}
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-bold transition ${
                    selected
                      ? 'bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-900'
                      : 'border border-slate-200 bg-slate-50 text-slate-600 hover:border-amber-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  <span>{emoji}</span>
                  {cat.name}
                </button>
              );
            })}
          </motion.div>
        )}
      </form>

      <motion.div className="mt-6 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {loading
            ? t('categoriesPage.loading')
            : filtered.length > 0
              ? filtered.length === 1
                ? t('categoriesPage.countOne')
                : t('categoriesPage.countMany', { n: filtered.length })
              : t('categoriesPage.noResults')}
        </p>
        {hasFilters && !loading && (
          <button type="button" onClick={clearFilters} className="text-xs font-semibold text-amber-600 hover:underline">
            {t('categoriesPage.clearFilters')}
          </button>
        )}
      </motion.div>

      {loading ? (
        <motion.div className="mt-10 flex justify-center">
          <LoadingSpinner size="lg" />
        </motion.div>
      ) : filtered.length === 0 ? (
        <motion.div className="card mt-8 p-8 text-center">
          <p className="text-3xl">📂</p>
          <p className="mt-3 font-semibold text-slate-800 dark:text-white">{t('categoriesPage.noCategories')}</p>
          {hasFilters && (
            <button type="button" onClick={clearFilters} className="btn-primary mt-4 text-sm">
              {t('categoriesPage.resetFilters')}
            </button>
          )}
        </motion.div>
      ) : (
        <motion.div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((cat, i) => (
            <CategoryCard key={cat.id} category={cat} index={i} variant="pro" />
          ))}
        </motion.div>
      )}
    </div>
  );
}
