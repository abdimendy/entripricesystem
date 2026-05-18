import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BusinessCard from '../BusinessCard';
import SkeletonCard from '../SkeletonCard';
import { ensureArray } from '../../utils/apiHelpers';
import { fadeUp } from '../../utils/motion';
import { useLanguage } from '../../context/LanguageContext';

export default function FeaturedCompanies({ businesses = [], loading }) {
  const { t } = useLanguage();
  const list = ensureArray(businesses);

  return (
    <section className="py-16">
      <motion.div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" {...fadeUp}>
        <motion.div className="flex flex-wrap items-end justify-between gap-4">
          <motion.div>
            <h2 className="section-title">{t('home.featuredTitle')}</h2>
            <p className="section-subtitle">{t('home.featuredSubtitle')}</p>
          </motion.div>
          <Link to="/businesses" className="btn-secondary">
            {t('common.viewAll')}
          </Link>
        </motion.div>
        <motion.div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : list.map((b) => <BusinessCard key={b.id} business={b} />)}
        </motion.div>
      </motion.div>
    </section>
  );
}
