const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function fixPasswords() {
  console.log("Memperbaiki hash password di database...");
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const result = await prisma.user.updateMany({
    data: { password: hashedPassword }
  });
  
  console.log(`Berhasil memperbarui password untuk ${result.count} akun.`);
  console.log("\nSekarang Anda bisa login dengan password: password123");
}

fixPasswords()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
