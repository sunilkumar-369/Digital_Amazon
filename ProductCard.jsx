import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Check } from 'lucide-react';
import ProductImage from './ProductImage.jsx';
import { useCart } from '../context/CartContext.jsx';
import { fmt } from '../config.js';

export default function ProductCard({ product }) {
  const { add, inCart, inWish, toggleWish } = useCart();
  const wished = inWish(product.id);
  const carted = inCart(product.id);

  return (
    <div className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
      <Link to={`/product/${product.id}`} className="relative block h-52 overflow-hidden bg-slate-100">
        <ProductImage product={product} className="w-full h-full group-hover:scale-105 transition-transform duration-700" />
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-[11px] font-black text-navy uppercase tracking-wide shadow-sm">
          {product.category}
        </span>
        {product.sample && (
          <span className="absolute bottom-3 left-3 bg-navy/80 text-white px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
            Sample
          </span>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">By {product.sellerName}</p>
        <Link to={`/product/${product.id}`} className="font-extrabold text-lg text-slate-800 leading-snug line-clamp-2 hover:text-navy flex-grow">
          {product.title}
        </Link>

        <div className="flex items-center justify-between mt-5">
          <span className="text-2xl font-black text-navy">{fmt(product.price)}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleWish(product)}
              aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
              className={`p-3 rounded-xl border transition-all ${wished ? 'bg-red-50 border-red-200 text-red-500' : 'border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200'}`}
            >
              <Heart className={`w-5 h-5 ${wished ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => add(product)}
              aria-label="Add to cart"
              className={`p-3 rounded-xl text-white shadow-md transition-all ${carted ? 'bg-teal' : 'bg-navy hover:bg-accent'}`}
            >
              {carted ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
