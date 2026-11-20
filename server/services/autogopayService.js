const crypto = require('crypto');
const { getSettings } = require('../config');

const autogopayService = {
  /**
   * Generate QRIS dynamic via AutoGoPay
   * @param {number} amount In IDR
   * @param {string} orderId Local order identifier
   */
  async generateQRIS(amount, orderId) {
    const settings = getSettings();
    const apiKey = settings.autogopayApiKey;

    if (!apiKey) {
      console.warn('AUTOGOPAY_API_KEY belum dikonfigurasi. Menghasilkan QRIS simulasi untuk testing.');
      return {
        isSimulated: true,
        transaction_id: `SIM-${Date.now()}`,
        order_id: orderId || `AUTOGOPAY-${Date.now()}`,
        amount,
        transaction_status: 'pending',
        qr_string: '00020101021226610014COM.GO-JEK.WWW011893600914389069123402150000000000000005102000200005204581253033605405100005802ID5911EKE DIGITAL6007JAKARTA61051234062070703A016304',
        qr_url: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=4&data=SIMULASI-QRIS-${orderId}`,
        checkout_url: `https://autogopay.site/pay/simulated-${orderId}`,
        expiry_time: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      };
    }

    try {
      const res = await fetch(`${settings.autogopayBaseUrl}/qris/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || `Gagal generate QRIS dari AutoGoPay (HTTP ${res.status})`);
      }

      return json.data;
    } catch (err) {
      console.error('Error generating QRIS via AutoGoPay:', err.message);
      throw err;
    }
  },

  /**
   * Check status of QRIS transaction
   */
  async checkQRISStatus(transactionId) {
    const settings = getSettings();
    const apiKey = settings.autogopayApiKey;

    if (!apiKey || transactionId.startsWith('SIM-')) {
      // In simulation mode, return pending or settlement
      return {
        transaction_id: transactionId,
        status: settings.simulatePaymentMode ? 'settlement' : 'pending',
      };
    }

    try {
      const res = await fetch(`${settings.autogopayBaseUrl}/qris/status`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transaction_id: transactionId }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || `Gagal cek status AutoGoPay (HTTP ${res.status})`);
      }

      return json.data || json;
    } catch (err) {
      console.error('Error checking QRIS status:', err.message);
      throw err;
    }
  },

  /**
   * Verify HMAC-SHA256 signature from AutoGoPay webhook
   */
  verifySignature(rawBody, incomingSignature) {
    const settings = getSettings();
    const apiKey = settings.autogopayApiKey;

    if (!apiKey) return false;
    if (!incomingSignature) return false;

    try {
      const expected = crypto.createHmac('sha256', apiKey.trim())
        .update(rawBody)
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(expected, 'hex'),
        Buffer.from(incomingSignature, 'hex')
      );
    } catch (err) {
      console.error('Signature verification error:', err.message);
      return false;
    }
  }
};

module.exports = autogopayService;
