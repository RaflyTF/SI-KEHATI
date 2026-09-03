// 'use client';

// import { useState } from 'react';
// import { Input } from '@/components/ui/Input';
// import { Select } from '@/components/ui/Select';
// import { Button } from '@/components/ui/Button';
// import { useToast } from '@/components/providers/ToastProvider';

// export function ProgramForm({ onSuccess }: { onSuccess?: () => void }) {
//   const [nama, setNama] = useState('');
//   const [deskripsi, setDeskripsi] = useState('');
//   const [anggaran, setAnggaran] = useState('');
//   const [status, setStatus] = useState<'draft' | 'published'>('draft');
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState('');
//   const toast = useToast();

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setError('');
//     const anggaranNum = Number(anggaran);
//     if (!nama || !deskripsi || Number.isNaN(anggaranNum) || anggaranNum < 0) {
//       setError('Semua field wajib diisi dengan benar.');
//       return;
//     }

//     setSubmitting(true);
//     try {
//       const res = await fetch('/api/programs', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ nama, deskripsi, anggaran: anggaranNum, status }),
//       });
//       const json = await res.json();

//       if (!res.ok || !json.success) {
//         const message = json.message ?? 'Gagal menyimpan program.';
//         setError(message);
//         toast.error(message);
//         return;
//       }
//       toast.success(`Program "${nama}" berhasil disimpan.`);
//       setNama('');
//       setDeskripsi('');
//       setAnggaran('');
//       setStatus('draft');
//       onSuccess?.();
//     } catch {
//       const message = 'Terjadi kesalahan jaringan. Silakan coba lagi.';
//       setError(message);
//       toast.error(message);
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       <Input label="Nama Program" value={nama} onChange={(e) => setNama(e.target.value)} required />
//       <label className="block mb-4">
//         <span className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi</span>
//         <textarea
//           className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 text-sm"
//           rows={3}
//           value={deskripsi}
//           onChange={(e) => setDeskripsi(e.target.value)}
//           required
//         />
//       </label>
//       <Input
//         label="Anggaran (Rp)"
//         type="number"
//         min={0}
//         value={anggaran}
//         onChange={(e) => setAnggaran(e.target.value)}
//         required
//       />
//       <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}>
//         <option value="draft">Draft (belum tampil publik)</option>
//         <option value="published">Published</option>
//       </Select>
//       {error && <p className="text-sm text-danger mb-4">{error}</p>}
//       <Button type="submit" disabled={submitting}>
//         {submitting ? 'Menyimpan...' : 'Simpan Program'}
//       </Button>
//     </form>
//   );
// }


// Kode Baru

'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/providers/ToastProvider';

interface ProgramFormValues {
  nama: string;
  deskripsi: string;
  anggaran: number;
  status: 'draft' | 'published';
}

interface ProgramFormProps {
  mode?: 'create' | 'edit';
  programId?: string;
  initialValues?: ProgramFormValues;
  onSuccess?: () => void;
  onCancel?: () => void;
}

// Form yang sama dipakai untuk 2 mode (create & edit), sesuai prinsip
// reusable component -- daripada membuat 2 form terpisah dengan logika
// validasi yang berpotensi terduplikasi dan tidak sinkron.
export function ProgramForm({ mode = 'create', programId, initialValues, onSuccess, onCancel }: ProgramFormProps) {
  const [nama, setNama] = useState(initialValues?.nama ?? '');
  const [deskripsi, setDeskripsi] = useState(initialValues?.deskripsi ?? '');
  const [anggaran, setAnggaran] = useState(initialValues ? String(initialValues.anggaran) : '');
  const [status, setStatus] = useState<'draft' | 'published'>(initialValues?.status ?? 'draft');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const anggaranNum = Number(anggaran);
    if (!nama || !deskripsi || Number.isNaN(anggaranNum) || anggaranNum < 0) {
      setError('Semua field wajib diisi dengan benar.');
      return;
    }

    setSubmitting(true);
    try {
      const isEdit = mode === 'edit' && programId;
      const res = await fetch(isEdit ? `/api/programs/${programId}` : '/api/programs', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, deskripsi, anggaran: anggaranNum, status }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        const message = json.message ?? 'Gagal menyimpan program.';
        setError(message);
        toast.error(message);
        return;
      }

      toast.success(isEdit ? `Program "${nama}" berhasil diperbarui.` : `Program "${nama}" berhasil disimpan.`);

      if (!isEdit) {
        setNama('');
        setDeskripsi('');
        setAnggaran('');
        setStatus('draft');
      }
      onSuccess?.();
    } catch {
      const message = 'Terjadi kesalahan jaringan. Silakan coba lagi.';
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input label="Nama Program" value={nama} onChange={(e) => setNama(e.target.value)} required />
      <label className="block mb-4">
        <span className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi</span>
        <textarea
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 text-sm transition-colors duration-150 hover:border-gray-400 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/40"
          rows={3}
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          required
        />
      </label>
      <Input
        label="Anggaran (Rp)"
        type="number"
        min={0}
        value={anggaran}
        onChange={(e) => setAnggaran(e.target.value)}
        required
      />
      <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}>
        <option value="draft">Draft (belum tampil publik)</option>
        <option value="published">Published</option>
      </Select>
      {error && <p className="text-sm text-danger mb-4">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
          {submitting ? 'Menyimpan...' : mode === 'edit' ? 'Simpan Perubahan' : 'Simpan Program'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
            Batal
          </Button>
        )}
      </div>
    </form>
  );
}