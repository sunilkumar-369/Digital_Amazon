import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useProducts } from '../context/ProductsContext.jsx';

export default function Wishlist() {
  const { wish } = useCart();
  const { products } = useProducts();
  // Prefer the live product (price may have changed); fall back to the saved snapshot
  const list = wish.map((w) => products.find((p) => p.id === w.id) || w);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-navy mb-8">Your wishlist</h1>
      {list.length === 0 ? (
        <div className="text-center py-24">
          <Heart className="w-14 h-14 text-slate-300 mx-auto mb-4" />
          <p className="font-bold text-slate-600">Nothing saved yet.</p>
          <Link to="/browse" className="btn-primary mt-6">Browse products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {list.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
