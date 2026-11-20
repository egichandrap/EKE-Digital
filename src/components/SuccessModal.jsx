import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { parseDeliverables, formatRupiah } from '../utils/formatters';
import confetti from 'canvas-confetti';
import { CheckCircle2, Copy, Check, ExternalLink, ShieldCheck, Eye, EyeOff, MessageSquare, X, Sparkles, Key } from 'lucide-react';

export default function SuccessModal() {
  const {
    activeOrder,
    isSuccessOpen,
    setIsSuccessOpen,
    settings
  } = useStore();

  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedItem, setCopiedItem] = useState(null);
  const [visiblePasswords, setVisiblePasswords] = useState({});

  useEffect(() => {
    if (isSuccessOpen) {
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.warn('Confetti error:', err);
      }
    }
  }, [isSuccessOpen]);

  if (!isSuccessOpen || !activeOrder) return null;

  const parsed = parseDeliverables(activeOrder.fulfillment);

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    if (id === 'all') {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2500);
    } else {
      setCopiedItem(id);
      setTimeout(() => setCopiedItem(null), 2000);
    }
  };

  const generateAllCopyText = () => {
    let text = `📦 DETAIL PESANAN DIGITAL - ${settings.storeName || 'EKE Digital'}\n`;
    text += `No. Invoice: ${activeOrder.id}\n`;
    text += `Produk: ${activeOrder.productTitle}\n`;
    text += `Pembeli: ${activeOrder.buyerName}\n`;
    text += `Status: LUNAS & AKTIF RESMI\n\n`;
    text += `--- KREDENSIAL / LISENSI ---\n`;

    if (parsed.attributes.length > 0) {
      parsed.attributes.forEach(attr => {
        text += `${attr.label}: ${attr.value}\n`;
      });
    } else if (parsed.raw) {
      text += `Akses Lisensi: ${parsed.raw}\n`;
    }

    if (parsed.primaryUrl) {
      text += `\nTautan Aktivasi Resmi: ${parsed.primaryUrl}\n`;
    }

    text += `\nSimpan data ini baik-baik. Layanan Bantuan CS: wa.me/${settings.waNumber}`;
    return text;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden my-4">
        
        {/* Close Button */}
        <button
          onClick={() => setIsSuccessOpen(false)}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#111c2d] flex items-center justify-center transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Celebration Header */}
        <div className="p-6 text-center border-b border-slate-100 bg-gradient-to-b from-emerald-50/80 via-emerald-50/20 to-white">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-md shadow-emerald-500/15">
            <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Terverifikasi Otomatis • Lunas</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#111c2d] tracking-tight">
            Pembayaran Berhasil!
          </h2>
          <p className="text-xs text-slate-600 max-w-sm mx-auto mt-1 font-medium">
            Terima kasih, <strong className="text-[#111c2d]">{activeOrder.buyerName}</strong>! Pesanan{' '}
            <span className="font-mono font-bold text-[#b22204]">{activeOrder.id}</span> telah resmi aktif.
          </p>
        </div>

        {/* Deliverables Body Container */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          
          {/* Main Credentials Card Box */}
          <div className="relative rounded-2xl bg-slate-50 border border-slate-200 p-4 sm:p-5">
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Kredensial & Akses Lisensi Aktif</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                Resmi
              </span>
            </div>

            <h3 className="text-sm font-black text-[#111c2d]">
              {activeOrder.productTitle}
            </h3>
            <span className="text-[11px] text-slate-500 font-semibold block mb-3">
              {activeOrder.licenseName || 'Lisensi Standar'}
            </span>

            {/* Parsed Attributes */}
            {parsed.attributes.length > 0 ? (
              <div className="space-y-2.5">
                {parsed.attributes.map((attr) => {
                  const isPass = attr.isSensitive;
                  const isVisible = visiblePasswords[attr.id];

                  return (
                    <div
                      key={attr.id}
                      className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-2 shadow-2xs"
                    >
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                          {attr.label}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#111c2d] truncate block select-all">
                          {isPass && !isVisible ? '••••••••••••••••' : attr.value}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        {isPass && (
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(attr.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                            title={isVisible ? 'Sembunyikan' : 'Lihat'}
                          >
                            {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => copyToClipboard(attr.value, attr.id)}
                          className="p-1.5 rounded-lg text-[#b22204] hover:bg-[#ffdad3]/40 transition-colors cursor-pointer"
                          title="Salin"
                        >
                          {copiedItem === attr.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : parsed.raw ? (
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 font-mono text-xs text-[#111c2d] break-all select-all font-bold">
                {parsed.raw}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-amber-50 text-amber-800 text-xs font-medium">
                Akses sedang diproses dan dikirim otomatis ke nomor WhatsApp Anda.
              </div>
            )}

            {/* Quick Actions inside Box */}
            <div className="mt-4 pt-3.5 border-t border-slate-200 flex flex-wrap gap-2">
              <button
                onClick={() => copyToClipboard(generateAllCopyText(), 'all')}
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAll ? 'Tersalin!' : 'Salin Semua Data (1-Klik)'}</span>
              </button>

              {parsed.primaryUrl && (
                <a
                  href={parsed.primaryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#b22204] to-[#e04225] hover:from-[#941901] hover:to-[#b22204] text-white text-xs font-black flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-md shadow-[#b22204]/20"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka Tautan Aktivasi</span>
                </a>
              )}
            </div>

          </div>

          {/* Upstream Product Instructions */}
          {((activeOrder.fulfillment?.instructions && activeOrder.fulfillment.instructions.length > 0) ||
            (activeOrder.instructions && activeOrder.instructions.length > 0)) && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <span className="font-black text-[#111c2d] flex items-center gap-1.5">
                <span>📋</span> Langkah & Panduan Aktivasi:
              </span>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-600 pl-1 font-semibold text-[11px]">
                {(activeOrder.fulfillment?.instructions || activeOrder.instructions).map((step, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Important Security Notice */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-xs text-amber-900 space-y-1">
            <span className="font-black flex items-center gap-1.5 text-[11px]">
              <span>📌</span> Catatan Penting
            </span>
            <p className="text-[11px] leading-relaxed text-amber-800 font-medium">
              Kredensial atau tautan aktivasi di atas sudah resmi aktif dan siap dipakai. Simpan data ini baik-baik. Anda juga dapat melihatnya kembali kapan saja melalui menu <strong>Lacak Pesanan</strong>.
            </p>
          </div>

          {/* WhatsApp Support CTA */}
          <div className="p-3.5 rounded-2xl bg-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span className="text-[#111c2d] font-bold">Butuh Bantuan Aktivasi?</span>
            </div>
            <a
              href={`https://wa.me/${settings.waNumber}?text=${encodeURIComponent(`Halo Admin ${settings.storeName}, saya butuh bantuan untuk pesanan ${activeOrder.id} (${activeOrder.productTitle})`)}`}
              target="_blank"
              rel="noreferrer"
              className="py-1.5 px-3.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 font-black text-[11px] transition-colors shadow-2xs"
            >
              Hubungi CS WA
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
