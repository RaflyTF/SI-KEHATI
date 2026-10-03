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

interface ProgramPhoto {
  id: string;
  fileUrl: string;
}

interface ProgramFormProps {
  mode?: 'create' | 'edit';
  programId?: string;
  initialValues?: ProgramFormValues;
  onSuccess?: () => void;
  onCancel?: () => void;
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
  const [nama, setNama] = useState(initialValues?.nama ?? '');
  const [deskripsi, setDeskripsi] = useState(
    initialValues?.deskripsi ?? ''
  );
  const [anggaran, setAnggaran] = useState(
    initialValues ? String(initialValues.anggaran) : ''
  );
  const [status, setStatus] = useState<'draft' | 'published'>(
    initialValues?.status ?? 'draft'
  );

  const [supportingData, setSupportingData] = useState<
    SupportingDataInput[]
  >([]);
  
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [initialPhoto, setInitialPhoto] = useState<ProgramPhoto | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const toast = useToast();

  console.log('PROGRAM FORM YANG DIPAKAI');
  // =========================
  // LOAD DATA SAAT EDIT
  // =========================

  useEffect(() => {
    if (mode !== 'edit' || !programId) return;

    async function loadEditData() {
      try {
        const [supportingResponse, programResponse] = await Promise.all([
          fetch(`/api/programs/${programId}/supporting-data`),
          fetch(`/api/programs/${programId}`),
        ]);

        const supportingJson = await supportingResponse.json();
        const programJson = await programResponse.json();

        if (supportingResponse.ok && Array.isArray(supportingJson?.data)) {
          setSupportingData(
            supportingJson.data.map((item: Record<string, unknown>) => ({
              id: item.id,
              namaDaerah: item.namaDaerah ?? '',
              jumlah2022: String(item.jumlah2022 ?? ''),
              jumlah2023: String(item.jumlah2023 ?? ''),
              jumlah2024: String(item.jumlah2024 ?? ''),
              jumlah2025: String(item.jumlah2025 ?? ''),
              jumlah2026: String(item.jumlah2026 ?? ''),
            }))
          );
        }

        if (programResponse.ok && programJson?.data) {
          const photos = programJson.data.photos ?? [];

          if (photos.length > 0) {
            const photo = photos[0];

            setInitialPhoto({
              id: photo.id,
              fileUrl: photo.fileUrl,
            });

            setPhotoPreview(photo.fileUrl);
          }
        }
      } catch (err) {
        console.error('Gagal memuat data edit:', err);
      }
    }

    loadEditData();
  }, [mode, programId]);

  // =========================
  // DATA PENDUKUNG
  // =========================

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

  async function saveSupportingData(savedProgramId: string) {
    const validRows = supportingData.filter(
      (item) => item.namaDaerah.trim() !== ''
    );

    const existingResponse = await fetch(
      `/api/programs/${savedProgramId}/supporting-data`
    );

    const existingJson = await existingResponse.json();

    if (!existingResponse.ok) {
      throw new Error(
        existingJson?.message || 'Gagal mengambil Data Pendukung.'
      );
    }

    const existingRows = Array.isArray(existingJson?.data)
      ? existingJson.data
      : [];

    for (const oldItem of existingRows) {
      const stillExists = validRows.some(
        (item) => item.id === oldItem.id
      );

      if (!stillExists) {
        const deleteResponse = await fetch(
          `/api/programs/${savedProgramId}/supporting-data/${oldItem.id}`,
          {
            method: 'DELETE',
          }
        );

        if (!deleteResponse.ok) {
          const deleteJson = await deleteResponse.json().catch(() => null);

          throw new Error(
            deleteJson?.message ||
              'Gagal menghapus Data Pendukung.'
          );
        }
      }
    }

    for (const item of validRows) {
      const body = {
        namaDaerah: item.namaDaerah.trim(),
        jumlah2022: Number(item.jumlah2022 || 0),
        jumlah2023: Number(item.jumlah2023 || 0),
        jumlah2024: Number(item.jumlah2024 || 0),
        jumlah2025: Number(item.jumlah2025 || 0),
        jumlah2026: Number(item.jumlah2026 || 0),
      };

      if (item.id) {
        const response = await fetch(
          `/api/programs/${savedProgramId}/supporting-data/${item.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          }
        );

        if (!response.ok) {
          const json = await response.json().catch(() => null);

          throw new Error(
            json?.message ||
              'Gagal memperbarui Data Pendukung.'
          );
        }
      } else {
        const response = await fetch(
          `/api/programs/${savedProgramId}/supporting-data`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          }
        );

        if (!response.ok) {
          const json = await response.json().catch(() => null);

          throw new Error(
            json?.message ||
              'Gagal menambahkan Data Pendukung.'
          );
        }
      }
    }
  }

  // =========================
  // FOTO UTAMA
  // =========================
  
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
      setError('Format foto harus JPG, PNG, atau WEBP.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran foto maksimal 5 MB.');
      return;
    }

    setPhotoFile(file);

    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
  }

  async function savePhoto(savedProgramId: string) {
    if (!photoFile && initialPhoto) {
      return;
    }

    if (!photoFile && !initialPhoto) {
      throw new Error(
        'Silakan pilih foto utama terlebih dahulu.'
      );
    }

    let fileUrl = initialPhoto?.fileUrl ?? '';

    if (photoFile) {
      const uploadData = new FormData();

      uploadData.append('file', photoFile);

      const uploadResponse = await fetch(
        '/api/gallery/upload',
        {
          method: 'POST',
          body: uploadData,
        }
      );

      const uploadJson = await uploadResponse.json();

      if (
        !uploadResponse.ok ||
        !uploadJson?.data?.fileUrl
      ) {
        throw new Error(
          uploadJson?.message ||
            'Gagal mengunggah foto.'
        );
      }

      fileUrl = uploadJson.data.fileUrl;
    }

    const photoResponse = await fetch(
      `/api/programs/${savedProgramId}/photos`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileUrl,
        }),
      }
    );

    const photoJson = await photoResponse.json();

    if (!photoResponse.ok) {
      throw new Error(
        photoJson?.message ||
          'Gagal menyimpan foto utama.'
      );
    }
  }

  // =========================
  // SUBMIT
  // =========================

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError('');

    const anggaranNum = Number(anggaran);

    if (
      !nama ||
      !deskripsi ||
      Number.isNaN(anggaranNum) ||
      anggaranNum < 0
    ) {
      setError(
        'Semua field wajib diisi dengan benar.'
      );
      return;
    }

    if (!photoFile && !initialPhoto) {
      setError(
        'Silakan pilih foto utama terlebih dahulu.'
      );
      return;
    }

    setSubmitting(true);

    try {
      const isEdit =
        mode === 'edit' && programId;

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
            nama,
            deskripsi,
            anggaran: anggaranNum,
            status,
          }),
        }
      );

      const json = await res.json();

      if (!res.ok || !json.success) {
        const message =
          json.message ??
          'Gagal menyimpan program.';

        setError(message);
        toast.error(message);
        return;
      }

      const savedProgramId =
        isEdit
          ? programId
          : json?.data?.id;

      if (!savedProgramId) {
        throw new Error(
          'ID program tidak ditemukan.'
        );
      }

      await saveSupportingData(
        savedProgramId
      );

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
      console.error(err);

      const message =
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat menyimpan program.';

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
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* NAMA PROGRAM */}

      <Input
        label="Nama Program"
        value={nama}
        onChange={(e) =>
          setNama(e.target.value)
        }
        required
      />

      {/* DESKRIPSI */}

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Deskripsi
        </span>

        <textarea
          className="w-full rounded-lg border border-gray-300 bg-white p-2 text-sm transition-colors duration-150 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
          rows={3}
          value={deskripsi}
          onChange={(e) =>
            setDeskripsi(e.target.value)
          }
          required
        />
      </label>

      {/* ANGGARAN */}

      <Input
        label="Anggaran (Rp)"
        type="number"
        min={0}
        value={anggaran}
        onChange={(e) =>
          setAnggaran(e.target.value)
        }
        required
      />

      {/* STATUS */}

      <Select
        label="Status"
        value={status}
        onChange={(e) =>
          setStatus(
            e.target.value as
              | 'draft'
              | 'published'
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

      {/* DATA PENDUKUNG */}

      <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Data Pendukung
            </h3>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Masukkan jumlah individu berdasarkan daerah dan tahun.
            </p>
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={addSupportingData}
          >
            + Tambah Data
          </Button>
        </div>

        {supportingData.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
            Belum ada Data Pendukung.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-2 py-3 text-center">
                    No
                  </th>

                  <th className="px-2 py-3 text-left">
                    Nama Daerah
                  </th>

                  <th className="px-2 py-3 text-center">
                    2022
                  </th>

                  <th className="px-2 py-3 text-center">
                    2023
                  </th>

                  <th className="px-2 py-3 text-center">
                    2024
                  </th>

                  <th className="px-2 py-3 text-center">
                    2025
                  </th>

                  <th className="px-2 py-3 text-center">
                    2026
                  </th>

                  <th className="px-2 py-3 text-center">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {supportingData.map(
                  (item, index) => (
                    <tr
                      key={
                        item.id ??
                        `new-${index}`
                      }
                      className="border-b border-gray-100 dark:border-gray-800"
                    >
                      <td className="px-2 py-2 text-center">
                        {index + 1}
                      </td>

                      <td className="px-2 py-2">
                        <input
                          type="text"
                          value={
                            item.namaDaerah
                          }
                          onChange={(e) =>
                            updateSupportingData(
                              index,
                              'namaDaerah',
                              e.target.value
                            )
                          }
                          placeholder="Nama daerah"
                          className="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
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
                          className="px-2 py-2"
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
                            className="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                          />
                        </td>
                      ))}

                      <td className="px-2 py-2 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            removeSupportingData(
                              index
                            )
                          }
                          className="text-sm font-medium text-red-600 hover:text-red-700"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

     {/* FOTO UTAMA */}

<div className="rounded-xl border-2 border-blue-500 p-4">
  <h3 className="mb-2 text-lg font-bold text-gray-900">
    Foto Utama
  </h3>

  <p className="mb-3 text-sm text-gray-600">
    Pilih foto utama untuk program konservasi.
  </p>

  <input
    type="file"
    accept="image/*"
    onChange={handlePhotoChange}
    className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-white p-3 text-sm"
  />

  {photoPreview && (
    <div className="mt-4">
      <p className="mb-2 text-sm font-medium">
        Preview:
      </p>

      <img
        src={photoPreview}
        alt="Preview"
        className="h-64 w-full rounded-lg object-cover"
      />
    </div>
  )}
</div>

      {/* ERROR */}

      {error && (
        <p className="text-sm text-danger">
          {error}
        </p>
      )}

      {/* BUTTON */}

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