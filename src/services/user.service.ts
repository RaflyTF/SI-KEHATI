import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { recordAuditLog } from '@/services/audit.service';

const USER_LIST_SELECT = { id: true, nama: true, email: true, role: true, isActive: true, createdAt: true } as const;

export function getAllUsers() {
  return prisma.user.findMany({ select: USER_LIST_SELECT, orderBy: { createdAt: 'desc' } });
}

// Dipakai untuk 2 kebutuhan: (1) info sebelum konfirmasi hapus (transparansi),
// dan (2) menentukan apakah akun boleh dihapus permanen (lihat penjelasan
// "totalRelated" di deleteUser).
export function getUserWithRelatedCounts(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      ...USER_LIST_SELECT,
      _count: {
        select: { inputRecords: true, verifiedRecords: true, programs: true, galleryItems: true, auditLogs: true },
      },
    },
  });
}

export async function createUser(
  data: { nama: string; email: string; password: string; role: string },
  actorId: string
) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new Error('Email sudah terdaftar.');

  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: { nama: data.nama, email: data.email, passwordHash, role: data.role as never },
    select: USER_LIST_SELECT,
  });

  await recordAuditLog({ userId: actorId, aksi: 'create', tabelTerkait: 'users', dataSesudah: user });
  return user;
}

// Mengubah nama/email/role. Kalau role diubah DARI super_admin ke role lain,
// aturan "minimal 1 Super Admin aktif" berlaku sama seperti saat menonaktifkan
// atau menghapus -- karena efeknya sama: sistem kehilangan seorang Super Admin.
export async function updateUser(
  id: string,
  data: Partial<{ nama: string; email: string; role: string }>,
  actorId: string
) {
  const before = await prisma.user.findUnique({ where: { id } });
  if (!before) throw new Error('Akun tidak ditemukan.');

  if (data.email && data.email !== before.email) {
    const existing = await prisma.user.findFirst({ where: { email: data.email, NOT: { id } } });
    if (existing) throw new Error('Email sudah digunakan oleh akun lain.');
  }

  if (before.role === 'super_admin' && data.role && data.role !== 'super_admin' && before.isActive) {
    await assertNotLastActiveSuperAdmin('Tidak dapat mengubah role Super Admin terakhir yang aktif.');
  }

  const after = await prisma.user.update({
    where: { id },
    data: data as never,
    select: USER_LIST_SELECT,
  });

  await recordAuditLog({ userId: actorId, aksi: 'update', tabelTerkait: 'users', dataSebelum: before, dataSesudah: after });
  return after;
}

// Reset password TIDAK menyimpan password lama/baru ke audit log (baik plain
// text maupun hash) -- itu risiko keamanan. Audit log cukup mencatat BAHWA
// aksi reset terjadi, oleh siapa, dan kapan.
export async function resetUserPassword(id: string, newPassword: string, actorId: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error('Akun tidak ditemukan.');

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id }, data: { passwordHash } });

  await recordAuditLog({
    userId: actorId,
    aksi: 'update',
    tabelTerkait: 'users',
    dataSebelum: { id: user.id, email: user.email, aksi: 'reset_password' },
    dataSesudah: { id: user.id, email: user.email, aksi: 'reset_password' },
  });
}

export async function deactivateUser(id: string, actorId: string) {
  if (id === actorId) throw new Error('Anda tidak dapat menonaktifkan akun Anda sendiri.');

  const before = await prisma.user.findUnique({ where: { id } });
  if (!before) throw new Error('Akun tidak ditemukan.');

  if (before.role === 'super_admin' && before.isActive) {
    await assertNotLastActiveSuperAdmin('Tidak dapat menonaktifkan Super Admin terakhir yang aktif.');
  }

  const after = await prisma.user.update({ where: { id }, data: { isActive: false }, select: USER_LIST_SELECT });
  await recordAuditLog({ userId: actorId, aksi: 'deactivate', tabelTerkait: 'users', dataSebelum: before, dataSesudah: after });
  return after;
}

export async function activateUser(id: string, actorId: string) {
  const before = await prisma.user.findUnique({ where: { id } });
  if (!before) throw new Error('Akun tidak ditemukan.');

  const after = await prisma.user.update({ where: { id }, data: { isActive: true }, select: USER_LIST_SELECT });
  await recordAuditLog({ userId: actorId, aksi: 'activate', tabelTerkait: 'users', dataSebelum: before, dataSesudah: after });
  return after;
}

// Hapus permanen -- dengan 3 lapis proteksi:
// 1. Tidak boleh menghapus akun sendiri (requirement eksplisit Sprint 2).
// 2. Tidak boleh menghapus Super Admin terakhir yang aktif.
// 3. Tidak boleh menghapus akun yang masih punya data historis terkait
//    (data monitoring, program, galeri, atau jejak audit) -- karena TIDAK
//    ADA cascade delete untuk relasi ini (dan memang sengaja tidak dibuat,
//    supaya menghapus akun tidak ikut menghancurkan data historis institusi).
//    Kalau akun punya data terkait, sarankan nonaktifkan saja.
export async function deleteUser(id: string, actorId: string) {
  if (id === actorId) throw new Error('Anda tidak dapat menghapus akun Anda sendiri.');

  const target = await getUserWithRelatedCounts(id);
  if (!target) throw new Error('Akun tidak ditemukan.');

  if (target.role === 'super_admin' && target.isActive) {
    await assertNotLastActiveSuperAdmin('Tidak dapat menghapus Super Admin terakhir yang aktif.');
  }

  const totalRelated =
    target._count.inputRecords +
    target._count.verifiedRecords +
    target._count.programs +
    target._count.galleryItems +
    target._count.auditLogs;

  if (totalRelated > 0) {
    throw new Error(
      `Akun ini memiliki ${totalRelated} data terkait (data monitoring, program, galeri, atau riwayat aktivitas) dan tidak dapat dihapus permanen. Nonaktifkan akun ini untuk menjaga integritas data historis.`
    );
  }

  await prisma.user.delete({ where: { id } });
  await recordAuditLog({ userId: actorId, aksi: 'delete', tabelTerkait: 'users', dataSebelum: target });
}

async function assertNotLastActiveSuperAdmin(message: string) {
  const activeSuperAdmins = await prisma.user.count({ where: { role: 'super_admin', isActive: true } });
  if (activeSuperAdmins <= 1) throw new Error(message);
}