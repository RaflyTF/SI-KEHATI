'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/providers/ToastProvider';

export function ResetPasswordDialog({
  open,
  onClose,
  userId,
  userName,
}: {
  open: boolean;
  onClose: () => void;
  userId: string | null;
  userName?: string;
}) {
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch(`/api/users/${userId}/reset-password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        const message = json.message ?? 'Gagal mereset password.';
        setError(message);
        toast.error(message);
        return;
      }
      toast.success(`Password akun "${userName}" berhasil direset.`);
      setNewPassword('');
      onClose();
    } catch {
      const message = 'Terjadi kesalahan jaringan. Silakan coba lagi.';
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={`Reset Password: ${userName ?? ''}`}>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Masukkan password baru untuk akun ini. Pengguna perlu diberi tahu password barunya secara terpisah
        (di luar sistem).
      </p>
      <form onSubmit={handleSubmit}>
        <Input
          label="Password Baru"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        {error && <p className="text-sm text-danger mb-4">{error}</p>}
        <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
          {submitting ? 'Menyimpan...' : 'Reset Password'}
        </Button>
      </form>
    </Modal>
  );
}