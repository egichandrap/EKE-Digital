import React from 'react';
import { formatRupiah } from '../utils/formatters';
import { useStore } from '../context/StoreContext';
import { Star, Zap, Eye, CheckCircle2 } from 'lucide-react';

export default function ProductCard({ product }) {
  const { openProductDetail, startCheckout } = useStore();

  // Price is already marked up by 35% on the server
  const formattedPrice = formatRupiah(product.price);
  const formattedOriginal = (product.originalPrice && product.originalPrice > product.price)
    ? formatRupiah(product.originalPrice)
    : null;

  return (
    <div className="group bg-white rounded-3xl border border-stone-200/80 hover:border-peach-300 shadow-xs hover:shadow-xl hover:shadow-peach-500/10 transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1.5">
      
      {/* Product Image & Badges Container */}
      <div
        onClick={() => openProductDetail(product)}
        className="relative aspect-video w-full bg-stone-100 overflow-hidden cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';
          }}
        />

        {/* Gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Top Floating Badges in Peach and Sage */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
          {product.badge && (
            <span className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-peach-500 to-[#fa5f38] text-white text-[10px] font-black tracking-wider uppercase shadow-xs">
              {product.badge}
            </span>
          )}
          {product.discountPercentage > 0 && (
            <span className="px-2.5 py-1 rounded-xl bg-emerald-600 text-white text-[10px] font-black shadow-xs">
              Hemat {product.discountPercentage}%
            </span>
          )}
        </div>

        {/* Category Pill Floating */}
        <div className="absolute bottom-3 right-3">
          <span className="px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-[10px] font-bold shadow-xs">
            {product.categoryLabel || product.category}
          </span>
        </div>
      </div>

      {/* Product Body Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Rating & Sold count */}
          <div className="flex items-center gap-2 mb-2 text-xs">
            <div className="flex items-center text-amber-600 font-extrabold bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/60">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-1" />
              <span>{product.rating || 5}.0</span>
            </div>
            <span className="text-stone-300">•</span>
            <span className="text-slate-500 text-[11px] font-bold">
              {product.soldCount || '100+ terjual'}
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5 border border-emerald-200/60">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Ready</span>
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => openProductDetail(product)}
            className="text-sm sm:text-base font-black text-[#0f172a] line-clamp-1 group-hover:text-peach-600 transition-colors cursor-pointer"
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Subtitle / preview snippet */}
          <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed font-normal">
            {product.subtitle || product.description}
          </p>
        </div>

        {/* Price & Action Area */}
        <div className="pt-3 border-t border-stone-100">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg sm:text-xl font-black text-peach-600">
              {formattedPrice}
            </span>
            {formattedOriginal && (
              <span className="text-xs text-slate-400 line-through font-medium">
                {formattedOriginal}
              </span>
            )}
          </div>

          {/* Dual Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => openProductDetail(product)}
              className="w-full py-2.5 px-3 rounded-2xl bg-stone-100/90 hover:bg-peach-50 text-[#0f172a] hover:text-peach-700 text-xs font-bold transition-all text-center cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 border border-stone-200/60"
            >
              <Eye className="w-3.5 h-3.5 text-slate-600" />
              <span>Detail</span>
            </button>
            <button
              onClick={() => startCheckout(product, 'personal')}
              className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-peach-500 to-[#fa5f38] hover:from-peach-600 hover:to-peach-500 text-white text-xs font-black transition-all shadow-md shadow-peach-500/20 text-center cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>Beli Cepat</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
