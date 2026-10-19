import { useState } from 'react';
import { categoryMeta } from '../config.js';

// Cover image with a graceful category-coloured fallback
export default function ProductImage({ product, className = '' }) {
  const [failed, setFailed] = useState(false);
  const meta = categoryMeta(product.category);
  const Icon = meta.icon;

  if (!product.imageUrl || failed) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-navy to-navy-700 ${className}`}>
        <Icon className="w-14 h-14 text-accent/90" />
      </div>
    );
  }
  return (
    <img
      src={product.imageUrl}
      alt={product.title}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}
