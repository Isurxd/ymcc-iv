# 📙 Buku Panduan Praktis YMCC VII

Selamat datang di sistem manajemen ekosistem YMCC VII. Panduan ini dirancang untuk mempermudah Anda beroperasi tanpa perlu menghafal kode.

## 🚀 1. Cara Cepat Menyalakan Aplikasi (Hanya 1 Klik!)
Karena aplikasi Anda berjalan murni melalui file komputer Anda (SQLite), Anda tidak perlu menghidupkan _Supabase_ lagi.
- Jika Anda pengguna Windows, pelaksana Cukup melakukan **Klik Ganda (Double Click)** pada file `start_ymcc.bat` yang ada di dalam *folder* Anda.
- Secara otomatis layar hitam (Terminal) akan menjalankan *Server Web* dan *Aplikasi Database Prisma Studio* berdampingan.

## 🔑 2. Akses Pintu Masuk Panitia (Akun Login Rahasia)
Jika Anda menggunakan fitur *seeding data otomatis* bawaan aplikasi ini, Anda tinggal memakai akun berikut di halaman `ymccvii.com/login`:

| Divisi | Email Login | Password Awal | Tujuan |
|---|---|---|---|
| **Operator Acara** | `operator@ymcc.com` | `password123` | Upload Berita, Mengatur Timer Lomba & Layar Videotron |
| **Sekretariat / Admin**| `admin@ymcc.com` | `password123` | Acc Pembayaran, Scanner Kehadiran QR |
| **Dana Usaha** | `fundraising@ymcc.com`| `password123` | Mengelola Order Kaos, Update Sisa Stok Inventaris |

## 📖 3. Bekerja Tanpa Ngoding (Melalui Prisma Studio)
Saat `Prisma Studio` menyala di _browser_ (lewat tautan `http://localhost:5555`), Anda sedang membuka jantung utama YMCC VII:
- **Jika ada peserta yang lapor salah bayar?** ➔ Buka tabel `Registration` ➔ Ubah status menjadi `PENDING_PAYMENT` lagi.
- **Jika butuh mengubah nilai Ujian yang telanjur ke-Submit?** ➔ Buka tabel `ExamAttempt` ➔ Hapus isiannya agar peserta berkesempatan mencoba lagi.
- **Mengecek Data Penjualan Baju?** ➔ Buka tabel `ProductVariant` dan `OrderItem`.

## 📸 4. Cara Mengetes Modul Ujian
1. Anda masuk sebagai akun peserta fiktif dengan cara **Register** di halaman publik.
2. Sebagai admin, buka Prisma Studio, lalu *Ubah Status Registrasi* akun tersebut menjadi `APPROVED`.
3. Login ke Dashboard Peserta, dan seketika tombol "Mulai Ujian" akan dapat dinavigasikan lengkap dengan 20 Grid angka dan jam pasir hitung mundur di kanan atas.

Selamat bekerja membawa kompetisi mahasiswa teknik ini menuju kesuksesan tertinggi!
