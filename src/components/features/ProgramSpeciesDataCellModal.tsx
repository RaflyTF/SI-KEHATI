'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/providers/ToastProvider';

interface CellTarget {
  dataId: string;
  namaLokal: string;
  namaIlmiah: string;
  periodeLabel: string;
  jumlahIndividu: number;
}

export function ProgramSpeciesDataCellModal({
  open,
  onClose,
  target,
  programId,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  target: CellTarget | null;
  programId: string;
  onSuccess: () => void;
}) {
  const [mode, setMode] = useState<'edit' | 'confirmDelete'>('edit');
  const [jumlah, setJumlah] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  // Sinkronkan form HANYA saat modal benar-benar dibuka untuk sel yang
  // berbeda (dipicu perubahan target.dataId) -- BUKAN dicek ulang setiap
  // kali "jumlah" kosong, karena mengosongkan field lewat Backspace adalah
  // aksi yang sah dari user dan akan selalu bentrok dengan pengecekan itu
  // (ini penyebab bug "angka menumpuk" yang ditemukan saat testing).
  useEffect(() => {
    if (open && target) {
      setJumlah(String(target.jumlahIndividu));
      setMode('edit');
      setError('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, target?.dataId]);

  function handleClose() {
    setMode('edit');
    setJumlah('');
    setError('');
    onClose();
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!target) return;
    setError('');

    const jumlahIndividu = Number(jumlah);
    if (Number.isNaN(jumlahIndividu) || jumlahIndividu < 0) {
      setError('Jumlah individu harus berupa angka dan tidak boleh negatif.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/programs/${programId}/species-data/${target.dataId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jumlahIndividu }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message ?? 'Gagal memperbarui data.');
        return;
      }
      toast.success(`Data ${target.namaLokal} (${target.periodeLabel}) berhasil diperbarui.`);
      handleClose();
      onSuccess();
    } catch {
      setError('Terjadi kesalahan jaringan. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleConfirmDelete() {
    if (!target) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`/api/programs/${programId}/species-data/${target.dataId}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message ?? 'Gagal menghapus data.');
        return;
      }
      toast.success(`Data ${target.namaLokal} (${target.periodeLabel}) berhasil dihapus.`);
      handleClose();
      onSuccess();
    } catch {
      setError('Terjadi kesalahan jaringan. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!target) return null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={mode === 'edit' ? `Edit Data: ${target.namaLokal}` : 'Hapus Data Pendukung?'}
    >
      {mode === 'edit' ? (
        <form onSubmit={handleSaveEdit}>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {target.namaLokal} ({target.namaIlmiah}) &middot; Periode {target.periodeLabel}
          </p>
          <Input
            label="Jumlah Individu"
            type="number"
            min={0}
            value={jumlah}
            onChange={(e) => setJumlah(e.target.value)}
            required
          />
          {error && <p className="text-sm text-danger mb-4">{error}</p>}
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
              {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
            <Button
              type="button"
              variant="danger"
              disabled={submitting}
              onClick={() => {
                setError('');
                setMode('confirmDelete');
              }}
            >
              Hapus Data Ini
            </Button>
          </div>
        </form>
      ) : (
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Apakah Anda yakin ingin menghapus data berikut?
          </p>
          <dl className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3 mb-4 space-y-1.5">
            <div className="flex justify-between gap-4 text-sm">
              <dt className="text-gray-500 dark:text-gray-400">Spesies</dt>
              <dd className="font-medium text-right">
                {target.namaLokal} ({target.namaIlmiah})
              </dd>
            </div>
            <div className="flex justify-between gap-4 text-sm">
              <dt className="text-gray-500 dark:text-gray-400">Periode</dt>
              <dd className="font-medium text-right">{target.periodeLabel}</dd>
            </div>
            <div className="flex justify-between gap-4 text-sm">
              <dt className="text-gray-500 dark:text-gray-400">Jumlah Individu</dt>
              <dd className="font-medium text-right">{target.jumlahIndividu}</dd>
            </div>
          </dl>
          {error ? (
            <p className="text-sm text-danger mb-4">{error}</p>
          ) : (
            <p className="text-xs text-danger mb-4">Data yang dihapus tidak dapat dikembalikan.</p>
          )}
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setMode('edit')} disabled={submitting}>
              Batal
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete} disabled={submitting}>
              {submitting ? 'Menghapus...' : 'Ya, Hapus'}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}