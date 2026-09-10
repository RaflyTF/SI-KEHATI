'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/providers/ToastProvider';

interface Species {
  id: string;
  namaLokal: string;
  namaIlmiah: string;
  jenis: string;
}

interface Period {
  id: string;
  tahun: number;
  label: string | null;
}

export function AddProgramSpeciesDataModal({
  open,
  onClose,
  programId,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  programId: string;
  onSuccess: () => void;
}) {
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [speciesId, setSpeciesId] = useState('');
  const [periodId, setPeriodId] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (!open) return;
    fetch('/api/species').then((r) => r.json()).then((r) => setSpeciesList(r.data ?? []));
    fetch('/api/monitoring-periods').then((r) => r.json()).then((r) => setPeriods(r.data ?? []));
  }, [open]);

  function resetAndClose() {
    setSpeciesId('');
    setPeriodId('');
    setJumlah('');
    setError('');
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const jumlahIndividu = Number(jumlah);
    if (!speciesId || !periodId || Number.isNaN(jumlahIndividu) || jumlahIndividu < 0) {
      setError('Semua field wajib diisi dengan benar. Jumlah individu tidak boleh negatif.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/programs/${programId}/species-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ speciesId, periodId, jumlahIndividu }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message ?? 'Gagal menyimpan data.');
        return;
      }
      toast.success('Data pendukung berhasil ditambahkan.');
      resetAndClose();
      onSuccess();
    } catch {
      setError('Terjadi kesalahan jaringan. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={resetAndClose} title="Tambah Data Pendukung">
      <form onSubmit={handleSubmit}>
        <Select label="Spesies" value={speciesId} onChange={(e) => setSpeciesId(e.target.value)} required>
          <option value="">Pilih spesies</option>
          {speciesList.map((s) => (
            <option key={s.id} value={s.id}>
              {s.namaLokal} ({s.namaIlmiah})
            </option>
          ))}
        </Select>

        <Select label="Tahun / Periode" value={periodId} onChange={(e) => setPeriodId(e.target.value)} required>
          <option value="">Pilih tahun</option>
          {periods.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label ?? p.tahun}
            </option>
          ))}
        </Select>

        <Input
          label="Jumlah Individu"
          type="number"
          min={0}
          value={jumlah}
          onChange={(e) => setJumlah(e.target.value)}
          required
        />

        {error && <p className="text-sm text-danger mb-4">{error}</p>}

        <div className="flex gap-2">
          <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
            {submitting ? 'Menyimpan...' : 'Simpan Data'}
          </Button>
          <Button type="button" variant="secondary" onClick={resetAndClose} disabled={submitting}>
            Batal
          </Button>
        </div>
      </form>
    </Modal>
  );
}