import React, { useState } from 'react';
import { Eye, Edit } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export default function ManagementSubKoorbid() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const subKoorData = [
    {
      id: 1,
      nama: 'Dian Prasetyo',
      email: 'dian.prasetyo@simagang.com',
      bidang: 'IT Development',
      status: 'Aktif',
    },
    {
      id: 2,
      nama: 'Yuliana Rahmawati',
      email: 'yuliana.rahma@simagang.com',
      bidang: 'Human Resources',
      status: 'Tidak Aktif',
    },
    {
      id: 3,
      nama: 'Agus Setiawan',
      email: 'agus.setiawan@simagang.com',
      bidang: 'Finance',
      status: 'Aktif',
    },
    {
      id: 4,
      nama: 'Nina Marlina',
      email: 'nina.marlina@simagang.com',
      bidang: 'Public Relations',
      status: 'Aktif',
    },
    {
      id: 5,
      nama: 'Bambang Susilo',
      email: 'bambang.susilo@simagang.com',
      bidang: 'Legal',
      status: 'Tidak Aktif',
    },
    {
      id: 6,
      nama: 'Siti Nurjanah',
      email: 'siti.nurjanah@simagang.com',
      bidang: 'Data Science',
      status: 'Aktif',
    },
    {
      id: 7,
      nama: 'Imam Bukhari',
      email: 'imam.bukhari@simagang.com',
      bidang: 'Education',
      status: 'Aktif',
    },
    {
      id: 8,
      nama: 'Citra Lestari',
      email: 'citra.lestari@simagang.com',
      bidang: 'Design',
      status: 'Tidak Aktif',
    },
    {
      id: 9,
      nama: 'Rizky Andika',
      email: 'rizky.andika@simagang.com',
      bidang: 'Engineering',
      status: 'Aktif',
    },
    {
      id: 10,
      nama: 'Maya Sari',
      email: 'maya.sari@simagang.com',
      bidang: 'Translation',
      status: 'Aktif',
    },
    {
      id: 11,
      nama: 'Tomi Gunawan',
      email: 'tomi.gunawan@simagang.com',
      bidang: 'Mobile Development',
      status: 'Aktif',
    },
    {
      id: 12,
      nama: 'Indah Permata',
      email: 'indah.permata@simagang.com',
      bidang: 'IT Support',
      status: 'Tidak Aktif',
    },
  ];

  const filteredData = subKoorData.filter(
    (subkoor) =>
      subkoor.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subkoor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subkoor.bidang.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusColor = (status) => {
    return status === 'Aktif'
      ? 'text-green-600 bg-green-100'
      : 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <input
          type="text"
          placeholder="Cari Sub Koor Bidang..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-[#006DA6] focus:border-[#006DA6]"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#006DA6] text-white">
            <tr>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Bidang</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{item.nama}</td>
                <td className="px-4 py-3">{item.email}</td>
                <td className="px-4 py-3">{item.bidang}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button className="text-[#006DA6] hover:underline flex items-center text-sm">
                    <Eye size={16} className="mr-1" />
                  </button>
                  <button className="text-yellow-600 hover:underline flex items-center text-sm">
                    <Edit size={16} className="mr-1" />
                  </button>
                </td>
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  Tidak ada data ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-700">
          Menampilkan{' '}
          <span className="font-medium">
            {(currentPage - 1) * ITEMS_PER_PAGE + 1}
          </span>{' '}
          -{' '}
          <span className="font-medium">
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)}
          </span>{' '}
          dari <span className="font-medium">{filteredData.length}</span> hasil
        </p>
        <div className="flex space-x-1">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 border rounded hover:bg-gray-100 text-sm"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded text-sm ${
                currentPage === i + 1
                  ? 'bg-[#006DA6] text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-3 py-1 border rounded hover:bg-gray-100 text-sm"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
