# 🌿 SI-KEHATI
## Sistem Informasi Keanekaragaman Hayati

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-316192?style=for-the-badge&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)
![NextAuth](https://img.shields.io/badge/NextAuth-Authentication-purple?style=for-the-badge)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38BDF8?style=for-the-badge&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 📖 About The Project

SI-KEHATI (Sistem Informasi Keanekaragaman Hayati) merupakan aplikasi berbasis web yang dikembangkan untuk membantu proses monitoring, pengelolaan, verifikasi, serta pelaporan data keanekaragaman hayati.

Sistem ini menerapkan **Role Based Access Control (RBAC)** sehingga setiap pengguna hanya dapat mengakses fitur sesuai hak aksesnya.

Role yang tersedia:

- 👑 Super Administrator
- 🛡 Administrator
- 🌱 Petugas Lapangan

---

# ✨ Main Features

## 🔐 Authentication

- Login menggunakan NextAuth
- Session Authentication
- Protected Route
- Role Based Access Control
- Middleware Authorization

---

## 📊 Dashboard

- Ringkasan Data Monitoring
- Statistik Biodiversitas
- Grafik Tren Monitoring
- Ringkasan Program
- Ringkasan Galeri

---

## 🌱 Monitoring Biodiversitas

- Input Data Monitoring
- Monitoring Flora
- Monitoring Fauna
- Status Draft
- Status Pending
- Status Published
- Riwayat Monitoring

---

## ✅ Verifikasi Data

Administrator dapat:

- Melihat data monitoring
- Menyetujui data
- Menolak data
- Memberikan catatan revisi

---

## 🌳 Program Konservasi

- Tambah Program
- Edit Program
- Hapus Program
- Publish Program

---

## 🖼 Galeri

- Upload Galeri
- Kategori Galeri
- Hapus Galeri

---

## 👤 Manajemen Pengguna

- Tambah User
- Nonaktifkan User
- Role Management
- Aktivasi User

---

# 🛠 Tech Stack

| Frontend | Backend | Database |
|-----------|----------|-----------|
| Next.js 14 | Next.js API Routes | PostgreSQL |
| React | Prisma ORM | |
| TypeScript | NextAuth | |
| Tailwind CSS | REST API | |

---

# 🏗 System Architecture

```
Browser
    │
    ▼
Next.js App Router
    │
    ▼
API Routes
    │
    ▼
Prisma ORM
    │
    ▼
PostgreSQL
```

---

# 📂 Project Structure

```
SI-KEHATI
│
├── prisma
│   ├── migrations
│   ├── schema.prisma
│   └── seed.ts
│
├── public
│
├── src
│   ├── app
│   ├── components
│   ├── lib
│   ├── services
│   ├── middleware.ts
│   └── types
│
├── package.json
├── README.md
└── .env.example
```

---

# 🗄 Database

Database menggunakan **PostgreSQL** dengan **Prisma ORM**.

Entity utama:

- Users
- Species
- Monitoring Periods
- Species Records
- Biodiversity Index
- Programs
- Gallery
- Audit Logs

---

# 🚀 Installation

Clone repository

```bash
git clone https://github.com/RaflyTF/SI-KEHATI.git
```

Masuk ke folder project

```bash
cd SI-KEHATI
```

Install dependencies

```bash
npm install
```

Generate Prisma Client

```bash
npx prisma generate
```

Migrasi Database

```bash
npx prisma migrate dev
```

Seed Database

```bash
npm run prisma:seed
```

Jalankan Development Server

```bash
npm run dev
```

Production Build

```bash
npm run build
npm start
```

---

# ⚙ Environment Variables

Buat file `.env`

```env
DATABASE_URL="postgresql://username:password@localhost:5432/si_kehati"

NEXTAUTH_SECRET="your-secret-key"

NEXTAUTH_URL="http://localhost:3000"
```

---

# 👤 Demo Account

Password seluruh akun:

```
password123
```

| Role | Email |
|------|-------|
| Super Admin | superadmin@pltdgtello.id |
| Admin | admin@pltdgtello.id |
| Petugas Lapangan | petugas@pltdgtello.id |

---

# 🧪 Testing

Seluruh fitur utama telah dilakukan pengujian.

| Modul | Status |
|--------|--------|
| Authentication | ✅ |
| Dashboard | ✅ |
| CRUD Program | ✅ |
| CRUD Gallery | ✅ |
| CRUD User | ✅ |
| Monitoring Data | ✅ |
| Verification Workflow | ✅ |
| REST API | ✅ |
| Responsive Layout | ✅ |
| Security Testing | ✅ |
| Production Build | ✅ |

---

# 📱 Responsive Design

Aplikasi telah diuji pada:

- 💻 Desktop
- 📱 Android
- 📱 iPhone
- 📱 Tablet

---

# 🔒 Security

Implementasi keamanan meliputi:

- NextAuth Authentication
- Middleware Authorization
- Role Based Access Control
- Protected API Routes
- Password Hashing
- Session Management

---

# 📈 Future Improvements

Beberapa pengembangan yang dapat dilakukan:

- Export PDF Report
- Export Excel
- Email Notification
- Push Notification
- Image Compression
- Activity Log Dashboard
- Dashboard Analytics
- Map Visualization
- Biodiversity Prediction

---

# 📄 License

Project ini menggunakan lisensi **MIT License**.

---

# 👨‍💻 Author

**Rafly Taufika**

GitHub:
https://github.com/RaflyTF

---

⭐ Jika repository ini bermanfaat, jangan lupa memberikan **Star** pada repository ini.