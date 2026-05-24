const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany();
    console.log("SUCCESS: Connection worked, users count:", users.length);
  } catch (e) {
    console.error("FAIL:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
