import { FaShieldAlt, FaBolt, FaMapMarkedAlt, FaMobileAlt } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';

export default function TrustBar() {
  const { t } = useLanguage();

  const items = [
    { icon: FaShieldAlt, label: t('home.trustVerified') },
    { icon: FaBolt, label: t('home.trustFast') },
    { icon: FaMapMarkedAlt, label: t('home.trustCoverage') },
    { icon: FaMobileAlt, label: t('home.trustMobile') },
  ];

  return (
    <section className="border-y border-slate-200/80 bg-white/90 py-4 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-6 px-4 sm:gap-10 sm:px-6 lg:px-8">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Icon />
            </span>
            {label}
          </div>
        ))}
      </div>
    </section>
  );
}
