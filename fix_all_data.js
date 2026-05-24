const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log("=========================================");
  console.log("🚀 MEMULAI TOTAL DATA RESTORATION...");
  console.log("=========================================\n");

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Cabang Lomba (Events)
  console.log("📦 1. Memulihkan Cabang Lomba (Events)...");
  const events = [
    { id: 'MG', name: 'Mining Games' },
    { id: 'MSIC', name: 'MSIC (Mining Student Intelligence Competition)' },
    { id: 'PAPER', name: 'Paper Competition' }
  ];
  for (const ev of events) {
    await prisma.event.upsert({
      where: { id: ev.id },
      update: { name: ev.name },
      create: { 
        id: ev.id, 
        name: ev.name, 
        startDate: new Date(), 
        endDate: new Date(),
        description: `Kompetisi bergengsi ${ev.name} YMCC VII`
      }
    });
  }
  console.log("   ✅ Cabang Lomba berhasil dipulihkan.");

  // 2. Akun Staff & Admin (Hashed Passwords)
  console.log("\n👤 2. Memulihkan Akun Staff & Admin (Password: password123)...");
  const users = [
    { email: 'superadmin@ymcc.com', name: 'Sang Penguasa (SuperAdmin)', role: 'SUPERADMIN' },
    { email: 'admin@ymcc.com', name: 'Tim Sekretariat', role: 'ADMIN' },
    { email: 'operator@ymcc.com', name: 'Operator Panggung', role: 'OPERATOR' },
    { email: 'fundraising@ymcc.com', name: 'Tim Danus', role: 'FUNDRAISING' },
    { email: 'budi@student.com', name: 'Budi Prakoso (Peserta MSIC)', role: 'USER' }
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { password: passwordHash, role: u.role, name: u.name },
      create: { 
        email: u.email, 
        name: u.name, 
        role: u.role, 
        password: passwordHash 
      }
    });
  }
  console.log("   ✅ Semua akun (termasuk SuperAdmin) berhasil di-sinkronisasi.");

  // 3. Properti Merchandise (Products)
  console.log("\n👕 3. Memasukkan Data Merchandise...");
  const existingProduct = await prisma.product.findFirst({ where: { name: 'Official YMCC VII Safety Shirt' } });
  if (!existingProduct) {
    await prisma.product.create({
      data: {
        name: 'Official YMCC VII Safety Shirt',
        description: 'Kemeja Safety lapangan eksklusif standar tambang.',
        price: 150000,
        imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60',
        variants: {
          create: [
            { size: 'M', stock: 50 },
            { size: 'L', stock: 50 },
            { size: 'XL', stock: 50 }
          ]
        }
      }
    });
  }
  console.log("   ✅ Data Merchandise (Safety Shirt) tersedia.");

  // 4. Dummy Registration untuk Testing Dashboard
  console.log("\n📝 4. Memastikan Data Pendaftaran Peserta Simulasi...");
  const budi = await prisma.user.findUnique({ where: { email: 'budi@student.com' } });
  const budiReg = await prisma.registration.findFirst({ where: { userId: budi.id } });
  if (!budiReg) {
    await prisma.registration.create({
      data: {
        userId: budi.id,
        eventId: 'MSIC',
        status: 'APPROVED'
      }
    });
  }
  console.log("   ✅ Data simulasi pendaftaran (Budi) siap digunakan.");

  console.log("\n=========================================");
  console.log("🎉 SEMUA DATA BERHASIL DIPULIHKAN!");
  console.log("=========================================");
  console.log("💡 INFO LOGIN:");
  console.log("   - Akun: superadmin@ymcc.com");
  console.log("   - Akun: admin@ymcc.com");
  console.log("   - Akun: operator@ymcc.com");
  console.log("   - Password: password123 (Sama untuk semua)");
  console.log("=========================================\n");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
