export default function BerandaPage() {
  return (
    <div>
      <section className="relative h-[420px] flex items-end bg-gradient-to-b from-primary/70 to-primary-dark/80 text-white">
        <div className="max-w-6xl mx-auto px-4 pb-12">
          <h1 className="text-3xl md:text-4xl font-semibold mb-2">Keanekaragaman Hayati</h1>
          <p className="italic mb-1">&ldquo;Hijau Alamku, Lestari Bumiku&rdquo;</p>
          <p className="text-sm">PT PLN Indonesia Power Unit Pembangkitan PLTD/G Tello</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8 items-center">
        <div className="h-64 rounded-xl bg-primary-light/40 dark:bg-primary-dark/30 flex items-center justify-center text-sm text-gray-500">
          Foto kawasan PLTD/G Tello
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-3 text-primary dark:text-primary-light">Gambaran Umum</h2>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            PT PLN Indonesia Power Unit Pembangkitan PLTD/G Tello berkomitmen melakukan identifikasi dampak
            lingkungan serta kegiatan monitoring flora dan fauna berdasarkan UU Nomor 5 Tahun 1990 tentang
            Konservasi Sumber Daya Alam Hayati dan Ekosistemnya. Hasil monitoring menjadi dasar evaluasi dan
            rekomendasi pengelolaan habitat flora dan fauna di kawasan PLTD/G Tello.
          </p>
        </div>
      </section>
    </div>
  );
}
