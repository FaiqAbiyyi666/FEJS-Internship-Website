import React, { useState, useRef, useEffect } from 'react';
import { Eye, Search, X } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const laporanHasilMagang = [
  {
    id: '1',
    peserta: {
      nama: 'Andi Saputra',
      email: 'andi@example.com',
      bidang: 'Pemrograman',
    },
    fileLaporan: 'public/files/laporan-akhir01.pdf',
    createdAt: '2024-07-01',
  },
  {
    id: '2',
    peserta: {
      nama: 'Rina Marlina',
      email: 'rina@example.com',
      bidang: 'Desain Grafis',
    },
    fileLaporan: 'public/files/laporan-akhir02.pdf',
    createdAt: '2024-07-02',
  },
  {
    id: '3',
    peserta: {
      nama: 'Budi Santoso',
      email: 'budi@example.com',
      bidang: 'Jaringan',
    },
    fileLaporan: 'public/files/laporan-akhir03.pdf',
    createdAt: '2024-06-25',
  },
];

const ManageLaporanAkhir = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [previewFile, setPreviewFile] = useState(null);
  const [filterBidang, setFilterBidang] = useState('all');
  const [sortByDate, setSortByDate] = useState('newest');
  const modalRef = useRef();

  const bidangList = [
    ...new Set(laporanHasilMagang.map((laporan) => laporan.peserta.bidang)),
  ];

  const filteredData = laporanHasilMagang
    .filter((laporan) =>
      laporan.peserta.nama.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((laporan) =>
      filterBidang === 'all' ? true : laporan.peserta.bidang === filterBidang
    )
    .sort((a, b) =>
      sortByDate === 'newest'
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Laporan Hasil Magang', 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [['Nama Peserta', 'Email', 'Bidang', 'Tanggal Kirim']],
      body: laporanHasilMagang.map((l) => [
        l.peserta.nama,
        l.peserta.email,
        l.peserta.bidang,
        new Date(l.createdAt).toLocaleDateString(),
      ]),
    });
    doc.save('laporan-hasil-magang.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      laporanHasilMagang.map((l) => ({
        Nama: l.peserta.nama,
        Email: l.peserta.email,
        Bidang: l.peserta.bidang,
        Tanggal: new Date(l.createdAt).toLocaleDateString(),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan');
    XLSX.writeFile(workbook, 'laporan-hasil-magang.xlsx');
  };

  // Klik luar modal untuk tutup
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setPreviewFile(null);
      }
    };
    if (previewFile) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [previewFile]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#006DA6]">
        Manajemen Laporan Akhir
      </h1>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <div className="relative w-full sm:w-64">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Cari peserta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006DA6]"
            />
          </div>

          <select
            value={filterBidang}
            onChange={(e) => setFilterBidang(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">Semua Bidang</option>
            {bidangList.map((bidang, idx) => (
              <option key={idx} value={bidang}>
                {bidang}
              </option>
            ))}
          </select>

          <select
            value={sortByDate}
            onChange={(e) => setSortByDate(e.target.value)}
            className="w-full sm:w-52 px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={exportToPDF}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
          >
            Ekspor PDF
          </button>
          <button
            onClick={exportToExcel}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
          >
            Ekspor Excel
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#006DA6] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider rounded-tl-xl">
                Nama Peserta
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Bidang
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Tanggal Kirim
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                File
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider rounded-tr-xl">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((laporan) => (
              <tr key={laporan.id}>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {laporan.peserta.nama}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {laporan.peserta.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {laporan.peserta.bidang}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(laporan.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-blue-600">
                  <button
                    onClick={() => setPreviewFile(laporan.fileLaporan)}
                    className="flex items-center space-x-2 hover:underline"
                  >
                    <Eye size={16} />
                    <span>Lihat</span>
                  </button>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700">
                    Diterima
                  </button>
                  <button className="px-3 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700">
                    Ditolak
                  </button>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  Tidak ada data ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Preview PDF */}
      {previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div
            ref={modalRef}
            className="bg-white w-full max-w-4xl rounded-md overflow-hidden relative"
          >
            <button
              onClick={() => setPreviewFile(null)}
              className="absolute top-2 right-2 bg-gray-800 text-white p-1 rounded-full hover:bg-gray-700"
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <iframe
              src={previewFile}
              title="Preview PDF"
              className="w-full h-[80vh]"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageLaporanAkhir;
