'use client';

import { ComponentProps, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { VerificationQueueTable } from '@/components/features/VerificationQueueTable';

type RecordRow = ComponentProps<typeof VerificationQueueTable>['data'][number];

export default function VerifikasiPage() {
  const { data: session, status: authStatus } = useSession();
  const role = (session?.user as { role?: string } | undefined)?.role ?? '';

  const [data, setData] = useState<RecordRow[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    fetch('/api/species-records?status=pending')
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.message ?? 'Gagal memuat data verifikasi.');
        }
        return json;
      })
      .then((json) => {
        setError('');
        setData(json.data ?? []);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Gagal memuat data verifikasi.');
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (authStatus === 'authenticated') {
      load();
    }
  }, [authStatus]);

  if (authStatus === 'loading') {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Card padding="p-6">
          <Skeleton className="h-24 w-full" />
        </Card>
      </div>
    );
  }

  // RBAC Guard: Petugas lapangan dilarang mengakses menu verifikasi
  if (role === 'petugas_lapangan') {
    return (
      <div className="space-y-4">
        <h1 className="text-lg md:text-xl font-semibold">Verifikasi Data Monitoring</h1>
        <Card padding="p-6">
          <div className="text-center py-6">
            <p className="text-base font-semibold text-red-600 dark:text-red-400">
              Akses Ditolak
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Halaman verifikasi dan persetujuan data hanya dapat diakses oleh Admin dan Super Admin.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg md:text-xl font-semibold">Verifikasi Data Monitoring</h1>
        {!loading && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
            {data.length} Menunggu Persetujuan
          </span>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <Card padding="p-4 md:p-5">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <VerificationQueueTable data={data} onChanged={load} />
        )}
      </Card>
    </div>
  );
}