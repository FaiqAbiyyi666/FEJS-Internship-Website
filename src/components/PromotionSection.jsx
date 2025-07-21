export default function PromotionSection() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center text-center md:text-left gap-12">
        {/* Gambar Ilustrasi */}
        <div className="w-full md:w-1/3 flex justify-center">
          <img
            src="/image-promosi.png"
            alt="Foto Promosi"
            className="w-full max-w-screen-md"
          />
        </div>

        {/* Teks Promosi */}
        <div className="w-full md:w-1/2 text-[#002942] flex flex-col justify-center items-center md:items-start">
          <h2 className="text-2xl md:text-3xl font-bold leading-snug mb-4">
            <span className="text-[#006DA6]">Gabung Sekarang!</span>
            <p>Raih Berbagai Pengalaman Bersama</p>
            <p>Dinas Komunikasi dan Informatika Kabupaten Sidoarjo</p>
          </h2>
          <p className="text-gray-700 text-base md:text-base leading-relaxed  text-justify">
            Temukan pengalaman nyata di dunia kerja dengan bergabung dalam
            program magang kami. Dapatkan kesempatan untuk belajar langsung dari
            para profesional, mengembangkan keterampilan digital dan komunikasi,
            serta terlibat dalam proyek-proyek teknologi yang berdampak bagi
            masyarakat Sidoarjo. Bangun portofolio, relasi, dan wawasan masa
            depanmu di lingkungan kerja yang inovatif dan kolaboratif.
          </p>
        </div>
      </div>
    </section>
  );
}
