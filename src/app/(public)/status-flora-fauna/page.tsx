'use client';

import { Skeleton } from '@/components/ui/Skeleton';
import { useEffect, useState, useMemo } from 'react';
import { TrendlineChart } from '@/components/charts/TrendlineChart';
import { BiodiversityIndexChart } from '@/components/charts/BiodiversityIndexChart';
import { ConservationBadge } from '@/components/ui/ConservationBadge';

interface RecordItem {
  jumlahIndividu: number;
  species: {
    jenis: 'flora' | 'fauna';
  };
  period: {
    label: string | null;
    tahun: number;
  };
  index?: {
    hValue: number;
  } | null;
}

interface ChartItem {
  periode: string;
  flora: number;
  fauna: number;
}

interface SpeciesItem {
  id: string;
  namaLokal: string;
  namaIlmiah: string;
  namaInggris?: string | null;
  jenis: 'flora' | 'fauna';
  kelas?: string | null;
  famili?: string | null;
  statusIucn: string;
  statusPerlindungan: string;
  statusKeberadaan: string;
  habitat?: string | null;
  deskripsi?: string | null;
  fotoUrl?: string | null;
}

export default function StatusFloraFaunaPage() {
  const [trend, setTrend] = useState<ChartItem[]>([]);
  const [indexData, setIndexData] = useState<ChartItem[]>([]);
  const [speciesList, setSpeciesList] = useState<SpeciesItem[]>([]);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'fauna' | 'flora' | 'dilindungi'>('all');

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        const [recordsRes, speciesRes] = await Promise.all([
          fetch('/api/species-records').then((res) => res.json()),
          fetch('/api/species').then((res) => res.json()),
        ]);

        if (!recordsRes.ok && !recordsRes.success) {
          throw new Error('Gagal memuat data monitoring.');
        }

        if (ignore) return;

        // Penanganan tahun pemantauan 2022-2026
        const records: RecordItem[] = (recordsRes.data ?? [])
          .filter(
            (rec: RecordItem) =>
              rec.period.tahun >= 2022 && rec.period.tahun <= 2026
          )
          .sort(
            (a: RecordItem, b: RecordItem) =>
              a.period.tahun - b.period.tahun
          );

        const trendMap = new Map<number, ChartItem>();
        const indexMap = new Map<number, ChartItem>();

        for (let tahun = 2022; tahun <= 2026; tahun++) {
          trendMap.set(tahun, {
            periode: String(tahun),
            flora: 0,
            fauna: 0,
          });

          indexMap.set(tahun, {
            periode: String(tahun),
            flora: 0,
            fauna: 0,
          });
        }

        for (const rec of records) {
          const tahun = rec.period.tahun;
          const trendItem = trendMap.get(tahun);
          const indexItem = indexMap.get(tahun);

          if (!trendItem || !indexItem) continue;

          if (rec.species.jenis === 'flora') {
            trendItem.flora += rec.jumlahIndividu;
            indexItem.flora += rec.index?.hValue ?? 0;
          }

          if (rec.species.jenis === 'fauna') {
            trendItem.fauna += rec.jumlahIndividu;
            indexItem.fauna += rec.index?.hValue ?? 0;
          }
        }

        setTrend(Array.from(trendMap.values()));
        setIndexData(Array.from(indexMap.values()));

        if (speciesRes.success) {
          setSpeciesList(speciesRes.data ?? []);
        }
      } catch (err) {
        console.error(err);
        if (!ignore) {
          setError('Gagal memuat data monitoring flora & fauna.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, []);

  const filteredSpecies = useMemo(() => {
    return speciesList.filter((item) => {
      if (activeTab === 'fauna' && item.jenis !== 'fauna') return false;
      if (activeTab === 'flora' && item.jenis !== 'flora') return false;
      if (activeTab === 'dilindungi' && item.statusPerlindungan !== 'DILINDUNGI') return false;

      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchLokal = item.namaLokal.toLowerCase().includes(query);
        const matchIlmiah = item.namaIlmiah.toLowerCase().includes(query);
        const matchFamili = item.famili?.toLowerCase().includes(query);
        return matchLokal || matchIlmiah || matchFamili;
      }

      return true;
    });
  }, [speciesList, activeTab, searchTerm]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      {/* Header Halaman */}
      <div className="mb-10 max-w-3xl">
        <p className="text-xs font-semibold tracking-wider text-emerald-700 uppercase dark:text-emerald-400">
          Pemantauan Biodiversitas
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
          Status Flora dan Fauna
        </h1>
        <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          Program monitoring berkala setiap enam bulan di area PLTD/G Tello untuk mengamati
          kondisi populasi, tingkat keanekaragaman jenis, serta upaya konservasi spesies lokal.
        </p>
      </div>

      {error && (
        <div className="mb-8 rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Bagian Grafik Tren & Indeks */}
      <section className="mb-16 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
            Tren Populasi Individu
          </h2>
          <p className="mb-4 text-xs text-zinc-500 dark:text-zinc-400">
            Perkembangan cacah individu teramati per periode (2022–2026)
          </p>
          {loading ? <Skeleton className="h-64 w-full" /> : <TrendlineChart data={trend} />}
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
            Indeks Keanekaragaman Shannon-Wiener
          </h2>
          <p className="mb-4 text-xs text-zinc-500 dark:text-zinc-400">
            Tingkat kestabilan dan kemerataan ekosistem lokal
          </p>
          {loading ? <Skeleton className="h-64 w-full" /> : <BiodiversityIndexChart data={indexData} />}
        </div>
      </section>

      {/* Katalog Spesies Edukatif */}
      <section className="border-t border-zinc-200 pt-12 dark:border-zinc-800">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Katalog Spesies Terdata
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Dokumentasi taksonomi dan status konservasi satwa serta tumbuhan kawasan.
            </p>
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Cari nama spesies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition focus:border-zinc-900 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500 dark:focus:border-white"
            />
          </div>
        </div>

        {/* Tab Filter */}
        <div className="mb-8 flex flex-wrap gap-2 border-b border-zinc-100 pb-4 dark:border-zinc-800">
          {[
            { id: 'all', label: 'Semua Spesies' },
            { id: 'fauna', label: 'Fauna' },
            { id: 'flora', label: 'Flora' },
            { id: 'dilindungi', label: 'Dilindungi UU' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'all' | 'fauna' | 'flora' | 'dilindungi')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition ${
                activeTab === tab.id
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid Kartu Spesies */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <Skeleton key={n} className="h-80 w-full rounded-xl" />
            ))}
          </div>
        ) : filteredSpecies.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-200 p-12 text-center dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Tidak ada spesies yang sesuai dengan kriteria.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSpecies.map((item) => (
              <article
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
              >
                <div className="relative aspect-16/10 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  {item.fotoUrl ? (
                    <img
                      src={item.fotoUrl}
                      alt={item.namaLokal}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-102"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-zinc-400">
                      Foto belum tersedia
                    </div>
                  )}

                  <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-medium tracking-wide text-white uppercase backdrop-blur-xs">
                    {item.jenis}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div>
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                      {item.namaLokal}
                    </h3>
                    <p className="text-xs italic text-zinc-500 dark:text-zinc-400">
                      {item.namaIlmiah}
                    </p>
                  </div>

                  <div className="mt-3">
                    <ConservationBadge
                      iucn={item.statusIucn}
                      perlindungan={item.statusPerlindungan}
                    />
                  </div>

                  {/* Taksonomi Ringkas */}
                  <div className="mt-3 grid grid-cols-2 gap-2 rounded-md bg-zinc-50 p-2 text-[11px] text-zinc-500 dark:bg-zinc-800/50 dark:text-zinc-400">
                    <div>
                      <span className="text-zinc-400 dark:text-zinc-500">Kelas:</span>{' '}
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">{item.kelas ?? '-'}</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 dark:text-zinc-500">Famili:</span>{' '}
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">{item.famili ?? '-'}</span>
                    </div>
                  </div>

                  {item.deskripsi && (
                    <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {item.deskripsi}
                    </p>
                  )}

                  {item.habitat && (
                    <div className="mt-auto border-t border-zinc-100 pt-3 text-[11px] text-zinc-500 dark:border-zinc-800/80">
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">Habitat:</span>{' '}
                      {item.habitat}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}