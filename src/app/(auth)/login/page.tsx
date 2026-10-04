'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', { email, password, redirect: false });

      if (result?.error) {
        setError(result.error);
        return;
      }

      // Ambil role dari session yang baru terbentuk, lalu arahkan ke halaman
      // yang memang bisa diakses role tersebut -- bukan selalu ke "/dashboard",
      // karena halaman ringkasan dashboard khusus untuk Admin/Super Admin.
      const session = await getSession();
      const role = (session?.user as { role?: string } | undefined)?.role;
      const destination = role === 'petugas_lapangan' ? '/dashboard/data-monitoring' : '/dashboard';

      router.push(destination);
      router.refresh();
    } catch {
      setError('Terjadi kesalahan jaringan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-sm mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-light transition-colors"
        >
          <span aria-hidden="true">←</span>
          Kembali ke Beranda
        </Link>
      </div>
      <Card className="w-full max-w-sm">
        <h1 className="text-lg font-semibold mb-1 text-primary dark:text-primary-light">SI-KEHATI</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Masuk sebagai Petugas Lapangan, Admin, atau Super Admin.
        </p>
        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-sm text-danger mb-4">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Memproses...' : 'Masuk'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
