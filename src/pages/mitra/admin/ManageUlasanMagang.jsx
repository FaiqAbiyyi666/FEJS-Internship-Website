import React, { useState, useEffect } from 'react';

const ManageUlasanMagang = () => {
  const [dataUlasan, setDataUlasan] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const [searchNama, setSearchNama] = useState('');
  const [filterBidang, setFilterBidang] = useState('');
  const [filterRating, setFilterRating] = useState('');
  const [filterTanggal, setFilterTanggal] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setErrorMessage(null); // Reset pesan error setiap kali fetch

      try {
        // 1. Ambil token dari localStorage (atau di mana pun Anda menyimpannya)
        const token = localStorage.getItem('token');

        if (!token) {
          // Jika tidak ada token, jangan lakukan fetch
          throw new Error('Token tidak ditemukan. Silakan login kembali.');
        }

        // 2. Buat headers dengan token Authorization
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        };

        // 3. Buat URL dengan query params (jika Anda ingin filter di backend)
        // Kode controller Anda sudah siap untuk ini.
        const params = new URLSearchParams();
        if (searchNama) params.append('searchNama', searchNama);
        if (filterBidang) params.append('filterBidang', filterBidang);
        if (filterRating) params.append('filterRating', filterRating);
        if (filterTanggal) params.append('filterTanggal', filterTanggal);

        const response = await fetch(
          `http://localhost:3000/api/admin/ulasan-magang?${params.toString()}`,
          {
            method: 'GET',
            headers: headers, // <-- PERBAIKAN UTAMA
          }
        );

        const result = await response.json();

        if (!response.ok || !result.status) {
          // Tangani error dari server (termasuk 401 jika token salah/expired)
          throw new Error(result.message || 'Gagal mengambil data ulasan');
        }

        // 4. Set data dari properti 'data' di respon JSON Anda
        setDataUlasan(result.data);
      } catch (error) {
        console.error('Error di fetchData:', error.message);
        setErrorMessage(error.message); // Tampilkan pesan error ke user
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // Tambahkan dependensi filter agar data di-fetch ulang saat filter berubah
  }, [searchNama, filterBidang, filterRating, filterTanggal]);

  const filteredData = dataUlasan.filter((item) => {
    const matchNama = item.nama
      .toLowerCase()
      .includes(searchNama.toLowerCase());
    const matchBidang = filterBidang ? item.bidang === filterBidang : true;
    const matchRating = filterRating
      ? item.rating === parseInt(filterRating)
      : true;
    const matchTanggal = filterTanggal
      ? item.tanggal.slice(0, 10) === filterTanggal
      : true;
    return matchNama && matchBidang && matchRating && matchTanggal;
  });

  const uniqueBidang = [...new Set(dataUlasan.map((item) => item.bidang))];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#006DA6]">Ulasan Magang</h1>

      {/* Filter */}
      <div className="flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Cari nama peserta..."
          value={searchNama}
          onChange={(e) => setSearchNama(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#006DA6]"
        />
        <select
          value={filterBidang}
          onChange={(e) => setFilterBidang(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="">Semua Bidang</option>
          {uniqueBidang.map((bidang) => (
            <option key={bidang} value={bidang}>
              {bidang}
            </option>
          ))}
        </select>
        <select
          value={filterRating}
          onChange={(e) => setFilterRating(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="">Semua Rating</option>
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} Bintang
            </option>
          ))}
        </select>
        <input
          type="date"
          value={filterTanggal}
          onChange={(e) => setFilterTanggal(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm"
        />
      </div>

      {/* Tabel */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#006DA6] text-white">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase rounded-tl-lg">
                Foto
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
                Nama
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
                Bidang
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
                Tanggal
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
                Ulasan
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase rounded-tr-lg">
                Rating
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  Memuat data...
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.id}>
                  {/* ... (TD Foto, Nama, Bidang, Tanggal, Ulasan, Rating) ... */}
                  {/* Pastikan format tanggal sudah benar */}
                  <td className="px-4 py-3">
                    <img
                      src={item.foto}
                      alt={item.nama}
                      className="w-10 h-10 rounded-full"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {item.nama}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {item.bidang}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(item.tanggal).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {item.ulasan}
                  </td>
                  <td className="px-6 py-4 text-sm text-yellow-500 font-semibold">
                    {'⭐'.repeat(item.rating)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  Tidak ada data ulasan ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUlasanMagang;
