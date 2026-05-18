import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { analyticsApi } from '../../api/analyticsApi';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi
      .summary()
      .then((r) => setData(r.data))
      .catch((err) => {
        const status = err.response?.status;
        if (status === 404 || status === 502) {
          setData({
            totalPageViews: Number(localStorage.getItem('yb_page_view') || 0),
            totalBusinessViews: Number(localStorage.getItem('yb_business_view') || 0),
            totalSearches: Number(localStorage.getItem('yb_search') || 0),
            unreadMessages: 0,
            pendingBusinesses: 0,
            popularBusinesses: [],
          });
          toast.error('API waa duug — START.bat dib u fur si Analytics u shaqeeyo');
        } else {
          toast.error(err.friendlyMessage || 'Failed to load analytics');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading analytics..." />;
  if (!data) return null;

  const cards = [
    { label: 'Page views', value: data.totalPageViews },
    { label: 'Business views', value: data.totalBusinessViews },
    { label: 'Searches', value: data.totalSearches },
    { label: 'Unread messages', value: data.unreadMessages },
    { label: 'Pending businesses', value: data.pendingBusinesses },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Analytics</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
            <p className="text-xs font-semibold uppercase text-slate-500">{c.label}</p>
            <p className="mt-2 text-3xl font-extrabold text-amber-600">{c.value}</p>
          </div>
        ))}
      </div>
      {data.popularBusinesses?.length > 0 && (
        <section>
          <h3 className="mb-3 font-bold text-slate-800 dark:text-white">Popular businesses</h3>
          <ul className="space-y-2">
            {data.popularBusinesses.map((b) => (
              <li key={b.businessId} className="flex justify-between rounded-lg bg-slate-50 px-4 py-2 dark:bg-slate-900">
                <span>{b.name}</span>
                <span className="font-semibold text-amber-600">{b.views} views</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
