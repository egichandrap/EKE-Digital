const { getSettings } = require('../config');

/**
 * Service to sync customer data, orders, and deals from EKE Digital to OCTO-CRM
 * Connects directly to OCTO-CRM Public Ecosystem Inbound Engine (lead-intake)
 * Base URL: https://octo-crm-production-7dcfef0d.up.railway.app
 * Workspace ID: 0c700000-0000-0000-0000-000000000000
 */
const octoCrmService = {
  /**
   * Sync completed order to OCTO-CRM as Contact + Deal
   */
  async syncOrderToOctoCrm(order) {
    const settings = getSettings();
    const baseUrl = (settings.octoCrmUrl || process.env.OCTO_CRM_URL || 'https://octo-crm-production-7dcfef0d.up.railway.app').replace(/\/+$/, '');
    const workspaceId = settings.octoCrmWorkspaceId || process.env.OCTO_CRM_WORKSPACE_ID || '0c700000-0000-0000-0000-000000000000';
    const apiKey = settings.octoCrmApiKey || process.env.OCTO_CRM_API_KEY || '';

    console.log(`[OCTO-CRM Sync] Menyinkronkan pesanan ${order.id} ke OCTO-CRM (${baseUrl})...`);

    // 1. Primary method: Use OCTO-CRM Inbound Lead & Order Intake Endpoint
    // This endpoint is part of the master OCTO Ecosystem and does NOT require complex JWT tokens!
    try {
      const intakePayload = {
        full_name: order.buyerName || 'Customer EKE Digital',
        phone: order.whatsapp,
        email: order.email || undefined,
        product_interest: `EKE Digital: ${order.productTitle}`,
        form_type: 'ecommerce_checkout',
        lead_source: 'EKE-Digital',
        estimated_value: Number(order.amount),
        consent_given: true,
        message: `Order ID: ${order.id}\nProduk: ${order.productTitle} (${order.licenseName || 'Standar'})\nTotal Bayar: Rp ${order.amount?.toLocaleString('id-ID')}\nProfit Bersih (+35%): Rp ${order.profit?.toLocaleString('id-ID')}\nStatus: LUNAS & AKTIF\nKredensial/Akses: ${order.fulfillment?.licenseKey || order.fulfillment?.downloadUrl || '-'}`
      };

      const headers = {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'Authorization': `Bearer ${apiKey.trim()}` } : {})
      };

      const endpoint = `${baseUrl}/api/v1/workspaces/${workspaceId}/integrations/lead-intake`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(intakePayload)
      });

      const json = await res.json();
      if (res.ok && json.success) {
        console.log(`[OCTO-CRM Sync] SUKSES! Kontak & Deal ${order.id} berhasil dicatat di OCTO-CRM:`, json.data);
        return { success: true, data: json.data };
      } else {
        console.warn(`[OCTO-CRM Sync] Response error dari OCTO-CRM:`, json.error || json.message);
      }
    } catch (err) {
      console.error('[OCTO-CRM Sync Error] Gagal menghubungi OCTO-CRM API:', err.message);
    }

    return { success: false };
  }
};

module.exports = octoCrmService;
