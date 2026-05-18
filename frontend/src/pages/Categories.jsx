import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Tags, X, Pencil, Trash2, Plus } from 'lucide-react';
import { categoryApi } from '../api/categoryApi';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import { ensureArray } from '../utils/apiHelpers';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' ama 'edit'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Soo ror xogta ka socota PostgreSQL
  const loadCategories = async () => {
    try {
      setLoading(true);
      const { data } = await categoryApi.getAll();
      setCategories(ensureArray(data));
    } catch (err) {
      toast.error(err.friendlyMessage || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Fur modal-ka abuurista (Add)
  const openAddModal = () => {
    setModalType('add');
    setCategoryName('');
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  // Fur modal-ka wax ka beddelka (Edit)
  const openEditModal = (category) => {
    setModalType('edit');
    setSelectedCategory(category);
    setCategoryName(category.name);
    setIsModalOpen(true);
  };

  // Function-ka maamula Add iyo Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      return toast.error('Fadlan qor magaca category-ga!');
    }

    try {
      setIsSubmitting(true);
      if (modalType === 'add') {
        await categoryApi.create({ name: categoryName.trim() });
        toast.success('Category cusub waa la abuuray!');
      } else {
        await categoryApi.update(selectedCategory.id, { name: categoryName.trim() });
        toast.success('Category-ga waa la update gareeyay!');
      }
      setIsModalOpen(false);
      loadCategories(); // Dib u soo ror xogta PostgreSQL
    } catch (err) {
      toast.error(err.friendlyMessage || 'Shaqadu way fashilantay');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function-ka Delete-ka
  const handleDelete = async (id) => {
    if (!window.confirm('Ma hubtaa inaad rabto inaad tirtirto category-gan?')) return;

    try {
      await categoryApi.delete(id);
      toast.success('Category-gii waa la tirtiray!');
      loadCategories(); // Dib u soo ror xogta PostgreSQL
    } catch (err) {
      toast.error(err.friendlyMessage || 'Wuu ku fashilmay tirtirista');
    }
  };

  if (loading) return <LoadingSpinner message="Loading categories..." />;

  return (
    <div className="space-y-8">
      {/* Header-ka oo leh batoonka ku darista oo geeska midig ku yaal */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Categories"
          subtitle={`${categories.length} categories in the directory`}
        />
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 px-5 py-3 text-sm font-bold text-slate-900 shadow-lg shadow-yellow-500/25 transition hover:opacity-90 sm:self-end"
        >
          <Plus className="h-5 w-5" />
          Add Category
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="card py-16 text-center text-slate-600 dark:text-slate-400">
          No categories found.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((c) => (
            <div key={c.id} className="card group relative flex items-center gap-4 p-5">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400">
                <Tags className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-slate-900 dark:text-white">{c.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {c.businessCount ?? c.BusinessCount ?? 0} businesses
                </p>
              </div>

              {/* Batoonada Update iyo Delete ee geeska ku dhex jira */}
              <div className="flex items-center gap-1.5 opacity-80 transition group-hover:opacity-100">
                <button
                  onClick={() => openEditModal(c)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/5 dark:hover:text-white"
                  title="Edit Category"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                  title="Delete Category"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- MODAL POP-UP (NASHQADDA QIIMAHA LEH EE LAGA DOORAY KHATARTA) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl text-left animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Tags className="h-5 w-5 text-yellow-400" />
                {modalType === 'add' ? 'Add New Category' : 'Update Category'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="E.g., Healthcare, Education, Hotels"
                  style={{ backgroundColor: '#1e293b', color: '#ffffff' }}
                  className="w-full rounded-xl border border-white/10 px-4 py-3 text-sm placeholder-slate-400 outline-none transition focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                  autoFocus
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 px-5 py-2.5 text-sm font-bold text-slate-900 shadow-lg shadow-yellow-500/25 transition hover:opacity-90 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : modalType === 'add' ? 'Save Category' : 'Update Category'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}