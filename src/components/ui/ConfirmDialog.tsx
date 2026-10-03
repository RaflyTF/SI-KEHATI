// 'use client';

// import { Button } from '@/components/ui/Button';
// import { Modal } from '@/components/ui/Modal';

// interface DetailItem {
//   label: string;
//   value: string;
// }

// interface ConfirmDialogProps {
//   open: boolean;
//   onClose: () => void;
//   onConfirm: () => void;
//   title: string;
//   description: string;
//   /**
//    * Rincian data yang akan dihapus (Nama, Status, Tanggal dibuat, Pembuat,
//    * jumlah data terkait, dst) -- sesuai requirement "Transparansi Data" pada
//    * Sprint 2: pengguna harus melihat info lengkap SEBELUM menekan konfirmasi.
//    */
//   details?: DetailItem[];
//   loading?: boolean;
//   confirmLabel?: string;
// }

// // Komponen generik -- dipakai ulang di SEMUA modul CRUD (Program, Galeri,
// // Data Monitoring, Verifikasi, User) untuk konfirmasi hapus yang konsisten,
// // alih-alih window.confirm() bawaan browser yang tidak bisa menampilkan
// // rincian data maupun di-styling.
// export function ConfirmDialog({
//   open,
//   onClose,
//   onConfirm,
//   title,
//   description,
//   details,
//   loading,
//   confirmLabel = 'Ya, Hapus',
// }: ConfirmDialogProps) {
//   return (
//     <Modal open={open} onClose={onClose} title={title}>
//       <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{description}</p>

//       {details && details.length > 0 && (
//         <dl className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3 mb-4 space-y-1.5">
//           {details.map((item) => (
//             <div key={item.label} className="flex justify-between gap-4 text-sm">
//               <dt className="text-gray-500 dark:text-gray-400">{item.label}</dt>
//               <dd className="text-gray-800 dark:text-gray-200 font-medium text-right">{item.value}</dd>
//             </div>
//           ))}
//         </dl>
//       )}

//       <p className="text-xs text-danger mb-4">Data yang dihapus tidak dapat dikembalikan.</p>

//       <div className="flex gap-2 justify-end">
//         <Button variant="secondary" onClick={onClose} disabled={loading}>
//           Batal
//         </Button>
//         <Button variant="danger" onClick={onConfirm} disabled={loading}>
//           {loading ? 'Menghapus...' : confirmLabel}
//         </Button>
//       </div>
//     </Modal>
//   );
// }

// Kode Baru

'use client';

import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

interface DetailItem {
  label: string;
  value: string;
}

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  details?: DetailItem[];
  loading?: boolean;
  confirmLabel?: string;
  /**
   * Pesan error jika aksi konfirmasi gagal (mis. "akun ini masih punya data
   * terkait"). Ditampilkan DI DALAM dialog yang sama -- bukan modal/toast
   * terpisah -- supaya pengguna bisa membaca alasannya sambil dialog masih
   * terbuka, lalu bisa langsung menekan "Batal" tanpa kehilangan konteks.
   */
  error?: string;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  details,
  loading,
  confirmLabel = 'Ya, Hapus',
  error,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{description}</p>

      {details && details.length > 0 && (
        <dl className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3 mb-4 space-y-1.5">
          {details.map((item) => (
            <div key={item.label} className="flex justify-between gap-4 text-sm">
              <dt className="text-gray-500 dark:text-gray-400">{item.label}</dt>
              <dd className="text-gray-800 dark:text-gray-200 font-medium text-right">{item.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {error ? (
        <p className="text-sm text-danger mb-4">{error}</p>
      ) : (
        <p className="text-xs text-danger mb-4">Data yang dihapus tidak dapat dikembalikan.</p>
      )}

      <div className="flex gap-2 justify-end">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Batal
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={loading}>
          {loading ? 'Menghapus...' : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}