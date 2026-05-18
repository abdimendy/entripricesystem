import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FaArrowLeft,
  FaEnvelope,
  FaGlobe,
  FaMapMarkerAlt,
  FaPhone,
  FaStar,
} from 'react-icons/fa';
import { businessApi } from '../api/businessApi';
import { DownloadBusinessPdfButton } from '../components/DownloadPdfButton';
import ShareButtons from '../components/ShareButtons';
import BusinessGallery from '../components/BusinessGallery';
import BusinessMap from '../components/BusinessMap';
import OpeningHours from '../components/OpeningHours';
import BusinessReviews from '../components/BusinessReviews';
import SeoHead from '../components/SeoHead';
import LoadingSpinner from '../components/LoadingSpinner';
import { trackEvent } from '../utils/analytics';
import { demoBusinessList } from '../data/demoData';
import { cloudinaryTransform, resolveImageUrl } from '../utils/images';
import { fadeUp } from '../utils/motion';
import { useLanguage } from '../context/LanguageContext';

export default function BusinessDetails() {
  const { t } = useLanguage();
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { data } = await businessApi.getById(id);
        if (!cancelled) setBusiness(data);
      } catch {
        const fallback = demoBusinessList.find((b) => String(b.id) === String(id));
        if (!cancelled) {
          if (fallback) setBusiness(fallback);
          else toast.error(t('details.notFound'));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    trackEvent('business_view', { businessId: Number(id), path: `/businesses/${id}` });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <motion.div className="flex justify-center py-24" {...fadeUp}>
        <LoadingSpinner message={t('details.loading')} />
      </motion.div>
    );
  }

  if (!business) {
    return (
      <motion.div className="mx-auto max-w-2xl px-4 py-20 text-center" {...fadeUp}>
        <p className="text-lg font-semibold text-slate-800 dark:text-white">{t('details.notFound')}</p>
        <Link to="/businesses" className="btn-primary mt-6 inline-flex">
          <FaArrowLeft /> {t('details.backDirectory')}
        </Link>
      </motion.div>
    );
  }

  const heroSrc = cloudinaryTransform(
    resolveImageUrl(business.logoUrl, business.name),
    'w_1200,h_420,c_fill,q_auto'
  );

  return (
    <motion.article className="pb-16" {...fadeUp}>
      <SeoHead title={business.name} description={business.description} path={`/businesses/${id}`} />
      <div className="relative h-52 overflow-hidden bg-slate-200 sm:h-64 md:h-72 dark:bg-slate-800">
        <img
          src={heroSrc}
          alt={business.name}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = resolveImageUrl(null, business.name);
          }}
        />
        <motion.div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
        <Link
          to="/businesses"
          className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-lg bg-white/95 px-3 py-1.5 text-sm font-semibold text-slate-800 shadow-md backdrop-blur-sm transition hover:bg-white"
        >
          <FaArrowLeft className="h-3.5 w-3.5" /> {t('details.back')}
        </Link>
        {business.categoryName && (
          <span className="absolute right-4 top-4 rounded-lg bg-amber-500 px-3 py-1 text-xs font-bold text-slate-900 shadow">
            {business.categoryName}
          </span>
        )}
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="-mt-10 relative rounded-2xl border border-slate-200/80 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-800">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
                {business.name}
              </h1>
              <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-amber-600 dark:text-amber-400">
                <FaStar className="h-4 w-4" />
                {Number(business.rating).toFixed(1)} {t('details.rating')}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <DownloadBusinessPdfButton businessId={business.id} />
              <ShareButtons business={business} />
            </div>
          </div>

          {business.isFeatured && (
            <span className="mt-3 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">{t('common.featured')}</span>
          )}

          {business.description && (
            <p className="mt-4 text-slate-600 leading-relaxed dark:text-slate-300">
              {business.description}
            </p>
          )}

          <ul className="mt-6 space-y-3 text-sm text-slate-700 dark:text-slate-300">
            {business.phone && (
              <li className="flex items-center gap-3">
                <FaPhone className="shrink-0 text-amber-500" />
                <a href={`tel:${business.phone}`} className="font-medium hover:text-amber-600">
                  {business.phone}
                </a>
              </li>
            )}
            {business.email && (
              <li className="flex items-center gap-3">
                <FaEnvelope className="shrink-0 text-amber-500" />
                <a href={`mailto:${business.email}`} className="font-medium hover:text-amber-600">
                  {business.email}
                </a>
              </li>
            )}
            {(business.address || business.city) && (
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-0.5 shrink-0 text-amber-500" />
                <span>
                  {business.address}
                  {business.city ? `, ${business.city}` : ''}
                </span>
              </li>
            )}
            {business.website && (
              <li className="flex items-center gap-3">
                <FaGlobe className="shrink-0 text-amber-500" />
                <a
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-amber-600 hover:underline dark:text-amber-400"
                >
                  {business.website.replace(/^https?:\/\//, '')}
                </a>
              </li>
            )}
          </ul>

          <BusinessGallery business={business} />
          <OpeningHours hours={business.openingHours} />
          <BusinessMap business={business} />
          <BusinessReviews businessId={business.id} />
        </div>
      </div>
    </motion.article>
  );
}
