import { prisma } from '@/lib/prisma';
import { calculateSpeciesIndex, calculateTotalIndex } from '@/services/biodiversityIndex.service';

export interface ProgramBiodiversityPeriod {
  id: string;
  tahun: number;
  label: string | null;
}

export interface ProgramBiodiversitySpeciesRow {
  speciesId: string;
  namaLokal: string;
  namaIlmiah: string;
  jenis: string;
  // Kunci object = periodId -- satu baris "data pendukung" (jumlahIndividu)
  // sekaligus hasil hitungannya (pi, lnPi, hValue), per periode/tahun.
  byPeriod: Record<
    string,
    { dataId: string; jumlahIndividu: number; pi: number; lnPi: number; hValue: number } | undefined
  >;
}


export interface ProgramBiodiversityData {
  periods: ProgramBiodiversityPeriod[];
  species: ProgramBiodiversitySpeciesRow[];
  // Total per periode -- dipakai baris "Total" di tabel & sumbu Y grafik.
  totals: Record<string, { totalIndividu: number; totalH: number }>;
}

/**
 * Mengambil seluruh ProgramSpeciesData milik satu program, lalu menghitung
 * Pi/ln(Pi)/H' SECARA DINAMIS (tidak disimpan di database) untuk setiap
 * baris spesies-periode. Reuse penuh calculateSpeciesIndex() dari
 * biodiversityIndex.service.ts -- rumus yang sama persis yang sudah dipakai
 * untuk SpeciesRecord sejak Sprint 1, supaya tidak ada 2 implementasi rumus
 * Shannon-Wiener yang berbeda di codebase yang sama.
 *
 * PENTING: N (total individu) dihitung TERPISAH per program -- artinya
 * konteks perhitungan di sini adalah "keanekaragaman di dalam program ini
 * saja", BUKAN keanekaragaman situs-lebar (yang dihitung dari SpeciesRecord
 * di speciesRecord.service.ts). Keduanya sengaja independen satu sama lain.
 */
export async function getProgramBiodiversityData(programId: string): Promise<ProgramBiodiversityData> {
  const rows = await prisma.programSpeciesData.findMany({
    where: { programId },
    include: { species: true, period: true },
    orderBy: [{ period: { tahun: 'asc' } }, { species: { namaLokal: 'asc' } }],
  });

  // Kumpulkan daftar periode unik yang benar-benar punya data untuk program ini.
  const periodMap = new Map<string, ProgramBiodiversityPeriod>();
  for (const row of rows) {
    if (!periodMap.has(row.periodId)) {
      periodMap.set(row.periodId, { id: row.period.id, tahun: row.period.tahun, label: row.period.label });
    }
  }
  const periods = Array.from(periodMap.values()).sort((a, b) => a.tahun - b.tahun);

  // Total individu (N) per periode -- dijumlahkan lintas SEMUA spesies pada
  // periode yang sama, dalam program yang sama. Kalau N = 0 untuk periode
  // tertentu (jarang terjadi, tapi bisa kalau semua baris di periode itu
  // kebetulan bernilai 0), Pi/H' untuk periode itu aman diisi 0 -- BUKAN
  // dibiarkan memicu pembagian dengan nol.
  const totalByPeriod = new Map<string, number>();
  for (const row of rows) {
    totalByPeriod.set(row.periodId, (totalByPeriod.get(row.periodId) ?? 0) + row.jumlahIndividu);
  }

  // Kelompokkan baris per spesies, supaya 1 spesies = 1 baris tabel dengan
  // kolom per tahun (struktur "pivot" yang dibutuhkan tabel Data Pendukung
  // & Rekapitulasi).
  const speciesMap = new Map<string, ProgramBiodiversitySpeciesRow>();
  for (const row of rows) {
    if (!speciesMap.has(row.speciesId)) {
      speciesMap.set(row.speciesId, {
        speciesId: row.species.id,
        namaLokal: row.species.namaLokal,
        namaIlmiah: row.species.namaIlmiah,
        jenis: row.species.jenis,
        byPeriod: {},
      });
    }

    const totalN = totalByPeriod.get(row.periodId) ?? 0;
    const { pi, lnPi, hValue } =
      totalN > 0 ? calculateSpeciesIndex(row.jumlahIndividu, totalN) : { pi: 0, lnPi: 0, hValue: 0 };

    speciesMap.get(row.speciesId)!.byPeriod[row.periodId] = {
      dataId: row.id,
      jumlahIndividu: row.jumlahIndividu,
      pi,
      lnPi,
      hValue,
    };
  }

  // Total H' per periode = jumlah kontribusi H' seluruh spesies pada periode itu.
  const totals: Record<string, { totalIndividu: number; totalH: number }> = {};
  for (const period of periods) {
    const hValues = Array.from(speciesMap.values())
      .map((s) => s.byPeriod[period.id]?.hValue)
      .filter((v): v is number => v !== undefined);

    totals[period.id] = {
      totalIndividu: totalByPeriod.get(period.id) ?? 0,
      totalH: calculateTotalIndex(hValues),
    };
  }

  return {
    periods,
    species: Array.from(speciesMap.values()),
    totals,
  };
}