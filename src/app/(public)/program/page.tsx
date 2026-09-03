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
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-8 text-primary dark:text-primary-light">Program Konservasi</h1>
      {error && <p className="text-sm text-danger mb-6">{error}</p>}
      <div className="grid md:grid-cols-2 gap-6">
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        {!loading && programs.map((p) => (
          <Link
            key={p.id}
            href={`/program/${p.id}`}
            className="block rounded-xl border border-gray-200 dark:border-gray-800 p-5 transition-all duration-200 ease-out hover:border-primary hover:shadow-lg hover:-translate-y-1 active:scale-[0.98]"
          >
            <h2 className="font-medium mb-2">{p.nama}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-3">{p.deskripsi}</p>
            <p className="text-sm font-medium text-primary dark:text-primary-light">
              Rp {p.anggaran.toLocaleString('id-ID')}
            </p>
          </Link>
        ))}
        {!loading && programs.length === 0 && <p className="text-gray-400 text-sm">Belum ada program yang dipublikasikan.</p>}
      </div>
    </div>
  );
}
