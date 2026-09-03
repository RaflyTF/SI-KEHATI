// // 'use client';

// // import { useEffect, useState } from 'react';
// // import { Card } from '@/components/ui/Card';
// // import { Skeleton } from '@/components/ui/Skeleton';
// // import { Badge } from '@/components/ui/Badge';
// // import { Button } from '@/components/ui/Button';
// // import { ProgramForm } from '@/components/forms/ProgramForm';
// // import { useToast } from '@/components/providers/ToastProvider';

// // interface ProgramRow {
// //   id: string;
// //   nama: string;
// //   anggaran: number;
// //   status: string;
// // }

// // export default function ProgramManagementPage() {
// //   const [programs, setPrograms] = useState<ProgramRow[]>([]);
// //   const [error, setError] = useState('');
// //   const [loading, setLoading] = useState(true);
// //   const toast = useToast();

// // function load() {
// //     setLoading(true);
// //     fetch('/api/programs?all=true')
// //       .then(async (res) => {
// //         const json = await res.json();
// //         if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal memuat daftar program.');
// //         return json;
// //       })
// //       .then((json) => {
// //         setError('');
// //         setPrograms(json.data ?? []);
// //       })
// //       .catch((err) => setError(err instanceof Error ? err.message : 'Gagal memuat daftar program.'))
// //       .finally(() => setLoading(false));
// //   }

// //   useEffect(() => {
// //     load();
// //   }, []);

// //   async function remove(id: string, namaProgram: string) {
// //     if (!confirm(`Hapus program "${namaProgram}"?`)) return;
// //     try {
// //       const res = await fetch(`/api/programs/${id}`, { method: 'DELETE' });
// //       const json = await res.json();
// //       if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal menghapus program.');
// //       toast.success(`Program "${namaProgram}" berhasil dihapus.`);
// //       load();
// //     } catch (err) {
// //       const message = err instanceof Error ? err.message : 'Gagal menghapus program.';
// //       setError(message);
// //       toast.error(message);
// //     }
// //   }

// //   return (
// //     <div className="space-y-6">
// //       <h1 className="text-xl font-semibold">Kelola Program Konservasi</h1>

// //       <Card className="max-w-xl">
// //         <h2 className="text-sm font-medium mb-4">Tambah Program Baru</h2>
// //         <ProgramForm onSuccess={load} />
// //       </Card>

// //       <Card>
// //         <h2 className="text-sm font-medium mb-4">Daftar Program</h2>
// //         {error && <p className="text-sm text-danger mb-3">{error}</p>}
// //         <table className="w-full text-sm">
// //           <thead>
// //             <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
// //               <th className="py-2 pr-4">Nama</th>
// //               <th className="py-2 pr-4">Anggaran</th>
// //               <th className="py-2 pr-4">Status</th>
// //               <th className="py-2 pr-4">Aksi</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {loading &&
// //               Array.from({ length: 3 }).map((_, i) => (
// //                 <tr key={i} className="border-b border-gray-100 dark:border-gray-900">
// //                   <td className="py-3 pr-4"><Skeleton className="h-4 w-32" /></td>
// //                   <td className="py-3 pr-4"><Skeleton className="h-4 w-24" /></td>
// //                   <td className="py-3 pr-4"><Skeleton className="h-4 w-16" /></td>
// //                   <td className="py-3 pr-4"><Skeleton className="h-4 w-14" /></td>
// //                 </tr>
// //               ))}
// //             {!loading && programs.map((p) => (
// //               <tr key={p.id} className="border-b border-gray-100 dark:border-gray-900">
// //                 <td className="py-2 pr-4">{p.nama}</td>
// //                 <td className="py-2 pr-4">Rp {p.anggaran.toLocaleString('id-ID')}</td>
// //                 <td className="py-2 pr-4">
// //                   <Badge
// //                     status={p.status}
// //                     labels={{ draft: 'Draft', published: 'Published' }}
// //                     colors={{ draft: 'bg-gray-100 text-gray-700', published: 'bg-green-100 text-green-800' }}
// //                   />
// //                 </td>
// //                 <td className="py-2 pr-4">
// //                   <Button variant="danger" onClick={() => remove(p.id, p.nama)}>
// //                     Hapus
// //                   </Button>
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
// import { Badge } from '@/components/ui/Badge';
// import { Button } from '@/components/ui/Button';
// import { Skeleton } from '@/components/ui/Skeleton';
// import { EmptyState } from '@/components/ui/EmptyState';
// import { ProgramForm } from '@/components/forms/ProgramForm';
// import { useToast } from '@/components/providers/ToastProvider';

// interface ProgramRow {
//   id: string;
//   nama: string;
//   anggaran: number;
//   status: string;
// }

// const STATUS_LABELS = { draft: 'Draft', published: 'Published' };
// const STATUS_COLORS = { draft: 'bg-gray-100 text-gray-700', published: 'bg-green-100 text-green-800' };

// export default function ProgramManagementPage() {
//   const [programs, setPrograms] = useState<ProgramRow[]>([]);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const toast = useToast();

//   function load() {
//     setLoading(true);
//     fetch('/api/programs?all=true')
//       .then(async (res) => {
//         const json = await res.json();
//         if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal memuat daftar program.');
//         return json;
//       })
//       .then((json) => {
//         setError('');
//         setPrograms(json.data ?? []);
//       })
//       .catch((err) => setError(err instanceof Error ? err.message : 'Gagal memuat daftar program.'))
//       .finally(() => setLoading(false));
//   }

//   useEffect(() => {
//     load();
//   }, []);

//   async function remove(id: string, namaProgram: string) {
//     if (!confirm(`Hapus program "${namaProgram}"?`)) return;
//     try {
//       const res = await fetch(`/api/programs/${id}`, { method: 'DELETE' });
//       const json = await res.json();
//       if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal menghapus program.');
//       toast.success(`Program "${namaProgram}" berhasil dihapus.`);
//       load();
//     } catch (err) {
//       const message = err instanceof Error ? err.message : 'Gagal menghapus program.';
//       setError(message);
//       toast.error(message);
//     }
//   }

//   return (
//     <div className="space-y-4 md:space-y-6">
//       <h1 className="text-lg md:text-xl font-semibold">Kelola Program Konservasi</h1>

//       <Card className="max-w-xl" padding="p-4 md:p-5">
//         <h2 className="text-sm font-medium mb-4">Tambah Program Baru</h2>
//         <ProgramForm onSuccess={load} />
//       </Card>

//       <Card padding="p-4 md:p-5">
//         <h2 className="text-sm font-medium mb-4">Daftar Program</h2>
//         {error && <p className="text-sm text-danger mb-3">{error}</p>}

//         {loading ? (
//           <div className="space-y-3">
//             <Skeleton className="h-14 w-full" />
//             <Skeleton className="h-14 w-full" />
//             <Skeleton className="h-14 w-full" />
//           </div>
//         ) : programs.length === 0 ? (
//           <EmptyState title="Belum ada program konservasi" description="Tambahkan program pertama lewat form di atas." />
//         ) : (
//           <>
//             {/* Desktop & tablet: tabel */}
//             <div className="hidden md:block overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
//                     <th className="py-2 pr-4">Nama</th>
//                     <th className="py-2 pr-4">Anggaran</th>
//                     <th className="py-2 pr-4">Status</th>
//                     <th className="py-2 pr-4">Aksi</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {programs.map((p) => (
//                     <tr key={p.id} className="border-b border-gray-100 dark:border-gray-900">
//                       <td className="py-2 pr-4">{p.nama}</td>
//                       <td className="py-2 pr-4">Rp {p.anggaran.toLocaleString('id-ID')}</td>
//                       <td className="py-2 pr-4">
//                         <Badge status={p.status} labels={STATUS_LABELS} colors={STATUS_COLORS} />
//                       </td>
//                       <td className="py-2 pr-4">
//                         <Button variant="danger" onClick={() => remove(p.id, p.nama)}>
//                           Hapus
//                         </Button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Mobile: card, tanpa horizontal scroll */}
//             <div className="md:hidden flex flex-col gap-3">
//               {programs.map((p) => (
//                 <div key={p.id} className="rounded-lg border border-gray-200 dark:border-gray-800 p-3">
//                   <div className="flex items-start justify-between gap-2 mb-2">
//                     <p className="text-sm font-medium">{p.nama}</p>
//                     <Badge status={p.status} labels={STATUS_LABELS} colors={STATUS_COLORS} />
//                   </div>
//                   <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
//                     Rp {p.anggaran.toLocaleString('id-ID')}
//                   </p>
//                   <Button variant="danger" className="w-full" onClick={() => remove(p.id, p.nama)}>
//                     Hapus
//                   </Button>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </Card>
//     </div>
//   );
// }

// Kode Baru 2

'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ProgramForm } from '@/components/forms/ProgramForm';
import { ProgramDetailModal } from '@/components/features/ProgramDetailModal';
import { useToast } from '@/components/providers/ToastProvider';

interface ProgramRow {
  id: string;
  nama: string;
  deskripsi: string;
  anggaran: number;
  status: string;
  createdAt: string;
  creator: { nama: string } | null;
  _count: { photos: number; speciesData: number };
}

interface ProgramDetail {
  nama: string;
  deskripsi: string;
  anggaran: number;
  status: string;
  createdAt: string;
  creator: { nama: string; email: string } | null;
  photos: { id: string; fileUrl: string; caption: string | null }[];
  speciesData: { id: string; species: { namaLokal: string }; jumlahIndividu: number }[];
}

const STATUS_LABELS = { draft: 'Draft', published: 'Published' };
const STATUS_COLORS = { draft: 'bg-gray-100 text-gray-700', published: 'bg-green-100 text-green-800' };

export default function ProgramManagementPage() {
  const [programs, setPrograms] = useState<ProgramRow[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const [editTarget, setEditTarget] = useState<ProgramRow | null>(null);

  const [detailTarget, setDetailTarget] = useState<ProgramRow | null>(null);
  const [detailData, setDetailData] = useState<ProgramDetail | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<ProgramRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  function load() {
    setLoading(true);
    fetch('/api/programs?all=true')
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal memuat daftar program.');
        return json;
      })
      .then((json) => {
        setError('');
        setPrograms(json.data ?? []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Gagal memuat daftar program.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  function openDetail(program: ProgramRow) {
    setDetailTarget(program);
    setDetailData(null);
    fetch(`/api/programs/${program.id}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal memuat detail program.');
        setDetailData(json.data);
      })
      .catch((err) => {
        toast.error(err instanceof Error ? err.message : 'Gagal memuat detail program.');
        setDetailTarget(null);
      });
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/programs/${deleteTarget.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal menghapus program.');
      toast.success(`Program "${deleteTarget.nama}" berhasil dihapus.`);
      setDeleteTarget(null);
      load();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal menghapus program.';
      setError(message);
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  }

  function renderActions(p: ProgramRow, full?: boolean) {
    return (
      <div className={`flex gap-2 ${full ? 'w-full' : ''}`}>
        <Button variant="ghost" className={full ? 'flex-1' : ''} onClick={() => openDetail(p)}>
          Detail
        </Button>
        <Button variant="secondary" className={full ? 'flex-1' : ''} onClick={() => setEditTarget(p)}>
          Edit
        </Button>
        <Button variant="danger" className={full ? 'flex-1' : ''} onClick={() => setDeleteTarget(p)}>
          Hapus
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-lg md:text-xl font-semibold">Kelola Program Konservasi</h1>

      <Card className="max-w-xl" padding="p-4 md:p-5">
        <h2 className="text-sm font-medium mb-4">Tambah Program Baru</h2>
        <ProgramForm onSuccess={load} />
      </Card>

      <Card padding="p-4 md:p-5">
        <h2 className="text-sm font-medium mb-4">Daftar Program</h2>
        {error && <p className="text-sm text-danger mb-3">{error}</p>}

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : programs.length === 0 ? (
          <EmptyState title="Belum ada program konservasi" description="Tambahkan program pertama lewat form di atas." />
        ) : (
          <>
            {/* Desktop & tablet: tabel */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                    <th className="py-2 pr-4">Nama</th>
                    <th className="py-2 pr-4">Anggaran</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {programs.map((p) => (
                    <tr key={p.id} className="border-b border-gray-100 dark:border-gray-900">
                      <td className="py-2 pr-4">{p.nama}</td>
                      <td className="py-2 pr-4">Rp {p.anggaran.toLocaleString('id-ID')}</td>
                      <td className="py-2 pr-4">
                        <Badge status={p.status} labels={STATUS_LABELS} colors={STATUS_COLORS} />
                      </td>
                      <td className="py-2 pr-4">{renderActions(p)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile: card, tanpa horizontal scroll */}
            <div className="md:hidden flex flex-col gap-3">
              {programs.map((p) => (
                <div key={p.id} className="rounded-lg border border-gray-200 dark:border-gray-800 p-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm font-medium">{p.nama}</p>
                    <Badge status={p.status} labels={STATUS_LABELS} colors={STATUS_COLORS} />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    Rp {p.anggaran.toLocaleString('id-ID')}
                  </p>
                  {renderActions(p, true)}
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      {/* Modal Edit */}
      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title={`Edit Program: ${editTarget?.nama ?? ''}`}>
        {editTarget && (
          <ProgramForm
            mode="edit"
            programId={editTarget.id}
            initialValues={{
              nama: editTarget.nama,
              deskripsi: editTarget.deskripsi,
              anggaran: editTarget.anggaran,
              status: editTarget.status as 'draft' | 'published',
            }}
            onCancel={() => setEditTarget(null)}
            onSuccess={() => {
              setEditTarget(null);
              load();
            }}
          />
        )}
      </Modal>

      {/* Modal Detail */}
      <ProgramDetailModal
        open={!!detailTarget}
        onClose={() => setDetailTarget(null)}
        program={detailData}
      />

      {/* Dialog Konfirmasi Hapus -- transparan: tampilkan info lengkap dulu */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Hapus Program Konservasi?"
        description={`Apakah Anda yakin ingin menghapus program "${deleteTarget?.nama}"?`}
        details={
          deleteTarget
            ? [
                { label: 'Nama Program', value: deleteTarget.nama },
                { label: 'Status', value: STATUS_LABELS[deleteTarget.status as 'draft' | 'published'] ?? deleteTarget.status },
                {
                  label: 'Tanggal dibuat',
                  value: new Date(deleteTarget.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  }),
                },
                { label: 'Dibuat oleh', value: deleteTarget.creator?.nama ?? '-' },
                {
                  label: 'Data terkait yang ikut terhapus',
                  value: `${deleteTarget._count.photos} foto, ${deleteTarget._count.speciesData} data spesies`,
                },
              ]
            : []
        }
      />
    </div>
  );
}