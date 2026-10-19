import { Link, Navigate } from 'react-router-dom';
import { Download, PackageOpen } from 'lucide-react';
import ProductImage from '../components/ProductImage.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { usePurchases } from '../hooks/usePurchases.js';
import { openDownload } from '../lib/download.js';
import { fmt } from '../config.js';

export default function Library() {
  const { user, loading: authLoading } = useAuth();
  const { purchases, loading } = usePurchases();
  const toast = useToast();

  if (authLoading) return <p className="text-center text-slate-400 py-32">Loading…</p>;
  if (!user) return <Navigate to="/login" state={{ from: '/library' }} replace />;

  const download = async (id) => {
    const res = await openDownload(id);
    if (!res.ok) toast(res.message, 'error');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-navy">My library</h1>
      <p className="text-slate-500 mt-1 mb-8">Everything you've purchased, ready to download.</p>

      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : purchases.length === 0 ? (
        <div className="text-center py-24">
          <PackageOpen className="w-14 h-14 text-slate-300 mx-auto mb-4" />
          <p className="font-bold text-slate-600">No purchases yet.</p>
          <Link to="/browse" className="btn-primary mt-6">Browse products</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {purchases.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4 shadow-sm">
              <div className="w-24 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                <ProductImage product={p} className="w-full h-full" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 line-clamp-2">{p.title}</p>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">By {p.sellerName} · {fmt(p.price)}</p>
              </div>
              <button onClick={() => download(p.productId)} className="btn-primary !px-4 !py-2.5 text-sm">
                <Download className="w-4 h-4" /> <span className="hidden sm:inline">Download</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
