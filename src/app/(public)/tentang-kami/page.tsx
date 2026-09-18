export default function TentangKamiPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-6">

      {/* Header */}
      <div className="mb-8">
        <p className="text-lg font-semibold text-green-700 dark:text-green-400">
          TENTANG KAMI
        </p>

        <div className="my-2 h-1 w-8 rounded-full bg-green-700"></div>

        <h1 className="text-4xl font-bold text-green-800 dark:text-green-400">
          Mengenal PLT/DG Tello
        </h1>
      </div>

      {/* Tentang Kami */}
      <section className="grid items-start gap-10 md:grid-cols-2">

        {/* Text */}
        <div className="max-w-xl">
          <p className="mb-5 text-sm leading-7 text-gray-600 md:text-base dark:text-gray-300">
            PT PLN Indonesia Power Unit Pembangkitan PLT/DG Tello hadir
            sebagai pembangkit listrik yang bertujuan untuk memenuhi
            kebutuhan energi di Provinsi Sulawesi Selatan. Fasilitas ini
            mencakup PLTG dan PLTD dengan kapasitas eksisting masing-masing
            122.716 KW dan 49.992 KW.
          </p>

          <p className="text-sm leading-7 text-gray-600 md:text-base dark:text-gray-300">
            Melalui SI-KEHATI, kami berkomitmen menjaga transparansi data
            monitoring flora dan fauna sebagai bagian dari tanggung jawab
            konservasi sumber daya alam hayati di kawasan operasional kami.
          </p>
        </div>

        {/* Image */}
        <div className="overflow-hidden rounded-2xl shadow-sm">
          <img
            src="kantor pltd.jpeg"
            alt="PLT/DG Tello"
            className="h-[280px] w-full object-cover"
          />
        </div>
      </section>

      {/* Informasi */}
      <section className="mt-10 grid gap-5 md:grid-cols-3">

        <div className="rounded-2xl border border-green-100 bg-green-50 p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl">
            ⚡
          </div>

          <p className="text-sm text-gray-500">
            Kapasitas PLTG
          </p>

          <h2 className="mt-1 text-2xl font-bold text-green-800">
            122.716 KW
          </h2>
        </div>

        <div className="rounded-2xl border border-green-100 bg-green-50 p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl">
            ⚡
          </div>

          <p className="text-sm text-gray-500">
            Kapasitas PLTD
          </p>

          <h2 className="mt-1 text-2xl font-bold text-green-800">
            49.992 KW
          </h2>
        </div>

        <div className="rounded-2xl border border-green-100 bg-green-50 p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl">
            🌿
          </div>

          <p className="text-sm text-gray-500">
            Sistem Monitoring
          </p>

          <h2 className="mt-1 text-2xl font-bold text-green-800">
            SI-KEHATI
          </h2>

          <p className="mt-1 text-sm text-gray-600">
            Monitoring Flora & Fauna
          </p>
        </div>

      </section>
    </main>
  );
}