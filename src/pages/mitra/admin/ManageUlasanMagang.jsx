import React, { useState } from 'react';

// Data dummy
const dataUlasan = [
  {
    id: '1',
    nama: 'Fajar Ramadhan',
    bidang: 'Pemrograman Web',
    foto: 'https://randomuser.me/api/portraits/men/32.jpg',
    tanggal: '2025-07-22T10:30:00',
    ulasan:
      'Pengalaman magang yang sangat bermanfaat, banyak belajar hal baru.',
    rating: 5,
  },
  {
    id: '2',
    nama: 'Siti Aisyah',
    bidang: 'Desain Grafis',
    foto: 'https://randomuser.me/api/portraits/women/45.jpg',
    tanggal: '2025-07-20T09:00:00',
    ulasan: 'Tim sangat ramah dan lingkungan kerja menyenangkan.',
    rating: 4,
  },
  {
    id: '3',
    nama: 'Andi Wijaya',
    bidang: 'Jaringan',
    foto: 'https://randomuser.me/api/portraits/men/18.jpg',
    tanggal: '2025-07-21T13:15:00',
    ulasan: 'Perlu peningkatan dalam bimbingan mentor.',
    rating: 3,
  },
];

const ManageUlasanMagang = () => {
  const [searchNama, setSearchNama] = useState('');
  const [filterBidang, setFilterBidang] = useState('');
  const [filterRating, setFilterRating] = useState('');
  const [filterTanggal, setFilterTanggal] = useState('');

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
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.id}>
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
