# PaperCraft — Thermal Receipt Designer

Aplikasi desain dan cetak struk thermal (58mm / 80mm / custom) berbasis web. Sepenuhnya berjalan di browser (client-side), portabel, dan siap di-deploy ke GitHub Pages.

## Fitur Utama
- **Kanvas Custom:** Atur ukuran kertas hingga presisi milimeter.
- **Drag & Drop:** Geser dan ubah ukuran elemen dengan mudah.
- **Garis Bantu:** Panduan Margin dan Center agar penempatan presisi.
- **Elemen Lengkap:** Teks statis, Teks Dinamis (binding data), List Item, Logo, Barcode, QR Code, dan Garis Pemisah.
- **Kalkulasi Otomatis:** Hitung Subtotal, Diskon, Pajak, dan Total secara *real-time*.
- **Auto-Save:** Desain tersimpan otomatis di browser (LocalStorage).
- **Export Instan:** Simpan sebagai PDF (1:1) atau Gambar PNG.
- **Portabilitas:** Simpan dan muat desain dalam format file `.hla`.

## Teknologi
- React 19 + Vite
- Tailwind CSS v4
- react-rnd (Drag & Resize)
- html2canvas + jsPDF (Export)

## Cara Menjalankan Secara Lokal
1. Clone repositori ini.
2. Jalankan `npm install`.
3. Jalankan `npm run dev`.
4. Buka `http://localhost:5173`.

## Cara Deploy
Aplikasi ini sudah dilengkapi dengan GitHub Actions (`.github/workflows/deploy.yml`). Cukup push ke branch `main`, dan aktifkan GitHub Pages di menu Settings -> Pages (Source: GitHub Actions).

## Lisensi
MIT License
