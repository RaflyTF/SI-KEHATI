export default function KontakPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="max-w-7xl mx-auto px-6 py-12">

        {/* =========================
            JUDUL
        ========================= */}

        <section className="mb-12">

          {/* Label kecil */}
          <p className="text-lg font-semibold text-green-700 dark:text-green-400">
            KONTAK
          </p>

          {/* Garis hijau */}
          <div className="w-8 h-1 bg-green-700 dark:bg-green-400 my-3 rounded-full"></div>

          {/* Judul utama */}
          <h1 className="text-5xl md:text-6xl font-bold text-green-800 dark:text-green-400 mb-4">
            Hubungi Kami
          </h1>

          {/* Deskripsi */}
          <p className="max-w-xl text-base md:text-lg leading-relaxed text-gray-600 dark:text-gray-300">
            Kami siap membantu untuk pertanyaan, informasi,
            dan kerja sama dalam mendukung pelestarian
            keanekaragaman hayati.
          </p>

        </section>


        {/* =========================
            INFORMASI + MAPS
        ========================= */}

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">


          {/* =========================
              INFORMASI KONTAK
          ========================= */}

          <div className="space-y-8">


            {/* =========================
                ALAMAT
            ========================= */}

            <div className="flex gap-5 items-start">

              {/* Icon */}
              <div className="
                w-14
                h-14
                min-w-[56px]
                rounded-xl
                bg-green-50
                dark:bg-green-900/30
                flex
                items-center
                justify-center
                text-2xl
              ">
                📍
              </div>


              {/* Teks */}
              <div>

                <h2 className="
                  text-lg
                  font-semibold
                  text-green-700
                  dark:text-green-400
                  mb-2
                ">
                  Alamat
                </h2>

                <p className="
                  text-sm
                  text-gray-600
                  dark:text-gray-300
                  leading-relaxed
                ">
                  PT PLN Indonesia Power Unit Pembangkitan PLTD/G Tello
                </p>

                <p className="
                  text-sm
                  text-gray-600
                  dark:text-gray-300
                  leading-relaxed
                ">
                  Jl. Urip Sumoharjo No.Km. 5,
                  Tello Baru, Kec. Panakkukang,
                  Kota Makassar, Sulawesi Selatan 90233
                </p>

              </div>

            </div>


            {/* =========================
                EMAIL
            ========================= */}

            <div className="flex gap-5 items-start">

              {/* Icon */}
              <div className="
                w-14
                h-14
                min-w-[56px]
                rounded-xl
                bg-green-50
                dark:bg-green-900/30
                flex
                items-center
                justify-center
                text-2xl
              ">
                ✉️
              </div>


              {/* Teks */}
              <div>

                <h2 className="
                  text-lg
                  font-semibold
                  text-green-700
                  dark:text-green-400
                  mb-2
                ">
                  Email
                </h2>

                <p className="
                  text-sm
                  text-gray-600
                  dark:text-gray-300
                ">
                  kontak@pltdgtello.example.id
                </p>

              </div>

            </div>

          </div>


          {/* =========================
              GOOGLE MAPS
          ========================= */}

          <div className="
            h-[320px]
            p-2
            rounded-2xl
            border
            border-green-200
            dark:border-green-800
            bg-white
            dark:bg-gray-900
            shadow-sm
          ">

            <iframe
              title="Lokasi PLTD/G Tello"
              src="https://www.google.com/maps?q=PLTD%20Tello%20Makassar&output=embed"
              className="w-full h-full rounded-xl border-0"
              loading="lazy"
              allowFullScreen
            ></iframe>

          </div>

        </section>

      </main>

    </div>
  );
}