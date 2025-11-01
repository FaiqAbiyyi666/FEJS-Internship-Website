import { useContext, useState, useEffect } from 'react';
import { FormDataContext } from './PengajuanMagangPage';

export default function PilihBidang() {
  const { formData, setFormData } = useContext(FormDataContext);
  const [kuota, setKuota] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKuota = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          'http://localhost:3000/api/peserta/kuota-bidang'
        );

        if (!response.ok) {
          throw new Error(`Gagal mengambil data: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.status && Array.isArray(result.data)) {
          const transformedData = result.data.map((bidang) => ({
            id: bidang.id,
            nama: bidang.nama,
            total: bidang.kuota,
            tersedia: Math.max(0, bidang.kuota - bidang.pesertaAktif),
          }));
          setKuota(transformedData);
        } else {
          throw new Error(result.message || 'Format data dari server salah');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching kuota:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKuota();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">Memuat data kuota...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600 font-semibold">Terjadi Kesalahan</p>
        <p className="text-gray-700">{error}</p>
        <p className="text-sm text-gray-500 mt-2">
          Silakan coba muat ulang halaman.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-[#002942] text-center">
        Kuota Magang Yang Tersedia
      </h2>

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
            {kuota.map((bidang) => (
              <tr key={bidang.id}>
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

      <div className="flex flex-col gap-2 mt-4">
        <div className="flex items-center gap-4">
          <label className="w-1/3 text-sm font-medium text-gray-700">
            Bidang Yang Dipilih
          </label>
          <div className="w-2/3 relative">
            <select
              name="bidangPilihan"
              value={formData.bidangPilihan}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-md pl-3 pr-8 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#006DA6] focus:border-[#006DA6] appearance-none"
            >
              <option value="" disabled>
                Pilih bidang yang diinginkan
              </option>
              {kuota
                .filter((bidang) => bidang.tersedia > 0)
                .map((bidang) => (
                  <option key={bidang.id} value={bidang.id}>
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
