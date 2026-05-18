import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { categoryApi } from '../../api/categoryApi';
import { getCategoryIcon } from '../../components/CategoryCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import EmptyState from '../../components/EmptyState';
import { ensureArray } from '../../utils/apiHelpers';

const ICON_OPTIONS = [
  { value: 'hotel', label: 'Hotels', emoji: '🏨' },
  { value: 'hospital', label: 'Hospitals', emoji: '🏥' },
  { value: 'school', label: 'Schools', emoji: '🏫' },
  { value: 'restaurant', label: 'Restaurants', emoji: '🍽️' },
  { value: 'bank', label: 'Banks', emoji: '🏦' },
  { value: 'university', label: 'Universities', emoji: '🎓' },
  { value: 'pharmacy', label: 'Pharmacies', emoji: '💊' },
  { value: 'telecom', label: 'Telecom', emoji: '📱' },
  { value: 'transport', label: 'Transport', emoji: '🚌' },
  { value: 'supermarket', label: 'Supermarkets', emoji: '🛒' },
];

const emptyForm = { name: '', description: '', icon: 'restaurant' };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await categoryApi.getAll();
      setCategories(ensureArray(data));
    } catch (err) {
      toast.error(err.friendlyMessage || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({
      name: c.name,
      description: c.description || '',
      icon: c.icon || 'restaurant',
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      description: form.description?.trim() || null,
      icon: form.icon || null,
    };
    try {
      if (editing) {
        await categoryApi.update(editing.id, payload);
        toast.success('Category updated');
      } else {
        await categoryApi.create(payload);
        toast.success('Category created');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.friendlyMessage || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await categoryApi.delete(id);
      toast.success('Category deleted');
      load();
    } catch (err) {
      toast.error(err.friendlyMessage || 'Cannot delete — category may have businesses');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500 p-8 shadow-xl shadow-amber-500/25">
        <motion.div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
        <motion.div className="absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-slate-900/10 blur-2xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-amber-950/70">Directory</p>
            <h2 className="text-3xl font-extrabold text-slate-900">Manage Categories</h2>
            <p className="mt-2 text-slate-800/80">
              {categories.length} industry categories for Somalia businesses
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-slate-800"
          >
            <FaPlus /> Add Category
          </button>
        </div>
      </div>

      {categories.length === 0 ? (
        <EmptyState
          title="No categories yet"
          message="Create categories like Hotels, Banks, Telecom, and more."
          actionLabel="Add Category"
          onAction={openCreate}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((c, i) => {
            const emoji = getCategoryIcon(c);
            return (
              <motion.article
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="relative bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400 px-6 py-10 text-center">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
                  <span className="relative text-5xl drop-shadow-md">{emoji}</span>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{c.name}</h3>
                      {c.description && (
                        <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                          {c.description}
                        </p>
                      )}
                      <span className="mt-4 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900 dark:bg-amber-500/20 dark:text-amber-300">
                        {c.businessCount ?? 0} businesses
                      </span>
                    </div>
                    <div className="flex shrink-0 flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(c)}
                        className="rounded-xl p-2.5 text-amber-600 transition hover:bg-amber-50 dark:hover:bg-amber-500/10"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(c.id, c.name)}
                        className="rounded-xl p-2.5 text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Category' : 'Add New Category'}
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-5">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Name <span className="text-red-500">*</span>
            </span>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="input-field"
              placeholder="e.g. Telecom"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Description
            </span>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="input-field resize-none"
              rows={3}
              placeholder="What businesses belong here?"
            />
          </label>
          <div>
            <span className="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Choose icon
            </span>
            <div className="grid grid-cols-5 gap-2">
              {ICON_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, icon: opt.value }))}
                  className={`flex flex-col items-center gap-1 rounded-xl border-2 p-2.5 text-center transition ${
                    form.icon === opt.value
                      ? 'border-amber-500 bg-amber-50 shadow-md dark:bg-amber-500/15'
                      : 'border-slate-200 hover:border-amber-300 dark:border-slate-600'
                  }`}
                  title={opt.label}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className="line-clamp-1 text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Saving...' : editing ? 'Update' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
