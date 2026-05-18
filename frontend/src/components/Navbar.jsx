import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { FaSignInAlt, FaSignOutAlt, FaUserShield } from 'react-icons/fa';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const navKeys = [
  { to: '/', key: 'nav.home', end: true },
  { to: '/about', key: 'nav.about' },
  { to: '/payment', key: 'nav.payment' },
  { to: '/contact', key: 'nav.contact' },
];

const linkClass = ({ isActive }) =>
  `relative px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'text-amber-600 after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:bg-amber-500 dark:text-amber-400'
      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
  }`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/90 bg-white/95 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Logo size="md" />

        <nav className="hidden flex-1 items-center justify-center gap-0.5 lg:flex">
          {navKeys.map(({ to, key, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              {t(key)}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <LanguageToggle />
          <ThemeToggle />
          <Link
            to="/businesses"
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            {t('nav.explore')}
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-yellow-400 via-amber-400 to-amber-500 px-4 py-2.5 text-sm font-bold text-slate-900 shadow-md shadow-amber-500/25 transition hover:brightness-105"
              >
                <FaUserShield className="h-4 w-4" /> {t('nav.admin')}
              </Link>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800"
                title={t('nav.logout')}
              >
                <FaSignOutAlt className="h-4 w-4" />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800 dark:bg-amber-500 dark:text-slate-900 dark:hover:bg-amber-400"
            >
              <FaSignInAlt className="h-4 w-4" /> {t('nav.login')}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageToggle />
          <ThemeToggle />
          <button
            type="button"
            className="rounded-lg border border-slate-200 p-2.5 text-slate-700 dark:border-slate-600 dark:text-slate-200"
            onClick={() => setOpen((v) => !v)}
            aria-label={t('navbar.toggleMenu')}
          >
            {open ? <HiX className="h-5 w-5" /> : <HiMenu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950 lg:hidden">
          <div className="flex flex-col gap-1">
            {navKeys.map(({ to, key, end }) => (
              <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)} className={linkClass}>
                {t(key)}
              </NavLink>
            ))}
            <Link
              to="/businesses"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex justify-center rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 dark:border-slate-600 dark:text-slate-100"
            >
              {t('nav.explore')}
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/admin" onClick={() => setOpen(false)} className="btn-primary mt-2 justify-center">
                  {t('navbar.adminPanel')}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="mt-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium dark:border-slate-600"
                >
                  {t('nav.logout')} ({user?.username})
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex justify-center rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white dark:bg-amber-500 dark:text-slate-900"
              >
                <FaSignInAlt className="mr-2" /> {t('nav.login')}
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
