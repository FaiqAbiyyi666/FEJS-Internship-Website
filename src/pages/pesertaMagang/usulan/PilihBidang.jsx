export default function PilihBidang() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-[#002942] text-center">
        Kuota Magang Yang Tersedia
      </h2>

      {/* TABEL */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border border-gray-300">
          <thead className="bg-gradient-to-r from-[#002942] to-[#006DA6] text-white rounded-t-lg">
            <tr>
              <th className="py-3 px-4 font-semibold border border-gray-300 rounded-tl-lg">
                NAMA BIDANG
              </th>
              <th className="py-3 px-4 font-semibold text-center border border-gray-300">
                KUOTA
              </th>
              <th className="py-3 px-4 font-semibold text-center border border-gray-300 rounded-tr-lg">
                KUOTA TERSEDIA
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            <tr>
              <td className="py-3 px-4 border border-gray-300">Sekretariat</td>
              <td className="py-3 px-4 text-center border border-gray-300">
                5
              </td>
              <td className="py-3 px-4 text-center border border-gray-300">
                2
              </td>
            </tr>
            <tr>
              <td className="py-3 px-4 border border-gray-300">
                Pengelolaan Informasi dan Komunikasi Publik
              </td>
              <td className="py-3 px-4 text-center border border-gray-300">
                7
              </td>
              <td className="py-3 px-4 text-center border border-gray-300">
                3
              </td>
            </tr>
            <tr>
              <td className="py-3 px-4 border border-gray-300">
                Tata Kelola Informatika
              </td>
              <td className="py-3 px-4 text-center border border-gray-300">
                6
              </td>
              <td className="py-3 px-4 text-center border border-gray-300 text-gray-600 italic">
                Tidak Tersedia
              </td>
            </tr>
            <tr>
              <td className="py-3 px-4 border border-gray-300">
                Infrastruktur & Keamanan TIK
              </td>
              <td className="py-3 px-4 text-center border border-gray-300">
                5
              </td>
              <td className="py-3 px-4 text-center border border-gray-300">
                2
              </td>
            </tr>
            <tr>
              <td className="py-3 px-4 border border-gray-300">Statistik</td>
              <td className="py-3 px-4 text-center border border-gray-300">
                4
              </td>
              <td className="py-3 px-4 text-center border border-gray-300 text-gray-600 italic">
                Tidak Tersedia
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* INPUT BIDANG YANG DIPILIH */}
      <div className="flex flex-col gap-2 mt-4">
        <div className="flex items-center gap-4">
          <label className="w-1/3 text-sm font-medium text-gray-700">
            Bidang Yang Dipilih
          </label>
          <div className="w-2/3 relative">
            <select
              className="w-full border border-gray-400 rounded-md pl-3 pr-8 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#006DA6] focus:border-[#006DA6] appearance-none"
              style={{ backgroundPosition: 'right 0.75rem center' }} defaultValue=""
            >
              <option value="" disabled>
                Pilih bidang yang diinginkan
              </option>
              <option value="Sekretariat">Sekretariat</option>
              <option value="Pengelolaan Informasi dan Komunikasi Publik">
                Pengelolaan Informasi dan Komunikasi Publik
              </option>
              <option value="Infrastruktur & Keamanan TIK">
                Infrastruktur & Keamanan TIK
              </option>
            </select>

            {/* Ikon panah dropdown */}
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
              ▼
            </div>
          </div>
        </div>

        {/* PERINGATAN */}
        <p className="text-sm text-gray-500 ml-[34.4433%]">
          Perhatian: Pilih bidang yang masih memiliki kuota tersedia
        </p>
      </div>
    </div>
  );
}
