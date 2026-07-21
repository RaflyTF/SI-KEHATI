'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgramForm } from '@/components/forms/ProgramForm';
import { useToast } from '@/components/providers/ToastProvider';

interface ProgramRow {
  id: string;
  nama: string;
  anggaran: number;
  status: string;
}

export default function ProgramManagementPage() {
  const [programs, setPrograms] = useState<ProgramRow[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const toast = useToast();

function load() {
    setLoading(true);
    fetch('/api/programs?all=true')
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal memuat daftar program.');
        return json;
      })
      .then((json) => {
        setError('');
        setPrograms(json.data ?? []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Gagal memuat daftar program.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: string, namaProgram: string) {
    if (!confirm(`Hapus program "${namaProgram}"?`)) return;
    try {
      const res = await fetch(`/api/programs/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal menghapus program.');
      toast.success(`Program "${namaProgram}" berhasil dihapus.`);
      load();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal menghapus program.';
      setError(message);
      toast.error(message);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Kelola Program Konservasi</h1>

      <Card className="max-w-xl">
        <h2 className="text-sm font-medium mb-4">Tambah Program Baru</h2>
        <ProgramForm onSuccess={load} />
      </Card>

      <Card>
        <h2 className="text-sm font-medium mb-4">Daftar Program</h2>
        {error && <p className="text-sm text-danger mb-3">{error}</p>}
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
              <th className="py-2 pr-4">Nama</th>
              <th className="py-2 pr-4">Anggaran</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-100 dark:border-gray-900">
                  <td className="py-3 pr-4"><Skeleton className="h-4 w-32" /></td>
                  <td className="py-3 pr-4"><Skeleton className="h-4 w-24" /></td>
                  <td className="py-3 pr-4"><Skeleton className="h-4 w-16" /></td>
                  <td className="py-3 pr-4"><Skeleton className="h-4 w-14" /></td>
                </tr>
              ))}
            {!loading && programs.map((p) => (
              <tr key={p.id} className="border-b border-gray-100 dark:border-gray-900">
                <td className="py-2 pr-4">{p.nama}</td>
                <td className="py-2 pr-4">Rp {p.anggaran.toLocaleString('id-ID')}</td>
                <td className="py-2 pr-4">
                  <Badge
                    status={p.status}
                    labels={{ draft: 'Draft', published: 'Published' }}
                    colors={{ draft: 'bg-gray-100 text-gray-700', published: 'bg-green-100 text-green-800' }}
                  />
                </td>
                <td className="py-2 pr-4">
                  <Button variant="danger" onClick={() => remove(p.id, p.nama)}>
                    Hapus
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
