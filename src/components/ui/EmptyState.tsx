import clsx from 'clsx';

interface EmptyStateProps {
  title: string;
  description?: string;
  className?: string;
}

// Primitif empty-state -- dipakai saat tabel/grid TIDAK PUNYA DATA untuk
// ditampilkan (beda dengan Skeleton yang untuk kondisi SEDANG MEMUAT).
// Skeleton = "sabar, masih dimuat" -- EmptyState = "sudah selesai dimuat,
// memang belum ada datanya".
export function EmptyState({ title, description, className }: EmptyStateProps) {
  return (
    <div className={clsx('flex flex-col items-center justify-center text-center py-10 px-4', className)}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gray-300 dark:text-gray-700 mb-3"
      >
        <path d="M3 7h18M3 7l1.5 12a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1L21 7M3 7l2-4h14l2 4" />
      </svg>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      {description && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-xs">{description}</p>}
    </div>
  );
}