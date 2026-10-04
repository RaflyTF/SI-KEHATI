import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { calculateSpeciesIndex } from '../src/services/biodiversityIndex.service';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding SI-KEHATI...');

  // 1. Akun awal untuk tiap role (password sama untuk kemudahan demo -- WAJIB diganti di produksi)
  const passwordHash = await bcrypt.hash('password123', 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@pltdgtello.id' },
    update: {},
    create: { nama: 'Super Admin', email: 'superadmin@pltdgtello.id', passwordHash, role: 'super_admin' },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@pltdgtello.id' },
    update: {},
    create: { nama: 'Admin PLTD/G Tello', email: 'admin@pltdgtello.id', passwordHash, role: 'admin' },
  });

  const petugas = await prisma.user.upsert({
    where: { email: 'petugas@pltdgtello.id' },
    update: {},
    create: { nama: 'Petugas Lapangan', email: 'petugas@pltdgtello.id', passwordHash, role: 'petugas_lapangan' },
  });

  // 2. Periode monitoring 2021 - 2025 (data hingga Juni 2025, sesuai referensi "*Data hingga bulan Juni")
 const periodDefs = [
  { tahun: 2021, semester: '1', label: '2021' },
  { tahun: 2022, semester: '1', label: '2022' },
  { tahun: 2023, semester: '1', label: '2023' },
  { tahun: 2024, semester: '1', label: '2024' },
  { tahun: 2025, semester: '1', label: '2025*' },
  { tahun: 2026, semester: '1', label: '2026' },
];
  const periods = new Map<number, string>();
  for (const p of periodDefs) {
    const period = await prisma.monitoringPeriod.upsert({
      where: { tahun_semester: { tahun: p.tahun, semester: p.semester } },
      update: {},
      create: p,
    });
    periods.set(p.tahun, period.id);
  }

// 3. Master data spesies lengkap dengan taksonomi & status konservasi resmi (PLTD/G Tello)
  const speciesDefs = [
    {
      namaLokal: 'Jalak Bali',
      namaIlmiah: 'Leucopsar rothschildi',
      namaInggris: 'Bali Myna',
      jenis: 'fauna' as const,
      kingdom: 'Animalia',
      filum: 'Chordata',
      kelas: 'Aves',
      ordo: 'Passeriformes',
      famili: 'Sturnidae',
      genus: 'Leucopsar',
      statusIucn: 'CR' as const,
      statusPerlindungan: 'DILINDUNGI' as const,
      statusCites: 'APPENDIX_I' as const,
      statusKeberadaan: 'ENDEMIC' as const,
      habitat: 'Hutan musim dataran rendah dan kawasan konservasi aviari.',
      deskripsi: 'Burung pengicau endemik berbulu putih bersih dengan pelupuk mata biru terang dan jambul khas.',
      fotoUrl: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=800&q=80',
    },
    {
      namaLokal: 'Kura-kura Forsteni',
      namaIlmiah: 'Indotestudo forsteni',
      namaInggris: "Forsten's Tortoise",
      jenis: 'fauna' as const,
      kingdom: 'Animalia',
      filum: 'Chordata',
      kelas: 'Reptilia',
      ordo: 'Testudines',
      famili: 'Testudinidae',
      genus: 'Indotestudo',
      statusIucn: 'CR' as const,
      statusPerlindungan: 'DILINDUNGI' as const,
      statusCites: 'APPENDIX_II' as const,
      statusKeberadaan: 'ENDEMIC' as const,
      habitat: 'Lantai hutan hujan lembap dan perbukitan berbatu.',
      deskripsi: 'Kura-kura darat endemik Sulawesi berkarapas lonjong cokelat kekuningan dengan corak gelap.',
      fotoUrl: 'https://images.unsplash.com/photo-1508817628294-5a453fa0b8fb?auto=format&fit=crop&w=800&q=80',
    },
    {
      namaLokal: 'Penyu Lekang',
      namaIlmiah: 'Lepidochelys olivacea',
      namaInggris: 'Olive Ridley Sea Turtle',
      jenis: 'fauna' as const,
      kingdom: 'Animalia',
      filum: 'Chordata',
      kelas: 'Reptilia',
      ordo: 'Testudines',
      famili: 'Cheloniidae',
      genus: 'Lepidochelys',
      statusIucn: 'VU' as const,
      statusPerlindungan: 'DILINDUNGI' as const,
      statusCites: 'APPENDIX_I' as const,
      statusKeberadaan: 'NATIVE' as const,
      habitat: 'Perairan laut tropis terbuka dan pantai peneluran.',
      deskripsi: 'Penyu laut berukuran relatif kecil dengan karapas bundar zaitun kehijauan.',
      fotoUrl: 'https://images.unsplash.com/photo-1518467166778-b88f373ffec7?auto=format&fit=crop&w=800&q=80',
    },
    {
      namaLokal: 'Penyu Hijau',
      namaIlmiah: 'Chelonia mydas',
      namaInggris: 'Green Sea Turtle',
      jenis: 'fauna' as const,
      kingdom: 'Animalia',
      filum: 'Chordata',
      kelas: 'Reptilia',
      ordo: 'Testudines',
      famili: 'Cheloniidae',
      genus: 'Chelonia',
      statusIucn: 'EN' as const,
      statusPerlindungan: 'DILINDUNGI' as const,
      statusCites: 'APPENDIX_I' as const,
      statusKeberadaan: 'NATIVE' as const,
      habitat: 'Padang lamun pesisir dan terumbu karang dangkal.',
      deskripsi: 'Penyu laut pemakan lamun dan alga dengan kepala membulat serta paruh pendek.',
      fotoUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    },
    {
      namaLokal: 'Penyu Sisik',
      namaIlmiah: 'Eretmochelys imbricata',
      namaInggris: 'Hawksbill Sea Turtle',
      jenis: 'fauna' as const,
      kingdom: 'Animalia',
      filum: 'Chordata',
      kelas: 'Reptilia',
      ordo: 'Testudines',
      famili: 'Cheloniidae',
      genus: 'Eretmochelys',
      statusIucn: 'CR' as const,
      statusPerlindungan: 'DILINDUNGI' as const,
      statusCites: 'APPENDIX_I' as const,
      statusKeberadaan: 'NATIVE' as const,
      habitat: 'Kawasan terumbu karang tropis dan perairan berbatu.',
      deskripsi: 'Penyu laut dengan paruh tajam melengkung dan lempeng sisik bertumpuk bermotif dekoratif.',
      fotoUrl: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=800&q=80',
    },
    {
      namaLokal: 'Ketapang',
      namaIlmiah: 'Terminalia catappa',
      namaInggris: 'Indian Almond',
      jenis: 'flora' as const,
      kingdom: 'Plantae',
      filum: 'Tracheophyta',
      kelas: 'Magnoliopsida',
      ordo: 'Myrtales',
      famili: 'Combretaceae',
      genus: 'Terminalia',
      statusIucn: 'LC' as const,
      statusPerlindungan: 'TIDAK_DILINDUNGI' as const,
      statusCites: 'NON_APPENDIX' as const,
      statusKeberadaan: 'NATIVE' as const,
      habitat: 'Kawasan pesisir pantai tropis, dataran rendah, dan riparian sungai.',
      deskripsi: 'Pohon peneduh pantai bertajuk bertingkat yang memiliki daun lebar yang memerah saat akan gugur.',
      fotoUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=800&q=80',
    },
    {
      namaLokal: 'Mangga',
      namaIlmiah: 'Mangifera indica',
      namaInggris: 'Mango',
      jenis: 'flora' as const,
      kingdom: 'Plantae',
      filum: 'Tracheophyta',
      kelas: 'Magnoliopsida',
      ordo: 'Sapindales',
      famili: 'Anacardiaceae',
      genus: 'Mangifera',
      statusIucn: 'DD' as const,
      statusPerlindungan: 'TIDAK_DILINDUNGI' as const,
      statusCites: 'NON_APPENDIX' as const,
      statusKeberadaan: 'INTRODUCED' as const,
      habitat: 'Dataran rendah tropis, lahan perkebunan, dan pekarangan.',
      deskripsi: 'Pohon buah berkayu keras dengan tajuk rimbun hijau sepanjang tahun.',
      fotoUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
    },
    {
      namaLokal: 'Matoa',
      namaIlmiah: 'Pometia pinnata',
      namaInggris: 'Island Lychee',
      jenis: 'flora' as const,
      kingdom: 'Plantae',
      filum: 'Tracheophyta',
      kelas: 'Magnoliopsida',
      ordo: 'Sapindales',
      famili: 'Sapindaceae',
      genus: 'Pometia',
      statusIucn: 'LC' as const,
      statusPerlindungan: 'TIDAK_DILINDUNGI' as const,
      statusCites: 'NON_APPENDIX' as const,
      statusKeberadaan: 'NATIVE' as const,
      habitat: 'Hutan primer dan sekunder dataran rendah tepi aliran sungai.',
      deskripsi: 'Pohon buah asli Indonesia timur berbatang tinggi dengan akar papan kokoh.',
      fotoUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
    },
    {
      namaLokal: 'Ketapang Kencana',
      namaIlmiah: 'Terminalia mantaly',
      namaInggris: 'Madagascar Almond',
      jenis: 'flora' as const,
      kingdom: 'Plantae',
      filum: 'Tracheophyta',
      kelas: 'Magnoliopsida',
      ordo: 'Myrtales',
      famili: 'Combretaceae',
      genus: 'Terminalia',
      statusIucn: 'LC' as const,
      statusPerlindungan: 'TIDAK_DILINDUNGI' as const,
      statusCites: 'NON_APPENDIX' as const,
      statusKeberadaan: 'INTRODUCED' as const,
      habitat: 'Zona penyangga (buffer strip), area industri, dan taman terbuka.',
      deskripsi: 'Pohon peneduh berkarakter arsitektural dengan cabang mendatar bertingkat rapi sebagai penahan debu.',
      fotoUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    },
    {
      namaLokal: 'Sukun',
      namaIlmiah: 'Artocarpus altilis',
      namaInggris: 'Breadfruit',
      jenis: 'flora' as const,
      kingdom: 'Plantae',
      filum: 'Tracheophyta',
      kelas: 'Magnoliopsida',
      ordo: 'Rosales',
      famili: 'Moraceae',
      genus: 'Artocarpus',
      statusIucn: 'LC' as const,
      statusPerlindungan: 'TIDAK_DILINDUNGI' as const,
      statusCites: 'NON_APPENDIX' as const,
      statusKeberadaan: 'NATIVE' as const,
      habitat: 'Dataran rendah tropis beriklim basah dekat sumber air.',
      deskripsi: 'Pohon bertajuk rindang berdaun menjari lebar dengan getah putih pekat dan buah berkarbohidrat tinggi.',
      fotoUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const species = new Map<string, { id: string; jenis: string }>();
  for (const s of speciesDefs) {
    const existing = await prisma.species.findFirst({ where: { namaLokal: s.namaLokal } });
    const saved = existing
      ? await prisma.species.update({ where: { id: existing.id }, data: s })
      : await prisma.species.create({ data: s });

    species.set(s.namaLokal, { id: saved.id, jenis: saved.jenis });
  }

  // 4. Data historis 2021-2025: Jalak Bali & Kura-kura Forsteni
  //    (sesuai tabel "Data Pendukung" & "Tabel Rekap Absolut" pada dokumen referensi)
  const jalakBaliData: Record<number, number> = { 2021: 3, 2022: 3, 2023: 3, 2024: 5, 2025: 5 };
  const kuraKuraData: Record<number, number> = { 2021: 2, 2022: 2, 2023: 2, 2024: 4, 2025: 12 };
  // Data historis Ketapang Kencana (mewakili flora) dari "Penanaman Pohon di Area PLTD/G Tello"
  const ketapangKencanaData: Record<number, number> = { 2021: 55, 2022: 55, 2023: 55, 2024: 56, 2025: 64 };
  const manggaData: Record<number, number> = { 2021: 27, 2022: 27, 2023: 27, 2024: 30, 2025: 80 };

  const jalakBali = species.get('Jalak Bali')!;
  const kuraKura = species.get('Kura-kura Forsteni')!;
  const ketapangKencana = species.get('Ketapang Kencana')!;
  const mangga = species.get('Mangga')!;

  async function seedRecordSeries(speciesId: string, dataPerTahun: Record<number, number>) {
    for (const [tahunStr, jumlah] of Object.entries(dataPerTahun)) {
      const tahun = Number(tahunStr);
      const periodId = periods.get(tahun)!;
      const existing = await prisma.speciesRecord.findFirst({ where: { speciesId, periodId } });
      if (existing) continue;
      await prisma.speciesRecord.create({
        data: {
          speciesId,
          periodId,
          jumlahIndividu: jumlah,
          status: 'published',
          inputBy: petugas.id,
          verifiedBy: admin.id,
        },
      });
    }
  }

  await seedRecordSeries(jalakBali.id, jalakBaliData);
  await seedRecordSeries(kuraKura.id, kuraKuraData);
  await seedRecordSeries(ketapangKencana.id, ketapangKencanaData);
  await seedRecordSeries(mangga.id, manggaData);

  // 5. Hitung Indeks Shannon-Wiener untuk setiap periode berdasarkan data yang baru di-seed
  for (const tahun of periods.keys()) {
    const periodId = periods.get(tahun)!;
    const records = await prisma.speciesRecord.findMany({ where: { periodId, status: 'published' } });
    const totalN = records.reduce(
      (sum: number, r: (typeof records)[number]) => sum + r.jumlahIndividu,
      0
    );
    if (totalN === 0) continue;

    for (const record of records) {
      const { pi, lnPi, hValue } = calculateSpeciesIndex(record.jumlahIndividu, totalN);
      await prisma.biodiversityIndex.upsert({
        where: { speciesRecordId: record.id },
        update: { pi, lnPi, hValue },
        create: { speciesRecordId: record.id, pi, lnPi, hValue },
      });
    }
  }

  // 6. Program konservasi (sesuai tabel "Program Absolut" pada dokumen referensi)
  const programDefs = [
    {
      nama: 'Pembuatan Sarang Konvensional Burung Jalak Bali dan Kura-Kura Forsteni',
      deskripsi:
        'Program pengembangbiakan burung Jalak Bali dan Kura-Kura Forsteni yang terancam punah melalui pembuatan sarang konvensional, pemeliharaan, serta monitoring dan evaluasi berkala.',
      anggaran: 30096135,
    },
    {
      nama: 'Kawasan Konservasi dan Ekowisata Penyu Sumingi Kabupaten Kepulauan Selayar',
      deskripsi:
        'Inisiatif pelestarian penyu untuk memastikan keberlanjutan keanekaragaman hayati melalui pembuatan sarang penetasan telur dan pemulihan populasi penyu di Pantai Sumingi Selayar.',
      anggaran: 105202505,
    },
    {
      nama: 'Stripped Nipah River Restoration',
      deskripsi:
        'Upaya perbaikan lingkungan melalui penanaman pohon di aliran sungai Tello untuk mengurangi erosi, mencegah banjir, dan meningkatkan kualitas perairan.',
      anggaran: 63990000,
    },
    {
      nama: 'Program Agroforesty Kelompok Tani Hutan Ujung Bulu',
      deskripsi:
        'Integrasi pohon dan tanaman pertanian (aren, pala, kopi) untuk menciptakan sistem pertanian produktif dan berkelanjutan bagi masyarakat adat kawasan Taman Nasional Bantimurung Bulusaraung.',
      anggaran: 104797370,
    },
    {
      nama: 'Penanaman Pohon Di Area PLTD/G Tello',
      deskripsi:
        'Langkah proaktif mengurangi dampak lingkungan dari operasi pembangkit listrik sekaligus memperbaiki kualitas hidup masyarakat sekitar melalui penanaman berbagai jenis pohon.',
      anggaran: 109605900,
    },
    {
      nama: 'Budidaya Tanaman Sayur KSIP BSU Lavender',
      deskripsi:
        'Inisiatif pemberdayaan masyarakat untuk meningkatkan ketahanan pangan melalui budidaya sayuran konsumsi di lahan pekarangan rumah kelompok BSU Lavender.',
      anggaran: 2500000,
    },
    {
      nama: 'Vegetative Buffer Strip Dengan Integrasi Biodiversity Green Belt',
      deskripsi:
        'Penciptaan zona penyangga alami (green corridor) di sepanjang batas area pembangkit untuk meningkatkan fungsi ekologi dan menjadi habitat keanekaragaman hayati lokal.',
      anggaran: 1481000,
    },
  ];

  for (const p of programDefs) {
    const existing = await prisma.program.findFirst({ where: { nama: p.nama } });
    if (existing) continue;
    await prisma.program.create({
      data: { ...p, status: 'published', createdBy: admin.id },
    });
  }

  // 7. Kategori & item galeri (sesuai halaman "Galeri PLTD/G Tello" pada dokumen referensi)
  const galleryDefs = [
    { kategori: 'Aviari', judul: 'Aviari PLTD/G Tello' },
    { kategori: 'Penanaman Pohon', judul: 'Penanaman Pohon' },
    { kategori: 'Konservasi Penyu', judul: 'Konservasi Penyu' },
    { kategori: 'Panen Sayur', judul: 'Panen Sayur' },
    { kategori: 'Agroforesty', judul: 'Agroforesty' },
    { kategori: 'Pelepasan Penyu', judul: 'Pelepasan Penyu' },
  ];

  for (const g of galleryDefs) {
    const existingCategory = await prisma.galleryCategory.findFirst({ where: { namaKategori: g.kategori } });
    const category = existingCategory ?? (await prisma.galleryCategory.create({ data: { namaKategori: g.kategori } }));

    const existingItem = await prisma.gallery.findFirst({ where: { judul: g.judul } });
    if (existingItem) continue;

    await prisma.gallery.create({
      data: {
        judul: g.judul,
        fileUrl: `https://placehold.co/600x400?text=${encodeURIComponent(g.judul)}`,
        categoryId: category.id,
        uploadedBy: admin.id,
      },
    });
  }

  console.log('Seed selesai.');
  console.log('Akun demo (password: password123):');
  console.log('- Super Admin :', superAdmin.email);
  console.log('- Admin       :', admin.email);
  console.log('- Petugas     :', petugas.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
