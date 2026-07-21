import { prisma } from '@/lib/prisma';
import { RecordStatus } from '@prisma/client';

// Repository Pattern: satu-satunya titik akses Prisma untuk entitas SpeciesRecord.
// Jika suatu saat ORM/database berpindah, hanya file ini yang perlu direvisi.
export const speciesRecordRepository = {
  findByStatus(status: RecordStatus) {
    return prisma.speciesRecord.findMany({
      where: { status },
      include: { species: true, period: true, inputter: true, index: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  // Digunakan HANYA oleh halaman publik. Status "published" di-hardcode di sini,
  // bukan diterima sebagai parameter dari client (Security Design pada SDD).
  findPublished() {
    return prisma.speciesRecord.findMany({
      where: { status: 'published' },
      include: { species: true, period: true, index: true },
      orderBy: [{ period: { tahun: 'asc' } }],
    });
  },

  findById(id: string) {
    return prisma.speciesRecord.findUnique({
      where: { id },
      include: { species: true, period: true, inputter: true, index: true },
    });
  },

  // Status awal langsung "pending" (menunggu verifikasi Admin) begitu Petugas
  // Lapangan submit — tidak ada tahap "simpan draft dulu" terpisah pada versi ini
  // agar alur tetap sederhana; nilai enum "draft" tetap disediakan di skema
  // untuk kebutuhan pengembangan lanjutan (mis. simpan sementara sebelum submit).
  create(data: { speciesId: string; periodId: string; jumlahIndividu: number; inputBy: string }) {
    return prisma.speciesRecord.create({
      data: { ...data, status: 'pending' },
    });
  },

  update(id: string, data: { jumlahIndividu?: number; speciesId?: string; periodId?: string }) {
    return prisma.speciesRecord.update({ where: { id }, data });
  },

  updateStatus(
    id: string,
    status: RecordStatus,
    extra: { verifiedBy?: string; catatanRevisi?: string } = {}
  ) {
    return prisma.speciesRecord.update({ where: { id }, data: { status, ...extra } });
  },

  // Total individu SEMUA spesies pada satu periode -> dipakai sebagai
  // penyebut (N) dalam rumus Shannon-Wiener.
  async sumIndividuByPeriod(periodId: string): Promise<number> {
    const result = await prisma.speciesRecord.aggregate({
      where: { periodId, status: 'published' },
      _sum: { jumlahIndividu: true },
    });
    return result._sum.jumlahIndividu ?? 0;
  },

};
