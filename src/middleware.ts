import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// Peta akses: path route dashboard -> role yang diizinkan.
// PENTING: setelah refactor routing, SELURUH halaman internal kini bernaung
// di bawah prefix "/dashboard" (bukan lagi top-level "/program", "/galeri", dst)
// untuk menghindari tabrakan dengan halaman publik yang punya nama sama.
//
// "/dashboard" (root, halaman ringkasan) SENGAJA dibatasi hanya untuk
// Admin/Super Admin -- konsisten dengan /api/dashboard/summary yang menolak
// role petugas_lapangan. Sebelumnya root "/dashboard" dibuka untuk semua role
// termasuk Petugas Lapangan, padahal API-nya menolak: akibatnya Petugas
// Lapangan bisa membuka halaman tapi datanya selalu gagal dimuat (403).
// Petugas Lapangan diarahkan ke "/dashboard/data-monitoring" (lihat login/page.tsx).
const ROUTE_ACCESS: Record<string, string[]> = {
  '/dashboard/data-monitoring': ['petugas_lapangan', 'admin', 'super_admin'],
  '/dashboard/verifikasi': ['admin', 'super_admin'],
  '/dashboard/program': ['admin', 'super_admin'],
  '/dashboard/galeri': ['admin', 'super_admin'],
  '/dashboard/laporan': ['admin', 'super_admin'],
  '/dashboard/manajemen-user': ['super_admin'],
  '/dashboard': ['admin', 'super_admin'],
};

// Dicocokkan dari path TERPANJANG ke terpendek, supaya "/dashboard/manajemen-user"
// tidak keburu match dengan rule umum "/dashboard" yang lebih longgar.
const SORTED_ROUTES = Object.keys(ROUTE_ACCESS).sort((a, b) => b.length - a.length);

function findAllowedRoles(pathname: string): string[] | undefined {
  const matched = SORTED_ROUTES.find(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  return matched ? ROUTE_ACCESS[matched] : undefined;
}

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = (req.nextauth.token as { role?: string } | null)?.role;
    const allowedRoles = findAllowedRoles(pathname);

    if (allowedRoles && role && !allowedRoles.includes(role)) {
      // Redirect ke halaman yang memang bisa diakses role tsb, bukan ke "/dashboard"
      // begitu saja (yang untuk Petugas Lapangan juga akan langsung ditolak lagi).
      const fallback = role === 'petugas_lapangan' ? '/dashboard/data-monitoring' : '/dashboard';
      return NextResponse.redirect(new URL(`${fallback}?error=forbidden`, req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: { signIn: '/login' },
  }
);

// Satu matcher saja sudah cukup karena seluruh halaman internal kini
// benar-benar berada di bawah /dashboard di level URL, bukan cuma di level folder.
export const config = {
  matcher: ['/dashboard/:path*'],
};
