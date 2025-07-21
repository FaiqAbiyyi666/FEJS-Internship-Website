export default function KritikSaran() {
  return (
    <section className="bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Formulir */}
        <div className="w-full md:w-1/2 text-[#002942]">
          <h2 className="text-3xl font-bold text-center md:text-left mb-6 text-[#006DA6]">
            Kritik dan Saran
          </h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="nama" className="block text-sm font-medium">
                Nama Lengkap
              </label>
              <input
                id="nama"
                type="text"
                className="w-full mt-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#006DA6]"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Alamat Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full mt-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#006DA6]"
              />
            </div>
            <div>
              <label htmlFor="pesan" className="block text-sm font-medium">
                Pesan
              </label>
              <textarea
                id="pesan"
                rows="4"
                className="w-full mt-1 px-3 py-2 border rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#006DA6]"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-[#002942] to-[#006DA6] hover:bg-[#006DA6] hover:from-[#006DA6] hover:to-[#006DA6] text-white px-4 py-2 rounded-md text-sm transition"
            >
              Kirim Pesan
            </button>
          </form>
        </div>

        {/* Ilustrasi */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <img
            src="/ilustrasi-kritik-saran.png" // perbaiki path jika tidak tampil
            alt="Ilustrasi Kritik dan Saran"
            className="max-w-xs w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
}
