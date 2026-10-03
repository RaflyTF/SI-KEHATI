// // 'use client';

// // import { useEffect, useState } from 'react';
// // import { Card } from '@/components/ui/Card';
// // import { Skeleton } from '@/components/ui/Skeleton';
// // import { Badge } from '@/components/ui/Badge';
// // import { SpeciesRecordForm } from '@/components/forms/SpeciesRecordForm';
// // import { RECORD_STATUS_LABELS, RECORD_STATUS_COLORS } from '@/lib/constants';

// // interface RecordRow {
// //   id: string;
// //   jumlahIndividu: number;
// //   status: string;
// //   catatanRevisi: string | null;
// //   species: { namaLokal: string; jenis: string };
// //   period: { label: string | null; tahun: number };
// // }

// // // Halaman ini dipakai Petugas Lapangan untuk menginput data baru.
// // // (Pada versi ini daftar riwayat menampilkan data pending sebagai contoh;
// // // pengembangan lanjutan dapat menambah endpoint "riwayat milik saya".)
// // export default function DataMonitoringPage() {
// //   const [pending, setPending] = useState<RecordRow[]>([]);
// //   const [error, setError] = useState('');
// //   const [loading, setLoading] = useState(true);

// //   function loadPending() {
// //     setLoading(true);
// //     fetch('/api/species-records?status=pending')
// //       .then(async (res) => {
// //         const json = await res.json();
// //         if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal memuat riwayat data.');
// //         return json;
// //       })
// //       .then((json) => {
// //         setError('');
// //         setPending(json.data ?? []);
// //       })
// //       .catch((err) => {
// //         setPending([]);
// //         setError(err instanceof Error ? err.message : 'Gagal memuat riwayat data.');
// //       })
// //       .finally(() => setLoading(false));
// //   }

// //   useEffect(() => {
// //     loadPending();
// //   }, []);

// //   return (
// //     <div className="space-y-6">
// //       <h1 className="text-xl font-semibold">Input Data Monitoring</h1>

// //       <Card className="max-w-xl">
// //         <h2 className="text-sm font-medium mb-4">Form Data Baru</h2>
// //         <SpeciesRecordForm onSuccess={loadPending} />
// //       </Card>

// //       <Card>
// //         <h2 className="text-sm font-medium mb-4">Data yang Sedang Menunggu Verifikasi</h2>
// //         {error && <p className="text-sm text-danger mb-3">{error}</p>}
// //         <div className="overflow-x-auto">
// //           <table className="w-full text-sm">
// //             <thead>
// //               <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
// //                 <th className="py-2 pr-4">Spesies</th>
// //                 <th className="py-2 pr-4">Periode</th>
// //                 <th className="py-2 pr-4">Jumlah</th>
// //                 <th className="py-2 pr-4">Status</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {loading ? (
// //                 Array.from({ length: 3 }).map((_, i) => (
// //                   <tr key={i} className="border-b border-gray-100 dark:border-gray-900">
// //                     <td className="py-3 pr-4"><Skeleton className="h-4 w-28" /></td>
// //                     <td className="py-3 pr-4"><Skeleton className="h-4 w-16" /></td>
// //                     <td className="py-3 pr-4"><Skeleton className="h-4 w-8" /></td>
// //                     <td className="py-3 pr-4"><Skeleton className="h-4 w-20" /></td>
// //                   </tr>
// //                 ))
// //               ) : (
// //                 <>
// //                   {pending.map((r) => (
// //                     <tr key={r.id} className="border-b border-gray-100 dark:border-gray-900">
// //                       <td className="py-2 pr-4">{r.species.namaLokal}</td>
// //                       <td className="py-2 pr-4">{r.period.label ?? r.period.tahun}</td>
// //                       <td className="py-2 pr-4">{r.jumlahIndividu}</td>
// //                       <td className="py-2 pr-4">
// //                         <Badge status={r.status} labels={RECORD_STATUS_LABELS} colors={RECORD_STATUS_COLORS} />
// //                       </td>
// //                     </tr>
// //                   ))}
// //                   {pending.length === 0 && (
// //                     <tr>
// //                       <td colSpan={4} className="py-4 text-center text-gray-400">
// //                         Belum ada data yang menunggu verifikasi.
// //                       </td>
// //                     </tr>
// //                   )}
// //                 </>
// //               )}
// //             </tbody>
// //           </table>
// //         </div>
// //       </Card>
// //     </div>
// //   );
// // }



// //Kode Baru

// 'use client';

// import { useEffect, useState } from 'react';
// import { Card } from '@/components/ui/Card';
// import { Badge } from '@/components/ui/Badge';
// import { Skeleton } from '@/components/ui/Skeleton';
// import { EmptyState } from '@/components/ui/EmptyState';
// import { SpeciesRecordForm } from '@/components/forms/SpeciesRecordForm';
// import { RECORD_STATUS_LABELS, RECORD_STATUS_COLORS } from '@/lib/constants';

// interface RecordRow {
//   id: string;
//   jumlahIndividu: number;
//   status: string;
//   catatanRevisi: string | null;
//   species: { namaLokal: string; jenis: string };
//   period: { label: string | null; tahun: number };
// }

// export default function DataMonitoringPage() {
//   const [pending, setPending] = useState<RecordRow[]>([]);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);

//   function loadPending() {
//     setLoading(true);
//     fetch('/api/species-records?status=pending')
//       .then(async (res) => {
//         const json = await res.json();
//         if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal memuat riwayat data.');
//         return json;
//       })
//       .then((json) => {
//         setError('');
//         setPending(json.data ?? []);
//       })
//       .catch((err) => {
//         setPending([]);
//         setError(err instanceof Error ? err.message : 'Gagal memuat riwayat data.');
//       })
//       .finally(() => setLoading(false));
//   }

//   useEffect(() => {
//     loadPending();
//   }, []);

//   return (
//     <div className="space-y-4 md:space-y-6">
//       <h1 className="text-lg md:text-xl font-semibold">Input Data Monitoring</h1>

//       <Card className="max-w-xl" padding="p-4 md:p-5">
//         <h2 className="text-sm font-medium mb-4">Form Data Baru</h2>
//         <SpeciesRecordForm onSuccess={loadPending} />
//       </Card>

//       <Card padding="p-4 md:p-5">
//         <h2 className="text-sm font-medium mb-4">Data yang Sedang Menunggu Verifikasi</h2>
//         {error && <p className="text-sm text-danger mb-3">{error}</p>}

//         {loading ? (
//           <div className="space-y-3">
//             <Skeleton className="h-12 w-full" />
//             <Skeleton className="h-12 w-full" />
//             <Skeleton className="h-12 w-full" />
//           </div>
//         ) : pending.length === 0 ? (
//           <EmptyState
//             title="Belum ada data yang menunggu verifikasi"
//             description="Data yang kamu input akan muncul di sini sebelum diverifikasi Admin."
//           />
//         ) : (
//           <>
//             {/* Desktop & tablet: tabel */}
//             <div className="hidden md:block overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
//                     <th className="py-2 pr-4">Spesies</th>
//                     <th className="py-2 pr-4">Periode</th>
//                     <th className="py-2 pr-4">Jumlah</th>
//                     <th className="py-2 pr-4">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {pending.map((r) => (
//                     <tr key={r.id} className="border-b border-gray-100 dark:border-gray-900">
//                       <td className="py-2 pr-4">{r.species.namaLokal}</td>
//                       <td className="py-2 pr-4">{r.period.label ?? r.period.tahun}</td>
//                       <td className="py-2 pr-4">{r.jumlahIndividu}</td>
//                       <td className="py-2 pr-4">
//                         <Badge status={r.status} labels={RECORD_STATUS_LABELS} colors={RECORD_STATUS_COLORS} />
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Mobile: card, tanpa horizontal scroll */}
//             <div className="md:hidden flex flex-col gap-3">
//               {pending.map((r) => (
//                 <div key={r.id} className="rounded-lg border border-gray-200 dark:border-gray-800 p-3">
//                   <div className="flex items-start justify-between gap-2 mb-2">
//                     <p className="text-sm font-medium">{r.species.namaLokal}</p>
//                     <Badge status={r.status} labels={RECORD_STATUS_LABELS} colors={RECORD_STATUS_COLORS} />
//                   </div>
//                   <dl className="grid grid-cols-2 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
//                     <dt>Periode</dt>
//                     <dd className="text-gray-700 dark:text-gray-300">{r.period.label ?? r.period.tahun}</dd>
//                     <dt>Jumlah</dt>
//                     <dd className="text-gray-700 dark:text-gray-300">{r.jumlahIndividu}</dd>
//                   </dl>
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
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { SpeciesRecordForm } from '@/components/forms/SpeciesRecordForm';
import { SpeciesRecordDetailModal } from '@/components/features/SpeciesRecordDetailModal';
import { useToast } from '@/components/providers/ToastProvider';
import { RECORD_STATUS_LABELS, RECORD_STATUS_COLORS } from '@/lib/constants';

interface RecordRow {
  id: string;
  jumlahIndividu: number;
  status: string;
  species: { id: string; namaLokal: string; jenis: string };
  period: { id: string; label: string | null; tahun: number };
}

const STATUS_FILTERS = [
  { value: '', label: 'Semua status' },
  { value: 'pending', label: 'Menunggu verifikasi' },
  { value: 'published', label: 'Published' },
  { value: 'rejected', label: 'Ditolak' },
];

export default function DataMonitoringPage() {
  const { data: session } = useSession();
  const role = (session?.user as { role?: string } | undefined)?.role ?? '';
  const toast = useToast();

  const [records, setRecords] = useState<RecordRow[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const [editTarget, setEditTarget] = useState<RecordRow | null>(null);
  const [detailTargetId, setDetailTargetId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RecordRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  function load() {
    setLoading(true);
    const params = new URLSearchParams({ scope: 'mine' });
    if (statusFilter) params.set('status', statusFilter);

    fetch(`/api/species-records?${params.toString()}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal memuat data monitoring.');
        return json;
      })
      .then((json) => {
        setError('');
        setRecords(json.data ?? []);
      })
      .catch((err) => {
        setRecords([]);
        setError(err instanceof Error ? err.message : 'Gagal memuat data monitoring.');
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  // Petugas Lapangan hanya boleh edit/hapus data miliknya yang BELUM final
  // (pending/rejected). Admin boleh EDIT data siapa pun status apa pun, tapi
  // TIDAK BOLEH menghapus -- hak hapus dibatasi Super Admin saja (lihat
  // pembaruan aturan di speciesRecord.service.ts pada Modul 4).
  function canEdit(record: RecordRow) {
    if (role === 'petugas_lapangan') {
      return record.status === 'pending' || record.status === 'rejected';
    }
    return role === 'admin' || role === 'super_admin';
  }

  function canDelete(record: RecordRow) {
    if (role === 'petugas_lapangan') {
      return record.status === 'pending' || record.status === 'rejected';
    }
    return role === 'super_admin';
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/species-records/${deleteTarget.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal menghapus data.');
      toast.success(`Data ${deleteTarget.species.namaLokal} berhasil dihapus.`);
      setDeleteTarget(null);
      load();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal menghapus data.';
      setError(message);
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  }

  function renderActions(r: RecordRow, full?: boolean) {
    return (
      <div className={`flex gap-2 ${full ? 'w-full' : ''}`}>
        <Button variant="ghost" className={full ? 'flex-1' : ''} onClick={() => setDetailTargetId(r.id)}>
          Detail
        </Button>
        {canEdit(r) && (
          <Button variant="secondary" className={full ? 'flex-1' : ''} onClick={() => setEditTarget(r)}>
            Edit
          </Button>
        )}
        {canDelete(r) && (
          <Button variant="danger" className={full ? 'flex-1' : ''} onClick={() => setDeleteTarget(r)}>
            Hapus
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-lg md:text-xl font-semibold">Input Data Monitoring</h1>

      <Card className="max-w-xl" padding="p-4 md:p-5">
        <h2 className="text-sm font-medium mb-4">Form Data Baru</h2>
        <SpeciesRecordForm onSuccess={load} />
      </Card>

      <Card padding="p-4 md:p-5">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
          <h2 className="text-sm font-medium">Riwayat Data Saya</h2>
          <div className="sm:w-56">
            <Select label="Filter status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              {STATUS_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
        {error && <p className="text-sm text-danger mb-3">{error}</p>}

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : records.length === 0 ? (
          <EmptyState
            title="Belum ada data"
            description={statusFilter ? 'Tidak ada data dengan status ini.' : 'Data yang kamu input akan muncul di sini.'}
          />
        ) : (
          <>
            {/* Desktop & tablet: tabel */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                    <th className="py-2 pr-4">Spesies</th>
                    <th className="py-2 pr-4">Periode</th>
                    <th className="py-2 pr-4">Jumlah</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => (
                    <tr key={r.id} className="border-b border-gray-100 dark:border-gray-900">
                      <td className="py-2 pr-4">{r.species.namaLokal}</td>
                      <td className="py-2 pr-4">{r.period.label ?? r.period.tahun}</td>
                      <td className="py-2 pr-4">{r.jumlahIndividu}</td>
                      <td className="py-2 pr-4">
                        <Badge status={r.status} labels={RECORD_STATUS_LABELS} colors={RECORD_STATUS_COLORS} />
                      </td>
                      <td className="py-2 pr-4">{renderActions(r)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile: card, tanpa horizontal scroll */}
            <div className="md:hidden flex flex-col gap-3">
              {records.map((r) => (
                <div key={r.id} className="rounded-lg border border-gray-200 dark:border-gray-800 p-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm font-medium">{r.species.namaLokal}</p>
                    <Badge status={r.status} labels={RECORD_STATUS_LABELS} colors={RECORD_STATUS_COLORS} />
                  </div>
                  <dl className="grid grid-cols-2 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <dt>Periode</dt>
                    <dd className="text-gray-700 dark:text-gray-300">{r.period.label ?? r.period.tahun}</dd>
                    <dt>Jumlah</dt>
                    <dd className="text-gray-700 dark:text-gray-300">{r.jumlahIndividu}</dd>
                  </dl>
                  {renderActions(r, true)}
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      {/* Modal Edit */}
      <Modal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title={`Edit Data: ${editTarget?.species.namaLokal ?? ''}`}
      >
        {editTarget && (
          <SpeciesRecordForm
            mode="edit"
            recordId={editTarget.id}
            initialValues={{
              speciesId: editTarget.species.id,
              periodId: editTarget.period.id,
              jumlahIndividu: editTarget.jumlahIndividu,
            }}
            onCancel={() => setEditTarget(null)}
            onSuccess={() => {
              setEditTarget(null);
              load();
            }}
          />
        )}
      </Modal>

      {/* Modal Detail + Riwayat */}  
      <SpeciesRecordDetailModal
        open={!!detailTargetId}
        onClose={() => setDetailTargetId(null)}
        recordId={detailTargetId}
      />

      {/* Dialog Konfirmasi Hapus */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Hapus Data Monitoring?"
        description={`Apakah Anda yakin ingin menghapus data "${deleteTarget?.species.namaLokal}"?`}
        details={
          deleteTarget
            ? [
                { label: 'Spesies', value: deleteTarget.species.namaLokal },
                { label: 'Periode', value: deleteTarget.period.label ?? String(deleteTarget.period.tahun) },
                { label: 'Jumlah Individu', value: String(deleteTarget.jumlahIndividu) },
                {
                  label: 'Status',
                  value: RECORD_STATUS_LABELS[deleteTarget.status] ?? deleteTarget.status,
                },
              ]
            : []
        }
      />
    </div>
  );
}