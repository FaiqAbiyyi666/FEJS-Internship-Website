import React, { useState } from 'react';

// Data Dummy
const dataKritikSaran = [
  {
    id: '1',
    nama: 'Budi Santoso',
    email: 'budi@gmail.com',
    pesan: 'Aplikasi sangat membantu, namun tampilannya bisa lebih responsif.',
    waktu: '2025-07-21T14:30:00',
  },
  {
    id: '2',
    nama: 'Tanpa Nama',
    email: 'anonim@example.com',
    pesan: 'Mohon tambahkan fitur cetak bukti pengajuan.',
    waktu: '2025-07-22T09:15:00',
  },
  {
    id: '3',
    nama: 'Lina Marlina',
    email: 'lina.marlina@example.com',
    pesan: 'Sistem error saat mengunggah dokumen.',
    waktu: '2025-07-23T11:45:00',
  },
];

const ManageKritikSaran = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const filteredData = dataKritikSaran.filter((item) => {
    const keywordMatch =
      item.nama.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.email.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.pesan.toLowerCase().includes(searchKeyword.toLowerCase());

    const itemDate = new Date(item.waktu).toISOString().split('T')[0]; // Format YYYY-MM-DD
    const dateMatch = selectedDate ? itemDate === selectedDate : true;

    return keywordMatch && dateMatch;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#006DA6]">Kritik & Saran</h1>

      {/* Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="Cari nama/email/pesan..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#006DA6]"
          />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#006DA6]"
          />
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#006DA6] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider rounded-tl-lg">
                Nama
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Pesan
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider rounded-tr-lg">
                Waktu
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 text-sm text-gray-900">{item.nama}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {item.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {item.pesan}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(item.waktu).toLocaleString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  Tidak ada data ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageKritikSaran;
