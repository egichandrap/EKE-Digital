import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Zap, Lock, Heart, MessageSquare } from 'lucide-react';

export default function Footer() {
  const { settings, products } = useStore();

  return (
    <footer className="bg-white border-t border-slate-200/80 mt-20 pt-14 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-100">
          
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl overflow-hidden shadow-md shadow-[#b22204]/20 shrink-0">
                <img
                  src="/logo.svg"
                  alt="EKE Digital Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl font-black tracking-tight text-[#111c2d]">
                {settings.storeName || 'EKE Digital'}
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed font-medium">
              {settings.tagline || 'Pusat Produk Digital & Lisensi Terpercaya #1'}. Platform e-commerce produk digital, akun premium streaming, lisensi AI, template Notion, dan panduan digital resmi dengan pengiriman kredensial instan dalam 5 detik via AutoGoPay QRIS.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-emerald-700 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Bergaransi Resmi, Legal & Anti On-Hold</span>
            </div>
          </div>

          {/* Nav Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-black text-[#111c2d] uppercase tracking-wider">
              Layanan & Bantuan
            </h4>
            <ul className="space-y-2 text-slate-600 font-medium">
              <li>
                <a href="#katalog" className="hover:text-[#b22204] transition-colors">
                  Katalog Semua Produk ({products.length || 18})
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${settings.waNumber}?text=${encodeURIComponent(`Halo Admin ${settings.storeName}, saya butuh bantuan.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#b22204] transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Customer Support WhatsApp</span>
                </a>
              </li>
              <li>
                <span className="text-slate-400">Jam Operasional: 24 Jam Nonstop</span>
              </li>
            </ul>
          </div>

          {/* Payment Partner */}
          <div className="space-y-3 text-xs">
            <h4 className="font-black text-[#111c2d] uppercase tracking-wider">
              Metode Pembayaran Resmi
            </h4>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              Didukung oleh sistem AutoGoPay Dynamic QRIS. Terima scan dari seluruh m-Banking & e-Wallet di Indonesia.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['QRIS', 'BCA', 'Mandiri', 'BRI', 'BNI', 'GoPay', 'OVO', 'DANA', 'ShopeePay'].map((item) => (
                <span key={item} className="px-2.5 py-1 rounded-lg bg-slate-100 text-[10px] font-bold text-slate-700 border border-slate-200/50">
                  {item}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-medium">
          <p>© {new Date().getFullYear()} {settings.storeName || 'EKE Digital'}. Seluruh hak cipta dilindungi undang-undang.</p>
          <p className="flex items-center gap-1">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>untuk kepuasan pelanggan produk digital</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
