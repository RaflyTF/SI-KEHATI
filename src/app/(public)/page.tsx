export default function BerandaPage() {
  return (
    <div>
    <section 
  className="relative h-[650px] flex items-center justify-center bg-cover bg-center text-white" 
  style={{ 
    backgroundImage: "url('/background-kehati.png')", 
  }} 
> 
   
  <div className="absolute inset-0 bg-black/40"></div> 
 
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

      <section className="grid md:grid-cols-2">

  {/* Bagian kiri: latar hijau */}
<div className="relative overflow-hidden bg-[#165823] flex items-center justify-center px-8 py-12 md:px-10">

  {/* Ornamen lingkaran */}
  <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-[#2B7438]/40"></div>
  <div className="absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-[#0F471C]/50"></div>

  {/* Foto */}
  <div className="relative z-10 w-full max-w-xl">
    <div className="overflow-hidden rounded-2xl border-4 border-white/20 bg-[#D5E8C2] shadow-2xl">
      <img
        src="foto kawasan pltd.jpeg"
        alt="Foto kawasan PLTD/G Tello"
        className="h-64 w-full object-cover transition duration-500 hover:scale-105"
      />
    </div>

    <p className="mt-4 text-center text-sm text-green-100/80">
      Kawasan PLTD/G Tello
    </p>
  </div>
</div>

{/* Bagian kanan: latar putih */}
<div className="bg-white dark:bg-gray-950 px-8 py-12 md:px-12 lg:px-14">
  <div className="max-w-xl">

    {/* Judul */}
    <div className="mb-6">
      <h2 className="text-3xl font-bold font-semibold text-green-700 dark:text-green-500">
        Gambaran Umum
      </h2>

      <div className="mt-3 h-1 w-12 rounded-full bg-primary"></div>
    </div>

    {/* Isi */}
    <div className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">

      <p className="mb-4">
        PT PLN Indonesia Power Unit PLTD/G Tello hadir sebagai pembangkit listrik
        yang bertujuan untuk memenuhi kebutuhan energi di Provinsi Sulawesi Selatan.
      </p>

      <p className="mb-4">
        Fasilitas ini mencakup PLTG dan PLTD dengan kapasitas eksisting masing-masing
        <span className="font-semibold text-primary">
          {" "}122.716 KW
        </span>{" "}
        dan
        <span className="font-semibold text-primary">
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
    </div>
  );
}
