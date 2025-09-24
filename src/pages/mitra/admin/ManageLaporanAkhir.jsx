import React, { useState, useRef, useEffect } from 'react';
import { Eye, Search, Download, X } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const ManageLaporanAkhir = () => {
  const [laporanHasilMagang, setLaporanHasilMagang] = useState([
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
  ]);

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

  // ===== Export Excel untuk Riwayat =====
  const exportRiwayatToExcel = () => {
    if (riwayat.length === 0) {
      alert('Belum ada data riwayat untuk diekspor.');
      return;
    }

    // Buat tanggal export (YYYY-MM-DD)
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    const worksheet = XLSX.utils.json_to_sheet(
      riwayat.map((l) => ({
        Nama: l.peserta.nama,
        Email: l.peserta.email,
        Bidang: l.peserta.bidang,
        Status: l.status,
        'Tanggal Respon': new Date(l.respondedAt).toLocaleString(),
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Riwayat Laporan');
    XLSX.writeFile(workbook, `riwayat_laporan_akhir_${formattedDate}.xlsx`);
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

  // State riwayat keputusan
  const [riwayat, setRiwayat] = useState([]);

  // Fungsi ketika admin klik diterima / ditolak
  const handleResponse = (laporan, status) => {
    // Hapus dari tabel ajuan masuk
    setLaporanHasilMagang((prev) =>
      prev.filter((item) => item.id !== laporan.id)
    );

    // Tambah ke tabel riwayat
    setRiwayat((prev) => [
      ...prev,
      {
        ...laporan,
        status,
        respondedAt: new Date().toISOString(),
      },
    ]);
  };

  return (
    <div className="space-y-6">
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
                  <button
                    onClick={() => handleResponse(laporan, 'Diterima')}
                    className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700"
                  >
                    Diterima
                  </button>
                  <button
                    onClick={() => handleResponse(laporan, 'Ditolak')}
                    className="px-3 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700"
                  >
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

      {/* Table Riwayat */}
      <div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3">
            <h3 className="text-lg font-semibold text-gray-700  rounded-t-lg">
              Riwayat Laporan Akhir Peserta Magang
            </h3>
            <div className="flex gap-2">
              <button
                onClick={exportRiwayatToExcel}
                className="flex items-center gap-2 px-4 py-2 bg-[#006DA6] text-white rounded-md hover:bg-[#00476d] text-sm"
              >
                <Download size={18} />
                <span>Eksport Riwayat</span>
              </button>
            </div>
          </div>

          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Nama Peserta
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Bidang
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  File
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Tanggal Respon
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {riwayat.map((laporan) => (
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
                  <td
                    className={`px-6 py-4 text-sm font-semibold ${
                      laporan.status === 'Diterima'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {laporan.status}
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
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(laporan.respondedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
              {riwayat.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    Belum ada riwayat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
