'use client';

import { useEffect, useState } from 'react';
import { Select } from '@/components/ui/Select';
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
    {
      dataId: string;
      jumlahIndividu: number;
      pi: number;
      lnPi: number;
      hValue: number;
    } | undefined
  >;
}

interface BiodiversityData {
  periods: BiodiversityPeriod[];
  species: BiodiversitySpeciesRow[];
  totals: Record<
    string,
    {
      totalIndividu: number;
      totalH: number;
    }
  >;
}

function formatAngka(value: number, decimals = 4) {
  return value.toLocaleString('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function ProgramCalculationSection({
  biodiversity,
}: {
  biodiversity: BiodiversityData | null;
}) {
  const [selectedPeriodId, setSelectedPeriodId] = useState('');

  useEffect(() => {
    if (
      biodiversity &&
      biodiversity.periods.length > 0 &&
      !selectedPeriodId
    ) {
      setSelectedPeriodId(
        biodiversity.periods[biodiversity.periods.length - 1].id
      );
    }
  }, [biodiversity, selectedPeriodId]);

  if (!biodiversity || biodiversity.species.length === 0) {
    return (
      <EmptyState
        title="Belum ada data untuk dihitung"
        description="Bukti perhitungan akan tampil setelah Data Pendukung diisi."
      />
    );
  }

  const selectedPeriod = biodiversity.periods.find(
    (p) => p.id === selectedPeriodId
  );

  const totalN =
    biodiversity.totals[selectedPeriodId]?.totalIndividu ?? 0;

  const speciesWithData = biodiversity.species.filter(
    (s) => s.byPeriod[selectedPeriodId] !== undefined
  );

  return (
    <div>
      {/* Pilih tahun */}
      <div className="max-w-xs mb-6">
        <Select
          label="Pilih Tahun"
          value={selectedPeriodId}
          onChange={(e) => setSelectedPeriodId(e.target.value)}
        >
          {biodiversity.periods.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label ?? p.tahun}
            </option>
          ))}
        </Select>
      </div>

      {/* Total individu */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4 mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Total individu (N) tahun {selectedPeriod?.tahun}
        </p>

        <p className="text-2xl font-bold text-green-700 dark:text-green-400 mt-1">
          {totalN}
        </p>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          N = jumlah seluruh individu dari semua nama daerah pada tahun ini.
        </p>
      </div>

      {speciesWithData.length === 0 ? (
        <EmptyState
          title="Tidak ada data pada tahun ini"
          description="Pilih tahun lain, atau tambahkan Data Pendukung untuk periode ini."
        />
      ) : (
        <div className="space-y-4">
          {speciesWithData.map((s) => {
            const cell = s.byPeriod[selectedPeriodId]!;

            const punyaIndividu = cell.jumlahIndividu > 0;

            return (
              <div
                key={s.speciesId}
                className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 md:p-5"
              >
                {/* Nama daerah */}
                <p className="font-medium text-gray-800 dark:text-gray-100 mb-4">
                  {s.namaLokal}
                </p>

                {/* Data dasar */}
                <dl className="grid grid-cols-2 gap-y-2 text-sm mb-4">
                  <dt className="text-gray-500 dark:text-gray-400">
                    Jumlah individu (ni)
                  </dt>

                  <dd className="text-right font-mono">
                    {cell.jumlahIndividu}
                  </dd>

                  <dt className="text-gray-500 dark:text-gray-400">
                    Total individu (N)
                  </dt>

                  <dd className="text-right font-mono">
                    {totalN}
                  </dd>
                </dl>

                {!punyaIndividu ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    Jumlah individu pada tahun ini adalah 0, sehingga
                    kontribusi terhadap H&apos; dihitung sebagai 0.
                  </p>
                ) : (
                  <div className="space-y-3 text-sm font-mono bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    {/* Pi */}
                    <p>
                      Pi = ni / N = {cell.jumlahIndividu} / {totalN}{' '}
                      ={' '}
                      <strong>
                        {formatAngka(cell.pi)}
                      </strong>
                    </p>

                    {/* ln Pi */}
                    <p>
                      ln(Pi) = ln({formatAngka(cell.pi)}) ={' '}
                      <strong>
                        {formatAngka(cell.lnPi)}
                      </strong>
                    </p>

                    {/* H' */}
                    <p>
                      H&apos; = -(Pi × ln(Pi)) = -(
                      {formatAngka(cell.pi)} ×{' '}
                      {formatAngka(cell.lnPi)}) ={' '}
                      <strong>
                        {formatAngka(cell.hValue)}
                      </strong>
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Total H' */}
          <div className="rounded-xl border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/30 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-100">
                  Total H&apos;
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Σ kontribusi H&apos; seluruh nama daerah pada tahun{' '}
                  {selectedPeriod?.tahun}.
                </p>
              </div>

              <p className="text-xl font-bold font-mono text-green-700 dark:text-green-400">
                {formatAngka(
                  biodiversity.totals[selectedPeriodId]?.totalH ?? 0
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}