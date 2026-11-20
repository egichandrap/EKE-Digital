const { getSettings } = require('../config');

/**
 * Service to sync customer data, orders, and deals from EKE Digital to OCTO-CRM
 */
const octoCrmService = {
  /**
   * Sync completed order to OCTO-CRM as Contact + Deal + Follow-up Task
   */
  async syncOrderToOctoCrm(order) {
    const settings = getSettings();
    const baseUrl = (settings.octoCrmUrl || process.env.OCTO_CRM_URL || '').replace(/\/+$/, '');
    const apiKey = settings.octoCrmApiKey || process.env.OCTO_CRM_API_KEY || '';
    const workspaceId = settings.octoCrmWorkspaceId || process.env.OCTO_CRM_WORKSPACE_ID || 'ws-default';

    if (!baseUrl) {
      console.log('[OCTO-CRM Sync] OCTO_CRM_URL belum dikonfigurasi. Data pesanan disimpan lokal di EKE Digital.');
      return { skipped: true, reason: 'OCTO_CRM_URL not set' };
    }

    try {
      console.log(`[OCTO-CRM Sync] Menyinkronkan pesanan ${order.id} ke OCTO-CRM (${baseUrl})...`);

      const headers = {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'Authorization': `Bearer ${apiKey.trim()}` } : {})
      };

      // 1. Sync Contact to OCTO-CRM
      const names = (order.buyerName || 'Customer EKE').trim().split(' ');
      const firstName = names[0];
      const lastName = names.slice(1).join(' ') || '';

      const contactPayload = {
        first_name: firstName,
        last_name: lastName,
        phone: order.whatsapp,
        email: order.email || undefined,
        lead_source: 'EKE-Digital',
        consent_status: 'opted_in',
        notes: `Customer EKE Digital - Terakhir beli: ${order.productTitle} (${order.id})`,
      };

      let contactId = null;
      try {
        const contactRes = await fetch(`${baseUrl}/api/v1/workspaces/${workspaceId}/contacts`, {
          method: 'POST',
          headers,
          body: JSON.stringify(contactPayload),
        });
        const contactJson = await contactRes.json();
        if (contactRes.ok && contactJson.data?.id) {
          contactId = contactJson.data.id;
        }
      } catch (err) {
        console.warn('[OCTO-CRM Sync] Gagal simpan contact:', err.message);
      }

      // 2. Sync Deal to OCTO-CRM
      const dealPayload = {
        title: `EKE Digital: ${order.productTitle} (${order.id})`,
        value: order.amount,
        currency: 'IDR',
        stage: 'closed_won', // Deal berhasil / lunas
        contact_id: contactId || undefined,
        source: 'EKE-Digital Store',
        description: `No. Order: ${order.id}\nProduk: ${order.productTitle}\nTotal: Rp ${order.amount}\nProfit Margin: Rp ${order.profit}\nStatus: ${order.status.toUpperCase()}`,
        custom_fields: {
          eke_order_id: order.id,
          profit_margin: order.profit,
          fulfillment_status: order.status,
          deliverables: order.fulfillment?.licenseKey || order.fulfillment?.downloadUrl || '',
        }
      };

      const dealRes = await fetch(`${baseUrl}/api/v1/workspaces/${workspaceId}/deals`, {
        method: 'POST',
        headers,
        body: JSON.stringify(dealPayload),
      });

      const dealJson = await dealRes.json();
      console.log('[OCTO-CRM Sync] Deal berhasil dibuat di OCTO-CRM:', dealJson.data?.id || 'OK');

      return {
        success: true,
        contactId,
        dealId: dealJson.data?.id || null,
      };
    } catch (err) {
      console.error('[OCTO-CRM Sync Error] Gagal menyinkronkan ke OCTO-CRM:', err.message);
      return { success: false, error: err.message };
    }
  }
};

module.exports = octoCrmService;
