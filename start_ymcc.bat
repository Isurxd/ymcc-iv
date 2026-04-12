@echo off
title YMCC VII System Launcher
echo ===================================================
echo     MEMULAI SERVER WEB DAN DATABASE YMCC VII
echo ===================================================
echo.
echo Sedang menyiapkan Prisma Studio (Halaman Database)...
start cmd /k "npx prisma studio"

echo Sedang menyalakan Server Web Next.js...
start cmd /k "npm run dev"

echo.
echo [ BERHASIL DILUNCURKAN! ]
echo 1. Web YMCC VII dapat diakses di: http://localhost:3000
echo 2. Pintu Kontrol Database di: http://localhost:5555
echo.
echo Biarkan dua jendela hitam (Terminal) yang baru saja muncul tetap terbuka.
echo Untuk mematikan sistem, tutup saja tanda X pada masing-masing jendela tersebut.
pause
