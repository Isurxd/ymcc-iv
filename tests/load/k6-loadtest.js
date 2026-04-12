import http from 'k6/http';
import { check, sleep } from 'k6';

// Konfigurasi Load Testing untuk 200+ Peserta secara bersamaan (Fase 4 Blueprint)
export const options = {
  stages: [
    { duration: '30s', target: 50 },  // Ramp-up ke 50 pengguna dalam 30 detik
    { duration: '1m', target: 200 },  // Naik cepat ke 200 peserta secara bersamaan
    { duration: '2m', target: 200 },  // Tahan pada 200 VU (Virtual Users) selama 2 menit (Simulasi Ujian)
    { duration: '30s', target: 0 },   // Ramp-down kembali ke 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% request harus selesai di bawah 500ms
    http_req_failed: ['rate<0.01'],   // Error rate maksimal 1%
  },
};

export default function () {
  // 1. Peserta Mengakses Halaman Publik / Login
  const resHome = http.get('http://localhost:3000/');
  check(resHome, { 'Home Page didapatkan': (r) => r.status === 200 });
  sleep(1);

  // 2. Simulasi Request API CMS / Artikel
  const resNews = http.get('http://localhost:3000/api/articles');
  check(resNews, { 'API News merespon': (r) => r.status === 200 || r.status === 404 });
  sleep(1);

  // Catatan: Untuk testing socket.io pada simulasi ujian nyata,
  // Diperlukan library k6/ws, tapi skrip HTTP ini cukup untuk menakar kemampuan dasar server web.
}
