import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { formatRupiah } from '../utils/formatters';
import { X, Download, ExternalLink, RefreshCw, CheckCircle, Clock, ShieldCheck, AlertCircle } from 'lucide-react';

export default function PaymentModal() {
  const {
    activeOrder,
    isPaymentOpen,
    setIsPaymentOpen,
    checkPaymentStatus,
  } = useStore();

  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [isChecking, setIsChecking] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (!isPaymentOpen || !activeOrder) return;

    setTimeLeft(15 * 60);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaymentOpen, activeOrder]);

  // Auto-polling payment status every 3.5 seconds
  useEffect(() => {
    if (!isPaymentOpen || !activeOrder?.id) return;

    const interval = setInterval(async () => {
      try {
        await checkPaymentStatus(activeOrder.id);
      } catch (err) {
        console.warn('Poll error:', err);
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaymentOpen, activeOrder?.id, checkPaymentStatus]);

  if (!isPaymentOpen || !activeOrder) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const qrImageUrl = activeOrder.qrUrl || (activeOrder.qrString
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=4&data=${encodeURIComponent(activeOrder.qrString)}`
    : null);

  const handleManualCheck = async () => {
    setIsChecking(true);
    await checkPaymentStatus(activeOrder.id);
    setIsChecking(false);
  };

  const handleDownloadQR = () => {
    if (!qrImageUrl) return;
    const a = document.createElement('a');
    a.href = qrImageUrl;
    a.download = `QRIS-${activeOrder.id}.png`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#f0f3ff] overflow-hidden my-4 text-center">
        
        {/* Close Button */}
        <button
          onClick={() => setIsPaymentOpen(false)}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#111c2d] flex items-center justify-center transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="pt-6 pb-2 px-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdad3]/50 text-[#b22204] text-[10px] font-black uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-[#b22204] animate-ping"></span>
            <span>Menunggu Pembayaran QRIS</span>
          </div>

          <h2 className="text-xl font-black text-[#111c2d] tracking-tight">
            Pindai Kode QRIS
          </h2>
          <p className="text-xs text-[#5b403b] mt-0.5">
            Pesanan <span className="font-bold text-[#111c2d]">{activeOrder.id}</span>
          </p>

          {/* Amount Display */}
          <div className="my-3 py-2 px-4 rounded-2xl bg-[#f0f3ff] inline-block border border-[#dee8ff]">
            <span className="text-[11px] text-[#8f7069] block font-medium">Total Tagihan</span>
            <span className="text-2xl font-black text-[#b22204]">
              {formatRupiah(activeOrder.amount)}
            </span>
          </div>

          {/* Expiry Countdown */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-amber-700 font-bold bg-amber-50 py-1.5 px-3 rounded-full mx-auto w-max border border-amber-200/60">
            <Clock className="w-3.5 h-3.5" />
            <span>Sisa waktu: {timeFormatted}</span>
          </div>
        </div>

        {/* QR Code Container */}
        <div className="p-4 flex flex-col items-center">
          <div
            onClick={() => setIsZoomed(!isZoomed)}
            className={`relative p-3 bg-white rounded-2xl shadow-sm border border-[#dee8ff] cursor-pointer group transition-all ${
              isZoomed ? 'scale-110 z-20' : 'hover:scale-102'
            }`}
          >
            {qrImageUrl ? (
              <img
                src={qrImageUrl}
                alt="QRIS AutoGoPay"
                className="w-56 h-56 sm:w-60 sm:h-60 object-contain rounded-xl"
              />
            ) : (
              <div className="w-56 h-56 flex flex-col items-center justify-center gap-2 text-slate-400">
                <span className="w-8 h-8 border-2 border-[#b22204] border-t-transparent rounded-full animate-spin"></span>
                <span className="text-xs">Memuat QR Code...</span>
              </div>
            )}
            
            <div className="text-[10px] text-[#8f7069] mt-1.5 group-hover:text-[#b22204] transition-colors">
              {isZoomed ? 'Ketuk untuk mengecilkan' : 'Ketuk untuk memperbesar QR'}
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2 w-full max-w-xs mt-3">
            <button
              onClick={handleDownloadQR}
              className="py-2 px-3 rounded-xl bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#111c2d] text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-[#b22204]" />
              <span>Download QR</span>
            </button>

            {activeOrder.checkoutUrl ? (
              <a
                href={activeOrder.checkoutUrl}
                target="_blank"
                rel="noreferrer"
                className="py-2 px-3 rounded-xl bg-[#ffdad3] hover:bg-[#ffcdc4] text-[#b22204] text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Link Bayar</span>
              </a>
            ) : (
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="py-2 px-3 rounded-xl bg-[#ffdad3] hover:bg-[#ffcdc4] text-[#b22204] text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                <span>Perbesar QR</span>
              </button>
            )}
          </div>

          {/* Payment method logos */}
          <div className="w-full mt-4 pt-3 border-t border-[#f0f3ff]">
            <span className="text-[10px] text-[#8f7069] font-bold uppercase tracking-wider block mb-2">
              Menerima Semua e-Wallet & m-Banking
            </span>
            <div className="flex flex-wrap items-center justify-center gap-1 text-[10px] font-extrabold text-[#5b403b]">
              {['BCA', 'Mandiri', 'BRI', 'BNI', 'GoPay', 'OVO', 'DANA', 'ShopeePay', 'LinkAja'].map((b) => (
                <span key={b} className="px-2 py-0.5 rounded bg-[#f0f3ff]">
                  {b}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Footer / Manual Check button */}
        <div className="p-4 bg-slate-50 border-t border-[#f0f3ff] space-y-2">
          <button
            onClick={handleManualCheck}
            disabled={isChecking}
            className="w-full py-2.5 px-4 rounded-xl bg-[#006e2e] hover:bg-[#005a26] text-white text-xs font-black flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-75"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Memeriksa ke AutoGoPay...' : 'Saya Sudah Bayar (Cek Status)'}</span>
          </button>

          <p className="text-[10px] text-[#8f7069] flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006e2e] animate-ping"></span>
            <span>Sistem memeriksa mutasi otomatis setiap 3 detik.</span>
          </p>
        </div>

      </div>
    </div>
  );
}
