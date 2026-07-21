import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (role !== 'admin' && role !== 'super_admin') {
    return NextResponse.json({ success: false, message: 'Tidak diizinkan.' }, { status: 403 });
  }

  const [totalSpecies, totalPrograms, publishedRecords, pendingCount] = await Promise.all([
    prisma.species.count(),
    prisma.program.count({ where: { status: 'published' } }),
    prisma.speciesRecord.findMany({
      where: { status: 'published' },
      include: { species: true, period: true, index: true },
    }),
    prisma.speciesRecord.count({ where: { status: 'pending' } }),
  ]);

  // Agregasi total individu flora & fauna per periode, untuk grafik trendline.
  const trendMap = new Map<string, { periode: string; flora: number; fauna: number }>();
  for (const record of publishedRecords) {
    const key = `${record.period.tahun}-${record.period.semester}`;
    const label = record.period.label ?? String(record.period.tahun);
    if (!trendMap.has(key)) trendMap.set(key, { periode: label, flora: 0, fauna: 0 });
    const entry = trendMap.get(key)!;
    if (record.species.jenis === 'flora') entry.flora += record.jumlahIndividu;
    else entry.fauna += record.jumlahIndividu;
  }

  // Agregasi total Indeks H' per periode, untuk grafik indeks keanekaragaman.
  const indexMap = new Map<string, { periode: string; flora: number; fauna: number }>();
  for (const record of publishedRecords) {
    if (!record.index) continue;
    const key = `${record.period.tahun}-${record.period.semester}`;
    const label = record.period.label ?? String(record.period.tahun);
    if (!indexMap.has(key)) indexMap.set(key, { periode: label, flora: 0, fauna: 0 });
    const entry = indexMap.get(key)!;
    if (record.species.jenis === 'flora') entry.flora += record.index.hValue;
    else entry.fauna += record.index.hValue;
  }

  return NextResponse.json({
    success: true,
    data: {
      totalSpecies,
      totalPrograms,
      totalPublishedRecords: publishedRecords.length,
      pendingCount,
      trendline: Array.from(trendMap.values()),
      biodiversityIndex: Array.from(indexMap.values()),
    },
  });
}
