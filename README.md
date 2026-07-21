# SI-KEHATI — Sistem Informasi Keanekaragaman Hayati

Website monitoring dan publikasi data keanekaragaman hayati untuk
**PT PLN Indonesia Power Unit Pembangkitan PLTD/G Tello**, dibangun mengikuti
dokumen SRS & SDD yang telah disusun (Phase 1–4 dari proses SDLC proyek ini).

## Cakupan Implementasi (Sprint 1–6)

- ✅ Sprint 1 — Setup project & autentikasi berjenjang (Petugas Lapangan, Admin, Super Admin)
- ✅ Sprint 2 — Input data monitoring + kalkulasi otomatis Indeks Shannon-Wiener (H')
- ✅ Sprint 3 — Program konservasi + alur verifikasi/publikasi data
- ✅ Sprint 4 — Galeri foto & kategori
- ✅ Sprint 5 — Dashboard ringkasan & ekspor laporan (PDF/Excel)
- ✅ Sprint 6 — Halaman publik, manajemen user, responsif & Dark Mode

Sprint 7 (Testing) dan Sprint 8 (Deployment) adalah proses, bukan kode, sehingga
tidak termasuk dalam paket ini — silakan lanjutkan sesuai checklist pada SDD.

## Tech Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Prisma ORM · PostgreSQL ·
NextAuth.js · Recharts · jsPDF · SheetJS (xlsx)

## Menjalankan di Localhost

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Siapkan database PostgreSQL**, lalu salin `.env.example` menjadi `.env` dan
   isi `DATABASE_URL` sesuai koneksi database Anda:
   ```bash
   cp .env.example .env
   ```

3. **Jalankan migrasi database**
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Isi data awal (seed)** — akan membuat 3 akun demo dan data historis 2021–2025
   sesuai referensi:
   ```bash
   npm run prisma:seed
   ```

5. **Jalankan aplikasi**
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000)

## Akun Demo (setelah seed)

| Role | Email | Password |
|---|---|---|
| Super Admin | superadmin@pltdgtello.id | password123 |
| Admin | admin@pltdgtello.id | password123 |
| Petugas Lapangan | petugas@pltdgtello.id | password123 |

> ⚠️ Ganti seluruh password default ini sebelum digunakan di luar lingkungan
> pengembangan, dan jangan commit file `.env` yang berisi kredensial asli.

## Struktur Project

Lihat penjelasan lengkap struktur folder pada dokumen **Software Design
Document (SDD)** bagian "Struktur Folder". Ringkasnya:

- `src/app/(public)` — halaman publik (Beranda, Status Flora & Fauna, Program, Galeri, dll.)
- `src/app/(auth)` — halaman login
- `src/app/(dashboard)` — panel internal (butuh login, menu dinamis sesuai role)
- `src/app/api` — REST API routes
- `src/services` — logika bisnis (Service Layer)
- `src/repositories` — akses data terpusat (Repository Pattern via Prisma)
- `src/components` — komponen UI (dasar, layout, chart, form, fitur)

## Catatan Implementasi & Batasan (untuk pengembangan lanjutan)

- **Upload foto** pada modul Galeri & Program saat ini berupa input URL, belum
  upload file fisik ke storage — sesuai catatan pada `GalleryUploadForm.tsx`.
- **Multi-bahasa, notifikasi otomatis, dan laporan periodik terjadwal** belum
  diimplementasikan, sesuai keputusan *Future Development* pada SRS.
- Sebelum deployment ke produksi, ikuti checklist **Security Design** dan
  **Deployment Architecture** pada SDD (SSL, domain, CI/CD, backup terjadwal).
