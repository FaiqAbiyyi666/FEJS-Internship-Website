import React, { useState } from 'react';
import { Search, Eye, Download, X } from 'lucide-react';
import * as XLSX from 'xlsx';

const ManagementLaporan = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bidangFilter, setBidangFilter] = useState('all');
  const [tanggalFilter, setTanggalFilter] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLaporan, setSelectedLaporan] = useState(null);

  const laporanData = [
    {
      id: 1,
      peserta: 'Ahmad Rizki Pratama',
      bidang: 'Tata Kelola Informatika',
      instansi: 'UPN Veteran Jawa Timur',
      avatar: 'AR',
      tanggal: '2024-01-15',
      kegiatan:
        'Melakukan analisis requirement untuk sistem baru, merancang database schema, dan membuat dokumentasi teknis. ',
      tanggalSubmit: '2024-01-15 18:30',
    },
    {
      id: 2,
      peserta: 'Siti Aminah',
      bidang: 'Pengelolaan Informasi dan Komunikasi Publik',
      instansi: 'SMK Negeri 1 Sidoarjo',
      avatar: 'SA',
      tanggal: '2024-01-16',
      kegiatan:
        'Melakukan screening CV kandidat, menyiapkan soal tes, dan mengatur jadwal wawancara.',
      tanggalSubmit: '2024-01-16 19:00',
    },
    {
      id: 3,
      peserta: 'Dian Permata',
      bidang: 'Sekretariat',
      instansi: 'Universitas Muhammadiyah Sidoarjo',
      avatar: 'DP',
      tanggal: '2024-01-17',
      kegiatan:
        'Membuat konten social media, menganalisis engagement, dan menyiapkan laporan performa.',
      tanggalSubmit: '2024-01-17 17:15',
    },
  ];

  const filteredLaporan = laporanData.filter((laporan) => {
    const matchesSearch =
      laporan.peserta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      laporan.instansi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBidang =
      bidangFilter === 'all' ||
      laporan.bidang.toLowerCase() === bidangFilter.toLowerCase();
    const matchesTanggal =
      tanggalFilter === '' || laporan.tanggal === tanggalFilter;
    return matchesSearch && matchesBidang && matchesTanggal;
  });

  // === HANDLE EXPORT TO EXCEL ===
  const handleExportExcel = () => {
    // Hapus field avatar sebelum export
    const exportData = filteredLaporan.map(({ avatar, ...rest }) => rest);

    // Buat worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Buat workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Harian');

    // Buat tanggal export (YYYY-MM-DD)
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    // Simpan file dengan tanggal
    XLSX.writeFile(workbook, `laporan_harian_${formattedDate}.xlsx`);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex w-full sm:w-auto items-center gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Cari berdasarkan nama atau instansi peserta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full min-w-[430px] pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-[#006DA6] focus:border-transparent"
            />
          </div>

          {/* Bidang Filter */}
          <select
            value={bidangFilter}
            onChange={(e) => setBidangFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-[#006DA6] focus:border-transparent"
          >
            <option value="all">Semua Bidang</option>
            <option value="Tata Kelola Informatika">
              Tata Kelola Informatika
            </option>
            <option value="Pengelolaan Informasi dan Komunikasi Publik">
              Pengelolaan Informasi dan Komunikasi Publik
            </option>
            <option value="Infrastruktur & Keamanan TIK">
              Infrastruktur & Keamanan TIK
            </option>
            <option value="Sekretariat">Sekretariat</option>
            <option value="Statistik">Statistik</option>
          </select>

          {/* Filter tanggal */}
          <input
            type="date"
            value={tanggalFilter}
            onChange={(e) => setTanggalFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
              focus:ring-2 focus:ring-[#006DA6] focus:border-transparent"
          />
        </div>

        {/* Export Button */}
        <button
          onClick={handleExportExcel}
          className="px-4 py-2 bg-[#006DA6] text-white rounded-lg hover:bg-[#002942] 
            transition-colors flex items-center space-x-2"
        >
          <Download size={20} />
          <span>Export Laporan</span>
        </button>
      </div>

      {/* Laporan Cards */}
      <div className="space-y-4">
        {filteredLaporan.map((laporan) => (
          <div
            key={laporan.id}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#006DA6] to-[#002942] rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {laporan.avatar}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {laporan.peserta} <span>• </span>
                    <span className="text-gray-900">{laporan.instansi}</span>
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                    <span>
                      <span className="font-semibold">Bidang:</span>{' '}
                      {laporan.bidang}
                    </span>
                    <span>•</span>
                    <span>
                      <span className="font-semibold">Tanggal Laporan:</span>{' '}
                      {new Date(laporan.tanggal).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tombol Eye */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setSelectedLaporan(laporan);
                    setIsOpen(true);
                  }}
                  className="p-2 text-[#006DA6] hover:text-[#002942] hover:bg-[#BFDCFF] hover:bg-opacity-20 rounded-lg"
                >
                  <Eye size={20} />
                </button>
              </div>
            </div>

            <p className="text-gray-700 mb-4 leading-relaxed">
              {laporan.kegiatan}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
              <div>
                <span className="font-medium">Disubmit:</span>{' '}
                {laporan.tanggalSubmit}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Detail Laporan */}
      {isOpen && selectedLaporan && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative">
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#006DA6] to-[#002942] rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {selectedLaporan.avatar}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedLaporan.peserta} <span>• </span>
                  <span className="text-gray-900">
                    {selectedLaporan.instansi}
                  </span>
                </h3>

                {/* Bidang */}
                <div className="text-sm text-gray-500 mt-1">
                  <span className="font-semibold">Bidang:</span>{' '}
                  {selectedLaporan.bidang}
                </div>

                {/* Tanggal laporan */}
                <div className="text-sm text-gray-500 mt-1">
                  <span className="font-semibold">Tanggal Laporan:</span>{' '}
                  {new Date(selectedLaporan.tanggal).toLocaleDateString(
                    'id-ID',
                    {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    }
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-md font-semibold text-gray-800 mb-2">
                Detail Kegiatan:
              </h4>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {selectedLaporan.kegiatan}
              </p>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <span className="text-sm text-gray-600">
                <span className="font-semibold">Submit:</span>{' '}
                {selectedLaporan.tanggalSubmit}
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-[#006DA6] text-white rounded-lg hover:bg-[#005080]"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagementLaporan;
