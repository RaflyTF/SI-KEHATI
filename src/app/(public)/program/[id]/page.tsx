'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface ProgramDetail {
  nama: string;
  deskripsi: string;
  anggaran: number;
  photos: { id: string; fileUrl: string; caption: string | null }[];
}

export default function ProgramDetailPage() {
  const params = useParams<{ id: string }>();
  const [program, setProgram] = useState<ProgramDetail | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    fetch(`/api/programs/${params.id}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message ?? 'Program tidak ditemukan.');
        return json;
      })
      .then((json) => {
        if (!ignore) setProgram(json.data);
      })
      .catch((err) => {
        if (!ignore) setError(err instanceof Error ? err.message : 'Program tidak ditemukan.');
      });

    return () => {
      ignore = true;
    };
  }, [params.id]);

  if (error) return <div className="max-w-4xl mx-auto px-4 py-12 text-sm text-danger">{error}</div>;
  if (!program) return <div className="max-w-4xl mx-auto px-4 py-12 text-sm text-gray-400">Memuat...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-4 text-primary dark:text-primary-light">{program.nama}</h1>
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6 whitespace-pre-line">
        {program.deskripsi}
      </p>
      <p className="text-sm font-medium mb-8">Anggaran: Rp {program.anggaran.toLocaleString('id-ID')}</p>

      {program.photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {program.photos.map((photo) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={photo.id} src={photo.fileUrl} alt={photo.caption ?? program.nama} className="rounded-lg w-full h-40 object-cover" />
          ))}
        </div>
      )}
    </div>
  );
}
