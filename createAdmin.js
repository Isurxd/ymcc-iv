const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ymccvii.com' },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
      name: 'Super Admin'
    },
    create: {
      email: 'admin@ymccvii.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'ADMIN',
    },
  });
  console.log('Admin account ready:', admin.email);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
