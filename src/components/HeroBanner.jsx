import React from 'react';
import { Zap, ShieldCheck, QrCode, Clock, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function HeroBanner() {
  const { settings, products } = useStore();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-peach-100/40 via-[#faf9f6] to-[#faf9f6] pt-8 sm:pt-12 pb-8 sm:pb-10 px-4 sm:px-6 lg:px-8 border-b border-stone-200/60">
      
      {/* Decorative ambient background blur in Peach and Sage */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-72 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-peach-200/35 rounded-full blur-3xl"></div>
        <div className="absolute -top-24 right-1/4 w-96 h-96 bg-emerald-200/25 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          
          {/* Top Status Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-peach-200 shadow-xs text-xs font-black text-peach-700 animate-fade-in">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-peach-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-peach-500"></span>
            </span>
            <span className="tracking-wide">INSTANT UPSTREAM DELIVERY • {products.length || 18} PRODUK READY</span>
          </div>

          {/* Main Headline with Peach to Coral Gradient */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0f172a] tracking-tight leading-[1.15]">
            Pusat Akun Premium & Lisensi Digital{' '}
            <span className="bg-gradient-to-r from-peach-500 via-[#fa5f38] to-[#ff8a65] bg-clip-text text-transparent">
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
            
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:border-peach-200 transition-all">
              <div className="w-9 h-9 rounded-xl bg-peach-100 text-peach-600 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 fill-peach-500/20" />
              </div>
              <div>
                <h4 className="text-xs font-black text-[#0f172a]">Pengiriman 5 Detik</h4>
                <p className="text-[11px] text-slate-500 font-medium">Otomatis di layar</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:border-emerald-200 transition-all">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-xs font-black text-[#0f172a]">100% Bergaransi</h4>
                <p className="text-[11px] text-slate-500 font-medium">Legal & anti on-hold</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:border-teal-200 transition-all">
              <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                <QrCode className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h4 className="text-xs font-black text-[#0f172a]">QRIS Otomatis</h4>
                <p className="text-[11px] text-slate-500 font-medium">Semua Bank & e-Wallet</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:border-amber-200 transition-all">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h4 className="text-xs font-black text-[#0f172a]">Layanan 24/7</h4>
                <p className="text-[11px] text-slate-500 font-medium">Bantuan CS WhatsApp</p>
              </div>
            </div>

          </div>

          {/* Social Proof Bar in Soft Sage */}
          <div className="pt-3 flex items-center justify-center gap-2 text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sistem Terhubung & Teruji Siap Digunakan</span>
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
