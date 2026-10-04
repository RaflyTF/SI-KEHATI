// 'use client';

// import { useEffect, useState } from 'react';
// import { Select } from '@/components/ui/Select';
// import { Input } from '@/components/ui/Input';
// import { Button } from '@/components/ui/Button';
// import { useToast } from '@/components/providers/ToastProvider';

// interface Species {
//   id: string;
//   namaLokal: string;
//   namaIlmiah: string;
//   jenis: string;
// }

// interface Period {
//   id: string;
//   tahun: number;
//   semester: string;
//   label: string | null;
// }

// // Form ini dipakai untuk input data baru oleh Petugas Lapangan.
// // Sesuai Component Design pada SDD, form yang sama juga bisa dipakai untuk
// // mode edit dengan menambahkan prop initialValues di pengembangan lanjutan.
// export function SpeciesRecordForm({ onSuccess }: { onSuccess?: () => void }) {
//   const [speciesList, setSpeciesList] = useState<Species[]>([]);
//   const [periods, setPeriods] = useState<Period[]>([]);
//   const [speciesId, setSpeciesId] = useState('');
//   const [periodId, setPeriodId] = useState('');
//   const [jumlah, setJumlah] = useState('');
//   const [error, setError] = useState('');
//   const [submitting, setSubmitting] = useState(false);
//   const toast = useToast();

//   useEffect(() => {
//     fetch('/api/species')
//       .then((r) => r.json())
//       .then((r) => setSpeciesList(r.data ?? []))
//       .catch(() => setError('Gagal memuat daftar spesies. Muat ulang halaman untuk mencoba lagi.'));

//     fetch('/api/monitoring-periods')
//       .then((r) => r.json())
//       .then((r) => setPeriods(r.data ?? []))
//       .catch(() => setError('Gagal memuat daftar periode monitoring. Muat ulang halaman untuk mencoba lagi.'));
//   }, []);

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setError('');

//     const jumlahIndividu = Number(jumlah);
//     if (!speciesId || !periodId || Number.isNaN(jumlahIndividu) || jumlahIndividu < 0) {
//       setError('Semua field wajib diisi dengan benar. Jumlah individu tidak boleh negatif.');
//       return;
//     }

//     setSubmitting(true);
//     try {
//       const res = await fetch('/api/species-records', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ speciesId, periodId, jumlahIndividu }),
//       });
//       const json = await res.json();

//       if (!res.ok || !json.success) {
//         const message = json.message ?? 'Gagal menyimpan data.';
//         setError(message);
//         toast.error(message);
//         return;
//       }

//       const namaSpesies = speciesList.find((s) => s.id === speciesId)?.namaLokal ?? 'Data';
//       toast.success(`${namaSpesies} berhasil disimpan dan diajukan untuk verifikasi.`);

//       setSpeciesId('');
//       setPeriodId('');
//       setJumlah('');
//       onSuccess?.();
//     } catch {
//       const message = 'Terjadi kesalahan jaringan. Silakan coba lagi.';
//       setError(message);
//       toast.error(message);
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       <Select label="Spesies" value={speciesId} onChange={(e) => setSpeciesId(e.target.value)} required>
//         <option value="">Pilih spesies</option>
//         {speciesList.map((s) => (
//           <option key={s.id} value={s.id}>
//             {s.namaLokal} ({s.namaIlmiah}) — {s.jenis === 'flora' ? 'Flora' : 'Fauna'}
//           </option>
//         ))}
//       </Select>

//       <Select label="Periode Monitoring" value={periodId} onChange={(e) => setPeriodId(e.target.value)} required>
//         <option value="">Pilih periode</option>
//         {periods.map((p) => (
//           <option key={p.id} value={p.id}>
//             {p.label ?? `${p.tahun} - Semester ${p.semester}`}
//           </option>
//         ))}
//       </Select>

//       <Input
//         label="Jumlah Individu (Pohon/Ekor)"
//         type="number"
//         min={0}
//         value={jumlah}
//         onChange={(e) => setJumlah(e.target.value)}
//         required
//       />

//       {error && <p className="text-sm text-danger mb-4">{error}</p>}

//       <Button type="submit" disabled={submitting}>
//         {submitting ? 'Menyimpan...' : 'Simpan & Ajukan Verifikasi'}
//       </Button>
//     </form>
//   );
// }


// Kode Baru

'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
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
  semester: string;
  label: string | null;
}

interface SpeciesRecordFormValues {
  speciesId: string;
  periodId: string;
  jumlahIndividu: number;
}

interface SpeciesRecordFormProps {
  mode?: 'create' | 'edit';
  recordId?: string;
  initialValues?: SpeciesRecordFormValues;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function SpeciesRecordForm({
  mode = 'create',
  recordId,
  initialValues,
  onSuccess,
  onCancel,
}: SpeciesRecordFormProps) {
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [showAddPeriod, setShowAddPeriod] = useState(false);
  const [newPeriodYear, setNewPeriodYear] = useState('');
  const [newPeriodSemester, setNewPeriodSemester] = useState('1');
  const [addingPeriod, setAddingPeriod] = useState(false);
  const [periodError, setPeriodError] = useState('');
  const [speciesId, setSpeciesId] = useState(
    initialValues?.speciesId ?? ''
  );

  const [periodId, setPeriodId] = useState(
    initialValues?.periodId ?? ''
  );

  const [jumlah, setJumlah] = useState(
    initialValues ? String(initialValues.jumlahIndividu) : ''
  );

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // State untuk tambah spesies
  const [showAddSpecies, setShowAddSpecies] = useState(false);
  const [newNamaLokal, setNewNamaLokal] = useState('');
  const [newNamaIlmiah, setNewNamaIlmiah] = useState('');
  const [newJenis, setNewJenis] = useState<'flora' | 'fauna'>('flora');
  const [addingSpecies, setAddingSpecies] = useState(false);
  const [speciesError, setSpeciesError] = useState('');

  const toast = useToast();
  const { data: session } = useSession();

  const userRole = (
    session?.user as { role?: string } | undefined
  )?.role;

  const isAdmin =
  userRole === 'admin' || userRole === 'super_admin';
  useEffect(() => {
    loadSpecies();
    loadPeriods();
  }, []);

  async function loadSpecies() {
    try {
      const res = await fetch('/api/species');
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(
          json.message ?? 'Gagal memuat daftar spesies.'
        );
      }

      setSpeciesList(json.data ?? []);
    } catch {
      setError(
        'Gagal memuat daftar spesies. Muat ulang halaman untuk mencoba lagi.'
      );
    }
  }

  async function loadPeriods() {
    try {
      const res = await fetch('/api/monitoring-periods');
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(
          json.message ?? 'Gagal memuat daftar periode monitoring.'
        );
      }

      setPeriods(json.data ?? []);
    } catch {
      setError(
        'Gagal memuat daftar periode monitoring. Muat ulang halaman untuk mencoba lagi.'
      );
    }
  }

  async function handleAddPeriod(e: React.FormEvent) {
  e.preventDefault();
  setPeriodError('');

  const tahun = Number(newPeriodYear);

  if (!tahun || tahun < 2022) {
    setPeriodError('Tahun periode tidak valid.');
    return;
  }

  setAddingPeriod(true);

  try {
    const res = await fetch('/api/monitoring-periods', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tahun,
        semester: newPeriodSemester,
        label: `${tahun} - Semester ${newPeriodSemester}`,
      }),
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      const message =
        json.message ??
        'Gagal menambahkan periode monitoring.';

      setPeriodError(message);
      toast.error(message);
      return;
    }

    setPeriods((current) =>
      [...current, json.data].sort((a, b) => {
        if (a.tahun !== b.tahun) {
          return a.tahun - b.tahun;
        }

        return a.semester.localeCompare(b.semester);
      })
    );

    setPeriodId(json.data.id);

    setNewPeriodYear('');
    setNewPeriodSemester('1');
    setShowAddPeriod(false);

    toast.success(
      `Periode ${tahun} berhasil ditambahkan.`
    );
  } catch {
    const message =
      'Terjadi kesalahan jaringan saat menambahkan periode.';

    setPeriodError(message);
    toast.error(message);
  } finally {
    setAddingPeriod(false);
  }
}

  async function handleAddSpecies(e: React.FormEvent) {
    e.preventDefault();
    setSpeciesError('');

    const namaLokal = newNamaLokal.trim();
    const namaIlmiah = newNamaIlmiah.trim();

    if (!namaLokal || !namaIlmiah || !newJenis) {
      setSpeciesError('Semua data spesies wajib diisi.');
      return;
    }

    setAddingSpecies(true);

    try {
      const res = await fetch('/api/species', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          namaLokal,
          namaIlmiah,
          jenis: newJenis,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        const message =
          json.message ?? 'Gagal menambahkan spesies baru.';

        setSpeciesError(message);
        toast.error(message);
        return;
      }

      const newSpecies: Species = json.data;

      setSpeciesList((current) => [
        ...current,
        newSpecies,
      ]);

      setSpeciesId(newSpecies.id);

      setNewNamaLokal('');
      setNewNamaIlmiah('');
      setNewJenis('flora');
      setShowAddSpecies(false);

      toast.success(
        `Spesies "${newSpecies.namaLokal}" berhasil ditambahkan.`
      );
    } catch {
      const message =
        'Terjadi kesalahan jaringan saat menambahkan spesies.';

      setSpeciesError(message);
      toast.error(message);
    } finally {
      setAddingSpecies(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

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
      const isEdit = mode === 'edit' && recordId;

      const res = await fetch(
        isEdit
          ? `/api/species-records/${recordId}`
          : '/api/species-records',
        {
          method: isEdit ? 'PUT' : 'POST',
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
        const message =
          json.message ?? 'Gagal menyimpan data.';

        setError(message);
        toast.error(message);
        return;
      }

      const namaSpesies =
        speciesList.find(
          (s) => s.id === speciesId
        )?.namaLokal ?? 'Data';

      toast.success(
        isEdit
          ? `${namaSpesies} berhasil diperbarui.`
          : `${namaSpesies} berhasil disimpan dan diajukan untuk verifikasi.`
      );

      if (!isEdit) {
        setSpeciesId('');
        setPeriodId('');
        setJumlah('');
      }

      onSuccess?.();
    } catch {
      const message =
        'Terjadi kesalahan jaringan. Silakan coba lagi.';

      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* FORM INPUT DATA MONITORING */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Select
            label="Spesies"
            value={speciesId}
            onChange={(e) =>
              setSpeciesId(e.target.value)
            }
            required
          >
            <option value="">
              Pilih spesies
            </option>

            {speciesList.map((s) => (
              <option
                key={s.id}
                value={s.id}
              >
                {s.namaLokal} ({s.namaIlmiah}) —{' '}
                {s.jenis === 'flora'
                  ? 'Flora'
                  : 'Fauna'}
              </option>
            ))}
          </Select>

          {mode === 'create' && (
            <div className="mt-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setSpeciesError('');
                  setShowAddSpecies(true);
                }}
              >
                + Tambah Spesies
              </Button>
            </div>
          )}
        </div>

        <Select
          label="Periode Monitoring"
          value={periodId}
          onChange={(e) =>
            setPeriodId(e.target.value)
          }
          required
        >
          <option value="">
            Pilih periode
          </option>

          {periods.map((p) => (
            <option
              key={p.id}
              value={p.id}
            >
              {p.label ??
                `${p.tahun} - Semester ${p.semester}`}
            </option>
          ))}
        </Select>
          {mode === 'create' && isAdmin && (
  <div className="mt-3 mb-4">
    <Button
      type="button"
      variant="secondary"
      onClick={() => {
        setPeriodError('');
        setShowAddPeriod(true);
      }}
    >
      + Tambah Periode
    </Button>
  </div>
)}
        <Input
          label="Jumlah Individu (Pohon/Ekor)"
          type="number"
          min={0}
          value={jumlah}
          onChange={(e) =>
            setJumlah(e.target.value)
          }
          required
        />

        {mode === 'edit' && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Catatan: mengedit data yang berstatus
            &quot;Ditolak&quot; akan mengajukannya ulang
            untuk verifikasi.
          </p>
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
            {submitting
              ? 'Menyimpan...'
              : mode === 'edit'
                ? 'Simpan Perubahan'
                : 'Simpan & Ajukan Verifikasi'}
          </Button>

          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={submitting}
            >
              Batal
            </Button>
          )}
        </div>
      </form>

      {/* MODAL TAMBAH SPESIES */}
      {showAddSpecies && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => {
            if (!addingSpecies) {
              setShowAddSpecies(false);
            }
          }}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Tambah Spesies Baru
            </h2>

            <p className="mt-1 mb-5 text-sm text-gray-500 dark:text-gray-400">
              Masukkan informasi spesies yang belum
              tersedia pada daftar.
            </p>

            <form onSubmit={handleAddSpecies}>
              <Input
                label="Nama Lokal"
                value={newNamaLokal}
                onChange={(e) =>
                  setNewNamaLokal(e.target.value)
                }
                placeholder="Contoh: Mangga"
                required
                disabled={addingSpecies}
              />

              <Input
                label="Nama Ilmiah"
                value={newNamaIlmiah}
                onChange={(e) =>
                  setNewNamaIlmiah(e.target.value)
                }
                placeholder="Contoh: Mangifera indica"
                required
                disabled={addingSpecies}
              />

              <Select
                label="Jenis"
                value={newJenis}
                onChange={(e) =>
                  setNewJenis(
                    e.target.value as
                      | 'flora'
                      | 'fauna'
                  )
                }
                required
              >
                <option value="flora">
                  Flora
                </option>
                <option value="fauna">
                  Fauna
                </option>
              </Select>

              {speciesError && (
                <p className="mb-4 text-sm text-danger">
                  {speciesError}
                </p>
              )}

              <div className="mt-6 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    setShowAddSpecies(false)
                  }
                  disabled={addingSpecies}
                >
                  Batal
                </Button>

                <Button
                  type="submit"
                  disabled={addingSpecies}
                >
                  {addingSpecies
                    ? 'Menyimpan...'
                    : 'Simpan Spesies'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* MODAL TAMBAH PERIODE */}
{showAddPeriod && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    onClick={() => {
      if (!addingPeriod) {
        setShowAddPeriod(false);
      }
    }}
  >
    <div
      className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Tambah Periode Monitoring
      </h2>

      <p className="mt-1 mb-5 text-sm text-gray-500 dark:text-gray-400">
        Tambahkan periode monitoring baru.
      </p>

      <form onSubmit={handleAddPeriod}>
        <Input
          label="Tahun"
          type="number"
          min={2021}
          value={newPeriodYear}
          onChange={(e) =>
            setNewPeriodYear(e.target.value)
          }
          placeholder="Contoh: 2027"
          required
          disabled={addingPeriod}
        />

        <Select
          label="Semester"
          value={newPeriodSemester}
          onChange={(e) =>
            setNewPeriodSemester(e.target.value)
          }
          required
          disabled={addingPeriod}
        >
          <option value="1">Semester 1</option>
          <option value="2">Semester 2</option>
        </Select>

        {periodError && (
          <p className="mb-4 text-sm text-danger">
            {periodError}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              setShowAddPeriod(false)
            }
            disabled={addingPeriod}
          >
            Batal
          </Button>

          <Button
            type="submit"
            disabled={addingPeriod}
          >
            {addingPeriod
              ? 'Menyimpan...'
              : 'Simpan Periode'}
          </Button>
        </div>
      </form>
    </div>
  </div>
)}
    </>
  );
}