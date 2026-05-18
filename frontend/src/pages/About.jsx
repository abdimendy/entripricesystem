import { motion } from 'framer-motion';
import { FaHandshake, FaLightbulb, FaUsers } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import SeoHead from '../components/SeoHead';
import { fadeUp, staggerContainer, staggerItem } from '../utils/motion';

export default function About() {
  const { t } = useLanguage();

  const values = [
    { icon: FaLightbulb, title: t('about.innovation'), text: t('about.innovationText') },
    { icon: FaHandshake, title: t('about.trust'), text: t('about.trustText') },
    { icon: FaUsers, title: t('about.community'), text: t('about.communityText') },
  ];

  return (
    <motion.div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SeoHead title={t('about.title')} description={t('about.subtitle')} path="/about" />
      <motion.div {...fadeUp} className="mx-auto max-w-3xl text-center">
        <h1 className="section-title">{t('about.title')}</h1>
        <p className="section-subtitle mx-auto mt-4">{t('about.subtitle')}</p>
      </motion.div>

      <motion.div {...fadeUp} className="card mx-auto mt-12 max-w-4xl p-8 lg:p-12">
        <p className="leading-relaxed text-slate-600">{t('about.p1')}</p>
        <p className="mt-4 leading-relaxed text-slate-600">{t('about.p2')}</p>
        <p className="mt-4 leading-relaxed text-slate-600">{t('about.p3')}</p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
        className="mt-16 grid gap-6 md:grid-cols-3"
      >
        {values.map(({ icon: Icon, title, text }) => (
          <motion.div key={title} variants={staggerItem} className="stat-card text-center">
            <Icon className="mx-auto h-10 w-10 text-amber-500" />
            <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm text-slate-600">{text}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
