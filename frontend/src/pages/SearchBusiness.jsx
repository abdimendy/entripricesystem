import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import toast from 'react-hot-toast';
import { businessApi } from '../api/businessApi';
import BusinessCard from '../components/BusinessCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import { normalizeSearchResponse } from '../utils/apiHelpers';

export default function SearchBusiness() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const runSearch = async (term) => {
    if (!term.trim()) {
      toast.error('Enter a search term');
      return;
    }
    setLoading(true);
    setSearched(true);
    setSearchParams({ q: term.trim() });
    try {
      const { data } = await businessApi.search({ name: term.trim(), page: 1, pageSize: 24 });
      setResults(normalizeSearchResponse(data).items);
    } catch (err) {
      toast.error(err.friendlyMessage || 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) runSearch(initialQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    runSearch(query);
  };

  return (
    <section className="space-y-8">
      <PageHeader
        title="Search Businesses"
        subtitle="Find listings by name, phone, email, or category"
      />

      <SearchBar value={query} onChange={setQuery} onSubmit={handleSubmit} />

      {loading && <LoadingSpinner message="Searching..." />}

      {!loading && searched && (
        <p className="text-sm font-medium text-slate-500">
          {results.length} result{results.length !== 1 ? 's' : ''} for &quot;{query}&quot;
        </p>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <SearchX className="mb-4 h-12 w-12 text-slate-300" />
          <p className="font-semibold text-slate-700">No matches found</p>
          <p className="mt-1 text-sm text-slate-500">Try a different search term</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((b) => (
            <BusinessCard key={b.id} business={b} onDelete={() => {}} />
          ))}
        </div>
      )}
    </section>
  );
}
