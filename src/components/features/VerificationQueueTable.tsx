'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
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
  const [rejectTarget, setRejectTarget] = useState<RecordRow | null>(null);
  const [catatan, setCatatan] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const toast = useToast();

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

  return (
    <div className="overflow-x-auto">
      {error && <p className="text-sm text-danger mb-3">{error}</p>}
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
              <td className="py-2 pr-4 flex gap-2">
                <Button variant="primary" disabled={loadingId === r.id} onClick={() => approve(r.id, r.species.namaLokal)}>
                  Setujui
                </Button>
                <Button variant="danger" disabled={loadingId === r.id} onClick={() => setRejectTarget(r)}>
                  Tolak
                </Button>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={5} className="py-4 text-center text-gray-400">
                Tidak ada data yang menunggu verifikasi.
              </td>
            </tr>
          )}
        </tbody>
      </table>

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
    </div>
  );
}
