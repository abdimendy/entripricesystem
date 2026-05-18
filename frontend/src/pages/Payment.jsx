import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaCheckCircle, FaUser } from 'react-icons/fa';
import { businessApi } from '../api/businessApi';
import { paymentApi } from '../api/paymentApi';
import { demoBusinesses } from '../data/demoData';
import { ensureArray } from '../utils/apiHelpers';
import { fadeUp } from '../utils/motion';
import { useLanguage } from '../context/LanguageContext';
import CaptchaField from '../components/CaptchaField';

const METHODS = [
  { id: 'EVC Plus', label: 'EVC Plus', color: 'border-green-400 bg-green-50' },
  { id: 'Zaad', label: 'Zaad', color: 'border-blue-400 bg-blue-50' },
  { id: 'Sahal', label: 'Sahal', color: 'border-purple-400 bg-purple-50' },
  { id: 'Visa', label: 'Visa', color: 'border-indigo-400 bg-indigo-50' },
];

export default function Payment() {
  const { t } = useLanguage();
  const [businesses, setBusinesses] = useState([]);
  const [loadingBusinesses, setLoadingBusinesses] = useState(true);
  const [usingDemoBusinesses, setUsingDemoBusinesses] = useState(false);
  const [method, setMethod] = useState('EVC Plus');
  const [form, setForm] = useState({
    payerName: '',
    businessId: '',
    amount: '',
    transactionNumber: '',
    companyWebsite: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    businessApi
      .getAll()
      .then((r) => {
        const list = ensureArray(r.data);
        if (list.length > 0) {
          setBusinesses(list);
          setUsingDemoBusinesses(false);
        } else {
          setBusinesses(demoBusinesses);
          setUsingDemoBusinesses(true);
          toast.error(t('paymentPage.noBusinesses'));
        }
      })
      .catch((err) => {
        setBusinesses(demoBusinesses);
        setUsingDemoBusinesses(true);
        if (!err?.demoMode) {
          toast.error('Showing sample businesses â€” start API for live data: .\\scripts\\start-api-neon.ps1');
        }
      })
      .finally(() => setLoadingBusinesses(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.companyWebsite) return;
    setSubmitting(true);
    try {
      const { data } = await paymentApi.create({
        payerName: form.payerName.trim(),
        businessId: Number(form.businessId),
        amount: Number(form.amount),
        paymentMethod: method,
        transactionNumber: form.transactionNumber.trim(),
        companyWebsite: '',
      });
      setSuccess(data);
      toast.success(t('paymentPage.paymentRecorded'));
      setForm({ payerName: '', businessId: '', amount: '', transactionNumber: '' });
    } catch (err) {
      toast.error(err.friendlyMessage || t('paymentPage.paymentFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div {...fadeUp} className="text-center">
        <h1 className="section-title">{t('paymentPage.title')}</h1>
        <p className="section-subtitle mx-auto">{t('paymentPage.subtitle')}</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="card mt-10 p-10 text-center"
          >
            <FaCheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-4 text-2xl font-bold text-slate-900">{t('paymentPage.successTitle')}</h2>
            <p className="mt-3 text-lg font-semibold text-amber-700">
              <FaUser className="mr-2 inline" />
              {success.payerName}
            </p>
            <p className="mt-2 text-slate-600">
              {success.businessName} â€” ${Number(success.amount).toFixed(2)} via {success.paymentMethod}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {t('paymentPage.transactionNumber')}: {success.transactionNumber}
            </p>
            <button type="button" className="btn-primary mt-8" onClick={() => setSuccess(null)}>
              {t('paymentPage.makeAnother')}
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            {...fadeUp}
            onSubmit={handleSubmit}
            className="card relative mt-10 space-y-6 p-8"
          >
            <CaptchaField value={form.companyWebsite} onChange={(e) => setForm((f) => ({ ...f, companyWebsite: e.target.value }))} />
            <motion.div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                {t('paymentPage.yourName')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                minLength={2}
                maxLength={150}
                placeholder={t('paymentPage.namePlaceholder')}
                value={form.payerName}
                onChange={(e) => setForm((f) => ({ ...f, payerName: e.target.value }))}
                className="input-field"
                autoComplete="name"
              />
              <p className="mt-1 text-xs text-slate-500">
                {t('paymentPage.nameHint')}
              </p>
            </motion.div>

            <motion.div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                {t('paymentPage.paymentMethod')}
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {METHODS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id)}
                    className={`rounded-xl border-2 px-3 py-3 text-sm font-bold transition ${
                      method === m.id
                        ? `${m.color} border-current ring-2 ring-amber-400/50`
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">{t('paymentPage.business')}</label>
              <select
                required
                disabled={loadingBusinesses}
                value={form.businessId}
                onChange={(e) => setForm((f) => ({ ...f, businessId: e.target.value }))}
                className="input-field"
              >
                <option value="">
                  {loadingBusinesses ? t('paymentPage.loadingBusinesses') : t('paymentPage.selectBusiness')}
                </option>
                {businesses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                    {b.city ? ` â€” ${b.city}` : ''}
                  </option>
                ))}
              </select>
              {usingDemoBusinesses && !loadingBusinesses && (
                <p className="mt-1 text-xs text-amber-700">
                  {t('paymentPage.sampleList')}
                </p>
              )}
            </motion.div>

            <motion.div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">{t('paymentPage.amountUsd')}</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="50.00"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                className="input-field"
              />
            </motion.div>

            <motion.div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                {t('paymentPage.transactionNumber')}
              </label>
              <input
                type="text"
                required
                minLength={3}
                placeholder={t('paymentPage.txnPlaceholder')}
                value={form.transactionNumber}
                onChange={(e) => setForm((f) => ({ ...f, transactionNumber: e.target.value }))}
                className="input-field"
              />
            </motion.div>

            <button type="submit" disabled={submitting} className="btn-primary w-full py-3.5">
              {submitting ? t('paymentPage.processing') : t('paymentPage.payWith', { method })}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
