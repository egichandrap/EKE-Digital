const express = require('express');
const cors = require('cors');
const { PORT, getSettings } = require('./config');
const db = require('./db');
const anfuService = require('./services/anfuService');
const autogopayService = require('./services/autogopayService');
const octoCrmService = require('./services/octoCrmService');

const app = express();

// Middleware to capture rawBody for HMAC-SHA256 signature verification
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(cors());

// ==========================================
// 1. PUBLIC STORE ENDPOINTS
// ==========================================

// Get store info
app.get('/api/settings', (req, res) => {
  const settings = getSettings();
  res.json({
    success: true,
    data: {
      storeName: settings.storeName,
      tagline: settings.tagline,
      waNumber: settings.waNumber,
      markupPercent: settings.markupPercent,
    }
  });
});

// Get categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await anfuService.getCategories();
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get products (with live 35% markup applied)
app.get('/api/products', async (req, res) => {
  try {
    const force = req.query.refresh === 'true';
    let products = await anfuService.getProducts(force);

    // Optional category filter
    if (req.query.category && req.query.category !== 'all') {
      products = products.filter(p => p.category === req.query.category);
    }

    // Optional search filter
    if (req.query.search) {
      const q = req.query.search.toLowerCase();
      products = products.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.subtitle && p.subtitle.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    res.json({
      success: true,
      message: 'Daftar produk EKE Digital berhasil dimuat',
      count: products.length,
      data: products
    });
  } catch (err) {
    console.error('Error in /api/products:', err);
    res.status(500).json({ success: false, message: 'Gagal memuat produk dari server upstream', error: err.message });
  }
});

// Get single product detail
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await anfuService.getProductById(req.params.id);
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
});

// ==========================================
// 2. ORDER & CHECKOUT ENDPOINTS
// ==========================================

// Create new order & generate AutoGoPay QRIS
app.post('/api/orders', async (req, res) => {
  try {
    const { productId, licenseType = 'personal', buyerName, whatsapp, email } = req.body;

    if (!buyerName || !buyerName.trim()) {
      return res.status(400).json({ success: false, message: 'Nama pembeli wajib diisi' });
    }
    if (!whatsapp || !whatsapp.trim()) {
      return res.status(400).json({ success: false, message: 'Nomor WhatsApp wajib diisi' });
    }
    if (!productId) {
      return res.status(400).json({ success: false, message: 'Produk digital wajib dipilih' });
    }

    // 1. Fetch live product from upstream to verify price & availability
    const product = await anfuService.getProductById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }

    // 2. Determine final price (marked up)
    const selectedLicense = product.licenseOptions?.[licenseType] || product.licenseOptions?.personal;
    const finalAmount = selectedLicense ? selectedLicense.price : product.price;
    const costAmount = selectedLicense?.costPrice || product.costPrice || product.price;

    const orderId = `EKE-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    // 3. Generate QRIS via AutoGoPay
    console.log(`[Order Creation] Menghasilkan QRIS AutoGoPay untuk ${orderId} nominal Rp ${finalAmount}...`);
    const qrisData = await autogopayService.generateQRIS(finalAmount, orderId);

    // 4. Save order to local database
    const newOrder = {
      id: orderId,
      productId: product.id,
      productTitle: product.title,
      productImage: product.image,
      licenseType,
      licenseName: selectedLicense?.name || 'Lisensi Standar',
      deliveryType: product.deliveryType || 'download',
      instructions: product.instructions || [],
      buyerName: buyerName.trim(),
      whatsapp: whatsapp.trim(),
      email: (email || '').trim(),
      amount: finalAmount,
      costAmount,
      profit: finalAmount - costAmount,
      status: 'pending', // pending, paid, completed, expired, cancelled
      paymentMethod: 'qris_autogopay',
      autogopayTransactionId: qrisData.transaction_id,
      autogopayOrderId: qrisData.order_id,
      qrString: qrisData.qr_string,
      qrUrl: qrisData.qr_url,
      checkoutUrl: qrisData.checkout_url,
      expiryTime: qrisData.expiry_time,
      isSimulated: Boolean(qrisData.isSimulated),
      // Fulfillment data (populated after payment)
      fulfillment: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.createOrder(newOrder);

    // Sync pending order to OCTO-CRM in background for follow-up reminder
    octoCrmService.syncPendingCheckout(newOrder).then(result => {
      if (result.success && result.data) {
        db.updateOrder(newOrder.id, { octoCrmLead: result.data });
      }
    }).catch(err => {
      console.warn('[OCTO-CRM] Pending sync error:', err.message);
    });

    res.json({
      success: true,
      message: 'Pesanan berhasil dibuat. Silakan selesaikan pembayaran QRIS.',
      data: newOrder,
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ success: false, message: err.message || 'Gagal memproses pesanan' });
  }
});

// Check order status & trigger fulfillment if paid
app.post('/api/orders/:id/check-payment', async (req, res) => {
  try {
    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan' });
    }

    if (order.status === 'completed' || order.status === 'paid') {
      return res.json({ success: true, message: 'Pesanan sudah lunas', data: order });
    }

    // Check with AutoGoPay
    let isPaid = false;
    if (order.autogopayTransactionId) {
      const qrisStatus = await autogopayService.checkQRISStatus(order.autogopayTransactionId);
      console.log(`[AutoGoPay Poll] Status ${order.id}:`, qrisStatus.status);
      if (qrisStatus.status === 'settlement' || qrisStatus.status === 'success' || qrisStatus.paid) {
        isPaid = true;
      }
    }

    if (!isPaid) {
      return res.json({
        success: false,
        message: 'Pembayaran belum terdeteksi. Silakan scan QRIS terlebih dahulu.',
        data: order
      });
    }

    // Order is confirmed PAID! Execute auto-fulfillment to ANFU!
    await executeFulfillment(order);

    const updated = db.getOrderById(order.id);
    res.json({
      success: true,
      message: 'Pembayaran berhasil dikonfirmasi! Akses digital telah aktif.',
      data: updated
    });
  } catch (err) {
    console.error('Error checking payment:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get order details
app.get('/api/orders/:id', (req, res) => {
  const order = db.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan' });
  }
  res.json({ success: true, data: order });
});

// Search order by WhatsApp or email
app.get('/api/orders/search/:contact', (req, res) => {
  const orders = db.findOrdersByContact(req.params.contact);
  res.json({ success: true, count: orders.length, data: orders });
});

// ==========================================
// 3. AUTOGOPAY WEBHOOK CALLBACK
// ==========================================

app.post('/api/webhook/autogopay', async (req, res) => {
  try {
    const signature = req.headers['x-signature'];
    const event = req.headers['x-callback-event'] || req.body?.event;

    console.log('[AutoGoPay Webhook Received]', { event, body: req.body });

    // Verify HMAC-SHA256 signature
    const isValid = autogopayService.verifySignature(req.rawBody, signature);
    const settings = getSettings();

    // If API key is set, strictly enforce signature
    if (settings.autogopayApiKey && !isValid) {
      console.warn('[AutoGoPay Webhook] Signature TIDAK COCOK. Request ditolak.');
      return res.status(401).json({ success: false, message: 'Invalid signature' });
    }

    const tx = req.body?.transaction || req.body?.data;
    if (!tx) {
      return res.status(400).json({ success: false, message: 'Payload transaction tidak ditemukan' });
    }

    const transactionId = tx.transaction_id;
    const orderId = tx.order_id;
    const status = tx.status; // 'PAID' or 'settlement'

    // Find local order
    const order = db.getOrderById(orderId) || db.getOrderById(transactionId);
    if (!order) {
      console.warn(`[AutoGoPay Webhook] Order tidak ditemukan untuk ${orderId} / ${transactionId}`);
      return res.json({ success: true, message: 'Order ignored (not found locally)' });
    }

    if (status === 'PAID' || status === 'settlement') {
      console.log(`[AutoGoPay Webhook] Order ${order.id} TERBAYAR LUNAS! Memulai fulfillment otomatis...`);
      await executeFulfillment(order);
    }

    res.json({ success: true, message: 'Webhook processed successfully' });
  } catch (err) {
    console.error('Webhook processing error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * Helper function to trigger ANFU fulfillment and store credentials
 */
async function executeFulfillment(order) {
  try {
    db.updateOrder(order.id, { status: 'paid', paidAt: new Date().toISOString() });

    console.log(`[Fulfillment] Mengorder ke ANFU Store untuk pesanan ${order.id}...`);
    const anfuResult = await anfuService.checkoutToAnfu({
      productId: order.productId,
      licenseType: order.licenseType,
      buyerName: order.buyerName,
      whatsapp: order.whatsapp,
      email: order.email,
    });

    console.log(`[Fulfillment] Berhasil mendapatkan respon dari ANFU:`, anfuResult);

    // Save credentials to order
    db.updateOrder(order.id, {
      status: 'completed',
      anfuOrderId: anfuResult.id || null,
      fulfillment: {
        licenseKey: anfuResult.supplierDeliveredKey || anfuResult.licenseKey || null,
        downloadUrl: anfuResult.downloadUrl || null,
        credentialEmail: anfuResult.credentialEmail || null,
        credentialPassword: anfuResult.credentialPassword || null,
        credentialNotes: anfuResult.credentialNotes || null,
        instructions: anfuResult.instructions || order.instructions || null,
        fullData: anfuResult,
      },
      completedAt: new Date().toISOString(),
    });

    console.log(`[Fulfillment] Pesanan ${order.id} SELESAI & LENGKAP.`);

    // 3. Sync to OCTO-CRM as completed order
    const completedOrder = db.getOrderById(order.id);
    octoCrmService.syncCompletedOrder(completedOrder).catch(err => {
      console.warn('[OCTO-CRM] Background sync error:', err.message);
    });
  } catch (err) {
    console.error(`[Fulfillment Error] Gagal memproses fulfillment ke ANFU:`, err);
    db.updateOrder(order.id, {
      status: 'paid',
      fulfillmentError: err.message,
    });
  }
}

// ==========================================
// 4. PRODUCTION STATIC FILES
// ==========================================
const path = require('path');
const fs = require('fs');
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start Express Server (only if run directly, not on Vercel serverless)
if (!process.env.VERCEL && require.main === module) {
  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`🚀 EKE Digital Backend Server Aktif di Port ${PORT}`);
    console.log(`🔗 Mirroring Upstream: https://api.anfu.web.id/api`);
    console.log(`💳 Payment Gateway: AutoGoPay (https://v1-gateway.autogopay.site)`);
    console.log(`📈 Auto Markup: 35% on all products`);
    console.log(`===============================================`);
  });
}

module.exports = app;
