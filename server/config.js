require('dotenv').config();

const config = {
  PORT: process.env.PORT || 5001,
  storeName: process.env.STORE_NAME || 'EKE Digital',
  tagline: process.env.STORE_TAGLINE || 'Pusat Produk Digital & Lisensi Terpercaya #1',
  waNumber: process.env.WA_NUMBER || '6289604236160',
  markupPercent: Number(process.env.MARKUP_PERCENT) || 35, // 35% markup on all products
  anfuBaseUrl: (process.env.ANFU_BASE_URL || 'https://api.anfu.web.id/api').replace(/\/+$/, ''),
  anfuToken: process.env.ANFU_TOKEN || '',
  autogopayBaseUrl: (process.env.AUTOGOPAY_BASE_URL || 'https://v1-gateway.autogopay.site').replace(/\/+$/, ''),
  autogopayApiKey: process.env.AUTOGOPAY_API_KEY || '',
  autoFulfillToAnfu: true,
  simulatePaymentMode: process.env.SIMULATE_PAYMENT === 'true',
  octoCrmUrl: (process.env.OCTO_CRM_URL || 'https://octo-crm-production-7dcfef0d.up.railway.app').replace(/\/+$/, ''),
  octoCrmWorkspaceId: process.env.OCTO_CRM_WORKSPACE_ID || '0c700000-0000-0000-0000-000000000000',
  octoCrmApiKey: process.env.OCTO_CRM_API_KEY || '',
};

function getSettings() {
  return { ...config };
}

module.exports = {
  PORT: config.PORT,
  getSettings,
};
