import { FaShareAlt, FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';

function phoneDigits(phone) {
  return (phone || '').replace(/\D/g, '');
}

export default function ShareButtons({ business }) {
  const { t } = useLanguage();
  const url = typeof window !== 'undefined' ? `${window.location.origin}/businesses/${business.id}` : '';
  const text = `${business.name} — ${business.phone || ''} ${url}`.trim();

  const whatsapp = () => {
    const digits = phoneDigits(business.phone);
    const link = digits
      ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: business.name, text, url });
        return;
      } catch {
        /* cancelled */
      }
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      toast.success('Link copied');
    } catch {
      toast.error('Could not share');
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={whatsapp} className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700">
        <FaWhatsapp /> WhatsApp
      </button>
      <button type="button" onClick={share} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-white">
        <FaShareAlt /> {t('common.share')}
      </button>
    </div>
  );
}
