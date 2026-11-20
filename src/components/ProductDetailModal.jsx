import React from 'react';
import { useStore } from '../context/StoreContext';
import { formatRupiah } from '../utils/formatters';
import { X, Check, ShieldCheck, Zap, HelpCircle, ChevronDown } from 'lucide-react';

export default function ProductDetailModal() {
  const {
    activeProduct,
    isDetailOpen,
    setIsDetailOpen,
    selectedLicenseType,
    setSelectedLicenseType,
    startCheckout
  } = useStore();

  if (!isDetailOpen || !activeProduct) return null;

  const personalOption = activeProduct.licenseOptions?.personal;
  const agencyOption = activeProduct.licenseOptions?.agency;

  const currentPrice = selectedLicenseType === 'agency' && agencyOption
    ? agencyOption.price
    : (personalOption ? personalOption.price : activeProduct.price);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#f0f3ff] overflow-hidden my-6">
        
        {/* Close Button */}
        <button
          onClick={() => setIsDetailOpen(false)}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#111c2d] flex items-center justify-center shadow-md backdrop-blur-xs transition-all active:scale-95 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header / Banner */}
        <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
          <img
            src={activeProduct.image}
            alt={activeProduct.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
            <span className="inline-block px-2.5 py-1 rounded-md bg-[#b22204] text-[10px] font-black uppercase tracking-wider mb-1.5 w-max">
              {activeProduct.badge || '⚡ Auto-Fulfill'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black leading-tight">
              {activeProduct.title}
            </h2>
            <p className="text-xs text-white/80 mt-1 line-clamp-1">
              {activeProduct.subtitle}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          
          {/* License Selection */}
          {agencyOption && personalOption && (
            <div>
              <label className="block text-xs font-black text-[#111c2d] uppercase tracking-wider mb-2">
                Pilih Tipe Lisensi:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Standar License */}
                <div
                  onClick={() => setSelectedLicenseType('personal')}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedLicenseType === 'personal'
                      ? 'border-[#b22204] bg-[#ffdad3]/20 shadow-xs'
                      : 'border-[#f0f3ff] bg-white hover:border-[#dee8ff]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#111c2d]">
                      {personalOption.name || 'Lisensi Standar'}
                    </span>
                    <span className="text-xs font-black text-[#b22204]">
                      {formatRupiah(personalOption.price)}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5b403b] mt-1 leading-snug">
                    {personalOption.description || 'Penggunaan pribadi/personal penuh.'}
                  </p>
                </div>

                {/* Komersial License */}
                <div
                  onClick={() => setSelectedLicenseType('agency')}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedLicenseType === 'agency'
                      ? 'border-[#b22204] bg-[#ffdad3]/20 shadow-xs'
                      : 'border-[#f0f3ff] bg-white hover:border-[#dee8ff]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#111c2d]">
                      {agencyOption.name || 'Lisensi Komersial'}
                    </span>
                    <span className="text-xs font-black text-[#b22204]">
                      {formatRupiah(agencyOption.price)}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5b403b] mt-1 leading-snug">
                    {agencyOption.description || 'Penggunaan komersial & agensi.'}
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="text-xs font-black text-[#111c2d] uppercase tracking-wider mb-2">
              Deskripsi Produk
            </h4>
            <div className="text-xs text-[#5b403b] whitespace-pre-line leading-relaxed bg-[#f0f3ff]/50 p-4 rounded-2xl border border-[#f0f3ff]">
              {activeProduct.description}
            </div>
          </div>

          {/* Key Features */}
          {activeProduct.features && activeProduct.features.length > 0 && (
            <div>
              <h4 className="text-xs font-black text-[#111c2d] uppercase tracking-wider mb-2">
                Keunggulan & Fitur Utama
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {activeProduct.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-[#111c2d]">
                    <div className="w-4 h-4 rounded-full bg-[#ffdad3] text-[#b22204] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          {activeProduct.instructions && activeProduct.instructions.length > 0 && (
            <div>
              <h4 className="text-xs font-black text-[#111c2d] uppercase tracking-wider mb-2">
                Panduan Penggunaan
              </h4>
              <ol className="list-decimal list-inside text-xs text-[#5b403b] space-y-1 bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200/60">
                {activeProduct.instructions.map((inst, i) => (
                  <li key={i}>{inst}</li>
                ))}
              </ol>
            </div>
          )}

          {/* FAQs */}
          {activeProduct.faqs && activeProduct.faqs.length > 0 && (
            <div>
              <h4 className="text-xs font-black text-[#111c2d] uppercase tracking-wider mb-2">
                Pertanyaan yang Sering Diajukan (FAQ)
              </h4>
              <div className="space-y-2">
                {activeProduct.faqs.map((faq, i) => (
                  <details key={i} className="group bg-[#f0f3ff] rounded-xl p-3 text-xs border border-[#dee8ff]/50">
                    <summary className="font-bold text-[#111c2d] cursor-pointer flex justify-between items-center">
                      <span>{faq.question}</span>
                      <ChevronDown className="w-3.5 h-3.5 group-open:rotate-180 transition-transform" />
                    </summary>
                    <p className="mt-2 text-[#5b403b] leading-relaxed pt-2 border-t border-[#dee8ff]/60">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer with Checkout CTA */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#f0f3ff] flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-[#8f7069] block font-medium">Total Harga</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-[#b22204]">
                {formatRupiah(currentPrice)}
              </span>
              {activeProduct.originalPrice && activeProduct.originalPrice > currentPrice && (
                <span className="text-xs text-[#8f7069] line-through">
                  {formatRupiah(activeProduct.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => startCheckout(activeProduct, selectedLicenseType)}
            className="flex-1 max-w-xs py-3 px-5 rounded-2xl bg-[#b22204] hover:bg-[#941901] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-md shadow-[#b22204]/25 transition-all active:scale-95 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Lanjut Checkout Instan</span>
          </button>
        </div>

      </div>
    </div>
  );
}
