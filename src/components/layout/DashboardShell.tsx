'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { ROLE_LABELS } from '@/lib/constants';

// Sidebar menu BERBEDA isinya sesuai role -- item yang tidak relevan
// tidak dirender sama sekali (bukan hanya disembunyikan via CSS), sesuai
// prinsip keamanan "progressive disclosure by role" pada SDD (UI Flow).
const MENU: { href: string; label: string; roles: string[] }[] = [
  { href: '/dashboard', label: 'Dashboard', roles: ['admin', 'super_admin'] },
  { href: '/dashboard/data-monitoring', label: 'Input Data Monitoring', roles: ['petugas_lapangan', 'admin', 'super_admin'] },
  { href: '/dashboard/verifikasi', label: 'Verifikasi Data', roles: ['admin', 'super_admin'] },
  { href: '/dashboard/program', label: 'Kelola Program', roles: ['admin', 'super_admin'] },
  { href: '/dashboard/galeri', label: 'Kelola Galeri', roles: ['admin', 'super_admin'] },
  { href: '/dashboard/laporan', label: 'Laporan', roles: ['admin', 'super_admin'] },
  { href: '/dashboard/manajemen-user', label: 'Manajemen Akun', roles: ['super_admin'] },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const role = (session?.user as { role?: string } | undefined)?.role ?? '';
  const [mobileOpen, setMobileOpen] = useState(false);


  const visibleMenu = MENU.filter((item) => item.roles.includes(role));

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
    {mobileOpen && (
      <div
        className="fixed inset-0 z-40 bg-black/50 md:hidden"
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />
    )}

    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 transform transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        md:static md:translate-x-0 md:block`}
    >
      <div className="font-semibold text-primary dark:text-primary-light mb-6 px-2">SI-KEHATI</div>
      <nav className="flex flex-col gap-1">
        {visibleMenu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-2 rounded-lg text-sm ${
              pathname === item.href
                ? 'bg-primary text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-primary-light/30 dark:hover:bg-gray-800'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>

      <div className="flex-1 flex flex-col min-w-0">
      <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden text-gray-600 dark:text-gray-300 p-1 -ml-1"
            aria-label="Buka menu navigasi"
            aria-expanded={mobileOpen}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {session?.user?.name} · {ROLE_LABELS[role] ?? role}
          </div>
        </div>          <div className="flex items-center gap-2">
            <button onClick={toggle} className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700"
            >
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
