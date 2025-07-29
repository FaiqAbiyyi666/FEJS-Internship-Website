import React, { useState } from 'react';
import {
  Search,
  Eye,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import autoTable from 'jspdf-autotable';

const ManagementLaporan = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLaporan, setSelectedLaporan] = useState(null);

  // 🔧 Jadikan laporanData ke dalam state agar bisa diperbarui
  const [dataLaporan, setDataLaporan] = useState([
    {
      id: 1,
      peserta: 'Ahmad Rizki Pratama',
      avatar: 'AR',
      bidang: 'Tata Kelola Informatika',
      tanggal: '2024-01-15',
      judul: 'Laporan Harian',
      kegiatan:
        'Melakukan analisis requirement untuk sistem baru, merancang database schema, dan membuat dokumentasi teknis.',
      status: 'Disetujui',
      tanggalSubmit: '2024-01-15 18:30',
      pembimbing: 'Dr. Siti Nurhaliza',
    },
    {
      id: 2,
      peserta: 'Siti Aminah',
      avatar: 'SA',
      bidang: 'Sekretariat',
      tanggal: '2024-01-16',
      judul: 'Laporan Harian',
      kegiatan:
        'Melakukan screening CV kandidat, menyiapkan soal tes, dan mengatur jadwal wawancara.',
      status: 'Pending',
      tanggalSubmit: '2024-01-16 19:00',
      pembimbing: 'Budi Santoso, S.H.',
    },
    {
      id: 3,
      peserta: 'Dian Permata',
      avatar: 'DP',
      bidang: 'Pengelolaan Informasi dan Komunikasi Publik',
      tanggal: '2024-01-17',
      judul: 'Laporan Harian',
      kegiatan:
        'Membuat konten social media, menganalisis engagement, dan menyiapkan laporan performa.',
      status: 'Perlu Revisi',
      tanggalSubmit: '2024-01-17 17:15',
      pembimbing: 'Maria Gonzalez',
    },
  ]);

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

  // Statistik dinamis
  const total = dataLaporan.length;
  const pending = dataLaporan.filter(
    (l) => l.status.toLowerCase() === 'pending'
  ).length;
  const disetujui = dataLaporan.filter(
    (l) => l.status.toLowerCase() === 'disetujui'
  ).length;
  const perluRevisi = dataLaporan.filter(
    (l) => l.status.toLowerCase() === 'perlu revisi'
  ).length;

  const filteredLaporan = dataLaporan.filter((laporan) => {
    const matchesSearch =
      laporan.peserta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      laporan.judul.toLowerCase().includes(searchTerm.toLowerCase());

    const normalizedStatus = laporan.status.toLowerCase().replace(/\s+/g, '');
    return (
      matchesSearch &&
      (statusFilter === 'all' || normalizedStatus === statusFilter)
    );
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Peserta', 'Judul', 'Tanggal', 'Status']],
      body: dataLaporan.map((laporan) => [
        laporan.peserta,
        laporan.judul,
        laporan.tanggal,
        laporan.status,
      ]),
    });
    doc.save('laporan-peserta.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dataLaporan);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan');
    XLSX.writeFile(workbook, 'laporan-peserta.xlsx');
  };

  // ✅ Fungsi untuk update status
  const updateStatus = (id, newStatus) => {
    const updated = dataLaporan.map((laporan) =>
      laporan.id === id ? { ...laporan, status: newStatus } : laporan
    );
    setDataLaporan(updated);

    if (selectedLaporan && selectedLaporan.id === id) {
      setSelectedLaporan((prev) => ({ ...prev, status: newStatus }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Modal */}
      {selectedLaporan && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          onClick={() => setSelectedLaporan(null)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-5 text-gray-500 hover:text-red-500 text-xl"
              onClick={() => setSelectedLaporan(null)}
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-4 text-[#006DA6]">
              Detail Laporan Harian
            </h2>

            <div className="space-y-3 text-sm text-gray-700">
              {[
                ['Judul', selectedLaporan.judul],
                ['Peserta', selectedLaporan.peserta],
                ['Bidang', selectedLaporan.bidang],
                ['Tanggal', selectedLaporan.tanggal],
                ['Kegiatan', selectedLaporan.kegiatan],
                ['Pembimbing', selectedLaporan.pembimbing],
                ['Tanggal Submit', selectedLaporan.tanggalSubmit],
                ['Status', selectedLaporan.status],
              ].map(([label, value], i) => (
                <div key={i}>
                  <span className="font-medium block text-gray-500">
                    {label}
                  </span>
                  <p>{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => setSelectedLaporan(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card
          title="Total Laporan"
          value={total}
          icon={<FileText />}
          gradient="from-[#BFDCFF] to-[#006DA6]"
          color="text-gray-900"
        />
        <Card
          title="Pending"
          value={pending}
          icon={<Clock />}
          gradient="from-yellow-400 to-yellow-600"
          color="text-yellow-600"
        />
        <Card
          title="Disetujui"
          value={disetujui}
          icon={<CheckCircle />}
          gradient="from-green-400 to-green-600"
          color="text-green-600"
        />
        <Card
          title="Perlu Revisi"
          value={perluRevisi}
          icon={<XCircle />}
          gradient="from-red-400 to-red-600"
          color="text-red-600"
        />
      </div>

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
              placeholder="Cari laporan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006DA6] focus:border-transparent"
            />
          </div>
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

        {/* Tombol Ekspor */}
        <div className="flex justify-end gap-4 mb-4">
          <button
            onClick={exportToPDF}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
          >
            Ekspor PDF
          </button>
          <button
            onClick={exportToExcel}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
          >
            Ekspor Excel
          </button>
        </div>
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
                    <span>Bidang: {laporan.bidang}</span>
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
                <button
                  onClick={() => setSelectedLaporan(laporan)}
                  className="p-2 text-[#006DA6] hover:text-[#002942] hover:bg-[#BFDCFF] hover:bg-opacity-20 rounded-lg transition-colors"
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
                <span className="font-bold">Pembimbing:</span>{' '}
                {laporan.pembimbing}
              </div>
              <div>
                <span className="font-bold">Disubmit: </span>{' '}
                {laporan.tanggalSubmit}
              </div>
            </div>

            {laporan.status.toLowerCase() === 'pending' && (
              <div className="flex space-x-3 mt-4 pt-4 border-t">
                <button
                  onClick={() => updateStatus(laporan.id, 'Disetujui')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  Setujui
                </button>
                <button
                  onClick={() => updateStatus(laporan.id, 'Perlu Revisi')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
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

// Reusable Card component
const Card = ({ title, value, icon, gradient, color }) => (
  <div className="bg-white rounded-xl shadow-sm p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
      </div>
      <div className={`p-3 rounded-lg bg-gradient-to-br ${gradient}`}>
        {React.cloneElement(icon, { className: 'text-white' })}
      </div>
    </div>
  </div>
);

export default ManagementLaporan;
