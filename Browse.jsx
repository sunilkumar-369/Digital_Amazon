import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SearchX, X } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import { useProducts } from '../context/ProductsContext.jsx';
import { CATEGORIES } from '../config.js';

export default function Browse() {
  const [params, setParams] = useSearchParams();
  const { products, loading, error } = useProducts();
  const q = params.get('q') || '';
  const category = params.get('category') || '';
  const sort = params.get('sort') || 'newest';

  const set = (key, val) => {
    const next = new URLSearchParams(params);
    if (val) next.set(key, val); else next.delete(key);
    setParams(next, { replace: true });
  };

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    let out = products.filter((p) =>
      (!category || p.category === category) &&
      (!term || [p.title, p.description, p.sellerName, p.category].some((f) => (f || '').toLowerCase().includes(term)))
    );
    if (sort === 'low') out = [...out].sort((a, b) => a.price - b.price);
    if (sort === 'high') out = [...out].sort((a, b) => b.price - a.price);
    return out; // 'newest' keeps the order from Firestore
  }, [products, q, category, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-navy">Browse products</h1>
      <p className="text-slate-500 mt-1">{loading ? 'Loading…' : `${list.length} result${list.length === 1 ? '' : 's'}`}</p>

      <div className="mt-6 flex flex-col md:flex-row gap-3">
        <div className="flex-1 flex items-center bg-white border border-slate-200 rounded-xl px-3 shadow-sm">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            value={q}
            onChange={(e) => set('q', e.target.value)}
            placeholder="Search by title, seller or keyword"
            className="w-full py-3 px-2 outline-none bg-transparent"
          />
          {q && <button onClick={() => set('q', '')} aria-label="Clear search"><X className="w-4 h-4 text-slate-400" /></button>}
        </div>
        <select
          value={sort}
          onChange={(e) => set('sort', e.target.value === 'newest' ? '' : e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-700 shadow-sm outline-none"
        >
          <option value="newest">Newest</option>
          <option value="low">Price: low to high</option>
          <option value="high">Price: high to low</option>
        </select>
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
        {[{ name: '' , label: 'All' }, ...CATEGORIES.map((c) => ({ name: c.name, label: c.name }))].map(({ name, label }) => (
          <button
            key={label}
            onClick={() => set('category', name)}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap border transition-all ${category === name ? 'bg-navy text-white border-navy' : 'bg-white text-slate-600 border-slate-200 hover:border-navy'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-6 text-sm bg-red-50 text-red-600 border border-red-100 rounded-xl p-4">
          Couldn't load live products ({error.code || 'error'}). Check your Firestore rules and Firebase keys.
        </p>
      )}

      {list.length === 0 && !loading ? (
        <div className="text-center py-24">
          <SearchX className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="font-bold text-slate-600">No products match your search.</p>
          <button onClick={() => setParams({}, { replace: true })} className="btn-ghost mt-5">Clear filters</button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {list.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
