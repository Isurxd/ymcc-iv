const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createSuperAdmin() {
  console.log('Menyiapkan pembuatan Super Admin...');
  
  const email = 'superadmin@ymcc.com';
  const plainPassword = 'password123';
  const name = 'Sang Penguasa (SuperAdmin)';

  // Enkripsi password menggunakan bcryptjs (seperti di alur auth Next.js ini)
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // Periksa apakah pengguna dengan email tersebut sudah ada
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log(`Akun ${email} sudah ada, hanya melakukan pembaruan status ke SUPERADMIN...`);
    await prisma.user.update({
      where: { email },
      data: {
        role: 'SUPERADMIN',
        password: hashedPassword, 
        name: name
      }
    });
    console.log(`Berhasil! Akun ${email} telah diperbarui otorisasinya menjadi SUPERADMIN dan disandikan ulang.`);
  } else {
    // Buat User Baru
    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        role: 'SUPERADMIN' 
      }
    });

    console.log(`Berhasil! Akun SUPERADMIN baru telah dicetak (ID: ${user.id}).`);
  }

  console.log('\n=============================================');
  console.log('BERIKUT KREDENSIAL LOGIN ANDA:');
  console.log(`- Email    : ${email}`);
  console.log(`- Password : ${plainPassword}`);
  console.log('=============================================');
}

createSuperAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
