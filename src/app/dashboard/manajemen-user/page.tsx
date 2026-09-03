// // 'use client';

// // import { useEffect, useState } from 'react';
// // import { Card } from '@/components/ui/Card';
// // import { Skeleton } from '@/components/ui/Skeleton';
// // import { Input } from '@/components/ui/Input';
// // import { Select } from '@/components/ui/Select';
// // import { Button } from '@/components/ui/Button';
// // import { ROLE_LABELS } from '@/lib/constants';
// // import { useToast } from '@/components/providers/ToastProvider';

// // interface UserRow {
// //   id: string;
// //   nama: string;
// //   email: string;
// //   role: string;
// //   isActive: boolean;
// // }

// // export default function ManajemenUserPage() {
// //   const [users, setUsers] = useState<UserRow[]>([]);
// //   const [nama, setNama] = useState('');
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [role, setRole] = useState('petugas_lapangan');
// //   const [error, setError] = useState('');
// //   const [loading, setLoading] = useState(true);
// //   const toast = useToast();

// //   function load() {
// //     setLoading(true);
// //     fetch('/api/users')
// //       .then(async (res) => {
// //         const json = await res.json();
// //         if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal memuat daftar akun.');
// //         return json;
// //       })
// //       .then((json) => setUsers(json.data ?? []))
// //       .catch((err) => setError(err instanceof Error ? err.message : 'Gagal memuat daftar akun.'))
// //       .finally(() => setLoading(false));
// //   }

// //   useEffect(() => {
// //     load();
// //   }, []);

// //   async function handleSubmit(e: React.FormEvent) {
// //     e.preventDefault();
// //     setError('');
// //     try {
// //       const res = await fetch('/api/users', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ nama, email, password, role }),
// //       });
// //       const json = await res.json();
// //       if (!res.ok || !json.success) {
// //         const message = json.message ?? 'Gagal menambah akun.';
// //         setError(message);
// //         toast.error(message);
// //         return;
// //       }
// //       toast.success(`Akun "${nama}" berhasil dibuat.`);
// //       setNama('');
// //       setEmail('');
// //       setPassword('');
// //       load();
// //     } catch {
// //       const message = 'Terjadi kesalahan jaringan. Silakan coba lagi.';
// //       setError(message);
// //       toast.error(message);
// //     }
// //   }

// //   async function deactivate(id: string, namaUser: string) {
// //     if (!confirm(`Nonaktifkan akun "${namaUser}"?`)) return;
// //     try {
// //       const res = await fetch(`/api/users/${id}/deactivate`, { method: 'PATCH' });
// //       const json = await res.json();
// //       if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal menonaktifkan akun.');
// //       toast.success(`Akun "${namaUser}" berhasil dinonaktifkan.`);
// //       load();
// //     } catch (err) {
// //       const message = err instanceof Error ? err.message : 'Gagal menonaktifkan akun.';
// //       setError(message);
// //       toast.error(message);
// //     }
// //   }

// //   return (
// //     <div className="space-y-6">
// //       <h1 className="text-xl font-semibold">Manajemen Akun Pengguna</h1>

// //       <Card className="max-w-xl">
// //         <h2 className="text-sm font-medium mb-4">Tambah Akun Baru</h2>
// //         <form onSubmit={handleSubmit}>
// //           <Input label="Nama" value={nama} onChange={(e) => setNama(e.target.value)} required />
// //           <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
// //           <Input
// //             label="Password"
// //             type="password"
// //             value={password}
// //             onChange={(e) => setPassword(e.target.value)}
// //             required
// //           />
// //           <Select label="Role" value={role} onChange={(e) => setRole(e.target.value)}>
// //             <option value="petugas_lapangan">Petugas Lapangan</option>
// //             <option value="admin">Admin</option>
// //             <option value="super_admin">Super Admin</option>
// //           </Select>
// //           {error && <p className="text-sm text-danger mb-4">{error}</p>}
// //           <Button type="submit">Tambah Akun</Button>
// //         </form>
// //       </Card>

// //       <Card>
// //         <h2 className="text-sm font-medium mb-4">Daftar Akun</h2>
// //         <table className="w-full text-sm">
// //           <thead>
// //             <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
// //               <th className="py-2 pr-4">Nama</th>
// //               <th className="py-2 pr-4">Email</th>
// //               <th className="py-2 pr-4">Role</th>
// //               <th className="py-2 pr-4">Status</th>
// //               <th className="py-2 pr-4">Aksi</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {loading &&
// //               Array.from({ length: 3 }).map((_, i) => (
// //                 <tr key={i} className="border-b border-gray-100 dark:border-gray-900">
// //                   <td className="py-3 pr-4"><Skeleton className="h-4 w-24" /></td>
// //                   <td className="py-3 pr-4"><Skeleton className="h-4 w-32" /></td>
// //                   <td className="py-3 pr-4"><Skeleton className="h-4 w-20" /></td>
// //                   <td className="py-3 pr-4"><Skeleton className="h-4 w-14" /></td>
// //                   <td className="py-3 pr-4"><Skeleton className="h-4 w-16" /></td>
// //                 </tr>
// //               ))}
// //             {!loading && users.map((u) => (
// //               <tr key={u.id} className="border-b border-gray-100 dark:border-gray-900">
// //                 <td className="py-2 pr-4">{u.nama}</td>
// //                 <td className="py-2 pr-4">{u.email}</td>
// //                 <td className="py-2 pr-4">{ROLE_LABELS[u.role] ?? u.role}</td>
// //                 <td className="py-2 pr-4">{u.isActive ? 'Aktif' : 'Nonaktif'}</td>
// //                 <td className="py-2 pr-4">
// //                   {u.isActive && (
// //                     <Button variant="danger" onClick={() => deactivate(u.id, u.nama)}>
// //                       Nonaktifkan
// //                     </Button>
// //                   )}
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </Card>
// //     </div>
// //   );
// // }


// // Kode Baru

// 'use client';

// import { useEffect, useState } from 'react';
// import { Card } from '@/components/ui/Card';
// import { Input } from '@/components/ui/Input';
// import { Select } from '@/components/ui/Select';
// import { Button } from '@/components/ui/Button';
// import { Skeleton } from '@/components/ui/Skeleton';
// import { EmptyState } from '@/components/ui/EmptyState';
// import { ROLE_LABELS } from '@/lib/constants';
// import { useToast } from '@/components/providers/ToastProvider';

// interface UserRow {
//   id: string;
//   nama: string;
//   email: string;
//   role: string;
//   isActive: boolean;
// }

// export default function ManajemenUserPage() {
//   const [users, setUsers] = useState<UserRow[]>([]);
//   const [nama, setNama] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('petugas_lapangan');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const toast = useToast();

//   function load() {
//     setLoading(true);
//     fetch('/api/users')
//       .then(async (res) => {
//         const json = await res.json();
//         if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal memuat daftar akun.');
//         return json;
//       })
//       .then((json) => setUsers(json.data ?? []))
//       .catch((err) => setError(err instanceof Error ? err.message : 'Gagal memuat daftar akun.'))
//       .finally(() => setLoading(false));
//   }

//   useEffect(() => {
//     load();
//   }, []);

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setError('');
//     try {
//       const res = await fetch('/api/users', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ nama, email, password, role }),
//       });
//       const json = await res.json();
//       if (!res.ok || !json.success) {
//         const message = json.message ?? 'Gagal menambah akun.';
//         setError(message);
//         toast.error(message);
//         return;
//       }
//       toast.success(`Akun "${nama}" berhasil dibuat.`);
//       setNama('');
//       setEmail('');
//       setPassword('');
//       load();
//     } catch {
//       const message = 'Terjadi kesalahan jaringan. Silakan coba lagi.';
//       setError(message);
//       toast.error(message);
//     }
//   }

//   async function deactivate(id: string, namaUser: string) {
//     if (!confirm(`Nonaktifkan akun "${namaUser}"?`)) return;
//     try {
//       const res = await fetch(`/api/users/${id}/deactivate`, { method: 'PATCH' });
//       const json = await res.json();
//       if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal menonaktifkan akun.');
//       toast.success(`Akun "${namaUser}" berhasil dinonaktifkan.`);
//       load();
//     } catch (err) {
//       const message = err instanceof Error ? err.message : 'Gagal menonaktifkan akun.';
//       setError(message);
//       toast.error(message);
//     }
//   }

//   return (
//     <div className="space-y-4 md:space-y-6">
//       <h1 className="text-lg md:text-xl font-semibold">Manajemen Akun Pengguna</h1>

//       <Card className="max-w-xl" padding="p-4 md:p-5">
//         <h2 className="text-sm font-medium mb-4">Tambah Akun Baru</h2>
//         <form onSubmit={handleSubmit}>
//           <Input label="Nama" value={nama} onChange={(e) => setNama(e.target.value)} required />
//           <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//           <Input
//             label="Password"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//           <Select label="Role" value={role} onChange={(e) => setRole(e.target.value)}>
//             <option value="petugas_lapangan">Petugas Lapangan</option>
//             <option value="admin">Admin</option>
//             <option value="super_admin">Super Admin</option>
//           </Select>
//           {error && <p className="text-sm text-danger mb-4">{error}</p>}
//           <Button type="submit" className="w-full sm:w-auto">
//             Tambah Akun
//           </Button>
//         </form>
//       </Card>

//       <Card padding="p-4 md:p-5">
//         <h2 className="text-sm font-medium mb-4">Daftar Akun</h2>

//         {loading ? (
//           <div className="space-y-3">
//             <Skeleton className="h-14 w-full" />
//             <Skeleton className="h-14 w-full" />
//             <Skeleton className="h-14 w-full" />
//           </div>
//         ) : users.length === 0 ? (
//           <EmptyState title="Belum ada akun pengguna" description="Tambahkan akun pertama lewat form di atas." />
//         ) : (
//           <>
//             {/* Desktop & tablet: tabel */}
//             <div className="hidden md:block overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
//                     <th className="py-2 pr-4">Nama</th>
//                     <th className="py-2 pr-4">Email</th>
//                     <th className="py-2 pr-4">Role</th>
//                     <th className="py-2 pr-4">Status</th>
//                     <th className="py-2 pr-4">Aksi</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {users.map((u) => (
//                     <tr key={u.id} className="border-b border-gray-100 dark:border-gray-900">
//                       <td className="py-2 pr-4">{u.nama}</td>
//                       <td className="py-2 pr-4">{u.email}</td>
//                       <td className="py-2 pr-4">{ROLE_LABELS[u.role] ?? u.role}</td>
//                       <td className="py-2 pr-4">{u.isActive ? 'Aktif' : 'Nonaktif'}</td>
//                       <td className="py-2 pr-4">
//                         {u.isActive && (
//                           <Button variant="danger" onClick={() => deactivate(u.id, u.nama)}>
//                             Nonaktifkan
//                           </Button>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Mobile: card, tanpa horizontal scroll */}
//             <div className="md:hidden flex flex-col gap-3">
//               {users.map((u) => (
//                 <div key={u.id} className="rounded-lg border border-gray-200 dark:border-gray-800 p-3">
//                   <div className="flex items-start justify-between gap-2 mb-1">
//                     <p className="text-sm font-medium truncate">{u.nama}</p>
//                     <span
//                       className={`text-xs shrink-0 px-2 py-0.5 rounded-full ${
//                         u.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
//                       }`}
//                     >
//                       {u.isActive ? 'Aktif' : 'Nonaktif'}
//                     </span>
//                   </div>
//                   <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-1">{u.email}</p>
//                   <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{ROLE_LABELS[u.role] ?? u.role}</p>
//                   {u.isActive && (
//                     <Button variant="danger" className="w-full" onClick={() => deactivate(u.id, u.nama)}>
//                       Nonaktifkan
//                     </Button>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </Card>
//     </div>
//   );
// }

// Kode Baru 

'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { UserForm } from '@/components/forms/UserForm';
import { ResetPasswordDialog } from '@/components/features/ResetPasswordDialog';
import { useToast } from '@/components/providers/ToastProvider';
import { ROLE_LABELS } from '@/lib/constants';

interface UserRow {
  id: string;
  nama: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface UserDeletionInfo extends UserRow {
  _count: { inputRecords: number; verifiedRecords: number; programs: number; galleryItems: number; auditLogs: number };
}

export default function ManajemenUserPage() {
  const { data: session } = useSession();
  const ownId = (session?.user as { id?: string } | undefined)?.id;
  const toast = useToast();

  const [users, setUsers] = useState<UserRow[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [editTarget, setEditTarget] = useState<UserRow | null>(null);
  const [resetPasswordTarget, setResetPasswordTarget] = useState<UserRow | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null);
  const [deleteInfo, setDeleteInfo] = useState<UserDeletionInfo | null>(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const [togglingId, setTogglingId] = useState<string | null>(null);

  function load() {
    setLoading(true);
    fetch('/api/users')
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal memuat daftar akun.');
        return json;
      })
      .then((json) => {
        setError('');
        setUsers(json.data ?? []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Gagal memuat daftar akun.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleActive(user: UserRow) {
    setTogglingId(user.id);
    try {
      const endpoint = user.isActive ? 'deactivate' : 'activate';
      const res = await fetch(`/api/users/${user.id}/${endpoint}`, { method: 'PATCH' });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal mengubah status akun.');
      toast.success(
        user.isActive ? `Akun "${user.nama}" berhasil dinonaktifkan.` : `Akun "${user.nama}" berhasil diaktifkan kembali.`
      );
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal mengubah status akun.');
    } finally {
      setTogglingId(null);
    }
  }

  function openDelete(user: UserRow) {
    setDeleteTarget(user);
    setDeleteInfo(null);
    setDeleteError('');
    fetch(`/api/users/${user.id}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal memuat info akun.');
        setDeleteInfo(json.data);
      })
      .catch((err) => {
        toast.error(err instanceof Error ? err.message : 'Gagal memuat info akun.');
        setDeleteTarget(null);
      });
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError('');
    try {
      const res = await fetch(`/api/users/${deleteTarget.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal menghapus akun.');
      toast.success(`Akun "${deleteTarget.nama}" berhasil dihapus permanen.`);
      setDeleteTarget(null);
      load();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal menghapus akun.';
      setDeleteError(message);
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  }

  const totalRelated = (info: UserDeletionInfo) =>
    info._count.inputRecords + info._count.verifiedRecords + info._count.programs + info._count.galleryItems + info._count.auditLogs;

  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-lg md:text-xl font-semibold">Manajemen Akun Pengguna</h1>

      <Card className="max-w-xl" padding="p-4 md:p-5">
        <h2 className="text-sm font-medium mb-4">Tambah Akun Baru</h2>
        <UserForm onSuccess={load} />
      </Card>

      <Card padding="p-4 md:p-5">
        <h2 className="text-sm font-medium mb-4">Daftar Akun</h2>
        {error && <p className="text-sm text-danger mb-3">{error}</p>}

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : users.length === 0 ? (
          <EmptyState title="Belum ada akun pengguna" description="Tambahkan akun pertama lewat form di atas." />
        ) : (
          <>
            {/* Desktop & tablet: tabel */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                    <th className="py-2 pr-4">Nama</th>
                    <th className="py-2 pr-4">Email</th>
                    <th className="py-2 pr-4">Role</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const isSelf = u.id === ownId;
                    return (
                      <tr key={u.id} className="border-b border-gray-100 dark:border-gray-900">
                        <td className="py-2 pr-4">
                          {u.nama} {isSelf && <span className="text-xs text-gray-400">(Anda)</span>}
                        </td>
                        <td className="py-2 pr-4">{u.email}</td>
                        <td className="py-2 pr-4">{ROLE_LABELS[u.role] ?? u.role}</td>
                        <td className="py-2 pr-4">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              u.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {u.isActive ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </td>
                        <td className="py-2 pr-4">
                          <div className="flex gap-2 flex-wrap">
                            <Button variant="secondary" onClick={() => setEditTarget(u)}>
                              Edit
                            </Button>
                            <Button variant="secondary" onClick={() => setResetPasswordTarget(u)}>
                              Reset Password
                            </Button>
                            {!isSelf && (
                              <Button
                                variant="secondary"
                                disabled={togglingId === u.id}
                                onClick={() => toggleActive(u)}
                              >
                                {u.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                              </Button>
                            )}
                            {!isSelf && (
                              <Button variant="danger" onClick={() => openDelete(u)}>
                                Hapus
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile: card, tanpa horizontal scroll */}
            <div className="md:hidden flex flex-col gap-3">
              {users.map((u) => {
                const isSelf = u.id === ownId;
                return (
                  <div key={u.id} className="rounded-lg border border-gray-200 dark:border-gray-800 p-3">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-medium truncate">
                        {u.nama} {isSelf && <span className="text-xs text-gray-400">(Anda)</span>}
                      </p>
                      <span
                        className={`text-xs shrink-0 px-2 py-0.5 rounded-full ${
                          u.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {u.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-1">{u.email}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{ROLE_LABELS[u.role] ?? u.role}</p>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="secondary" className="flex-1" onClick={() => setEditTarget(u)}>
                        Edit
                      </Button>
                      <Button variant="secondary" className="flex-1" onClick={() => setResetPasswordTarget(u)}>
                        Reset Password
                      </Button>
                      {!isSelf && (
                        <Button
                          variant="secondary"
                          className="flex-1"
                          disabled={togglingId === u.id}
                          onClick={() => toggleActive(u)}
                        >
                          {u.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                        </Button>
                      )}
                      {!isSelf && (
                        <Button variant="danger" className="flex-1" onClick={() => openDelete(u)}>
                          Hapus
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Card>

      {/* Modal Edit */}
      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title={`Edit Akun: ${editTarget?.nama ?? ''}`}>
        {editTarget && (
          <UserForm
            mode="edit"
            userId={editTarget.id}
            initialValues={{ nama: editTarget.nama, email: editTarget.email, role: editTarget.role }}
            onCancel={() => setEditTarget(null)}
            onSuccess={() => {
              setEditTarget(null);
              load();
            }}
          />
        )}
      </Modal>

      {/* Dialog Reset Password */}
      <ResetPasswordDialog
        open={!!resetPasswordTarget}
        onClose={() => setResetPasswordTarget(null)}
        userId={resetPasswordTarget?.id ?? null}
        userName={resetPasswordTarget?.nama}
      />

      {/* Dialog Konfirmasi Hapus -- transparan + bisa gagal dengan pesan jelas
          (mis. masih punya data terkait, atau Super Admin terakhir) */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        error={deleteError}
        title="Hapus Akun Permanen?"
        description={`Apakah Anda yakin ingin menghapus akun "${deleteTarget?.nama}" secara permanen?`}
        details={
          deleteInfo
            ? [
                { label: 'Nama', value: deleteInfo.nama },
                { label: 'Email', value: deleteInfo.email },
                { label: 'Role', value: ROLE_LABELS[deleteInfo.role] ?? deleteInfo.role },
                { label: 'Status', value: deleteInfo.isActive ? 'Aktif' : 'Nonaktif' },
                {
                  label: 'Tanggal dibuat',
                  value: new Date(deleteInfo.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  }),
                },
                { label: 'Total data terkait', value: String(totalRelated(deleteInfo)) },
              ]
            : deleteTarget
              ? [{ label: 'Nama', value: deleteTarget.nama }]
              : []
        }
      />
    </div>
  );
}