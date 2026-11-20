/**
 * Format number to Indonesian Rupiah string
 * @param {number} num
 * @returns {string} e.g. "Rp 32.400"
 */
export function formatRupiah(num) {
  if (num === null || num === undefined || isNaN(num)) return 'Rp 0';
  return 'Rp ' + Number(num).toLocaleString('id-ID');
}

/**
 * Format date string
 */
export function formatDate(isoStr) {
  if (!isoStr) return '-';
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return isoStr;
  }
}

/**
 * Parses delivered credentials / license strings from ANFU fulfillment
 * Handles Pipe format (email|password|pin|link), URL format, and Serial key format
 */
export function parseDeliverables(fulfillment) {
  if (!fulfillment) {
    return {
      raw: '',
      hasRaw: false,
      attributes: [],
      primaryUrl: '',
      isPipeFormat: false,
      isUrlFormat: false,
      isKeyFormat: false,
      displayText: ''
    };
  }

  const rawKey = (
    fulfillment.licenseKey ||
    fulfillment.supplierDeliveredKey ||
    fulfillment.downloadUrl ||
    ''
  ).trim();

  const attributes = [];
  let primaryUrl = fulfillment.downloadUrl || '';

  // 1. If it's a URL directly
  if (rawKey.startsWith('http://') || rawKey.startsWith('https://')) {
    primaryUrl = rawKey;
    attributes.push({
      id: 'url',
      label: 'Tautan Akses / Aktivasi Resmi',
      value: rawKey,
      isUrl: true,
    });
    return {
      raw: rawKey,
      hasRaw: true,
      attributes,
      primaryUrl,
      isPipeFormat: false,
      isUrlFormat: true,
      isKeyFormat: false,
      displayText: rawKey,
    };
  }

  // 2. If it's a Pipe-delimited credential (e.g. "email: ... | pass: ... | pin: ...")
  if (rawKey.includes('|')) {
    const parts = rawKey.split('|').map(s => s.trim()).filter(Boolean);
    parts.forEach((seg, idx) => {
      if (seg.includes(':') && !seg.startsWith('http://') && !seg.startsWith('https://')) {
        const colonIdx = seg.indexOf(':');
        const label = seg.substring(0, colonIdx).trim();
        const value = seg.substring(colonIdx + 1).trim();
        const isUrl = value.startsWith('http://') || value.startsWith('https://');
        if (isUrl && !primaryUrl) primaryUrl = value;
        const isSensitive = /pin|pass|pwd|password|secret/i.test(label);
        attributes.push({
          id: `seg-${idx}`,
          label,
          value,
          isUrl,
          isSensitive,
        });
      } else if (seg.includes('@')) {
        attributes.push({
          id: `seg-${idx}`,
          label: 'Email / Username Akun',
          value: seg,
          isSensitive: false,
        });
      } else if (seg.toLowerCase().startsWith('http://') || seg.toLowerCase().startsWith('https://')) {
        if (!primaryUrl) primaryUrl = seg;
        attributes.push({
          id: `seg-${idx}`,
          label: 'Tautan Masuk / Akses',
          value: seg,
          isUrl: true,
        });
      } else if (idx === 1 && !attributes.some(a => a.id === 'seg-1')) {
        attributes.push({
          id: `seg-${idx}`,
          label: 'Password / Kode Masuk',
          value: seg,
          isSensitive: true,
        });
      } else {
        attributes.push({
          id: `seg-${idx}`,
          label: `Detail Akun #${idx + 1}`,
          value: seg,
          isSensitive: false,
        });
      }
    });

    return {
      raw: rawKey,
      hasRaw: true,
      attributes,
      primaryUrl,
      isPipeFormat: true,
      isUrlFormat: Boolean(primaryUrl),
      isKeyFormat: false,
      displayText: rawKey,
    };
  }

  // 3. Fallback: Serial Key or Plain text
  if (rawKey) {
    attributes.push({
      id: 'license-key',
      label: 'Kunci Lisensi / Serial Key',
      value: rawKey,
      isSensitive: false,
    });
    return {
      raw: rawKey,
      hasRaw: true,
      attributes,
      primaryUrl,
      isPipeFormat: false,
      isUrlFormat: false,
      isKeyFormat: true,
      displayText: rawKey,
    };
  }

  return {
    raw: '',
    hasRaw: false,
    attributes,
    primaryUrl,
    isPipeFormat: false,
    isUrlFormat: false,
    isKeyFormat: false,
    displayText: ''
  };
}
