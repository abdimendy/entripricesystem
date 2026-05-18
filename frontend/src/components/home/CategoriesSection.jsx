import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import SectionBadge from '../ui/SectionBadge';
import CategoryCard from '../CategoryCard';
import { ensureArray } from '../../utils/apiHelpers';
import { getCategoryStyle } from '../../utils/categoryIcons';
import { useLanguage } from '../../context/LanguageContext';

export default function CategoriesSection({ categories = [] }) {
  const { t } = useLanguage();
  const list = ensureArray(categories);
  const display = list.slice(0, 8);
  const totalBiz = list.reduce((sum, c) => sum + (c.businessCount ?? 0), 0);

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <SectionBadge>{t('home.categoriesBadge')}</SectionBadge>
            <h2 className="section-title mt-3 dark:text-white">
              {t('home.browseIndustry')} <span className="gradient-text">{t('home.industry')}</span>
            </h2>
            <p className="section-subtitle mt-2 dark:text-slate-400">
              {list.length > 0
                ? t('home.sectorsLine', { count: list.length, total: totalBiz })
                : t('home.exploreByIndustry')}
            </p>
          </div>
          <Link to="/categories" className="btn-secondary shrink-0">
            {t('common.viewAll')} <FaArrowRight />
          </Link>
        </motion.div>

        {list.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {list.slice(0, 6).map((cat) => {
              const { emoji } = getCategoryStyle(cat);
              return (
                <Link
                  key={cat.id}
                  to={`/businesses?categoryId=${cat.id}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-amber-300 hover:text-amber-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
                >
                  <span>{emoji}</span>
                  {cat.name}
                </Link>
              );
            })}
          </div>
        )}

        {display.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-600">
            <p className="text-3xl">📂</p>
            <p className="mt-3 font-semibold text-slate-600 dark:text-slate-300">Loading categories…</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {display.map((cat, i) => (
              <CategoryCard key={cat.id} category={cat} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
