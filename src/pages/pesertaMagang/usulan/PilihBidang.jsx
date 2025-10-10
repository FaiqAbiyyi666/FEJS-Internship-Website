import { useContext } from 'react';
import { FormDataContext } from './PengajuanMagangPage'; // Pastikan path import ini benar

// 1. Definisikan data di satu tempat (Single Source of Truth)
const kuotaData = [
  {
    nama: 'Sekretariat',
    total: 5,
    tersedia: 2,
  },
  {
    nama: 'Pengelolaan Informasi dan Komunikasi Publik',
    total: 7,
    tersedia: 3,
  },
  {
    nama: 'Tata Kelola Informatika',
    total: 6,
    tersedia: 0, // Contoh kuota tidak tersedia
  },
  {
    nama: 'Infrastruktur & Keamanan TIK',
    total: 5,
    tersedia: 2,
  },
  {
    nama: 'Statistik',
    total: 4,
    tersedia: 0, // Contoh kuota tidak tersedia
  },
];

export default function PilihBidang() {
  // 2. Hubungkan ke state terpusat via Context
  const { formData, setFormData } = useContext(FormDataContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-[#002942] text-center">
        Kuota Magang Yang Tersedia
      </h2>

      {/* TABEL (Dibuat secara dinamis dari data) */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border border-gray-300">
          <thead className="bg-gradient-to-r from-[#002942] to-[#006DA6] text-white">
            <tr>
              <th className="py-3 px-4 font-semibold">NAMA BIDANG</th>
              <th className="py-3 px-4 font-semibold text-center">KUOTA</th>
              <th className="py-3 px-4 font-semibold text-center">
                KUOTA TERSEDIA
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {kuotaData.map((bidang) => (
              <tr key={bidang.nama}>
                <td className="py-3 px-4 border-t border-gray-300">
                  {bidang.nama}
                </td>
                <td className="py-3 px-4 text-center border-t border-gray-300">
                  {bidang.total}
                </td>
                <td
                  className={`py-3 px-4 text-center border-t border-gray-300 ${
                    bidang.tersedia === 0 ? 'text-gray-500 italic' : ''
                  }`}
                >
                  {bidang.tersedia > 0 ? bidang.tersedia : 'Tidak Tersedia'}
                </td>
              </tr>
            ))}
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
            {/* 3. Jadikan <select> sebagai controlled component */}
            <select
              name="bidangPilihan" // Sesuaikan dengan key di state formData
              value={formData.bidangPilihan} // Nilai diambil dari state terpusat
              onChange={handleChange} // Perubahan akan mengupdate state terpusat
              className="w-full border border-gray-400 rounded-md pl-3 pr-8 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#006DA6] focus:border-[#006DA6] appearance-none"
            >
              <option value="" disabled>
                Pilih bidang yang diinginkan
              </option>
              {/* 4. Opsi dropdown difilter & dibuat secara dinamis */}
              {kuotaData
                .filter((bidang) => bidang.tersedia > 0) // Hanya tampilkan bidang dengan kuota > 0
                .map((bidang) => (
                  <option key={bidang.nama} value={bidang.nama}>
                    {bidang.nama}
                  </option>
                ))}
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
              ▼
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500 ml-[34.4433%]">
          Perhatian: Pilih bidang yang masih memiliki kuota tersedia
        </p>
      </div>
    </div>
  );
}
