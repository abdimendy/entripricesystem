import { useLanguage } from '../context/LanguageContext';

const DAY_ORDER = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const DAY_LABELS = { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun' };

function isOpenNow(hours) {
  const day = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][new Date().getDay()];
  const slot = hours?.[day];
  if (!slot || slot.toLowerCase() === 'closed') return false;
  return true;
}

export default function OpeningHours({ hours }) {
  const { t } = useLanguage();
  const data = hours && typeof hours === 'object' ? hours : {};
  const keys = DAY_ORDER.filter((d) => data[d]);
  if (!keys.length) return null;

  const open = isOpenNow(data);

  return (
    <section className="mt-6">
      <div className="mb-2 flex items-center gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">{t('business.hours')}</h2>
        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${open ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'}`}>
          {open ? 'Open' : 'Closed'}
        </span>
      </div>
      <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
        {keys.map((d) => (
          <li key={d} className="flex justify-between gap-4">
            <span className="font-medium">{DAY_LABELS[d]}</span>
            <span>{data[d]}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
