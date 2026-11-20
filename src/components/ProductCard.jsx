import React from 'react';
import { formatRupiah } from '../utils/formatters';
import { useStore } from '../context/StoreContext';
import { Star, ShieldCheck, Zap } from 'lucide-react';

export default function ProductCard({ product }) {
  const { openProductDetail, startCheckout } = useStore();

  // Price is already marked up by 35% on the server
  const formattedPrice = formatRupiah(product.price);
  const formattedOriginal = product.originalPrice ? formatRupiah(product.originalPrice) : null;

  return (
    <div className="group bg-white rounded-2xl border border-[#f0f3ff] hover:border-[#ffdad3] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1">
      
      {/* Product Image & Badges */}
      <div
        onClick={() => openProductDetail(product)}
        className="relative aspect-video w-full bg-slate-100 overflow-hidden cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
          {product.badge && (
            <span className="px-2.5 py-1 rounded-lg bg-[#b22204] text-white text-[10px] font-black tracking-wider uppercase shadow-xs">
              {product.badge}
            </span>
          )}
          {product.discountPercentage > 0 && (
            <span className="px-2 py-1 rounded-lg bg-[#006e2e] text-white text-[10px] font-extrabold shadow-xs">
              Hemat {product.discountPercentage}%
            </span>
          )}
        </div>

        {/* Category Pill overlay */}
        <div className="absolute bottom-2.5 right-2.5">
          <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold">
            {product.categoryLabel || product.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Sold count */}
          <div className="flex items-center gap-2 mb-1.5 text-xs">
            <div className="flex items-center text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-500 mr-0.5" />
              <span>{product.rating || 5}.0</span>
            </div>
            <span className="text-[#8f7069]">•</span>
            <span className="text-[#8f7069] text-[11px] font-medium">
              {product.soldCount || '100+ terjual'}
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => openProductDetail(product)}
            className="text-sm font-black text-[#111c2d] line-clamp-1 group-hover:text-[#b22204] transition-colors cursor-pointer"
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Subtitle / preview */}
          <p className="text-xs text-[#5b403b] line-clamp-2 mt-1 leading-snug font-normal">
            {product.subtitle || product.description}
          </p>
        </div>

        {/* Price & Actions */}
        <div className="mt-4 pt-3 border-t border-[#f0f3ff]">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-[#b22204]">
              {formattedPrice}
            </span>
            {formattedOriginal && (
              <span className="text-xs text-[#8f7069] line-through">
                {formattedOriginal}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3">
            <button
              onClick={() => openProductDetail(product)}
              className="w-full py-2 px-2.5 rounded-xl bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#111c2d] text-xs font-bold transition-all text-center cursor-pointer active:scale-95"
            >
              Lihat Detail
            </button>
            <button
              onClick={() => startCheckout(product, 'personal')}
              className="w-full py-2 px-2.5 rounded-xl bg-[#b22204] hover:bg-[#941901] text-white text-xs font-extrabold transition-all shadow-xs shadow-[#b22204]/20 text-center cursor-pointer active:scale-95"
            >
              Beli Sekarang
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
