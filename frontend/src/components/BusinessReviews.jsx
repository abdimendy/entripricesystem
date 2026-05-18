import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaStar } from 'react-icons/fa';
import { reviewApi } from '../api/reviewApi';
import { demoReviews } from '../data/demoData';
import { ensureArray } from '../utils/apiHelpers';
import { useLanguage } from '../context/LanguageContext';
import CaptchaField from './CaptchaField';

export default function BusinessReviews({ businessId }) {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ userName: '', comment: '', rating: 5, companyWebsite: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    reviewApi
      .getByBusiness(businessId)
      .then((r) => setReviews(ensureArray(r.data)))
      .catch(() => setReviews(demoReviews.filter((x) => x.businessId === Number(businessId))))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [businessId]);

  const submit = async (e) => {
    e.preventDefault();
    if (form.companyWebsite) return;
    setSubmitting(true);
    try {
      await reviewApi.create({
        businessId: Number(businessId),
        userName: form.userName,
        comment: form.comment,
        rating: Number(form.rating),
        companyWebsite: '',
      });
      toast.success('Review submitted');
      setForm({ userName: '', comment: '', rating: 5, companyWebsite: '' });
      load();
    } catch (err) {
      toast.error(err.friendlyMessage || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('business.reviews')}</h2>

      {loading ? (
        <p className="mt-4 text-sm text-slate-500">{t('common.loading')}</p>
      ) : reviews.length ? (
        <ul className="mt-4 space-y-4">
          {reviews.map((r) => (
            <li key={r.id} className="border-b border-slate-100 pb-4 last:border-0 dark:border-slate-700">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-slate-800 dark:text-white">{r.userName}</span>
                <span className="flex items-center gap-1 text-amber-600 text-sm">
                  <FaStar /> {r.rating}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{r.comment}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-slate-500">No reviews yet.</p>
      )}

      <form onSubmit={submit} className="relative mt-6 space-y-3 border-t border-slate-100 pt-6 dark:border-slate-700">
        <CaptchaField value={form.companyWebsite} onChange={(e) => setForm((f) => ({ ...f, companyWebsite: e.target.value }))} />
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t('business.writeReview')}</p>
        <input className="input-field" placeholder="Your name" value={form.userName} onChange={(e) => setForm((f) => ({ ...f, userName: e.target.value }))} required />
        <textarea className="input-field min-h-[80px]" placeholder="Comment" value={form.comment} onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))} required />
        <select className="input-field w-32" value={form.rating} onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))}>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>{n} stars</option>
          ))}
        </select>
        <button type="submit" className="btn-primary" disabled={submitting}>{t('common.submit')}</button>
      </form>
    </section>
  );
}
