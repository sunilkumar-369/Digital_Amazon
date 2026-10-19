import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import {
  LayoutDashboard, Package, Plus, DollarSign, Download, TrendingUp, Eye, EyeOff, Pencil, Loader2,
} from 'lucide-react';
import { db } from '../firebase.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import ProductForm from '../components/ProductForm.jsx';
import ProductImage from '../components/ProductImage.jsx';
import { fmt } from '../config.js';

const when = (ts) => (ts?.seconds ? new Date(ts.seconds * 1000).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Just now');

export default function Dashboard() {
  const { user, profile, isSeller, loading } = useAuth();
  const toast = useToast();
  const [tab, setTab] = useState('overview');
  const [editing, setEditing] = useState(null);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);

  useEffect(() => {
    if (!user || !isSeller) return;
    const u1 = onSnapshot(query(collection(db, 'products'), where('sellerId', '==', user.uid)),
      (s) => setProducts(s.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => (b.createdAt?.seconds || 9e9) - (a.createdAt?.seconds || 9e9))),
      () => {});
    const u2 = onSnapshot(query(collection(db, 'sales'), where('sellerId', '==', user.uid)),
      (s) => setSales(s.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => (b.createdAt?.seconds || 9e9) - (a.createdAt?.seconds || 9e9))),
      () => {});
    return () => { u1(); u2(); };
  }, [user, isSeller]);

  const stats = useMemo(() => {
    const revenue = sales.reduce((s, x) => s + (Number(x.price) || 0), 0);
    return {
      revenue,
      count: sales.length,
      active: products.filter((p) => p.status !== 'archived').length,
    };
  }, [sales, products]);

  const salesByProduct = useMemo(() => {
    const m = {};
    sales.forEach((s) => { m[s.productId] = (m[s.productId] || 0) + 1; });
    return m;
  }, [sales]);

  if (loading) return <p className="text-center text-slate-400 py-32">Loading…</p>;
  if (!user) return <Navigate to="/login" state={{ from: '/dashboard' }} replace />;
  if (!profile) return <div className="py-32 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>;
  if (!isSeller) return <Navigate to="/sell" replace />;

  const toggleStatus = async (p) => {
    const next = p.status === 'archived' ? 'published' : 'archived';
    try {
      await updateDoc(doc(db, 'products', p.id), { status: next });
      toast(next === 'archived' ? 'Product hidden from the store' : 'Product is live again');
    } catch { toast('Could not update product', 'error'); }
  };

  const nav = [
    ['overview', 'Overview', LayoutDashboard],
    ['products', 'My products', Package],
    ['add', 'Add product', Plus],
  ];
  const go = (t) => { setTab(t); setEditing(null); };

  const stat = [
    { label: 'Gross revenue', value: fmt(stats.revenue) || '$0', icon: DollarSign, c: 'teal' },
    { label: 'Total sales', value: stats.count, icon: Download, c: 'navy' },
    { label: 'Active products', value: stats.active, icon: Package, c: 'accent' },
  ];
  const tone = { teal: 'bg-teal/10 text-teal', navy: 'bg-navy/10 text-navy', accent: 'bg-accent/10 text-accent' };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)] bg-slate-50">
      <aside className="md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 shrink-0">
        <div className="p-4 md:p-6">
          <p className="hidden md:block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Store management</p>
          <nav className="flex md:flex-col gap-2 overflow-x-auto">
            {nav.map(([key, label, Icon]) => (
              <button
                key={key}
                onClick={() => go(key)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold whitespace-nowrap transition-all ${tab === key ? 'bg-navy/5 text-navy md:border-l-4 border-navy' : 'text-slate-600 hover:bg-slate-50 hover:text-navy'}`}
              >
                <Icon className="w-5 h-5" /> {label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-10 min-w-0">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-navy">Hi, {profile.name?.split(' ')[0] || 'there'} 👋</h1>
            <p className="text-slate-500 mt-1">Here's how your store is doing.</p>
          </div>
          <button onClick={() => go('add')} className="btn-primary"><Plus className="w-5 h-5" /> New product</button>
        </div>

        {tab === 'overview' && (
          <>
            <div className="grid sm:grid-cols-3 gap-5 mb-8">
              {stat.map(({ label, value, icon: Icon, c }) => (
                <div key={label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className={`p-4 rounded-2xl ${tone[c]}`}><Icon className="w-7 h-7" /></div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                    <p className="text-2xl font-black text-navy mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-navy" />
                <h3 className="text-lg font-bold text-navy">Recent transactions</h3>
              </div>
              {sales.length === 0 ? (
                <p className="p-10 text-center text-slate-400">No sales yet. Share your product links to get your first one!</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100">
                        <th className="px-6 py-4 font-bold">Product</th>
                        <th className="px-6 py-4 font-bold">Date</th>
                        <th className="px-6 py-4 font-bold">Buyer</th>
                        <th className="px-6 py-4 font-bold">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sales.slice(0, 15).map((s) => (
                        <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50/80">
                          <td className="px-6 py-4 font-bold text-navy">{s.title}</td>
                          <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{when(s.createdAt)}</td>
                          <td className="px-6 py-4 text-slate-500">{s.buyerName || 'Buyer'}</td>
                          <td className="px-6 py-4 font-black text-navy">{fmt(s.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {tab === 'products' && (
          products.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-14 text-center">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="font-bold text-slate-600">You haven't listed anything yet.</p>
              <button onClick={() => go('add')} className="btn-primary mt-5"><Plus className="w-5 h-5" /> Add your first product</button>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((p) => (
                <div key={p.id} className={`bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4 shadow-sm ${p.status === 'archived' ? 'opacity-60' : ''}`}>
                  <Link to={`/product/${p.id}`} className="w-24 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                    <ProductImage product={p} className="w-full h-full" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 line-clamp-2">{p.title}</p>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">
                      {p.category} · {fmt(p.price)} · {salesByProduct[p.id] || 0} sold {p.status === 'archived' && '· Hidden'}
                    </p>
                  </div>
                  <button onClick={() => { setEditing(p); setTab('add'); }} aria-label="Edit" className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100"><Pencil className="w-5 h-5" /></button>
                  <button onClick={() => toggleStatus(p)} aria-label={p.status === 'archived' ? 'Republish' : 'Hide'} className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100">
                    {p.status === 'archived' ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
              ))}
            </div>
          )
        )}

        {tab === 'add' && (
          <ProductForm key={editing?.id || 'new'} initial={editing} onDone={() => go('products')} />
        )}
      </main>
    </div>
  );
}
