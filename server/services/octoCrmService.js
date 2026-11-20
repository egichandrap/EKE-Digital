const { getSettings } = require('../config');

/**
 * Service to sync customer data, orders, and deals from EKE Digital to OCTO-CRM
 * Connects directly to OCTO-CRM Public Ecosystem Inbound Engine (lead-intake)
 * Base URL: https://octo-crm-production-7dcfef0d.up.railway.app
 * Workspace ID: 0c700000-0000-0000-0000-000000000000
 */
const octoCrmService = {
  /**
   * Helper to send lead intake payload to OCTO-CRM
   */
  async _sendToIntake(payload, label) {
    const settings = getSettings();
    const baseUrl = (settings.octoCrmUrl || process.env.OCTO_CRM_URL || 'https://octo-crm-production-7dcfef0d.up.railway.app').replace(/\/+$/, '');
    const workspaceId = settings.octoCrmWorkspaceId || process.env.OCTO_CRM_WORKSPACE_ID || '0c700000-0000-0000-0000-000000000000';
    const apiKey = settings.octoCrmApiKey || process.env.OCTO_CRM_API_KEY || '';

    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'Authorization': `Bearer ${apiKey.trim()}` } : {})
      };

      const endpoint = `${baseUrl}/api/v1/workspaces/${workspaceId}/integrations/lead-intake`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (res.ok && json.success) {
        console.log(`[OCTO-CRM Sync] SUKSES! ${label} berhasil dicatat di OCTO-CRM:`, json.data?.contact_id || json.data);
        return { success: true, data: json.data };
      } else {
        console.warn(`[OCTO-CRM Sync] Response error dari OCTO-CRM (${label}):`, json.error || json.message);
      }
    } catch (err) {
      console.error(`[OCTO-CRM Sync Error] Gagal menghubungi OCTO-CRM API (${label}):`, err.message);
    }

    return { success: false };
  },

  /**
   * 1. STAGE PENDING CHECKOUT:
   * Langsung dipanggil saat customer klik "Bayar Sekarang" & QRIS muncul.
   * Sangat berguna untuk reminder follow-up / abandoned checkout recovery via WhatsApp.
   */
  async syncPendingCheckout(order) {
    console.log(`[OCTO-CRM Sync] Mencatat New Lead (Menunggu Pembayaran) untuk order ${order.id}...`);

    const reminderDraft = `Halo Kak ${order.buyerName}, tagihan QRIS untuk pesanan *${order.productTitle}* di EKE Digital (No. Invoice: ${order.id}) sebesar Rp ${Number(order.amount).toLocaleString('id-ID')} masih aktif. Apakah ada kendala saat melakukan scan pembayaran? Jika butuh bantuan kami siap bantu ya Kak! 🙏`;

    const payload = {
      full_name: order.buyerName || 'Customer EKE Digital',
      phone: order.whatsapp,
      email: order.email || undefined,
      product_interest: `EKE Digital: ${order.productTitle}`,
      form_type: 'checkout_pending_payment',
      lead_source: 'EKE-Digital (Menunggu Pembayaran)',
      estimated_value: Number(order.amount),
      consent_given: true,
      message: `🔔 [MENUNGGU PEMBAYARAN QRIS] - Siap Difollow-up / Kirim Reminder\n` +
               `Invoice: ${order.id}\n` +
               `Produk: ${order.productTitle} (${order.licenseName || 'Standar'})\n` +
               `Tagihan: Rp ${Number(order.amount).toLocaleString('id-ID')}\n` +
               `Metode Bayar: QRIS AutoGoPay\n` +
               `Link Bayar: ${order.checkoutUrl || '-'}\n` +
               `Waktu Order: ${new Date(order.createdAt).toLocaleString('id-ID')}\n\n` +
               `💬 Draf Pesan Reminder WA:\n"${reminderDraft}"`
    };

    return this._sendToIntake(payload, `Pending Order ${order.id}`);
  },

  /**
   * 2. STAGE COMPLETED / LUNAS:
   * Dipanggil begitu pembayaran QRIS terkonfirmasi dan fulfillment selesai.
   */
  async syncCompletedOrder(order) {
    console.log(`[OCTO-CRM Sync] Menyinkronkan pesanan LUNAS ${order.id} ke OCTO-CRM...`);

    const payload = {
      full_name: order.buyerName || 'Customer EKE Digital',
      phone: order.whatsapp,
      email: order.email || undefined,
      product_interest: `EKE Digital: ${order.productTitle}`,
      form_type: 'checkout_paid_completed',
      lead_source: 'EKE-Digital (Lunas)',
      estimated_value: Number(order.amount),
      consent_given: true,
      message: `✅ [PEMBAYARAN LUNAS & AKTIF]\n` +
               `Invoice: ${order.id}\n` +
               `Produk: ${order.productTitle} (${order.licenseName || 'Standar'})\n` +
               `Total Bayar: Rp ${Number(order.amount).toLocaleString('id-ID')}\n` +
               `Profit (+35%): Rp ${Number(order.profit || 0).toLocaleString('id-ID')}\n` +
               `Status: LUNAS & RESMI AKTIF\n` +
               `Kredensial / Tautan Aktivasi: ${order.fulfillment?.licenseKey || order.fulfillment?.downloadUrl || '-'}\n` +
               `Waktu Lunas: ${new Date(order.completedAt || Date.now()).toLocaleString('id-ID')}`
    };

    return this._sendToIntake(payload, `Completed Order ${order.id}`);
  },

  /**
   * Alias backward compatibility
   */
  async syncOrderToOctoCrm(order) {
    return this.syncCompletedOrder(order);
  }
};

module.exports = octoCrmService;
