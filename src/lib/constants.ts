// Mapping status -> label & warna badge terpusat.
// Dipakai oleh StatusBadge di berbagai halaman (data monitoring, program)
// agar warna status selalu konsisten, sesuai prinsip reusable component pada SDD.
export const RECORD_STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  pending: 'Menunggu verifikasi',
  published: 'Published',
  rejected: 'Ditolak',
};

export const RECORD_STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  pending: 'bg-amber-100 text-amber-800',
  published: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export const ROLE_LABELS: Record<string, string> = {
  petugas_lapangan: 'Petugas Lapangan',
  admin: 'Admin',
  super_admin: 'Super Admin',
};

// Label aksi audit log -- dipakai di tampilan "Riwayat Perubahan" (Data
// Monitoring, Verifikasi, dan modul lain yang menampilkan audit trail).
export const AUDIT_ACTION_LABELS: Record<string, string> = {
  create: 'Dibuat',
  update: 'Diperbarui',
  delete: 'Dihapus',
  publish: 'Disetujui & dipublikasikan',
  reject: 'Ditolak',
};