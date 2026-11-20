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
import AdminModal from './components/AdminModal';
import Footer from './components/Footer';
import { AlertCircle, RefreshCw } from 'lucide-react';

function StoreApp() {
  const {
    products,
    loading,
    error,
    selectedCategory,
    searchQuery,
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
    <div className="min-h-screen flex flex-col bg-[#f9f9ff]">
      
      {/* Toast Notification Popup */}
      {toast.show && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce duration-300">
          <div className={`px-4 py-3 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 ${
            toast.type === 'error'
              ? 'bg-rose-600 text-white'
              : toast.type === 'success'
              ? 'bg-[#006e2e] text-white'
              : 'bg-[#111c2d] text-white'
          }`}>
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
        <div className="px-4 sm:px-6 lg:px-8 pt-4 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-black text-[#111c2d] tracking-tight">
              {searchQuery ? `Hasil Pencarian: "${searchQuery}"` : 'Koleksi Produk Pilihan'}
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-[#f0f3ff] text-[11px] font-extrabold text-[#5b403b]">
              {filteredProducts.length} Produk
            </span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <span className="w-8 h-8 border-3 border-[#b22204] border-t-transparent rounded-full animate-spin"></span>
            <p className="text-xs font-bold text-[#5b403b]">
              Memuat data produk digital upstream...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="max-w-md mx-auto my-12 p-6 rounded-3xl bg-rose-50 border border-rose-200 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <h3 className="text-sm font-black text-rose-900">{error}</h3>
            <button
              onClick={() => loadInitialData(true)}
              className="py-2 px-4 rounded-xl bg-rose-600 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Coba Lagi</span>
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center rounded-3xl bg-white border border-[#f0f3ff] p-8 max-w-md mx-auto space-y-2">
                <span className="material-symbols-outlined text-4xl text-slate-300">
                  search_off
                </span>
                <h4 className="text-sm font-black text-[#111c2d]">
                  Tidak ada produk yang cocok
                </h4>
                <p className="text-xs text-[#5b403b]">
                  Coba ubah kata kunci pencarian Anda atau pilih kategori lain di atas.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
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
      <AdminModal />

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
