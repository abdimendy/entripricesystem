import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-8xl font-extrabold text-amber-400">404</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">{t('notFound.title')}</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">{t('notFound.message')}</p>
      <Link to="/" className="btn-primary mt-8">
        {t('notFound.backHome')}
      </Link>
    </div>
  );
}
