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

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-900/90">

      {/* Navbar utama */}
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">

         {/* Logo */}
        <Link href="/" className="flex items-center">
          <img
            src="logo ubp tello.png"
            alt="Logo PLN Indonesia Power"
            className="h-14 w-auto object-contain"
          />
        </Link>

        {/* Menu Desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-primary dark:hover:text-primary-light"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Tombol Desktop */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggle}
            aria-label="Ganti mode gelap/terang"
            className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700"
          >
            {theme === 'dark' ? '☀️ Terang' : '🌙 Gelap'}
          </button>

          <Link
            href="/login"
            className="text-sm px-4 py-1.5 rounded-lg bg-primary text-white"
          >
            Login
          </Link>
        </div>

        {/* Tombol Hamburger Mobile */}
        <button
          className="md:hidden text-2xl px-2 py-1"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={open}
        >
          {open ? '✕' : '☰'}
        </button>

      </div>

      {/* Menu Mobile */}
      {open && (
        <nav className="md:hidden border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-col px-4 py-3">

            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-3 text-sm border-b border-gray-100 dark:border-gray-800 hover:text-primary dark:hover:text-primary-light"
              >
                {item.label}
              </Link>
            ))}

            {/* Mode */}
            <button
              onClick={toggle}
              className="py-3 text-left text-sm border-b border-gray-100 dark:border-gray-800"
            >
              {theme === 'dark' ? '☀️ Mode Terang' : '🌙 Mode Gelap'}
            </button>

            {/* Login */}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-3 text-center py-2.5 rounded-lg bg-primary text-white text-sm font-medium"
            >
              Login
            </Link>

          </div>
        </nav>
      )}

    </header>
  );
}