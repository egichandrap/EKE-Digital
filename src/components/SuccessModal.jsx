import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { parseDeliverables, formatRupiah } from '../utils/formatters';
import confetti from 'canvas-confetti';
import { CheckCircle, Copy, Check, ExternalLink, ShieldCheck, Key, Eye, EyeOff, MessageSquare, X } from 'lucide-react';

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
          particleCount: 80,
          spread: 70,
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
    text += `No. Pesanan: ${activeOrder.id}\n`;
    text += `Produk: ${activeOrder.productTitle}\n`;
    text += `Pembeli: ${activeOrder.buyerName}\n`;
    text += `Status: LUNAS & AKTIF\n\n`;
    text += `--- KREDENSIAL / LISENSI ---\n`;

    if (parsed.attributes.length > 0) {
      parsed.attributes.forEach(attr => {
        text += `${attr.label}: ${attr.value}\n`;
      });
    } else if (parsed.raw) {
      text += `Akses: ${parsed.raw}\n`;
    }

    if (parsed.primaryUrl) {
      text += `\nTautan Aktivasi: ${parsed.primaryUrl}\n`;
    }

    text += `\nSimpan data ini baik-baik. Layanan Bantuan: wa.me/${settings.waNumber}`;
    return text;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#f0f3ff] overflow-hidden my-4">
        
        {/* Close Button */}
        <button
          onClick={() => setIsSuccessOpen(false)}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#111c2d] flex items-center justify-center transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Success Header */}
        <div className="p-6 text-center border-b border-[#f0f3ff] bg-gradient-to-b from-emerald-50/60 to-white">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-md shadow-emerald-500/10">
            <CheckCircle className="w-9 h-9 stroke-[2.5]" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verifikasi Otomatis Sat-Set</span>
          </div>

          <h2 className="text-2xl font-black text-[#111c2d] tracking-tight">
            Pembayaran Berhasil!
          </h2>
          <p className="text-xs text-[#5b403b] max-w-sm mx-auto mt-1">
            Terima kasih, <strong className="text-[#111c2d]">{activeOrder.buyerName}</strong>! Pesanan{' '}
            <span className="font-extrabold text-[#b22204]">{activeOrder.id}</span> telah tuntas lunas & diverifikasi instan.
          </p>
        </div>

        {/* Credentials & Access Container */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          
          {/* Card Box */}
          <div className="relative rounded-2xl bg-[#f0f3ff]/60 border border-[#dee8ff] p-4">
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#006e2e] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#006e2e] animate-pulse"></span>
                Kredensial & Akses Lisensi Aktif
              </span>
              <span className="px-2 py-0.5 rounded bg-white text-[#b22204] text-[10px] font-bold border border-[#ffdad3]">
                Siap Pakai
              </span>
            </div>

            <h3 className="text-sm font-black text-[#111c2d]">
              {activeOrder.productTitle}
            </h3>
            <span className="text-[11px] text-[#8f7069]">
              {activeOrder.licenseName || 'Lisensi Standar'}
            </span>

            {/* Parsed Attributes List */}
            {parsed.attributes.length > 0 ? (
              <div className="mt-4 space-y-2.5">
                {parsed.attributes.map((attr) => {
                  const isPass = attr.isSensitive;
                  const isVisible = visiblePasswords[attr.id];

                  return (
                    <div
                      key={attr.id}
                      className="p-2.5 rounded-xl bg-white border border-[#dee8ff] flex items-center justify-between gap-2 shadow-2xs"
                    >
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] text-[#8f7069] font-bold uppercase tracking-wider block">
                          {attr.label}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#111c2d] truncate block select-all">
                          {isPass && !isVisible ? '••••••••••••' : attr.value}
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
              <div className="mt-3 p-3 rounded-xl bg-white border border-[#dee8ff] font-mono text-xs text-[#111c2d] break-all select-all">
                {parsed.raw}
              </div>
            ) : (
              <div className="mt-3 p-3 rounded-xl bg-amber-50 text-amber-800 text-xs">
                Akses sedang diproses dan telah dikirimkan ke nomor WhatsApp Anda.
              </div>
            )}

            {/* Quick Actions inside Box */}
            <div className="mt-4 pt-3 border-t border-[#dee8ff] flex flex-wrap gap-2">
              <button
                onClick={() => copyToClipboard(generateAllCopyText(), 'all')}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#006e2e] hover:bg-[#005a26] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAll ? 'Berhasil Disalin!' : 'Salin Semua Data (1-Klik)'}</span>
              </button>

              {parsed.primaryUrl && (
                <a
                  href={parsed.primaryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-4 rounded-xl bg-[#b22204] hover:bg-[#941901] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka Tautan Aktivasi</span>
                </a>
              )}
            </div>

          </div>

          {/* Panduan & Langkah Aktivasi dari Upstream */}
          {((activeOrder.fulfillment?.instructions && activeOrder.fulfillment.instructions.length > 0) ||
            (activeOrder.instructions && activeOrder.instructions.length > 0)) && (
            <div className="p-4 rounded-2xl bg-[#f0f3ff] border border-[#dee8ff] text-xs space-y-2">
              <span className="font-bold text-[#111c2d] flex items-center gap-1.5">
                <span>📋</span> Langkah & Panduan Aktivasi:
              </span>
              <ol className="list-decimal list-inside space-y-1.5 text-[#5b403b] pl-1 font-medium text-[11px]">
                {(activeOrder.fulfillment?.instructions || activeOrder.instructions).map((step, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Instructions note */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 space-y-1">
            <span className="font-bold flex items-center gap-1.5">
              <span>📌</span> Catatan Penting
            </span>
            <p className="text-[11px] leading-relaxed text-amber-800">
              Kredensial atau tautan aktivasi di atas sudah resmi aktif dan siap dipakai. Simpan data ini baik-baik. Jangan bagikan password kepada pihak lain.
            </p>
          </div>

          {/* WhatsApp Support CTA */}
          <div className="p-3 rounded-2xl bg-[#f0f3ff] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#006e2e]" />
              <span className="text-[#111c2d] font-bold">Butuh Bantuan Aktivasi?</span>
            </div>
            <a
              href={`https://wa.me/${settings.waNumber}?text=${encodeURIComponent(`Halo Admin ${settings.storeName}, saya butuh bantuan untuk pesanan ${activeOrder.id} (${activeOrder.productTitle})`)}`}
              target="_blank"
              rel="noreferrer"
              className="py-1.5 px-3 rounded-xl bg-white hover:bg-emerald-50 text-[#006e2e] border border-emerald-200 font-extrabold text-[11px] transition-colors"
            >
              Hubungi CS WA
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
