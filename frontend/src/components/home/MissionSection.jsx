import { motion } from 'framer-motion';
import { FaBullseye, FaHandshake, FaRocket } from 'react-icons/fa';
import SectionBadge from '../ui/SectionBadge';
import { useLanguage } from '../../context/LanguageContext';

export default function MissionSection() {
  const { t } = useLanguage();
  const points = [
    { icon: FaRocket, title: t('home.missionFast'), text: t('home.missionFastText') },
    { icon: FaHandshake, title: t('home.missionTrusted'), text: t('home.missionTrustedText') },
    { icon: FaBullseye, title: t('home.missionLocal'), text: t('home.missionLocalText') },
  ];
  return (
    <section className="py-20">
      <motion.div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <div className="grid gap-12 overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white to-amber-50/40 p-8 shadow-xl lg:grid-cols-2 lg:p-14">
          <div>
            <SectionBadge>{t('home.missionBadge')}</SectionBadge>
            <h2 className="section-title mt-4">{t('home.missionTitle')} <span className="gradient-text">{t('home.missionHighlight')}</span></h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">{t('home.missionText')}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {points.map(({ icon: Icon, title, text }) => (
                <motion.div key={title} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                  <Icon className="h-6 w-6 text-amber-500" />
                  <p className="mt-2 font-bold text-slate-900">{title}</p>
                  <p className="text-xs text-slate-500">{text}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="absolute h-64 w-64 rounded-full bg-amber-200/40 blur-3xl" />
            <div className="relative flex h-56 w-56 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 shadow-2xl shadow-amber-500/40">
              <FaBullseye className="h-24 w-24 text-slate-900/80" />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}