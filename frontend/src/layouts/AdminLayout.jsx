import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import {
  FaChartBar,
  FaBuilding,
  FaTags,
  FaHome,
  FaCreditCard,
  FaSignOutAlt,
} from 'react-icons/fa';
import Logo from '../components/Logo';
import LanguageToggle from '../components/LanguageToggle';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const adminLinkKeys = [
  { to: '/admin', key: 'admin.dashboard', icon: FaChartBar, end: true },
  { to: '/admin/businesses', key: 'admin.businesses', icon: FaBuilding },
  { to: '/admin/pending', key: 'admin.pending', icon: FaBuilding },
  { to: '/admin/categories', key: 'admin.categories', icon: FaTags },
  { to: '/admin/payments', key: 'admin.payments', icon: FaCreditCard },
  { to: '/admin/analytics', key: 'admin.analytics', icon: FaChartBar },
];

const pageTitleKeys = {
  '/admin': 'admin.dashboard',
  '/admin/businesses': 'admin.businesses',
  '/admin/pending': 'admin.pending',
  '/admin/categories': 'admin.categories',
  '/admin/payments': 'admin.payments',
  '/admin/analytics': 'admin.analytics',
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const pageTitle = t(pageTitleKeys[pathname] || 'nav.admin');

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-800/50 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 shadow-2xl transition duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <motion.div className="flex h-full flex-col p-5">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <Logo linkTo="/admin" size="md" className="[&_span]:text-white" />
            <p className="mt-2 text-xs font-bold uppercase tracking-widest text-amber-400/90">
              {t('admin.panel')}
            </p>
          </div>

          <nav className="mt-8 flex flex-1 flex-col gap-1.5">
            {adminLinkKeys.map(({ to, key, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 shadow-lg shadow-amber-500/30'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                {t(key)}
              </NavLink>
            ))}
          </nav>

          <div className="space-y-2 border-t border-white/10 pt-4">
            <NavLink
              to="/payment"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <FaCreditCard className="h-4 w-4" /> {t('admin.payments')}
            </NavLink>
            <NavLink
              to="/"
              className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-300"
            >
              <FaHome className="h-4 w-4" /> {t('admin.viewSite')}
            </NavLink>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 text-sm font-bold text-slate-900">
                {(user?.username || 'A').charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white">{user?.username || 'Admin'}</p>
                <p className="text-xs text-slate-500">{t('admin.administrator')}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300"
            >
              <FaSignOutAlt /> {t('nav.logout')}
            </button>
          </div>
        </motion.div>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-xl p-2 text-slate-700 hover:bg-slate-100 lg:hidden dark:text-slate-200 dark:hover:bg-slate-800"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <HiMenu className="h-6 w-6" />
            </button>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                YellowBook
              </p>
              <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">{pageTitle}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <button
              type="button"
              className="rounded-xl p-2 lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
            >
              <HiX className="h-6 w-6 text-slate-600 dark:text-slate-300" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
