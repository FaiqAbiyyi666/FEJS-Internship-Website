import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  Download,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
} from 'lucide-react';

const ManagementLaporan = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [bidangFilter, setBidangFilter] = useState('all');

  const laporanData = [
    {
      id: 1,
      peserta: 'Ahmad Rizki Pratama',
      avatar: 'AR',
      tanggal: '2024-01-15',
      judul: 'Laporan Harian - Pengembangan Sistem',
      kegiatan:
        'Melakukan analisis requirement untuk sistem baru, merancang database schema, dan membuat dokumentasi teknis. ',
      jamMasuk: '08:00',
      jamKeluar: '17:00',
      status: 'Disetujui',
      tanggalSubmit: '2024-01-15 18:30',
      pembimbing: 'Dr. Siti Nurhaliza',
    },
    {
      id: 2,
      peserta: 'Siti Aminah',
      avatar: 'SA',
      tanggal: '2024-01-16',
      judul: 'Laporan Harian - Rekrutmen Karyawan',
      kegiatan:
        'Melakukan screening CV kandidat, menyiapkan soal tes, dan mengatur jadwal wawancara.',
      jamMasuk: '08:15',
      jamKeluar: '17:00',
      status: 'Pending',
      tanggalSubmit: '2024-01-16 19:00',
      pembimbing: 'Budi Santoso, S.H.',
    },
    {
      id: 3,
      peserta: 'Dian Permata',
      avatar: 'DP',
      tanggal: '2024-01-17',
      judul: 'Laporan Harian - Kampanye Marketing',
      kegiatan:
        'Membuat konten social media, menganalisis engagement, dan menyiapkan laporan performa.',
      jamMasuk: '08:30',
      jamKeluar: '16:45',
      status: 'Perlu Revisi',
      tanggalSubmit: '2024-01-17 17:15',
      pembimbing: 'Maria Gonzalez',
    },
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'disetujui':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'perlu revisi':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'disetujui':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-600" />;
      case 'perlu revisi':
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const filteredLaporan = laporanData.filter((laporan) => {
    const matchesSearch =
      laporan.peserta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      laporan.judul.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      laporan.status.toLowerCase().replace(' ', '').includes(statusFilter);
    const matchesBidang =
      bidangFilter === 'all' ||
      laporan.bidang.toLowerCase().replace(' ', '').includes(statusFilter);
    return matchesSearch && matchesStatus && matchesBidang;
  });

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Laporan</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-[#BFDCFF] to-[#006DA6] rounded-lg">
              <FileText size={24} className="text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">23</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg">
              <Clock size={24} className="text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Disetujui</p>
              <p className="text-2xl font-bold text-green-600">125</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-400 to-green-600 rounded-lg">
              <CheckCircle size={24} className="text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Perlu Revisi</p>
              <p className="text-2xl font-bold text-red-600">8</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-red-400 to-red-600 rounded-lg">
              <XCircle size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div> */}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 sm:w-64">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Cari nama peserta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006DA6] focus:border-transparent"
            />
          </div>
          <select
            value={bidangFilter}
            onChange={(e) => setBidangFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006DA6] focus:border-transparent"
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
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006DA6] focus:border-transparent"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="disetujui">Disetujui</option>
            <option value="perlurevisi">Perlu Revisi</option>
          </select>
        </div>
        <button className="px-4 py-2 bg-[#006DA6] text-white rounded-lg hover:bg-[#002942] transition-colors flex items-center space-x-2">
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
                    {laporan.judul}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                    <span>Peserta: {laporan.peserta}</span>
                    <span>•</span>
                    <span>{laporan.tanggal}</span>
                    <span>•</span>
                    <span>
                      {laporan.jamMasuk} - {laporan.jamKeluar}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    laporan.status
                  )}`}
                >
                  {getStatusIcon(laporan.status)}
                  <span className="ml-2">{laporan.status}</span>
                </span>
                <button className="p-2 text-[#006DA6] hover:text-[#002942] hover:bg-[#BFDCFF] hover:bg-opacity-20 rounded-lg transition-colors">
                  <Eye size={20} />
                </button>
              </div>
            </div>

            <p className="text-gray-700 mb-4 leading-relaxed">
              {laporan.kegiatan}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
              <div>
                <span className="font-medium">Pembimbing:</span>{' '}
                {laporan.pembimbing}
              </div>
              <div>
                <span className="font-medium">Disubmit:</span>{' '}
                {laporan.tanggalSubmit}
              </div>
            </div>

            {laporan.status === 'Pending' && (
              <div className="flex space-x-3 mt-4 pt-4 border-t">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                  Setujui
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                  Minta Revisi
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagementLaporan;
