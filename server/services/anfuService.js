const { getSettings } = require('../config');

// In-memory cache for fast response, invalidated every 30 seconds
let productsCache = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 30000; // 30 seconds ensures live mirroring of any new ANFU products

/**
 * Apply 35% markup to price and round up to hundreds (e.g. 24000 -> 32400)
 */
function applyMarkup(price, percent = 35) {
  if (!price || typeof price !== 'number' || isNaN(price)) return price;
  const marked = price * (1 + percent / 100);
  return Math.ceil(marked / 100) * 100;
}

/**
 * Transform ANFU product to EKE Digital product with 35% markup applied
 */
function transformProduct(p, markupPercent) {
  const originalPrice = p.originalPrice ? applyMarkup(p.originalPrice, markupPercent) : null;
  const markedUpPrice = applyMarkup(p.price, markupPercent);

  // Transform license options
  const licenseOptions = {};
  if (p.licenseOptions) {
    for (const [key, val] of Object.entries(p.licenseOptions)) {
      licenseOptions[key] = {
        ...val,
        price: applyMarkup(val.price, markupPercent),
        costPrice: val.price, // Keep original as cost price
      };
    }
  }

  return {
    ...p,
    costPrice: p.price, // ANFU modal price
    price: markedUpPrice,
    originalPrice: originalPrice || Math.round(markedUpPrice * 1.5),
    licenseOptions: Object.keys(licenseOptions).length > 0 ? licenseOptions : {
      personal: { name: 'Lisensi Standar', price: markedUpPrice, description: 'Penggunaan penuh untuk produk digital ini.' },
      agency: { name: 'Lisensi Komersial', price: markedUpPrice, description: 'Penggunaan penuh untuk produk digital ini.' }
    },
    // Keep reference to ANFU ID
    anfuProductId: p.id,
  };
}

const anfuService = {
  /**
   * Fetch all products live from ANFU API with automatic 35% markup
   */
  async getProducts(forceRefresh = false) {
    const settings = getSettings();
    const now = Date.now();

    if (!forceRefresh && productsCache && (now - lastCacheTime < CACHE_TTL_MS)) {
      return productsCache;
    }

    try {
      const res = await fetch(`${settings.anfuBaseUrl}/products`);
      if (!res.ok) {
        throw new Error(`ANFU API error: ${res.status} ${res.statusText}`);
      }
      const json = await res.json();
      if (!json.success || !Array.isArray(json.data)) {
        throw new Error(json.message || 'Gagal memuat produk dari ANFU');
      }

      const markupPercent = settings.markupPercent || 35;
      const transformed = json.data.map(p => transformProduct(p, markupPercent));

      productsCache = transformed;
      lastCacheTime = now;
      return transformed;
    } catch (err) {
      console.error('Error fetching ANFU products:', err.message);
      // Fallback to cache if available
      if (productsCache) return productsCache;
      throw err;
    }
  },

  /**
   * Fetch single product detail
   */
  async getProductById(id) {
    const settings = getSettings();
    const markupPercent = settings.markupPercent || 35;

    try {
      const res = await fetch(`${settings.anfuBaseUrl}/products/${id}`);
      if (!res.ok) {
        throw new Error(`Product not found on ANFU: ${id}`);
      }
      const json = await res.json();
      if (!json.success || !json.data) {
        throw new Error(json.message || 'Detail produk tidak ditemukan');
      }
      return transformProduct(json.data, markupPercent);
    } catch (err) {
      console.error(`Error fetching ANFU product ${id}:`, err.message);
      // Fallback to searching in cache
      const cached = (productsCache || []).find(p => p.id === id);
      if (cached) return cached;
      throw err;
    }
  },

  /**
   * Fetch categories from ANFU
   */
  async getCategories() {
    const settings = getSettings();
    try {
      const res = await fetch(`${settings.anfuBaseUrl}/categories`);
      if (!res.ok) throw new Error('Failed to fetch categories');
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      console.warn('Fallback to standard categories:', err.message);
      return [
        { id: "all", label: "Semua", icon: "widgets" },
        { id: "ai", label: "AI & ChatGPT Prompt", icon: "psychology" },
        { id: "entertainment", label: "Entertainment", icon: "smart_display" },
        { id: "notion", label: "Notion & Workspace", icon: "folder_special" },
        { id: "canva", label: "Canva & Design Kit", icon: "palette" },
        { id: "excel", label: "Excel & Finance Sheets", icon: "table_chart" },
        { id: "code", label: "Website Code & Script", icon: "code" },
        { id: "ebook", label: "E-Book & Panduan", icon: "menu_book" }
      ];
    }
  },

  /**
   * Seamlessly checkout order to ANFU using Saldo account
   */
  async checkoutToAnfu({ productId, licenseType, buyerName, whatsapp, email }) {
    const settings = getSettings();
    if (!settings.anfuToken) {
      console.warn('ANFU_TOKEN belum dikonfigurasi. Simulasi pemesanan ANFU.');
      return {
        simulated: true,
        message: 'Order dicatat. Harap isi ANFU_TOKEN di pengaturan untuk auto-debit saldo ANFU.',
        status: 'paid',
        licenseKey: `EKE-${Date.now().toString(36).toUpperCase()}-STANDALONE`,
        downloadUrl: `https://drive.google.com/drive/folders/eke-digital-access`,
      };
    }

    const payload = {
      productId,
      licenseType: licenseType || 'personal',
      buyerName,
      whatsapp,
      email,
      paymentMethod: 'saldo',
    };

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${settings.anfuToken.trim()}`,
    };

    console.log(`[ANFU Dispatch] Mengirim order ke ANFU API untuk produk ${productId}...`);
    const res = await fetch(`${settings.anfuBaseUrl}/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(`Gagal checkout ke ANFU: ${json.message || json.error || res.statusText}`);
    }

    console.log('[ANFU Dispatch] Sukses! Hasil order ANFU:', json.data?.id);
    return json.data;
  }
};

module.exports = anfuService;
