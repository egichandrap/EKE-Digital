import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import CategoryFilter from './components/CategoryFilter';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CheckoutModal from './components/CheckoutModal';
import PaymentModal from './components/PaymentModal';
import SuccessModal from './components/SuccessModal';
import OrderTrackingModal from './components/OrderTrackingModal';
import Footer from './components/Footer';
import { AlertCircle, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';

function StoreApp() {
  const {
    products,
    loading,
    error,
    selectedCategory,
    searchQuery,
    setSearchQuery,
    loadInitialData,
    toast,
  } = useStore();

  // Filter products by category and search
  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchSubtitle = p.subtitle && p.subtitle.toLowerCase().includes(q);
      const matchCategory = p.categoryLabel && p.categoryLabel.toLowerCase().includes(q);
      return matchTitle || matchSubtitle || matchCategory;
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[#111c2d]">
      
      {/* Toast Notification Popup */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in pointer-events-none">
          <div className={`px-4 py-3 rounded-2xl shadow-2xl text-xs font-black flex items-center gap-2 border pointer-events-auto ${
            toast.type === 'error'
              ? 'bg-rose-600 text-white border-rose-700 shadow-rose-600/30'
              : toast.type === 'success'
              ? 'bg-emerald-600 text-white border-emerald-700 shadow-emerald-600/30'
              : 'bg-slate-900 text-white border-slate-800 shadow-slate-900/30'
          }`}>
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroBanner />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto" id="katalog">
        
        {/* Category Horizontal Filter */}
        <CategoryFilter />

        {/* Section Heading & Counter */}
        <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg sm:text-2xl font-black text-[#111c2d] tracking-tight">
              {searchQuery ? `Hasil Pencarian: "${searchQuery}"` : 'Koleksi Produk & Lisensi Resmi'}
            </h2>
            <span className="px-2.5 py-1 rounded-full bg-slate-200/70 text-[11px] font-black text-slate-700">
              {filteredProducts.length} Produk
            </span>
          </div>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-bold text-[#b22204] hover:underline cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <span className="w-9 h-9 border-3 border-[#b22204] border-t-transparent rounded-full animate-spin"></span>
            <p className="text-xs font-bold text-slate-500">
              Sinkronisasi katalog produk dari server upstream...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="max-w-md mx-auto my-14 p-6 sm:p-8 rounded-3xl bg-rose-50 border border-rose-200 text-center space-y-3.5 shadow-sm">
            <AlertCircle className="w-11 h-11 text-rose-500 mx-auto" />
            <h3 className="text-sm font-black text-rose-950">{error}</h3>
            <button
              onClick={() => loadInitialData(true)}
              className="py-2.5 px-5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black inline-flex items-center gap-2 shadow-sm cursor-pointer transition-all active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Coba Sinkron Ulang</span>
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <div className="px-4 sm:px-6 lg:px-8 py-3">
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center rounded-3xl bg-white border border-slate-200/80 p-8 max-w-md mx-auto space-y-3 shadow-xs">
                <span className="material-symbols-outlined text-5xl text-slate-300">
                  search_off
                </span>
                <h4 className="text-sm font-black text-[#111c2d]">
                  Tidak ada produk yang cocok
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Coba ubah kata kunci pencarian Anda atau pilih kategori lain di atas.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
                >
                  Tampilkan Semua Produk
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Modals */}
      <ProductDetailModal />
      <CheckoutModal />
      <PaymentModal />
      <SuccessModal />
      <OrderTrackingModal />

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <StoreApp />
    </StoreProvider>
  );
}
