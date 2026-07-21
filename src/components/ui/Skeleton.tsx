import clsx from 'clsx';

// Primitif skeleton loading -- kotak abu-abu yang berdenyut (Tailwind `animate-pulse`
// bawaan, tidak perlu konfigurasi tambahan) sebagai placeholder selagi data dari API
// masih dimuat. Dipakai menggantikan tampilan kosong/"—" yang terkesan seperti error.
export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx('animate-pulse rounded-md bg-gray-200 dark:bg-gray-800', className)} />;
}