import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatRupiah } from '../utils/formatters';
import { X, Check, ShieldCheck, Zap, ChevronDown } from 'lucide-react';

export default function ProductDetailModal() {
  const {
    activeProduct,
    isDetailOpen,
    setIsDetailOpen,
    selectedLicenseType,
    setSelectedLicenseType,
    startCheckout
  } = useStore();

  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  if (!isDetailOpen || !activeProduct) return null;

  const personalOption = activeProduct.licenseOptions?.personal;
  const agencyOption = activeProduct.licenseOptions?.agency;

  const currentPrice = selectedLicenseType === 'agency' && agencyOption
    ? agencyOption.price
    : (personalOption ? personalOption.price : activeProduct.price);

  const toggleFaq = (idx) => {
    setOpenFaqIndex(prev => prev === idx ? null : idx);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200/80 overflow-hidden my-6">
        
        {/* Close Button */}
        <button
          onClick={() => setIsDetailOpen(false)}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center shadow-lg backdrop-blur-md transition-all active:scale-95 cursor-pointer"
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-5 sm:p-6 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-block px-3 py-1 rounded-xl bg-gradient-to-r from-peach-500 to-[#fa5f38] text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                {activeProduct.badge || '⚡ Auto-Fulfill'}
              </span>
              {activeProduct.discountPercentage > 0 && (
                <span className="inline-block px-2.5 py-1 rounded-xl bg-emerald-600 text-white text-[10px] font-black shadow-sm">
                  Hemat {activeProduct.discountPercentage}%
                </span>
              )}
              <span className="inline-block px-2.5 py-1 rounded-xl bg-white/20 backdrop-blur-md text-white text-[10px] font-bold">
                {activeProduct.categoryLabel || activeProduct.category}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black leading-tight text-white drop-shadow-sm">
              {activeProduct.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 line-clamp-1 font-medium">
              {activeProduct.subtitle}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[58vh] overflow-y-auto">
          
          {/* License Selection */}
          {agencyOption && personalOption && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-black text-[#0f172a] uppercase tracking-wider">
                  Pilih Tipe Lisensi:
                </label>
                <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200/60">
                  Garansi Resmi Aktif
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Standar License */}
                <div
                  onClick={() => setSelectedLicenseType('personal')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                    selectedLicenseType === 'personal'
                      ? 'border-peach-500 bg-peach-50/40 shadow-sm'
                      : 'border-stone-200 bg-white hover:border-peach-200'
                  }`}
                >
                  {selectedLicenseType === 'personal' && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-peach-500 text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                  <span className="text-xs font-black text-[#0f172a] block mb-0.5">
                    {personalOption.name || 'Lisensi Standar'}
                  </span>
                  <span className="text-base font-black text-peach-600 block mb-1">
                    {formatRupiah(personalOption.price)}
                  </span>
                  <p className="text-[11px] text-slate-600 leading-snug font-medium">
                    {personalOption.description || 'Penggunaan pribadi/personal penuh.'}
                  </p>
                </div>

                {/* Komersial License */}
                <div
                  onClick={() => setSelectedLicenseType('agency')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                    selectedLicenseType === 'agency'
                      ? 'border-peach-500 bg-peach-50/40 shadow-sm'
                      : 'border-stone-200 bg-white hover:border-peach-200'
                  }`}
                >
                  {selectedLicenseType === 'agency' && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-peach-500 text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                  <span className="text-xs font-black text-[#0f172a] block mb-0.5">
                    {agencyOption.name || 'Lisensi Komersial'}
                  </span>
                  <span className="text-base font-black text-peach-600 block mb-1">
                    {formatRupiah(agencyOption.price)}
                  </span>
                  <p className="text-[11px] text-slate-600 leading-snug font-medium">
                    {agencyOption.description || 'Penggunaan komersial & agensi.'}
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="text-xs font-black text-[#0f172a] uppercase tracking-wider mb-2">
              Deskripsi Produk
            </h4>
            <div className="text-xs text-slate-600 whitespace-pre-line leading-relaxed bg-stone-50 p-4 rounded-2xl border border-stone-200/70 font-medium">
              {activeProduct.description}
            </div>
          </div>

          {/* Key Features */}
          {activeProduct.features && activeProduct.features.length > 0 && (
            <div>
              <h4 className="text-xs font-black text-[#0f172a] uppercase tracking-wider mb-2.5">
                Keunggulan & Fitur Utama
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {activeProduct.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-[#0f172a] bg-stone-50/80 p-2.5 rounded-xl border border-stone-200/50">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3] text-emerald-600" />
                    </div>
                    <span className="font-semibold">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step-by-Step Instructions */}
          {activeProduct.instructions && activeProduct.instructions.length > 0 && (
            <div>
              <h4 className="text-xs font-black text-[#0f172a] uppercase tracking-wider mb-2">
                Panduan Penggunaan
              </h4>
              <ol className="list-decimal list-inside text-xs text-amber-900 space-y-1.5 bg-amber-50/80 p-4 rounded-2xl border border-amber-200/70 font-medium">
                {activeProduct.instructions.map((inst, i) => (
                  <li key={i} className="leading-relaxed">{inst}</li>
                ))}
              </ol>
            </div>
          )}

          {/* FAQs Accordion */}
          {activeProduct.faqs && activeProduct.faqs.length > 0 && (
            <div>
              <h4 className="text-xs font-black text-[#0f172a] uppercase tracking-wider mb-2.5">
                Tanya Jawab (FAQ)
              </h4>
              <div className="space-y-2">
                {activeProduct.faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-stone-200 rounded-2xl overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => toggleFaq(idx)}
                        className="w-full p-3.5 text-left text-xs font-bold text-[#0f172a] flex items-center justify-between gap-2 hover:bg-stone-50 transition-colors cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-peach-600' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="px-3.5 pb-3.5 text-xs text-slate-600 leading-relaxed font-medium bg-stone-50/70 border-t border-stone-100">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Modal Sticky Footer with Checkout CTA */}
        <div className="p-4 sm:p-5 bg-white border-t border-stone-200 flex items-center justify-between gap-4 shadow-lg">
          <div>
            <span className="text-[11px] text-slate-500 block font-bold">Total Harga</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-peach-600">
                {formatRupiah(currentPrice)}
              </span>
              {activeProduct.originalPrice && activeProduct.originalPrice > currentPrice && (
                <span className="text-xs text-slate-400 line-through font-medium">
                  {formatRupiah(activeProduct.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => startCheckout(activeProduct, selectedLicenseType)}
            className="flex-1 max-w-xs py-3 px-5 rounded-2xl bg-gradient-to-r from-peach-500 to-[#fa5f38] hover:from-peach-600 hover:to-peach-500 text-white text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-peach-500/25 transition-all active:scale-95 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Lanjut Checkout Instan</span>
          </button>
        </div>

      </div>
    </div>
  );
}
