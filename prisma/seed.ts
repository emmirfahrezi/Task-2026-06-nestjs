import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Menjalankan seeder...');

  // Hapus data lama agar tidak duplikat jika dijalankan berulang
  await prisma.user.deleteMany();
  await prisma.divisi.deleteMany();

  // 1. Buat 10 Data Divisi Dummy
  const divisiNames = [
    'Divisi IT',
    'Divisi HRD',
    'Divisi Marketing',
    'Divisi Finance',
    'Divisi Sales',
    'Divisi Operations',
    'Divisi R&D',
    'Divisi Customer Service',
    'Divisi Legal',
    'Divisi Logistik',
  ];

  console.log('Membuat 10 Divisi...');
  for (const name of divisiNames) {
    await prisma.divisi.create({
      data: { name },
    });
  }

  // Mengambil semua divisi yang baru dibuat untuk mendapatkan ID-nya
  const allDivisi = await prisma.divisi.findMany();

  // 2. Buat 10 Data User Dummy
  const userNames = [
    'Emmir Fahrezi',
    'Budi Santoso',
    'Andi Wijaya',
    'Siti Aminah',
    'Joko Anwar',
    'Rina Melati',
    'Agus Salim',
    'Nina Bobo',
    'Kevin Sanjaya',
    'Marcus Gideon',
  ];

  console.log('Membuat 10 User...');
  for (let i = 0; i < 10; i++) {
    await prisma.user.create({
      data: {
        name: userNames[i],
        // Masukkan user secara berurutan ke setiap divisi
        divisi_id: allDivisi[i].id,
      },
    });
  }

  console.log('Seeder berhasil! 10 Divisi dan 10 User telah ditambahkan.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
