'use client';

import { Skeleton } from '@/components/ui/Skeleton';
import { useEffect, useState } from 'react';

interface GalleryItem {
  id: string;
  judul: string;
  fileUrl: string;
  category: {
    namaKategori: string;
  };
}

interface ProgramItem {
  id: string;
  nama: string;
  deskripsi: string;
  anggaran: number;
}

export default function BerandaPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [programs, setPrograms] = useState<ProgramItem[]>([]);

  const [loadingGallery, setLoadingGallery] = useState(true);
  const [loadingPrograms, setLoadingPrograms] = useState(true);

  useEffect(() => {
    let ignore = false;

    /* =========================
       DATA GALERI
    ========================= */

    fetch('/api/gallery')
      .then(async (res) => {
        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error('Gagal memuat galeri.');
        }

        return json;
      })
      .then((json) => {
        if (!ignore) {
          setGallery(json.data ?? []);
        }
      })
      .catch(() => {
        if (!ignore) {
          setGallery([]);
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoadingGallery(false);
        }
      });

    /* =========================
       DATA PROGRAM
    ========================= */

    fetch('/api/programs')
      .then(async (res) => {
        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error('Gagal memuat program.');
        }

        return json;
      })
      .then((json) => {
        if (!ignore) {
          setPrograms(json.data ?? []);
        }
      })
      .catch(() => {
        if (!ignore) {
          setPrograms([]);
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoadingPrograms(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        className="relative h-[900px] md:h-[700px] flex items-center justify-center bg-cover bg-center text-white"
        style={{
          backgroundImage: "url('/background-kehati.png')",
        }}
      >

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Isi Hero */}
        <div className="absolute inset-0 flex items-center justify-center">

          <div className="w-full max-w-5xl px-6 text-center animasi-dari-dalam">

            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Keanekaragaman Hayati
            </h1>

            <p className="text-xl md:text-2xl italic mb-3">
              &ldquo;Hijau Alamku, Lestari Bumiku&rdquo;
            </p>

            <p className="text-base md:text-lg">
              PT PLN Indonesia Power Unit Pembangkitan PLTD/G Tello
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          GAMBARAN UMUM
      ===================================================== */}

      <section className="grid md:grid-cols-2">

        {/* Bagian kiri: foto + latar hijau */}

        <div className="relative overflow-hidden bg-[#165823] flex items-center justify-center px-8 py-12 md:px-10">

          {/* Ornamen */}
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-[#2B7438]/40"></div>

          <div className="absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-[#0F471C]/50"></div>


          {/* Foto */}

          <div className="relative z-10 w-full max-w-xl">

            <div className="overflow-hidden rounded-2xl border-4 border-white/20 bg-[#D5E8C2] shadow-2xl">

              <img
                src="/foto kawasan pltd.jpeg"
                alt="Foto kawasan PLTD/G Tello"
                className="h-64 w-full object-cover transition duration-500 hover:scale-105"
              />

            </div>

            <p className="mt-4 text-center text-sm text-green-100/80">
              Kawasan PLTD/G Tello
            </p>

          </div>

        </div>


        {/* Bagian kanan: Gambaran Umum */}

        <div className="bg-white dark:bg-gray-950 px-8 py-12 md:px-12 lg:px-14">

          <div className="max-w-xl">

            {/* Judul */}

            <div className="mb-6">

              <h2 className="text-3xl font-bold text-green-700 dark:text-green-500">
                Gambaran Umum
              </h2>

              <div className="mt-3 h-1 w-12 rounded-full bg-green-700"></div>

            </div>


            {/* Isi */}

            <div className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">

              <p className="mb-4">
                PT PLN Indonesia Power Unit PLTD/G Tello hadir sebagai pembangkit listrik
                yang bertujuan untuk memenuhi kebutuhan energi di Provinsi Sulawesi Selatan.
              </p>

              <p className="mb-4">
                Fasilitas ini mencakup PLTG dan PLTD dengan kapasitas eksisting masing-masing
                <span className="font-semibold text-green-700">
                  {" "}122.716 KW
                </span>{" "}
                dan
                <span className="font-semibold text-green-700">
                  {" "}49.992 KW.
                </span>
              </p>

              <p className="mb-4">
                PT PLN Indonesia Power Unit PLTD/G Tello berkomitmen untuk melakukan
                identifikasi dampak lingkungan pada sumber dampak dengan melakukan pembukaan
                dan pembersihan lahan terhadap gangguan komunitas flora dan fauna serta
                kegiatan monitoring berdasarkan UU Nomor 5 Tahun 1990 tentang Konservasi
                Sumber Daya Alam Hayati dan Ekosistemnya.
              </p>

              <p className="mb-4">
                Melalui kegiatan monitoring ini, diharapkan dapat mengidentifikasi kondisi
                aktual keanekaragaman hayati flora dan fauna di dalam dan luar kawasan
                unit PLTD/G Tello.
              </p>

              <p>
                Monitoring flora dan fauna juga akan memberikan gambaran aktual tentang
                lingkungan dan keanekaragaman hayati di wilayah tersebut. Hasil monitoring
                ini akan menjadi dasar evaluasi terhadap kondisi keanekaragaman hayati
                sebelumnya, sehingga dapat memberikan rekomendasi terkait pengelolaan dan
                pembinaan habitat flora dan fauna di kawasan PLTD/G Tello.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          STATUS FLORA & FAUNA
      ===================================================== */}

      <section className="bg-white px-6 py-16 dark:bg-gray-950">

        <div className="mx-auto max-w-7xl">

          <div className="max-w-3xl">

            {/* Judul */}

            <div className="mb-6">

              <h2 className="text-3xl font-bold text-green-800 dark:text-green-400">
                Status Flora & Fauna
              </h2>

              <div className="mt-3 h-1 w-12 rounded-full bg-green-700"></div>

            </div>


            {/* Deskripsi */}

            <p className="text-sm leading-7 text-gray-600 dark:text-gray-300">
              PT PLN Indonesia Power Unit Pembangkitan PLTD/G Tello
              melakukan monitoring flora dan fauna yang berada di area
              PLTD/G Tello setiap 6 bulan sekali.
            </p>

            <p className="mt-4 text-sm leading-7 text-gray-600 dark:text-gray-300">
              Monitoring rutin dilakukan untuk mengetahui perkembangan
              keanekaragaman hayati serta menjadi dasar evaluasi
              pengelolaan lingkungan di kawasan PLTD/G Tello.
            </p>


            {/* Tombol */}

            <a
              href="/status-flora-fauna"
              className="mt-6 inline-block rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
            >
              Lihat Data Flora & Fauna →
            </a>

          </div>

        </div>

      </section>


      {/* =====================================================
          PROGRAM KONSERVASI
      ===================================================== */}

      <section className="bg-green-50 px-6 py-16 dark:bg-gray-950">

        <div className="mx-auto max-w-7xl">

          {/* Header */}

          <div className="mb-10">

            <p className="text-sm font-semibold tracking-wide text-green-700 dark:text-green-400">
              PROGRAM
            </p>

            <div className="mt-2 h-1 w-10 rounded-full bg-green-700"></div>

            <h2 className="mt-4 text-3xl font-bold text-green-800 dark:text-green-400">
              Program Konservasi
            </h2>
         
            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600 dark:text-gray-300">
              Berbagai program konservasi dan pemberdayaan yang dilakukan
              untuk menjaga keanekaragaman hayati serta mendukung
              keberlanjutan lingkungan.
            </p>
           <a
              href="/program"
              className="text-sm font-semibold text-green-700 hover:text-green-800 dark:text-green-400"
            >
              Lihat Semua Program →
            </a>
          </div>


          {/* Loading */}

          {loadingPrograms ? (

            <div className="grid gap-5 md:grid-cols-3">

              {Array.from({ length: 3 }).map((_, i) => (

                <div
                  key={i}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                >

                  <Skeleton className="h-5 w-3/4" />

                  <Skeleton className="mt-4 h-4 w-full" />

                  <Skeleton className="mt-2 h-4 w-5/6" />

                  <Skeleton className="mt-5 h-4 w-24" />

                </div>

              ))}

            </div>

          ) : (

            /* Data Program */

            <div className="grid gap-5 md:grid-cols-3">

              {programs.slice(0, 3).map((program) => (

                <a
                  key={program.id}
                  href={`/program/${program.id}`}
                  className="group rounded-2xl border border-green-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-green-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                >

                  <div className="mb-5 flex items-center justify-between">

                    <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                      PROGRAM
                    </span>

                    <span className="h-2 w-2 rounded-full bg-green-600 transition group-hover:scale-125"></span>

                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {program.nama}
                  </h3>


                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                    {program.deskripsi}
                  </p>


                  <p className="mt-5 text-sm font-semibold text-green-700 dark:text-green-400">
                    Lihat program →
                  </p>

                </a>

              ))}

            </div>

          )}


          {/* Jika belum ada program */}

          {!loadingPrograms && programs.length === 0 && (

            <p className="text-sm text-gray-400">
              Belum ada program yang dipublikasikan.
            </p>

          )}

        </div>

      </section>


      {/* =====================================================
          GALERI TERBARU
      ===================================================== */}

      <section className="bg-white px-6 py-16 dark:bg-gray-950">

        <div className="mx-auto max-w-7xl">

          {/* Header */}

          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">

            <div>

              <p className="text-sm font-semibold tracking-wide text-green-700 dark:text-green-400">
                GALERI
              </p>

              <div className="mt-2 h-1 w-10 rounded-full bg-green-700"></div>

              <h2 className="mt-4 text-3xl font-bold text-green-800 dark:text-green-400">
                Galeri PLTD/G Tello
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600 dark:text-gray-300">
                Dokumentasi kegiatan konservasi dan keanekaragaman
                hayati di kawasan PLTD/G Tello.
              </p>

            </div>


            {/* Link ke halaman Galeri */}

            <a
              href="/galeri"
              className="text-sm font-semibold text-green-700 hover:text-green-800 dark:text-green-400"
            >
              Lihat Semua Galeri →
            </a>

          </div>


          {/* Loading Galeri */}

          {loadingGallery ? (

            <div className="grid gap-5 md:grid-cols-3">

              {Array.from({ length: 3 }).map((_, i) => (

                <div
                  key={i}
                  className="overflow-hidden rounded-2xl"
                >

                  <Skeleton className="h-60 w-full" />

                  <div className="mt-3 space-y-2">

                    <Skeleton className="h-5 w-3/4" />

                    <Skeleton className="h-4 w-1/2" />

                  </div>

                </div>

              ))}

            </div>

          ) : (

            /* Data Galeri */

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {gallery.slice(0, 3).map((item) => (

                <div
                  key={item.id}
                  className="group overflow-hidden rounded-2xl"
                >

                  {/* Foto */}

                  <div className="h-60 overflow-hidden rounded-2xl">

                    {/* eslint-disable-next-line @next/next/no-img-element */}

                    <img
                      src={item.fileUrl}
                      alt={item.judul}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                  </div>


                  {/* Informasi */}

                  <div className="pt-3 pl-5">

                    <p className="text-base font-semibold text-gray-900 dark:text-white">
                      {item.judul}
                    </p>

                    <p className="mt-1 text-sm text-green-700 dark:text-green-400">
                      {item.category.namaKategori}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          )}


          {/* Jika galeri kosong */}

          {!loadingGallery && gallery.length === 0 && (

            <p className="text-sm text-gray-400">
              Belum ada foto di galeri.
            </p>

          )}

        </div>

      </section>


   {/* TENTANG KAMI & KONTAK */}
<section className="bg-gray-50 px-6 py-12 dark:bg-gray-950">
  <div className="mx-auto max-w-7xl">
    <div className="grid gap-6 md:grid-cols-2">

      {/* TENTANG KAMI */}
      <a
        href="/tentang-kami"
        className="group rounded-2xl border border-green-100 bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-green-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
      >
        <p className="text-sm font-semibold tracking-wide text-green-700 dark:text-green-400">
          TENTANG KAMI
        </p>

        <div className="mt-2 h-1 w-10 rounded-full bg-green-700"></div>

        <h2 className="mt-4 text-2xl font-bold text-green-800 dark:text-green-400">
          Mengenal PLTD/G Tello
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
          Mengenal lebih dekat PT PLN Indonesia Power Unit Pembangkitan
          PLTD/G Tello serta komitmen dalam menjaga lingkungan dan
          keanekaragaman hayati.
        </p>

        <p className="mt-5 text-sm font-semibold text-green-700 dark:text-green-400">
          Selengkapnya →
        </p>
      </a>

      {/* KONTAK */}
      <a
        href="/kontak"
        className="group rounded-2xl border border-green-100 bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-green-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
      >
        <p className="text-sm font-semibold tracking-wide text-green-700 dark:text-green-400">
          KONTAK
        </p>

        <div className="mt-2 h-1 w-10 rounded-full bg-green-700"></div>

        <h2 className="mt-4 text-2xl font-bold text-green-800 dark:text-green-400">
          Hubungi Kami
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
          Informasi kontak PT PLN Indonesia Power Unit Pembangkitan
          PLTD/G Tello untuk pertanyaan, informasi, dan kerja sama.
        </p>

        <p className="mt-5 text-sm font-semibold text-green-700 dark:text-green-400">
          Lihat Kontak →
        </p>
      </a>

    </div>
  </div>
</section>

    </div>
  
  );
}
