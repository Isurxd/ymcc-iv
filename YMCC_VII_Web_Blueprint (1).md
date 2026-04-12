# 🌿 Blueprint Ekosistem Web YMCC VII
> **Status:** High-Level Technical Directive  
> **Versi:** 1.0  
> **Terakhir Diperbarui:** 2025  

---

## 📋 Daftar Isi

1. [Overview Proyek](#overview-proyek)
2. [Arsitektur Sistem](#arsitektur-sistem)
3. [Tech Stack](#tech-stack)
4. [Struktur Portal](#struktur-portal)
   - [Portal Publik](#1-portal-publik--visitor)
   - [Portal Peserta](#2-portal-peserta)
   - [Portal Admin](#3-portal-admin--sekretariat)
   - [Portal Operator](#4-portal-operator--bpr)
   - [Portal Fundraising](#5-portal-fundraising)
5. [Data Flow Architecture](#data-flow-architecture)
6. [Fase Pengembangan & Task List](#fase-pengembangan--task-list)
7. [Catatan Teknis Kritis](#catatan-teknis-kritis)
8. [Risiko & Mitigasi](#risiko--mitigasi)

---

## Overview Proyek

**YMCC VII** adalah kompetisi berskala besar yang membutuhkan ekosistem web terintegrasi untuk mengelola seluruh operasional: pendaftaran peserta, ujian online real-time, leaderboard, absensi QR, fundraising merchandise, hingga kontrol videotron live event.

### Tujuan Utama
- Mengintegrasikan seluruh operasional ke dalam **satu ekosistem web** dengan 5 portal independen
- Menjamin **keandalan sistem** saat ratusan peserta mengakses bersamaan
- Menyediakan pengalaman peserta yang **seamless dan self-service**
- Mendukung operasional live event dengan **kontrol real-time** (timer, soal, leaderboard)

### Pengguna Sistem (Roles)
| Role | Portal | Akses |
|---|---|---|
| Pengunjung Umum | `/` (ymccvii.com) | Publik, tanpa login |
| Peserta | `/dashboard` | Login wajib |
| Admin / Sekretariat | `/admin` | Login + role admin |
| Operator / BPR | `/operator` | Login + role operator |
| Tim Fundraising | `/fundraising` | Login + role fundraising |

---

## Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────────┐
│                      YMCC VII Web Ecosystem                     │
├──────────────┬──────────────┬────────────┬───────────┬──────────┤
│   Portal     │   Portal     │  Portal    │  Portal   │  Portal  │
│   Publik     │   Peserta    │  Admin     │  Operator │ Fundrais │
│  ymccvii.com │  /dashboard  │  /admin    │ /operator │ /funding │
└──────┬───────┴──────┬───────┴─────┬──────┴─────┬─────┴────┬─────┘
       │              │             │            │           │
       └──────────────┴─────────────┴────────────┴───────────┘
                                    │
                     ┌──────────────▼──────────────┐
                     │   Master Cloud Database      │
                     │   PostgreSQL / Firestore     │
                     └──────────────┬──────────────┘
                                    │
                          ┌─────────▼─────────┐
                          │  Batch Auto Sync   │
                          │     (5 menit)      │
                          └─────────┬─────────┘
                                    │
                          ┌─────────▼─────────┐
                          │  Google Spreadsheet│
                          │    API Sync        │
                          └───────────────────┘
```

### Komponen Realtime (WebSocket / Firebase)
```
Operator (Master Control)
        │
        ▼  Socket Push: Soal/Timer
┌───────────────┐        ┌──────────────────┐
│  Master       │──────► │  Exam Center     │
│  Control      │        │  (Peserta)       │
│  Panel        │──────► │  Videotron       │
└───────────────┘        │  Display         │
                         └──────────────────┘
```

---

## Tech Stack

### Frontend
| Teknologi | Kegunaan | Alasan Pemilihan |
|---|---|---|
| **Next.js** | Framework utama | SSR + SPA, optimal untuk SEO & performa |
| **React.js** | Library UI | Component-based, ekosistem luas |
| **Tailwind CSS** | Styling | Utility-first, konsistensi desain |
| **Socket.io Client** | Realtime UI | Sinkronisasi timer & soal |

### Backend & Database
| Teknologi | Kegunaan | Alasan Pemilihan |
|---|---|---|
| **Firebase / Supabase** | Backend + Realtime DB | Scalable, built-in auth, WebSocket native |
| **PostgreSQL** | Database utama | Relasional, robust untuk data transaksi |
| **Firestore** | Realtime data | Sinkronisasi sub-detik untuk ujian & leaderboard |

### Infrastruktur
| Teknologi | Kegunaan |
|---|---|
| **Vercel / Firebase Hosting** | Deploy frontend |
| **Google Sheets API** | Batch sync rekap data |
| **WebSocket (Socket.io)** | Live event control |
| **JWT / Firebase Auth** | Autentikasi RBAC |

> ⚠️ **LARANGAN KERAS:** Jangan gunakan hosting PHP murah (cPanel/shared hosting) untuk fitur ujian dan videotron. Server **akan down** saat ratusan peserta mengakses bersamaan.

---

## Struktur Portal

### 1. Portal Publik / Visitor
**URL:** `ymccvii.com`  
**Fokus:** Konversi pengunjung → pendaftar, penjualan merchandise, informasi komprehensif

#### Halaman & Fitur

| Menu | Konten | Komponen Teknis |
|---|---|---|
| **Home** | Hero image, countdown timer, pengantar The Green Compass, highlight sponsor | Countdown component, CMS data |
| **About Us** | Sejarah YMCC, profil Himpunan, filosofi logo | Static + CMS |
| **Events & Competitions** | Dropdown: Mining Games, MSIC, Paper, IC, dll. Timeline, target, Download Event Guideline | PDF download link |
| **News & Articles** | Berita kegiatan, artikel teknis, pengumuman | CMS (dari Operator) |
| **Merch Shop** | Etalase Safety Shirt & suvenir, keranjang belanja publik (tanpa login peserta) | E-commerce cart, payment gateway |
| **Contact & FAQ** | Pertanyaan umum, tombol WhatsApp Official LO | WhatsApp deep link |
| **Portal Login / Register** | Gerbang masuk peserta ke Dashboard | Auth form, JWT |

---

### 2. Portal Peserta
**URL:** `/dashboard`  
**Fokus:** Self-service manajemen progres peserta  
**Akses:** Login wajib (Auth Token)

#### Halaman & Fitur

| Menu | Konten | Komponen Teknis |
|---|---|---|
| **Overview** | Status terkini ("Menunggu Verifikasi Pembayaran", "Lolos Tahap 1") | Realtime status badge |
| **Registration & Payment** | Form unggah berkas, bukti transfer | File upload, Supabase Storage |
| **Exam Center** | Antarmuka ujian: timer real-time, navigasi soal, proctoring (deteksi tab switch) | WebSocket, Visibility API, anti-cheat |
| **Live Leaderboard** | Tabel peringkat real-time sesuai cabang lomba | WebSocket subscribe |

#### Catatan Penting - Exam Center
```
Fitur Proctoring:
  ✅ Deteksi tab switch (Blur / Visibility API)
  ✅ Auto-lock jika peserta meninggalkan tab
  ✅ Log waktu & peristiwa anomali

font menggunakan anton & open sans

  A. Palet Latar Belakang & Penegasan Utama

#E63E00 — Latar Utama (merah-oranye gelap)
#FF4500 — Vibran (oranye terang)
#CCFF00 — Latar Pilihan (kuning-hijau neon)
#FFFFFF — Latar Bersih (putih)

B. Palet Sekunder & Komplementer (Formal)

#001F3F — Latar Teks (navy gelap)
#B87333 — Hangat (coklat tembaga)
#A9A9A9 — Elemen Kecil (abu-abu)

C. Palet Aksen Tambahan (Variasi)

#228B22 — Penyeimbang (hijau hutan)
#CD7F32 — Pemerkaya (bronze/perunggu)

  ⚠️  Pengawasan lapis kedua: Peserta wajib on-camera via Zoom/GMeet terpisah
```

---

### 3. Portal Admin / Sekretariat
**URL:** `/admin`  
**Fokus:** Validasi data birokrasi dan rekapitulasi  
**Akses:** Login + role `admin`

#### Halaman & Fitur

| Menu | Sub-fitur | Aksi |
|---|---|---|
| **Dashboard Statistik** | Grafik pendaftar per lomba, total uang masuk | Read only |
| **Verif Pembayaran** | List bukti transfer yang masuk | Approve / Reject |
| **Verif Berkas** | List PDF pendaftar | Approve / Reject + catatan alasan |
| **Scoring Center** | Form input nilai per pos/kategori (untuk Juri) | Tulis nilai → trigger Leaderboard update |
| **QR Scanner / Attendance** | Input aktif, scan QR ID Card peserta | Auto-submit, respons Valid/Invalid, catat waktu hadir |

#### Alur QR Attendance
```
Scanner QR (keyboard emulator)
        │
        ▼
  Input field auto-submit
        │
        ▼
  DB Internal YMCC
        │
        ▼  (Setiap 5 menit)
  Batch Sync → Google Sheets
```

---

### 4. Portal Operator / BPR
**URL:** `/operator`  
**Fokus:** Eksekusi live event dan pengelolaan konten  
**Akses:** Login + role `operator`

#### Halaman & Fitur

| Menu | Sub-fitur | Komponen Teknis |
|---|---|---|
| **CMS Content Management** | Text editor: unggah berita, foto, press release ke Portal Publik | Rich text editor (Tiptap/Quill) |
| **Live Event Controller** | | |
| └─ Videotron Display | URL endpoint fullscreen (tanpa elemen web lain) | Dedicated route `/videotron` |
| └─ Master Control | Trigger soal muncul, Start/Stop Global Timer, Show Leaderboard ke Videotron | Socket.io emit |
| **Cheat Monitor** | Tabel real-time log peringatan tab switch peserta | WebSocket subscribe, live table |

#### Alur Live Event Controller
```
Operator → Master Control Panel
                │
     ┌──────────┼──────────────┐
     │          │              │
     ▼          ▼              ▼
Trigger     Start/Stop     Show
Soal Muncul  Timer         Leaderboard
     │          │              │
     └──────────┴──────────────┘
                │
         Socket Push (WebSocket)
                │
     ┌──────────┴──────────┐
     ▼                     ▼
Exam Center           Videotron
(Peserta)             (Fullscreen Display)
```

---

### 5. Portal Fundraising
**URL:** `/fundraising`  
**Fokus:** Pencetakan profit dan manajemen logistik e-commerce  
**Akses:** Login + role `fundraising`

#### Halaman & Fitur

| Menu | Konten | Aksi |
|---|---|---|
| **Order Management** | Daftar pesanan merchandise publik (Nama, Ukuran, Status Pembayaran) | Update status pesanan |
| **Inventory** | Input stok barang | Cegah overselling, update stok |
| **Financial Report** | Data penjualan | Ekspor CSV/Excel |

---

## Data Flow Architecture

### Alur Data Utama

```
Portal Publik ──────────────────────────────────────┐
  (Registrasi, Pembelian Merch)                      │
                                                     ▼
Portal Peserta ──────────────────────────────► Master Cloud Database
  (Upload Berkas, Ujian, Leaderboard)          (PostgreSQL / Firestore)
                                                     │
Portal Admin ────────────────────────────────────────┤
  (Verifikasi, Scoring, QR Scan)                     │
                                                     │
Portal Operator ─────────────────────────────────────┤
  (CMS, Live Control, Monitor)                       │
                                                     │
Portal Fundraising ──────────────────────────────────┘
  (Order, Inventory, Report)
                    │
                    ▼ (Batch Auto Sync 5 Menit)
              Google Spreadsheet
                 (API Sync)
```

### Alur Realtime (WebSocket)

```
Master Control (Operator)
      │
      ├──► Socket.io Server
      │          │
      │    ┌─────┴──────┐
      │    ▼            ▼
      │  Peserta    Videotron
      │  (Soal,     (Display
      │   Timer)     Output)
      │
      └──► Live Leaderboard (semua portal)
```

---

## Fase Pengembangan & Task List

### 🚀 FASE 1 — Fondasi (Segera / Sprint 1–2)
> Portal Publik, Registrasi, dan Verifikasi Admin

#### Setup & Infrastruktur
- [✅] Setup repository GitHub (monorepo atau multi-repo) - (Skenario Lokal)
- [✅] Inisialisasi proyek Next.js - sampai selesai
- [✅] Setup Firebase / Supabase project - (Skenario Lokal / Prisma SQLite)
- [✅] Konfigurasi environment variables - sampai selesai
- [✅] Setup CI/CD pipeline (Vercel / Firebase Hosting) - (Skenario Lokal)
- [✅] Setup domain `ymccvii.com` dan SSL - (Skenario Lokal)
- [✅] Desain sistem database schema (users, registrations, payments, events) - sampai selesai
- [✅] Implementasi RBAC (Role-Based Access Control) dengan JWT / Firebase Auth - sampai selesai

#### Portal Publik (`ymccvii.com`)
- [✅] Halaman **Home** — Hero, countdown timer, sponsor section - sampai selesai
- [✅] Halaman **About Us** — Sejarah, profil, filosofi logo - sampai selesai
- [✅] Halaman **Events & Competitions** — Dropdown, timeline, download guideline - sampai selesai
- [✅] Halaman **Contact & FAQ** — Konten statis + tombol WhatsApp - sampai selesai
- [✅] Komponen **Navbar** responsif dengan dropdown - sampai selesai
- [✅] Komponen **Footer** global - sampai selesai
- [✅] SEO meta tags dan Open Graph untuk semua halaman publik - sampai selesai

#### Autentikasi
- [✅] Halaman **Register** peserta (form lengkap, validasi) - (Kerangka page selesai)
- [✅] Halaman **Login** (semua role) - (Kerangka page selesai)
- [✅] Implementasi **Auth Token / JWT** - sampai selesai
- [✅] Halaman **Forgot Password** dan reset email - sampai selesai
- [✅] Middleware proteksi route per role - sampai selesai

#### Portal Peserta — Dasar (`/dashboard`)
- [✅] Halaman **Overview** — status pendaftaran - sampai selesai
- [✅] Halaman **Registration & Payment** — form upload berkas & bukti transfer - sampai selesai
- [✅] File upload ke Supabase Storage / Firebase Storage - sampai selesai
- [✅] Notifikasi status verifikasi (email / in-app) - sampai selesai

#### Portal Admin — Dasar (`/admin`)
- [✅] Halaman **Dashboard Statistik** — grafik pendaftar, total uang masuk - sampai selesai
- [✅] Halaman **Verif Pembayaran** — list + aksi Approve/Reject - sampai selesai
- [✅] Halaman **Verif Berkas** — list PDF + aksi Approve/Reject + catatan - sampai selesai
- [✅] Notifikasi ke peserta setelah verifikasi - sampai selesai

---

### 🛒 FASE 2 — E-Commerce & Fundraising (Sprint 3–4)
> Portal Fundraising dan Merch Shop

#### Merch Shop (Portal Publik)
- [✅] Halaman **Merch Shop** — etalase produk (Safety Shirt, suvenir) - sampai selesai
- [✅] Komponen **Product Card** — foto, harga, pilihan ukuran - sampai selesai
- [✅] Fitur **Keranjang Belanja** (cart) tanpa perlu login peserta - sampai selesai
- [✅] Halaman **Checkout** — form data pembeli - sampai selesai
- [✅] Integrasi **Payment Gateway** (Midtrans / Xendit) - sampai selesai
- [✅] Halaman **Konfirmasi Order** dan email receipt - sampai selesai

#### Portal Fundraising (`/fundraising`)
- [✅] Halaman **Order Management** — daftar pesanan, filter status - sampai selesai
- [✅] Aksi update status pesanan (Diproses, Dikirim, Selesai) - sampai selesai
- [✅] Halaman **Inventory** — form input/update stok barang - sampai selesai
- [✅] Logika **stock validation** — tolak pesanan jika stok habis - sampai selesai
- [✅] Halaman **Financial Report** — tabel penjualan, ekspor CSV/Excel - sampai selesai

---

### 🎯 FASE 3 — Live Event & Realtime (H-3 Bulan / Sprint 5–7)
> Modul Ujian Online, Videotron Control, Leaderboard, CMS

#### Infrastruktur Realtime
- [✅] Setup **Socket.io Server** (atau Firebase Realtime DB) - sampai selesai
- [✅] Desain event schema WebSocket (soal, timer, leaderboard) - sampai selesai
- [✅] Load testing realtime server (simulasi 200+ peserta) - sampai selesai

#### Portal Operator — CMS & Live Control (`/operator`)
- [✅] Halaman **CMS** — rich text editor (Tiptap/Quill), upload foto - sampai selesai
- [✅] Integrasi CMS → Portal Publik (News & Articles) - sampai selesai
- [✅] Halaman **Master Control** — tombol trigger soal, Start/Stop timer global - sampai selesai
- [✅] Integrasi **Socket.io emit** dari Master Control ke semua klien - sampai selesai
- [✅] Halaman **Videotron Display** (`/videotron`) — URL fullscreen tanpa navbar - sampai selesai
- [✅] Halaman **Cheat Monitor** — tabel real-time log anomali peserta - sampai selesai

#### Portal Peserta — Exam Center
- [✅] Halaman **Exam Center** — antarmuka soal multi-pilih - sampai selesai
- [✅] Komponen **Timer** real-time (sinkron via WebSocket) - sampai selesai
- [✅] Navigasi soal (nomor soal, tandai untuk review) - sampai selesai
- [✅] Implementasi **Proctoring**: deteksi tab switch (Visibility API / Blur event) - sampai selesai
- [✅] Sistem **auto-lock** saat peserta meninggalkan tab - sampai selesai
- [✅] Log anomali dikirim ke server → tampil di Cheat Monitor - sampai selesai
- [✅] Konfirmasi submit sebelum ujian berakhir - sampai selesai
- [✅] Halaman **hasil ujian** setelah submit - sampai selesai

#### Leaderboard Realtime
- [✅] Halaman **Live Leaderboard** di Portal Peserta - sampai selesai
- [✅] Leaderboard display di **Videotron** (fullscreen) - sampai selesai
- [✅] Update otomatis via WebSocket saat Scoring Center diisi - sampai selesai
- [✅] Filter leaderboard per cabang lomba - sampai selesai

#### Portal Admin — Scoring & QR
- [✅] Halaman **Scoring Center** — form input nilai per pos/kategori - sampai selesai
- [✅] Validasi input nilai (range, format) - sampai selesai
- [✅] Trigger update leaderboard setelah nilai di-submit - sampai selesai
- [✅] Halaman **QR Scanner / Attendance**:
  - [✅] Input field auto-focus dan auto-submit - sampai selesai
  - [✅] Respons "Valid / Invalid" real-time - sampai selesai
  - [✅] Catat timestamp kehadiran ke DB - sampai selesai
  - [✅] Batch sync ke Google Sheets setiap 5 menit - sampai selesai

#### Google Sheets Integration
- [ ] Setup **Google Sheets API** credentials - sampai selesai
- [✅] Implementasi batch sync job (cron / Cloud Function) - sampai selesai
- [✅] Sinkronisasi: data absensi, pendaftar, pembayaran - sampai selesai
- [✅] Error handling jika sync gagal (retry mechanism) - sampai selesai

---

### 🧪 FASE 4 — Testing & Launch (H-1 Bulan)

#### Quality Assurance
- [✅] Unit testing komponen kritis (auth, payment, exam) - sampai selesai
- [✅] Integration testing alur end-to-end per portal - sampai selesai
- [✅] **Load testing** — simulasi 200+ peserta bersamaan - sampai selesai
- [✅] **Security audit** — RBAC, SQL injection, XSS - sampai selesai
- [ ] Testing proctoring di berbagai browser (Chrome, Firefox, Edge) - sampai selesai
- [ ] Testing QR scanner dengan hardware asli - sampai selesai
- [ ] Testing videotron display di resolusi besar - sampai selesai

#### Launch Preparation
- [ ] Finalisasi konten semua portal - sampai selesai
- [ ] Upload semua Event Guidelines (PDF) - sampai selesai
- [ ] Briefing tim operator cara pakai Master Control - sampai selesai
- [ ] Briefing tim admin cara pakai QR Scanner & Verifikasi - sampai selesai
- [ ] Dry run live event (simulasi penuh) - sampai selesai
- [ ] Setup monitoring & alerting (Sentry / Uptime Robot) - sampai selesai
- [ ] Backup database plan - sampai selesai
- [ ] **Go Live** 🚀 - sampai selesai

---

## Catatan Teknis Kritis

### ⚡ Realtime: Gunakan WebSocket / Firebase, BUKAN database konvensional

Fitur **timer ujian** dan **soal ke videotron** wajib menggunakan:
- `Socket.io` (WebSocket layer)
- `Firebase Realtime Database` atau `Firestore onSnapshot`

❌ **Jangan** mengandalkan HTTP polling atau MySQL biasa untuk fitur ini — akan terjadi delay hingga detik yang merusak integritas ujian.

### 🔐 Proctoring: Lapisan Ganda

Web hanya mendeteksi anomali pada **perangkat ujian**:
```
Layer 1 (Web): Visibility API + Blur Event → Auto-lock + Log
Layer 2 (Manusia): Peserta wajib on-camera via Zoom/GMeet terpisah
```

Sistem tidak bisa mendeteksi peserta yang menggunakan **perangkat kedua** (HP). Pengawasan manusia tetap wajib.

### 📷 QR Scanner: Hardware sebagai Keyboard Emulator

Scanner QR berfungsi layaknya **keyboard** yang mengetik ID, lalu menekan Enter.

Implementasi cukup:
```javascript
// Input field dengan auto-submit saat scanner membaca
<input
  autoFocus
  onKeyDown={(e) => e.key === 'Enter' && handleScan(e.target.value)}
/>
```

Tidak perlu integrasi SDK khusus. Scanner langsung ke kolom input web.

### ☁️ Sinkronisasi Google Sheets: Batch, Bukan Real-time

❌ **Jangan** menulis langsung ke Google Sheets saat scan QR — akan gagal jika internet lambat.

✅ **Solusi:** Tampung data ke database internal dulu → sync massal ke Sheets setiap 5 menit via background job / Cloud Function.

---

## Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Server down saat event | Ujian terganggu, data hilang | Gunakan Firebase/Supabase (cloud-native, auto-scale) |
| Latensi timer ujian | Ketidakadilan antar peserta | Wajib WebSocket, bukan HTTP polling |
| Peserta curang (2 perangkat) | Integritas ujian rusak | Pengawasan Zoom/GMeet sebagai layer kedua |
| QR scan gagal (internet lambat) | Data absensi hilang | Batch sync ke Sheets, bukan direct write |
| Bounce rate tinggi di portal publik | Pendaftar sedikit | Pisahkan Landing Page (info) dari Dashboard (aksi) |
| Overselling merchandise | Konflik pesanan | Validasi stok di backend sebelum konfirmasi order |
| Data breach peserta | Reputasi rusak, hukum | Enkripsi data sensitif, audit RBAC, HTTPS enforced |

---

## Kontak Tim Teknis

> Lengkapi bagian ini dengan data tim pengembang YMCC VII

| Role | Nama | Kontak |
|---|---|---|
| Tech Lead / Arsitek | — | — |
| Frontend Developer | — | — |
| Backend Developer | — | — |
| DevOps / Infra | — | — |
| UI/UX Designer | — | — |

---

*Dokumen ini adalah panduan teknis hidup (living document). Setiap perubahan arsitektur wajib diperbarui di sini.*

---
**© YMCC VII Web Team — Confidential Internal Document**
