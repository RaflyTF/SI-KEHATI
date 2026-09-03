'use client';

import { Modal } from '@/components/ui/Modal';

interface ProgramDetail {
  nama: string;
  deskripsi: string;
  anggaran: number;
  status: string;
  createdAt: string;
  creator: { nama: string; email: string } | null;
  photos: { id: string; fileUrl: string; caption: string | null }[];
  speciesData: { id: string; species: { namaLokal: string }; jumlahIndividu: number }[];
}

const STATUS_LABELS: Record<string, string> = { draft: 'Draft', published: 'Published' };

export function ProgramDetailModal({
  open,
  onClose,
  program,
}: {
  open: boolean;
  onClose: () => void;
  program: ProgramDetail | null;
}) {
  return (
    <Modal open={open} onClose={onClose} title={program?.nama ?? 'Detail Program'}>
      {!program ? (
        <p className="text-sm text-gray-400">Memuat detail...</p>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Deskripsi</p>
            <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line">{program.deskripsi}</p>
          </div>

          <dl className="grid grid-cols-2 gap-y-2 text-sm">
            <dt className="text-gray-500 dark:text-gray-400">Anggaran</dt>
            <dd className="text-gray-800 dark:text-gray-200 text-right">
              Rp {program.anggaran.toLocaleString('id-ID')}
            </dd>
            <dt className="text-gray-500 dark:text-gray-400">Status</dt>
            <dd className="text-gray-800 dark:text-gray-200 text-right">
              {STATUS_LABELS[program.status] ?? program.status}
            </dd>
            <dt className="text-gray-500 dark:text-gray-400">Dibuat oleh</dt>
            <dd className="text-gray-800 dark:text-gray-200 text-right">{program.creator?.nama ?? '-'}</dd>
            <dt className="text-gray-500 dark:text-gray-400">Tanggal dibuat</dt>
            <dd className="text-gray-800 dark:text-gray-200 text-right">
              {new Date(program.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </dd>
            <dt className="text-gray-500 dark:text-gray-400">Jumlah foto terkait</dt>
            <dd className="text-gray-800 dark:text-gray-200 text-right">{program.photos.length}</dd>
            <dt className="text-gray-500 dark:text-gray-400">Data spesies terkait</dt>
            <dd className="text-gray-800 dark:text-gray-200 text-right">{program.speciesData.length}</dd>
          </dl>

          {program.photos.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Foto Dokumentasi</p>
              <div className="grid grid-cols-3 gap-2">
                {program.photos.map((photo) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={photo.id}
                    src={photo.fileUrl}
                    alt={photo.caption ?? program.nama}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}