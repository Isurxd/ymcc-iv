const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');

console.log("=========================================");
console.log("🚀 Memulai Otomatisasi Setup YMCC VII...");
console.log("=========================================\n");

try {
  // 1. Push Database
  console.log("📦 1. Mendorong struktur tabel ke database (prisma db push)...");
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });

  // 2. Generate Client
  console.log("\n⚙️ 2. Melakukan Prisma Generate...");
  execSync('npx prisma generate', { stdio: 'inherit' });

  // 3. Seed Database
  console.log("\n🌱 3. Menyuntikkan Data Tiruan (Seeding) ke Database agar sistem langsung bisa dites...");
  const prisma = new PrismaClient();

  async function seed() {
    // Roles Creation
    console.log("   ➤ Membuat akun staf...");
    await prisma.user.upsert({
      where: { email: 'operator@ymcc.com' },
      update: {},
      create: { email: 'operator@ymcc.com', name: 'Operator Panggung', role: 'OPERATOR', password: 'password123' }
    });
    
    await prisma.user.upsert({
      where: { email: 'admin@ymcc.com' },
      update: {},
      create: { email: 'admin@ymcc.com', name: 'Tim Sekretariat', role: 'ADMIN', password: 'password123' }
    });

    await prisma.user.upsert({
      where: { email: 'fundraising@ymcc.com' },
      update: {},
      create: { email: 'fundraising@ymcc.com', name: 'Tim Danus', role: 'FUNDRAISING', password: 'password123' }
    });

    // Event Creation
    console.log("   ➤ Membuat Cabang Lomba (Event)...");
    const events = [
      { id: 'MG', name: 'Mining Games' },
      { id: 'MSIC', name: 'MSIC (Mining Student Intelligence Competition)' },
      { id: 'PAPER', name: 'Paper Competition' }
    ];
    for (const ev of events) {
      await prisma.event.deleteMany({ where: { id: ev.id } }); // reset
      await prisma.event.create({
        data: { id: ev.id, name: ev.name, startDate: new Date(), endDate: new Date() }
      });
    }

    // Product Creation
    console.log("   ➤ Memasukkan Data Merchandise (Inventory)...");
    const existingProduct = await prisma.product.findFirst();
    if (!existingProduct) {
      await prisma.product.create({
        data: {
          name: 'Official YMCC VII Safety Shirt',
          description: 'Kemeja Safety lapangan eksklusif standar tambang.',
          price: 150000,
          imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60',
          variants: {
            create: [
              { size: 'M', stock: 45 },
              { size: 'L', stock: 60 },
              { size: 'XL', stock: 20 }
            ]
          }
        }
      });
    }

    // Example Registrant for Scanner Testing
    console.log("   ➤ Membuat Peserta Simulasi untuk QR Code Scanner...");
    const dummyUser = await prisma.user.upsert({
      where: { email: 'budi@student.com' },
      update: {},
      create: { email: 'budi@student.com', name: 'Budi Prakoso (MSIC)', role: 'USER', password: 'password123' }
    });

    let dummyReg = await prisma.registration.findFirst({ where: { userId: dummyUser.id } });
    if (!dummyReg) {
      dummyReg = await prisma.registration.create({
        data: {
          userId: dummyUser.id,
          eventId: 'MSIC',
          status: 'APPROVED'
        }
      });
    }

    await prisma.$disconnect();

    console.log("\n=========================================");
    console.log("🎉 SETUP OTOMATIS BERHASIL & SELESAI!");
    console.log("=========================================");
    console.log("💡 INFO PENTING UNTUK TESTING:");
    console.log(`   - Kopi Kode ID ini untuk tes QR Scanner:  ${dummyReg.id}`);
    console.log("   - Login Operator: operator@ymcc.com / password123");
    console.log("   - Login Fundraising: fundraising@ymcc.com / password123");
    console.log("   - Perintah selanjutnya: npm run dev\n");
  }

  seed().catch(err => {
    console.error("❌ Gagal saat Seeding Data:", err.message);
    process.exit(1);
  });

} catch (err) {
  console.error("❌ Terjadi kesalahan fatal saat Setup:", err.message);
}
