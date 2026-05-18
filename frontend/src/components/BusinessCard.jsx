import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhone, FaStar } from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi';
import { useLanguage } from '../context/LanguageContext';
import { cloudinaryTransform, resolveImageUrl } from '../utils/images';

export default function BusinessCard({ business }) {
  const { t } = useLanguage();
  const {
    id,
    name,
    phone,
    address,
    categoryName,
    rating,
    description,
    logoUrl,
    city,
  } = business;

  const imageSrc = cloudinaryTransform(resolveImageUrl(logoUrl, name), 'w_480,h_240,c_fill,q_auto');

  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-shadow hover:shadow-md hover:shadow-slate-200/60 dark:border-slate-700/80 dark:bg-slate-800/90 dark:hover:shadow-slate-900/40"
    >
      <div className="relative h-32 overflow-hidden bg-slate-100 dark:bg-slate-700">
        <img
          src={imageSrc}
          alt={name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=fbbf24&color=1e293b&size=200&bold=true`;
          }}
        />
        <motion.div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
        <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-md bg-white/95 px-2 py-0.5 text-[11px] font-bold text-amber-800 shadow-sm">
          <FaStar className="h-2.5 w-2.5 text-amber-500" />
          {Number(rating).toFixed(1)}
        </span>
        {categoryName && (
          <span className="absolute right-2 top-2 max-w-[55%] truncate rounded-md bg-slate-900/75 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
            {categoryName}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 text-base font-bold text-slate-900 group-hover:text-amber-600 dark:text-white dark:group-hover:text-amber-400">
          {name}
        </h3>

        <div className="mt-2 flex flex-1 flex-col gap-1.5 text-xs text-slate-600 dark:text-slate-400">
          {phone && (
            <p className="flex items-center gap-1.5 truncate">
              <FaPhone className="shrink-0 text-amber-500" />
              <a href={`tel:${phone}`} className="truncate hover:text-amber-600">
                {phone}
              </a>
            </p>
          )}
          {(address || city) && (
            <p className="flex items-start gap-1.5 line-clamp-1">
              <FaMapMarkerAlt className="mt-0.5 shrink-0 text-amber-500" />
              <span className="truncate">
                {address}
                {city ? `, ${city}` : ''}
              </span>
            </p>
          )}
          {description && (
            <p className="line-clamp-2 text-slate-500 dark:text-slate-500">{description}</p>
          )}
        </div>

        <Link
          to={`/businesses/${id}`}
          className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-amber-600 transition hover:gap-1.5 dark:text-amber-400"
        >
          {t('card.viewDetails')} <HiArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </motion.article>
  );
}
