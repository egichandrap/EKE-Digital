import React from 'react';
import { Zap, ShieldCheck, QrCode, Clock } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function HeroBanner() {
  const { settings } = useStore();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#ffdad3]/30 via-[#f9f9ff] to-[#f9f9ff] pt-8 pb-10 px-4 sm:px-6 lg:px-8 border-b border-[#f0f3ff]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#ffdad3] shadow-xs text-xs font-bold text-[#b22204] animate-fade-in">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#b22204] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#b22204]"></span>
            </span>
            <span>Live Upstream Mirroring & Instan Delivery</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111c2d] tracking-tight leading-tight">
            Akses Produk Digital & Lisensi Resmi{' '}
            <span className="bg-gradient-to-r from-[#b22204] to-[#f87258] bg-clip-text text-transparent">
              Otomatis & Terverifikasi
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#5b403b] max-w-2xl mx-auto font-medium leading-relaxed">
            {settings.tagline || 'Pusat Produk Digital & Source Code Terpercaya #1'}. 
            Nikmati akun premium streaming, AI, template Notion, Canva, dan panduan digital resmi dengan pengiriman kredensial instan dalam 5 detik via QRIS!
          </p>

          {/* Guarantees / Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 max-w-3xl mx-auto text-left">
            
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-[#f0f3ff] shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-[#ffdad3]/60 text-[#b22204] flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-[#111c2d]">Pengiriman 5 Detik</h4>
                <p className="text-[10px] text-[#8f7069]">Langsung aktif di layar</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-[#f0f3ff] shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-[#111c2d]">100% Bergaransi</h4>
                <p className="text-[10px] text-[#8f7069]">Legal & anti on-hold</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-[#f0f3ff] shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-[#111c2d]">AutoGoPay QRIS</h4>
                <p className="text-[10px] text-[#8f7069]">Semua e-Wallet & Bank</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-[#f0f3ff] shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-[#111c2d]">Layanan 24/7</h4>
                <p className="text-[10px] text-[#8f7069]">Sistem online nonstop</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
