import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Search, Heart, ShoppingCart, User, Menu, X, LogOut,
  LayoutDashboard, Library, ChevronDown, Store,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const navLink = ({ isActive }) =>
  `px-4 py-2 rounded-lg text-sm font-bold transition-all ${isActive ? 'bg-white text-navy' : 'text-slate-300 hover:text-white hover:bg-white/10'}`;

export default function Navbar() {
  const { user, profile, isSeller, logout } = useAuth();
  const { items, wish } = useCart();
  const toast = useToast();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [menu, setMenu] = useState(false);
  const [drop, setDrop] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const close = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDrop(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const search = (e) => {
    e.preventDefault();
    navigate(`/browse${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`);
    setMenu(false);
  };

  const doLogout = async () => {
    setDrop(false); setMenu(false);
    await logout();
    toast('Logged out securely');
    navigate('/');
  };

  const badge = (n) =>
    n > 0 && (
      <span className="absolute -top-0.5 -right-0.5 bg-accent text-[11px] font-black min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full border-2 border-navy">
        {n}
      </span>
    );

  return (
    <nav className="bg-navy text-white sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="bg-gradient-to-tr from-accent to-gold p-2 rounded-xl shadow-[0_0_15px_rgba(251,133,0,0.4)]">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tight">TrustVault<span className="text-accent">.</span></span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            <NavLink to="/" end className={navLink}>Home</NavLink>
            <NavLink to="/browse" className={navLink}>Browse</NavLink>
            <NavLink to={isSeller ? '/dashboard' : '/sell'} className={navLink}>Sell</NavLink>
          </div>

          {/* Desktop search */}
          <form onSubmit={search} className="hidden md:flex flex-1 max-w-md items-center bg-white/10 border border-white/15 rounded-xl px-3">
            <Search className="w-4 h-4 text-slate-300" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products…"
              className="w-full bg-transparent py-2.5 px-2 text-sm placeholder-slate-300 outline-none"
            />
          </form>

          {/* The three icons: wishlist, cart, account */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Link to="/wishlist" aria-label="Wishlist" className="relative p-2.5 rounded-full hover:bg-white/10 transition-colors">
              <Heart className="w-6 h-6 text-slate-200" />
              {badge(wish.length)}
            </Link>
            <Link to="/cart" aria-label="Cart" className="relative p-2.5 rounded-full hover:bg-white/10 transition-colors">
              <ShoppingCart className="w-6 h-6 text-slate-200" />
              {badge(items.length)}
            </Link>

            {user ? (
              <div className="relative" ref={dropRef}>
                <button
                  onClick={() => setDrop((d) => !d)}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Account menu"
                >
                  <div className="w-9 h-9 rounded-full bg-slate-200 border-2 border-teal overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} alt="" />
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-300 hidden sm:block" />
                </button>
                {drop && (
                  <div className="absolute right-0 mt-2 w-60 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="font-bold truncate">{profile?.name || user.displayName || 'Account'}</p>
                      <p className="text-[11px] font-bold text-accent uppercase tracking-widest">{profile?.role || 'buyer'}</p>
                    </div>
                    <Link to="/library" onClick={() => setDrop(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 font-semibold text-sm">
                      <Library className="w-4 h-4 text-navy" /> My Library
                    </Link>
                    <Link to={isSeller ? '/dashboard' : '/sell'} onClick={() => setDrop(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 font-semibold text-sm">
                      {isSeller ? <LayoutDashboard className="w-4 h-4 text-navy" /> : <Store className="w-4 h-4 text-navy" />}
                      {isSeller ? 'Seller Dashboard' : 'Become a Seller'}
                    </Link>
                    <button onClick={doLogout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 font-semibold text-sm border-t border-slate-100">
                      <LogOut className="w-4 h-4" /> Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="hidden sm:flex bg-white text-navy hover:bg-slate-100 font-bold px-5 py-2.5 rounded-xl transition-all items-center gap-2 text-sm">
                <User className="w-4 h-4" /> Sign In
              </Link>
            )}

            <button onClick={() => setMenu((m) => !m)} className="lg:hidden p-2.5 rounded-full hover:bg-white/10" aria-label="Menu">
              {menu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menu && (
        <div className="lg:hidden border-t border-white/10 bg-navy-700 px-4 pb-5 pt-3 space-y-2">
          <form onSubmit={search} className="flex items-center bg-white/10 border border-white/15 rounded-xl px-3">
            <Search className="w-4 h-4 text-slate-300" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="w-full bg-transparent py-3 px-2 text-sm placeholder-slate-300 outline-none" />
          </form>
          {[['/', 'Home'], ['/browse', 'Browse'], [isSeller ? '/dashboard' : '/sell', 'Sell'], ['/library', 'My Library']].map(([to, label]) => (
            <NavLink key={label} to={to} end={to === '/'} onClick={() => setMenu(false)} className={({ isActive }) => `block px-4 py-3 rounded-xl font-bold ${isActive ? 'bg-white text-navy' : 'text-slate-200 hover:bg-white/10'}`}>
              {label}
            </NavLink>
          ))}
          {user ? (
            <button onClick={doLogout} className="w-full text-left px-4 py-3 rounded-xl font-bold text-red-300 hover:bg-white/10">Log out</button>
          ) : (
            <Link to="/login" onClick={() => setMenu(false)} className="block text-center bg-accent font-bold px-4 py-3 rounded-xl">Sign In / Register</Link>
          )}
        </div>
      )}
    </nav>
  );
}
