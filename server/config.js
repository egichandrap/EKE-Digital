const fs = require('fs');
const path = require('path');
require('dotenv').config();

const DATA_DIR = process.env.VERCEL ? '/tmp' : path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

const defaultSettings = {
  storeName: 'EKE Digital',
  tagline: 'Pusat Produk Digital & Lisensi Terpercaya #1',
  waNumber: '6289604236160',
  markupPercent: 35, // 35% markup on all products
  anfuBaseUrl: 'https://api.anfu.web.id/api',
  anfuToken: process.env.ANFU_TOKEN || '',
  autogopayBaseUrl: 'https://v1-gateway.autogopay.site',
  autogopayApiKey: process.env.AUTOGOPAY_API_KEY || '',
  autoFulfillToAnfu: true,
  simulatePaymentMode: false, // Set to true if testing without real AutoGoPay funds
  // OCTO-CRM Integration
  octoCrmUrl: process.env.OCTO_CRM_URL || '', // e.g. http://localhost:8080 or https://api-crm.octo.id
  octoCrmApiKey: process.env.OCTO_CRM_API_KEY || '',
  octoCrmWorkspaceId: process.env.OCTO_CRM_WORKSPACE_ID || 'ws-default',
  enableOctoCrmSync: true,
};

function getSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = fs.parse ? fs.parse : JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
      return { ...defaultSettings, ...data };
    }
  } catch (err) {
    console.error('Error reading settings.json:', err);
  }
  return { ...defaultSettings };
}

function updateSettings(newSettings) {
  const current = getSettings();
  const updated = { ...current, ...newSettings };
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  return updated;
}

module.exports = {
  PORT: process.env.PORT || 5001,
  DATA_DIR,
  getSettings,
  updateSettings,
};
