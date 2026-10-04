// // 'use client';

// // import { useEffect, useState } from 'react';
// // import { useParams } from 'next/navigation';

// // interface ProgramDetail {
// //   nama: string;
// //   deskripsi: string;
// //   anggaran: number;
// //   photos: { id: string; fileUrl: string; caption: string | null }[];
// // }

// // export default function ProgramDetailPage() {
// //   const params = useParams<{ id: string }>();
// //   const [program, setProgram] = useState<ProgramDetail | null>(null);
// //   const [error, setError] = useState('');

// //   useEffect(() => {
// //     let ignore = false;

// //     fetch(`/api/programs/${params.id}`)
// //       .then(async (res) => {
// //         const json = await res.json();
// //         if (!res.ok || !json.success) throw new Error(json.message ?? 'Program tidak ditemukan.');
// //         return json;
// //       })
// //       .then((json) => {
// //         if (!ignore) setProgram(json.data);
// //       })
// //       .catch((err) => {
// //         if (!ignore) setError(err instanceof Error ? err.message : 'Program tidak ditemukan.');
// //       });

// //     return () => {
// //       ignore = true;
// //     };
// //   }, [params.id]);

// //   if (error) return <div className="max-w-4xl mx-auto px-4 py-12 text-sm text-danger">{error}</div>;
// //   if (!program) return <div className="max-w-4xl mx-auto px-4 py-12 text-sm text-gray-400">Memuat...</div>;

// //   return (
// //     <div className="max-w-4xl mx-auto px-4 py-12">
// //       <h1 className="text-2xl font-semibold mb-4 text-primary dark:text-primary-light">{program.nama}</h1>
// //       <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6 whitespace-pre-line">
// //         {program.deskripsi}
// //       </p>
// //       <p className="text-sm font-medium mb-8">Anggaran: Rp {program.anggaran.toLocaleString('id-ID')}</p>

// //       {program.photos.length > 0 && (
// //         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
// //           {program.photos.map((photo) => (
// //             // eslint-disable-next-line @next/next/no-img-element
// //             <img key={photo.id} src={photo.fileUrl} alt={photo.caption ?? program.nama} className="rounded-lg w-full h-40 object-cover" />
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }


// // Kode Baru
// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation';
// import Link from 'next/link';
// import { Skeleton } from '@/components/ui/Skeleton';
// import { EmptyState } from '@/components/ui/EmptyState';
// import { Badge } from '@/components/ui/Badge';

// interface ProgramDetail {
//   nama: string;
//   deskripsi: string;
//   anggaran: number;
//   status: string;
//   photos: { id: string; fileUrl: string; caption: string | null }[];
// }

// export default function ProgramDetailPage() {
//   const params = useParams<{ id: string }>();
//   const [program, setProgram] = useState<ProgramDetail | null>(null);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let ignore = false;
//     setLoading(true);
//     setError('');

//     fetch(`/api/programs/${params.id}`)
//       .then(async (res) => {
//         const json = await res.json();
//         if (!res.ok || !json.success) throw new Error(json.message ?? 'Program tidak ditemukan.');
//         return json;
//       })
//       .then((json) => {
//         if (!ignore) setProgram(json.data);
//       })
//       .catch((err) => {
//         if (!ignore) setError(err instanceof Error ? err.message : 'Program tidak ditemukan.');
//       })
//       .finally(() => {
//         if (!ignore) setLoading(false);
//       });

//     return () => {
//       ignore = true;
//     };
//   }, [params.id]);

//   const mainPhoto = program?.photos[0];
//   const galleryPhotos = program?.photos.slice(1) ?? [];

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
//       {/* BREADCRUMB */}
//       <nav className="text-xs text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-1.5 flex-wrap" aria-label="Breadcrumb">
//         <Link href="/" className="hover:text-primary dark:hover:text-primary-light">
//           Beranda
//         </Link>
//         <span aria-hidden="true">/</span>
//         <Link href="/program" className="hover:text-primary dark:hover:text-primary-light">
//           Program
//         </Link>
//         <span aria-hidden="true">/</span>
//         <span className="text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
//           {loading ? '...' : program?.nama ?? 'Tidak ditemukan'}
//         </span>
//       </nav>

//       {error ? (
//         <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-8 text-center">
//           <p className="text-sm text-danger mb-3">{error}</p>
//           <Link href="/program" className="text-sm text-primary dark:text-primary-light hover:underline">
//             &larr; Kembali ke daftar program
//           </Link>
//         </div>
//       ) : loading ? (
//         <div className="grid md:grid-cols-2 gap-8">
//           <Skeleton className="h-64 md:h-80 w-full rounded-xl" />
//           <div className="space-y-3 pt-1">
//             <Skeleton className="h-5 w-20" />
//             <Skeleton className="h-7 w-3/4" />
//             <Skeleton className="h-4 w-full" />
//             <Skeleton className="h-4 w-full" />
//             <Skeleton className="h-4 w-2/3" />
//           </div>
//         </div>
//       ) : program ? (
//         <>
//           {/* HERO */}
//           <section className="grid md:grid-cols-2 gap-8 items-start mb-12">
//             <div>
//               {mainPhoto ? (
//                 // eslint-disable-next-line @next/next/no-img-element
//                 <img
//                   src={mainPhoto.fileUrl}
//                   alt={mainPhoto.caption ?? program.nama}
//                   className="w-full h-64 md:h-80 object-cover rounded-xl border border-gray-200 dark:border-gray-800"
//                 />
//               ) : (
//                 <div className="w-full h-64 md:h-80 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center text-sm text-gray-400">
//                   Belum ada foto
//                 </div>
//               )}
//             </div>

//             <div>
//               <Badge
//                 status="published"
//                 labels={{ published: 'Program Aktif' }}
//                 colors={{ published: 'bg-green-100 text-green-800' }}
//               />
//               <h1 className="text-2xl md:text-3xl font-semibold text-primary dark:text-primary-light mt-3 mb-3">
//                 {program.nama}
//               </h1>
//               <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-5 line-clamp-4">
//                 {program.deskripsi}
//               </p>
//               <dl className="text-sm">
//                 <dt className="text-gray-500 dark:text-gray-400">Anggaran Program</dt>
//                 <dd className="text-lg font-semibold text-gray-800 dark:text-gray-100">
//                   Rp {program.anggaran.toLocaleString('id-ID')}
//                 </dd>
//               </dl>
//             </div>
//           </section>

//           {/* DESKRIPSI PROGRAM */}
//           <section className="mb-12">
//             <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Deskripsi Program</h2>
//             {program.deskripsi
//               .split('\n')
//               .filter((para) => para.trim().length > 0)
//               .map((para, i) => (
//                 <p key={i} className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-4 last:mb-0">
//                   {para}
//                 </p>
//               ))}
//           </section>

//           {/* GALERI PROGRAM */}
//           <section className="mb-12">
//             <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Galeri Program</h2>
//             {galleryPhotos.length === 0 ? (
//               <EmptyState
//                 title="Belum ada foto tambahan"
//                 description="Foto dokumentasi lain untuk program ini akan tampil di sini."
//               />
//             ) : (
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                 {galleryPhotos.map((photo) => (
//                   <figure key={photo.id} className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
//                     {/* eslint-disable-next-line @next/next/no-img-element */}
//                     <img
//                       src={photo.fileUrl}
//                       alt={photo.caption ?? program.nama}
//                       className="w-full aspect-[4/3] object-cover"
//                     />
//                     {photo.caption && (
//                       <figcaption className="text-xs text-gray-500 dark:text-gray-400 px-3 py-2">
//                         {photo.caption}
//                       </figcaption>
//                     )}
//                   </figure>
//                 ))}
//               </div>
//             )}
//           </section>
//         </>



//       ) : null}
//     </div>
//   );
// }

// Kode Baru

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AddProgramSpeciesDataModal } from '@/components/features/AddProgramSpeciesDataModal';
import { ProgramSpeciesDataCellModal } from '@/components/features/ProgramSpeciesDataCellModal';
import { ProgramCalculationSection } from '@/components/features/ProgramCalculationSection';
import { ProgramRecapSection } from '@/components/features/ProgramRecapSection';

interface ProgramDetail {
  nama: string;
  deskripsi: string;
  anggaran: number;
  status: string;
  photos: { id: string; fileUrl: string; caption: string | null }[];
}

interface BiodiversityPeriod {
  id: string;
  tahun: number;
  label: string | null;
}

interface BiodiversitySpeciesRow {
  speciesId: string;
  namaLokal: string;
  namaIlmiah: string;
  jenis: string;
  byPeriod: Record<
    string,
    { dataId: string; jumlahIndividu: number; pi: number; lnPi: number; hValue: number } | undefined
  >;
}

interface BiodiversityData {
  periods: BiodiversityPeriod[];
  species: BiodiversitySpeciesRow[];
  totals: Record<string, { totalIndividu: number; totalH: number }>;
}

const SATUAN_BY_JENIS: Record<string, string> = { flora: 'Batang', fauna: 'Ekor' };

export default function ProgramDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: session } = useSession();
  const role = (session?.user as { role?: string } | undefined)?.role ?? '';
  const isAdmin = role === 'admin' || role === 'super_admin';

  const [program, setProgram] = useState<ProgramDetail | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [biodiversity, setBiodiversity] = useState<BiodiversityData | null>(null);
  const [supportingData, setSupportingData] = useState<any[]>([]);
  const [supportingDataLoading, setSupportingDataLoading] = useState(false);
  const [biodiversityLoading, setBiodiversityLoading] = useState(true);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [cellTarget, setCellTarget] = useState<{
    dataId: string;
    namaLokal: string;
    namaIlmiah: string;
    periodeLabel: string;
    jumlahIndividu: number;
  } | null>(null);

  const loadProgram = useCallback(() => {
    let ignore = false;
    setLoading(true);
    setError('');

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
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [params.id]);

  const loadBiodiversity = useCallback(() => {
  setBiodiversityLoading(true);

  fetch(`/api/programs/${params.id}/biodiversity`)
    .then((res) => res.json())
    .then((json) => {
      console.log('Biodiversity response:', json);

      if (json.success) {
        setBiodiversity(json.data);
      }
    })
    .catch((err) => {
      console.error('Gagal memuat biodiversity:', err);
    })
    .finally(() => setBiodiversityLoading(false));
}, [params.id]);

 const loadSupportingData = useCallback(() => {
  setSupportingDataLoading(true);

  fetch(`/api/programs/${params.id}/supporting-data`)
    .then((res) => res.json())
    .then((json) => {
      console.log('HASIL DATA PENDUKUNG:', json);

      if (json.success) {
        setSupportingData(json.data ?? []);
      }
    })
    .catch((error) => {
      console.error('ERROR DATA PENDUKUNG:', error);
      setSupportingData([]);
    })
    .finally(() => {
      setSupportingDataLoading(false);
    });
}, [params.id]);
 useEffect(() => {
  const cleanup = loadProgram();

  loadBiodiversity();
  loadSupportingData();

  return cleanup;
}, [loadProgram, loadBiodiversity, loadSupportingData]);

  const mainPhoto = program?.photos[0];
  const galleryPhotos = program?.photos.slice(1) ?? [];

  function openCell(species: BiodiversitySpeciesRow, period: BiodiversityPeriod) {
    const cell = species.byPeriod[period.id];
    if (!cell) return;
    setCellTarget({
      dataId: cell.dataId,
      namaLokal: species.namaLokal,
      namaIlmiah: species.namaIlmiah,
      periodeLabel: period.label ?? String(period.tahun),
      jumlahIndividu: cell.jumlahIndividu,
    });
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      {/* BREADCRUMB */}
      <nav className="text-xs text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-1.5 flex-wrap" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary dark:hover:text-primary-light">
          Beranda
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/program" className="hover:text-primary dark:hover:text-primary-light">
          Program
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
          {loading ? '...' : program?.nama ?? 'Tidak ditemukan'}
        </span>
      </nav>

      {error ? (
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-8 text-center">
          <p className="text-sm text-danger mb-3">{error}</p>
          <Link href="/program" className="text-sm text-primary dark:text-primary-light hover:underline">
            &larr; Kembali ke daftar program
          </Link>
        </div>
      ) : loading ? (
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="h-64 md:h-80 w-full rounded-xl" />
          <div className="space-y-3 pt-1">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ) : program ? (
        <>
          {/* HERO */}
          <section className="grid md:grid-cols-2 gap-8 items-start mb-12">
            <div>
              {mainPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mainPhoto.fileUrl}
                  alt={mainPhoto.caption ?? program.nama}
                  className="w-full h-64 md:h-80 object-cover rounded-xl border border-gray-200 dark:border-gray-800"
                />
              ) : (
                <div className="w-full h-64 md:h-80 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center text-sm text-gray-400">
                  Belum ada foto
                </div>
              )}
            </div>

            <div>
              <Badge
                status="published"
                labels={{ published: 'Program Aktif' }}
                colors={{ published: 'bg-green-100 text-green-800' }}
              />
              <h1 className="text-2xl md:text-3xl font-semibold text-primary dark:text-primary-light mt-3 mb-3">
                {program.nama}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-5 line-clamp-4">
                {program.deskripsi}
              </p>
              <dl className="text-sm">
                <dt className="text-gray-500 dark:text-gray-400">Anggaran Program</dt>
                <dd className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Rp {program.anggaran.toLocaleString('id-ID')}
                </dd>
              </dl>
            </div>
          </section>

          {/* DESKRIPSI PROGRAM */}
          <section className="mb-12">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Deskripsi Program</h2>
            {program.deskripsi
              .split('\n')
              .filter((para) => para.trim().length > 0)
              .map((para, i) => (
                <p key={i} className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-4 last:mb-0">
                  {para}
                </p>
              ))}
          </section>

         {/* DATA PENDUKUNG */}
<section className="mb-12">
  <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
      Data Pendukung ({supportingData.length})
    </h2>

    {isAdmin && (
      <Button
        onClick={() => setAddModalOpen(true)}
        className="text-sm"
      >
        Tambah Data
      </Button>
    )}
  </div>

  {supportingDataLoading ? (
    <Skeleton className="h-40 w-full" />
  ) : supportingData.length === 0 ? (
    <EmptyState
      title="Belum ada data pendukung"
      description={
        isAdmin
          ? 'Tambahkan Data Pendukung melalui tombol "Tambah Data" di atas.'
          : 'Data pendukung untuk program ini belum tersedia.'
      }
    />
  ) : (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
      <table className="w-full text-sm min-w-[700px]">
        <thead>
          <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
            <th className="py-3 px-3">No</th>
            <th className="py-3 px-3">Nama Daerah</th>
            <th className="py-3 px-3 text-right">2022</th>
            <th className="py-3 px-3 text-right">2023</th>
            <th className="py-3 px-3 text-right">2024</th>
            <th className="py-3 px-3 text-right">2025</th>
            <th className="py-3 px-3 text-right">2026</th>
          </tr>
        </thead>

        <tbody>
          {supportingData.map((item, index) => (
            <tr
              key={item.id}
              className="border-b border-gray-100 dark:border-gray-900"
            >
              <td className="py-3 px-3">
                {index + 1}
              </td>

              <td className="py-3 px-3 font-medium">
                {item.namaDaerah}
              </td>

              <td className="py-3 px-3 text-right">
                {item.jumlah2022}
              </td>

              <td className="py-3 px-3 text-right">
                {item.jumlah2023}
              </td>

              <td className="py-3 px-3 text-right">
                {item.jumlah2024}
              </td>

              <td className="py-3 px-3 text-right">
                {item.jumlah2025}
              </td>

              <td className="py-3 px-3 text-right">
                {item.jumlah2026}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</section>

           {/* BUKTI PERHITUNGAN */}
          <section className="mb-12">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Bukti Perhitungan</h2>
            <ProgramCalculationSection biodiversity={biodiversity} />
          </section>

          {/* REKAPITULASI INDEKS */}
          <section className="mb-12">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Rekapitulasi Indeks Keanekaragaman
            </h2>
            <ProgramRecapSection biodiversity={biodiversity} />
          </section>

          {isAdmin && (
            <>
              <AddProgramSpeciesDataModal
              open={addModalOpen}
              onClose={() => setAddModalOpen(false)}
              programId={params.id}
              onSuccess={() => {
                loadBiodiversity();
                loadSupportingData();
              }}
            />
             <ProgramSpeciesDataCellModal
                open={!!cellTarget}
                onClose={() => setCellTarget(null)}
                target={cellTarget}
                programId={params.id}
                onSuccess={loadBiodiversity}
              />
            </>
          )}
        </>
      ) : null}
    </div>
  );
}