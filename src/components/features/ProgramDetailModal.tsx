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
  speciesData: {
    id: string;
    species: { namaLokal: string };
    jumlahIndividu: number;
  }[];
  supportingData: {
  id: string;
  namaDaerah: string;
  jumlah2022: number;
  jumlah2023: number;
  jumlah2024: number;
  jumlah2025: number;
  jumlah2026: number;
}[];
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

          {(program.supportingData ?? []).length > 0 && (
  <div>
    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
      Data Pendukung
    </p>

    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="w-full min-w-[620px] text-sm">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <th className="px-3 py-2 text-left">No</th>
            <th className="px-3 py-2 text-left">Nama Daerah</th>
            <th className="px-3 py-2 text-center">2022</th>
            <th className="px-3 py-2 text-center">2023</th>
            <th className="px-3 py-2 text-center">2024</th>
            <th className="px-3 py-2 text-center">2025</th>
             <th className="px-3 py-2 text-center">2026</th>
          </tr>
        </thead>

        <tbody>
        {(program.supportingData ?? []).map((item, index) => (
            <tr
              key={item.id}
              className="border-b border-gray-100 dark:border-gray-800 last:border-b-0"
            >
              <td className="px-3 py-2">{index + 1}</td>

              <td className="px-3 py-2 font-medium">
                {item.namaDaerah}
              </td>

              <td className="px-3 py-2 text-center">
                {item.jumlah2022}
              </td>

              <td className="px-3 py-2 text-center">
                {item.jumlah2023}
              </td>

              <td className="px-3 py-2 text-center">
                {item.jumlah2024}
              </td>

              <td className="px-3 py-2 text-center">
                {item.jumlah2025}
              </td>

                 <td className="px-3 py-2 text-center">
                {item.jumlah2026}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

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