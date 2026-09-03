// // 'use client';

// // import { useState } from 'react';
// // import { Button } from '@/components/ui/Button';
// // import { Modal } from '@/components/ui/Modal';
// // import { useToast } from '@/components/providers/ToastProvider';

// // interface RecordRow {
// //   id: string;
// //   jumlahIndividu: number;
// //   species: { namaLokal: string; jenis: string };
// //   period: { label: string | null; tahun: number };
// //   inputter: { nama: string };
// // }

// // // Feature component -- menggabungkan komponen dasar (Button, Modal) dengan
// // // logika pemanggilan API. Halaman (page.tsx) hanya perlu meneruskan data +
// // // callback, tidak perlu tahu detail endpoint (Container/Presentational split
// // // sesuai Component Design pada SDD).
// // export function VerificationQueueTable({ data, onChanged }: { data: RecordRow[]; onChanged: () => void }) {
// //   const [rejectTarget, setRejectTarget] = useState<RecordRow | null>(null);
// //   const [catatan, setCatatan] = useState('');
// //   const [loadingId, setLoadingId] = useState<string | null>(null);
// //   const [error, setError] = useState('');
// //   const toast = useToast();

// // async function approve(id: string, namaSpesies: string) {
// //     setLoadingId(id);
// //     setError('');
// //     try {
// //       const res = await fetch(`/api/species-records/${id}/verify`, { method: 'PATCH' });
// //       const json = await res.json();
// //       if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal menyetujui data.');
// //       toast.success(`Data ${namaSpesies} berhasil disetujui dan dipublikasikan.`);
// //       onChanged();
// //     } catch (err) {
// //       const message = err instanceof Error ? err.message : 'Gagal menyetujui data.';
// //       setError(message);
// //       toast.error(message);
// //     } finally {
// //       setLoadingId(null);
// //     }
// //   }

// //   async function reject() {
// //     if (!rejectTarget) return;
// //     setLoadingId(rejectTarget.id);
// //     setError('');
// //     try {
// //       const res = await fetch(`/api/species-records/${rejectTarget.id}/reject`, {
// //         method: 'PATCH',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ catatanRevisi: catatan }),
// //       });
// //       const json = await res.json();
// //       if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal menolak data.');
// //       toast.success(`Data ${rejectTarget.species.namaLokal} berhasil ditolak.`);
// //       setRejectTarget(null);
// //       setCatatan('');
// //       onChanged();
// //     } catch (err) {
// //       const message = err instanceof Error ? err.message : 'Gagal menolak data.';
// //       setError(message);
// //       toast.error(message);
// //     } finally {
// //       setLoadingId(null);
// //     }
// //   }

// //   return (
// //     <div className="overflow-x-auto">
// //       {error && <p className="text-sm text-danger mb-3">{error}</p>}
// //       <table className="w-full text-sm">
// //         <thead>
// //           <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
// //             <th className="py-2 pr-4">Spesies</th>
// //             <th className="py-2 pr-4">Periode</th>
// //             <th className="py-2 pr-4">Jumlah</th>
// //             <th className="py-2 pr-4">Diinput oleh</th>
// //             <th className="py-2 pr-4">Aksi</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {data.map((r) => (
// //             <tr key={r.id} className="border-b border-gray-100 dark:border-gray-900">
// //               <td className="py-2 pr-4">{r.species.namaLokal}</td>
// //               <td className="py-2 pr-4">{r.period.label ?? r.period.tahun}</td>
// //               <td className="py-2 pr-4">{r.jumlahIndividu}</td>
// //               <td className="py-2 pr-4">{r.inputter.nama}</td>
// //               <td className="py-2 pr-4 flex gap-2">
// //                 <Button variant="primary" disabled={loadingId === r.id} onClick={() => approve(r.id, r.species.namaLokal)}>
// //                   Setujui
// //                 </Button>
// //                 <Button variant="danger" disabled={loadingId === r.id} onClick={() => setRejectTarget(r)}>
// //                   Tolak
// //                 </Button>
// //               </td>
// //             </tr>
// //           ))}
// //           {data.length === 0 && (
// //             <tr>
// //               <td colSpan={5} className="py-4 text-center text-gray-400">
// //                 Tidak ada data yang menunggu verifikasi.
// //               </td>
// //             </tr>
// //           )}
// //         </tbody>
// //       </table>

// //       <Modal open={!!rejectTarget} onClose={() => setRejectTarget(null)} title="Tolak Data">
// //         <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
// //           Tuliskan catatan revisi untuk {rejectTarget?.species.namaLokal}.
// //         </p>
// //         <textarea
// //           className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 text-sm mb-4"
// //           rows={3}
// //           value={catatan}
// //           onChange={(e) => setCatatan(e.target.value)}
// //         />
// //         <Button variant="danger" onClick={reject} disabled={catatan.trim().length < 5}>
// //           Kirim Penolakan
// //         </Button>
// //       </Modal>
// //     </div>
// //   );
// // }


// //Kode Baru 

// 'use client';

// import { useState } from 'react';
// import { Button } from '@/components/ui/Button';
// import { Modal } from '@/components/ui/Modal';
// import { EmptyState } from '@/components/ui/EmptyState';
// import { useToast } from '@/components/providers/ToastProvider';

// interface RecordRow {
//   id: string;
//   jumlahIndividu: number;
//   species: { namaLokal: string; jenis: string };
//   period: { label: string | null; tahun: number };
//   inputter: { nama: string };
// }

// export function VerificationQueueTable({ data, onChanged }: { data: RecordRow[]; onChanged: () => void }) {
//   const [rejectTarget, setRejectTarget] = useState<RecordRow | null>(null);
//   const [catatan, setCatatan] = useState('');
//   const [loadingId, setLoadingId] = useState<string | null>(null);
//   const [error, setError] = useState('');
//   const toast = useToast();

//   async function approve(id: string, namaSpesies: string) {
//     setLoadingId(id);
//     setError('');
//     try {
//       const res = await fetch(`/api/species-records/${id}/verify`, { method: 'PATCH' });
//       const json = await res.json();
//       if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal menyetujui data.');
//       toast.success(`Data ${namaSpesies} berhasil disetujui dan dipublikasikan.`);
//       onChanged();
//     } catch (err) {
//       const message = err instanceof Error ? err.message : 'Gagal menyetujui data.';
//       setError(message);
//       toast.error(message);
//     } finally {
//       setLoadingId(null);
//     }
//   }

//   async function reject() {
//     if (!rejectTarget) return;
//     setLoadingId(rejectTarget.id);
//     setError('');
//     try {
//       const res = await fetch(`/api/species-records/${rejectTarget.id}/reject`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ catatanRevisi: catatan }),
//       });
//       const json = await res.json();
//       if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal menolak data.');
//       toast.success(`Data ${rejectTarget.species.namaLokal} berhasil ditolak.`);
//       setRejectTarget(null);
//       setCatatan('');
//       onChanged();
//     } catch (err) {
//       const message = err instanceof Error ? err.message : 'Gagal menolak data.';
//       setError(message);
//       toast.error(message);
//     } finally {
//       setLoadingId(null);
//     }
//   }

//   return (
//     <div>
//       {error && <p className="text-sm text-danger mb-3">{error}</p>}

//       {data.length === 0 ? (
//         <EmptyState
//           title="Tidak ada data yang menunggu verifikasi"
//           description="Data baru dari Petugas Lapangan akan muncul di sini untuk diverifikasi."
//         />
//       ) : (
//         <>
//           {/* Desktop & tablet (md ke atas): tabel biasa */}
//           <div className="hidden md:block overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
//                   <th className="py-2 pr-4">Spesies</th>
//                   <th className="py-2 pr-4">Periode</th>
//                   <th className="py-2 pr-4">Jumlah</th>
//                   <th className="py-2 pr-4">Diinput oleh</th>
//                   <th className="py-2 pr-4">Aksi</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.map((r) => (
//                   <tr key={r.id} className="border-b border-gray-100 dark:border-gray-900">
//                     <td className="py-2 pr-4">{r.species.namaLokal}</td>
//                     <td className="py-2 pr-4">{r.period.label ?? r.period.tahun}</td>
//                     <td className="py-2 pr-4">{r.jumlahIndividu}</td>
//                     <td className="py-2 pr-4">{r.inputter.nama}</td>
//                     <td className="py-2 pr-4 flex gap-2">
//                       <Button variant="primary" disabled={loadingId === r.id} onClick={() => approve(r.id, r.species.namaLokal)}>
//                         Setujui
//                       </Button>
//                       <Button variant="danger" disabled={loadingId === r.id} onClick={() => setRejectTarget(r)}>
//                         Tolak
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Mobile (di bawah md): card layout, tanpa horizontal scroll */}
//           <div className="md:hidden flex flex-col gap-3">
//             {data.map((r) => (
//               <div key={r.id} className="rounded-lg border border-gray-200 dark:border-gray-800 p-3">
//                 <div className="flex items-start justify-between gap-2 mb-2">
//                   <p className="text-sm font-medium">{r.species.namaLokal}</p>
//                   <span className="text-xs text-gray-400 shrink-0">{r.period.label ?? r.period.tahun}</span>
//                 </div>
//                 <dl className="grid grid-cols-2 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
//                   <dt>Jumlah</dt>
//                   <dd className="text-gray-700 dark:text-gray-300">{r.jumlahIndividu}</dd>
//                   <dt>Diinput oleh</dt>
//                   <dd className="text-gray-700 dark:text-gray-300 truncate">{r.inputter.nama}</dd>
//                 </dl>
//                 <div className="flex gap-2">
//                   <Button
//                     variant="primary"
//                     className="flex-1"
//                     disabled={loadingId === r.id}
//                     onClick={() => approve(r.id, r.species.namaLokal)}
//                   >
//                     Setujui
//                   </Button>
//                   <Button variant="danger" className="flex-1" disabled={loadingId === r.id} onClick={() => setRejectTarget(r)}>
//                     Tolak
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       )}

//       <Modal open={!!rejectTarget} onClose={() => setRejectTarget(null)} title="Tolak Data">
//         <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
//           Tuliskan catatan revisi untuk {rejectTarget?.species.namaLokal}.
//         </p>
//         <textarea
//           className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 text-sm mb-4"
//           rows={3}
//           value={catatan}
//           onChange={(e) => setCatatan(e.target.value)}
//         />
//         <Button variant="danger" onClick={reject} disabled={catatan.trim().length < 5}>
//           Kirim Penolakan
//         </Button>
//       </Modal>
//     </div>
//   );
// }

// Kode Baru

'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { SpeciesRecordDetailModal } from '@/components/features/SpeciesRecordDetailModal';
import { useToast } from '@/components/providers/ToastProvider';

interface RecordRow {
  id: string;
  jumlahIndividu: number;
  species: { namaLokal: string; jenis: string };
  period: { label: string | null; tahun: number };
  inputter: { nama: string };
}

// Feature component -- menggabungkan komponen dasar (Button, Modal) dengan
// logika pemanggilan API. Halaman (page.tsx) hanya perlu meneruskan data +
// callback, tidak perlu tahu detail endpoint (Container/Presentational split
// sesuai Component Design pada SDD).
export function VerificationQueueTable({ data, onChanged }: { data: RecordRow[]; onChanged: () => void }) {
  const { data: session } = useSession();
  const role = (session?.user as { role?: string } | undefined)?.role ?? '';

  const [rejectTarget, setRejectTarget] = useState<RecordRow | null>(null);
  const [catatan, setCatatan] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const toast = useToast();

  const [detailTargetId, setDetailTargetId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RecordRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function approve(id: string, namaSpesies: string) {
    setLoadingId(id);
    setError('');
    try {
      const res = await fetch(`/api/species-records/${id}/verify`, { method: 'PATCH' });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal menyetujui data.');
      toast.success(`Data ${namaSpesies} berhasil disetujui dan dipublikasikan.`);
      onChanged();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal menyetujui data.';
      setError(message);
      toast.error(message);
    } finally {
      setLoadingId(null);
    }
  }

  async function reject() {
    if (!rejectTarget) return;
    setLoadingId(rejectTarget.id);
    setError('');
    try {
      const res = await fetch(`/api/species-records/${rejectTarget.id}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ catatanRevisi: catatan }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal menolak data.');
      toast.success(`Data ${rejectTarget.species.namaLokal} berhasil ditolak.`);
      setRejectTarget(null);
      setCatatan('');
      onChanged();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal menolak data.';
      setError(message);
      toast.error(message);
    } finally {
      setLoadingId(null);
    }
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
      onChanged();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal menghapus data.';
      setError(message);
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  }

  // Delete di halaman Verifikasi SENGAJA dibatasi Super Admin saja -- Admin
  // hanya berwenang menyetujui/menolak/melihat detail (lihat pembaruan
  // aturan otorisasi di speciesRecord.service.ts).
  const canDelete = role === 'super_admin';

  return (
    <div>
      {error && <p className="text-sm text-danger mb-3">{error}</p>}

      {data.length === 0 ? (
        <EmptyState
          title="Tidak ada data yang menunggu verifikasi"
          description="Data baru dari Petugas Lapangan akan muncul di sini untuk diverifikasi."
        />
      ) : (
        <>
          {/* Desktop & tablet (md ke atas): tabel biasa */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                  <th className="py-2 pr-4">Spesies</th>
                  <th className="py-2 pr-4">Periode</th>
                  <th className="py-2 pr-4">Jumlah</th>
                  <th className="py-2 pr-4">Diinput oleh</th>
                  <th className="py-2 pr-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.map((r) => (
                  <tr key={r.id} className="border-b border-gray-100 dark:border-gray-900">
                    <td className="py-2 pr-4">{r.species.namaLokal}</td>
                    <td className="py-2 pr-4">{r.period.label ?? r.period.tahun}</td>
                    <td className="py-2 pr-4">{r.jumlahIndividu}</td>
                    <td className="py-2 pr-4">{r.inputter.nama}</td>
                    <td className="py-2 pr-4 flex gap-2 flex-wrap">
                      <Button variant="ghost" onClick={() => setDetailTargetId(r.id)}>
                        Detail
                      </Button>
                      <Button variant="primary" disabled={loadingId === r.id} onClick={() => approve(r.id, r.species.namaLokal)}>
                        Setujui
                      </Button>
                      <Button variant="secondary" disabled={loadingId === r.id} onClick={() => setRejectTarget(r)}>
                        Tolak
                      </Button>
                      {canDelete && (
                        <Button variant="danger" disabled={loadingId === r.id} onClick={() => setDeleteTarget(r)}>
                          Hapus
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile (di bawah md): card layout, tanpa horizontal scroll */}
          <div className="md:hidden flex flex-col gap-3">
            {data.map((r) => (
              <div key={r.id} className="rounded-lg border border-gray-200 dark:border-gray-800 p-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm font-medium">{r.species.namaLokal}</p>
                  <span className="text-xs text-gray-400 shrink-0">{r.period.label ?? r.period.tahun}</span>
                </div>
                <dl className="grid grid-cols-2 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <dt>Jumlah</dt>
                  <dd className="text-gray-700 dark:text-gray-300">{r.jumlahIndividu}</dd>
                  <dt>Diinput oleh</dt>
                  <dd className="text-gray-700 dark:text-gray-300 truncate">{r.inputter.nama}</dd>
                </dl>
                <div className="flex flex-wrap gap-2">
                  <Button variant="ghost" className="flex-1" onClick={() => setDetailTargetId(r.id)}>
                    Detail
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1"
                    disabled={loadingId === r.id}
                    onClick={() => approve(r.id, r.species.namaLokal)}
                  >
                    Setujui
                  </Button>
                  <Button variant="secondary" className="flex-1" disabled={loadingId === r.id} onClick={() => setRejectTarget(r)}>
                    Tolak
                  </Button>
                  {canDelete && (
                    <Button
                      variant="danger"
                      className="flex-1"
                      disabled={loadingId === r.id}
                      onClick={() => setDeleteTarget(r)}
                    >
                      Hapus
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal Tolak */}
      <Modal open={!!rejectTarget} onClose={() => setRejectTarget(null)} title="Tolak Data">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          Tuliskan catatan revisi untuk {rejectTarget?.species.namaLokal}.
        </p>
        <textarea
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 text-sm mb-4"
          rows={3}
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
        />
        <Button variant="danger" onClick={reject} disabled={catatan.trim().length < 5}>
          Kirim Penolakan
        </Button>
      </Modal>

      {/* Modal Detail + Riwayat (reuse dari Modul 3) */}
      <SpeciesRecordDetailModal
        open={!!detailTargetId}
        onClose={() => setDetailTargetId(null)}
        recordId={detailTargetId}
      />

      {/* Dialog Konfirmasi Hapus -- hanya bisa dibuka Super Admin karena
          tombolnya sendiri tidak dirender untuk role lain */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Hapus Data Monitoring?"
        description={`Apakah Anda yakin ingin menghapus data "${deleteTarget?.species.namaLokal}" dari antrian verifikasi?`}
        details={
          deleteTarget
            ? [
                { label: 'Spesies', value: deleteTarget.species.namaLokal },
                { label: 'Periode', value: deleteTarget.period.label ?? String(deleteTarget.period.tahun) },
                { label: 'Jumlah Individu', value: String(deleteTarget.jumlahIndividu) },
                { label: 'Diinput oleh', value: deleteTarget.inputter.nama },
              ]
            : []
        }
      />
    </div>
  );
}