import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, ArrowRight, Zap, ShieldCheck, Wallet, UserPlus, Upload, Download, Store, Sparkles,
} from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import { useProducts } from '../context/ProductsContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { CATEGORIES } from '../config.js';

const TRUST = [
  { icon: Zap, title: 'Instant access', text: 'Buy once and open your files from your library right away.' },
  { icon: ShieldCheck, title: 'Protected downloads', text: 'File links stay private — only buyers and the seller can see them.' },
  { icon: Wallet, title: 'Creator-first', text: 'Anyone can open a seller account and list a product in minutes.' },
];

const STEPS = [
  { icon: UserPlus, title: 'Create an account', text: 'Join as a buyer, or as a creator if you want to sell.' },
  { icon: Upload, title: 'List or discover', text: 'Sellers publish products; buyers search and filter the catalog.' },
  { icon: Download, title: 'Get instant access', text: 'Purchases land in your library, ready to download.' },
];

export default function Home() {
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { isSeller } = useAuth();
  const [q, setQ] = useState('');

  const submit = (e) => {
    e.preventDefault();
    navigate(`/browse${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-navy pb-36 pt-16 md:pt-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -right-24 top-10 w-72 h-72 bg-accent/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-white/10 text-accent font-bold text-xs tracking-wider mb-6 border border-white/10">
            <Sparkles className="w-3.5 h-3.5" /> THE MARKETPLACE FOR DIGITAL PRODUCTS
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-5 leading-[1.1] tracking-tight">
            Sell what you create. <br className="hidden md:block" /> Buy what you need.
          </h1>
          <p className="text-slate-300 mb-9 text-base md:text-xl max-w-2xl mx-auto font-medium">
            Templates, source code, e-books, courses, audio and more — from independent creators, delivered instantly.
          </p>

          <form onSubmit={submit} className="bg-white/10 backdrop-blur-xl border border-white/20 p-2 rounded-2xl flex items-center shadow-2xl max-w-3xl mx-auto">
            <Search className="w-5 h-5 text-slate-300 ml-3 mr-2 shrink-0" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search UI kits, LUTs, e-books…"
              className="w-full bg-transparent text-white placeholder-slate-300 outline-none text-base md:text-lg px-2 min-w-0"
            />
            <button className="bg-accent hover:bg-accent-dark transition-colors text-white font-bold py-3 px-6 md:px-8 rounded-xl shadow-[0_0_15px_rgba(251,133,0,0.4)]">
              Search
            </button>
          </form>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/browse" className="btn-primary">Browse products <ArrowRight className="w-4 h-4" /></Link>
            <Link to={isSeller ? '/dashboard' : '/sell'} className="inline-flex items-center gap-2 font-bold text-white border border-white/30 hover:bg-white/10 px-6 py-3 rounded-xl transition-all">
              <Store className="w-4 h-4" /> Start selling
            </Link>
          </div>
        </div>
      </section>

      {/* Trust icons */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="grid md:grid-cols-3 gap-4">
          {TRUST.map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 flex gap-4">
              <div className="bg-accent/10 text-accent p-3 rounded-xl h-fit"><Icon className="w-6 h-6" /></div>
              <div>
                <h3 className="font-extrabold text-navy">{title}</h3>
                <p className="text-sm text-slate-500 mt-1">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <h2 className="text-2xl md:text-3xl font-extrabold text-navy mb-6">Shop by category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIES.map(({ name, icon: Icon, tint }) => (
            <Link
              key={name}
              to={`/browse?category=${encodeURIComponent(name)}`}
              className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col items-center gap-3 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <div className={`p-4 rounded-2xl ${tint}`}><Icon className="w-7 h-7" /></div>
              <span className="font-bold text-slate-700 text-sm text-center">{name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-navy">Trending now</h2>
          <Link to="/browse" className="text-navy font-bold hover:text-accent flex items-center gap-1 transition-colors">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {loading ? (
          <p className="text-slate-400">Loading products…</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <h2 className="text-2xl md:text-3xl font-extrabold text-navy mb-8 text-center">How it works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm text-center">
              <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-navy text-white flex items-center justify-center relative">
                <Icon className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 bg-accent text-xs font-black w-6 h-6 rounded-full flex items-center justify-center">{i + 1}</span>
              </div>
              <h3 className="font-extrabold text-navy">{title}</h3>
              <p className="text-sm text-slate-500 mt-2">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Seller CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-gradient-to-r from-navy to-navy-700 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-56 h-56 bg-accent/20 rounded-full blur-3xl" />
          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">Got something to sell?</h2>
            <p className="text-slate-300 mt-2 max-w-xl">Open a seller account, list your first product and track your sales from your own dashboard.</p>
          </div>
          <Link to={isSeller ? '/dashboard' : '/sell'} className="btn-primary relative z-10 shrink-0">
            {isSeller ? 'Go to dashboard' : 'Become a seller'} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
