import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Store, Upload, BarChart3, Wallet, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const PERKS = [
  { icon: Upload, title: 'List in minutes', text: 'Add a title, price, cover image and your private download link.' },
  { icon: BarChart3, title: 'Track your sales', text: 'Your dashboard shows revenue, sales and every transaction.' },
  { icon: Wallet, title: 'Full control', text: 'Edit prices, hide or republish a product whenever you like.' },
];

// Landing page for "Sell": routes people to the right next step
export default function Sell() {
  const { user, profile, isSeller, becomeSeller, loading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  if (isSeller) return <Navigate to="/dashboard" replace />;

  const upgrade = async () => {
    setBusy(true);
    try { await becomeSeller(); toast('You are now a seller!'); navigate('/dashboard'); }
    catch { toast('Could not upgrade your account. Try again.', 'error'); }
    finally { setBusy(false); }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="text-center max-w-2xl mx-auto">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-5"><Store className="w-8 h-8" /></div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-navy leading-tight">Turn your work into income</h1>
        <p className="text-slate-500 mt-4 text-lg">Open a seller account and start selling templates, code, courses, music or anything digital.</p>

        <div className="mt-8">
          {loading ? null : !user ? (
            <Link to="/login" state={{ mode: 'register', role: 'seller', from: '/dashboard' }} className="btn-primary">Create a seller account</Link>
          ) : profile ? (
            <button onClick={upgrade} disabled={busy} className="btn-primary">
              {busy && <Loader2 className="w-4 h-4 animate-spin" />} Switch my account to seller
            </button>
          ) : (
            <Loader2 className="w-6 h-6 animate-spin text-slate-400 mx-auto" />
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-14">
        {PERKS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-7">
            <div className="bg-navy text-white p-3 rounded-xl w-fit mb-4"><Icon className="w-5 h-5" /></div>
            <h3 className="font-extrabold text-navy">{title}</h3>
            <p className="text-sm text-slate-500 mt-2">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
