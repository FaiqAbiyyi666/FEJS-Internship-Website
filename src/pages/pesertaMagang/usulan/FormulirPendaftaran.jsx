export default function FormulirPendaftaran() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-center text-[#002942]">
        Formulir Pendaftaran Magang
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kolom Kiri */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Jenis Magang
            </label>
            <input className="form-input w-full" placeholder="Pilih Jenis Magang" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Kategori Magang
            </label>
            <input
              className="form-input w-full"
              placeholder="Pilih Kategori Magang"
            />
            <label className="block text-xs font-light mt-1 text-gray-600">
              *) MoU (Khusus untuk peserta yang masuk dalam program kerja sama
              magang)
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Status Pendidikan
            </label>
            <input
              className="form-input w-full"
              placeholder="Pilih Status Pendidikan"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Jenjang Pendidikan
            </label>
            <input
              className="form-input w-full"
              placeholder="Pilih Jenjang Pendidikan"
            />
          </div>
        </div>

        {/* Kolom Kanan */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Sekolah / Perguruan Tinggi
            </label>
            <input
              className="form-input w-full"
              placeholder="Masukkan Sekolah / Perguruan Tinggi"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Jurusan</label>
            <input className="form-input w-full" placeholder="Masukkan Jurusan" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Durasi Magang
            </label>
            <div className="flex items-center gap-2">
              <input
                className="form-input w-full"
                placeholder="Mulai"
                type="date"
              />
              <span className="text-sm font-medium text-gray-600">s/d</span>
              <input
                className="form-input w-full"
                placeholder="Selesai"
                type="date"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Tema Magang
            </label>
            <input className="form-input w-full" placeholder="Masukkan Tema Magang" />
            <label className="block text-xs font-light mt-1 text-gray-600">
              *) Tema Magang (tidak diwajibkan) adalah hal/data yang diharapkan
              diperoleh peserta magang yang akan dilakukan saat mengikuti
              magang.
            </label>
          </div>
        </div>
      </div>

      {/* Data Peserta */}
      <h2 className="text-lg font-bold text-center text-[#002942] mt-8">
        Data Peserta Magang
      </h2>

      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col md:flex-row md:items-end md:gap-6 space-y-4 md:space-y-0">
          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium mb-1">
              Nama Lengkap Peserta
            </label>
            <input className="form-input w-full" placeholder="Masukkan Nama Lengkap" />
          </div>
          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium mb-1">NIS / NIM</label>
            <input className="form-input w-full" placeholder="Masukkan NIS / NIM" />
          </div>
        </div>
      </div>
    </div>
  );
}
