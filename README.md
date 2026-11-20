# EKE Digital - Live Mirroring Store & Auto-Fulfillment Hub

Platform e-commerce produk digital untuk **EKE Digital** yang meminjam katalog dan fulfillment secara real-time (live mirroring) dari `https://store.anfu.web.id/`, dilengkapi:
1. **Markup Otomatis 35%**: Seluruh produk yang di-mirror dari ANFU Store otomatis dinaikkan harganya sebesar 35% (pembulatan ratusan rupiah ke atas).
2. **Live Upstream Sync**: Setiap ada produk baru, perubahan harga modal, stok, atau deskripsi di ANFU Store, otomatis langsung sinkron di EKE Digital tanpa input manual.
3. **Integrasi Payment Gateway AutoGoPay (`autogopay.site`)**: Pembuatan QRIS dinamis instan dengan webhook listener HMAC-SHA256 & auto-poller tiap 3 detik.
4. **Seamless Auto-Fulfillment**: Saat customer selesai membayar QRIS di EKE Digital, server otomatis mengorder ke ANFU via saldo modal, menangkap kredensial akun/link aktivasi, dan menampilkannya seketika di layar customer.

---

## 🚀 Cara Menjalankan Project

### 1. Mode Development (Live Reload)
Jalankan frontend Vite (Port 3000) dan backend Express (Port 5001) secara bersamaan:
```bash
npm run dev
```
Buka browser di: `http://localhost:3000`

### 2. Mode Production
Build frontend dan jalankan server tunggal:
```bash
npm run build
npm run start
```
Buka browser di: `http://localhost:5001`

---

## ⚙️ Konfigurasi Environment & Admin Panel

File konfigurasi berada di `.env` dan juga dapat diatur langsung melalui **Admin Panel** di pojok kanan atas website (Ikon Gir Pengaturan):

```env
PORT=5001

# API Key AutoGoPay dari dashboard https://autogopay.site
AUTOGOPAY_API_KEY=your_autogopay_api_key_here
AUTOGOPAY_BASE_URL=https://v1-gateway.autogopay.site

# Token Akun ANFU Store Anda (JWT) untuk auto-debit saldo saat ada pesanan masuk
ANFU_TOKEN=your_anfu_jwt_token_here
ANFU_BASE_URL=https://api.anfu.web.id/api
```

> **Catatan Mode Testing / Demo**:
> Jika `AUTOGOPAY_API_KEY` dan `ANFU_TOKEN` masih dikosongkan, sistem otomatis berjalan dalam **Mode Simulasi Mandiri**, sehingga Anda tetap bisa mencoba alur checkout, melihat QRIS simulasi, dan mencoba tombol *Simulasikan Bayar* di Admin Panel untuk menguji halaman sukses kredensial.

---

## 🔗 Pengaturan Webhook AutoGoPay

Di dashboard **autogopay.site**:
1. Masuk ke menu **Pengaturan Webhook / Callback URL**.
2. Masukkan URL: `https://domain-anda.com/api/webhook/autogopay`
3. Event `transaction.received` akan otomatis diverifikasi menggunakan signature `X-Signature` HMAC-SHA256.

---

## 📁 Struktur Direktori

```
EKE-Digital/
├── server/
│   ├── index.js               # Express API & static server
│   ├── config.js              # Pengaturan toko & runtime config
│   ├── db.js                  # Persistent order & transaction storage
│   ├── services/
│   │   ├── anfuService.js     # Upstream mirroring, markup 35%, order dispatch
│   │   └── autogopayService.js# AutoGoPay QRIS dynamic & HMAC verification
│   └── data/
│       ├── orders.json        # Database pesanan
│       └── settings.json      # Pengaturan toko dinamis
├── src/
│   ├── components/            # Navbar, Hero, ProductCard, Modals (Checkout, Payment, Success, Admin)
│   ├── context/StoreContext   # Global store state & cart management
│   └── utils/formatters.js    # Rupiah formatter & credential parser (pipe, url, key)
└── dist/                      # Production build assets
```
