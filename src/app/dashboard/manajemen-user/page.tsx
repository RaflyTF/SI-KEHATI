'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ROLE_LABELS } from '@/lib/constants';
import { useToast } from '@/components/providers/ToastProvider';

interface UserRow {
  id: string;
  nama: string;
  email: string;
  role: string;
  isActive: boolean;
}

export default function ManajemenUserPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('petugas_lapangan');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  function load() {
    setLoading(true);
    fetch('/api/users')
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal memuat daftar akun.');
        return json;
      })
      .then((json) => setUsers(json.data ?? []))
      .catch((err) => setError(err instanceof Error ? err.message : 'Gagal memuat daftar akun.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, email, password, role }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        const message = json.message ?? 'Gagal menambah akun.';
        setError(message);
        toast.error(message);
        return;
      }
      toast.success(`Akun "${nama}" berhasil dibuat.`);
      setNama('');
      setEmail('');
      setPassword('');
      load();
    } catch {
      const message = 'Terjadi kesalahan jaringan. Silakan coba lagi.';
      setError(message);
      toast.error(message);
    }
  }

  async function deactivate(id: string, namaUser: string) {
    if (!confirm(`Nonaktifkan akun "${namaUser}"?`)) return;
    try {
      const res = await fetch(`/api/users/${id}/deactivate`, { method: 'PATCH' });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal menonaktifkan akun.');
      toast.success(`Akun "${namaUser}" berhasil dinonaktifkan.`);
      load();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal menonaktifkan akun.';
      setError(message);
      toast.error(message);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Manajemen Akun Pengguna</h1>

      <Card className="max-w-xl">
        <h2 className="text-sm font-medium mb-4">Tambah Akun Baru</h2>
        <form onSubmit={handleSubmit}>
          <Input label="Nama" value={nama} onChange={(e) => setNama(e.target.value)} required />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Select label="Role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="petugas_lapangan">Petugas Lapangan</option>
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </Select>
          {error && <p className="text-sm text-danger mb-4">{error}</p>}
          <Button type="submit">Tambah Akun</Button>
        </form>
      </Card>

      <Card>
        <h2 className="text-sm font-medium mb-4">Daftar Akun</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
              <th className="py-2 pr-4">Nama</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Role</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-100 dark:border-gray-900">
                  <td className="py-3 pr-4"><Skeleton className="h-4 w-24" /></td>
                  <td className="py-3 pr-4"><Skeleton className="h-4 w-32" /></td>
                  <td className="py-3 pr-4"><Skeleton className="h-4 w-20" /></td>
                  <td className="py-3 pr-4"><Skeleton className="h-4 w-14" /></td>
                  <td className="py-3 pr-4"><Skeleton className="h-4 w-16" /></td>
                </tr>
              ))}
            {!loading && users.map((u) => (
              <tr key={u.id} className="border-b border-gray-100 dark:border-gray-900">
                <td className="py-2 pr-4">{u.nama}</td>
                <td className="py-2 pr-4">{u.email}</td>
                <td className="py-2 pr-4">{ROLE_LABELS[u.role] ?? u.role}</td>
                <td className="py-2 pr-4">{u.isActive ? 'Aktif' : 'Nonaktif'}</td>
                <td className="py-2 pr-4">
                  {u.isActive && (
                    <Button variant="danger" onClick={() => deactivate(u.id, u.nama)}>
                      Nonaktifkan
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
