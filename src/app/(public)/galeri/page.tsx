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
    <div className="mx-auto max-w-7xl px-6 py-12">

  {/* Header */}
  <div className="mb-10">
    <p className="text-sm font-semibold tracking-wide text-green-700 dark:text-green-400">
      GALERI
    </p>

    <div className="mt-2 h-1 w-10 rounded-full bg-green-700 dark:bg-green-400"></div>

    <h1 className="mt-4 text-3xl font-bold text-green-800 dark:text-green-400 md:text-4xl">
      Galeri PLTD/G Tello
    </h1>

    <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600 dark:text-gray-300 md:text-base">
      Dokumentasi kegiatan konservasi, lingkungan, dan keanekaragaman
      hayati di kawasan PLTD/G Tello.
    </p>
  </div>

  {/* Pesan Error */}
  {error && (
    <p className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
      {error}
    </p>
  )}

  {/* Grid Galeri */}
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

    {/* Loading */}
    {loading &&
      Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <Skeleton className="h-56 w-full rounded-none" />

          <div className="space-y-3 p-5">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}

    {/* Data Galeri */}
    {!loading &&
      items.map((item) => (
        <div
          key={item.id}
          className="group overflow-hidden rounded-2xl border border-green-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-green-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
        >

          {/* Foto */}
          <div className="relative h-56 overflow-hidden bg-green-50 dark:bg-green-950/30">

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.fileUrl}
              alt={item.judul}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />

            {/* Overlay saat hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

          </div>

          {/* Informasi */}
          <div className="p-5">

            {/* Garis aksen */}
            <div className="mb-3 h-1 w-8 rounded-full bg-green-600"></div>

            <p className="text-base font-semibold text-gray-900 dark:text-white">
              {item.judul}
            </p>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {item.category.namaKategori}
            </p>

          </div>
        </div>
      ))}

    {/* Data Kosong */}
    {!loading && items.length === 0 && (
      <div className="col-span-full rounded-2xl border border-dashed border-gray-300 px-6 py-12 text-center dark:border-gray-700">
        <p className="text-sm text-gray-400">
          Belum ada foto di galeri.
        </p>
      </div>
    )}

  </div>
</div>
  );
}
