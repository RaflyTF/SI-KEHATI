// import { prisma } from '@/lib/prisma';
// import { recordAuditLog } from '@/services/audit.service';

// export function getPublishedPrograms() {
//   return prisma.program.findMany({
//     where: { status: 'published' },
//     include: { photos: true },
//     orderBy: { createdAt: 'desc' },
//   });
// }

// export function getProgramById(id: string) {
//   return prisma.program.findUnique({
//     where: { id },
//     include: { photos: true, speciesData: { include: { species: true, period: true } } },
//   });
// }

// export async function createProgram(
//   data: { nama: string; deskripsi: string; anggaran: number; status: 'draft' | 'published' },
//   userId: string
// ) {
//   const program = await prisma.program.create({ data: { ...data, createdBy: userId } });
//   await recordAuditLog({ userId, aksi: 'create', tabelTerkait: 'programs', dataSesudah: program });
//   return program;
// }

// export async function updateProgram(
//   id: string,
//   data: Partial<{ nama: string; deskripsi: string; anggaran: number; status: 'draft' | 'published' }>,
//   userId: string
// ) {
//   const before = await prisma.program.findUnique({ where: { id } });
//   const after = await prisma.program.update({ where: { id }, data });
//   await recordAuditLog({
//     userId,
//     aksi: 'update',
//     tabelTerkait: 'programs',
//     dataSebelum: before,
//     dataSesudah: after,
//   });
//   return after;
// }

// export async function deleteProgram(id: string, userId: string) {
//   const before = await prisma.program.findUnique({ where: { id } });
//   await prisma.program.delete({ where: { id } });
//   await recordAuditLog({ userId, aksi: 'delete', tabelTerkait: 'programs', dataSebelum: before });
// }


// Kode Baru

import { prisma } from '@/lib/prisma';
import { recordAuditLog } from '@/services/audit.service';

import {
  calculateSpeciesIndex,
  calculateTotalIndex,
} from '@/services/biodiversityIndex.service';


// =====================================================
// PROGRAM
// =====================================================

export function getPublishedPrograms() {
  return prisma.program.findMany({
    where: {
      status: 'published',
    },
    include: {
      photos: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}


// Untuk Admin / Super Admin
export function getAllPrograms() {
  return prisma.program.findMany({
    include: {
      photos: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}


export function getProgramById(id: string) {
  return prisma.program.findUnique({
    where: {
      id,
    },
    include: {
      photos: true,
      speciesData: {
        include: {
          species: true,
          period: true,
        },
      },
    },
  });
}


export async function createProgram(
  data: {
    nama: string;
    deskripsi: string;
    anggaran: number;
    status: 'draft' | 'published';
  },
  userId: string
) {
  const program = await prisma.program.create({
    data: {
      ...data,
      createdBy: userId,
    },
  });

  await recordAuditLog({
    userId,
    aksi: 'create',
    tabelTerkait: 'programs',
    dataSesudah: program,
  });

  return program;
}


export async function updateProgram(
  id: string,
  data: Partial<{
    nama: string;
    deskripsi: string;
    anggaran: number;
    status: 'draft' | 'published';
  }>,
  userId: string
) {
  const before = await prisma.program.findUnique({
    where: {
      id,
    },
  });

  const after = await prisma.program.update({
    where: {
      id,
    },
    data,
  });

  await recordAuditLog({
    userId,
    aksi: 'update',
    tabelTerkait: 'programs',
    dataSebelum: before,
    dataSesudah: after,
  });

  return after;
}


export async function deleteProgram(
  id: string,
  userId: string
) {
  const before = await prisma.program.findUnique({
    where: {
      id,
    },
  });

  await prisma.program.delete({
    where: {
      id,
    },
  });

  await recordAuditLog({
    userId,
    aksi: 'delete',
    tabelTerkait: 'programs',
    dataSebelum: before,
  });
}


// =====================================================
// BIODIVERSITY DATA
// =====================================================

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

  const rows =
    await prisma.programSupportingData.findMany({
      where: {
        programId,
      },
      orderBy: {
        namaDaerah: 'asc',
      },
    });


  // ===================================================
  // PERIODE
  // ===================================================

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


  // ===================================================
  // AMBIL JUMLAH INDIVIDU
  // ===================================================

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


  // ===================================================
  // TOTAL
  // ===================================================

  const totals: Record<
    string,
    {
      totalIndividu: number;
      totalH: number;
    }
  > = {};


  for (const period of periods) {

const totalN = rows.reduce(
      (sum: number, row) =>
        sum +
        getJumlahIndividu(
          row,
          period.tahun
        ),
      0
    );


    const hValues = rows.map((row) => {

      const jumlahIndividu =
        getJumlahIndividu(
          row,
          period.tahun
        );


      if (
        totalN <= 0 ||
        jumlahIndividu <= 0
      ) {
        return 0;
      }


      const { hValue } =
        calculateSpeciesIndex(
          jumlahIndividu,
          totalN
        );


      return hValue;
    });


    totals[period.id] = {
      totalIndividu: totalN,
      totalH: calculateTotalIndex(
        hValues
      ),
    };
  }


  // ===================================================
  // SPECIES / DATA PENDUKUNG
  // ===================================================

  const species: ProgramBiodiversitySpeciesRow[] =
    rows.map((row) => {

      const byPeriod: ProgramBiodiversitySpeciesRow['byPeriod'] =
        {};


      for (const period of periods) {

        const jumlahIndividu =
          getJumlahIndividu(
            row,
            period.tahun
          );


        const totalN =
          totals[period.id]
            ?.totalIndividu ?? 0;


        if (
          totalN <= 0 ||
          jumlahIndividu <= 0
        ) {

          byPeriod[period.id] = {
            dataId: row.id,
            jumlahIndividu,
            pi: 0,
            lnPi: 0,
            hValue: 0,
          };

          continue;
        }


        const {
          pi,
          lnPi,
          hValue,
        } = calculateSpeciesIndex(
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
    });


  return {
    periods,
    species,
    totals,
  };
}