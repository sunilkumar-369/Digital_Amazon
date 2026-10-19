import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { CATEGORIES } from '../config.js';

export default function Footer() {
  return (
    <footer className="bg-navy text-slate-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="bg-gradient-to-tr from-accent to-gold p-2 rounded-xl"><ShieldCheck className="w-5 h-5 text-white" /></div>
            <span className="text-xl font-black text-white">TrustVault<span className="text-accent">.</span></span>
          </div>
          <p className="max-w-sm text-sm leading-relaxed">
            A marketplace for digital products. Creators sell templates, courses, code, music and more —
            buyers get instant access from their personal library.
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/browse" className="hover:text-white">Browse all</Link></li>
            {CATEGORIES.slice(0, 4).map((c) => (
              <li key={c.name}><Link to={`/browse?category=${encodeURIComponent(c.name)}`} className="hover:text-white">{c.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Account</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/login" className="hover:text-white">Sign in</Link></li>
            <li><Link to="/library" className="hover:text-white">My library</Link></li>
            <li><Link to="/sell" className="hover:text-white">Start selling</Link></li>
            <li><Link to="/wishlist" className="hover:text-white">Wishlist</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} TrustVault. All rights reserved.
      </div>
    </footer>
  );
}
