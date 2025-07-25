import React, { useState } from 'react';
import { Eye, Edit } from 'lucide-react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import autoTable from 'jspdf-autotable';

const ITEMS_PER_PAGE = 5;
const ITEMS_PER_PAGE_PENDING = 5;

export default function ManagePesertaMagang() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPeserta, setSelectedPeserta] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Eksport PDF dan Excel Akun Peserta Magang
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Daftar Akun Peserta Magang', 14, 15);

    const tableColumn = [
      'Nama',
      'Email',
      'Instansi',
      'Bidang',
      'Progres',
      'Status',
    ];
    const tableRows = pesertaData.map((p) => [
      p.nama,
      p.email,
      p.instansi,
      p.bidang,
      `${p.progress}%`,
      p.status,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      styles: { fontSize: 10 },
    });

    doc.save('PesertaMagang.pdf');
  };

  const handleExportExcel = () => {
    const exportData = pesertaData.map((p) => ({
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

    XLSX.writeFile(workbook, 'PesertaMagang.xlsx');
  };
  // Eksport PDF dan Excel Akun Peserta Magang
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

    const tableRows = approvedPeserta.map((p) => [
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

  const handleExportExcelHistory = () => {
    const exportData = approvedPeserta.map((p) => ({
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

  // Tambahkan state form edit
  const [formData, setFormData] = useState(null);

  const openDetailModal = (peserta) => {
    setSelectedPeserta(peserta);
    setFormData({ ...peserta });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPeserta(null);
    setFormData(null);
  };

  // Update form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Simpan data (dummy handler)
  const handleSave = () => {
    console.log('Data yang disimpan:', formData);
    closeModal();
  };

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

  const pesertaData = [
    {
      id: 1,
      nik: '3175091501990001',
      nim: '0101234567',
      nama: 'Ahmad Rizki Pratama',
      email: 'ahmad.rizki@email.com',
      phone: '081234567890',
      alamat: 'Jl. Merdeka No.10, Jakarta',
      instansi: 'Universitas Indonesia',
      jurusan: 'Sistem Informasi',
      bidang: 'Tata Kelola Informatika',
      status: 'Disetujui',
      createdAt: '2024-01-12',
      tanggalMulai: '2024-01-15',
      tanggalSelesai: '2024-04-15',
      progress: 75,
      foto: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      id: 2,
      nik: '3273011801980003',
      nim: '0303456789',
      nama: 'Budi Santoso',
      email: 'budi.santoso@email.com',
      phone: '081234567892',
      alamat: 'Jl. Dago Atas No.5, Bandung',
      instansi: 'Institut Teknologi Bandung',
      jurusan: 'Teknik Elektro',
      bidang: 'Infrastruktur & Keamanan TIK',
      status: 'Selesai',
      createdAt: '2024-01-20',
      tanggalMulai: '2023-10-15',
      tanggalSelesai: '2024-01-15',
      progress: 100,
      foto: 'https://randomuser.me/api/portraits/men/48.jpg',
    },
    {
      id: 3,
      nik: '3578020402000004',
      nim: '0404567890',
      nama: 'Lestari Wulandari',
      email: 'lestari.wulan@email.com',
      phone: '081234567893',
      alamat: 'Jl. Dharmawangsa No.8, Surabaya',
      instansi: 'Universitas Airlangga',
      jurusan: 'Ilmu Komunikasi',
      bidang: 'Pengelolaan Informasi dan Komunikasi Publik',
      status: 'Disetujui',
      createdAt: '2024-03-05',
      tanggalMulai: '2024-03-01',
      tanggalSelesai: '2024-06-01',
      progress: 40,
      foto: 'https://randomuser.me/api/portraits/women/28.jpg',
    },
    {
      id: 4,
      nik: '3374031001990006',
      nim: '0606789012',
      nama: 'Rika Putri',
      email: 'rika.putri@email.com',
      phone: '081234567895',
      alamat: 'Jl. Slamet Riyadi No.3, Solo',
      instansi: 'Universitas Sebelas Maret',
      jurusan: 'Ekonomi',
      bidang: 'Statistik',
      status: 'Disetujui',
      createdAt: '2024-01-18',
      tanggalMulai: '2024-01-10',
      tanggalSelesai: '2024-04-10',
      progress: 60,
      foto: 'https://randomuser.me/api/portraits/women/37.jpg',
    },
  ];

  const filteredPeserta = pesertaData.filter((peserta) => {
    const matchesSearch =
      peserta.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      peserta.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      peserta.instansi.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || peserta.status.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPeserta.length / ITEMS_PER_PAGE);
  const paginatedPeserta = filteredPeserta.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'disetujui':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-700 bg-yellow-100';
      case 'selesai':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleOpenDetail = (peserta) => {
    setSelectedPeserta(peserta);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailModalOpen(false);
    setSelectedPeserta(null);
  };

  const handleAccPeserta = (id) => {
    setPesertaMagang((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: 'Disetujui', updatedAt: new Date() } : p
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

  const pendingPeserta = pesertaMagang.filter((p) => p.status === 'Pending');
  const approvedPeserta = pesertaMagang.filter(
    (p) => p.status === 'Disetujui' || p.status === 'Ditolak'
  );

  const [currentPendingPage, setCurrentPendingPage] = useState(1);

  const filteredPendingPeserta = pendingPeserta.filter((p) => !p.isApproved);
  const totalPendingPages = Math.ceil(
    filteredPendingPeserta.length / ITEMS_PER_PAGE_PENDING
  );

  const paginatedPendingPeserta = pendingPeserta.slice(
    (currentPendingPage - 1) * ITEMS_PER_PAGE_PENDING,
    currentPendingPage * ITEMS_PER_PAGE_PENDING
  );

  //  Pagination Untuk Tabel Approved Akun Peserta Magang
  const ITEMS_PER_PAGE_APPROVED = 5;
  const [currentApprovedPage, setCurrentApprovedPage] = useState(1);

  const filteredApprovedPeserta = approvedPeserta.filter((p) => p.isApproved);
  const totalApprovedPages = Math.ceil(
    filteredApprovedPeserta.length / ITEMS_PER_PAGE_APPROVED
  );

  const paginatedApprovedPeserta = approvedPeserta.slice(
    (currentApprovedPage - 1) * ITEMS_PER_PAGE_APPROVED,
    currentApprovedPage * ITEMS_PER_PAGE_APPROVED
  );

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <input
            type="text"
            placeholder="Cari peserta..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-[#006DA6] focus:border-[#006DA6]"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-[#006DA6] focus:border-[#006DA6]"
          >
            <option value="all">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="pending">Pending</option>
            <option value="selesai">Selesai</option>
          </select>
        </div>
      </div>

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
                    Setujui
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
          onClick={closeModal}
        >
          <div
            className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-5 text-white bg-red-500 hover:bg-red-600 rounded-full w-7 h-7 flex items-center justify-center"
              onClick={closeModal}
            >
              ✕
            </button>

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

      {/* Tabel + Pagination */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <div className="flex justify-between items-center px-4 py-3">
          <h3 className="text-lg font-semibold text-gray-700">
            Akun Peserta Magang
          </h3>
          <div className="flex gap-2">
            <button
              onClick={handleExportExcel}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-sm rounded"
            >
              Export Excel
            </button>
            <button
              onClick={handleExportPDF}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm rounded"
            >
              Export PDF
            </button>
          </div>
        </div>
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#006DA6] text-white">
            <tr>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Instansi</th>
              <th className="px-4 py-3">Bidang</th>
              <th className="px-4 py-3">Progres (%)</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPeserta.map((peserta) => (
              <tr key={peserta.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{peserta.nama}</td>
                <td className="px-4 py-3">{peserta.email}</td>
                <td className="px-4 py-3">{peserta.instansi}</td>
                <td className="px-4 py-3">{peserta.bidang}</td>
                <td className="px-4 py-3">{peserta.progress}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(
                      peserta.status
                    )}`}
                  >
                    {peserta.status}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    onClick={() => openDetailModal(peserta)}
                    className="text-[#006DA6] hover:underline flex items-center text-sm"
                  >
                    <Edit size={16} className="mr-1" />
                  </button>
                </td>
              </tr>
            ))}
            {paginatedPeserta.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  Tidak ada data peserta ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination langsung di bawah tabel */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-3 border-t">
          <p className="text-sm text-gray-700 mb-2 sm:mb-0">
            Menampilkan{' '}
            <span className="font-medium">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}
            </span>{' '}
            -{' '}
            <span className="font-medium">
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredPeserta.length)}
            </span>{' '}
            dari <span className="font-medium">{filteredPeserta.length}</span>{' '}
            hasil
          </p>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded hover:bg-gray-100 text-sm disabled:opacity-50"
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
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded hover:bg-gray-100 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/*Modal Detail (Editable Form)*/}
      {isModalOpen && formData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          onClick={closeModal}
        >
          <div
            className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-5 text-gray-500 hover:text-red-500"
              onClick={closeModal}
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4 text-[#006DA6]">
              Edit Data Peserta Magang
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {[
                { label: 'Nama', name: 'nama' },
                { label: 'Email', name: 'email' },
                { label: 'NIM', name: 'nim' },
                { label: 'NIK', name: 'nik' },
                { label: 'Telepon', name: 'phone' },
                { label: 'Alamat', name: 'alamat' },
                { label: 'Instansi', name: 'instansi' },
                { label: 'Jurusan', name: 'jurusan' },
                {
                  label: 'Bidang',
                  name: 'bidang',
                  type: 'select',
                  options: [
                    'Tata Kelola Informatika',
                    'Infrastruktur & Keamanan TIK',
                    'Pengelolaan Informasi dan Komunikasi Publik',
                    'Sekretariat',
                    'Statistik',
                  ],
                }, // ✅ dropdown
                {
                  label: 'Status',
                  name: 'status',
                  type: 'select',
                  options: ['Aktif', 'Selesai', 'Ditolak', 'Pending'],
                },
                { label: 'Tanggal Mulai', name: 'tanggalMulai', type: 'date' },
                {
                  label: 'Tanggal Selesai',
                  name: 'tanggalSelesai',
                  type: 'date',
                },
                {
                  label: 'Progress (%)',
                  name: 'progress',
                  type: 'number',
                  readOnly: true,
                },
              ].map(
                ({ label, name, type = 'text', readOnly = false, options }) => (
                  <div key={name}>
                    <label className="block mb-1 text-gray-700">{label}</label>

                    {type === 'select' ? (
                      <select
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#006DA6] focus:border-[#006DA6]"
                      >
                        {options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={type}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        readOnly={readOnly}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#006DA6] focus:border-[#006DA6] ${
                          readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
                        }`}
                      />
                    )}
                  </div>
                )
              )}
            </div>
            <div className="mt-6 text-right">
              <button
                onClick={handleSave}
                className="bg-[#006DA6] text-white px-4 py-2 rounded hover:bg-[#00517c] transition"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabel History Akun yang Sudah Disetujui */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <div className="flex justify-between items-center px-4 py-3">
          <h3 className="text-lg font-semibold text-gray-700">
            Akun Peserta Magang
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
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#76b200] text-white">
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
