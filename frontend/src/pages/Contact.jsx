import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { contactApi } from '../api/contactApi';
import CaptchaField from '../components/CaptchaField';
import SeoHead from '../components/SeoHead';
import { useLanguage } from '../context/LanguageContext';
import { fadeUp } from '../utils/motion';

export default function Contact() {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    companyWebsite: '',
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.companyWebsite) return;
    setLoading(true);
    try {
      await contactApi.send(form);
      toast.success(t('contact.sent'));
      setForm({ name: '', email: '', phone: '', subject: '', message: '', companyWebsite: '' });
    } catch (err) {
      toast.error(err.friendlyMessage || 'Failed to send');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <SeoHead title={t('contact.title')} description={t('contact.subtitle')} path="/contact" />
      <motion.div {...fadeUp}>
        <h1 className="section-title">{t('contact.title')}</h1>
        <p className="section-subtitle">{t('contact.subtitle')}</p>
      </motion.div>

      <form onSubmit={onSubmit} className="card relative mt-8 space-y-4 p-6">
        <CaptchaField value={form.companyWebsite} onChange={(e) => setForm((f) => ({ ...f, companyWebsite: e.target.value }))} />
        <input className="input-field" placeholder={t('contact.name')} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
        <input type="email" className="input-field" placeholder={t('contact.email')} value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
        <input className="input-field" placeholder={t('contact.phone')} value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
        <input className="input-field" placeholder={t('contact.subject')} value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} required />
        <textarea className="input-field min-h-[120px]" placeholder={t('contact.message')} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} required />
        <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>{t('common.submit')}</button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        Email: <a href="mailto:info@yellowbook.so" className="font-semibold text-amber-600">info@yellowbook.so</a>
        {' · '}
        Tel: <a href="tel:+252610000000" className="font-semibold text-amber-600">+252 61 000 0000</a>
      </p>
    </div>
  );
}
