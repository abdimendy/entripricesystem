import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { getCategoryStyle } from '../utils/categoryIcons';

export { getCategoryIcon } from '../utils/categoryIcons';

export default function CategoryCard({ category, index = 0, variant = 'list' }) {
  const { emoji, gradient } = getCategoryStyle(category);
  const count = category.businessCount ?? category.BusinessCount ?? 0;
  const description =
    category.description ||
    `Browse verified ${category.name?.toLowerCase() || 'business'} listings in Somalia.`;

  if (variant === 'pro') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.04, duration: 0.35 }}
        className="h-full"
      >
        <Link
          to={`/businesses?categoryId=${category.id}`}
          className="card card-hover group flex h-full flex-col overflow-hidden p-0"
        >
          <div className={`h-0.5 w-full bg-gradient-to-r ${gradient}`} />
          <div className="flex flex-1 flex-col p-4">
            <div className="flex items-center justify-between gap-2">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-lg shadow-sm ring-2 ring-white dark:ring-slate-800`}
                aria-hidden
              >
                {emoji}
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                {count}
              </span>
            </div>

            <h3 className="mt-3 text-sm font-bold text-slate-900 transition-colors group-hover:text-amber-600 dark:text-white dark:group-hover:text-amber-400">
              {category.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {description}
            </p>

            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-700">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                View
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white transition group-hover:bg-amber-500 dark:bg-slate-700 dark:group-hover:bg-amber-500">
                <FaArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  if (variant === 'tile') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05, duration: 0.4 }}
        className="h-full"
      >
        <Link
          to={`/businesses?categoryId=${category.id}`}
          className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-300/70 hover:shadow-lg dark:border-slate-700/80 dark:bg-slate-800/90"
        >
          <div className={`relative flex h-24 items-center justify-center bg-gradient-to-br ${gradient}`}>
            <span className="relative text-3xl" aria-hidden>
              {emoji}
            </span>
            <span className="absolute bottom-2 right-2 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-bold text-slate-800">
              {count}
            </span>
          </div>
          <div className="flex flex-1 flex-col p-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{category.name}</h3>
            <span className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-bold text-amber-600">
              Browse <FaArrowRight className="h-3 w-3" />
            </span>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
    >
      <Link
        to={`/businesses?categoryId=${category.id}`}
        className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:border-amber-300/80 hover:shadow-md dark:border-slate-700/80 dark:bg-slate-800/90"
      >
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-2xl`}
          aria-hidden
        >
          {emoji}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-slate-900 group-hover:text-amber-600 dark:text-white">
            {category.name}
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            {count} {count === 1 ? 'business' : 'businesses'}
          </p>
        </div>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-600 dark:bg-slate-700">
          <FaArrowRight className="h-3 w-3" />
        </span>
      </Link>
    </motion.div>
  );
}
