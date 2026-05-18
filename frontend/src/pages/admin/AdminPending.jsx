import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { businessApi } from '../../api/businessApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ensureArray } from '../../utils/apiHelpers';

export default function AdminPending() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await businessApi.getPending();
      setItems(ensureArray(data));
    } catch (err) {
      const status = err.response?.status;
      if (status === 404) {
        toast.error('API waa duug — START.bat dib u fur (Pending ma shaqeynayo)');
        setItems([]);
      } else {
        toast.error(err.friendlyMessage || 'Failed to load');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const approve = async (id) => {
    try {
      await businessApi.approve(id);
      toast.success('Approved');
      load();
    } catch (err) {
      toast.error(err.friendlyMessage || 'Approve failed');
    }
  };

  if (loading) return <LoadingSpinner message="Loading pending..." />;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Pending businesses</h2>
      {!items.length ? (
        <p className="text-slate-500">No pending submissions.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((b) => (
            <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{b.name}</p>
                <p className="text-sm text-slate-500">{b.phone} · {b.city} · {b.categoryName}</p>
              </div>
              <button type="button" onClick={() => approve(b.id)} className="btn-primary">Approve</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
