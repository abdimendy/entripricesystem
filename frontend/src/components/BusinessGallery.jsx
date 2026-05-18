import { useState } from 'react';
import { resolveImageUrl } from '../utils/images';
import { useLanguage } from '../context/LanguageContext';

export default function BusinessGallery({ business }) {
  const { t } = useLanguage();
  const urls = [
    business.logoUrl,
    ...(Array.isArray(business.imageUrls) ? business.imageUrls : []),
  ].filter(Boolean);

  const unique = [...new Set(urls.map((u) => resolveImageUrl(u, business.name)))];
  const [active, setActive] = useState(0);

  if (unique.length <= 1) return null;

  return (
    <section className="mt-6">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">{t('business.gallery')}</h2>
      <img src={unique[active]} alt="" className="h-48 w-full rounded-xl object-cover" />
      <div className="mt-2 flex gap-2 overflow-x-auto">
        {unique.map((src, i) => (
          <button key={src} type="button" onClick={() => setActive(i)} className={`h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${i === active ? 'border-amber-500' : 'border-transparent'}`}>
            <img src={src} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </section>
  );
}
