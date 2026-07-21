'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/providers/ToastProvider';

interface Category {
  id: string;
  namaKategori: string;
}

// Catatan implementasi: pada versi awal ini, foto disimpan sebagai URL
// (bukan multipart file upload) untuk menyederhanakan scope Sprint 4.
// Penambahan upload file fisik ke storage dapat dilakukan di pengembangan lanjutan
// tanpa mengubah skema data (`file_url` tetap kompatibel).
export function GalleryUploadForm({ onSuccess }: { onSuccess?: () => void }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [judul, setJudul] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  function loadCategories() {
    fetch('/api/gallery-categories')
      .then((r) => r.json())
      .then((r) => setCategories(r.data ?? []))
      .catch(() => setError('Gagal memuat daftar kategori. Muat ulang halaman untuk mencoba lagi.'));
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function addCategory() {
    if (!newCategory.trim()) return;
    try {
      const res = await fetch('/api/gallery-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ namaKategori: newCategory }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal menambah kategori.');
      toast.success(`Kategori "${newCategory}" berhasil ditambahkan.`);
      setNewCategory('');
      loadCategories();
      setCategoryId(json.data.id);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal menambah kategori.';
      setError(message);
      toast.error(message);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!judul || !fileUrl || !categoryId) {
      setError('Semua field wajib diisi.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ judul, fileUrl, categoryId }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        const message = json.message ?? 'Gagal mengunggah foto.';
        setError(message);
        toast.error(message);
        return;
      }
      toast.success(`Foto "${judul}" berhasil diunggah.`);
      setJudul('');
      setFileUrl('');
      onSuccess?.();
    } catch {
      const message = 'Terjadi kesalahan jaringan. Silakan coba lagi.';
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input label="Judul Foto" value={judul} onChange={(e) => setJudul(e.target.value)} required />
      <Input
        label="URL Foto"
        placeholder="https://..."
        value={fileUrl}
        onChange={(e) => setFileUrl(e.target.value)}
        required
      />
      <Select label="Kategori" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
        <option value="">Pilih kategori</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.namaKategori}
          </option>
        ))}
      </Select>

      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
          placeholder="Tambah kategori baru"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <Button type="button" variant="secondary" onClick={addCategory}>
          Tambah
        </Button>
      </div>

      {error && <p className="text-sm text-danger mb-4">{error}</p>}
      <Button type="submit" disabled={submitting}>
        {submitting ? 'Mengunggah...' : 'Simpan Foto'}
      </Button>
    </form>
  );
}
