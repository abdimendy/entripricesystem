import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { paymentApi } from '../../api/paymentApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ensureArray } from '../../utils/apiHelpers';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await paymentApi.getAll();
      setPayments(ensureArray(data));
    } catch (err) {
      toast.error(err.friendlyMessage || 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (id) => {
    if (!window.confirm('Delete this payment record?')) return;
    try {
      await paymentApi.delete(id);
      toast.success('Deleted');
      load();
    } catch (err) {
      toast.error(err.friendlyMessage || 'Delete failed');
    }
  };

  if (loading) return <LoadingSpinner message="Loading payments..." />;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Payments</h2>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-900">
            <tr>
              <th className="px-4 py-3">Payer</th>
              <th className="px-4 py-3">Business</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Txn</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-t border-slate-100 dark:border-slate-700">
                <td className="px-4 py-3 font-medium">{p.payerName}</td>
                <td className="px-4 py-3">{p.businessName || p.businessId}</td>
                <td className="px-4 py-3">${Number(p.amount).toFixed(2)}</td>
                <td className="px-4 py-3">{p.paymentMethod}</td>
                <td className="px-4 py-3 font-mono text-xs">{p.transactionNumber}</td>
                <td className="px-4 py-3">
                  <button type="button" onClick={() => remove(p.id)} className="text-red-600 text-xs font-semibold hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!payments.length && <p className="p-8 text-center text-slate-500">No payments yet.</p>}
      </div>
    </div>
  );
}
