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
              Nama Lengkap Peserta
            </label>
            <input
              className="form-input w-full"
              placeholder="Masukkan Nama Lengkap"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">NIS / NIM</label>
            <input
              className="form-input w-full"
              placeholder="Masukkan NIS / NIM"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Kategori Magang
            </label>
            <div className="relative">
              <select
                className="w-full border rounded-md pl-3 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-[#006DA6] focus:border-[#006DA6] appearance-none text-sm font-normal"
                defaultValue=""
              >
                <option value="" disabled className="text-sm font-medium">
                  Pilih Kategori Magang
                </option>
                <option value="reguler" className="text-sm font-medium">
                  Reguler
                </option>
                <option value="mandiri" className="text-sm font-medium">
                  Mandiri
                </option>
                <option value="mou" className="text-sm font-medium">
                  MoU
                </option>
              </select>

              {/* Ikon panah dropdown */}
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                ▼
              </div>
            </div>
            <label className="block text-xs font-light mt-1 text-gray-600 text-justify">
              *) MoU (Khusus untuk peserta yang masuk dalam program kerja sama
              magang)
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Status Pendidikan
            </label>
            <div className="relative">
              <select
                className="w-full border rounded-md pl-3 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-[#006DA6] focus:border-[#006DA6] appearance-none text-sm font-normal"
                defaultValue=""
              >
                <option value="" disabled className="text-sm font-medium">
                  Pilih Status Pendidikan
                </option>
                <option value="sekolah" className="text-sm font-medium">
                  Sekolah
                </option>
                <option value="kuliah" className="text-sm font-medium">
                  Kuliah
                </option>
                <option value="luluskuliah" className="text-sm font-medium">
                  Lulus Kuliah
                </option>
              </select>

              {/* Ikon panah dropdown */}
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                ▼
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Jenjang Pendidikan
            </label>
            <div className="relative">
              <select
                className="w-full border rounded-md pl-3 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-[#006DA6] focus:border-[#006DA6] appearance-none text-sm font-normal"
                defaultValue=""
              >
                <option value="" disabled className="text-sm font-medium">
                  Pilih Jenjang Pendidikan
                </option>
                <option value="smk" className="text-sm font-medium">
                  SMK
                </option>
                <option value="d1" className="text-sm font-medium">
                  D1
                </option>
                <option value="d2" className="text-sm font-medium">
                  D2
                </option>
                <option value="d3" className="text-sm font-medium">
                  D3
                </option>
                <option value="d4" className="text-sm font-medium">
                  D4
                </option>
                <option value="s1" className="text-sm font-medium">
                  S1
                </option>
              </select>

              {/* Ikon panah dropdown */}
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                ▼
              </div>
            </div>
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
            <input
              className="form-input w-full"
              placeholder="Masukkan Jurusan"
            />
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
            <input
              className="form-input w-full"
              placeholder="Masukkan Tema Magang"
            />
            <label className="block text-xs font-light mt-1 text-gray-600 text-justify">
              *) Tema Magang (tidak diwajibkan) adalah hal/data yang diharapkan
              diperoleh peserta magang yang akan dilakukan saat mengikuti
              magang.
            </label>
            <label className="block text-xs font-light mt-1 text-gray-600 text-justify">
              *){' '}
              <label className=" text-xs font-bold text-gray-600 ">
                Contoh Tema Magang
              </label>{' '}
              seperti Manajemen arsip digital, Efektivitas media sosial,
              Strategi konten publik, Pengembangan aplikasi internal, Keamanan
              jaringan, Analisis big data, Visualisasi data interaktif, dsb.
            </label>
          </div>
        </div>
      </div>

      {/* Data Peserta */}
      {/* <h2 className="text-lg font-bold text-center text-[#002942] mt-8">
        Data Peserta Magang
      </h2>

      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col md:flex-row md:items-end md:gap-6 space-y-4 md:space-y-0">
          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium mb-1">
              Nama Lengkap Peserta
            </label>
            <input
              className="form-input w-full"
              placeholder="Masukkan Nama Lengkap"
            />
          </div>
          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium mb-1">NIS / NIM</label>
            <input
              className="form-input w-full"
              placeholder="Masukkan NIS / NIM"
            />
          </div>
        </div>
      </div> */}
    </div>
  );
}
