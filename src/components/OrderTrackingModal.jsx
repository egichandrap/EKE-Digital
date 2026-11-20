import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatRupiah, formatDate } from '../utils/formatters';
import { X, Search, ArrowRight, ShieldCheck, Clock, CheckCircle2, MessageSquare } from 'lucide-react';

export default function OrderTrackingModal() {
  const {
    isTrackingOpen,
    setIsTrackingOpen,
    setIsPaymentOpen,
    setIsSuccessOpen,
    setActiveOrder,
    settings,
  } = useStore();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isTrackingOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setSearching(true);
      const res = await fetch(`/api/orders/track?query=${encodeURIComponent(query.trim())}`);
      const json = await res.json();
      if (json.success) {
        setResults(json.data || []);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error('Error tracking order:', err);
      setResults([]);
    } finally {
      setSearching(false);
      setHasSearched(true);
    }
  };

  const handleSelectOrder = (order) => {
    setActiveOrder(order);
    setIsTrackingOpen(false);

    if (order.status === 'completed' || order.status === 'paid') {
      setIsSuccessOpen(true);
    } else {
      setIsPaymentOpen(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden my-6">
        
        {/* Close Button */}
        <button
          onClick={() => setIsTrackingOpen(false)}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#111c2d] flex items-center justify-center transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-b from-slate-50/80 to-white">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#b22204] block mb-1">
            STATUS & AKSES LISENSI
          </span>
          <h2 className="text-xl font-black text-[#111c2d] tracking-tight">
            Lacak Pesanan Digital Anda
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Masukkan Nomor WhatsApp atau No. Invoice (<span className="font-mono text-slate-700">EKE-...</span>) untuk melihat kredensial atau link aktivasi Anda kembali.
          </p>
        </div>

        {/* Search Bar */}
        <div className="p-6 pb-2">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="No. WA (08...) atau No. Pesanan (EKE-...)"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#b22204] text-xs font-medium text-[#111c2d] focus:outline-none focus:ring-3 focus:ring-[#b22204]/10 transition-all shadow-inner"
              />
            </div>
            <button
              type="submit"
              disabled={searching}
              className="py-3 px-5 rounded-2xl bg-gradient-to-r from-[#b22204] to-[#e04225] hover:from-[#941901] hover:to-[#b22204] text-white text-xs font-black flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer disabled:opacity-75 shadow-md shadow-[#b22204]/20"
            >
              <Search className="w-4 h-4" />
              <span>{searching ? 'Mencari...' : 'Cari'}</span>
            </button>
          </form>
        </div>

        {/* Results List */}
        <div className="p-6 max-h-[50vh] overflow-y-auto space-y-3">
          {hasSearched && results.length === 0 && !searching && (
            <div className="text-center py-8 text-xs text-slate-500 space-y-2">
              <p>Tidak ditemukan pesanan untuk <strong className="text-[#111c2d]">{query}</strong>.</p>
              <p className="text-[11px] text-slate-400">Pastikan nomor WA yang Anda masukkan sesuai saat checkout.</p>
              <div className="pt-2">
                <a
                  href={`https://wa.me/${settings.waNumber}?text=${encodeURIComponent(`Halo Admin, saya mencari pesanan dengan kata kunci: ${query}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Tanyakan ke CS WhatsApp</span>
                </a>
              </div>
            </div>
          )}

          {results.map((order) => {
            const isCompleted = order.status === 'completed' || order.status === 'paid';

            return (
              <div
                key={order.id}
                onClick={() => handleSelectOrder(order)}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 transition-all cursor-pointer flex items-center justify-between gap-3 group shadow-2xs hover:border-[#ffdad3]"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-[#111c2d]">
                      {order.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isCompleted ? 'LUNAS / AKTIF' : 'MENUNGGU BAYAR'}
                    </span>
                  </div>

                  <h4 className="text-xs font-black text-[#111c2d] truncate">
                    {order.productTitle}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold mt-0.5">
                    <span className="text-[#b22204] font-bold">{formatRupiah(order.amount)}</span>
                    <span>•</span>
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                </div>

                <div className="w-9 h-9 rounded-xl bg-white group-hover:bg-[#b22204] group-hover:text-white text-slate-400 flex items-center justify-center transition-colors shadow-2xs border border-slate-200/60">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
