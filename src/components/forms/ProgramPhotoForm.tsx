'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';

interface ProgramPhotoFormProps {
  programId: string;
  initialPhoto?: {
    id: string;
    fileUrl: string;
    caption: string | null;
  } | null;
  onSaved?: () => void;
}

export function ProgramPhotoForm({
  programId,
  initialPhoto = null,
  onSaved,
}: ProgramPhotoFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [previewUrl, setPreviewUrl] = useState(
    initialPhoto?.fileUrl ?? ''
  );

  const [caption, setCaption] = useState(
    initialPhoto?.caption ?? ''
  );

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!selectedFile) return;

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setError('');
    setMessage('');

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

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setError('Ukuran foto maksimal 5 MB.');
      return;
    }

    setSelectedFile(file);
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError('');
    setMessage('');

    if (!selectedFile && !initialPhoto) {
      setError('Silakan pilih foto utama terlebih dahulu.');
      return;
    }

    setSaving(true);

    try {
      let fileUrl = initialPhoto?.fileUrl ?? '';

      // Upload foto
      if (selectedFile) {
        const uploadData = new FormData();

        uploadData.append('file', selectedFile);

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

      // Simpan foto ke ProgramPhoto
      const response = await fetch(
        `/api/programs/${programId}/photos`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileUrl,
            caption: caption.trim() || null,
          }),
        }
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(
          json?.message ||
            'Gagal menyimpan foto utama.'
        );
      }

      setMessage('Foto utama berhasil disimpan.');

      setSelectedFile(null);

      if (json?.data?.fileUrl) {
        setPreviewUrl(json.data.fileUrl);
      }

      onSaved?.();

    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : 'Gagal menyimpan foto utama.'
      );

    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* Judul */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Foto Utama Program
        </h3>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Upload satu foto utama yang akan ditampilkan
          pada halaman detail program.
        </p>
      </div>

      {/* Pesan error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Pesan berhasil */}
      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400">
          {message}
        </div>
      )}

      {/* Preview */}
      {previewUrl && (
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
          <img
            src={previewUrl}
            alt="Preview foto utama"
            className="h-64 w-full object-cover"
          />
        </div>
      )}

      {/* Upload foto */}
      <div>
        <label
          htmlFor="program-main-photo"
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Pilih Foto
        </label>

        <input
          id="program-main-photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="block w-full rounded-lg border border-gray-300 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        />

        <p className="mt-1 text-xs text-gray-500">
          JPG, PNG, atau WEBP. Maksimal 5 MB.
        </p>
      </div>

      {/* Caption */}
      <div>
        <label
          htmlFor="program-photo-caption"
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Keterangan Foto
        </label>

        <input
          id="program-photo-caption"
          type="text"
          value={caption}
          onChange={(event) =>
            setCaption(event.target.value)
          }
          maxLength={150}
          placeholder="Contoh: Dokumentasi kegiatan konservasi"
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-green-600 dark:border-gray-700 dark:bg-gray-900"
        />

        <p className="mt-1 text-xs text-gray-500">
          Maksimal 150 karakter.
        </p>
      </div>

      {/* Tombol */}
      <Button
        type="submit"
        disabled={saving}
      >
        {saving
          ? 'Menyimpan...'
          : 'Simpan Foto Utama'}
      </Button>
    </form>
  );
}