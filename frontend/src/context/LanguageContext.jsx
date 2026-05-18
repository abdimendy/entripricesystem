import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { t as translate } from '../i18n/translations';

const STORAGE_KEY = 'yellowbook_lang';
const LanguageContext = createContext(null);

function readStoredLang() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'en' ? 'en' : 'so';
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(readStoredLang);

  useEffect(() => {
    document.documentElement.lang = lang === 'so' ? 'so' : 'en';
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang: (next) => {
        const code = next === 'en' ? 'en' : 'so';
        localStorage.setItem(STORAGE_KEY, code);
        setLangState(code);
        document.documentElement.lang = code === 'so' ? 'so' : 'en';
      },
      t: (key, vars) => translate(lang, key, vars),
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage requires LanguageProvider');
  return ctx;
}
