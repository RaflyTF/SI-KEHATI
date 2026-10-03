// 'use client';

// import { useEffect, useState } from 'react';
// import { Card } from '@/components/ui/Card';
// import { Skeleton } from '@/components/ui/Skeleton';
// import { TrendlineChart } from '@/components/charts/TrendlineChart';
// import { BiodiversityIndexChart } from '@/components/charts/BiodiversityIndexChart';

// interface Summary {
//   totalSpecies: number;
//   totalPrograms: number;
//   totalPublishedRecords: number;
//   pendingCount: number;
//   trendline: { periode: string; flora: number; fauna: number }[];
//   biodiversityIndex: { periode: string; flora: number; fauna: number }[];
// }

// export default function DashboardPage() {
//   const [summary, setSummary] = useState<Summary | null>(null);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     let ignore = false;

//     fetch('/api/dashboard/summary')
//       .then(async (res) => {
//         const json = await res.json();
//         if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal memuat ringkasan dashboard.');
//         return json;
//       })
//       .then((json) => {
//         if (!ignore) setSummary(json.data);
//       })
//       .catch((err) => {
//         if (!ignore) setError(err instanceof Error ? err.message : 'Gagal memuat ringkasan dashboard.');
//       });

//     return () => {
//       ignore = true;
//     };
//   }, []);

//   // Loading = belum ada data DAN belum ada error. Kalau fetch gagal (error terisi),
//   // skeleton harus berhenti juga -- tidak boleh berdenyut selamanya seolah masih loading.
//   const isLoading = !summary && !error;

//   return (
//     <div className="space-y-6">
//       <h1 className="text-xl font-semibold">Dashboard Ringkasan</h1>
//       {error && <p className="text-sm text-danger">{error}</p>}

//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <Card>
//           <p className="text-xs text-gray-500 dark:text-gray-400">Total Spesies</p>
//           {isLoading ? (
//             <Skeleton className="h-8 w-12 mt-1" />
//           ) : (
//             <p className="text-2xl font-semibold">{summary?.totalSpecies ?? '—'}</p>
//           )}
//         </Card>
//         <Card>
//           <p className="text-xs text-gray-500 dark:text-gray-400">Program Aktif</p>
//           {isLoading ? (
//             <Skeleton className="h-8 w-12 mt-1" />
//           ) : (
//             <p className="text-2xl font-semibold">{summary?.totalPrograms ?? '—'}</p>
//           )}
//         </Card>
//         <Card>
//           <p className="text-xs text-gray-500 dark:text-gray-400">Data Terpublikasi</p>
//           {isLoading ? (
//             <Skeleton className="h-8 w-12 mt-1" />
//           ) : (
//             <p className="text-2xl font-semibold">{summary?.totalPublishedRecords ?? '—'}</p>
//           )}
//         </Card>
//         <Card>
//           <p className="text-xs text-gray-500 dark:text-gray-400">Menunggu Verifikasi</p>
//           {isLoading ? (
//             <Skeleton className="h-8 w-12 mt-1" />
//           ) : (
//             <p className="text-2xl font-semibold text-warning">{summary?.pendingCount ?? '—'}</p>
//           )}
//         </Card>
//       </div>

//       <Card>
//         <h2 className="text-sm font-medium mb-4">Trendline Status Flora & Fauna</h2>
//         {isLoading ? (
//           <Skeleton className="h-[280px] w-full" />
//         ) : (
//           summary && <TrendlineChart data={summary.trendline} />
//         )}
//       </Card>

//       <Card>
//         <h2 className="text-sm font-medium mb-4">Indeks Keanekaragaman (Shannon-Wiener)</h2>
//         {isLoading ? (
//           <Skeleton className="h-[280px] w-full" />
//         ) : (
//           summary && <BiodiversityIndexChart data={summary.biodiversityIndex} />
//         )}
//       </Card>
//     </div>
//   );
// }


// Kode Baru

'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { TrendlineChart } from '@/components/charts/TrendlineChart';
import { BiodiversityIndexChart } from '@/components/charts/BiodiversityIndexChart';

interface Summary {
  totalSpecies: number;
  totalPrograms: number;
  totalPublishedRecords: number;
  pendingCount: number;
  trendline: { periode: string; flora: number; fauna: number }[];
  biodiversityIndex: { periode: string; flora: number; fauna: number }[];
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    fetch('/api/dashboard/summary')
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal memuat ringkasan dashboard.');
        return json;
      })
      .then((json) => {
        if (!ignore) setSummary(json.data);
      })
      .catch((err) => {
        if (!ignore) setError(err instanceof Error ? err.message : 'Gagal memuat ringkasan dashboard.');
      });

    return () => {
      ignore = true;
    };
  }, []);

  const isLoading = !summary && !error;

  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-lg md:text-xl font-semibold">Dashboard Ringkasan</h1>
      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card padding="p-4 md:p-5">
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Spesies</p>
          {isLoading ? (
            <Skeleton className="h-8 w-12 mt-1" />
          ) : (
            <p className="text-xl md:text-2xl font-semibold">{summary?.totalSpecies ?? '—'}</p>
          )}
        </Card>
        <Card padding="p-4 md:p-5">
          <p className="text-xs text-gray-500 dark:text-gray-400">Program Aktif</p>
          {isLoading ? (
            <Skeleton className="h-8 w-12 mt-1" />
          ) : (
            <p className="text-xl md:text-2xl font-semibold">{summary?.totalPrograms ?? '—'}</p>
          )}
        </Card>
        <Card padding="p-4 md:p-5">
          <p className="text-xs text-gray-500 dark:text-gray-400">Data Terpublikasi</p>
          {isLoading ? (
            <Skeleton className="h-8 w-12 mt-1" />
          ) : (
            <p className="text-xl md:text-2xl font-semibold">{summary?.totalPublishedRecords ?? '—'}</p>
          )}
        </Card>
        <Card padding="p-4 md:p-5">
          <p className="text-xs text-gray-500 dark:text-gray-400">Menunggu Verifikasi</p>
          {isLoading ? (
            <Skeleton className="h-8 w-12 mt-1" />
          ) : (
            <p className="text-xl md:text-2xl font-semibold text-warning">{summary?.pendingCount ?? '—'}</p>
          )}
        </Card>
      </div>

      <Card padding="p-4 md:p-5">
        <h2 className="text-sm font-medium mb-4">Trendline Status Flora & Fauna</h2>
        {isLoading ? (
          <Skeleton className="h-[280px] w-full" />
        ) : (
          summary && <TrendlineChart data={summary.trendline} />
        )}
      </Card>

      <Card padding="p-4 md:p-5">
        <h2 className="text-sm font-medium mb-4">Indeks Keanekaragaman (Shannon-Wiener)</h2>
        {isLoading ? (
          <Skeleton className="h-[280px] w-full" />
        ) : (
          summary && <BiodiversityIndexChart data={summary.biodiversityIndex} />
        )}
      </Card>
    </div>
  );
}