import React from 'react';
import { useStore } from '../context/StoreContext';
import { Search, SearchCode, RefreshCw, MessageSquare } from 'lucide-react';

export default function Navbar() {
  const {
    settings,
    searchQuery,
    setSearchQuery,
    setIsTrackingOpen,
    loadInitialData,
    loading
  } = useStore();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-stone-200/70 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-3 sm:gap-6">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <a href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-md shadow-peach-500/20 group-hover:scale-105 group-hover:rotate-1 transition-all duration-300 shrink-0 border border-peach-200/50">
                <img
                  src="/logo.svg"
                  alt="EKE Digital Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg sm:text-xl font-black tracking-tight text-[#0f172a] group-hover:text-peach-600 transition-colors">
                    {settings.storeName || 'EKE Digital'}
                  </span>
                  <span className="flex h-2 w-2 relative" title="Sistem Server Aktif 24 Jam">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase -mt-0.5 flex items-center gap-1">
                  <span className="text-peach-600 font-extrabold">Instant</span> License Hub
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Search bar */}
          <div className="flex-1 max-w-lg hidden md:block">
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-peach-500 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari Netflix, Google Plus, Canva, Spotify, Microsoft 365..."
                className="w-full pl-10 pr-10 py-2.5 bg-stone-100/80 hover:bg-stone-100 focus:bg-white border border-transparent focus:border-peach-400/60 rounded-2xl text-xs font-medium text-[#0f172a] placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-peach-500/10 transition-all shadow-inner"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center text-[10px] transition-colors cursor-pointer"
                  title="Hapus pencarian"
                >
                  ✕
                </button>
              ) : (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded-md border border-stone-200 shadow-2xs pointer-events-none">
                  Katalog
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Live Sync Upstream Refresh */}
            <button
              onClick={() => loadInitialData(true)}
              disabled={loading}
              title="Sinkronisasi & Perbarui Produk Langsung dari Upstream"
              className="p-2 sm:p-2.5 rounded-2xl text-slate-500 hover:text-peach-600 hover:bg-peach-50 border border-stone-200/70 transition-all cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-peach-500' : ''}`} />
            </button>

            {/* Lacak Pesanan CTA */}
            <button
              onClick={() => setIsTrackingOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 sm:py-2.5 rounded-2xl bg-white hover:bg-stone-50 text-[#0f172a] border border-stone-200/80 hover:border-peach-200 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs"
            >
              <SearchCode className="w-4 h-4 text-peach-500" />
              <span className="hidden sm:inline">Lacak Pesanan</span>
            </button>

            {/* WhatsApp CS Quick Link in Soft Sage */}
            <a
              href={`https://wa.me/${settings.waNumber}?text=${encodeURIComponent(`Halo Admin ${settings.storeName || 'EKE Digital'}, saya ingin bertanya seputar produk digital.`)}`}
              target="_blank"
              rel="noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 sm:py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 text-xs font-extrabold transition-all active:scale-95 cursor-pointer shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>Bantuan WA</span>
            </a>
          </div>

        </div>

        {/* Mobile Search input */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari Netflix, Canva, ChatGPT, Gemini..."
              className="w-full pl-10 pr-8 py-2.5 bg-stone-100/90 focus:bg-white border border-transparent focus:border-peach-400/60 rounded-2xl text-xs font-medium text-[#0f172a] placeholder-slate-400 focus:outline-none focus:ring-3 focus:ring-peach-500/10 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
