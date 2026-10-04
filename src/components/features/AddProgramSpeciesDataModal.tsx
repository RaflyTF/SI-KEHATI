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

type DataType = 'spesies' | 'pendukung';

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
  const [dataType, setDataType] = useState<DataType>('spesies');

  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);

  // Data Spesies
  const [speciesId, setSpeciesId] = useState('');
  const [periodId, setPeriodId] = useState('');
  const [jumlah, setJumlah] = useState('');

  // Data Pendukung
  const [namaDaerah, setNamaDaerah] = useState('');
  const [jumlah2022, setJumlah2022] = useState('');
  const [jumlah2023, setJumlah2023] = useState('');
  const [jumlah2024, setJumlah2024] = useState('');
  const [jumlah2026, setJumlah2026] = useState('');

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const toast = useToast();

  useEffect(() => {
    if (!open) return;

    fetch('/api/species')
      .then((r) => r.json())
      .then((r) => setSpeciesList(r.data ?? []));

    fetch('/api/monitoring-periods')
      .then((r) => r.json())
      .then((r) => setPeriods(r.data ?? []));
  }, [open]);

  function resetAndClose() {
    setDataType('spesies');

    setSpeciesId('');
    setPeriodId('');
    setJumlah('');

    setNamaDaerah('');
    setJumlah2022('');
    setJumlah2023('');
    setJumlah2024('');
    setJumlah2026('');

    setError('');
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (dataType === 'spesies') {
      const jumlahIndividu = Number(jumlah);

      if (
        !speciesId ||
        !periodId ||
        Number.isNaN(jumlahIndividu) ||
        jumlahIndividu < 0
      ) {
        setError(
          'Semua field wajib diisi dengan benar. Jumlah individu tidak boleh negatif.'
        );
        return;
      }

      setSubmitting(true);

      try {
        const res = await fetch(
          `/api/programs/${programId}/species-data`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              speciesId,
              periodId,
              jumlahIndividu,
            }),
          }
        );

        const json = await res.json();

        if (!res.ok || !json.success) {
          setError(json.message ?? 'Gagal menyimpan data.');
          return;
        }

        toast.success('Data spesies berhasil ditambahkan.');
        resetAndClose();
        onSuccess();
      } catch {
        setError('Terjadi kesalahan jaringan. Silakan coba lagi.');
      } finally {
        setSubmitting(false);
      }

      return;
    }

    // =========================
    // DATA PENDUKUNG
    // =========================

    if (!namaDaerah.trim()) {
      setError('Nama daerah wajib diisi.');
      return;
    }

    const values = {
      jumlah2022: Number(jumlah2022 || 0),
      jumlah2023: Number(jumlah2023 || 0),
      jumlah2024: Number(jumlah2024 || 0),
      jumlah2026: Number(jumlah2026 || 0),
    };

    if (
      Object.values(values).some(
        (value) => Number.isNaN(value) || value < 0
      )
    ) {
      setError('Jumlah individu tidak boleh negatif.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(
        `/api/programs/${programId}/supporting-data`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            namaDaerah: namaDaerah.trim(),
            ...values,
          }),
        }
      );

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.message ?? 'Gagal menyimpan Data Pendukung.');
        return;
      }

      toast.success('Data Pendukung berhasil ditambahkan.');
      resetAndClose();
      onSuccess();
    } catch {
      setError('Terjadi kesalahan jaringan. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={resetAndClose}
      title="Tambah Data"
    >
      <form onSubmit={handleSubmit}>

        {/* PILIH JENIS DATA */}
        <Select
          label="Jenis Data"
          value={dataType}
          onChange={(e) =>
            setDataType(e.target.value as DataType)
          }
        >
          <option value="spesies">Data Spesies</option>
          <option value="pendukung">Data Pendukung</option>
        </Select>

        {/* =========================
            DATA SPESIES
        ========================= */}
        {dataType === 'spesies' && (
          <>
            <Select
              label="Spesies"
              value={speciesId}
              onChange={(e) =>
                setSpeciesId(e.target.value)
              }
              required
            >
              <option value="">Pilih spesies</option>

              {speciesList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.namaLokal} ({s.namaIlmiah})
                </option>
              ))}
            </Select>

            <Select
              label="Tahun / Periode"
              value={periodId}
              onChange={(e) =>
                setPeriodId(e.target.value)
              }
              required
            >
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
              onChange={(e) =>
                setJumlah(e.target.value)
              }
              required
            />
          </>
        )}

        {/* =========================
            DATA PENDUKUNG
        ========================= */}
        {dataType === 'pendukung' && (
          <>
            <Input
              label="Nama Daerah"
              type="text"
              value={namaDaerah}
              onChange={(e) =>
                setNamaDaerah(e.target.value)
              }
              placeholder="Contoh: Jati"
              required
            />

            <Input
              label="Jumlah Individu 2022"
              type="number"
              min={0}
              value={jumlah2022}
              onChange={(e) =>
                setJumlah2022(e.target.value)
              }
            />

            <Input
              label="Jumlah Individu 2023"
              type="number"
              min={0}
              value={jumlah2023}
              onChange={(e) =>
                setJumlah2023(e.target.value)
              }
            />

            <Input
              label="Jumlah Individu 2024"
              type="number"
              min={0}
              value={jumlah2024}
              onChange={(e) =>
                setJumlah2024(e.target.value)
              }
            />

            <Input
              label="Jumlah Individu 2026"
              type="number"
              min={0}
              value={jumlah2026}
              onChange={(e) =>
                setJumlah2026(e.target.value)
              }
            />
          </>
        )}

        {error && (
          <p className="text-sm text-danger mb-4">
            {error}
          </p>
        )}

        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto"
          >
            {submitting ? 'Menyimpan...' : 'Simpan Data'}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={resetAndClose}
            disabled={submitting}
          >
            Batal
          </Button>
        </div>

      </form>
    </Modal>
  );
}