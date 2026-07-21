'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { GalleryUploadForm } from '@/components/forms/GalleryUploadForm';
import { useToast } from '@/components/providers/ToastProvider';

interface GalleryItem {
  id: string;
  judul: string;
  fileUrl: string;
  category: { namaKategori: string };
}

export default function GaleriManagementPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  function load() {
    setLoading(true);
    fetch('/api/gallery')
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal memuat galeri.');
        return json;
      })
      .then((json) => {
        setError('');
        setItems(json.data ?? []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Gagal memuat galeri.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: string, judulFoto: string) {
    if (!confirm(`Hapus foto "${judulFoto}"?`)) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal menghapus foto.');
      toast.success(`Foto "${judulFoto}" berhasil dihapus.`);
      load();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal menghapus foto.';
      setError(message);
      toast.error(message);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Kelola Galeri</h1>

      <Card className="max-w-xl">
        <h2 className="text-sm font-medium mb-4">Tambah Foto</h2>
        <GalleryUploadForm onSuccess={load} />
      </Card>

      <Card>
        <h2 className="text-sm font-medium mb-4">Daftar Foto</h2>
        {error && <p className="text-sm text-danger mb-3">{error}</p>}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading &&
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
                <Skeleton className="w-full h-28 rounded-none" />
                <div className="p-2 space-y-2">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          {!loading && items.map((item) => (
            <div key={item.id} className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.fileUrl} alt={item.judul} className="w-full h-28 object-cover" />
              <div className="p-2">
                <p className="text-xs font-medium truncate">{item.judul}</p>
                <p className="text-xs text-gray-400">{item.category.namaKategori}</p>
                <Button variant="danger" className="mt-2 w-full text-xs py-1" onClick={() => remove(item.id, item.judul)}>
                  Hapus
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
