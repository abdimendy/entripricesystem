import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { businessApi } from '../api/businessApi';
import BusinessCard from '../components/BusinessCard';
import DeleteConfirmation from '../components/DeleteConfirmation';
import LoadingSpinner from '../components/LoadingSpinner';
import { DownloadDirectoryPdfButton } from '../components/DownloadPdfButton';
import PageHeader from '../components/PageHeader';
import { ensureArray } from '../utils/apiHelpers';

export default function BusinessList() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadBusinesses = async () => {
    setLoading(true);
    try {
      const { data } = await businessApi.getAll();
      setBusinesses(ensureArray(data));
    } catch (err) {
      toast.error(err.friendlyMessage || 'Failed to load businesses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBusinesses();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await businessApi.delete(deleteTarget.id);
      toast.success('Business deleted successfully');
      setDeleteTarget(null);
      loadBusinesses();
    } catch (err) {
      toast.error(err.friendlyMessage || 'Failed to delete business');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="All Businesses"
        subtitle={`${businesses.length} listings in the directory`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <DownloadDirectoryPdfButton />
            <Link to="/add-business" className="btn-primary">
              <Plus className="h-4 w-4" />
              Add Business
            </Link>
          </div>
        }
      />

      {loading ? (
        <LoadingSpinner message="Loading businesses..." />
      ) : businesses.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-semibold text-slate-700">No businesses yet</p>
          <p className="mt-1 text-slate-500">Add your first listing to get started</p>
          <Link to="/add-business" className="btn-primary mt-6">
            <Plus className="h-4 w-4" />
            Add First Business
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {businesses.map((b) => (
            <BusinessCard key={b.id} business={b} onDelete={setDeleteTarget} />
          ))}
        </div>
      )}

      <DeleteConfirmation
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        businessName={deleteTarget?.name}
        loading={deleting}
      />
    </div>
  );
}
