# 🤖 Auto Logbook SIAKAD UNEJ

Repositori ini berisi alat otomatisasi untuk mengisi **Logbook Merdeka Belajar (Outbound Non-PT)** pada portal SIAKAD Universitas Jember (UNEJ) secara otomatis menggunakan **Playwright** dan **Cheerio / Axios**.

Alat ini sangat berguna untuk menghemat waktu pengisian logbook harian/mingguan dengan mengambil data langsung dari dokumen Google Docs yang Anda miliki.

---

## 🚀 Fitur Utama

- **Integrasi Google Docs**: Mengambil data logbook secara langsung dari dokumen Google Docs publik tanpa perlu memindahkan data secara manual ke SIAKAD.
- **Login Semi-Otomatis (Save State)**: Pertama kali dijalankan, Anda hanya perlu login sekali secara manual. Sesi login akan disimpan ke `auth_state.json`, sehingga proses pengisian berikutnya tidak memerlukan login ulang.
- **Pengisian Cepat**: Menggunakan browser Chromium yang dikontrol oleh Playwright untuk mengisi formulir tanggal (menggunakan integrasi Flatpickr), uraian kerja, serta link bukti kerja.
- **Robust Selector**: Menghindari pengisian berulang dan meminimalisir kesalahan input.

---

## 🛠️ Prasyarat

Sebelum memulai, pastikan perangkat Anda sudah terinstall:
- **Node.js** (versi 16 atau yang lebih baru direkomendasikan)
- **NPM** (bawaan dari instalasi Node.js)

---

## 📥 Instalasi

1. Clone repositori ini ke komputer lokal Anda:
   ```bash
   git clone <url-repositori-ini>
   cd auto_logbook
   ```

2. Install seluruh dependensi yang dibutuhkan:
   ```bash
   npm install
   ```

3. Unduh browser Chromium pendukung Playwright:
   ```bash
   npx playwright install chromium
   ```

---

## ⚙️ Cara Konfigurasi & Penggunaan

### 1. Siapkan Google Docs
Buat sebuah dokumen Google Docs yang berisi tabel logbook Anda. Format tabel yang diharapkan adalah **tabel ke-3** pada dokumen tersebut dengan struktur kolom sebagai berikut:
- **Jika tabel memiliki 5 kolom (misalnya dengan kolom nomor):**
  - Kolom 2: Tanggal (Format: `Hari, DD Bulan YYYY` contoh: `Senin, 16 Juni 2026`)
  - Kolom 3: Uraian Kerja / Deskripsi Kegiatan
  - Kolom 4: Bukti Kerja (Berisi link Google Drive / tautan dokumen bukti kerja)
- **Jika tabel memiliki 3 kolom:**
  - Kolom 1: Tanggal
  - Kolom 2: Uraian Kerja
  - Kolom 3: Bukti Kerja

> ⚠️ **Penting**: Pastikan dokumen Google Docs diatur untuk dapat diakses oleh publik ("Anyone with the link can view") agar script dapat menarik data tersebut.

### 2. Hubungkan Google Docs ke Script
1. Buka file [tests/automation.spec.ts](./tests/automation.spec.ts).
2. Temukan variabel `docsLink` di baris ke-7:
   ```typescript
   const docsLink = 'https://docs.google.com/document/d/ID_GDOCS_KAU/export?format=html'
   ```
3. Ganti `ID_GDOCS_KAU` dengan ID Google Docs Anda yang sebenarnya. Berikut adalah cara mengambil ID dokumen dari link Google Docs Anda:

   ```text
   LINK EDIT / BERBAGI GOOGLE DOCS:
   https://docs.google.com/document/d/1vLm9QZYKi1gdMB8RVzPCHnSzn2KmKWXxFppHydBMCgY/edit?usp=sharing
                                      └──────────────────┬──────────────────────┘
                                                         │
                                            ID DOKUMEN GOOGLE DOCS ANDA
                                      (Kode acak setelah "/d/" dan sebelum "/edit")

   URL HASIL EKSPOR HTML (UNTUK DI SCRIPT):
   https://docs.google.com/document/d/1vLm9QZYKi1gdMB8RVzPCHnSzn2KmKWXxFppHydBMCgY/export?format=html
   ```


### 3. Jalankan Pengisian Otomatis
Jalankan perintah berikut pada terminal Anda:
```bash
npm run setup
```

**Alur yang akan terjadi:**
1. **Pengecekan Sesi (`auth_state.json`)**:
   - Jika file `auth_state.json` belum ada, program akan membuka jendela browser Chromium dan mengarahkan Anda ke halaman login SIAKAD UNEJ.
   - Silakan masuk dengan kredensial NIM dan Password Anda secara manual.
   - Setelah sistem mendeteksi login berhasil (diarahkan ke dashboard/transkrip), sesi login Anda akan disimpan dan jendela browser ditutup secara otomatis.
2. **Proses Pengisian Logbook**:
   - Program menggunakan sesi login yang telah tersimpan untuk masuk ke halaman logbook Merdeka Belajar.
   - Program mengambil dan mengurai tabel dari Google Docs.
   - Secara berurutan, program akan menekan tombol **Tambah Logbook**, mengisikan tanggal kegiatan, uraian kerja, serta bukti kerja, lalu menyimpannya.

---

## 📁 Struktur Repositori

- [tests/auth.spec.ts](./tests/auth.spec.ts): Script untuk menangani login awal dan menyimpan status autentikasi.
- [tests/automation.spec.ts](./tests/automation.spec.ts): Script utama yang melakukan fetching data dari Google Docs dan memasukkan data tersebut ke formulir SIAKAD.
- [setup.ts](./setup.ts): Entry point utama yang menjalankan alur pengecekan sesi dan eksekusi pengisian logbook.
- `auth_state.json`: File penyimpan sesi login (dibuat secara otomatis, dimasukkan dalam `.gitignore` demi keamanan).
- `user_data/`: Direktori penyimpanan data profil browser (dimasukkan dalam `.gitignore`).

## 🔒 Catatan Keamanan

- Kredensial dan sesi login Anda disimpan secara lokal di komputer Anda pada file `auth_state.json` dan folder `user_data/`. **Jangan pernah mengunggah file-file ini ke repositori publik.** File ini sudah otomatis diabaikan oleh git melalui `.gitignore`.
- ⚠️ **Rekomendasi Keamanan Penting**: Untuk menjaga keamanan akun SIAKAD Anda, **sangat disarankan untuk menghapus file `auth_state.json` dan folder `user_data/`** setelah Anda selesai mengisi logbook, atau jika alat ini tidak akan digunakan lagi dalam waktu dekat. Hal ini bertujuan untuk mencegah penyalahgunaan sesi login aktif oleh pihak lain yang memiliki akses ke komputer Anda.
