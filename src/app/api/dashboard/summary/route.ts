import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Cek session dan role
    const session = await getServerSession(authOptions);
    const role = (session?.user as { role?: string } | undefined)?.role;

    if (role !== 'admin' && role !== 'super_admin') {
      return NextResponse.json(
        {
          success: false,
          message: 'Tidak diizinkan.',
        },
        { status: 403 }
      );
    }

    // Ambil data utama secara bersamaan
    const [
      totalSpecies,
      totalPrograms,
      publishedRecords,
      pendingCount,
    ] = await Promise.all([
      // Total seluruh spesies
      prisma.species.count(),

      // Total program yang sudah published
      prisma.program.count({
        where: {
          status: 'published',
        },
      }),

      // Data spesies yang sudah published
      // Hanya periode tahun 2022–2026
      prisma.speciesRecord.findMany({
        where: {
          status: 'published',
          period: {
            tahun: {
              gte: 2022,
              lte: 2026,
            },
          },
        },
        include: {
          species: true,
          period: true,
          index: true,
        },
        orderBy: [
          {
            period: {
              tahun: 'asc',
            },
          },
        ],
      }),

      // Jumlah data yang masih pending
      prisma.speciesRecord.count({
        where: {
          status: 'pending',
        },
      }),
    ]);

    /*
     * ============================================================
     * TRENDLINE FLORA & FAUNA
     * ============================================================
     *
     * Dibuat sama seperti grafik Status Flora & Fauna:
     * - Tahun 2022 sampai 2026
     * - Satu data untuk setiap tahun
     * - Flora = total jumlah individu flora
     * - Fauna = total jumlah individu fauna
     *
     * Tahun yang belum mempunyai data tetap ditampilkan
     * dengan nilai 0.
     */

    const trendMap = new Map<
      number,
      {
        periode: string;
        flora: number;
        fauna: number;
      }
    >();

    // Selalu siapkan tahun 2022–2026
    for (let tahun = 2022; tahun <= 2026; tahun++) {
      trendMap.set(tahun, {
        periode: String(tahun),
        flora: 0,
        fauna: 0,
      });
    }

    // Masukkan data published ke dalam tahun masing-masing
    for (const record of publishedRecords) {
      const tahun = record.period.tahun;

      const entry = trendMap.get(tahun);

      if (!entry) continue;

      if (record.species.jenis === 'flora') {
        entry.flora += record.jumlahIndividu;
      } else if (record.species.jenis === 'fauna') {
        entry.fauna += record.jumlahIndividu;
      }
    }

    const trendline = Array.from(trendMap.values());

    /*
     * ============================================================
     * INDEKS KEANEKARAGAMAN
     * ============================================================
     *
     * Dibuat mengikuti grafik Status Flora & Fauna:
     * - Tahun 2022 sampai 2026
     * - Flora dan fauna dipisahkan
     * - Nilai hValue dijumlahkan berdasarkan tahun
     * - Tahun tanpa data tetap bernilai 0
     */

    const indexMap = new Map<
      number,
      {
        periode: string;
        flora: number;
        fauna: number;
      }
    >();

    // Selalu siapkan tahun 2022–2026
    for (let tahun = 2022; tahun <= 2026; tahun++) {
      indexMap.set(tahun, {
        periode: String(tahun),
        flora: 0,
        fauna: 0,
      });
    }

    // Masukkan nilai indeks berdasarkan tahun
    for (const record of publishedRecords) {
      const tahun = record.period.tahun;

      const entry = indexMap.get(tahun);

      if (!entry) continue;

      // Jika belum ada index, lewati
      if (!record.index) continue;

      if (record.species.jenis === 'flora') {
        entry.flora += record.index.hValue;
      } else if (record.species.jenis === 'fauna') {
        entry.fauna += record.index.hValue;
      }
    }

    /*
     * Pembulatan nilai indeks agar tampil rapi,
     * sama seperti hasil perhitungan indeks.
     */
    const biodiversityIndex = Array.from(indexMap.values()).map((item) => ({
      periode: item.periode,
      flora: Number(item.flora.toFixed(4)),
      fauna: Number(item.fauna.toFixed(4)),
    }));

    /*
     * ============================================================
     * RESPONSE
     * ============================================================
     */

    return NextResponse.json({
      success: true,
      data: {
        totalSpecies,
        totalPrograms,
        totalPublishedRecords: publishedRecords.length,
        pendingCount,

        // Grafik Trendline Flora & Fauna
        trendline,

        // Grafik Indeks Keanekaragaman
        biodiversityIndex,
      },
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Gagal memuat ringkasan dashboard.',
      },
      { status: 500 }
    );
  }
}