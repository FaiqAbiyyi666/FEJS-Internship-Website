export default function VideoTataCaraMagang() {
  return (
    <section className="bg-[#F9FBFD] py-12 px-4 text-[#002942]">
      <div className="max-w-4xl mx-auto text-center">
        {/* Judul */}
        <div className="mb-8">
          <div className="w-36 h-1 mx-auto mt-4 mb-5 bg-[#006DA6] rounded-full" />
          <h2 className="text-2xl md:text-3xl font-bold text-[#006DA6]">
            Tata Cara Pendaftaran Magang
          </h2>
          <p className="text-xl md:text-xl mt-1">
            di Dinas Komunikasi dan Informatika
            <br />
            Kabupaten Sidoarjo
          </p>
        </div>

        {/* Video */}
        <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg">
          <video controls className="w-full h-full object-cover">
            <source
              src="public\Videos\cara-daftar-magang.mp4"
              type="video/mp4"
            />
            Browser Anda tidak mendukung pemutar video.
          </video>
        </div>
      </div>
    </section>
  );
}
