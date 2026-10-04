/* 'use client';

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
 */

// Kode Baru: DashboardShell.tsx

'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { ROLE_LABELS } from '@/lib/constants';
import {
  LayoutDashboard,
  ClipboardList,
  CheckSquare,
  Leaf,
  Image as ImageIcon,
  FileText,
  Users,
  Menu,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  User as UserIcon,
  type LucideIcon,
} from 'lucide-react';

// Peta menu sidebar -- setiap item punya ikon (dipakai di mode collapsed/tablet
// dan drawer mobile) dan label (disembunyikan di mode collapsed tablet, tampil
// lagi di desktop maupun drawer mobile).
const MENU: { href: string; label: string; roles: string[]; icon: LucideIcon }[] = [
  { href: '/dashboard', label: 'Dashboard', roles: ['admin', 'super_admin'], icon: LayoutDashboard },
  { href: '/dashboard/data-monitoring', label: 'Input Data Monitoring', roles: ['petugas_lapangan', 'admin', 'super_admin'], icon: ClipboardList },
  { href: '/dashboard/verifikasi', label: 'Verifikasi Data', roles: ['admin', 'super_admin'], icon: CheckSquare },
  { href: '/dashboard/program', label: 'Kelola Program', roles: ['admin', 'super_admin'], icon: Leaf },
  { href: '/dashboard/galeri', label: 'Kelola Galeri', roles: ['admin', 'super_admin'], icon: ImageIcon },
  { href: '/dashboard/laporan', label: 'Laporan', roles: ['admin', 'super_admin'], icon: FileText },
  { href: '/dashboard/manajemen-user', label: 'Manajemen Akun', roles: ['super_admin'], icon: Users },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const role = (session?.user as { role?: string } | undefined)?.role ?? '';
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const visibleMenu = MENU.filter((item) => item.roles.includes(role));

  // Tutup drawer mobile otomatis setiap kali pengguna berpindah halaman.
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  // Tutup dropdown profile saat klik di luar area dropdown, atau saat menekan Escape.
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setProfileOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      {/* Overlay -- hanya tampil di mobile saat drawer terbuka, klik untuk menutup */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/*
        Sidebar responsif 3 tingkat:
        - Mobile  (<768px)  : off-canvas drawer, lebar penuh (w-64), muncul/hilang via translate-x
        - Tablet  (768-1023): statis, collapsed jadi icon-only (w-16)
        - Desktop (>=1024px): statis, lebar penuh (w-64) dengan label
      */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 md:w-16 lg:w-64 shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 lg:p-4 transform transition-all duration-300 ease-in-out overflow-y-auto
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:static md:translate-x-0`}
      >
        <div className="flex items-center gap-2 mb-6 px-1 lg:px-2 text-primary dark:text-primary-light">
          <Leaf size={22} className="shrink-0" />
          <span className="font-semibold md:hidden lg:inline">SI-KEHATI</span>
        </div>
        <nav className="flex flex-col gap-1">
          {visibleMenu.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={`flex items-center gap-3 px-3 md:px-2 lg:px-3 py-2 rounded-lg text-sm transition-colors md:justify-center lg:justify-start ${
                  active
                    ? 'bg-primary text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-primary-light/30 dark:hover:bg-gray-800'
                }`}
              >
                <Icon size={18} />
                <span className="md:hidden lg:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-gray-600 dark:text-gray-300 p-1 -ml-1 shrink-0"
              aria-label="Buka menu navigasi"
              aria-expanded={mobileOpen}
            >
              <Menu size={22} />
            </button>
            <div className="hidden md:block text-sm text-gray-500 dark:text-gray-400 truncate">
              {session?.user?.name} · {ROLE_LABELS[role] ?? role}
            </div>
          </div>

          {/* Desktop & tablet: tombol terpisah, sesuai tampilan semula */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <button
              onClick={toggle}
              className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 transition-colors"
              aria-label="Ganti mode gelap/terang"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Mobile: profil, dark mode, dan logout digabung jadi satu dropdown */}
          <div className="md:hidden relative shrink-0" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-1 p-1.5 rounded-lg border border-gray-300 dark:border-gray-700"
              aria-label="Buka menu profil"
              aria-expanded={profileOpen}
            >
              <UserIcon size={18} />
              <ChevronDown size={14} className={`transition-transform duration-150 ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 max-w-[calc(100vw-2rem)] rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg py-1 z-50 animate-toast-in">
                <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800">
                  <p className="text-sm font-medium truncate">{session?.user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{ROLE_LABELS[role] ?? role}</p>
                </div>
                <button
                  onClick={toggle}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-left"
                >
                  {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                  {theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
                </button>
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-gray-50 dark:hover:bg-gray-800 text-left"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}