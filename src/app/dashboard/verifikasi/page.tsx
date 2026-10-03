// 'use client';

// import { useEffect, useState } from 'react';
// import { Card } from '@/components/ui/Card';
// import { Skeleton } from '@/components/ui/Skeleton';
// import { VerificationQueueTable } from '@/components/features/VerificationQueueTable';

// export default function VerifikasiPage() {
//   const [data, setData] = useState([]);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);

//   function load() {
//     setLoading(true);
//     fetch('/api/species-records?status=pending')
//       .then(async (res) => {
//         const json = await res.json();
//         if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal memuat data verifikasi.');
//         return json;
//       })
//       .then((json) => {
//         setError('');
//         setData(json.data ?? []);
//       })
//       .catch((err) => setError(err instanceof Error ? err.message : 'Gagal memuat data verifikasi.'))
//       .finally(() => setLoading(false));
//   }

//   useEffect(() => {
//     load();
//   }, []);

//   return (
//     <div className="space-y-6">
//       <h1 className="text-xl font-semibold">Verifikasi Data Monitoring</h1>
//       {error && <p className="text-sm text-danger">{error}</p>}
//       <Card>
//         {loading ? (
//           <div className="space-y-3">
//             <Skeleton className="h-10 w-full" />
//             <Skeleton className="h-10 w-full" />
//             <Skeleton className="h-10 w-full" />
//           </div>
//         ) : (
//           <VerificationQueueTable data={data} onChanged={load} />
//         )}
//       </Card>
//     </div>
//   );
// }

// Kode Baru

'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { VerificationQueueTable } from '@/components/features/VerificationQueueTable';

export default function VerifikasiPage() {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    fetch('/api/species-records?status=pending')
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal memuat data verifikasi.');
        return json;
      })
      .then((json) => {
        setError('');
        setData(json.data ?? []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Gagal memuat data verifikasi.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-lg md:text-xl font-semibold">Verifikasi Data Monitoring</h1>
      {error && <p className="text-sm text-danger">{error}</p>}
      <Card padding="p-4 md:p-5">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <VerificationQueueTable data={data} onChanged={load} />
        )}
      </Card>
    </div>
  );
}