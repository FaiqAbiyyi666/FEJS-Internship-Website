import React, { useEffect, useState, Fragment } from 'react';
import {
  Eye,
  CheckCircle,
  XCircle,
  Download,
  MoreVertical,
} from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import * as XLSX from 'xlsx';

export default function ManageAjuanMagang() {
  // === State Utama ===
  const [pesertaMagang, setPesertaMagang] = useState([
    {
      id: 1,
      nim: '0101234567',
      nama: 'Ahmad Prabowo Subianto',
      email: 'ahmad.prabowo@email.com',
      instansi: 'Universitas Jimbaran',
      jurusan: 'Sistem Informasi',
      statusPendidikan: 'Kuliah',
      jenjangPendidikan: 'S1',
      temaMagang: 'Pengembangan Sistem Informasi Kepegawaian',
      bidang: 'Sekretariat',
      status: 'Pending',
      tanggalMulai: '2024-02-01',
      tanggalSelesai: '2024-04-30',
      suratPengantar: 'surat-pengantar-ahmad.pdf',
      proposalMagang: 'files/proposal-1.pdf',
      cv: 'files/cv-1.pdf',
      bakesbangprov: 'files/bakesbangprov-1.pdf',
      bakesbangsda: 'files/bakesbangsda-1.pdf',
      ktp: 'files/ktpdummy-1.pdf',
      foto: 'https://randomuser.me/api/portraits/men/32.jpg',
      pakta: 'true',
      createdAt: '2024-01-12',
    },
    {
      id: 2,
      nim: '0202345678',
      nama: 'Siti Aminah',
      email: 'siti.aminah@email.com',
      instansi: 'Universitas Gadjah Mada',
      jurusan: 'Manajemen',
      statusPendidikan: 'Kuliah',
      jenjangPendidikan: 'S1',
      temaMagang: 'Manajemen Proyek dan Analisis Bisnis',
      bidang: 'Statistika',
      status: 'Pending',
      tanggalMulai: '2024-03-01',
      tanggalSelesai: '2024-05-31',
      suratPengantar: 'surat-pengantar-siti.pdf',
      proposalMagang: 'files/proposal-1.pdf',
      cv: 'files/cv-1.pdf',
      bakesbangprov: 'files/bakesbangprov-1.pdf',
      bakesbangsda: 'files/bakesbangsda-1.pdf',
      ktp: 'files/ktpdummy-1.pdf',
      foto: 'https://randomuser.me/api/portraits/women/44.jpg',
      pakta: 'true',
      createdAt: '2024-02-02',
    },
    {
      id: 3,
      nim: '0505678901',
      nama: 'Andi Nugroho',
      email: 'andi.nugroho@email.com',
      instansi: 'Universitas Diponegoro',
      jurusan: 'Hukum',
      statusPendidikan: 'Lulus Kuliah',
      jenjangPendidikan: 'S1',
      temaMagang: 'Analisis Regulasi dan Perancangan Kebijakan',
      bidang: 'Tata Kelola Informasi',
      status: 'Pending',
      tanggalMulai: '2024-02-15',
      tanggalSelesai: '2024-05-15',
      suratPengantar: 'surat-pengantar-andi.pdf',
      proposalMagang: 'files/proposal-1.pdf',
      cv: 'files/cv-1.pdf',
      bakesbangprov: 'files/bakesbangprov-1.pdf',
      bakesbangsda: 'files/bakesbangsda-1.pdf',
      ktp: 'files/ktpdummy-1.pdf',
      foto: 'https://randomuser.me/api/portraits/men/51.jpg',
      pakta: 'true',
      createdAt: '2024-01-25',
    },
  ]);

  // === State Filter & Modal ===
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedPeserta, setSelectedPeserta] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // === Pagination Setup ===
  const ITEMS_PER_PAGE_PENDING = 5;
  const ITEMS_PER_PAGE_APPROVED = 5;

  const [currentPendingPage, setCurrentPendingPage] = useState(1);
  const [currentApprovedPage, setCurrentApprovedPage] = useState(1);

  // === Data Turunan ===
  const pendingPeserta = pesertaMagang.filter((p) => p.status === 'Pending');
  const approvedPeserta = pesertaMagang.filter(
    (p) => p.status === 'Diterima' || p.status === 'Ditolak'
  );

  // === Filter Approved ===
  const filteredApprovedPeserta = approvedPeserta.filter((p) => {
    const term = searchTerm.toLowerCase();

    const matchUmum =
      p.nama.toLowerCase().includes(term) ||
      p.email.toLowerCase().includes(term) ||
      p.nim.toLowerCase().includes(term) ||
      p.instansi.toLowerCase().includes(term) ||
      p.jurusan.toLowerCase().includes(term) ||
      p.bidang.toLowerCase().includes(term) ||
      p.status.toLowerCase().includes(term);

    const matchTanggal = searchDate
      ? [
          p.createdAt,
          p.tanggalMulai,
          p.tanggalSelesai,
          p.updatedAt || p.createdAt,
        ]
          .filter(Boolean) // buang null/undefined
          .map((d) => new Date(d).toISOString().split('T')[0]) // ubah format ke yyyy-mm-dd
          .includes(searchDate) // cocokkan dengan searchDate
      : true;

    const matchStatus =
      statusFilter === 'all' ||
      p.status.toLowerCase() === statusFilter.toLowerCase();

    return matchUmum && matchTanggal && matchStatus;
  });

  // === Pagination Helper ===
  const paginate = (data, page, itemsPerPage) =>
    data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // === Paginated Data ===
  const paginatedPendingPeserta = paginate(
    pendingPeserta,
    currentPendingPage,
    ITEMS_PER_PAGE_PENDING
  );
  const paginatedApprovedPeserta = paginate(
    filteredApprovedPeserta,
    currentApprovedPage,
    ITEMS_PER_PAGE_APPROVED
  );

  const totalPendingPages = Math.ceil(
    pendingPeserta.length / ITEMS_PER_PAGE_PENDING
  );
  const totalApprovedPages = Math.ceil(
    filteredApprovedPeserta.length / ITEMS_PER_PAGE_APPROVED
  );

  // === Aksi ACC / Tolak ===
  const handleAccPeserta = (id) => {
    setPesertaMagang((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: 'Diterima', updatedAt: new Date() } : p
      )
    );
  };

  const handleTolakPeserta = (id) => {
    setPesertaMagang((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: 'Ditolak', updatedAt: new Date() } : p
      )
    );
  };

  // === Modal Handler ===
  const handleOpenDetail = (peserta) => {
    setSelectedPeserta(peserta);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailModalOpen(false);
    setSelectedPeserta(null);
  };

  // === Export Excel ===
  const handleExportExcelHistory = () => {
    const exportData = filteredApprovedPeserta.map((p) => ({
      Nama: p.nama,
      Email: p.email,
      Instansi: p.instansi,
      Jurusan: p.jurusan,
      Nim_Nis: p.nim,
      Status_Pendidikan: p.statusPendidikan,
      Jenjang_Pendidikan: p.jenjangPendidikan,
      Tema_Magang: p.temaMagang,
      'Periode Usulan':
        p.tanggalMulai && p.tanggalSelesai
          ? `${new Date(p.tanggalMulai).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })} - ${new Date(p.tanggalSelesai).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}`
          : '-',
      Bidang: p.bidang,
      'Tanggal Pengajuan': new Date(p.createdAt).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      Status: p.status,
      'Tanggal Keputusan': new Date(
        p.updatedAt || p.createdAt
      ).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      Surat_Pengantar: p.suratPengantar,
      Proposal_Magang: p.proposalMagang,
      cv: p.cv,
      ktp: p.ktp,
      BakesbangpolSDA: p.bakesbangsda,
      BakesbangpolProv: p.bakesbangprov,
    }));

    // Buat worksheet dengan judul di baris pertama
    const ws = XLSX.utils.aoa_to_sheet([['Riwayat Persetujuan Ajuan Magang']]);

    // Tambahkan data peserta mulai baris ke-3 (baris ke-2 kosong untuk spasi)
    XLSX.utils.sheet_add_json(ws, exportData, {
      origin: 'A3',
      skipHeader: false,
    });

    // Gabungkan sel untuk judul (misalnya dari A1 sampai kolom terakhir data)
    const range = XLSX.utils.decode_range(ws['!ref']);
    ws['!merges'] = [
      {
        s: { r: 0, c: 0 }, // mulai dari A1
        e: { r: 0, c: range.e.c }, // sampai kolom terakhir
      },
    ];

    // Tebalkan judul
    if (!ws['A1'].s) ws['A1'].s = {};
    ws['A1'].s = { font: { bold: true, sz: 14 } };

    // Buat tanggal export (YYYY-MM-DD)
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    // Buat workbook dan masukkan worksheet dengan judul
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, ws, 'PesertaMagang');

    // Simpan file
    XLSX.writeFile(workbook, `RiwayatPersetujuanAkun_${formattedDate}.xlsx`);
  };

  return (
    <div className="space-y-6">
      {/* Tabel Akun Belum Di-ACC */}
      <div className="overflow-x-auto bg-white shadow rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-gray-700 px-4 py-3 border-b rounded-t-lg">
          Ajuan Magang Menunggu Persetujuan
        </h3>
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#006DA6] text-white">
            <tr>
              <th className="px-4 py-3">Nama Peserta</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Instansi</th>
              <th className="px-4 py-3">Jurusan</th>
              <th className="px-4 py-3">Periode Usulan</th>
              <th className="px-4 py-3">Bidang Usulan</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPendingPeserta.map((peserta) => (
              <tr key={peserta.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{peserta.nama}</td>
                <td className="px-4 py-3">{peserta.email}</td>
                <td className="px-4 py-3">{peserta.instansi}</td>
                <td className="px-4 py-3">{peserta.jurusan}</td>
                <td className="px-4 py-3">
                  {peserta.tanggalMulai && peserta.tanggalSelesai
                    ? `${new Date(peserta.tanggalMulai).toLocaleDateString(
                        'id-ID',
                        {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        }
                      )} - ${new Date(
                        peserta.tanggalSelesai
                      ).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}`
                    : '-'}
                </td>
                <td className="px-4 py-3">{peserta.bidang}</td>
                <td className="px-4 py-3 flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => handleOpenDetail(peserta)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Detail
                  </button>
                  <button
                    onClick={() => handleAccPeserta(peserta.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Terima
                  </button>
                  <button
                    onClick={() => handleTolakPeserta(peserta.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Tolak
                  </button>
                </td>
              </tr>
            ))}
            {paginatedPendingPeserta.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  Tidak ada akun menunggu persetujuan.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Pending */}
        {totalPendingPages > 1 && (
          <div className="flex justify-between items-center p-4">
            <p className="text-sm text-gray-600">
              Menampilkan{' '}
              <span className="font-medium">
                {(currentPendingPage - 1) * ITEMS_PER_PAGE_PENDING + 1}
              </span>{' '}
              -{' '}
              <span className="font-medium">
                {Math.min(
                  currentPendingPage * ITEMS_PER_PAGE_PENDING,
                  filteredPendingPeserta.length
                )}
              </span>{' '}
              dari{' '}
              <span className="font-medium">
                {filteredPendingPeserta.length}
              </span>{' '}
              hasil
            </p>
            <div className="flex space-x-1">
              <button
                onClick={() =>
                  setCurrentPendingPage((prev) => Math.max(prev - 1, 1))
                }
                disabled={currentPendingPage === 1}
                className="px-3 py-1 border rounded hover:bg-gray-100 text-sm"
              >
                Previous
              </button>
              {[...Array(totalPendingPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPendingPage(i + 1)}
                  className={`px-3 py-1 border rounded text-sm ${
                    currentPendingPage === i + 1
                      ? 'bg-[#006DA6] text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPendingPage((prev) =>
                    Math.min(prev + 1, totalPendingPages)
                  )
                }
                disabled={currentPendingPage === totalPendingPages}
                className="px-3 py-1 border rounded hover:bg-gray-100 text-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* // === Modal Detail === */}
      {isDetailModalOpen && selectedPeserta && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          onClick={handleCloseDetail}
        >
          <div
            className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 relative overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Foto Peserta */}
            <div className="flex justify-center mb-4">
              <img
                src={selectedPeserta.foto || '/default-user.png'}
                alt="Foto Peserta"
                className="w-28 h-28 rounded-full object-cover border-2 border-gray-300"
              />
            </div>

            <h2 className="text-xl font-semibold mb-4 text-center text-[#006DA6]">
              Detail Ajuan Magang
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {/* Data Umum */}
              <div className="border rounded p-2">
                <label className="text-gray-600 text-xs">Nama Lengkap</label>
                <p className="text-gray-800 font-medium">
                  {selectedPeserta.nama}
                </p>
              </div>
              <div className="border rounded p-2">
                <label className="text-gray-600 text-xs">Email</label>
                <p className="text-gray-800 font-medium">
                  {selectedPeserta.email}
                </p>
              </div>
              <div className="border rounded p-2">
                <label className="text-gray-600 text-xs">NIM/NIS</label>
                <p className="text-gray-800 font-medium">
                  {selectedPeserta.nim}
                </p>
              </div>
              <div className="border rounded p-2">
                <label className="text-gray-600 text-xs">Instansi</label>
                <p className="text-gray-800 font-medium">
                  {selectedPeserta.instansi}
                </p>
              </div>
              <div className="border rounded p-2">
                <label className="text-gray-600 text-xs">Jurusan</label>
                <p className="text-gray-800 font-medium">
                  {selectedPeserta.jurusan}
                </p>
              </div>
              <div className="border rounded p-2">
                <label className="text-gray-600 text-xs">
                  Status Pendidikan
                </label>
                <p className="text-gray-800 font-medium">
                  {selectedPeserta.statusPendidikan}
                </p>
              </div>
              <div className="border rounded p-2">
                <label className="text-gray-600 text-xs">
                  Jenjang Pendidikan
                </label>
                <p className="text-gray-800 font-medium">
                  {selectedPeserta.jenjangPendidikan}
                </p>
              </div>
              <div className="border rounded p-2 sm:col-span-2">
                <label className="text-gray-600 text-xs">Tema Magang</label>
                <p className="text-gray-800 font-medium">
                  {selectedPeserta.temaMagang}
                </p>
              </div>
              <div className="border rounded p-2">
                <label className="text-gray-600 text-xs">Bidang</label>
                <p className="text-gray-800 font-medium">
                  {selectedPeserta.bidang}
                </p>
              </div>
              <div className="border rounded p-2">
                <label className="text-gray-600 text-xs">Status Ajuan</label>
                <p className="text-gray-800 font-medium">
                  {selectedPeserta.status}
                </p>
              </div>

              {/* Periode Magang */}
              <div className="border rounded p-2">
                <label className="text-gray-600 text-xs">Tanggal Mulai</label>
                <p className="text-gray-800 font-medium">
                  {new Date(selectedPeserta.tanggalMulai).toLocaleDateString(
                    'id-ID'
                  )}
                </p>
              </div>
              <div className="border rounded p-2">
                <label className="text-gray-600 text-xs">Tanggal Selesai</label>
                <p className="text-gray-800 font-medium">
                  {new Date(selectedPeserta.tanggalSelesai).toLocaleDateString(
                    'id-ID'
                  )}
                </p>
              </div>
              <div className="border rounded p-2 sm:col-span-2">
                <label className="text-gray-600 text-xs">
                  Tanggal Pengajuan
                </label>
                <p className="text-gray-800 font-medium">
                  {new Date(selectedPeserta.createdAt).toLocaleDateString(
                    'id-ID'
                  )}
                </p>
              </div>

              {/* File Upload */}
              <div className="border rounded p-2">
                <label className="text-gray-600 text-xs">
                  Surat Pengantar{' '}
                </label>
                <a
                  href={`/${selectedPeserta.suratPengantar}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  Lihat File
                </a>
              </div>
              <div className="border rounded p-2">
                <label className="text-gray-600 text-xs">
                  Proposal Magang{' '}
                </label>
                <a
                  href={`/${selectedPeserta.proposalMagang}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  Lihat File
                </a>
              </div>
              <div className="border rounded p-2">
                <label className="text-gray-600 text-xs">CV </label>
                <a
                  href={`/${selectedPeserta.cv}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  Lihat File
                </a>
              </div>
              <div className="border rounded p-2">
                <label className="text-gray-600 text-xs">KTP </label>
                <a
                  href={`/${selectedPeserta.ktp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  Lihat File
                </a>
              </div>
              <div className="border rounded p-2">
                <label className="text-gray-600 text-xs">
                  Surat Bakesbangpol Sidoarjo{' '}
                </label>
                <a
                  href={`/${selectedPeserta.bakesbangsda}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  Lihat File
                </a>
              </div>
              <div className="border rounded p-2">
                <label className="text-gray-600 text-xs">
                  Surat Bakesbangpol Provinsi{' '}
                </label>
                <a
                  href={`/${selectedPeserta.bakesbangprov}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  Lihat File
                </a>
              </div>
            </div>

            {/* Tombol Tutup */}
            <div className="mt-6 text-right">
              <button
                onClick={handleCloseDetail}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Tabel History Akun yang Sudah Disetujui */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <div className="flex justify-between items-center px-4 py-3">
          <h3 className="text-lg font-semibold text-gray-700">
            Riwayat Persetujuan Ajuan Magang
          </h3>
          <div className="flex gap-2">
            <button
              onClick={handleExportExcelHistory}
              className="flex items-center gap-2 bg-[#006DA6] hover:bg-[#00456a] text-white px-3 py-1 text-sm rounded transition-colors"
            >
              <Download size={16} />
              <span>Export Riwayat Ajuan</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3 px-4 pb-3">
          <input
            type="text"
            placeholder="Cari berdasarkan nama, email, instansi, jurusan, dan bidang..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentApprovedPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-[#006DA6] focus:border-[#006DA6] text-sm w-full sm:w-1/2"
          />

          <input
            type="date"
            value={searchDate}
            onChange={(e) => {
              setSearchDate(e.target.value);
              setCurrentApprovedPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-[#006DA6] focus:border-[#006DA6] text-sm w-full sm:w-1/3"
          />

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentApprovedPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-[#006DA6] focus:border-[#006DA6] text-sm w-full sm:w-1/4"
          >
            <option value="all">Semua Status</option>
            <option value="Diterima">Diterima</option>
            <option value="Ditolak">Ditolak</option>
          </select>
        </div>
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-3">Nama Peserta</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Instansi</th>
              <th className="px-4 py-3">Jurusan</th>
              <th className="px-4 py-3">Periode Usulan</th>
              <th className="px-4 py-3">Bidang Usulan</th>
              <th className="px-4 py-3">Tanggal Pengajuan</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Tanggal Keputusan</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedApprovedPeserta.map((peserta) => (
              <tr key={peserta.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{peserta.nama}</td>
                <td className="px-4 py-3">{peserta.email}</td>
                <td className="px-4 py-3">{peserta.instansi}</td>
                <td className="px-4 py-3">{peserta.jurusan}</td>
                <td className="px-4 py-3">
                  {peserta.tanggalMulai && peserta.tanggalSelesai
                    ? `${new Date(peserta.tanggalMulai).toLocaleDateString(
                        'id-ID',
                        {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        }
                      )} - ${new Date(
                        peserta.tanggalSelesai
                      ).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}`
                    : '-'}
                </td>
                <td className="px-4 py-3">{peserta.bidang}</td>
                <td className="px-4 py-3">{peserta.createdAt}</td>
                <td className="px-4 py-3">{peserta.status}</td>
                <td className="px-4 py-3">
                  {new Date(
                    peserta.updatedAt || peserta.createdAt
                  ).toLocaleDateString()}
                </td>
                {/* Aksi */}
                <td className="px-4 py-3 text-center relative">
                  <button
                    onClick={() => {
                      handleOpenDetail(peserta);
                      setOpenMenuId(null);
                    }}
                    className="p-1 rounded hover:bg-gray-200"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {paginatedApprovedPeserta.length === 0 && (
              <tr>
                <td colSpan="11" className="text-center py-4 text-gray-500">
                  Belum ada akun yang disetujui.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination History Approved */}
        {totalApprovedPages > 1 && (
          <div className="flex justify-between items-center p-4">
            <p className="text-sm text-gray-600">
              Menampilkan{' '}
              <span className="font-medium">
                {(currentApprovedPage - 1) * ITEMS_PER_PAGE_APPROVED + 1}
              </span>{' '}
              -{' '}
              <span className="font-medium">
                {Math.min(
                  currentApprovedPage * ITEMS_PER_PAGE_APPROVED,
                  filteredApprovedPeserta.length
                )}
              </span>{' '}
              dari{' '}
              <span className="font-medium">
                {filteredApprovedPeserta.length}
              </span>{' '}
              hasil
            </p>
            <div className="flex space-x-1">
              <button
                onClick={() =>
                  setCurrentApprovedPage((prev) => Math.max(prev - 1, 1))
                }
                disabled={currentApprovedPage === 1}
                className="px-3 py-1 border rounded hover:bg-gray-100 text-sm"
              >
                Previous
              </button>
              {[...Array(totalApprovedPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentApprovedPage(i + 1)}
                  className={`px-3 py-1 border rounded text-sm ${
                    currentApprovedPage === i + 1
                      ? 'bg-green-600 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentApprovedPage((prev) =>
                    Math.min(prev + 1, totalApprovedPages)
                  )
                }
                disabled={currentApprovedPage === totalApprovedPages}
                className="px-3 py-1 border rounded hover:bg-gray-100 text-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
