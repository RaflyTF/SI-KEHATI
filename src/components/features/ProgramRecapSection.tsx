'use client';

import { ProgramIndexChart } from '@/components/charts/ProgramIndexChart';
import { EmptyState } from '@/components/ui/EmptyState';

interface BiodiversityPeriod {
  id: string;
  tahun: number;
  label: string | null;
}

interface BiodiversitySpeciesRow {
  speciesId: string;
  namaLokal: string;
  namaIlmiah: string;
  jenis: string;
  byPeriod: Record<
    string,
    { dataId: string; jumlahIndividu: number; pi: number; lnPi: number; hValue: number } | undefined
  >;
}

interface BiodiversityData {
  periods: BiodiversityPeriod[];
  species: BiodiversitySpeciesRow[];
  totals: Record<string, { totalIndividu: number; totalH: number }>;
}

function formatAngka(value: number) {
  return value.toLocaleString('id-ID', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

export function ProgramRecapSection({ biodiversity }: { biodiversity: BiodiversityData | null }) {
  if (!biodiversity || biodiversity.species.length === 0) {
    return (
      <EmptyState
        title="Belum ada data untuk direkap"
        description="Rekapitulasi indeks akan tampil setelah Data Pendukung diisi."
      />
    );
  }

  const chartData = biodiversity.periods.map((p) => ({
    periode: p.label ?? String(p.tahun),
    totalH: biodiversity.totals[p.id]?.totalH ?? 0,
  }));

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <th className="py-2 px-3">No</th>
              <th className="py-2 px-3">Nama Daerah</th>
              <th className="py-2 px-3 italic">Nama Ilmiah</th>
              {biodiversity.periods.map((p) => (
                <th key={p.id} className="py-2 px-3 text-right">
                  {p.label ?? p.tahun}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {biodiversity.species.map((s, i) => (
              <tr key={s.speciesId} className="border-b border-gray-100 dark:border-gray-900">
                <td className="py-2 px-3">{i + 1}</td>
                <td className="py-2 px-3">{s.namaLokal}</td>
                <td className="py-2 px-3 italic text-gray-500 dark:text-gray-400">{s.namaIlmiah}</td>
                {biodiversity.periods.map((p) => (
                  <td key={p.id} className="py-2 px-3 text-right font-mono">
                    {formatAngka(s.byPeriod[p.id]?.hValue ?? 0)}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="font-semibold bg-gray-50 dark:bg-gray-900">
              <td className="py-2 px-3" colSpan={3}>
                Total H&apos;
              </td>
              {biodiversity.periods.map((p) => (
                <td key={p.id} className="py-2 px-3 text-right font-mono">
                  {formatAngka(biodiversity.totals[p.id]?.totalH ?? 0)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 md:p-5">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Grafik Perkembangan Total H&apos;</p>
        <ProgramIndexChart data={chartData} />
      </div>
    </div>
  );
}