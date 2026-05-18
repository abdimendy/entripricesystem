import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowRight, HiSearch, HiPhone } from 'react-icons/hi';
import { FaBuilding, FaStar, FaUsers } from 'react-icons/fa';
import SectionBadge from '../ui/SectionBadge';
import { useLanguage } from '../../context/LanguageContext';

const floatingCards = [
  { name: 'Hormuud Telecom', cat: 'Telecom', rating: '4.8', color: 'from-yellow-400 to-amber-500' },
  { name: 'Premier Bank', cat: 'Banking', rating: '4.6', color: 'from-amber-400 to-orange-500' },
  { name: 'SIMAD University', cat: 'Education', rating: '4.7', color: 'from-yellow-300 to-yellow-500' },
];

export default function HeroSection() {
  const { t } = useLanguage();

  const heroStats = [
    { icon: FaBuilding, value: '500+', label: t('hero.statBusinesses') },
    { icon: FaUsers, value: '10K+', label: t('hero.statUsers') },
    { icon: FaStar, value: '4.8', label: t('hero.statRating') },
  ];

  return (
    <section className="hero-mesh relative overflow-hidden">
      <motion.div className="hero-grid pointer-events-none absolute inset-0 opacity-60" />
      <motion.div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-yellow-400/20 blur-3xl animate-pulse-glow" />
      <motion.div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-amber-500/15 blur-3xl" />

      <motion.div className="relative mx-auto max-w-7xl px-4 pb-28 pt-16 sm:px-6 sm:pb-32 sm:pt-20 lg:px-8 lg:pb-36">
        <motion.div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <SectionBadge className="border-amber-400/30 bg-amber-400/10 text-amber-200">{t('hero.badge')}</SectionBadge>
            <h1 className="mt-8 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t('hero.title')} <span className="gradient-text">{t('hero.titleHighlight')}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">{t('hero.subtitle')}</p>
            <motion.div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link to="/businesses" className="btn-primary px-8 py-4 text-base shadow-amber-500/40">
                <HiSearch className="h-5 w-5" /> {t('hero.explore')}
              </Link>
              <Link to="/add-business" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/20">
                {t('hero.addCompany')} <HiArrowRight />
              </Link>
            </motion.div>
            <motion.div className="mt-12 flex flex-wrap gap-8 border-t border-white/10 pt-10">
              {heroStats.map(({ icon: Icon, value, label }) => (
                <motion.div key={label}>
                  <p className="flex items-center gap-2 text-2xl font-extrabold text-white"><Icon className="h-5 w-5 text-amber-400" />{value}</p>
                  <p className="mt-1 text-sm text-slate-400">{label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="relative mx-auto hidden h-[420px] w-full max-w-md lg:block">
            {floatingCards.map((card, i) => (
              <motion.div key={card.name} className={`glass-card absolute w-[280px] p-4 shadow-2xl ${i === 0 ? 'left-0 top-0' : i === 1 ? 'right-0 top-16 z-10' : 'bottom-0 left-8 z-20'}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.15 }}>
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.color} font-bold text-slate-900`}>{card.name.charAt(0)}</div>
                  <div className="min-w-0 flex-1"><p className="truncate font-bold text-slate-900">{card.name}</p><p className="text-xs text-slate-500">{card.cat}</p></div>
                  <span className="rounded-lg bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700"><FaStar className="inline text-amber-500" /> {card.rating}</span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500"><HiPhone className="text-amber-500" /> +252 61 XXX XXXX</div>
              </motion.div>
            ))}
            <motion.div className="absolute -bottom-2 -right-2 rounded-2xl border border-amber-400/30 bg-amber-400/20 px-4 py-2" animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity }}>
              <p className="text-xs font-bold text-amber-200">{t('hero.liveDirectory')}</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
      <div className="absolute bottom-0 left-0 right-0"><svg viewBox="0 0 1440 80" fill="none" className="w-full text-[#fafafa]" preserveAspectRatio="none"><path d="M0 40L60 45C120 50 240 60 360 55C480 50 600 30 720 25C840 20 960 30 1080 35C1200 40 1320 40 1380 40L1440 40V80H0V40Z" fill="currentColor" /></svg></div>
    </section>
  );
}