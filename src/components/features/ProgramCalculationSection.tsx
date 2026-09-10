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
    { dataId: string; jumlahIndividu: number; pi: number; lnPi: number; hValue: number } | undefined
  >;
}

interface BiodiversityData {
  periods: BiodiversityPeriod[];
  species: BiodiversitySpeciesRow[];
  totals: Record<string, { totalIndividu: number; totalH: number }>;
}

// Format angka ala Indonesia (koma sebagai desimal), konsisten dengan
// format yang dipakai PDF referensi ("0,542" bukan "0.542").
function formatAngka(value: number, decimals = 3) {
  return value.toLocaleString('id-ID', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function ProgramCalculationSection({ biodiversity }: { biodiversity: BiodiversityData | null }) {
  const [selectedPeriodId, setSelectedPeriodId] = useState('');

  // Default ke tahun PALING BARU begitu data biodiversitas selesai dimuat --
  // supaya pengunjung langsung melihat perhitungan tahun terkini tanpa
  // harus memilih dulu.
  useEffect(() => {
    if (biodiversity && biodiversity.periods.length > 0 && !selectedPeriodId) {
      setSelectedPeriodId(biodiversity.periods[biodiversity.periods.length - 1].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [biodiversity]);

  if (!biodiversity || biodiversity.periods.length === 0) {
    return (
      <EmptyState
        title="Belum ada data untuk dihitung"
        description="Bukti perhitungan akan tampil setelah Data Pendukung diisi."
      />
    );
  }

  const selectedPeriod = biodiversity.periods.find((p) => p.id === selectedPeriodId);
  const totalN = biodiversity.totals[selectedPeriodId]?.totalIndividu ?? 0;

  // Hanya spesies yang benar-benar punya baris data di tahun terpilih --
  // spesies yang belum pernah dicatat sama sekali di tahun itu tidak perlu
  // ditampilkan kartunya (beda dari tabel Data Pendukung yang menampilkan
  // "0" untuk semua spesies demi konsistensi kolom).
  const speciesWithData = biodiversity.species.filter((s) => s.byPeriod[selectedPeriodId] !== undefined);

  return (
    <div>
      <div className="max-w-xs mb-6">
        <Select label="Pilih Tahun" value={selectedPeriodId} onChange={(e) => setSelectedPeriodId(e.target.value)}>
          {biodiversity.periods.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label ?? p.tahun}
            </option>
          ))}
        </Select>
      </div>

      {speciesWithData.length === 0 ? (
        <EmptyState
          title="Tidak ada data pada tahun ini"
          description="Pilih tahun lain, atau tambahkan data pendukung untuk periode ini."
        />
      ) : (
        <div className="space-y-4">
          {speciesWithData.map((s) => {
            const cell = s.byPeriod[selectedPeriodId]!;
            const punyaIndividu = cell.jumlahIndividu > 0;

            return (
              <div key={s.speciesId} className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 md:p-5">
                <p className="font-medium text-gray-800 dark:text-gray-100 mb-3">
                  {s.namaLokal} <span className="italic text-sm text-gray-500 dark:text-gray-400">({s.namaIlmiah})</span>
                </p>

                <dl className="grid grid-cols-2 gap-y-1.5 text-sm mb-4">
                  <dt className="text-gray-500 dark:text-gray-400">Jumlah individu (ni)</dt>
                  <dd className="text-right font-mono">{cell.jumlahIndividu}</dd>
                  <dt className="text-gray-500 dark:text-gray-400">Total individu periode ini (N)</dt>
                  <dd className="text-right font-mono">{totalN}</dd>
                </dl>

                {!punyaIndividu ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    Belum ada individu tercatat untuk spesies ini pada {selectedPeriod?.label ?? selectedPeriod?.tahun} —
                    kontribusi terhadap Indeks H&apos; dihitung sebagai <strong>0</strong> (bukan hasil ln(0), yang secara
                    matematis tidak terdefinisi).
                  </p>
                ) : (
                  <div className="space-y-2 text-sm font-mono bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <p>
                      Pi = ni / N = {cell.jumlahIndividu} / {totalN} = <strong>{formatAngka(cell.pi)}</strong>
                    </p>
                    <p>
                      ln(Pi) = ln({formatAngka(cell.pi)}) = <strong>{formatAngka(cell.lnPi)}</strong>
                    </p>
                    <p>
                      H&apos; = -(Pi &times; ln(Pi)) = -({formatAngka(cell.pi)} &times; {formatAngka(cell.lnPi)}) ={' '}
                      <strong>{formatAngka(cell.hValue)}</strong>
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}