import React, { useState, useEffect } from 'react';

export default function KuotaMagang() {
  // State untuk menyimpan data dari API
  const [data, setData] = useState([]);
  // State untuk status loading
  const [loading, setLoading] = useState(true);
  // State untuk menangani error
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fungsi untuk mengambil data
    const fetchData = async () => {
      try {
        setLoading(true);
        // Ganti '/api/admin/bidang' jika path API Anda berbeda
        const response = await fetch(
          'http://localhost:3000/api/peserta/kuota-bidang'
        );

        if (!response.ok) {
          throw new Error('Gagal mengambil data dari server');
        }

        const result = await response.json();

        // Backend mengembalikan: { id, nama, kuota, pesertaAktif }
        // Frontend membutuhkan: { bidang, kuota, tersedia }
        // Kita perlu mentransformasi data di sini
        const transformedData = result.data.map((item) => ({
          id: item.id, // simpan id untuk key
          bidang: item.nama, // 'nama' dari backend menjadi 'bidang'
          kuota: item.kuota,
          // Hitung 'tersedia' berdasarkan 'kuota' dan 'pesertaAktif'
          tersedia: item.kuota - item.pesertaAktif,
        }));

        setData(transformedData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Panggil fungsi saat komponen dimuat
  }, []); // [] dependency array berarti useEffect hanya berjalan sekali saat mount

  return (
    <section className="bg-[#F7FAFC] py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Judul dengan garis biru di atas */}
        <div className="text-center mb-12">
          <div className="w-36 h-1 mx-auto mt-4 mb-5 bg-[#006DA6] rounded-full" />
          <h2 className="text-2xl md:text-3xl font-normal text-[#002942]">
            <span className="font-bold text-[#006DA6]">Kuota Magang</span>{' '}
            <span className="text-[#002942]">Yang Tersedia Saat Ini</span>
          </h2>
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gradient-to-r from-[#002942] to-[#006DA6] text-white">
              <tr>
                <th className="py-3 px-4 font-semibold">NAMA BIDANG</th>
                <th className="py-3 px-4 font-semibold text-center">KUOTA</th>
                <th className="py-3 px-4 font-semibold text-center">
                  KUOTA TERSEDIA
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Tampilkan status Loading */}
              {loading && (
                <tr>
                  <td
                    colSpan="3"
                    className="py-4 px-4 text-center text-gray-500"
                  >
                    Memuat data...
                  </td>
                </tr>
              )}

              {/* Tampilkan status Error */}
              {error && (
                <tr>
                  <td
                    colSpan="3"
                    className="py-4 px-4 text-center text-red-500"
                  >
                    {error}
                  </td>
                </tr>
              )}

              {/* Tampilkan data jika berhasil diambil dan tidak loading */}
              {!loading && !error && data.length === 0 && (
                <tr>
                  <td
                    colSpan="3"
                    className="py-4 px-4 text-center text-gray-500"
                  >
                    Belum ada data kuota yang tersedia.
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                data.map((row) => (
                  // Gunakan ID unik dari data sebagai key
                  <tr key={row.id}>
                    <td className="py-3 px-4">{row.bidang}</td>
                    <td className="py-3 px-4 text-center">{row.kuota}</td>
                    <td className="py-3 px-4 text-center">
                      {row.tersedia > 0 ? (
                        // Tampilkan kuota tersedia jika lebih dari 0
                        row.tersedia
                      ) : (
                        <span className="text-gray-600 italic">
                          Tidak Tersedia
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
