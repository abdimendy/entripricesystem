import { useEffect } from 'react';

export default function SeoHead({ title, description, path = '/' }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | Yellow Book` : 'Yellow Book - Telephone Directory';
    document.title = fullTitle;

    const setMeta = (name, content, isProperty = false) => {
      if (!content) return;
      const attr = isProperty ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    setMeta('description', description || 'Somalia business telephone directory — find companies, phone numbers, and services in Mogadishu and beyond.');
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', description, true);
    setMeta('og:url', `${origin}${path}`, true);
    setMeta('og:type', 'website', true);
  }, [title, description, path]);

  return null;
}
