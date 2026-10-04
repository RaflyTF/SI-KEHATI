import { prisma } from '@/lib/prisma';
import {
  calculateSpeciesIndex,
  calculateTotalIndex,
} from '@/services/biodiversityIndex.service';

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
  byPeriod: Record<
    string,
    {
      dataId: string;
      jumlahIndividu: number;
      pi: number;
      lnPi: number;
      hValue: number;
    } | undefined
  >;
}

export interface ProgramBiodiversityData {
  periods: ProgramBiodiversityPeriod[];
  species: ProgramBiodiversitySpeciesRow[];
  totals: Record<
    string,
    {
      totalIndividu: number;
      totalH: number;
    }
  >;
}

export async function getProgramBiodiversityData(
  programId: string
): Promise<ProgramBiodiversityData> {
  /**
   * Data Pendukung:
   * 1 baris = 1 nama daerah.
   *
   * Setiap baris memiliki jumlah individu:
   * 2022, 2023, 2024, 2025, 2026.
   */
  const rows = await prisma.programSupportingData.findMany({
    where: { programId },
    orderBy: { namaDaerah: 'asc' },
  });

  /**
   * Periode yang digunakan dalam perhitungan.
   */
  const periods: ProgramBiodiversityPeriod[] = [
    {
      id: '2022',
      tahun: 2022,
      label: '2022',
    },
    {
      id: '2023',
      tahun: 2023,
      label: '2023',
    },
    {
      id: '2024',
      tahun: 2024,
      label: '2024',
    },
    {
      id: '2025',
      tahun: 2025,
      label: '2025',
    },
    {
      id: '2026',
      tahun: 2026,
      label: '2026',
    },
  ];

  /**
   * Mengambil jumlah individu berdasarkan tahun.
   */
  function getJumlahIndividu(
    row: (typeof rows)[number],
    tahun: number
  ): number {
    switch (tahun) {
      case 2022:
        return row.jumlah2022;
      case 2023:
        return row.jumlah2023;
      case 2024:
        return row.jumlah2024;
      case 2025:
        return row.jumlah2025;
      case 2026:
        return row.jumlah2026;
      default:
        return 0;
    }
  }

  /**
   * Menghitung total individu (N) setiap tahun.
   *
   * N = jumlah seluruh individu dari semua nama daerah
   * pada tahun yang sama.
   */
  const totals: Record<
    string,
    {
      totalIndividu: number;
      totalH: number;
    }
  > = {};

  for (const period of periods) {
    const totalN = rows.reduce(
      (sum, row) => sum + getJumlahIndividu(row, period.tahun),
      0
    );

    /**
     * Hitung kontribusi H' masing-masing nama daerah.
     */
    const hValues = rows.map((row) => {
      const jumlahIndividu = getJumlahIndividu(
        row,
        period.tahun
      );

      if (totalN <= 0 || jumlahIndividu <= 0) {
        return 0;
      }

      const { hValue } = calculateSpeciesIndex(
        jumlahIndividu,
        totalN
      );

      return hValue;
    });

    totals[period.id] = {
      totalIndividu: totalN,
      totalH: calculateTotalIndex(hValues),
    };
  }

  /**
   * Bentuk data setiap nama daerah.
   *
   * Nama daerah diperlakukan sebagai unit yang dihitung
   * dalam indeks Shannon-Wiener.
   */
  const species: ProgramBiodiversitySpeciesRow[] = rows.map(
    (row) => {
      const byPeriod: ProgramBiodiversitySpeciesRow['byPeriod'] =
        {};

      for (const period of periods) {
        const jumlahIndividu = getJumlahIndividu(
          row,
          period.tahun
        );

        const totalN =
          totals[period.id]?.totalIndividu ?? 0;

        if (totalN <= 0 || jumlahIndividu <= 0) {
          byPeriod[period.id] = {
            dataId: row.id,
            jumlahIndividu,
            pi: 0,
            lnPi: 0,
            hValue: 0,
          };

          continue;
        }

        const { pi, lnPi, hValue } =
          calculateSpeciesIndex(
            jumlahIndividu,
            totalN
          );

        byPeriod[period.id] = {
          dataId: row.id,
          jumlahIndividu,
          pi,
          lnPi,
          hValue,
        };
      }

      return {
        speciesId: row.id,
        namaLokal: row.namaDaerah,
        namaIlmiah: '',
        jenis: '',
        byPeriod,
      };
    }
  );

  return {
    periods,
    species,
    totals,
  };
}