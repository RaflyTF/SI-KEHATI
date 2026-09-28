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

// interface SpeciesRecordFormValues {
//   speciesId: string;
//   periodId: string;
//   jumlahIndividu: number;
// }

// interface SpeciesRecordFormProps {
//   mode?: 'create' | 'edit';
//   recordId?: string;
//   initialValues?: SpeciesRecordFormValues;
//   onSuccess?: () => void;
//   onCancel?: () => void;
// }

// // Form yang sama dipakai untuk input baru maupun edit -- lihat prinsip yang
// // sama seperti ProgramForm/GalleryUploadForm (Component Design pada SDD).
// export function SpeciesRecordForm({ mode = 'create', recordId, initialValues, onSuccess, onCancel }: SpeciesRecordFormProps) {
//   const [speciesList, setSpeciesList] = useState<Species[]>([]);
//   const [periods, setPeriods] = useState<Period[]>([]);
//   const [speciesId, setSpeciesId] = useState(initialValues?.speciesId ?? '');
//   const [periodId, setPeriodId] = useState(initialValues?.periodId ?? '');
//   const [jumlah, setJumlah] = useState(initialValues ? String(initialValues.jumlahIndividu) : '');
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
//       const isEdit = mode === 'edit' && recordId;
//       const res = await fetch(isEdit ? `/api/species-records/${recordId}` : '/api/species-records', {
//         method: isEdit ? 'PUT' : 'POST',
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
//       toast.success(
//         isEdit
//           ? `${namaSpesies} berhasil diperbarui.`
//           : `${namaSpesies} berhasil disimpan dan diajukan untuk verifikasi.`
//       );

//       if (!isEdit) {
//         setSpeciesId('');
//         setPeriodId('');
//         setJumlah('');
//       }
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

//       {mode === 'edit' && (
//         <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
//           Catatan: mengedit data yang berstatus &quot;Ditolak&quot; akan mengajukannya ulang untuk verifikasi.
//         </p>
//       )}

//       {error && <p className="text-sm text-danger mb-4">{error}</p>}

//       <div className="flex gap-2">
//         <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
//           {submitting ? 'Menyimpan...' : mode === 'edit' ? 'Simpan Perubahan' : 'Simpan & Ajukan Verifikasi'}
//         </Button>
//         {onCancel && (
//           <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
//             Batal
//           </Button>
//         )}
//       </div>
//     </form>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
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

  const [speciesId, setSpeciesId] = useState(
    initialValues?.speciesId ?? ''
  );

  const [periodId, setPeriodId] = useState(
    initialValues?.periodId ?? ''
  );

  const [jumlah, setJumlah] = useState(
    initialValues
      ? String(initialValues.jumlahIndividu)
      : ''
  );

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Toast
  const toast = useToast();

  // =========================
  // STATE TAMBAH SPESIES
  // =========================

  const [showAddSpecies, setShowAddSpecies] =
    useState(false);

  const [newNamaLokal, setNewNamaLokal] =
    useState('');

  const [newNamaIlmiah, setNewNamaIlmiah] =
    useState('');

  const [newJenis, setNewJenis] =
    useState<'flora' | 'fauna'>('flora');

  const [addingSpecies, setAddingSpecies] =
    useState(false);

  const [speciesError, setSpeciesError] =
    useState('');

  // =========================
  // LOAD DATA SPESIES
  // =========================

  async function loadSpecies() {
    try {
      const res = await fetch('/api/species');

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(
          json.message ??
            'Gagal memuat daftar spesies.'
        );
      }

      setSpeciesList(json.data ?? []);
    } catch {
      setError(
        'Gagal memuat daftar spesies. Muat ulang halaman untuk mencoba lagi.'
      );
    }
  }

  // =========================
  // LOAD PERIODE
  // =========================

  async function loadPeriods() {
    try {
      const res = await fetch(
        '/api/monitoring-periods'
      );

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(
          json.message ??
            'Gagal memuat daftar periode monitoring.'
        );
      }

      setPeriods(json.data ?? []);
    } catch {
      setError(
        'Gagal memuat daftar periode monitoring. Muat ulang halaman untuk mencoba lagi.'
      );
    }
  }

  useEffect(() => {
    loadSpecies();
    loadPeriods();
  }, []);

  // =========================
  // TAMBAH SPESIES BARU
  // =========================

  async function handleAddSpecies(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setSpeciesError('');

    if (
      !newNamaLokal.trim() ||
      !newNamaIlmiah.trim()
    ) {
      setSpeciesError(
        'Nama lokal dan nama ilmiah wajib diisi.'
      );
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
          namaLokal: newNamaLokal.trim(),
          namaIlmiah: newNamaIlmiah.trim(),
          jenis: newJenis,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(
          json.message ??
            'Gagal menambahkan spesies.'
        );
      }

      const newSpecies: Species = json.data;

      // Tambahkan spesies baru ke dropdown
      setSpeciesList((current) => [
        ...current,
        newSpecies,
      ]);

      // Otomatis pilih spesies baru
      setSpeciesId(newSpecies.id);

      // Reset form
      setNewNamaLokal('');
      setNewNamaIlmiah('');
      setNewJenis('flora');

      // Tutup modal
      setShowAddSpecies(false);

      toast.success(
        `Spesies "${newSpecies.namaLokal}" berhasil ditambahkan.`
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Gagal menambahkan spesies.';

      setSpeciesError(message);
      toast.error(message);
    } finally {
      setAddingSpecies(false);
    }
  }

  // =========================
  // SIMPAN DATA MONITORING
  // =========================

  async function handleSubmit(
    e: React.FormEvent
  ) {
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
      const isEdit =
        mode === 'edit' && recordId;

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
          json.message ??
          'Gagal menyimpan data.';

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

  // =========================
  // TAMPILAN
  // =========================

  return (
    <>
      {/* FORM INPUT MONITORING */}

      <form onSubmit={handleSubmit}>

        {/* SPESIES */}

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

            {speciesList.map((species) => (
              <option
                key={species.id}
                value={species.id}
              >
                {species.namaLokal} (
                {species.namaIlmiah}) —{' '}
                {species.jenis === 'flora'
                  ? 'Flora'
                  : 'Fauna'}
              </option>
            ))}
          </Select>

          {/* TAMBAH SPESIES */}

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

        {/* PERIODE MONITORING */}

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

        {/* JUMLAH INDIVIDU */}

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

        {/* CATATAN EDIT */}

        {mode === 'edit' && (
          <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
            Catatan: mengedit data yang berstatus
            &quot;Ditolak&quot; akan mengajukannya
            ulang untuk verifikasi.
          </p>
        )}

        {/* ERROR */}

        {error && (
          <p className="mb-4 text-sm text-danger">
            {error}
          </p>
        )}

        {/* TOMBOL */}

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

      {/* =========================
          MODAL TAMBAH SPESIES
          ========================= */}

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
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Tambah Spesies Baru
            </h2>

            <p className="mb-5 mt-1 text-sm text-gray-500 dark:text-gray-400">
              Masukkan informasi spesies yang
              belum tersedia dalam daftar.
            </p>

            <form onSubmit={handleAddSpecies}>
              {/* NAMA LOKAL */}

              <Input
                label="Nama Lokal"
                value={newNamaLokal}
                onChange={(e) =>
                  setNewNamaLokal(
                    e.target.value
                  )
                }
                placeholder="Contoh: Matoa"
                required
              />

              {/* NAMA ILMIAH */}

              <Input
                label="Nama Ilmiah"
                value={newNamaIlmiah}
                onChange={(e) =>
                  setNewNamaIlmiah(
                    e.target.value
                  )
                }
                placeholder="Contoh: Pometia pinnata"
                required
              />

              {/* JENIS */}

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
              >
                <option value="flora">
                  Flora
                </option>

                <option value="fauna">
                  Fauna
                </option>
              </Select>

              {/* ERROR */}

              {speciesError && (
                <p className="mb-4 text-sm text-danger">
                  {speciesError}
                </p>
              )}

              {/* BUTTON */}

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    if (!addingSpecies) {
                      setShowAddSpecies(false);
                    }
                  }}
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
    </>
  );
}