'use client';

import { Skeleton } from '@/components/ui/Skeleton';
import { useEffect, useState } from 'react';
import { TrendlineChart } from '@/components/charts/TrendlineChart';
import { BiodiversityIndexChart } from '@/components/charts/BiodiversityIndexChart';

interface RecordItem {
  jumlahIndividu: number;
  species: { jenis: 'flora' | 'fauna' };
  period: { label: string | null; tahun: number };
  index?: { hValue: number };
}

// Halaman publik -- HANYA menampilkan data status "published", karena
// endpoint /api/species-records tanpa parameter status khusus SELALU
// mengembalikan data published (lihat Security Design pada SDD).
export default function StatusFloraFaunaPage() {
  const [trend, setTrend] = useState<{ periode: string; flora: number; fauna: number }[]>([]);
  const [indexData, setIndexData] = useState<{ periode: string; flora: number; fauna: number }[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    fetch('/api/species-records')
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error('Gagal memuat data status flora & fauna.');
        return json;
      })
      .then((r) => {
        if (ignore) return;
        const records: RecordItem[] = r.data ?? [];
        const trendMap = new Map<string, { periode: string; flora: number; fauna: number }>();
        const idxMap = new Map<string, { periode: string; flora: number; fauna: number }>();

        for (const rec of records) {
          const label = rec.period.label ?? String(rec.period.tahun);
          if (!trendMap.has(label)) trendMap.set(label, { periode: label, flora: 0, fauna: 0 });
          if (!idxMap.has(label)) idxMap.set(label, { periode: label, flora: 0, fauna: 0 });

          const t = trendMap.get(label)!;
          const i = idxMap.get(label)!;
          if (rec.species.jenis === 'flora') {
            t.flora += rec.jumlahIndividu;
            i.flora += rec.index?.hValue ?? 0;
          } else {
            t.fauna += rec.jumlahIndividu;
            i.fauna += rec.index?.hValue ?? 0;
          }
        }

        setTrend(Array.from(trendMap.values()));
        setIndexData(Array.from(idxMap.values()));
      })
      .catch(() => {
        if (!ignore) setError('Gagal memuat data status flora & fauna. Silakan muat ulang halaman.');
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
      <h1 className="text-2xl font-semibold mb-2 text-primary dark:text-primary-light">Data Status</h1>
      <p className="text-sm text-gray-600 dark:text-gray-300 max-w-3xl mb-8">
         PT PLN Indonesia Power Unit Pembangkitan PLTD/G Tello melakukan monitoring flora dan fauna yang berada di area PLTD/G Tello setiap 6 bulan sekali.
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-300 max-w-3xl mb-6">
        Monitoring rutin ini dilakukan untuk mengetahui pertumbuhan flora dan fauna yang berada di area PLTD/G Tello. Berdasarkan hasil pemantauan rutin, jumlah flora dan fauna yang berada di area PLTD/G Tello mengalami peningkatan setiap tahunnya.
      </p>

      {error && <p className="text-sm text-danger mb-6">{error}</p>}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <h2 className="text-sm font-medium mb-4">Trendline Status Flora dan Fauna</h2>
          {loading ? <Skeleton className="h-[280px] w-full" /> : <TrendlineChart data={trend} />}
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <h2 className="text-sm font-medium mb-4">Indeks Keanekaragaman Hayati</h2>
          {loading ? <Skeleton className="h-[280px] w-full" /> : <BiodiversityIndexChart data={indexData} />}
        </div>
      </div>
    </div>
  );
}
