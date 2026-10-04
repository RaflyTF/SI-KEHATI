'use client';

import {Skeleton} from '@/components/ui/Skeleton';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ProgramItem {
  id: string;
  nama: string;
  deskripsi: string;
  anggaran: number;
}

export default function ProgramListPage() {
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    fetch('/api/programs')
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error('Gagal memuat daftar program.');
        return json;
      })
      .then((json) => {
        if (!ignore) setPrograms(json.data ?? []);
      })
      .catch(() => {
        if (!ignore) setError('Gagal memuat daftar program. Silakan muat ulang halaman.');
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
    <p className="text-2xl text-primary dark:text-primary-light">
      PROGRAM
    </p>

    <div className="mt-2 h-1 w-10 rounded-full bg-primary"></div>

    <h1 className="mt-4 text-3xl font-bold text-primary dark:text-primary-light">
      Program Konservasi
    </h1>

    <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600 dark:text-gray-300">
      Berbagai program konservasi dan pemberdayaan yang dilakukan untuk
      menjaga keanekaragaman hayati serta mendukung keberlanjutan lingkungan
      di sekitar wilayah operasional.
    </p>
  </div>

  {/* Pesan Error */}
  {error && (
    <p className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-danger dark:bg-red-950/30">
      {error}
    </p>
  )}

  {/* Daftar Program */}
  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

    {/* Loading Skeleton */}
    {loading &&
      Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="mb-5 flex items-center justify-between">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-2 w-2 rounded-full" />
          </div>

          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-5/6" />
          <Skeleton className="mt-2 h-4 w-2/3" />

          <div className="mt-5 border-t border-gray-100 pt-4 dark:border-gray-800">
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      ))}

    {/* Data Program */}
    {!loading &&
      programs.map((p, index) => (
        <Link
          key={p.id}
          href={`/program/${p.id}`}
          className="group block rounded-2xl border border-green-100 bg-white p-6 shadow-sm transition duration-200 ease-out hover:-translate-y-1 hover:border-primary hover:shadow-md active:scale-[0.98] dark:border-gray-800 dark:bg-gray-900"
        >
          {/* Nomor Program */}
          <div className="mb-5 flex items-center justify-between">
            <span className="text-sm font-semibold text-primary dark:text-primary-light">
              {String(index + 1).padStart(2, "0")}
            </span>

            <span className="h-2 w-2 rounded-full bg-primary transition group-hover:scale-125"></span>
          </div>

          {/* Nama Program */}
          <h2 className="text-lg font-semibold leading-7 text-gray-900 dark:text-white">
            {p.nama}
          </h2>

          {/* Deskripsi */}
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
            {p.deskripsi}
          </p>

          {/* Anggaran */}
          <div className="mt-5 border-t border-gray-100 pt-4 dark:border-gray-800">
            <p className="text-sm font-semibold text-primary dark:text-primary-light">
              Rp {p.anggaran.toLocaleString("id-ID")}
            </p>
          </div>
        </Link>
      ))}

    {/* Jika Data Kosong */}
    {!loading && programs.length === 0 && (
      <p className="col-span-full text-sm text-gray-400">
        Belum ada program yang dipublikasikan.
      </p>
    )}

  </div>
</div>
  );
}
