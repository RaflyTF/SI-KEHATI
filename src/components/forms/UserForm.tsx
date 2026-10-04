'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/providers/ToastProvider';

interface UserFormValues {
  nama: string;
  email: string;
  role: string;
}

interface UserFormProps {
  mode?: 'create' | 'edit';
  userId?: string;
  initialValues?: UserFormValues;
  onSuccess?: () => void;
  onCancel?: () => void;
}

// Mode "edit" TIDAK menyertakan field password -- penggantian password
// sengaja dipisah ke aksi "Reset Password" tersendiri (lihat ResetPasswordDialog),
// supaya field password tidak pernah ter-render kosong lalu ketimpa tanpa
// sengaja saat Super Admin cuma bermaksud mengubah nama/role.
export function UserForm({ mode = 'create', userId, initialValues, onSuccess, onCancel }: UserFormProps) {
  const [nama, setNama] = useState(initialValues?.nama ?? '');
  const [email, setEmail] = useState(initialValues?.email ?? '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(initialValues?.role ?? 'petugas_lapangan');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const isEdit = mode === 'edit' && userId;
      const body = isEdit ? { nama, email, role } : { nama, email, password, role };
      const res = await fetch(isEdit ? `/api/users/${userId}` : '/api/users', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        const message = json.message ?? 'Gagal menyimpan akun.';
        setError(message);
        toast.error(message);
        return;
      }
      toast.success(isEdit ? `Akun "${nama}" berhasil diperbarui.` : `Akun "${nama}" berhasil dibuat.`);
      if (!isEdit) {
        setNama('');
        setEmail('');
        setPassword('');
        setRole('petugas_lapangan');
      }
      onSuccess?.();
    } catch {
      const message = 'Terjadi kesalahan jaringan. Silakan coba lagi.';
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input label="Nama" value={nama} onChange={(e) => setNama(e.target.value)} required />
      <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      {mode === 'create' && (
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      )}
      <Select label="Role" value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="petugas_lapangan">Petugas Lapangan</option>
        <option value="admin">Admin</option>
        <option value="super_admin">Super Admin</option>
      </Select>
      {error && <p className="text-sm text-danger mb-4">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
          {submitting ? 'Menyimpan...' : mode === 'edit' ? 'Simpan Perubahan' : 'Tambah Akun'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
            Batal
          </Button>
        )}
      </div>
    </form>
  );
}