import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import autoTable from 'jspdf-autotable';

const ITEMS_PER_PAGE_PENDING = 5;

export default function ManageVerifAkun() {
  // === State Utama ===
  const [pesertaMagang, setPesertaMagang] = useState([
    {
      id: 1,
      nik: '3175091501990001',
      nim: '0101234567',
      nama: 'Ahmad Prabowo Subianto',
      email: 'ahmad.prabowo@email.com',
      phone: '081234567890',
      alamat: 'Jl. Merdeka No.10, Jakarta',
      instansi: 'Universitas Jimbaran',
      jurusan: 'Sistem Informasi',
      bidang: '',
      status: 'Pending',
      createdAt: '2024-01-12',
      tanggalMulai: '',
      tanggalSelesai: '',
      progress: 0,
      foto: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      id: 2,
      nik: '3374092202000002',
      nim: '0202345678',
      nama: 'Siti Aminah',
      email: 'siti.aminah@email.com',
      phone: '081234567891',
      alamat: 'Jl. Kaliurang Km.7, Yogyakarta',
      instansi: 'Universitas Gadjah Mada',
      jurusan: 'Manajemen',
      bidang: '',
      status: 'Pending',
      createdAt: '2024-02-02',
      tanggalMulai: '',
      tanggalSelesai: '',
      progress: 0,
      foto: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      id: 3,
      nik: '3374011802000005',
      nim: '0505678901',
      nama: 'Andi Nugroho',
      email: 'andi.nugroho@email.com',
      phone: '081234567894',
      alamat: 'Jl. Siliwangi No.12, Semarang',
      instansi: 'Universitas Diponegoro',
      jurusan: 'Hukum',
      bidang: '',
      status: 'Pending',
      createdAt: '2024-01-25',
      tanggalMulai: '',
      tanggalSelesai: '',
      progress: 0,
      foto: 'https://randomuser.me/api/portraits/men/51.jpg',
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
      p.nik.toLowerCase().includes(term) ||
      p.instansi.toLowerCase().includes(term) ||
      p.jurusan.toLowerCase().includes(term) ||
      p.alamat.toLowerCase().includes(term) ||
      p.status.toLowerCase().includes(term);

    const matchTanggal = searchDate
      ? new Date(p.createdAt).toISOString().split('T')[0] === searchDate
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

  // === Export PDF ===
  const handleExportPDFHistory = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFontSize(13);
    doc.text('History Persetujuan Akun Peserta Magang', 14, 15);

    const tableColumn = [
      'Nama',
      'Email',
      'NIM/NIS',
      'Telepon',
      'Instansi',
      'Jurusan',
      'Alamat',
      'Tanggal',
      'Status',
    ];

    const tableRows = filteredApprovedPeserta.map((p) => [
      p.nama,
      p.email,
      p.nim,
      p.phone,
      p.instansi,
      p.jurusan,
      p.alamat.length > 35 ? p.alamat.slice(0, 32) + '...' : p.alamat,
      new Date(p.createdAt).toLocaleDateString('id-ID'),
      p.status,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      styles: {
        fontSize: 8,
        cellPadding: 2.5,
        overflow: 'linebreak',
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        halign: 'center',
      },
      columnStyles: {
        0: { cellWidth: 30 }, // Nama
        1: { cellWidth: 40 }, // Email
        2: { cellWidth: 25 }, // NIM/NIS
        3: { cellWidth: 25 }, // Telepon
        4: { cellWidth: 35 }, // Instansi
        5: { cellWidth: 30 }, // Jurusan
        6: { cellWidth: 40 }, // Alamat
        7: { cellWidth: 20 }, // Tanggal
        8: { cellWidth: 20 }, // Status
      },
      margin: { top: 20 },
    });

    doc.save('RiwayatPersetujuanAkun.pdf');
  };

  // === Export Excel ===
  const handleExportExcelHistory = () => {
    const exportData = filteredApprovedPeserta.map((p) => ({
      Nama: p.nama,
      Email: p.email,
      Instansi: p.instansi,
      Bidang: p.bidang,
      Progres: `${p.progress}%`,
      Status: p.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'PesertaMagang');

    XLSX.writeFile(workbook, 'RiwayatPersetujuanAkun.xlsx');
  };

  return (
    <div className="space-y-6">
      {/* Tabel Akun Belum Di-ACC */}
      <div className="overflow-x-auto bg-white shadow rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-gray-700 px-4 py-3 border-b rounded-t-lg">
          Akun Peserta Magang Menunggu Persetujuan
        </h3>
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#ddb900] text-white">
            <tr>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Instansi</th>
              <th className="px-4 py-3">Jurusan</th>
              <th className="px-4 py-3">Tanggal Daftar</th>
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
                  {new Date(peserta.createdAt).toLocaleDateString()}
                </td>
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

      {isDetailModalOpen && selectedPeserta && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          onClick={handleCloseDetail}
        >
          <div
            className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative overflow-y-auto max-h-[90vh]"
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
              Detail Peserta Magang
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
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
                <label className="text-gray-600 text-xs">NIK</label>
                <p className="text-gray-800 font-medium">
                  {selectedPeserta.nik}
                </p>
              </div>
              <div className="border rounded p-2">
                <label className="text-gray-600 text-xs">No Telepon</label>
                <p className="text-gray-800 font-medium">
                  {selectedPeserta.phone}
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
                <label className="text-gray-600 text-xs">Alamat</label>
                <p className="text-gray-800 font-medium">
                  {selectedPeserta.alamat}
                </p>
              </div>
              <div className="border rounded p-2 sm:col-span-2">
                <label className="text-gray-600 text-xs">Tanggal Daftar</label>
                <p className="text-gray-800 font-medium">
                  {new Date(selectedPeserta.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

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
            Riwayat Persetujuan Akun Peserta Magang
          </h3>
          <div className="flex gap-2">
            <button
              onClick={handleExportExcelHistory}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-sm rounded"
            >
              Export Excel
            </button>
            <button
              onClick={handleExportPDFHistory}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm rounded"
            >
              Export PDF
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3 px-4 pb-3">
          <input
            type="text"
            placeholder="Cari peserta (nama, instansi, status, dll)..."
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
          <thead className="bg-[#002942] text-white">
            <tr>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">NIM / NIS</th>
              <th className="px-4 py-3">No Telepon</th>
              <th className="px-4 py-3">NIK</th>
              <th className="px-4 py-3">Instansi</th>
              <th className="px-4 py-3">Jurusan</th>
              <th className="px-4 py-3">Alamat</th>
              <th className="px-4 py-3">Tanggal Daftar</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Tanggal Keputusan</th>
            </tr>
          </thead>
          <tbody>
            {paginatedApprovedPeserta.map((peserta) => (
              <tr key={peserta.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{peserta.nama}</td>
                <td className="px-4 py-3">{peserta.email}</td>
                <td className="px-4 py-3">{peserta.nim}</td>
                <td className="px-4 py-3">{peserta.phone}</td>
                <td className="px-4 py-3">{peserta.nik}</td>
                <td className="px-4 py-3">{peserta.instansi}</td>
                <td className="px-4 py-3">{peserta.jurusan}</td>
                <td className="px-4 py-3">{peserta.alamat}</td>
                <td className="px-4 py-3">{peserta.createdAt}</td>
                <td className="px-4 py-3">{peserta.status}</td>
                <td className="px-4 py-3">
                  {new Date(
                    peserta.updatedAt || peserta.createdAt
                  ).toLocaleDateString()}
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
