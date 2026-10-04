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
import {
  Leaf,
  Sprout,
  FileCheck,
  ShieldCheck,
} from 'lucide-react';

import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { TrendlineChart } from '@/components/charts/TrendlineChart';
import { BiodiversityIndexChart } from '@/components/charts/BiodiversityIndexChart';

interface Summary {
  totalSpecies: number;
  totalPrograms: number;
  totalPublishedRecords: number;
  pendingCount: number;
  trendline: {
    periode: string;
    flora: number;
    fauna: number;
  }[];
  biodiversityIndex: {
    periode: string;
    flora: number;
    fauna: number;
  }[];
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    fetch('/api/dashboard/summary')
      .then(async (res) => {
        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error(
            json.message ?? 'Gagal memuat ringkasan dashboard.'
          );
        }

        return json;
      })
      .then((json) => {
        if (!ignore) {
          setSummary(json.data);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(
            err instanceof Error
              ? err.message
              : 'Gagal memuat ringkasan dashboard.'
          );
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const isLoading = !summary && !error;

  return (
    <div className="space-y-6">

      {/* HEADER DASHBOARD */}
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
          Dashboard Ringkasan
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Ringkasan data keanekaragaman hayati dan program konservasi.
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* STATISTIK */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* TOTAL SPESIES */}
        <Card
          padding="p-5"
          className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="flex items-center gap-4">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <Leaf size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Spesies
              </p>

              {isLoading ? (
                <Skeleton className="mt-2 h-8 w-14" />
              ) : (
                <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                  {summary?.totalSpecies ?? '—'}
                </p>
              )}

              <p className="mt-1 text-xs text-gray-400">
                Spesies tercatat
              </p>
            </div>

          </div>
        </Card>

        {/* PROGRAM AKTIF */}
        <Card
          padding="p-5"
          className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="flex items-center gap-4">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <Sprout size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Program Aktif
              </p>

              {isLoading ? (
                <Skeleton className="mt-2 h-8 w-14" />
              ) : (
                <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                  {summary?.totalPrograms ?? '—'}
                </p>
              )}

              <p className="mt-1 text-xs text-gray-400">
                Program berjalan
              </p>
            </div>

          </div>
        </Card>

        {/* DATA TERPUBLIKASI */}
        <Card
          padding="p-5"
          className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="flex items-center gap-4">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <FileCheck size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Data Terpublikasi
              </p>

              {isLoading ? (
                <Skeleton className="mt-2 h-8 w-14" />
              ) : (
                <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                  {summary?.totalPublishedRecords ?? '—'}
                </p>
              )}

              <p className="mt-1 text-xs text-gray-400">
                Data telah dipublikasikan
              </p>
            </div>

          </div>
        </Card>

        {/* MENUNGGU VERIFIKASI */}
        <Card
          padding="p-5"
          className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="flex items-center gap-4">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
              <ShieldCheck size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Menunggu Verifikasi
              </p>

              {isLoading ? (
                <Skeleton className="mt-2 h-8 w-14" />
              ) : (
                <p className="mt-1 text-2xl font-semibold text-orange-600">
                  {summary?.pendingCount ?? '—'}
                </p>
              )}

              <p className="mt-1 text-xs text-gray-400">
                Data perlu verifikasi
              </p>
            </div>

          </div>
        </Card>

      </div>

      {/* TRENDLINE */}
      <Card
        padding="p-5"
        className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="mb-5">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Trendline Status Flora & Fauna
          </h2>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Perkembangan jumlah flora dan fauna berdasarkan periode.
          </p>
        </div>

        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          summary && (
            <div className="h-[300px]">
              <TrendlineChart data={summary.trendline} />
            </div>
          )
        )}
      </Card>

      {/* INDEKS KEANEKARAGAMAN */}
      <Card
        padding="p-5"
        className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="mb-5">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Indeks Keanekaragaman (Shannon-Wiener)
          </h2>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Perubahan indeks keanekaragaman flora dan fauna berdasarkan periode.
          </p>
        </div>

        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          summary && (
            <div className="h-[300px]">
              <BiodiversityIndexChart
                data={summary.biodiversityIndex}
              />
            </div>
          )
        )}
      </Card>

    </div>
  );
}