import { useLanguage } from '../context/LanguageContext';

export default function LanguageToggle() {
  const { lang, setLang, t } = useLanguage();

  return (
    <div
      className="flex rounded-lg border border-slate-200 p-0.5 text-xs font-bold dark:border-slate-600"
      role="group"
      aria-label={lang === 'so' ? 'Dooro luqadda' : 'Choose language'}
    >
      <button
        type="button"
        onClick={() => setLang('so')}
        title={t('lang.so')}
        className={`rounded-md px-2.5 py-1 transition ${
          lang === 'so'
            ? 'bg-amber-500 text-slate-900 shadow-sm'
            : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
        }`}
      >
        SO
      </button>
      <button
        type="button"
        onClick={() => setLang('en')}
        title={t('lang.en')}
        className={`rounded-md px-2.5 py-1 transition ${
          lang === 'en'
            ? 'bg-amber-500 text-slate-900 shadow-sm'
            : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
        }`}
      >
        EN
      </button>
    </div>
  );
}
