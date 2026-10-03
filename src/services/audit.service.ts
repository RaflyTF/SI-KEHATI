// import { prisma } from '@/lib/prisma';

// // Dipanggil di akhir proses oleh service lain (speciesRecord, program, users)
// // setiap kali ada perubahan data penting -> jejak audit terpusat & konsisten,
// // tidak perlu ditulis manual berulang-ulang di tiap fungsi bisnis.
// export async function recordAuditLog(params: {
//   userId: string;
//   aksi: 'create' | 'update' | 'delete' | 'publish' | 'reject';
//   tabelTerkait: string;
//   dataSebelum?: unknown;
//   dataSesudah?: unknown;
// }) {
//   await prisma.auditLog.create({
//     data: {
//       userId: params.userId,
//       aksi: params.aksi,
//       tabelTerkait: params.tabelTerkait,
//       dataSebelum: params.dataSebelum as never,
//       dataSesudah: params.dataSesudah as never,
//     },
//   });
// }


// Kode Baru

import { prisma } from '@/lib/prisma';

// Dipanggil di akhir proses oleh service lain (speciesRecord, program, users)
// setiap kali ada perubahan data penting -> jejak audit terpusat & konsisten,
// tidak perlu ditulis manual berulang-ulang di tiap fungsi bisnis.
export async function recordAuditLog(params: {
  userId: string;
  aksi: 'create' | 'update' | 'delete' | 'publish' | 'reject' | 'deactivate' | 'activate';
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

// Mengambil seluruh riwayat perubahan untuk SATU record tertentu (dicari lewat
// field "id" di dalam snapshot dataSebelum/dataSesudah, karena audit_logs tidak
// menyimpan record_id sebagai kolom terpisah -- cukup satu tabel generik untuk
// seluruh entitas, bukan tabel riwayat khusus per modul).
export function getAuditHistoryForRecord(tabelTerkait: string, recordId: string) {
  return prisma.auditLog.findMany({
    where: {
      tabelTerkait,
      OR: [
        { dataSebelum: { path: ['id'], equals: recordId } },
        { dataSesudah: { path: ['id'], equals: recordId } },
      ],
    },
    include: { user: { select: { nama: true, role: true } } },
    orderBy: { createdAt: 'desc' },
  });
}