// 'use client';

// export function Modal({
//   open,
//   onClose,
//   title,
//   children,
// }: {
//   open: boolean;
//   onClose: () => void;
//   title: string;
//   children: React.ReactNode;
// }) {
//   if (!open) return null;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//       <div className="w-full max-w-lg rounded-xl bg-white dark:bg-gray-900 p-6 shadow-lg">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-medium">{title}</h3>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Tutup">
//             ✕
//           </button>
//         </div>
//         {children}
//       </div>
//     </div>
//   );
// }


// Kode Baru

'use client';

import { useEffect } from 'react';

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  // Tutup dengan tombol Escape -- standar aksesibilitas untuk semua dialog
  // (requirement #9 Sprint 3: "keyboard navigation", "modal behavior").
  useEffect(() => {
    if (!open) return;
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      // Klik area gelap di luar kotak modal untuk menutup -- pola umum yang
      // diharapkan pengguna dari modal manapun.
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl bg-white dark:bg-gray-900 p-6 shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        // Cegah klik DI DALAM kotak modal ikut menutup modal (stopPropagation
        // supaya event klik tidak "menembus" ke div pembungkus di atas).
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 id="modal-title" className="text-lg font-medium">
            {title}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Tutup dialog">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}