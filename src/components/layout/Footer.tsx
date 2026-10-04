export function Footer() {
  return (
    <footer className="mt-16 bg-[#165823] py-8 text-sm text-white">
      <div className="max-w-6xl mx-auto px-4 text-center space-y-1">
        <p>PT PLN Indonesia Power Unit Pembangkitan PLTD/G Tello</p>

        <p>
          Jl. Urip Sumoharjo KM. 7, Tello Baru, Kec. Panakkukang, Kota Makassar,
          Sulawesi Selatan
        </p>

        <p>
          &copy; {new Date().getFullYear()} SI-KEHATI — Sistem Informasi
          Keanekaragaman Hayati
        </p>
      </div>
    </footer>
  );
}