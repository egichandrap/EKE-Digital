import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { formatRupiah } from '../utils/formatters';
import { X, Download, ExternalLink, RefreshCw, CheckCircle, Clock, ShieldCheck, Copy, Check, ChevronDown } from 'lucide-react';

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
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [showHowToPay, setShowHowToPay] = useState(false);

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

  const copyAmount = () => {
    navigator.clipboard.writeText(String(activeOrder.amount));
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden my-4 text-center">
        
        {/* Close Button */}
        <button
          onClick={() => setIsPaymentOpen(false)}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#111c2d] flex items-center justify-center transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* QRIS Official Header Bar */}
        <div className="bg-gradient-to-r from-[#b22204] to-[#e04225] py-2.5 px-4 text-white flex items-center justify-between text-xs font-black tracking-wider uppercase">
          <span>QRIS STANDAR NASIONAL</span>
          <span className="bg-white/20 px-2 py-0.5 rounded text-[10px]">Auto-Verify</span>
        </div>

        {/* Header Content */}
        <div className="pt-5 pb-2 px-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-[10px] font-black uppercase tracking-wider mb-2 border border-amber-200/60">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            <span>Menunggu Pembayaran</span>
          </div>

          <h2 className="text-xl font-black text-[#111c2d] tracking-tight">
            Pindai QRIS untuk Menyelesaikan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Invoice: <strong className="text-[#111c2d] font-mono">{activeOrder.id}</strong>
          </p>

          {/* Amount Display with Copy Button */}
          <div className="my-3 py-2.5 px-5 rounded-2xl bg-slate-50 inline-flex items-center gap-3 border border-slate-200">
            <div className="text-left">
              <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">Total Tagihan</span>
              <span className="text-2xl font-black text-[#b22204]">
                {formatRupiah(activeOrder.amount)}
              </span>
            </div>
            <button
              onClick={copyAmount}
              className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
              title="Salin nominal pas"
            >
              {copiedAmount ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Expiry Countdown */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-amber-700 font-bold bg-amber-50/80 py-1.5 px-3.5 rounded-full mx-auto w-max border border-amber-200/60">
            <Clock className="w-3.5 h-3.5" />
            <span>Sisa waktu bayar: {timeFormatted}</span>
          </div>
        </div>

        {/* QR Code Container */}
        <div className="p-4 flex flex-col items-center">
          <div
            onClick={() => setIsZoomed(!isZoomed)}
            className={`relative p-3.5 bg-white rounded-3xl shadow-sm border border-slate-200 cursor-pointer group transition-all duration-300 ${
              isZoomed ? 'scale-110 z-20 shadow-xl' : 'hover:scale-[1.02]'
            }`}
          >
            {qrImageUrl ? (
              <img
                src={qrImageUrl}
                alt="QRIS AutoGoPay"
                className="w-56 h-56 sm:w-60 sm:h-60 object-contain rounded-2xl"
              />
            ) : (
              <div className="w-56 h-56 flex flex-col items-center justify-center gap-2 text-slate-400">
                <span className="w-8 h-8 border-3 border-[#b22204] border-t-transparent rounded-full animate-spin"></span>
                <span className="text-xs font-bold">Membuat Kode QRIS...</span>
              </div>
            )}
            
            <div className="text-[10px] text-slate-400 font-semibold mt-1.5 group-hover:text-[#b22204] transition-colors">
              {isZoomed ? 'Ketuk untuk mengecilkan' : 'Ketuk untuk memperbesar'}
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2.5 w-full max-w-xs mt-3.5">
            <button
              onClick={handleDownloadQR}
              className="py-2.5 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-[#111c2d] text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-[#b22204]" />
              <span>Download QR</span>
            </button>

            {activeOrder.checkoutUrl ? (
              <a
                href={activeOrder.checkoutUrl}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 rounded-2xl bg-[#ffdad3] hover:bg-[#ffcdc4] text-[#b22204] text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Link Bayar</span>
              </a>
            ) : (
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="py-2.5 px-3 rounded-2xl bg-[#ffdad3] hover:bg-[#ffcdc4] text-[#b22204] text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                <span>Perbesar QR</span>
              </button>
            )}
          </div>

          {/* Payment method logos */}
          <div className="w-full mt-4 pt-3 border-t border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5">
              Menerima Seluruh Aplikasi Perbankan & e-Wallet
            </span>
            <div className="flex flex-wrap items-center justify-center gap-1 text-[10px] font-extrabold text-slate-600">
              {['BCA', 'Mandiri', 'BRI', 'BNI', 'GoPay', 'OVO', 'DANA', 'ShopeePay', 'LinkAja'].map((b) => (
                <span key={b} className="px-2 py-0.5 rounded-lg bg-slate-100">
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Expandable Cara Bayar */}
          <div className="w-full mt-3 text-left">
            <button
              onClick={() => setShowHowToPay(!showHowToPay)}
              className="w-full py-2 px-3 text-xs font-bold text-slate-600 hover:text-[#111c2d] flex items-center justify-between rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span>Petunjuk Cara Pembayaran</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showHowToPay ? 'rotate-180 text-[#b22204]' : ''}`} />
            </button>
            {showHowToPay && (
              <ol className="list-decimal list-inside text-[11px] text-slate-600 space-y-1 p-3 rounded-xl bg-slate-50 border border-slate-200 mt-1 font-medium">
                <li>Buka aplikasi m-Banking (BCA, Livin, BRImo) atau e-Wallet (GoPay, OVO, DANA).</li>
                <li>Pilih menu <strong>Scan / Bayar QRIS</strong>.</li>
                <li>Arahkan kamera ke kode QR di atas (atau unggah gambar QR).</li>
                <li>Periksa nominal tagihan pas, lalu konfirmasi PIN pembayaran.</li>
                <li>Tunggu 3-5 detik, pesanan Anda langsung aktif otomatis!</li>
              </ol>
            )}
          </div>

        </div>

        {/* Footer / Manual Check button */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-2">
          <button
            onClick={handleManualCheck}
            disabled={isChecking}
            className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer disabled:opacity-75"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Memeriksa ke AutoGoPay...' : 'Saya Sudah Bayar (Cek Otomatis)'}</span>
          </button>

          <p className="text-[10px] text-slate-500 font-medium flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Verifikasi berjalan otomatis setiap 3 detik. Tidak perlu refresh halaman.</span>
          </p>
        </div>

      </div>
    </div>
  );
}
