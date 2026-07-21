import { prisma } from '@/lib/prisma';

// Dipanggil di akhir proses oleh service lain (speciesRecord, program, users)
// setiap kali ada perubahan data penting -> jejak audit terpusat & konsisten,
// tidak perlu ditulis manual berulang-ulang di tiap fungsi bisnis.
export async function recordAuditLog(params: {
  userId: string;
  aksi: 'create' | 'update' | 'delete' | 'publish' | 'reject';
  tabelTerkait: string;
  dataSebelum?: unknown;
  dataSesudah?: unknown;
}) {
  await prisma.auditLog.create({
    data: {
      userId: params.userId,
      aksi: params.aksi,
      tabelTerkait: params.tabelTerkait,
      dataSebelum: params.dataSebelum as never,
      dataSesudah: params.dataSesudah as never,
    },
  });
}
