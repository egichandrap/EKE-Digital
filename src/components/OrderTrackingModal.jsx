import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatRupiah, formatDate } from '../utils/formatters';
import { X, Search, CheckCircle, Clock, AlertTriangle, ArrowRight } from 'lucide-react';

export default function OrderTrackingModal() {
  const { isTrackingOpen, setIsTrackingOpen, setActiveOrder, setIsSuccessOpen, setIsPaymentOpen } = useStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searching, setSearching] = useState(false);

  if (!isTrackingOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setSearching(true);
      setHasSearched(true);
      const res = await fetch(`/api/orders/search/${encodeURIComponent(query.trim())}`);
      const json = await res.json();
      if (json.success) {
        setResults(json.data || []);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
    } finally {
      setSearching(false);
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#f0f3ff] overflow-hidden my-6">
        
        {/* Close Button */}
        <button
          onClick={() => setIsTrackingOpen(false)}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#111c2d] flex items-center justify-center transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-[#f0f3ff]">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#b22204] block mb-1">
            Status Pesanan & Akses
          </span>
          <h2 className="text-xl font-black text-[#111c2d]">
            Lacak Pesanan Digital Anda
          </h2>
          <p className="text-xs text-[#5b403b] mt-1">
            Masukkan Nomor WhatsApp atau No. Invoice (EKE-...) untuk melihat lisensi Anda kembali.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mt-4 flex gap-2">
            <input
              type="text"
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Contoh: 08123456789 atau EKE-..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#f0f3ff] focus:bg-white border border-transparent focus:border-[#b22204] text-xs text-[#111c2d] focus:outline-none transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={searching}
              className="py-2.5 px-4 rounded-xl bg-[#b22204] hover:bg-[#941901] text-white text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer disabled:opacity-75 shadow-xs"
            >
              <Search className="w-4 h-4" />
              <span>{searching ? 'Mencari...' : 'Cari'}</span>
            </button>
          </form>
        </div>

        {/* Results List */}
        <div className="p-5 max-h-[50vh] overflow-y-auto space-y-3">
          {hasSearched && results.length === 0 && !searching && (
            <div className="text-center py-8 text-xs text-[#8f7069]">
              Tidak ditemukan pesanan untuk <strong className="text-[#111c2d]">{query}</strong>. Pastikan nomor WA atau ID sudah sesuai.
            </div>
          )}

          {results.map((order) => {
            const isCompleted = order.status === 'completed' || order.status === 'paid';

            return (
              <div
                key={order.id}
                onClick={() => handleSelectOrder(order)}
                className="p-3.5 rounded-2xl bg-[#f0f3ff]/70 hover:bg-[#dee8ff]/50 border border-[#dee8ff] transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-[#111c2d]">
                      {order.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        isCompleted
                          ? 'bg-emerald-100 text-[#006e2e]'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isCompleted ? 'LUNAS / AKTIF' : 'PENDING'}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-[#111c2d] truncate">
                    {order.productTitle}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-[#8f7069] mt-0.5">
                    <span>{formatRupiah(order.amount)}</span>
                    <span>•</span>
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-xl bg-white group-hover:bg-[#b22204] group-hover:text-white text-[#5b403b] flex items-center justify-center transition-colors shadow-2xs">
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
