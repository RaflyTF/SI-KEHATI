import clsx from 'clsx';

// Satu-satunya tempat mapping warna status didefinisikan (lewat lib/constants),
// dipakai di tabel data monitoring maupun tabel program (Component Design pada SDD).
export function Badge({ status, labels, colors }: { status: string; labels: Record<string, string>; colors: Record<string, string> }) {
  return (
    <span className={clsx('inline-block px-2.5 py-1 rounded-full text-xs font-medium', colors[status])}>
      {labels[status] ?? status}
    </span>
  );
}
