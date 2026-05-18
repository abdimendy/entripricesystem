import { useLanguage } from '../context/LanguageContext';

export default function BusinessMap({ business }) {
  const { t } = useLanguage();
  const lat = business.latitude ?? business.Latitude;
  const lng = business.longitude ?? business.Longitude;
  const query = lat && lng
    ? `${lat},${lng}`
    : encodeURIComponent(`${business.address || ''}, ${business.city || 'Mogadishu'}`.trim());

  if (!query || query === ',') return null;

  const src = `https://www.google.com/maps?q=${query}&output=embed`;

  return (
    <section className="mt-6">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">{t('business.map')}</h2>
      <iframe
        title="Map"
        src={src}
        className="h-56 w-full rounded-xl border border-slate-200 dark:border-slate-700"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${query}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-block text-sm font-semibold text-amber-600 hover:underline"
      >
        Open in Google Maps
      </a>
    </section>
  );
}
