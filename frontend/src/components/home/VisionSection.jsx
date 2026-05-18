import { motion } from 'framer-motion';
import { FaEye, FaGlobeAfrica } from 'react-icons/fa';
import SectionBadge from '../ui/SectionBadge';
import { useLanguage } from '../../context/LanguageContext';

export default function VisionSection() {
  const { t } = useLanguage();
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50" />
      <div className="pointer-events-none absolute -right-20 top-10 h-80 w-80 rounded-full bg-yellow-300/30 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <span className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-amber-600 shadow-xl ring-4 ring-amber-100">
            <FaEye className="h-10 w-10" />
          </span>
          <SectionBadge className="mt-8">{t('home.visionBadge')}</SectionBadge>
          <h2 className="section-title mt-4">
            {t('home.visionTitle')}{' '}
            <span className="gradient-text">{t('home.visionHighlight')}</span>
          </h2>
          <p className="section-subtitle mx-auto mt-6 text-xl">{t('home.visionText')}</p>
          <div className="mt-10 inline-flex items-center gap-3 rounded-2xl bg-white/80 px-6 py-4 shadow-lg backdrop-blur-sm">
            <FaGlobeAfrica className="h-8 w-8 text-amber-500" />
            <span className="font-semibold text-slate-700">{t('home.visionRegion')}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
