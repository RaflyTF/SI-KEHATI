import { prisma } from '@/lib/prisma';
import { recordAuditLog } from '@/services/audit.service';

export async function createProgramPhoto(
  programId: string,
  data: { fileUrl: string; caption?: string | null },
  actorId: string
) {
  const program = await prisma.program.findUnique({ where: { id: programId } });
  if (!program) throw new Error('Program tidak ditemukan.');

  const photo = await prisma.programPhoto.create({
    data: { programId, fileUrl: data.fileUrl, caption: data.caption ?? null },
  });

  await recordAuditLog({ userId: actorId, aksi: 'create', tabelTerkait: 'program_photos', dataSesudah: photo });
  return photo;
}

export async function deleteProgramPhoto(id: string, actorId: string) {
  const before = await prisma.programPhoto.findUnique({ where: { id } });
  if (!before) throw new Error('Foto tidak ditemukan.');

  await prisma.programPhoto.delete({ where: { id } });

  await recordAuditLog({ userId: actorId, aksi: 'delete', tabelTerkait: 'program_photos', dataSebelum: before });
}