'use client';

import { Skeleton } from '@/components/ui/Skeleton';
import { useEffect, useState } from 'react';

interface GalleryItem {
  id: string;
  judul: string;
  fileUrl: string;
  category: { namaKategori: string };
}

export default function GaleriPublicPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    fetch('/api/gallery')
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error('Gagal memuat galeri.');
        return json;
      })
      .then((json) => {
        if (!ignore) setItems(json.data ?? []);
      })
      .catch(() => {
        if (!ignore) setError('Gagal memuat galeri. Silakan muat ulang halaman.');
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-8 text-primary dark:text-primary-light">Galeri PLTD/G Tello</h1>
      {error && <p className="text-sm text-danger mb-6">{error}</p>}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
              <Skeleton className="w-full h-40 rounded-none" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        {!loading && items.map((item) => (
          <div key={item.id} className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.fileUrl} alt={item.judul} className="w-full h-40 object-cover" />
            <div className="p-3">
              <p className="text-sm font-medium">{item.judul}</p>
              <p className="text-xs text-gray-400">{item.category.namaKategori}</p>
            </div>
          </div>
        ))}
        {!loading && items.length === 0 && <p className="text-gray-400 text-sm">Belum ada foto di galeri.</p>}
      </div>
    </div>
  );
}
