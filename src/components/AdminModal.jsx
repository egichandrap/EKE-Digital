import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { formatRupiah, formatDate } from '../utils/formatters';
import { X, Settings, DollarSign, Key, Database, RefreshCw, CheckCircle, Zap } from 'lucide-react';

export default function AdminModal() {
  const { isAdminOpen, setIsAdminOpen, showToast, loadInitialData } = useStore();
  const [activeTab, setActiveTab] = useState('settings'); // 'settings' | 'orders'

  const [settingsData, setSettingsData] = useState({
    storeName: 'EKE Digital',
    tagline: 'Pusat Produk Digital & Lisensi Terpercaya #1',
    waNumber: '6289604236160',
    markupPercent: 35,
    anfuToken: '',
    autogopayApiKey: '',
    autoFulfillToAnfu: true,
    simulatePaymentMode: false,
  });

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    if (!isAdminOpen) return;

    // Load admin settings
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(json => {
        if (json.success) setSettingsData(json.data);
      })
      .catch(console.error);

    // Load orders
    fetchOrders();
  }, [isAdminOpen]);

  const fetchOrders = () => {
    setLoadingOrders(true);
    fetch('/api/admin/orders')
      .then(res => res.json())
      .then(json => {
        if (json.success) setOrders(json.data || []);
      })
      .catch(console.error)
      .finally(() => setLoadingOrders(false));
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      setSavingSettings(true);
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsData),
      });
      const json = await res.json();
      if (json.success) {
        showToast('Pengaturan berhasil diperbarui!', 'success');
        loadInitialData(true); // reload products with new markup
      }
    } catch (err) {
      showToast('Gagal menyimpan pengaturan: ' + err.message, 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSimulatePay = async (orderId) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/simulate-pay`, {
        method: 'POST',
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Pesanan ${orderId} berhasil disimulasikan LUNAS & FULFILLED!`, 'success');
        fetchOrders();
      }
    } catch (err) {
      showToast('Gagal simulasikan pembayaran', 'error');
    }
  };

  if (!isAdminOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#f0f3ff] overflow-hidden my-6">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAdminOpen(false)}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#111c2d] flex items-center justify-center transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-[#f0f3ff] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#b22204] block mb-0.5">
              Admin & Gateway Control Panel
            </span>
            <h2 className="text-xl font-black text-[#111c2d]">
              Manajemen Sistem EKE Digital
            </h2>
          </div>

          {/* Tab selector */}
          <div className="flex bg-[#f0f3ff] p-1 rounded-xl mr-8 text-xs font-bold">
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'settings' ? 'bg-white text-[#b22204] shadow-xs' : 'text-[#5b403b]'
              }`}
            >
              Pengaturan Gateway & Markup
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'orders' ? 'bg-white text-[#b22204] shadow-xs' : 'text-[#5b403b]'
              }`}
            >
              Riwayat Pesanan ({orders.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Settings */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="p-6 space-y-5 max-h-[65vh] overflow-y-auto text-xs">
            
            {/* Markup Setting */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-amber-700" />
                <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider">
                  Pengaturan Markup Harga
                </h4>
              </div>
              <p className="text-[11px] text-amber-800 mb-3">
                Semua produk yang di-mirror dari ANFU Store akan otomatis dikalikan dengan persentase ini sebelum ditampilkan ke customer.
              </p>
              <div className="flex items-center gap-3">
                <label className="font-bold text-[#111c2d]">Persentase Markup (%):</label>
                <input
                  type="number"
                  min="0"
                  max="500"
                  value={settingsData.markupPercent}
                  onChange={(e) => setSettingsData({ ...settingsData, markupPercent: Number(e.target.value) })}
                  className="w-24 px-3 py-1.5 bg-white border border-amber-300 rounded-xl text-center font-black text-sm text-[#b22204] focus:outline-none"
                />
                <span className="text-[11px] text-amber-800 font-bold">
                  (Default: 35%)
                </span>
              </div>
            </div>

            {/* AutoGoPay Settings */}
            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/60 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-purple-900 uppercase tracking-wider">
                  Payment Gateway AutoGoPay (v1-gateway.autogopay.site)
                </h4>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  settingsData.autogopayApiKey ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  {settingsData.autogopayApiKey ? 'API Key Terpasang' : 'Mode Simulasi Aktif'}
                </span>
              </div>
              <p className="text-[11px] text-purple-800">
                Masukkan API Key AutoGoPay dari dashboard autogopay.site Anda. Jika dikosongkan, sistem berjalan dalam mode QRIS simulasi untuk keperluan demo / testing.
              </p>
              <div>
                <label className="block font-bold text-purple-900 mb-1">AutoGoPay API Key (Bearer Token):</label>
                <input
                  type="password"
                  value={settingsData.autogopayApiKey}
                  onChange={(e) => setSettingsData({ ...settingsData, autogopayApiKey: e.target.value })}
                  placeholder="Contoh: agp_live_abc123456789..."
                  className="w-full px-3.5 py-2 bg-white border border-purple-300 rounded-xl font-mono text-xs text-[#111c2d] focus:outline-none focus:border-purple-600"
                />
              </div>
            </div>

            {/* ANFU Upstream Settings */}
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/60 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-blue-900 uppercase tracking-wider">
                  Koneksi Akun ANFU Store (Auto-Debit Saldo Modal)
                </h4>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  settingsData.anfuToken ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  {settingsData.anfuToken ? 'Token Terpasang' : 'Belum Terhubung'}
                </span>
              </div>
              <p className="text-[11px] text-blue-800">
                Token otentikasi akun ANFU Anda (yang memiliki saldo deposit). Begitu customer membayar QRIS di EKE Digital, server otomatis menggunakan token ini untuk memesan ke ANFU via Saldo.
              </p>
              <div>
                <label className="block font-bold text-blue-900 mb-1">Token Login Akun ANFU (JWT):</label>
                <input
                  type="password"
                  value={settingsData.anfuToken}
                  onChange={(e) => setSettingsData({ ...settingsData, anfuToken: e.target.value })}
                  placeholder="Bearer eyJhbGciOi..."
                  className="w-full px-3.5 py-2 bg-white border border-blue-300 rounded-xl font-mono text-xs text-[#111c2d] focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            {/* OCTO-CRM Integration */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-700">hub</span>
                  <h4 className="text-xs font-black text-indigo-900 uppercase tracking-wider">
                    Pemantauan & Sinkronisasi OCTO-CRM
                  </h4>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  settingsData.octoCrmUrl ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  {settingsData.octoCrmUrl ? 'Terhubung ke OCTO' : 'Belum Dikonfigurasi'}
                </span>
              </div>
              <p className="text-[11px] text-indigo-800">
                Hubungkan EKE Digital dengan ekosistem <strong>OCTO-CRM</strong>. Setiap customer yang memesan dan membayar akan otomatis masuk sebagai <strong>Kontak Baru</strong> dan transaksi masuk sebagai <strong>Deal (Won)</strong> di pipeline OCTO-CRM untuk dipantau secara real-time.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-indigo-900 mb-1">Base URL OCTO-CRM API:</label>
                  <input
                    type="text"
                    value={settingsData.octoCrmUrl || ''}
                    onChange={(e) => setSettingsData({ ...settingsData, octoCrmUrl: e.target.value })}
                    placeholder="http://localhost:8080 atau https://api-crm.octo.id"
                    className="w-full px-3 py-1.5 bg-white border border-indigo-300 rounded-xl font-mono text-xs text-[#111c2d] focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-indigo-900 mb-1">Workspace ID:</label>
                  <input
                    type="text"
                    value={settingsData.octoCrmWorkspaceId || ''}
                    onChange={(e) => setSettingsData({ ...settingsData, octoCrmWorkspaceId: e.target.value })}
                    placeholder="Contoh: ws-default atau ws-eke"
                    className="w-full px-3 py-1.5 bg-white border border-indigo-300 rounded-xl font-mono text-xs text-[#111c2d] focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-indigo-900 mb-1">OCTO-CRM API Key / Bearer Token:</label>
                <input
                  type="password"
                  value={settingsData.octoCrmApiKey || ''}
                  onChange={(e) => setSettingsData({ ...settingsData, octoCrmApiKey: e.target.value })}
                  placeholder="Bearer token OCTO-CRM..."
                  className="w-full px-3 py-1.5 bg-white border border-indigo-300 rounded-xl font-mono text-xs text-[#111c2d] focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            {/* Store Profile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#111c2d] mb-1">Nama Toko:</label>
                <input
                  type="text"
                  value={settingsData.storeName}
                  onChange={(e) => setSettingsData({ ...settingsData, storeName: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#f0f3ff] border border-transparent focus:border-[#b22204] rounded-xl text-xs text-[#111c2d]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#111c2d] mb-1">Nomor WhatsApp CS:</label>
                <input
                  type="text"
                  value={settingsData.waNumber}
                  onChange={(e) => setSettingsData({ ...settingsData, waNumber: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#f0f3ff] border border-transparent focus:border-[#b22204] rounded-xl text-xs text-[#111c2d]"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={savingSettings}
                className="py-2.5 px-6 rounded-xl bg-[#b22204] hover:bg-[#941901] text-white text-xs font-black shadow-md shadow-[#b22204]/20 transition-all active:scale-95 cursor-pointer disabled:opacity-75"
              >
                {savingSettings ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>

          </form>
        )}

        {/* Tab 2: Orders List */}
        {activeTab === 'orders' && (
          <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#5b403b]">Total Pesanan Masuk: {orders.length}</span>
              <button
                onClick={fetchOrders}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#111c2d] font-bold"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingOrders ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12 text-[#8f7069]">Belum ada pesanan masuk.</div>
            ) : (
              <div className="space-y-3">
                {orders.map((o) => {
                  const isDone = o.status === 'completed' || o.status === 'paid';

                  return (
                    <div
                      key={o.id}
                      className="p-4 rounded-2xl bg-[#f0f3ff]/70 border border-[#dee8ff] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#111c2d]">{o.id}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            isDone ? 'bg-emerald-100 text-[#006e2e]' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {o.status.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#8f7069]">{formatDate(o.createdAt)}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-[#111c2d]">{o.productTitle}</span>
                          <span className="text-[11px] text-[#5b403b] block">
                            Pembeli: {o.buyerName} ({o.whatsapp})
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="font-black text-[#b22204] block">{formatRupiah(o.amount)}</span>
                          <span className="text-[10px] text-emerald-700 font-bold block">
                            Profit Margin: +{formatRupiah(o.profit)}
                          </span>
                        </div>
                      </div>

                      {/* Deliverables snippet */}
                      {o.fulfillment?.licenseKey && (
                        <div className="p-2 rounded-xl bg-white border border-[#dee8ff] font-mono text-[11px] text-[#111c2d] break-all select-all">
                          <strong>Kredensial:</strong> {o.fulfillment.licenseKey}
                        </div>
                      )}

                      {/* Simulate Payment trigger for testing */}
                      {!isDone && (
                        <div className="pt-2 border-t border-[#dee8ff] flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleSimulatePay(o.id)}
                            className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <Zap className="w-3 h-3" />
                            <span>Simulasikan Bayar & Auto-Fulfill</span>
                          </button>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
