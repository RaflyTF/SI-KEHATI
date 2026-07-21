'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { SpeciesRecordForm } from '@/components/forms/SpeciesRecordForm';
import { RECORD_STATUS_LABELS, RECORD_STATUS_COLORS } from '@/lib/constants';

interface RecordRow {
  id: string;
  jumlahIndividu: number;
  status: string;
  catatanRevisi: string | null;
  species: { namaLokal: string; jenis: string };
  period: { label: string | null; tahun: number };
}

// Halaman ini dipakai Petugas Lapangan untuk menginput data baru.
// (Pada versi ini daftar riwayat menampilkan data pending sebagai contoh;
// pengembangan lanjutan dapat menambah endpoint "riwayat milik saya".)
export default function DataMonitoringPage() {
  const [pending, setPending] = useState<RecordRow[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  function loadPending() {
    setLoading(true);
    fetch('/api/species-records?status=pending')
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal memuat riwayat data.');
        return json;
      })
      .then((json) => {
        setError('');
        setPending(json.data ?? []);
      })
      .catch((err) => {
        setPending([]);
        setError(err instanceof Error ? err.message : 'Gagal memuat riwayat data.');
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadPending();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Input Data Monitoring</h1>

      <Card className="max-w-xl">
        <h2 className="text-sm font-medium mb-4">Form Data Baru</h2>
        <SpeciesRecordForm onSuccess={loadPending} />
      </Card>

      <Card>
        <h2 className="text-sm font-medium mb-4">Data yang Sedang Menunggu Verifikasi</h2>
        {error && <p className="text-sm text-danger mb-3">{error}</p>}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                <th className="py-2 pr-4">Spesies</th>
                <th className="py-2 pr-4">Periode</th>
                <th className="py-2 pr-4">Jumlah</th>
                <th className="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100 dark:border-gray-900">
                    <td className="py-3 pr-4"><Skeleton className="h-4 w-28" /></td>
                    <td className="py-3 pr-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="py-3 pr-4"><Skeleton className="h-4 w-8" /></td>
                    <td className="py-3 pr-4"><Skeleton className="h-4 w-20" /></td>
                  </tr>
                ))
              ) : (
                <>
                  {pending.map((r) => (
                    <tr key={r.id} className="border-b border-gray-100 dark:border-gray-900">
                      <td className="py-2 pr-4">{r.species.namaLokal}</td>
                      <td className="py-2 pr-4">{r.period.label ?? r.period.tahun}</td>
                      <td className="py-2 pr-4">{r.jumlahIndividu}</td>
                      <td className="py-2 pr-4">
                        <Badge status={r.status} labels={RECORD_STATUS_LABELS} colors={RECORD_STATUS_COLORS} />
                      </td>
                    </tr>
                  ))}
                  {pending.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-gray-400">
                        Belum ada data yang menunggu verifikasi.
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
