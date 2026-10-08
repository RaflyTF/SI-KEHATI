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

export function VerificationQueueTable({
  data,
  onChanged,
}: {
  data: RecordRow[];
  onChanged: () => void;
}) {
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
      // Diselaraskan menggunakan POST sesuai handler route API
      const res = await fetch(`/api/species-records/${id}/verify`, {
        method: 'POST',
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message ?? 'Gagal menyetujui data.');
      }
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
      // Diselaraskan menggunakan POST sesuai handler route API
      const res = await fetch(`/api/species-records/${rejectTarget.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ catatanRevisi: catatan }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message ?? 'Gagal menolak data.');
      }
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
      const res = await fetch(`/api/species-records/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message ?? 'Gagal menghapus data.');
      }
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

  // Delete dibatasi khusus Super Admin
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
          {/* Desktop & tablet: tampilan tabel */}
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
                    <td className="py-2 pr-4 font-medium">{r.species.namaLokal}</td>
                    <td className="py-2 pr-4">{r.period.label ?? r.period.tahun}</td>
                    <td className="py-2 pr-4">{r.jumlahIndividu}</td>
                    <td className="py-2 pr-4">{r.inputter.nama}</td>
                    <td className="py-2 pr-4 flex gap-2 flex-wrap items-center">
                      <Button variant="ghost" onClick={() => setDetailTargetId(r.id)}>
                        Detail
                      </Button>
                      <Button
                        variant="primary"
                        disabled={loadingId === r.id}
                        onClick={() => approve(r.id, r.species.namaLokal)}
                      >
                        Setujui
                      </Button>
                      <Button
                        variant="secondary"
                        disabled={loadingId === r.id}
                        onClick={() => {
                          setCatatan('');
                          setRejectTarget(r);
                        }}
                      >
                        Tolak
                      </Button>
                      {canDelete && (
                        <Button
                          variant="danger"
                          disabled={loadingId === r.id}
                          onClick={() => setDeleteTarget(r)}
                        >
                          Hapus
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: tampilan kartu */}
          <div className="md:hidden flex flex-col gap-3">
            {data.map((r) => (
              <div key={r.id} className="rounded-lg border border-gray-200 dark:border-gray-800 p-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm font-medium">{r.species.namaLokal}</p>
                  <span className="text-xs text-gray-400 shrink-0">
                    {r.period.label ?? r.period.tahun}
                  </span>
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
                  <Button
                    variant="secondary"
                    className="flex-1"
                    disabled={loadingId === r.id}
                    onClick={() => {
                      setCatatan('');
                      setRejectTarget(r);
                    }}
                  >
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

      {/* Modal Catatan Revisi / Penolakan */}
      <Modal
        open={!!rejectTarget}
        onClose={() => {
          setRejectTarget(null);
          setCatatan('');
        }}
        title="Tolak Data Monitoring"
      >
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          Tuliskan catatan revisi yang jelas untuk temuan spesies <strong>{rejectTarget?.species.namaLokal}</strong> agar dapat diperbaiki oleh Petugas Lapangan.
        </p>
        <textarea
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
          rows={3}
          placeholder="Contoh: Jumlah individu tidak sesuai dengan bukti lapangan, silakan periksa kembali."
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              setRejectTarget(null);
              setCatatan('');
            }}
          >
            Batal
          </Button>
          <Button
            variant="danger"
            onClick={reject}
            disabled={catatan.trim().length < 5 || loadingId === rejectTarget?.id}
          >
            Kirim Penolakan
          </Button>
        </div>
      </Modal>

      {/* Modal Detail & Jejak Audit */}
      <SpeciesRecordDetailModal
        open={!!detailTargetId}
        onClose={() => setDetailTargetId(null)}
        recordId={detailTargetId}
      />

      {/* Dialog Konfirmasi Hapus Data */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Hapus Data Monitoring?"
        description={`Apakah Anda yakin ingin menghapus data "${deleteTarget?.species.namaLokal}" dari antrean verifikasi?`}
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