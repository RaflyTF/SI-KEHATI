// 'use client';

// import { useState } from 'react';
// import { Input } from '@/components/ui/Input';
// import { Select } from '@/components/ui/Select';
// import { Button } from '@/components/ui/Button';
// import { useToast } from '@/components/providers/ToastProvider';

// export function ProgramForm({ onSuccess }: { onSuccess?: () => void }) {
//   const [nama, setNama] = useState('');
//   const [deskripsi, setDeskripsi] = useState('');
//   const [anggaran, setAnggaran] = useState('');
//   const [status, setStatus] = useState<'draft' | 'published'>('draft');
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState('');
//   const toast = useToast();

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setError('');
//     const anggaranNum = Number(anggaran);
//     if (!nama || !deskripsi || Number.isNaN(anggaranNum) || anggaranNum < 0) {
//       setError('Semua field wajib diisi dengan benar.');
//       return;
//     }

//     setSubmitting(true);
//     try {
//       const res = await fetch('/api/programs', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ nama, deskripsi, anggaran: anggaranNum, status }),
//       });
//       const json = await res.json();

//       if (!res.ok || !json.success) {
//         const message = json.message ?? 'Gagal menyimpan program.';
//         setError(message);
//         toast.error(message);
//         return;
//       }
//       toast.success(`Program "${nama}" berhasil disimpan.`);
//       setNama('');
//       setDeskripsi('');
//       setAnggaran('');
//       setStatus('draft');
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
//       <Input label="Nama Program" value={nama} onChange={(e) => setNama(e.target.value)} required />
//       <label className="block mb-4">
//         <span className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi</span>
//         <textarea
//           className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 text-sm"
//           rows={3}
//           value={deskripsi}
//           onChange={(e) => setDeskripsi(e.target.value)}
//           required
//         />
//       </label>
//       <Input
//         label="Anggaran (Rp)"
//         type="number"
//         min={0}
//         value={anggaran}
//         onChange={(e) => setAnggaran(e.target.value)}
//         required
//       />
//       <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}>
//         <option value="draft">Draft (belum tampil publik)</option>
//         <option value="published">Published</option>
//       </Select>
//       {error && <p className="text-sm text-danger mb-4">{error}</p>}
//       <Button type="submit" disabled={submitting}>
//         {submitting ? 'Menyimpan...' : 'Simpan Program'}
//       </Button>
//     </form>
//   );
// }


// Kode Baru


'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/providers/ToastProvider';

interface ProgramFormValues {
  nama: string;
  deskripsi: string;
  anggaran: number;
  status: 'draft' | 'published';
}

interface SupportingDataInput {
  id?: string;
  namaDaerah: string;
  jumlah2022: string;
  jumlah2023: string;
  jumlah2024: string;
  jumlah2025: string;
  jumlah2026: string;
}

interface ProgramFormProps {
  mode?: 'create' | 'edit';
  programId?: string;
  initialValues?: ProgramFormValues;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface ProgramPhoto {
  id: string;
  fileUrl: string;
}

const emptySupportingData = (): SupportingDataInput => ({
  namaDaerah: '',
  jumlah2022: '',
  jumlah2023: '',
  jumlah2024: '',
  jumlah2025: '',
  jumlah2026: '',
});

export function ProgramForm({
  mode = 'create',
  programId,
  initialValues,
  onSuccess,
  onCancel,
}: ProgramFormProps) {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [initialPhoto, setInitialPhoto] = useState<ProgramPhoto | null>(null);
  const [nama, setNama] = useState(initialValues?.nama ?? '');
  const [deskripsi, setDeskripsi] = useState(initialValues?.deskripsi ?? '');
  const [anggaran, setAnggaran] = useState(
    initialValues ? String(initialValues.anggaran) : ''
  );
  const [status, setStatus] = useState<'draft' | 'published'>(
    initialValues?.status ?? 'draft'
  );

  const [supportingData, setSupportingData] = useState<
  SupportingDataInput[]
>([]);

useEffect(() => {
  if (mode !== 'edit' || !programId) {
    return;
  }

  async function loadSupportingData() {
    try {
      const response = await fetch(
        `/api/programs/${programId}/supporting-data`
      );

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(
          json.message ?? 'Gagal mengambil Data Pendukung.'
        );
      }

      const data: SupportingDataInput[] = (json.data ?? []).map(
      (item: {
        id: string;
        namaDaerah: string;
        jumlah2022: number;
        jumlah2023: number;
        jumlah2024: number;
        jumlah2025: number;
        jumlah2026: number;
      }) => ({
        id: item.id,
        namaDaerah: item.namaDaerah,
        jumlah2022: String(item.jumlah2022),
        jumlah2023: String(item.jumlah2023),
        jumlah2024: String(item.jumlah2024),
        jumlah2025: String(item.jumlah2025),
        jumlah2026: String(item.jumlah2026),
      })
    );

      setSupportingData(data);

      // Ambil foto utama saat mode edit
      const programResponse = await fetch(`/api/programs/${programId}`);
      const programJson = await programResponse.json().catch(() => null);

      if (programResponse.ok && programJson?.data?.photos?.length) {
        const photo = programJson.data.photos[0];

        setInitialPhoto({
          id: photo.id,
          fileUrl: photo.fileUrl,
        });

        setPhotoPreview(photo.fileUrl);
      }
    } catch (err) {
      console.error('Gagal memuat Data Pendukung:', err);
    }
  }

  loadSupportingData();
}, [mode, programId]);

const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const toast = useToast();

  function addSupportingData() {
    setSupportingData((current) => [
      ...current,
      emptySupportingData(),
    ]);
  }

  function removeSupportingData(index: number) {
    setSupportingData((current) =>
      current.filter((_, i) => i !== index)
    );
  }

  function updateSupportingData(
    index: number,
    field: keyof SupportingDataInput,
    value: string
  ) {
    setSupportingData((current) =>
      current.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  }

  async function saveSupportingData(programId: string) {
  // Ambil data yang saat ini tersimpan di database
  const existingResponse = await fetch(
    `/api/programs/${programId}/supporting-data`
  );

  const existingJson = await existingResponse.json();

  if (!existingResponse.ok || !existingJson.success) {
    throw new Error(
      existingJson.message ?? 'Gagal mengambil Data Pendukung.'
    );
  }

  const existingData = existingJson.data ?? [];

  // Hanya proses baris yang memiliki nama daerah
  const validRows = supportingData.filter(
  (item) => item.namaDaerah.trim() !== ''
);

  console.log('DEBUG - validRows:', validRows);
  console.log('DEBUG - 2025:', validRows.map(item => item.jumlah2025));

  // =====================================================
  // 1. UPDATE data yang sudah ada
  // =====================================================
  for (const item of validRows) {
    if (!item.id) {
      continue;
    }

    const response = await fetch(
      `/api/programs/${programId}/supporting-data`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: item.id,
          namaDaerah: item.namaDaerah.trim(),
          jumlah2022: Number(item.jumlah2022) || 0,
          jumlah2023: Number(item.jumlah2023) || 0,
          jumlah2024: Number(item.jumlah2024) || 0,
          jumlah2025: Number(item.jumlah2025) || 0,
          jumlah2026: Number(item.jumlah2026) || 0,
        }),
      }
    );

    const json = await response.json();

    if (!response.ok || !json.success) {
      throw new Error(
        json.message ?? 'Gagal memperbarui Data Pendukung.'
      );
    }
  }

  // =====================================================
  // 2. TAMBAH data baru
  // =====================================================
  for (const item of validRows) {
    if (item.id) {
      continue;
    }

    const response = await fetch(
      `/api/programs/${programId}/supporting-data`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
       body: JSON.stringify({
        namaDaerah: item.namaDaerah.trim(),
        jumlah2022: Number(item.jumlah2022) || 0,
        jumlah2023: Number(item.jumlah2023) || 0,
        jumlah2024: Number(item.jumlah2024) || 0,
        jumlah2025: Number(item.jumlah2025) || 0,
        jumlah2026: Number(item.jumlah2026) || 0,
      }),
       }
    );

    const json = await response.json();

    if (!response.ok || !json.success) {
      throw new Error(
        json.message ?? 'Gagal menambahkan Data Pendukung.'
      );
    }
  }

  // =====================================================
  // 3. HAPUS data yang dihapus dari tabel
  // =====================================================
  const currentIds = validRows
    .filter((item) => item.id)
    .map((item) => item.id);

  const deletedRows = existingData.filter(
    (item: { id: string }) => !currentIds.includes(item.id)
  );

  for (const item of deletedRows) {
    const response = await fetch(
      `/api/programs/${programId}/supporting-data`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: item.id,
        }),
      }
    );

    const json = await response.json();

    if (!response.ok || !json.success) {
      throw new Error(
        json.message ?? 'Gagal menghapus Data Pendukung.'
      );
    }
  }
}

  // =====================================================
  // FOTO UTAMA
  // =====================================================

  function handlePhotoChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setError('');

    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Format foto harus JPG, PNG atau WEBP.');
      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran foto maksimal 5 MB.');
      event.target.value = '';
      return;
    }

    setPhotoFile(file);

    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
  }

  async function savePhoto(savedProgramId: string) {
    if (!photoFile) {
      return;
    }

    const uploadData = new FormData();
    uploadData.append('file', photoFile);

    const uploadResponse = await fetch('/api/gallery/upload', {
      method: 'POST',
      body: uploadData,
    });

    const uploadJson = await uploadResponse.json().catch(() => null);

    if (!uploadResponse.ok || !uploadJson?.data?.fileUrl) {
      throw new Error(
        uploadJson?.message || 'Gagal mengunggah foto.'
      );
    }

    const fileUrl = uploadJson.data.fileUrl;

    const photoResponse = await fetch(
      `/api/programs/${savedProgramId}/photos`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileUrl }),
      }
    );

    const photoJson = await photoResponse.json().catch(() => null);

    if (!photoResponse.ok || !photoJson?.success) {
      throw new Error(
        photoJson?.message || 'Gagal menyimpan foto utama.'
      );
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const anggaranNum = Number(anggaran);

    if (
      !nama.trim() ||
      !deskripsi.trim() ||
      Number.isNaN(anggaranNum) ||
      anggaranNum < 0
    ) {
      setError('Semua field wajib diisi dengan benar.');
      return;
    }

    if (!photoFile && !initialPhoto) {
      setError('Silakan pilih foto utama terlebih dahulu.');
      return;
    }

    // Validasi Data Pendukung
    const invalidSupportingRow = supportingData.find(
      (item) => {
        if (!item.namaDaerah.trim()) return false;

        return (
          Number(item.jumlah2022) < 0 ||
          Number(item.jumlah2023) < 0 ||
          Number(item.jumlah2024) < 0 ||
          Number(item.jumlah2025) < 0 ||
          Number(item.jumlah2026) < 0 ||
          Number.isNaN(Number(item.jumlah2022)) ||
          Number.isNaN(Number(item.jumlah2023)) ||
          Number.isNaN(Number(item.jumlah2024)) ||
          Number.isNaN(Number(item.jumlah2025)) ||
          Number.isNaN(Number(item.jumlah2026))
        );
      }
    );

    if (invalidSupportingRow) {
      setError(
        'Jumlah individu pada Data Pendukung harus berupa angka 0 atau lebih.'
      );
      return;
    }

    setSubmitting(true);

    try {
      const isEdit = mode === 'edit' && programId;

      const res = await fetch(
        isEdit
          ? `/api/programs/${programId}`
          : '/api/programs',
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nama: nama.trim(),
            deskripsi: deskripsi.trim(),
            anggaran: anggaranNum,
            status,
          }),
        }
      );

      const json = await res.json();

      if (!res.ok || !json.success) {
        const message =
          json.message ?? 'Gagal menyimpan program.';

        setError(message);
        toast.error(message);
        return;
      }

      /*
       * Pada mode create, API mengembalikan program yang baru dibuat.
       * ID tersebut digunakan untuk menyimpan Data Pendukung.
       */
      const savedProgramId =
  isEdit
    ? programId
    : json.data?.id;

if (!savedProgramId) {
  throw new Error(
    'Program berhasil dibuat, tetapi ID program tidak ditemukan.'
  );
}

console.log('DEBUG - akan menyimpan Data Pendukung:', {
  isEdit,
  programId,
  savedProgramId,
  supportingData,
});

await saveSupportingData(savedProgramId);
await savePhoto(savedProgramId);

toast.success(
  isEdit
    ? `Program "${nama}" berhasil diperbarui.`
    : `Program "${nama}" berhasil disimpan.`
);
      if (!isEdit) {
        setNama('');
        setDeskripsi('');
        setAnggaran('');
        setStatus('draft');
        setSupportingData([]);
        setPhotoFile(null);
        setPhotoPreview('');
        setInitialPhoto(null);
      }

      onSuccess?.();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat menyimpan data.';

      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
  <form
    onSubmit={handleSubmit}
    className="space-y-5 max-h-[80vh] overflow-y-auto pr-2"
  >
      <Input
        label="Nama Program"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        required
      />

      <label className="block">
        <span className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          Deskripsi
        </span>

        <textarea
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 text-sm transition-colors duration-150 hover:border-gray-400 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/40"
          rows={3}
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          required
        />
      </label>

      <Input
        label="Anggaran (Rp)"
        type="number"
        min={0}
        value={anggaran}
        onChange={(e) => setAnggaran(e.target.value)}
        required
      />

      <Select
        label="Status"
        value={status}
        onChange={(e) =>
          setStatus(
            e.target.value as 'draft' | 'published'
          )
        }
      >
        <option value="draft">
          Draft (belum tampil publik)
        </option>
        <option value="published">
          Published
        </option>
      </Select>

      {/* =====================================================
    DATA PENDUKUNG
    Ditampilkan pada Tambah dan Edit Program
    ===================================================== */}
    <section className="pt-2">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Data Pendukung
            </h3>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Masukkan jumlah individu berdasarkan nama daerah
              dan tahun pengamatan.
            </p>
          </div>

          {supportingData.length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="w-full min-w-[680px] text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <th className="px-3 py-2 text-left font-medium">
                      No
                    </th>

                    <th className="px-3 py-2 text-left font-medium">
                      Nama Daerah
                    </th>

                    <th className="px-3 py-2 text-center font-medium">
                      2022
                    </th>

                    <th className="px-3 py-2 text-center font-medium">
                      2023
                    </th>

                    <th className="px-3 py-2 text-center font-medium">
                      2024
                    </th>

                    <th className="px-3 py-2 text-center font-medium">
                      2025
                    </th>

                    <th className="px-3 py-2 text-center font-medium">
                      2026
                    </th>

                    <th className="px-3 py-2 text-center font-medium">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {supportingData.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                    >
                      <td className="px-3 py-2 text-center">
                        {index + 1}
                      </td>

                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={item.namaDaerah}
                          onChange={(e) =>
                            updateSupportingData(
                              index,
                              'namaDaerah',
                              e.target.value
                            )
                          }
                          placeholder="Nama daerah"
                          className="w-full min-w-[140px] rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-green-600 dark:border-gray-700 dark:bg-gray-900"
                        />
                      </td>

                      {(
                        [
                          'jumlah2022',
                          'jumlah2023',
                          'jumlah2024',
                          'jumlah2025',
                          'jumlah2026',
                        ] as const
                      ).map((field) => (
                        <td
                          key={field}
                          className="px-3 py-2"
                        >
                          <input
                            type="number"
                            min={0}
                            value={item[field]}
                            onChange={(e) =>
                              updateSupportingData(
                                index,
                                field,
                                e.target.value
                              )
                            }
                            placeholder="0"
                            className="w-20 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-center outline-none focus:border-green-600 dark:border-gray-700 dark:bg-gray-900"
                          />
                        </td>
                      ))}

                      <td className="px-3 py-2 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            removeSupportingData(index)
                          }
                          disabled={submitting}
                          className="text-xs font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button
            type="button"
            onClick={addSupportingData}
            disabled={submitting}
            className="mt-3 inline-flex items-center rounded-lg border border-green-700 px-3 py-2 text-sm font-medium text-green-700 transition hover:bg-green-50 disabled:opacity-50 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-950/30"
          >
            + Tambah Data Pendukung
          </button>
       </section>
         {/* FOTO UTAMA */}
<div className="mt-8">
  <label className="mb-2 block text-base font-medium text-[#17365D]">
    Foto 
  </label>

  <p className="mb-3 text-sm text-gray-600">
    Pilih foto untuk program konservasi.
  </p>

  <input
    type="file"
    accept="image/jpeg,image/png,image/webp"
    onChange={handlePhotoChange}
    className="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700
               file:mr-4 file:rounded-lg file:border-0
               file:bg-gray-100 file:px-4 file:py-2
               file:text-sm file:font-medium file:text-gray-700
               hover:file:bg-gray-200"
  />

  {photoPreview && (
    <div className="mt-4">
      <p className="mb-2 text-sm font-medium text-gray-700">
        Preview Foto
      </p>

      <img
        src={photoPreview}
        alt="Preview foto utama"
        className="h-64 w-full rounded-xl object-cover border border-gray-300"
      />
    </div>
  )}
</div>
      {error && (
        <p className="text-sm text-danger">
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
              : 'Simpan Program'}
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
  );
}
