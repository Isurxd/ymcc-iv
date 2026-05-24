const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Seeding Exam Data...");

  // 1. Get Event (MSIC)
  const msic = await prisma.event.findUnique({ where: { id: 'MSIC' } });
  if (!msic) {
    console.error("❌ Event MSIC tidak ditemukan. Jalankan fix_all_data.js dulu!");
    return;
  }

  // 2. Create Exam
  const exam = await prisma.exam.upsert({
    where: { id: 'exam-msic-01' },
    update: {},
    create: {
      id: 'exam-msic-01',
      eventId: msic.id,
      title: 'Ujian Seleksi MSIC - YMCC VII',
      description: 'Ujian pengetahuan pertambangan umum untuk kategori MSIC.',
      durationMin: 60
    }
  });
  console.log(`   ✅ Exam created: ${exam.title}`);

  // 3. Create Questions
  const questions = [
    {
      content: "Apa mineral utama yang diekstraksi dari tambang Grasberg di Papua?",
      options: JSON.stringify(["Emas & Tembaga", "Batu Bara", "Nikel", "Timah"]),
      answerKey: "A",
      points: 10
    },
    {
      content: "Metode penambangan bawah tanah yang menggunakan teknik peledakan blok besar disebut?",
      options: JSON.stringify(["Open Pit", "Block Caving", "Room and Pillar", "Longwall Mining"]),
      answerKey: "B",
      points: 10
    }
  ];

  for (const q of questions) {
    await prisma.question.create({
      data: {
        examId: exam.id,
        ...q
      }
    });
  }
  console.log("   ✅ Questions added.");
  console.log("\n✨ Exam is ready for testing!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
