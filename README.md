# 📱 Presensi Online - QR Code Scanner

Aplikasi presensi online berbasis web dengan fitur scan QR Code yang terintegrasi dengan Google Spreadsheet untuk mencatat kehadiran muda-mudi.

## ✨ Fitur Utama

- **QR Code Scanner**: Scan QR Code untuk presensi menggunakan kamera device
- **Autentikasi Sederhana**: Input nama dan pilihan kelompok muda-mudi
- **Integrasi Google Spreadsheet**: Data presensi otomatis tersimpan ke Google Sheets
- **Dashboard Admin**: Monitoring data presensi real-time dengan filter dan export
- **Responsive Design**: Interface yang responsif untuk desktop dan mobile
- **Real-time Updates**: Auto-refresh data setiap 30 detik

## 🛠️ Teknologi yang Digunakan

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **QR Scanner**: html5-qrcode library
- **Backend**: Google Apps Script
- **Database**: Google Spreadsheet
- **Styling**: Custom CSS dengan gradient dan animations

## 📋 Struktur File

```
Presensi-QR-Code/
├── index.html              # Halaman utama presensi
├── admin.html              # Dashboard admin
├── styles.css              # CSS untuk halaman utama
├── admin-styles.css        # CSS untuk dashboard admin
├── script.js               # JavaScript untuk presensi
├── admin-script.js         # JavaScript untuk admin
├── google-apps-script.js   # Kode Google Apps Script
└── README.md               # Dokumentasi
```

## 🚀 Cara Setup

### 1. Setup Google Spreadsheet

1. Buat Google Spreadsheet baru di [Google Sheets](https://sheets.google.com)
2. Copy ID spreadsheet dari URL (bagian antara `/d/` dan `/edit`)
3. Buka [Google Apps Script](https://script.google.com)
4. Buat project baru
5. Copy seluruh isi file `google-apps-script.js` ke editor
6. Ganti `YOUR_SPREADSHEET_ID_HERE` dengan ID spreadsheet Anda
7. Deploy sebagai web app:
   - Klik "Deploy" → "New deployment"
   - Pilih "Web app"
   - Set "Execute as" ke "Me"
   - Set "Who has access" ke "Anyone"
   - Klik "Deploy"
8. Copy URL deployment yang diberikan

### 2. Setup Website

1. Download semua file ke folder lokal
2. Edit file `script.js`:
   - Ganti `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` dengan URL deployment Google Apps Script
3. Edit file `admin-script.js`:
   - Ganti `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` dengan URL deployment Google Apps Script
4. Upload file ke web server atau gunakan local server

### 3. Setup Google Apps Script (Opsional)

Jalankan fungsi setup di Google Apps Script Editor:

```javascript
// Jalankan fungsi ini sekali untuk setup spreadsheet
setupSpreadsheet()

// Jalankan untuk membuat trigger auto-cleanup
createCleanupTrigger()
```

## 📱 Cara Penggunaan

### Untuk Peserta Presensi

1. Buka website di browser (pastikan HTTPS untuk akses kamera)
2. Klik "Mulai Scan" untuk mengaktifkan kamera
3. Arahkan kamera ke QR Code yang disediakan
4. Setelah QR Code terdeteksi, isi form:
   - Nama lengkap
   - Pilihan kelompok
5. Klik "Kirim Presensi"
6. Data akan otomatis tersimpan ke Google Spreadsheet

### Untuk Admin

1. Buka halaman admin (`admin.html`)
2. Dashboard akan menampilkan:
   - Statistik total presensi
   - Presensi hari ini
   - Kelompok dengan presensi terbanyak
   - Data presensi dalam tabel
3. Gunakan filter untuk melihat data tertentu:
   - Filter berdasarkan kelompok
   - Filter berdasarkan tanggal
4. Klik "Export Excel" untuk download data dalam format CSV
5. Data auto-refresh setiap 30 detik

## 🔧 Konfigurasi

### Mengubah Kelompok

Edit file `index.html` dan `admin.html`, bagian `<select>` untuk mengubah opsi kelompok:

```html
<select id="kelompok" name="kelompok" required>
    <option value="">Pilih kelompok</option>
    <option value="Muda-mudi A">Muda-mudi A</option>
    <option value="Muda-mudi B">Muda-mudi B</option>
    <!-- Tambah atau ubah opsi di sini -->
</select>
```

### Mengubah Styling

Edit file CSS untuk mengubah tampilan:
- `styles.css` untuk halaman utama
- `admin-styles.css` untuk dashboard admin

### Mengubah Konfigurasi QR Scanner

Edit file `script.js`, bagian `startQRScanner()`:

```javascript
const config = {
    fps: 10,                    // Frame per second
    qrbox: { width: 250, height: 250 },  // Ukuran area scan
    aspectRatio: 1.0            // Aspect ratio kamera
};
```

## 🔒 Keamanan

- Website harus diakses via HTTPS untuk menggunakan kamera
- Google Apps Script memiliki rate limiting
- Data tersimpan aman di Google Spreadsheet
- Tidak ada data sensitif yang disimpan

## 🐛 Troubleshooting

### Kamera Tidak Berfungsi
- Pastikan website diakses via HTTPS
- Izinkan akses kamera di browser
- Coba refresh halaman

### Data Tidak Tersimpan
- Periksa URL Google Apps Script di `script.js`
- Pastikan Google Apps Script sudah di-deploy
- Cek console browser untuk error

### QR Code Tidak Terdeteksi
- Pastikan QR Code jelas dan tidak rusak
- Coba scan dari jarak yang berbeda
- Pastikan pencahayaan cukup

## 📊 Format Data Spreadsheet

Data akan tersimpan dengan format:

| ID | Timestamp | Nama | Kelompok | QR Code | User Agent |
|----|-----------|------|----------|---------|------------|
| 1234567890 | 01/01/2024 10:30:00 | John Doe | Muda-mudi A | PRESENSI_ABC123 | Mozilla/5.0... |

## 🔄 Auto-Cleanup

Aplikasi memiliki fitur auto-cleanup yang akan menghapus data presensi lebih dari 30 hari secara otomatis. Trigger ini berjalan setiap minggu.

## 📝 Lisensi

Project ini dibuat untuk keperluan presensi muda-mudi. Silakan modifikasi sesuai kebutuhan.

## 🤝 Kontribusi

Silakan buat issue atau pull request jika ada saran perbaikan atau fitur baru.

---

**Dibuat dengan ❤️ untuk presensi muda-mudi yang lebih efisien** 