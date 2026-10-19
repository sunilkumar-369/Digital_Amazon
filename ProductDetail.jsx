import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, Heart, ShieldCheck, ShoppingCart, Zap, Check } from 'lucide-react';
import ProductImage from '../components/ProductImage.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { useProducts } from '../context/ProductsContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { usePurchases } from '../hooks/usePurchases.js';
import { openDownload } from '../lib/download.js';
import { fmt } from '../config.js';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { add, inCart, inWish, toggleWish } = useCart();
  const { user } = useAuth();
  const { owns } = usePurchases();
  const toast = useToast();

  const product = products.find((p) => p.id === id);

  if (loading) return <p className="text-center text-slate-400 py-32">Loading…</p>;
  if (!product) {
    return (
      <div className="text-center py-32 px-4">
        <p className="text-xl font-bold text-navy">Product not found</p>
        <p className="text-slate-500 mt-2">It may have been removed by the seller.</p>
        <Link to="/browse" className="btn-primary mt-6">Browse products</Link>
      </div>
    );
  }

  const owned = owns(product.id);
  const isOwn = user && product.sellerId === user.uid;
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const buyNow = () => {
    if (!inCart(product.id)) add(product);
    navigate('/cart');
  };

  const download = async () => {
    const res = await openDownload(product.id);
    if (!res.ok) toast(res.message, 'error');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/browse" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-navy mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to browse
      </Link>

      <div className="grid lg:grid-cols-2 gap-10">
        <div className="rounded-3xl overflow-hidden bg-slate-100 shadow-lg border border-slate-100 aspect-[4/3]">
          <ProductImage product={product} className="w-full h-full" />
        </div>

        <div>
          <span className="inline-block bg-navy/5 text-navy text-xs font-black uppercase tracking-wide px-3 py-1.5 rounded-lg">{product.category}</span>
          {product.sample && <span className="ml-2 inline-block bg-slate-200 text-slate-600 text-xs font-bold uppercase px-3 py-1.5 rounded-lg">Sample listing</span>}
          <h1 className="text-3xl md:text-4xl font-extrabold text-navy mt-4 leading-tight">{product.title}</h1>
          <p className="text-slate-500 mt-2 font-medium">By <span className="text-slate-700 font-bold">{product.sellerName}</span></p>

          <p className="text-4xl font-black text-navy mt-6">{fmt(product.price)}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            {owned ? (
              <button onClick={download} className="btn-primary"><Download className="w-5 h-5" /> Download</button>
            ) : isOwn ? (
              <Link to="/dashboard" className="btn-secondary">This is your product — manage it</Link>
            ) : (
              <>
                <button onClick={buyNow} className="btn-primary"><Zap className="w-5 h-5" /> Buy now</button>
                <button onClick={() => add(product)} className="btn-secondary" disabled={inCart(product.id)}>
                  {inCart(product.id) ? <><Check className="w-5 h-5" /> In cart</> : <><ShoppingCart className="w-5 h-5" /> Add to cart</>}
                </button>
              </>
            )}
            <button
              onClick={() => toggleWish(product)}
              aria-label="Wishlist"
              className={`p-3.5 rounded-xl border transition-all ${inWish(product.id) ? 'bg-red-50 border-red-200 text-red-500' : 'border-slate-200 text-slate-400 hover:text-red-500'}`}
            >
              <Heart className={`w-5 h-5 ${inWish(product.id) ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="mt-8 bg-white rounded-2xl border border-slate-100 p-5">
            <h2 className="font-extrabold text-navy mb-2">About this product</h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">{product.description || 'No description provided.'}</p>
          </div>

          <ul className="mt-5 space-y-2 text-sm text-slate-600">
            <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-accent" /> Instant access after purchase</li>
            <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-teal" /> Download link is private to buyers</li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-extrabold text-navy mb-6">More in {product.category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
