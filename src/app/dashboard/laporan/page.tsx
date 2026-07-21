'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getExporter } from '@/lib/reportExporter';

export default function LaporanPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function exportSpeciesRecords(format: 'pdf' | 'excel') {
    setLoading(`records-${format}`);
    setError('');
    try {
      const res = await fetch('/api/species-records');
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal mengambil data untuk laporan.');

      const rows = (json.data ?? []).map((r: { species: { namaLokal: string; jenis: string }; period: { label: string | null; tahun: number }; jumlahIndividu: number; index?: { hValue: number } }) => ({
        Spesies: r.species.namaLokal,
        Jenis: r.species.jenis,
        Periode: r.period.label ?? r.period.tahun,
        'Jumlah Individu': r.jumlahIndividu,
        "Indeks H'": r.index?.hValue ?? '-',
      }));
      await getExporter(format).export(rows, 'laporan-flora-fauna');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal membuat laporan flora & fauna.');
    } finally {
      setLoading(null);
    }
  }

  async function exportPrograms(format: 'pdf' | 'excel') {
    setLoading(`programs-${format}`);
    setError('');
    try {
      const res = await fetch('/api/programs?all=true');
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal mengambil data program untuk laporan.');

      const rows = (json.data ?? []).map((p: { nama: string; anggaran: number; status: string }) => ({
        'Nama Program': p.nama,
        Anggaran: p.anggaran,
        Status: p.status,
      }));
      await getExporter(format).export(rows, 'laporan-program');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal membuat laporan program.');
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Laporan</h1>
      {error && <p className="text-sm text-danger">{error}</p>}

      <Card>
        <h2 className="text-sm font-medium mb-4">Laporan Data Flora & Fauna</h2>
        <div className="flex gap-2">
          <Button disabled={!!loading} onClick={() => exportSpeciesRecords('pdf')}>
            {loading === 'records-pdf' ? 'Memproses...' : 'Ekspor PDF'}
          </Button>
          <Button variant="secondary" disabled={!!loading} onClick={() => exportSpeciesRecords('excel')}>
            {loading === 'records-excel' ? 'Memproses...' : 'Ekspor Excel'}
          </Button>
        </div>
      </Card>

      <Card>
        <h2 className="text-sm font-medium mb-4">Laporan Program Konservasi</h2>
        <div className="flex gap-2">
          <Button disabled={!!loading} onClick={() => exportPrograms('pdf')}>
            {loading === 'programs-pdf' ? 'Memproses...' : 'Ekspor PDF'}
          </Button>
          <Button variant="secondary" disabled={!!loading} onClick={() => exportPrograms('excel')}>
            {loading === 'programs-excel' ? 'Memproses...' : 'Ekspor Excel'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
