const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  await prisma.$connect();
  console.log('Connected!');
  await prisma.user.findMany();
  console.log('Queried!');
  await prisma.$disconnect();
}
main().catch(e => {
  console.error(e);
  process.exit(1);
});
