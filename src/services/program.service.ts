import { prisma } from '@/lib/prisma';
import { recordAuditLog } from '@/services/audit.service';

export function getPublishedPrograms() {
  return prisma.program.findMany({
    where: { status: 'published' },
    include: { photos: true },
    orderBy: { createdAt: 'desc' },
  });
}

export function getProgramById(id: string) {
  return prisma.program.findUnique({
    where: { id },
    include: { photos: true, speciesData: { include: { species: true, period: true } } },
  });
}

export async function createProgram(
  data: { nama: string; deskripsi: string; anggaran: number; status: 'draft' | 'published' },
  userId: string
) {
  const program = await prisma.program.create({ data: { ...data, createdBy: userId } });
  await recordAuditLog({ userId, aksi: 'create', tabelTerkait: 'programs', dataSesudah: program });
  return program;
}

export async function updateProgram(
  id: string,
  data: Partial<{ nama: string; deskripsi: string; anggaran: number; status: 'draft' | 'published' }>,
  userId: string
) {
  const before = await prisma.program.findUnique({ where: { id } });
  const after = await prisma.program.update({ where: { id }, data });
  await recordAuditLog({
    userId,
    aksi: 'update',
    tabelTerkait: 'programs',
    dataSebelum: before,
    dataSesudah: after,
  });
  return after;
}

export async function deleteProgram(id: string, userId: string) {
  const before = await prisma.program.findUnique({ where: { id } });
  await prisma.program.delete({ where: { id } });
  await recordAuditLog({ userId, aksi: 'delete', tabelTerkait: 'programs', dataSebelum: before });
}
