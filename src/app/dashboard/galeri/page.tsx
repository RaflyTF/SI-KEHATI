// // 'use client';

// // import { useEffect, useState } from 'react';
// // import { Card } from '@/components/ui/Card';
// // import { Skeleton } from '@/components/ui/Skeleton';
// // import { Button } from '@/components/ui/Button';
// // import { GalleryUploadForm } from '@/components/forms/GalleryUploadForm';
// // import { useToast } from '@/components/providers/ToastProvider';

// // interface GalleryItem {
// //   id: string;
// //   judul: string;
// //   fileUrl: string;
// //   category: { namaKategori: string };
// // }

// // export default function GaleriManagementPage() {
// //   const [items, setItems] = useState<GalleryItem[]>([]);
// //   const [error, setError] = useState('');
// //   const [loading, setLoading] = useState(true);
// //   const toast = useToast();

// //   function load() {
// //     setLoading(true);
// //     fetch('/api/gallery')
// //       .then(async (res) => {
// //         const json = await res.json();
// //         if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal memuat galeri.');
// //         return json;
// //       })
// //       .then((json) => {
// //         setError('');
// //         setItems(json.data ?? []);
// //       })
// //       .catch((err) => setError(err instanceof Error ? err.message : 'Gagal memuat galeri.'))
// //       .finally(() => setLoading(false));
// //   }

// //   useEffect(() => {
// //     load();
// //   }, []);

// //   async function remove(id: string, judulFoto: string) {
// //     if (!confirm(`Hapus foto "${judulFoto}"?`)) return;
// //     try {
// //       const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
// //       const json = await res.json();
// //       if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal menghapus foto.');
// //       toast.success(`Foto "${judulFoto}" berhasil dihapus.`);
// //       load();
// //     } catch (err) {
// //       const message = err instanceof Error ? err.message : 'Gagal menghapus foto.';
// //       setError(message);
// //       toast.error(message);
// //     }
// //   }

// //   return (
// //     <div className="space-y-6">
// //       <h1 className="text-xl font-semibold">Kelola Galeri</h1>

// //       <Card className="max-w-xl">
// //         <h2 className="text-sm font-medium mb-4">Tambah Foto</h2>
// //         <GalleryUploadForm onSuccess={load} />
// //       </Card>

// //       <Card>
// //         <h2 className="text-sm font-medium mb-4">Daftar Foto</h2>
// //         {error && <p className="text-sm text-danger mb-3">{error}</p>}
// //         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
// //           {loading &&
// //             Array.from({ length: 4 }).map((_, i) => (
// //               <div key={i} className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
// //                 <Skeleton className="w-full h-28 rounded-none" />
// //                 <div className="p-2 space-y-2">
// //                   <Skeleton className="h-3 w-3/4" />
// //                   <Skeleton className="h-3 w-1/2" />
// //                 </div>
// //               </div>
// //             ))}
// //           {!loading && items.map((item) => (
// //             <div key={item.id} className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
// //               {/* eslint-disable-next-line @next/next/no-img-element */}
// //               <img src={item.fileUrl} alt={item.judul} className="w-full h-28 object-cover" />
// //               <div className="p-2">
// //                 <p className="text-xs font-medium truncate">{item.judul}</p>
// //                 <p className="text-xs text-gray-400">{item.category.namaKategori}</p>
// //                 <Button variant="danger" className="mt-2 w-full text-xs py-1" onClick={() => remove(item.id, item.judul)}>
// //                   Hapus
// //                 </Button>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       </Card>
// //     </div>
// //   );
// // }


// // Kode Baru

// 'use client';

// import { useEffect, useState } from 'react';
// import { Card } from '@/components/ui/Card';
// import { Button } from '@/components/ui/Button';
// import { Skeleton } from '@/components/ui/Skeleton';
// import { EmptyState } from '@/components/ui/EmptyState';
// import { GalleryUploadForm } from '@/components/forms/GalleryUploadForm';
// import { useToast } from '@/components/providers/ToastProvider';

// interface GalleryItem {
//   id: string;
//   judul: string;
//   fileUrl: string;
//   category: { namaKategori: string };
// }

// export default function GaleriManagementPage() {
//   const [items, setItems] = useState<GalleryItem[]>([]);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const toast = useToast();

//   function load() {
//     setLoading(true);
//     fetch('/api/gallery')
//       .then(async (res) => {
//         const json = await res.json();
//         if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal memuat galeri.');
//         return json;
//       })
//       .then((json) => {
//         setError('');
//         setItems(json.data ?? []);
//       })
//       .catch((err) => setError(err instanceof Error ? err.message : 'Gagal memuat galeri.'))
//       .finally(() => setLoading(false));
//   }

//   useEffect(() => {
//     load();
//   }, []);

//   async function remove(id: string, judulFoto: string) {
//     if (!confirm(`Hapus foto "${judulFoto}"?`)) return;
//     try {
//       const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
//       const json = await res.json();
//       if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal menghapus foto.');
//       toast.success(`Foto "${judulFoto}" berhasil dihapus.`);
//       load();
//     } catch (err) {
//       const message = err instanceof Error ? err.message : 'Gagal menghapus foto.';
//       setError(message);
//       toast.error(message);
//     }
//   }

//   return (
//     <div className="space-y-4 md:space-y-6">
//       <h1 className="text-lg md:text-xl font-semibold">Kelola Galeri</h1>

//       <Card className="max-w-xl" padding="p-4 md:p-5">
//         <h2 className="text-sm font-medium mb-4">Tambah Foto</h2>
//         <GalleryUploadForm onSuccess={load} />
//       </Card>

//       <Card padding="p-4 md:p-5">
//         <h2 className="text-sm font-medium mb-4">Daftar Foto</h2>
//         {error && <p className="text-sm text-danger mb-3">{error}</p>}
//         {!loading && items.length === 0 ? (
//           <EmptyState title="Belum ada foto" description="Unggah foto pertama lewat form di atas." />
//         ) : (
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
//             {loading &&
//               Array.from({ length: 4 }).map((_, i) => (
//                 <div key={i} className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
//                   <Skeleton className="w-full h-28 rounded-none" />
//                   <div className="p-2 space-y-2">
//                     <Skeleton className="h-3 w-3/4" />
//                     <Skeleton className="h-3 w-1/2" />
//                   </div>
//                 </div>
//               ))}
//             {!loading && items.map((item) => (
//               <div key={item.id} className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
//                 {/* eslint-disable-next-line @next/next/no-img-element */}
//                 <img src={item.fileUrl} alt={item.judul} className="w-full h-28 object-cover" />
//                 <div className="p-2">
//                   <p className="text-xs font-medium truncate">{item.judul}</p>
//                   <p className="text-xs text-gray-400">{item.category.namaKategori}</p>
//                   <Button variant="danger" className="mt-2 w-full text-xs py-1" onClick={() => remove(item.id, item.judul)}>
//                     Hapus
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </Card>
//     </div>
//   );
// }

// Kode Baru

'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { GalleryUploadForm } from '@/components/forms/GalleryUploadForm';
import { useToast } from '@/components/providers/ToastProvider';

interface GalleryItem {
  id: string;
  judul: string;
  fileUrl: string;
  createdAt: string;
  category: { id: string; namaKategori: string };
  uploader: { nama: string } | null;
}

interface Category {
  id: string;
  namaKategori: string;
}

const PAGE_SIZE = 8;

export default function GaleriManagementPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [editTarget, setEditTarget] = useState<GalleryItem | null>(null);
  const [previewTarget, setPreviewTarget] = useState<GalleryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Debounce input pencarian 400ms -- supaya tidak fetch API di setiap ketukan
  // keyboard, tapi tetap terasa "search-as-you-type".
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    fetch('/api/gallery-categories')
      .then((r) => r.json())
      .then((r) => setCategories(r.data ?? []))
      .catch(() => {});
  }, []);

  function load() {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) });
    if (search) params.set('search', search);
    if (categoryFilter) params.set('category', categoryFilter);

    fetch(`/api/gallery?${params.toString()}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal memuat galeri.');
        return json;
      })
      .then((json) => {
        setError('');
        setItems(json.data ?? []);
        setTotalPages(json.meta?.totalPages ?? 1);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Gagal memuat galeri.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, categoryFilter, page]);

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/gallery/${deleteTarget.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message ?? 'Gagal menghapus foto.');
      toast.success(`Foto "${deleteTarget.judul}" berhasil dihapus.`);
      setDeleteTarget(null);
      load();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal menghapus foto.';
      setError(message);
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-lg md:text-xl font-semibold">Kelola Galeri</h1>

      <Card className="max-w-xl" padding="p-4 md:p-5">
        <h2 className="text-sm font-medium mb-4">Tambah Foto</h2>
        <GalleryUploadForm onSuccess={load} />
      </Card>

      <Card padding="p-4 md:p-5">
        <div className="flex flex-col sm:flex-row sm:items-end gap-3 mb-4">
          <div className="flex-1">
            <Input
              label="Cari judul foto"
              placeholder="Ketik untuk mencari..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <div className="sm:w-56">
            <Select
              label="Filter kategori"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Semua kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.namaKategori}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <h2 className="text-sm font-medium mb-4">
          Daftar Foto {!loading && <span className="text-gray-400 font-normal">({items.length} dari halaman ini)</span>}
        </h2>
        {error && <p className="text-sm text-danger mb-3">{error}</p>}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
                <Skeleton className="w-full h-28 rounded-none" />
                <div className="p-2 space-y-2">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            title="Tidak ada foto ditemukan"
            description={search || categoryFilter ? 'Coba ubah kata kunci atau filter kategori.' : 'Unggah foto pertama lewat form di atas.'}
          />
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {items.map((item) => (
                <div key={item.id} className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() => setPreviewTarget(item)}
                    className="block w-full group overflow-hidden"
                    aria-label={`Pratinjau ${item.judul}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.fileUrl}
                      alt={item.judul}
                      className="w-full h-28 object-cover transition-transform duration-300 ease-out group-hover:scale-110"
                    />
                  </button>
                  <div className="p-2">
                    <p className="text-xs font-medium truncate">{item.judul}</p>
                    <p className="text-xs text-gray-400 truncate">{item.category.namaKategori}</p>
                    <div className="flex gap-1 mt-2">
                      <Button
                        variant="secondary"
                        className="flex-1 text-xs py-1"
                        onClick={() => setEditTarget(item)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        className="flex-1 text-xs py-1"
                        onClick={() => setDeleteTarget(item)}
                      >
                        Hapus
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-6">
                <Button
                  variant="secondary"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Sebelumnya
                </Button>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Halaman {page} dari {totalPages}
                </span>
                <Button
                  variant="secondary"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Berikutnya
                </Button>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Modal Edit */}
      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title={`Edit Foto: ${editTarget?.judul ?? ''}`}>
        {editTarget && (
          <GalleryUploadForm
            mode="edit"
            itemId={editTarget.id}
            initialValues={{ judul: editTarget.judul, fileUrl: editTarget.fileUrl, categoryId: editTarget.category.id }}
            onCancel={() => setEditTarget(null)}
            onSuccess={() => {
              setEditTarget(null);
              load();
            }}
          />
        )}
      </Modal>

      {/* Modal Preview */}
      <Modal open={!!previewTarget} onClose={() => setPreviewTarget(null)} title={previewTarget?.judul ?? 'Pratinjau Foto'}>
        {previewTarget && (
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewTarget.fileUrl}
              alt={previewTarget.judul}
              className="w-full max-h-[60vh] object-contain rounded-lg mb-3"
            />
            <dl className="text-sm space-y-1">
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Kategori</dt>
                <dd className="text-gray-800 dark:text-gray-200">{previewTarget.category.namaKategori}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Diunggah oleh</dt>
                <dd className="text-gray-800 dark:text-gray-200">{previewTarget.uploader?.nama ?? '-'}</dd>
              </div>
            </dl>
          </div>
        )}
      </Modal>

      {/* Dialog Konfirmasi Hapus */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Hapus Foto?"
        description={`Apakah Anda yakin ingin menghapus foto "${deleteTarget?.judul}"?`}
        details={
          deleteTarget
            ? [
                { label: 'Judul', value: deleteTarget.judul },
                { label: 'Kategori', value: deleteTarget.category.namaKategori },
                { label: 'Diunggah oleh', value: deleteTarget.uploader?.nama ?? '-' },
                {
                  label: 'Tanggal unggah',
                  value: new Date(deleteTarget.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  }),
                },
              ]
            : []
        }
      />
    </div>
  );
}