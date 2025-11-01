import React, { useState, useEffect } from 'react';

const ManageKritikSaran = () => {
  // State untuk data, loading, dan error
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk filter (sudah ada)
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (searchKeyword) {
          params.append('search', searchKeyword);
        }
        if (selectedDate) {
          params.append('date', selectedDate);
        }

        const token = localStorage.getItem('token');

        const response = await fetch(
          `http://localhost:3000/api/admin/kritik-saran?${params.toString()}`, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Gagal mengambil data.');
        }

        if (result.status) {
          setData(result.data);
        } else {
          setError(result.message || 'Gagal mengambil data.');
        }
      } catch (err) {
        setError(err.message || 'Gagal terhubung ke server.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchKeyword, selectedDate]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#006DA6]">Kritik & Saran</h1>

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
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  Memuat data...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-red-600">
                  Error: {error}
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.nama}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {item.pesan}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                </tr>
              ))
            ) : (
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
