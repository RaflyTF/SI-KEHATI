'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';

const NAV_ITEMS = [
  { href: '/', label: 'Beranda' },
  { href: '/status-flora-fauna', label: 'Status Flora & Fauna' },
  { href: '/program', label: 'Program' },
  { href: '/galeri', label: 'Galeri' },
  { href: '/tentang-kami', label: 'Tentang Kami' },
  { href: '/kontak', label: 'Kontak' },
];

// Navbar publik -- responsif (hamburger menu di layar mobile) dan mendukung
// Dark Mode, sesuai kebutuhan NFR & Responsive Design pada SRS/SDD.
export function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold text-primary dark:text-primary-light">
          SI-KEHATI
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-primary dark:hover:text-primary-light">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggle}
            aria-label="Ganti mode gelap/terang"
            className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700"
          >
            {theme === 'dark' ? '☀️ Terang' : '🌙 Gelap'}
          </button>
          <Link href="/login" className="text-sm px-4 py-1.5 rounded-lg bg-primary text-white">
            Login
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Buka menu">
          ☰
        </button>
      </div>

      {open && (
        <nav className="md:hidden flex flex-col gap-1 px-4 pb-4 text-sm">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="py-2" onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <button onClick={toggle} className="py-2 text-left">
            {theme === 'dark' ? '☀️ Mode Terang' : '🌙 Mode Gelap'}
          </button>
          <Link href="/login" className="py-2 font-medium text-primary">
            Login
          </Link>
        </nav>
      )}
    </header>
  );
}
