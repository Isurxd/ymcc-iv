const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Restoring core data...");

  // 1. Create Events
  const events = [
    { id: 'MG', name: 'Mining Games' },
    { id: 'MSIC', name: 'MSIC (Mining Student Intelligence Competition)' },
    { id: 'PAPER', name: 'Paper Competition' }
  ];
  
  for (const ev of events) {
    await prisma.event.upsert({
      where: { id: ev.id },
      update: { name: ev.name },
      create: { id: ev.id, name: ev.name, startDate: new Date(), endDate: new Date() }
    });
    console.log(`   ✅ Event ${ev.name} restored.`);
  }

  // 2. Create Staff Accounts
  const staff = [
    { email: 'operator@ymcc.com', name: 'Operator Panggung', role: 'OPERATOR' },
    { email: 'admin@ymcc.com', name: 'Tim Sekretariat', role: 'ADMIN' },
    { email: 'fundraising@ymcc.com', name: 'Tim Danus', role: 'FUNDRAISING' }
  ];

  for (const s of staff) {
    await prisma.user.upsert({
      where: { email: s.email },
      update: { role: s.role },
      create: { ...s, password: 'password123' }
    });
    console.log(`   ✅ Staff ${s.name} (${s.role}) restored.`);
  }

  console.log("\n✨ Database is now ready to use!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
