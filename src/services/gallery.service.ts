// import { prisma } from '@/lib/prisma';
// import { recordAuditLog } from '@/services/audit.service';

// export function getGalleryItems(categoryId?: string) {
//   return prisma.gallery.findMany({
//     where: categoryId ? { categoryId } : undefined,
//     include: { category: true },
//     orderBy: { createdAt: 'desc' },
//   });
// }

// export function getGalleryCategories() {
//   return prisma.galleryCategory.findMany({ orderBy: { namaKategori: 'asc' } });
// }

// export async function createGalleryItem(
//   data: { judul: string; fileUrl: string; categoryId: string },
//   userId: string
// ) {
//   const item = await prisma.gallery.create({ data: { ...data, uploadedBy: userId } });
//   await recordAuditLog({ userId, aksi: 'create', tabelTerkait: 'gallery', dataSesudah: item });
//   return item;
// }

// export async function deleteGalleryItem(id: string, userId: string) {
//   const before = await prisma.gallery.findUnique({ where: { id } });
//   await prisma.gallery.delete({ where: { id } });
//   await recordAuditLog({ userId, aksi: 'delete', tabelTerkait: 'gallery', dataSebelum: before });
// }


// Kode Baru

import { prisma } from '@/lib/prisma';
import { recordAuditLog } from '@/services/audit.service';

interface GalleryListParams {
  categoryId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

// Mendukung filter kategori, pencarian judul, dan pagination sekaligus.
// Pagination bersifat OPT-IN: jika "page" tidak diberikan sama sekali,
// seluruh data dikembalikan tanpa dipotong -- ini menjaga kompatibilitas
// dengan pemanggil lama (mis. halaman publik) yang belum butuh pagination.
export async function getGalleryItems(params: GalleryListParams = {}) {
  const { categoryId, search, page, pageSize = 8 } = params;
  const paginate = typeof page === 'number';

  const where = {
    ...(categoryId ? { categoryId } : {}),
    ...(search ? { judul: { contains: search, mode: 'insensitive' as const } } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.gallery.findMany({
      where,
      include: { category: true, uploader: { select: { nama: true } } },
      orderBy: { createdAt: 'desc' },
      ...(paginate ? { skip: ((page as number) - 1) * pageSize, take: pageSize } : {}),
    }),
    prisma.gallery.count({ where }),
  ]);

  return {
    items,
    total,
    page: page ?? 1,
    pageSize,
    totalPages: paginate ? Math.max(1, Math.ceil(total / pageSize)) : 1,
  };
}

export function getGalleryItemById(id: string) {
  return prisma.gallery.findUnique({
    where: { id },
    include: { category: true, uploader: { select: { nama: true } } },
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

export async function updateGalleryItem(
  id: string,
  data: Partial<{ judul: string; fileUrl: string; categoryId: string }>,
  userId: string
) {
  const before = await prisma.gallery.findUnique({ where: { id } });
  if (!before) throw new Error('Foto tidak ditemukan.');
  const after = await prisma.gallery.update({ where: { id }, data });
  await recordAuditLog({
    userId,
    aksi: 'update',
    tabelTerkait: 'gallery',
    dataSebelum: before,
    dataSesudah: after,
  });
  return after;
}

export async function deleteGalleryItem(id: string, userId: string) {
  const before = await prisma.gallery.findUnique({
    where: { id },
    include: { category: true, uploader: { select: { nama: true } } },
  });
  if (!before) throw new Error('Foto tidak ditemukan.');
  await prisma.gallery.delete({ where: { id } });
  await recordAuditLog({ userId, aksi: 'delete', tabelTerkait: 'gallery', dataSebelum: before });
}