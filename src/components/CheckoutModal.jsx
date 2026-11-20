import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatRupiah } from '../utils/formatters';
import { X, QrCode, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

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
      setValidationError('Nomor WhatsApp aktif wajib diisi');
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#f0f3ff] overflow-hidden my-6">
        
        {/* Close Button */}
        <button
          onClick={() => setIsCheckoutOpen(false)}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#111c2d] flex items-center justify-center transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="p-5 border-b border-[#f0f3ff]">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#b22204] block mb-1">
            Checkout EKE Digital
          </span>
          <h2 className="text-lg font-black text-[#111c2d]">
            Informasi Pembeli & Tagihan
          </h2>
        </div>

        {/* Order Summary Box */}
        <div className="p-4 mx-5 my-4 rounded-2xl bg-[#f0f3ff] border border-[#dee8ff]/60 flex items-center gap-3">
          <img
            src={activeProduct.image}
            alt={activeProduct.title}
            className="w-14 h-14 rounded-xl object-cover shrink-0 border border-white"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-[#111c2d] truncate">
              {activeProduct.title}
            </h4>
            <span className="text-[10px] text-[#5b403b] block">
              {selectedLicenseType === 'agency' ? 'Lisensi Komersial' : 'Lisensi Standar'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-black text-[#b22204]">
                {formatRupiah(finalPrice)}
              </span>
              {activeProduct.originalPrice && activeProduct.originalPrice > finalPrice && (
                <span className="text-[10px] text-[#8f7069] line-through">
                  {formatRupiah(activeProduct.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 pb-5 space-y-4">
          
          {validationError && (
            <div className="p-2.5 rounded-xl bg-red-50 text-red-600 text-xs font-bold border border-red-200">
              {validationError}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#111c2d] mb-1">
              Nama Lengkap <span className="text-[#b22204]">*</span>
            </label>
            <input
              type="text"
              required
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f3ff] focus:bg-white border border-transparent focus:border-[#b22204] text-xs text-[#111c2d] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111c2d] mb-1">
              Nomor WhatsApp Aktif <span className="text-[#b22204]">*</span>
            </label>
            <input
              type="tel"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Contoh: 081234567890 atau 62812..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f3ff] focus:bg-white border border-transparent focus:border-[#b22204] text-xs text-[#111c2d] focus:outline-none transition-all"
            />
            <span className="text-[10px] text-[#8f7069] mt-0.5 block">
              Untuk pengiriman kredensial akun & backup pesanan Anda.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111c2d] mb-1">
              Alamat Email (Opsional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Contoh: nama@gmail.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f3ff] focus:bg-white border border-transparent focus:border-[#b22204] text-xs text-[#111c2d] focus:outline-none transition-all"
            />
          </div>

          {/* Payment method summary */}
          <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-purple-700" />
              <div>
                <span className="text-xs font-bold text-purple-900 block">QRIS AutoGoPay</span>
                <span className="text-[10px] text-purple-700">Scan via GoPay, BCA, Mandiri, DANA, OVO, dll.</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-purple-200 text-purple-900 text-[10px] font-bold">
              Instan
            </span>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmittingOrder}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#b22204] hover:bg-[#941901] disabled:bg-slate-300 text-white text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-[#b22204]/20 transition-all active:scale-95 cursor-pointer"
          >
            {isSubmittingOrder ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Membuat Tagihan QRIS...</span>
              </>
            ) : (
              <>
                <span>Lanjut ke Pembayaran QRIS</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-[10px] text-center text-[#8f7069] flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" />
            <span>Transaksi aman & terverifikasi otomatis 24 jam nonstop</span>
          </p>

        </form>

      </div>
    </div>
  );
}
