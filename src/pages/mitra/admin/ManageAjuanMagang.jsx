import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

// Helper untuk format tanggal (bisa ditaruh di file terpisah)
const formatTgl = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatPeriode = (mulai, selesai) => {
  if (!mulai || !selesai) return '-';
  return `${formatTgl(mulai)} - ${formatTgl(selesai)}`;
};

// Helper untuk badge status
const getStatusBadge = (status) => {
  switch (status) {
    case 'DITERIMA':
      return 'bg-green-100 text-green-800';
    case 'DITOLAK':
      return 'bg-red-100 text-red-800';
    case 'PENDING':
    default:
      return 'bg-yellow-100 text-yellow-800';
  }
};

// Placeholder icons (ganti dengan import asli Anda jika ada)
const DownloadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    />
  </svg>
);
const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-.274 1.008-.67 1.944-1.164 2.793M2.458 12c1.274 4.057 5.064 7 9.542 7 1.77 0 3.44-.388 4.935-1.07M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

export default function AdminAjuanMagangPage() {
  const navigate = useNavigate();

  // === State Data (Sudah dipisah) ===
  const [pendingPeserta, setPendingPeserta] = useState([]);
  const [historyPeserta, setHistoryPeserta] = useState([]);

  // === State Loading & Error ===
  const [isPendingLoading, setIsPendingLoading] = useState(true);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [error, setError] = useState(null);

  // === State Filter & Pagination (Server-side) ===
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // Untuk tab History ('all', 'DITERIMA', 'DITOLAK')
  const [currentPendingPage, setCurrentPendingPage] = useState(1);
  const [currentHistoryPage, setCurrentHistoryPage] = useState(1);
  const [totalPendingPages, setTotalPendingPages] = useState(1);
  const [totalHistoryPages, setTotalHistoryPages] = useState(1);
  const [totalHistoryItems, setTotalHistoryItems] = useState(0);

  // === State Modal ===
  const [selectedPeserta, setSelectedPeserta] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const ITEMS_PER_PAGE = 5;

  const transformBackendData = useCallback((ajuan) => {
    const berkas = ajuan.berkas || {};
    return {
      id: ajuan.id,
      pesertaId: ajuan.peserta.id,
      nim: ajuan.peserta.nimNis,
      nama: ajuan.peserta.namaLengkap,
      email: ajuan.peserta.user.email,
      instansi: ajuan.instansi,
      jurusan: ajuan.jurusan,
      statusPendidikan: ajuan.statusPendidikan,
      jenjangPendidikan: ajuan.jenjangPendidikan,
      temaMagang: ajuan.temaMagang,
      bidang: ajuan.bidang.nama,
      status: ajuan.statusUsulan,
      tanggalMulai: ajuan.tglMulai,
      tanggalSelesai: ajuan.tglSelesai,
      createdAt: ajuan.createdAt,
      updatedAt: ajuan.updatedAt,
      suratPengantar: berkas.suratPengantar,
      proposalMagang: berkas.proposalMagang,
      cv: berkas.cv,
      ktp: berkas.ktp,
      bakesbangsda: berkas.suratBakesbangpolSda,
      bakesbangprov: berkas.suratBakesbangpolProv,
      foto: ajuan.peserta.pasFoto,
    };
  }, []);

  const fetchAjuan = useCallback(
    async (statusQuery, page, search = '', limit = ITEMS_PER_PAGE) => {
      const setLoading =
        statusQuery === 'PENDING' ? setIsPendingLoading : setIsHistoryLoading;
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Otorisasi Gagal. Silakan login kembali.');

        const params = new URLSearchParams({
          status: statusQuery === 'PENDING' ? 'PENDING' : statusQuery,
          page: page,
          limit: limit,
        });
        if (search && statusQuery !== 'PENDING') {
          params.append('search', search);
        }

        const response = await fetch(
          `http://localhost:3000/api/admin/ajuan-magang?${params.toString()}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const result = await response.json();
        if (!response.ok)
          throw new Error(result.message || 'Gagal memuat data');

        const transformedData = result.data.map(transformBackendData);
        let finalData = transformedData;
        const finalPagination = result.pagination;

        if (statusQuery !== 'PENDING' && statusQuery === 'all') {
          finalData = transformedData.filter(
            (item) => item.status !== 'PENDING'
          );
        }

        if (statusQuery === 'PENDING') {
          setPendingPeserta(finalData);
          setTotalPendingPages(finalPagination.totalPages);
        } else {
          setHistoryPeserta(finalData);
          setTotalHistoryPages(finalPagination.totalPages);
          setTotalHistoryItems(finalPagination.totalItems);
        }
      } catch (err) {
        setError(
          `Gagal memuat data ${
            statusQuery === 'PENDING' ? 'pending' : 'riwayat'
          }: ${err.message}`
        );
        if (statusQuery === 'PENDING') setPendingPeserta([]);
        else setHistoryPeserta([]);
      } finally {
        setLoading(false);
      }
    },
    [transformBackendData]
  );

  useEffect(() => {
    fetchAjuan('PENDING', currentPendingPage);
  }, [currentPendingPage, fetchAjuan]);

  useEffect(() => {
    fetchAjuan(statusFilter, currentHistoryPage, searchTerm);
  }, [currentHistoryPage, searchTerm, statusFilter, fetchAjuan]);

  const refreshLists = useCallback(() => {
    fetchAjuan('PENDING', currentPendingPage);
    fetchAjuan(statusFilter, currentHistoryPage, searchTerm);
  }, [
    fetchAjuan,
    currentPendingPage,
    statusFilter,
    currentHistoryPage,
    searchTerm,
  ]);

  const handleUpdateStatus = async (idAjuan, newStatus) => {
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:3000/api/admin/ajuan-magang/${idAjuan}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || 'Gagal update status');
      refreshLists(); // Refresh setelah sukses
    } catch (err) {
      setError(
        `Gagal ${newStatus === 'DITERIMA' ? 'menerima' : 'menolak'} ajuan: ${
          err.message
        }`
      );
    }
  };

  const handleAccPeserta = (id) => handleUpdateStatus(id, 'DITERIMA');
  const handleTolakPeserta = (id) => handleUpdateStatus(id, 'DITOLAK');

  // === Modal Handler ===
  const handleOpenDetail = (peserta) => {
    setSelectedPeserta(peserta);
    setIsDetailModalOpen(true);
  };
  const handleCloseDetail = () => {
    setIsDetailModalOpen(false);
    setSelectedPeserta(null);
  };

  const handleExportExcelHistory = async () => {
    const dataToExport = historyPeserta.filter(
      (p) => p.status === 'DITERIMA' || p.status === 'DITOLAK'
    );

    if (dataToExport.length === 0) {
      alert('Tidak ada data riwayat (Diterima/Ditolak) untuk diexport.');
      return;
    }

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Riwayat Ajuan Magang');

      worksheet.columns = [
        { key: 'nama', width: 30 },
        { key: 'email', width: 30 },
        { key: 'instansi', width: 30 },
        { key: 'jurusan', width: 25 },
        { key: 'nimNis', width: 20 },
        { key: 'statusPendidikan', width: 20 },
        { key: 'jenjangPendidikan', width: 20 },
        { key: 'temaMagang', width: 40 },
        { key: 'periodeUsulan', width: 25 },
        { key: 'bidang', width: 25 },
        { key: 'tglPengajuan', width: 20 },
        { key: 'status', width: 15 },
        { key: 'tglKeputusan', width: 20 },
        { key: 'suratPengantar', width: 40 },
        { key: 'proposalMagang', width: 40 },
        { key: 'cv', width: 40 },
        { key: 'ktp', width: 40 },
        { key: 'bakesbangsda', width: 40 },
        { key: 'bakesbangprov', width: 40 },
      ];

      worksheet.addRow(['Riwayat Persetujuan Ajuan Magang']);

      worksheet.mergeCells('A1:S1');
      worksheet.getCell('A1').font = { bold: true, size: 14, name: 'Calibri' };
      worksheet.getCell('A1').alignment = {
        horizontal: 'center',
        vertical: 'middle',
      };

      const headerTexts = [
        'NAMA',
        'EMAIL',
        'INSTANSI',
        'JURUSAN',
        'NIM / NIS',
        'STATUS PENDIDIKAN',
        'JENJANG PENDIDIKAN',
        'TEMA MAGANG',
        'PERIODE USULAN',
        'BIDANG',
        'TANGGAL PENGAJUAN',
        'STATUS',
        'TANGGAL KEPUTUSAN',
        'SURAT PENGANTAR',
        'PROPOSAL MAGANG',
        'CV',
        'KTP',
        'BAKESBANGPOL SDA',
        'BAKESBANGPOL PROV',
      ];
      worksheet.addRow(headerTexts);

      const headerRow = worksheet.getRow(2);
      headerRow.eachCell((cell) => {
        cell.font = {
          bold: true,
          color: { argb: 'FFFFFFFF' },
          name: 'Calibri',
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF006DA6' },
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'center',
          wrapText: true,
        };
      });

      const exportData = dataToExport.map((p) => ({
        nama: p.nama,
        email: p.email,
        instansi: p.instansi,
        jurusan: p.jurusan,
        nimNis: p.nim,
        statusPendidikan: p.statusPendidikan,
        jenjangPendidikan: p.jenjangPendidikan,
        temaMagang: p.temaMagang,
        periodeUsulan: formatPeriode(p.tanggalMulai, p.tanggalSelesai),
        bidang: p.bidang,
        tglPengajuan: formatTgl(p.createdAt),
        status: p.status,
        tglKeputusan: formatTgl(p.updatedAt),
        suratPengantar: p.suratPengantar || '-',
        proposalMagang: p.proposalMagang || '-',
        cv: p.cv || '-',
        ktp: p.ktp || '-',
        bakesbangsda: p.bakesbangsda || '-',
        bakesbangprov: p.bakesbangprov || '-',
      }));

      worksheet.addRows(exportData);

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber <= 2) return;

        row.eachCell((cell, colNumber) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };

          const colKey = worksheet.columns[colNumber - 1].key;

          const wrapTextColumns = [
            'temaMagang',
            'suratPengantar',
            'proposalMagang',
            'cv',
            'ktp',
            'bakesbangsda',
            'bakesbangprov',
          ];
          if (wrapTextColumns.includes(colKey)) {
            cell.alignment = { wrapText: true, vertical: 'top' };
          } else {
            cell.alignment = { vertical: 'middle' }; // Rapikan data lain
          }
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const today = new Date().toISOString().split('T')[0];
      const fileName = `RiwayatAjuanMagang_${today}.xlsx`;

      saveAs(new Blob([buffer]), fileName);
    } catch (exportError) {
      console.error('Gagal export excel:', exportError);
      setError(
        "Gagal melakukan export data ke Excel. Pastikan library 'exceljs' dan 'file-saver' terinstall."
      );
    }
  };

  return (
    <>
      <div className="container mx-auto">
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
            <button
              onClick={() => setError(null)}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <span className="text-xl">×</span>
            </button>
          </div>
        )}

        {/* Bagian Usulan Masuk (Pending) */}
        <div className="space-y-6">
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
                {isPendingLoading && (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-gray-500">
                      Memuat data...
                    </td>
                  </tr>
                )}
                {!isPendingLoading && pendingPeserta.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-gray-500">
                      Tidak ada usulan menunggu persetujuan.
                    </td>
                  </tr>
                )}
                {!isPendingLoading &&
                  pendingPeserta.map((peserta) => (
                    <tr key={peserta.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{peserta.nama}</td>
                      <td className="px-4 py-3">{peserta.email}</td>
                      <td className="px-4 py-3">{peserta.instansi}</td>
                      <td className="px-4 py-3">{peserta.jurusan}</td>
                      <td className="px-4 py-3">
                        {formatPeriode(
                          peserta.tanggalMulai,
                          peserta.tanggalSelesai
                        )}
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
              </tbody>
            </table>

            {totalPendingPages > 1 && (
              <div className="flex justify-between items-center p-4">
                <p className="text-sm text-gray-600">
                  Halaman {currentPendingPage} dari {totalPendingPages}
                </p>
                <div className="flex space-x-1">
                  <button
                    onClick={() =>
                      setCurrentPendingPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPendingPage === 1}
                    className="px-3 py-1 border rounded hover:bg-gray-100 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="px-3 py-1 border rounded hover:bg-gray-100 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tabel History */}
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <h3 className="text-lg font-semibold text-gray-700">
                Riwayat Persetujuan Ajuan Magang
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={handleExportExcelHistory}
                  className="flex items-center gap-2 bg-[#006DA6] hover:bg-[#00456a] text-white px-3 py-1 text-sm rounded transition-colors"
                >
                  <DownloadIcon />
                  <span>Export Riwayat Ajuan</span>
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-3 px-4 py-3 border-b">
              <input
                type="text"
                placeholder="Cari berdasarkan nama, email, instansi..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentHistoryPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-[#006DA6] focus:border-[#006DA6] text-sm w-full sm:w-1/2"
              />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentHistoryPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-[#006DA6] focus:border-[#006DA6] text-sm w-full sm:w-1/4"
              >
                <option value="all">Semua Status (Diterima/Ditolak)</option>{' '}
                <option value="DITERIMA">Diterima</option>
                <option value="DITOLAK">Ditolak</option>
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
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3">Tanggal Keputusan</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {/* Loading State */}
                {isHistoryLoading && (
                  <tr>
                    <td colSpan="10" className="text-center py-6 text-gray-500">
                      Memuat data riwayat...
                    </td>
                  </tr>
                )}
                {/* Empty State */}
                {!isHistoryLoading && historyPeserta.length === 0 && (
                  <tr>
                    <td colSpan="10" className="text-center py-6 text-gray-500">
                      Tidak ada riwayat ajuan yang cocok.
                    </td>
                  </tr>
                )}
                {/* Data State */}
                {!isHistoryLoading &&
                  historyPeserta.map((peserta) => (
                    <tr key={peserta.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{peserta.nama}</td>
                      <td className="px-4 py-3">{peserta.email}</td>
                      <td className="px-4 py-3">{peserta.instansi}</td>
                      <td className="px-4 py-3">{peserta.jurusan}</td>
                      <td className="px-4 py-3">
                        {formatPeriode(
                          peserta.tanggalMulai,
                          peserta.tanggalSelesai
                        )}
                      </td>
                      <td className="px-4 py-3">{peserta.bidang}</td>
                      <td className="px-4 py-3">
                        {formatTgl(peserta.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                            peserta.status
                          )}`}
                        >
                          {peserta.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {formatTgl(peserta.updatedAt)}
                      </td>
                      <td className="px-4 py-3 text-center relative">
                        <button
                          onClick={() => {
                            handleOpenDetail(peserta);
                          }}
                          className="p-1 rounded hover:bg-gray-200 text-gray-600"
                          title="Lihat Detail"
                        >
                          <EyeIcon />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {/* Pagination History */}
            {totalHistoryPages > 1 && (
              <div className="flex justify-between items-center p-4">
                <p className="text-sm text-gray-600">
                  Menampilkan{' '}
                  <span className="font-medium">
                    {(currentHistoryPage - 1) * ITEMS_PER_PAGE + 1}
                  </span>{' '}
                  -{' '}
                  <span className="font-medium">
                    {Math.min(
                      currentHistoryPage * ITEMS_PER_PAGE,
                      totalHistoryItems
                    )}
                  </span>{' '}
                  dari <span className="font-medium">{totalHistoryItems}</span>{' '}
                  hasil
                </p>
                <div className="flex space-x-1">
                  <button
                    onClick={() =>
                      setCurrentHistoryPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentHistoryPage === 1}
                    className="px-3 py-1 border rounded hover:bg-gray-100 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {/* Tombol halaman */}
                  {[...Array(totalHistoryPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentHistoryPage(i + 1)}
                      className={`px-3 py-1 border rounded text-sm ${
                        currentHistoryPage === i + 1
                          ? 'bg-[#006DA6] text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setCurrentHistoryPage((prev) =>
                        Math.min(prev + 1, totalHistoryPages)
                      )
                    }
                    disabled={currentHistoryPage === totalHistoryPages}
                    className="px-3 py-1 border rounded hover:bg-gray-100 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Detail */}
        {isDetailModalOpen && selectedPeserta && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={handleCloseDetail}
          >
            <div
              className="bg-white w-full max-w-2xl rounded-lg shadow-xl p-6 relative overflow-y-auto max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseDetail}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                aria-label="Tutup modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Foto Peserta */}
              <div className="flex justify-center mb-4">
                <img
                  src={selectedPeserta.foto || '/default-user.png'}
                  alt={`Foto ${selectedPeserta.nama}`}
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-user.png';
                  }}
                />
              </div>

              <h2 className="text-xl font-semibold mb-4 text-center text-[#006DA6]">
                Detail Ajuan Magang - {selectedPeserta.nama}
              </h2>

              {/* Tampilan Detail yang Lebih Baik */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-4">
                <div className="border rounded p-2 bg-gray-50">
                  <label className="text-gray-500 text-xs block">Nama</label>
                  <p>{selectedPeserta.nama}</p>
                </div>
                <div className="border rounded p-2 bg-gray-50">
                  <label className="text-gray-500 text-xs block">Email</label>
                  <p>{selectedPeserta.email}</p>
                </div>
                <div className="border rounded p-2 bg-gray-50">
                  <label className="text-gray-500 text-xs block">NIM/NIS</label>
                  <p>{selectedPeserta.nim || '-'}</p>
                </div>
                <div className="border rounded p-2 bg-gray-50">
                  <label className="text-gray-500 text-xs block">
                    Instansi
                  </label>
                  <p>{selectedPeserta.instansi}</p>
                </div>
                <div className="border rounded p-2 bg-gray-50">
                  <label className="text-gray-500 text-xs block">Jurusan</label>
                  <p>{selectedPeserta.jurusan}</p>
                </div>
                <div className="border rounded p-2 bg-gray-50">
                  <label className="text-gray-500 text-xs block">
                    Status Pendidikan
                  </label>
                  <p>{selectedPeserta.statusPendidikan || '-'}</p>
                </div>
                <div className="border rounded p-2 bg-gray-50">
                  <label className="text-gray-500 text-xs block">Jenjang</label>
                  <p>{selectedPeserta.jenjangPendidikan || '-'}</p>
                </div>
                <div className="border rounded p-2 bg-gray-50">
                  <label className="text-gray-500 text-xs block">Periode</label>
                  <p>
                    {formatPeriode(
                      selectedPeserta.tanggalMulai,
                      selectedPeserta.tanggalSelesai
                    )}
                  </p>
                </div>
                <div className="border rounded p-2 bg-gray-50">
                  <label className="text-gray-500 text-xs block">
                    Bidang Usulan
                  </label>
                  <p>{selectedPeserta.bidang}</p>
                </div>
                <div className="sm:col-span-2 border rounded p-2 bg-gray-50">
                  <label className="text-gray-500 text-xs block">Tema</label>
                  <p>{selectedPeserta.temaMagang || '-'}</p>
                </div>
                <div className="border rounded p-2 bg-gray-50">
                  <label className="text-gray-500 text-xs block">
                    Status Ajuan
                  </label>
                  <p>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                        selectedPeserta.status
                      )}`}
                    >
                      {selectedPeserta.status}
                    </span>
                  </p>
                </div>
                <div className="border rounded p-2 bg-gray-50">
                  <label className="text-gray-500 text-xs block">
                    Tgl Pengajuan
                  </label>
                  <p>{formatTgl(selectedPeserta.createdAt)}</p>
                </div>
              </div>

              {/* Berkas */}
              <h3 className="text-md font-semibold mb-2 text-gray-700">
                Berkas Pendukung
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-sm mb-6">
                {/* Membuat link lebih dinamis */}
                {Object.entries({
                  'Surat Pengantar': selectedPeserta.suratPengantar,
                  'Proposal Magang': selectedPeserta.proposalMagang,
                  CV: selectedPeserta.cv,
                  'KTP/Identitas': selectedPeserta.ktp,
                  'Bakesbangpol Sidoarjo': selectedPeserta.bakesbangsda,
                  'Bakesbangpol Provinsi': selectedPeserta.bakesbangprov,
                }).map(([label, url]) =>
                  url ? (
                    <li key={label}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {label}
                      </a>
                    </li>
                  ) : (
                    <li key={label} className="text-gray-500 italic">
                      {label} (Tidak ada)
                    </li>
                  )
                )}
              </ul>

              {/* Tombol Aksi di Modal (jika status PENDING) */}
              {selectedPeserta.status === 'PENDING' && (
                <div className="mt-6 flex justify-end space-x-3 border-t pt-4">
                  <button
                    onClick={handleCloseDetail}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => {
                      handleTolakPeserta(selectedPeserta.id);
                      handleCloseDetail();
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                  >
                    Tolak Ajuan
                  </button>
                  <button
                    onClick={() => {
                      handleAccPeserta(selectedPeserta.id);
                      handleCloseDetail();
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                  >
                    Terima Ajuan
                  </button>
                </div>
              )}
              {/* Tombol Tutup jika status BUKAN PENDING */}
              {selectedPeserta.status !== 'PENDING' && (
                <div className="mt-6 text-right border-t pt-4">
                  <button
                    onClick={handleCloseDetail}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 text-sm"
                  >
                    Tutup
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
