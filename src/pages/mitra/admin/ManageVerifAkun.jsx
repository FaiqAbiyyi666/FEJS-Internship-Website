import React, { useState, useEffect, useCallback } from 'react';
import { Download } from 'lucide-react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const ITEMS_PER_PAGE_PENDING = 5;
const ITEMS_PER_PAGE_APPROVED = 5;

const formattedDate = (tanggalISO) => {
  if (!tanggalISO) return null;

  const d = new Date(tanggalISO);
  if (isNaN(d.getTime())) return 'Tanggal Tidak Valid';

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export default function ManageVerifAkun() {
  const [pendingPeserta, setPendingPeserta] = useState([]);
  const [approvedPeserta, setApprovedPeserta] = useState([]);

  // === State Filter & Modal ===
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedPeserta, setSelectedPeserta] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const fetchPending = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token tidak ada');

      const pendingRes = await fetch(
        'http://localhost:3000/api/admin/peserta-magang/pending',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const pending = await pendingRes.json();
      if (!pendingRes.ok)
        throw new Error(pending.message || 'Gagal ambil pending');

      setPendingPeserta(pending.data || []);
    } catch (err) {
      console.error('Gagal fetch pending:', err.message);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token tidak ada');

      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (searchDate) params.append('date', searchDate);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const queryString = params.toString();

      const historyRes = await fetch(
        `http://localhost:3000/api/admin/peserta-magang/history?${queryString}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const history = await historyRes.json();
      if (!historyRes.ok)
        throw new Error(history.message || 'Gagal ambil history');

      setApprovedPeserta(history.data || []);
    } catch (err) {
      console.error('Gagal fetch history:', err.message);
    }
  }, [searchTerm, searchDate, statusFilter]);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHistory();
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchHistory]);

  const handleAccPeserta = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `http://localhost:3000/api/admin/peserta-magang/${id}/approve`,
        {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await res.json();

      if (res.ok) {
        alert(result.message);

        const approvedParticipant = pendingPeserta.find((p) => p.id === id);

        if (approvedParticipant) {
          setPendingPeserta((prevPending) =>
            prevPending.filter((p) => p.id !== id)
          );

          setApprovedPeserta((prevHistory) => [
            { ...approvedParticipant, status: 'APPROVED' },
            ...prevHistory,
          ]);
        }
      } else {
        alert(result.message || 'Gagal approve peserta');
      }
    } catch (error) {
      console.error('Error saat approve:', error);
      alert('Terjadi kesalahan koneksi');
    }
  };

  const handleTolakPeserta = async (id, alasan) => {
    if (!window.confirm('Apakah Anda yakin ingin menolak peserta ini?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `http://localhost:3000/api/admin/peserta-magang/${id}/reject`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();

      if (res.ok) {
        alert(result.message);

        const rejectedParticipant = pendingPeserta.find((p) => p.id === id);

        if (rejectedParticipant) {
          setPendingPeserta((prevPending) =>
            prevPending.filter((p) => p.id !== id)
          );

          setApprovedPeserta((prevHistory) => [
            { ...rejectedParticipant, status: 'REJECTED' },
            ...prevHistory,
          ]);
        }
      } else {
        alert(result.message || 'Gagal menolak peserta');
      }
    } catch (error) {
      console.error('Error saat menolak:', error);
      alert('Terjadi kesalahan koneksi');
    }
  };

  const handleOpenDetail = (peserta) => {
    setSelectedPeserta(peserta);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailModalOpen(false);
    setSelectedPeserta(null);
  };

  const [currentPendingPage, setCurrentPendingPage] = useState(1);
  const [currentApprovedPage, setCurrentApprovedPage] = useState(1);

  const totalPendingPages = Math.ceil(
    pendingPeserta.length / ITEMS_PER_PAGE_PENDING
  );
  const totalApprovedPages = Math.ceil(
    approvedPeserta.length / ITEMS_PER_PAGE_APPROVED
  );

  const paginate = (data, page, itemsPerPage) =>
    data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const paginatedPendingPeserta = paginate(
    pendingPeserta,
    currentPendingPage,
    ITEMS_PER_PAGE_PENDING
  );
  const paginatedApprovedPeserta = paginate(
    approvedPeserta,
    currentApprovedPage,
    ITEMS_PER_PAGE_APPROVED
  );

  const handleExportExcelHistory = async () => {
    if (approvedPeserta.length === 0) {
      alert('Tidak ada data riwayat untuk diekspor.');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Riwayat Persetujuan Akun');

    worksheet.columns = [
      { header: 'NAMA LENGKAP', key: 'namaLengkap', width: 30 },
      { header: 'EMAIL', key: 'email', width: 30 },
      { header: 'NIM / NIS', key: 'nimNis', width: 20 },
      { header: 'NIK', key: 'nik', width: 20 },
      { header: 'NO TELEPON', key: 'noTelepon', width: 20 },
      { header: 'INSTANSI', key: 'instansi', width: 30 },
      { header: 'JURUSAN', key: 'jurusan', width: 25 },
      { header: 'ALAMAT', key: 'alamat', width: 50 },
      { header: 'INSTAGRAM', key: 'instagram', width: 50 },
      { header: 'TANGGAL DAFTAR', key: 'tanggalDaftar', width: 20 },
      { header: 'STATUS', key: 'status', width: 15 },
    ];

    const exportData = approvedPeserta.map((p) => ({
      namaLengkap: p.namaLengkap,
      email: p.user?.email || 'N/A',
      nimNis: p.nimNis || 'N/A',
      nik: p.nik,
      noTelepon: p.noTelepon,
      instansi: p.instansi || 'N/A',
      jurusan: p.jurusan || 'N/A',
      alamat: p.alamat,
      instagram: p.instagram,
      tanggalDaftar: formattedDate(p.createdAt),
      status: p.status,
    }));

    worksheet.addRows(exportData);

    const headerRow = worksheet.getRow(1);
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
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    worksheet.eachRow({ includeEmpty: false, skipHeader: true }, (row) => {
      row.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };

        const colKey = worksheet.columns[colNumber - 1].key;

        if (colKey === 'alamat') {
          cell.alignment = { wrapText: true, vertical: 'top' };
        } else {
          cell.alignment = { vertical: 'middle' };
        }
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const today = new Date().toISOString().split('T')[0];
    const fileName = `RiwayatPersetujuanAkun_${today}.xlsx`;

    saveAs(new Blob([buffer]), fileName);
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
                <td className="px-4 py-3">{peserta.namaLengkap}</td>
                <td className="px-4 py-3">{peserta.user.email}</td>
                <td className="px-4 py-3">{peserta.instansi}</td>
                <td className="px-4 py-3">{peserta.jurusan}</td>
                <td className="px-4 py-3">
                  {formattedDate(peserta.createdAt)}
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
                  paginatedPendingPeserta.length
                )}
              </span>{' '}
              dari{' '}
              <span className="font-medium">
                {paginatedPendingPeserta.length}
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
            className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 relative overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-6">
              <img
                src={selectedPeserta.pasFoto || '/default-user.png'}
                alt="Foto Peserta"
                className="w-36 h-36 rounded-full object-cover border-2 border-gray-300"
              />
            </div>

            <h2 className="text-3xl font-bold mb-8 text-center text-[#006DA6]">
              Detail Peserta Magang
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-base">
              <div className="border rounded p-3">
                <label className="text-gray-600 text-sm">Nama Lengkap</label>
                <p className="text-gray-800 font-semibold">
                  {selectedPeserta.namaLengkap}
                </p>
              </div>

              <div className="border rounded p-3 sm:col-span-1">
                <label className="text-gray-600 text-sm">Email</label>
                <p className="text-gray-800 font-semibold break-all">
                  {selectedPeserta.user.email}
                </p>
              </div>

              <div className="border rounded p-3">
                <label className="text-gray-600 text-sm">NIM/NIS</label>
                <p className="text-gray-800 font-semibold">
                  {selectedPeserta.nimNis}
                </p>
              </div>

              <div className="border rounded p-3">
                <label className="text-gray-600 text-sm">NIK</label>
                <p className="text-gray-800 font-semibold">
                  {selectedPeserta.nik}
                </p>
              </div>

              <div className="border rounded p-3">
                <label className="text-gray-600 text-sm">No Telepon</label>
                <p className="text-gray-800 font-semibold">
                  {selectedPeserta.noTelepon}
                </p>
              </div>

              <div className="border rounded p-3">
                <label className="text-gray-600 text-sm">Instansi</label>
                <p className="text-gray-800 font-semibold">
                  {selectedPeserta.instansi}
                </p>
              </div>

              <div className="border rounded p-3">
                <label className="text-gray-600 text-sm">Jurusan</label>
                <p className="text-gray-800 font-semibold">
                  {selectedPeserta.jurusan}
                </p>
              </div>

              <div className="border rounded p-3">
                <label className="text-gray-600 text-sm">Instagram</label>
                <p className="text-gray-800 font-semibold">
                  {selectedPeserta.instagram}
                </p>
              </div>

              <div className="border rounded p-3 sm:col-span-2">
                <label className="text-gray-600 text-sm">Alamat</label>
                <p className="text-gray-800 font-semibold">
                  {selectedPeserta.alamat}
                </p>
              </div>

              <div className="border rounded p-3 sm:col-span-2">
                <label className="text-gray-600 text-sm">Tanggal Daftar</label>
                <p className="text-gray-800 font-semibold">
                  {formattedDate(selectedPeserta.createdAt)}
                </p>
              </div>
            </div>

            <div className="mt-8 text-right">
              <button
                onClick={handleCloseDetail}
                className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded hover:bg-gray-300 transition text-base font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <div className="flex justify-between items-center px-4 py-3">
          <h3 className="text-lg font-semibold text-gray-700">
            Riwayat Persetujuan Akun Peserta Magang
          </h3>
          <div className="flex gap-2">
            <button
              onClick={handleExportExcelHistory}
              className="flex items-center gap-2 px-4 py-2 bg-[#006DA6] text-white rounded-md hover:bg-[#00476d] text-sm"
            >
              <Download size={18} />
              <span>Eksport Riwayat Verifikasi</span>
            </button>
          </div>
        </div>

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
            <option value="APPROVED">Diterima</option>
            <option value="REJECTED">Ditolak</option>
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
              <th className="px-4 py-3">Instagram</th>
              <th className="px-4 py-3">Tanggal Daftar</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Tanggal Keputusan</th>
            </tr>
          </thead>
          <tbody>
            {paginatedApprovedPeserta.map((peserta) => (
              <tr key={peserta.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{peserta.namaLengkap}</td>
                <td className="px-4 py-3">{peserta.user.email}</td>
                <td className="px-4 py-3">{peserta.nimNis}</td>
                <td className="px-4 py-3">{peserta.noTelepon}</td>
                <td className="px-4 py-3">{peserta.nik}</td>
                <td className="px-4 py-3">{peserta.instansi}</td>
                <td className="px-4 py-3">{peserta.jurusan}</td>
                <td className="px-4 py-3">{peserta.alamat}</td>
                <td className="px-4 py-3">{peserta.instagram}</td>
                <td className="px-4 py-3">
                  {peserta.createdAt ? formattedDate(peserta.createdAt) : 'N/A'}
                </td>
                <td className="px-4 py-3">{peserta.status}</td>
                <td className="px-4 py-3">
                  {formattedDate(peserta.updatedAt || peserta.createdAt)}
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
                  approvedPeserta.length
                )}
              </span>{' '}
              dari <span className="font-medium">{approvedPeserta.length}</span>{' '}
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
