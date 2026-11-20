import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatRupiah } from '../utils/formatters';
import { X, QrCode, Lock, ArrowRight, User, Phone, Mail } from 'lucide-react';

export default function CheckoutModal() {
  const {
    activeProduct,
    selectedLicenseType,
    isCheckoutOpen,
    setIsCheckoutOpen,
    submitCheckout,
    isSubmittingOrder
  } = useStore();

  const [buyerName, setBuyerName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState('');

  if (!isCheckoutOpen || !activeProduct) return null;

  const personalOption = activeProduct.licenseOptions?.personal;
  const agencyOption = activeProduct.licenseOptions?.agency;
  const finalPrice = selectedLicenseType === 'agency' && agencyOption
    ? agencyOption.price
    : (personalOption ? personalOption.price : activeProduct.price);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!buyerName.trim()) {
      setValidationError('Nama lengkap wajib diisi');
      return;
    }
    if (!whatsapp.trim() || whatsapp.trim().length < 8) {
      setValidationError('Nomor WhatsApp aktif wajib diisi untuk pengiriman lisensi');
      return;
    }

    setValidationError('');
    submitCheckout({
      buyerName: buyerName.trim(),
      whatsapp: whatsapp.trim(),
      email: email.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200/80 overflow-hidden my-6">
        
        {/* Close Button */}
        <button
          onClick={() => setIsCheckoutOpen(false)}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-[#0f172a] flex items-center justify-center transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-100 bg-gradient-to-b from-peach-50/60 to-white">
          <span className="text-[10px] font-black uppercase tracking-wider text-peach-600 block mb-1">
            CHECKOUT INSTAN • EKE DIGITAL
          </span>
          <h2 className="text-xl font-black text-[#0f172a] tracking-tight">
            Data Pembeli & Tagihan QRIS
          </h2>
        </div>

        {/* Order Item Summary Card */}
        <div className="p-3.5 mx-5 sm:mx-6 my-4 rounded-2xl bg-peach-50/50 border border-peach-200/60 flex items-center gap-3">
          <img
            src={activeProduct.image}
            alt={activeProduct.title}
            className="w-14 h-14 rounded-xl object-cover shrink-0 border border-white shadow-xs"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-black text-[#0f172a] truncate">
              {activeProduct.title}
            </h4>
            <span className="text-[10px] text-slate-500 font-semibold block">
              {selectedLicenseType === 'agency' ? 'Lisensi Komersial' : 'Lisensi Standar'}
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-sm font-black text-peach-600">
                {formatRupiah(finalPrice)}
              </span>
              {activeProduct.originalPrice && activeProduct.originalPrice > finalPrice && (
                <span className="text-[10px] text-slate-400 line-through font-medium">
                  {formatRupiah(activeProduct.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="px-5 sm:px-6 pb-6 space-y-4">
          
          {validationError && (
            <div className="p-3 rounded-2xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
              {validationError}
            </div>
          )}

          {/* Nama Lengkap */}
          <div>
            <label className="block text-xs font-black text-[#0f172a] mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>Nama Lengkap <span className="text-peach-600">*</span></span>
            </label>
            <input
              type="text"
              required
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 focus:bg-white border border-stone-200 focus:border-peach-500 text-xs font-medium text-[#0f172a] focus:outline-none focus:ring-3 focus:ring-peach-500/10 transition-all shadow-inner"
            />
          </div>

          {/* Nomor WhatsApp */}
          <div>
            <label className="block text-xs font-black text-[#0f172a] mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>Nomor WhatsApp Aktif <span className="text-peach-600">*</span></span>
              </span>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                Kredensial Dikirim ke Sini
              </span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 pointer-events-none">
                🇮🇩 +62
              </span>
              <input
                type="tel"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value.replace(/^0+/, ''))}
                placeholder="81234567890"
                className="w-full pl-16 pr-4 py-2.5 rounded-2xl bg-stone-50 focus:bg-white border border-stone-200 focus:border-peach-500 text-xs font-medium text-[#0f172a] focus:outline-none focus:ring-3 focus:ring-peach-500/10 transition-all shadow-inner"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1 font-medium">
              Masukkan tanpa angka 0 di depan (contoh: 89604236160).
            </p>
          </div>

          {/* Email (Opsional) */}
          <div>
            <label className="block text-xs font-black text-[#0f172a] mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>Email (Opsional)</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">Bukti Tagihan</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="budi@example.com"
              className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 focus:bg-white border border-stone-200 focus:border-peach-500 text-xs font-medium text-[#0f172a] focus:outline-none focus:ring-3 focus:ring-peach-500/10 transition-all shadow-inner"
            />
          </div>

          {/* Payment Method Notice in Soft Sage */}
          <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-center gap-2.5 text-xs text-[#0f172a]">
            <div className="w-8 h-8 rounded-xl bg-white text-peach-600 flex items-center justify-center shrink-0 shadow-2xs font-black text-[10px] border border-peach-200/50">
              QRIS
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-extrabold text-emerald-900 block text-[11px]">
                AutoGoPay Dynamic QRIS
              </span>
              <span className="text-[10px] text-emerald-700 block leading-tight font-medium">
                Scan langsung dari BCA, Mandiri, BRI, GoPay, OVO, ShopeePay & DANA.
              </span>
            </div>
          </div>

          {/* CTA Submit Button */}
          <button
            type="submit"
            disabled={isSubmittingOrder}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-peach-500 to-[#fa5f38] hover:from-peach-600 hover:to-peach-500 text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-peach-500/25 transition-all active:scale-95 cursor-pointer disabled:opacity-75"
          >
            {isSubmittingOrder ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Membuat Tagihan QRIS...</span>
              </>
            ) : (
              <>
                <QrCode className="w-4 h-4" />
                <span>Bayar Sekarang ({formatRupiah(finalPrice)})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Trust Seal */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-semibold pt-1">
            <Lock className="w-3 h-3 text-emerald-600" />
            <span>Kredensial langsung terbit otomatis di layar setelah bayar</span>
          </div>

        </form>

      </div>
    </div>
  );
}
