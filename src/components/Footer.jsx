import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Zap, Lock, Heart } from 'lucide-react';

export default function Footer() {
  const { settings } = useStore();

  return (
    <footer className="bg-white border-t border-[#f0f3ff] mt-20 pt-12 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#f0f3ff]">
          
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#b22204] to-[#f87258] flex items-center justify-center text-white shadow-xs">
                <span className="material-symbols-outlined text-[18px]">bolt</span>
              </div>
              <span className="text-lg font-black tracking-tight text-[#111c2d]">
                {settings.storeName || 'EKE Digital'}
              </span>
            </div>
            <p className="text-xs text-[#5b403b] max-w-sm leading-relaxed">
              {settings.tagline || 'Pusat Produk Digital & Lisensi Terpercaya #1'}. Platform e-commerce produk digital, template Notion, aset Canva, e-book, dan lisensi instan terverifikasi otomatis dengan AutoGoPay QRIS.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-[#006e2e] font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Bergaransi Resmi & Anti On-Hold</span>
            </div>
          </div>

          {/* Nav Links */}
          <div className="space-y-2 text-xs">
            <h4 className="font-black text-[#111c2d] uppercase tracking-wider mb-2">
              Layanan & Bantuan
            </h4>
            <ul className="space-y-1.5 text-[#5b403b]">
              <li><a href="#katalog" className="hover:text-[#b22204] transition-colors">Katalog Semua Produk</a></li>
              <li><a href={`https://wa.me/${settings.waNumber}`} target="_blank" rel="noreferrer" className="hover:text-[#b22204] transition-colors">Customer Service WhatsApp</a></li>
              <li><span className="text-[#8f7069]">Jam Operasional: 24 Jam Nonstop</span></li>
            </ul>
          </div>

          {/* Payment Partner */}
          <div className="space-y-2 text-xs">
            <h4 className="font-black text-[#111c2d] uppercase tracking-wider mb-2">
              Metode Pembayaran Resmi
            </h4>
            <p className="text-[11px] text-[#5b403b]">
              Didukung oleh sistem AutoGoPay Dynamic QRIS. Terima scan dari seluruh m-Banking & e-Wallet di Indonesia.
            </p>
            <div className="flex flex-wrap gap-1 pt-1">
              {['QRIS', 'BCA', 'Mandiri', 'BRI', 'GoPay', 'OVO', 'DANA', 'ShopeePay'].map((item) => (
                <span key={item} className="px-2 py-0.5 rounded bg-[#f0f3ff] text-[10px] font-bold text-[#5b403b]">
                  {item}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8f7069]">
          <p>© {new Date().getFullYear()} {settings.storeName || 'EKE Digital'}. Seluruh hak cipta dilindungi undang-undang.</p>
          <p className="flex items-center gap-1">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>untuk kepuasan pelanggan digital</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
