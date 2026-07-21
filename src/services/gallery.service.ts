import { prisma } from '@/lib/prisma';
import { recordAuditLog } from '@/services/audit.service';

export function getGalleryItems(categoryId?: string) {
  return prisma.gallery.findMany({
    where: categoryId ? { categoryId } : undefined,
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });
}

export function getGalleryCategories() {
  return prisma.galleryCategory.findMany({ orderBy: { namaKategori: 'asc' } });
}

export async function createGalleryItem(
  data: { judul: string; fileUrl: string; categoryId: string },
  userId: string
) {
  const item = await prisma.gallery.create({ data: { ...data, uploadedBy: userId } });
  await recordAuditLog({ userId, aksi: 'create', tabelTerkait: 'gallery', dataSesudah: item });
  return item;
}

export async function deleteGalleryItem(id: string, userId: string) {
  const before = await prisma.gallery.findUnique({ where: { id } });
  await prisma.gallery.delete({ where: { id } });
  await recordAuditLog({ userId, aksi: 'delete', tabelTerkait: 'gallery', dataSebelum: before });
}
