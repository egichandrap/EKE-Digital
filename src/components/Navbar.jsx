import React from 'react';
import { useStore } from '../context/StoreContext';
import { Search, ShoppingBag, ShieldCheck, RefreshCw, Settings, SearchCode } from 'lucide-react';

export default function Navbar() {
  const {
    settings,
    searchQuery,
    setSearchQuery,
    setIsTrackingOpen,
    setIsAdminOpen,
    loadInitialData,
    loading
  } = useStore();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#f0f3ff] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#b22204] to-[#f87258] flex items-center justify-center text-white shadow-md shadow-[#b22204]/20 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">bolt</span>
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-[#111c2d] flex items-center gap-1">
                  {settings.storeName || 'EKE Digital'}
                  <span className="inline-block w-2 h-2 rounded-full bg-[#006e2e]"></span>
                </span>
                <span className="text-[10px] text-[#5b403b] font-medium block -mt-1 tracking-wider uppercase">
                  Instant License Hub
                </span>
              </div>
            </a>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8f7069]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari akun Netflix, Canva, ChatGPT, Google Gemini..."
                className="w-full pl-10 pr-4 py-2 bg-[#f0f3ff] hover:bg-[#e7eeff] focus:bg-white border border-transparent focus:border-[#b22204]/40 rounded-xl text-xs text-[#111c2d] placeholder-[#8f7069] focus:outline-none transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8f7069] hover:text-[#111c2d]"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* Live Sync Indicator / Refresh */}
            <button
              onClick={() => loadInitialData(true)}
              title="Refresh Produk Langsung dari Upstream"
              className="p-2 rounded-xl text-[#5b403b] hover:text-[#111c2d] hover:bg-[#f0f3ff] transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#b22204]' : ''}`} />
            </button>

            {/* Lacak Pesanan */}
            <button
              onClick={() => setIsTrackingOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#111c2d] text-xs font-bold transition-all active:scale-95 cursor-pointer"
            >
              <SearchCode className="w-4 h-4 text-[#b22204]" />
              <span className="hidden sm:inline">Lacak Pesanan</span>
            </button>

            {/* Admin Panel Link */}
            <button
              onClick={() => setIsAdminOpen(true)}
              className="p-2 rounded-xl text-[#5b403b] hover:text-[#111c2d] hover:bg-[#f0f3ff] transition-colors"
              title="Pengaturan Admin & Gateway"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Mobile Search input */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8f7069]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari Netflix, Canva, ChatGPT, dll..."
              className="w-full pl-10 pr-4 py-2 bg-[#f0f3ff] focus:bg-white border border-transparent focus:border-[#b22204]/40 rounded-xl text-xs text-[#111c2d] placeholder-[#8f7069] focus:outline-none transition-all shadow-inner"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
