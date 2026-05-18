import { motion } from 'framer-motion';
import { FaBuilding, FaCreditCard, FaStar, FaTags } from 'react-icons/fa';
import SectionBadge from '../ui/SectionBadge';
import { staggerContainer, staggerItem } from '../../utils/motion';
import { useLanguage } from '../../context/LanguageContext';

export default function StatsSection({ stats }) {
  const { t } = useLanguage();
  const items = stats
    ? [
        { label: t('home.statBusinesses'), value: `${stats.totalBusinesses}+`, icon: FaBuilding },
        { label: t('home.statCategories'), value: `${stats.totalCategories}+`, icon: FaTags },
        { label: t('home.statReviews'), value: `${stats.totalReviews}+`, icon: FaStar },
        { label: t('home.statPayments'), value: `${stats.totalPayments}+`, icon: FaCreditCard },
      ]
    : [
        { label: t('home.statBusinesses'), value: '500+', icon: FaBuilding },
        { label: t('home.statCategories'), value: '25+', icon: FaTags },
        { label: t('home.statReviews'), value: '1,200+', icon: FaStar },
        { label: t('home.statPayments'), value: '10K+', icon: FaCreditCard },
      ];
  return (
    <section className="relative overflow-hidden py-20">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <SectionBadge className="border-amber-400/30 bg-amber-400/10 text-amber-200">{t('home.statsBadge')}</SectionBadge>
          <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">{t('home.statsTitle')}</h2>
        </motion.div>
        <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ label, value, icon: Icon }) => (
            <motion.div key={label} variants={staggerItem} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm">
              <Icon className="mx-auto h-8 w-8 text-amber-400" />
              <p className="mt-4 text-3xl font-extrabold text-white">{value}</p>
              <p className="mt-1 text-sm text-slate-400">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}