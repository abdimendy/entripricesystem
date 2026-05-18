import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import Logo from './Logo';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  const footerLinks = {
    [t('footer.directory')]: [
      { to: '/businesses', label: t('footer.allBusinesses') },
      { to: '/categories', label: t('nav.categories') },
      { to: '/payment', label: t('nav.payment') },
    ],
    [t('footer.company')]: [
      { to: '/about', label: t('footer.aboutUs') },
      { to: '/contact', label: t('nav.contact') },
      { to: '/admin', label: t('nav.admin') },
    ],
  };

  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo className="[&_span]:text-white" linkTo="/" />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">{t('footer.tagline')}</p>
            <div className="mt-5 flex gap-3">
              {[FaFacebook, FaTwitter, FaInstagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-amber-400 transition hover:bg-amber-400 hover:text-slate-900"
                  aria-label="Social"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400">{title}</h4>
              <ul className="mt-4 space-y-2">
                {links.map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="text-sm text-slate-400 transition hover:text-white">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 sm:flex-row">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} YellowBook. {t('common.rights')}
          </p>
          <p className="text-xs text-slate-500">YB Directory · {t('common.builtFor')}</p>
        </div>
      </div>
    </footer>
  );
}
