import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { Trash2, ShoppingBag, Lock, Loader2, Info } from 'lucide-react';
import ProductImage from '../components/ProductImage.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { db, isConfigured } from '../firebase.js';
import { fmt } from '../config.js';

export default function Cart() {
  const { items, total, remove, clear } = useCart();
  const { user, profile } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const checkout = async () => {
    if (!user) { navigate('/login', { state: { from: '/cart' } }); return; }
    if (!isConfigured) { toast('Connect Firebase first (see README)', 'error'); return; }
    if (items.some((i) => i.sellerId === user.uid)) {
      toast("You can't buy your own product — remove it from the cart", 'error');
      return;
    }
    setBusy(true);
    try {
      const batch = writeBatch(db);
      items.forEach((i) => {
        batch.set(doc(db, 'users', user.uid, 'purchases', i.id), {
          productId: i.id, title: i.title, price: i.price, imageUrl: i.imageUrl,
          category: i.category || '', sellerId: i.sellerId, sellerName: i.sellerName || '',
          purchasedAt: serverTimestamp(),
        });
        if (!i.sample) {
          batch.set(doc(collection(db, 'sales')), {
            productId: i.id, title: i.title, price: i.price, sellerId: i.sellerId,
            buyerId: user.uid, buyerName: profile?.name || '', createdAt: serverTimestamp(),
          });
        }
      });
      await batch.commit();
      clear();
      toast('Purchase complete! Find it in your library.');
      navigate('/library');
    } catch (e) {
      toast(`Checkout failed: ${e.code || e.message}`, 'error');
    } finally {
      setBusy(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-28 px-4">
        <ShoppingBag className="w-14 h-14 text-slate-300 mx-auto mb-4" />
        <h1 className="text-2xl font-extrabold text-navy">Your cart is empty</h1>
        <p className="text-slate-500 mt-2 mb-6">Find something great to add.</p>
        <Link to="/browse" className="btn-primary">Browse products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-navy mb-8">Your cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((i) => (
            <div key={i.id} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4 shadow-sm">
              <Link to={`/product/${i.id}`} className="w-24 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                <ProductImage product={i} className="w-full h-full" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${i.id}`} className="font-bold text-slate-800 hover:text-navy line-clamp-2">{i.title}</Link>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">By {i.sellerName}</p>
              </div>
              <p className="font-black text-navy">{fmt(i.price)}</p>
              <button onClick={() => remove(i.id)} aria-label="Remove" className="p-2 text-slate-400 hover:text-red-500">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <aside className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 h-fit lg:sticky lg:top-28">
          <h2 className="font-extrabold text-navy mb-4">Order summary</h2>
          <div className="flex justify-between text-sm text-slate-500 mb-2"><span>Items ({items.length})</span><span>{fmt(total)}</span></div>
          <div className="flex justify-between font-black text-xl text-navy border-t border-slate-100 pt-4 mt-4"><span>Total</span><span>{total === 0 ? 'Free' : fmt(total)}</span></div>
          <button onClick={checkout} disabled={busy} className="btn-primary w-full mt-6">
            {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-4 h-4" />}
            {user ? (total === 0 ? 'Get for free' : 'Complete purchase') : 'Sign in to checkout'}
          </button>
          <p className="mt-4 text-xs text-slate-500 bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            Demo checkout: no real payment is taken yet. Connect Stripe or Razorpay to charge real money (see README).
          </p>
        </aside>
      </div>
    </div>
  );
}
