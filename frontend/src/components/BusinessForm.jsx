import { ensureArray } from '../utils/apiHelpers';
import { useLanguage } from '../context/LanguageContext';

export const getEmptyBusinessForm = () => ({
  name: '',
  categoryId: '',
  phone: '',
  email: '',
  address: '',
  description: '',
});

export default function BusinessForm({
  form,
  errors,
  categories,
  onChange,
  onSubmit,
  submitLabel,
  loading,
}) {
  const { t } = useLanguage();
  const categoryList = ensureArray(categories);
  const label = submitLabel || t('form.submit');

  return (
    <form onSubmit={onSubmit} className="space-y-6 text-left">
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
          {t('form.businessName')}
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder={t('form.businessNamePh')}
          style={{ backgroundColor: '#1e293b', color: '#ffffff' }}
          className="w-full rounded-xl border border-white/10 px-4 py-3 text-sm placeholder-slate-500 outline-none transition focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
          disabled={loading}
        />
        {errors.name && <p className="mt-1.5 text-xs font-semibold text-red-400">{errors.name}</p>}
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
          {t('form.category')}
        </label>
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={onChange}
          style={{ backgroundColor: '#1e293b', color: '#ffffff' }}
          className="w-full rounded-xl border border-white/10 px-4 py-3 text-sm outline-none transition focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
          disabled={loading}
        >
          <option value="" style={{ backgroundColor: '#1e293b' }}>
            {t('form.selectCategory')}
          </option>
          {categoryList.map((cat) => (
            <option key={cat.id} value={cat.id} style={{ backgroundColor: '#1e293b' }}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.categoryId && <p className="mt-1.5 text-xs font-semibold text-red-400">{errors.categoryId}</p>}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
            {t('form.phone')}
          </label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={onChange}
            placeholder={t('form.phonePh')}
            style={{ backgroundColor: '#1e293b', color: '#ffffff' }}
            className="w-full rounded-xl border border-white/10 px-4 py-3 text-sm placeholder-slate-500 outline-none transition focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
            disabled={loading}
          />
          {errors.phone && <p className="mt-1.5 text-xs font-semibold text-red-400">{errors.phone}</p>}
        </div>
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
            {t('form.email')}
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder={t('form.emailPh')}
            style={{ backgroundColor: '#1e293b', color: '#ffffff' }}
            className="w-full rounded-xl border border-white/10 px-4 py-3 text-sm placeholder-slate-500 outline-none transition focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
            disabled={loading}
          />
          {errors.email && <p className="mt-1.5 text-xs font-semibold text-red-400">{errors.email}</p>}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
          {t('form.address')}
        </label>
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={onChange}
          placeholder={t('form.addressPh')}
          style={{ backgroundColor: '#1e293b', color: '#ffffff' }}
          className="w-full rounded-xl border border-white/10 px-4 py-3 text-sm placeholder-slate-500 outline-none transition focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
          disabled={loading}
        />
        {errors.address && <p className="mt-1.5 text-xs font-semibold text-red-400">{errors.address}</p>}
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">
          {t('form.description')}
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
          placeholder={t('form.descriptionPh')}
          rows={4}
          style={{ backgroundColor: '#1e293b', color: '#ffffff' }}
          className="w-full resize-none rounded-xl border border-white/10 px-4 py-3 text-sm placeholder-slate-500 outline-none transition focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
          disabled={loading}
        />
      </div>

      <div className="flex justify-end gap-4 border-t border-white/5 pt-4">
        <button
          type="submit"
          className="rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 px-6 py-3 text-sm font-bold text-slate-900 shadow-lg shadow-yellow-500/25 transition hover:opacity-90 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? t('form.saving') : label}
        </button>
      </div>
    </form>
  );
}
