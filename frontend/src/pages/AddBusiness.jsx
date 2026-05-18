import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { businessApi } from '../api/businessApi';
import { categoryApi } from '../api/categoryApi';
import BusinessForm, { getEmptyBusinessForm } from '../components/BusinessForm';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import { ensureArray } from '../utils/apiHelpers';
import { validateBusinessForm } from '../utils/validation';
import { useLanguage } from '../context/LanguageContext';

export default function AddBusiness() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState(getEmptyBusinessForm());
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    categoryApi
      .getAll()
      .then(({ data }) => setCategories(ensureArray(data)))
      .catch((err) => toast.error(err.friendlyMessage || t('form.loadCategoriesFailed')))
      .finally(() => setLoadingCategories(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateBusinessForm(form, t);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error(t('form.fixErrors'));
      return;
    }

    setLoading(true);
    try {
      await businessApi.submit({
        ...form,
        categoryId: Number(form.categoryId),
        companyWebsite: '',
      });
      toast.success(t('form.submitted'));
      navigate('/businesses');
    } catch (err) {
      toast.error(err.friendlyMessage || t('form.saveFailed'));
    } finally {
      setLoading(false);
    }
  };

  if (loadingCategories) return <LoadingSpinner message={t('form.loadingForm')} />;

  return (
    <div className="mx-auto max-w-3xl space-y-8 text-left">
      <PageHeader
        title={t('addBusinessPage.title')}
        subtitle={t('addBusinessPage.subtitle')}
      />
      <section className="rounded-2xl border border-white/10 bg-slate-900 p-6 lg:p-8 shadow-xl">
        <BusinessForm
          form={form}
          errors={errors}
          categories={categories}
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitLabel={t('addBusinessPage.submit')}
          loading={loading}
        />
      </section>
    </div>
  );
}