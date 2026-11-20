import React from 'react';
import { Zap, ShieldCheck, QrCode, Clock, Sparkles, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function HeroBanner() {
  const { settings, products } = useStore();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fff1ee]/70 via-[#f8fafc]/50 to-[#f8fafc] pt-8 sm:pt-12 pb-8 sm:pb-10 px-4 sm:px-6 lg:px-8 border-b border-slate-200/60">
      
      {/* Decorative ambient background blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-72 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-[#ffdad3]/40 rounded-full blur-3xl"></div>
        <div className="absolute -top-24 right-1/4 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          
          {/* Top Pill / Status Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#ffdad3] shadow-xs text-xs font-black text-[#b22204] animate-fade-in">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#b22204] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#b22204]"></span>
            </span>
            <span className="tracking-wide">INSTANT UPSTREAM DELIVERY • {products.length || 18} PRODUK READY</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#111c2d] tracking-tight leading-[1.15]">
            Pusat Akun Premium & Lisensi Digital{' '}
            <span className="bg-gradient-to-r from-[#b22204] via-[#e04225] to-[#f87258] bg-clip-text text-transparent">
              Terpercaya #1
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            {settings.tagline || 'Pusat Produk Digital & Lisensi Terpercaya #1'}. 
            Dapatkan akun Netflix, Gemini Plus, Canva, Notion, dan template digital resmi. Pembayaran serba instan via <strong>AutoGoPay QRIS</strong> dengan kredensial & tautan aktivasi terbit otomatis detik itu juga!
          </p>

          {/* Guarantees / Trust Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-4 sm:pt-6 max-w-3xl mx-auto text-left">
            
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-[#ffdad3] transition-all">
              <div className="w-9 h-9 rounded-xl bg-[#ffdad3]/70 text-[#b22204] flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 fill-[#b22204]/20" />
              </div>
              <div>
                <h4 className="text-xs font-black text-[#111c2d]">Pengiriman 5 Detik</h4>
                <p className="text-[11px] text-slate-500 font-medium">Otomatis di layar</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-200 transition-all">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-[#111c2d]">100% Bergaransi</h4>
                <p className="text-[11px] text-slate-500 font-medium">Legal & anti on-hold</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-purple-200 transition-all">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-[#111c2d]">QRIS Otomatis</h4>
                <p className="text-[11px] text-slate-500 font-medium">Semua Bank & e-Wallet</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-200 transition-all">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-[#111c2d]">Layanan 24/7</h4>
                <p className="text-[11px] text-slate-500 font-medium">Bantuan CS WhatsApp</p>
              </div>
            </div>

          </div>

          {/* Social Proof Bar */}
          <div className="pt-3 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sistem Terhubung & Teruji Siap Digunakan</span>
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
