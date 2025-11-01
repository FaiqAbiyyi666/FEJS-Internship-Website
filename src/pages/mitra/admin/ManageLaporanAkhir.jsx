import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { Eye, Search, Download, X, Loader2 } from 'lucide-react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

// Ganti URL ini dengan URL backend Anda
const BASE_URL = 'http://localhost:3000/api/admin'; // Sesuaikan port jika perlu

const ManageLaporanAkhir = () => {
  // === State untuk data ===
  const [laporanHasilMagang, setLaporanHasilMagang] = useState([]);
  const [riwayat, setRiwayat] = useState([]);

  // === State untuk UI & Filter ===
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submittingId, setSubmittingId] = useState(null); // Untuk disable tombol saat loading
  const [searchTerm, setSearchTerm] = useState('');
  const [previewFile, setPreviewFile] = useState(null);
  const [filterBidang, setFilterBidang] = useState('all');
  const [sortByDate, setSortByDate] = useState('newest');
  const modalRef = useRef();

  // Helper untuk mendapatkan token dari localStorage
  const getToken = () => localStorage.getItem('token'); // Sesuaikan nama key token Anda

  // === Fungsi Fetching Data (diubah ke fetch) ===
  const fetchLaporanMasuk = useCallback(async () => {
    try {
      const token = getToken();
      const res = await fetch(`${BASE_URL}/laporan-akhir/pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // fetch tidak melempar error pada 4xx/5xx, jadi kita cek manual
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.msg || 'Gagal memuat data laporan masuk.');
      }

      const data = await res.json();
      setLaporanHasilMagang(data);
    } catch (err) {
      console.error('Gagal fetch laporan masuk:', err);
      setError('Gagal memuat data laporan masuk.');
    }
  }, []);

  const fetchLaporanRiwayat = useCallback(async () => {
    try {
      const token = getToken();
      const res = await fetch(`${BASE_URL}/laporan-akhir/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.msg || 'Gagal memuat data riwayat.');
      }

      const data = await res.json();
      setRiwayat(data);
    } catch (err) {
      console.error('Gagal fetch riwayat:', err);
      setError('Gagal memuat data riwayat laporan.');
    }
  }, []);

  // === Fetch data saat komponen pertama kali dimuat ===
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      await Promise.all([fetchLaporanMasuk(), fetchLaporanRiwayat()]);
      setLoading(false);
    };
    loadData();
  }, [fetchLaporanMasuk, fetchLaporanRiwayat]);

  // === Logika Filter (di-memoize) ===
  const bidangList = useMemo(() => {
    const allLaporan = [...laporanHasilMagang, ...riwayat];
    return [...new Set(allLaporan.map((laporan) => laporan.peserta.bidang))];
  }, [laporanHasilMagang, riwayat]);

  const filteredData = useMemo(() => {
    return laporanHasilMagang
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
  }, [laporanHasilMagang, searchTerm, filterBidang, sortByDate]);

  // === Fungsi Respon (diubah ke fetch) ===
  const handleResponse = async (laporan, frontendStatus) => {
    const isRejecting = frontendStatus === 'Ditolak';
    const backendStatus = isRejecting ? 'REJECTED' : 'APPROVED';
    let catatan = null;

    if (isRejecting) {
      catatan = prompt('Mohon masukkan alasan penolakan (wajib):');
      if (!catatan || catatan.trim() === '') {
        alert('Penolakan dibatalkan. Catatan wajib diisi.');
        return;
      }
    }

    setSubmittingId(laporan.id);
    try {
      const token = getToken();
      const res = await fetch(
        `${BASE_URL}/laporan-akhir/respond/${laporan.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json', // Penting untuk mengirim body JSON
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: backendStatus,
            catatan: catatan,
          }),
        }
      );

      const resData = await res.json(); // Ambil body respons (untuk sukses atau error)

      if (!res.ok) {
        // Gunakan pesan error dari backend
        throw new Error(resData.msg || 'Gagal merespon laporan.');
      }

      // Gunakan pesan sukses dari backend
      alert(resData.msg || `Laporan berhasil ${frontendStatus.toLowerCase()}.`);

      // Refresh kedua tabel setelah berhasil
      await Promise.all([fetchLaporanMasuk(), fetchLaporanRiwayat()]);
    } catch (err) {
      console.error('Gagal merespon laporan:', err);
      // err.message sekarang akan berisi pesan dari backend (jika ada)
      alert(`Gagal merespon: ${err.message}`);
    } finally {
      setSubmittingId(null);
    }
  };

  // ===== Export Excel untuk Riwayat (Tidak perlu diubah) =====
  const exportRiwayatToExcel = async () => {
    // ⬅️ Ubah menjadi async
    if (riwayat.length === 0) {
      alert('Belum ada data riwayat untuk diekspor.');
      return;
    }

    // 1. Buat Workbook & Worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Riwayat Laporan Akhir');

    // 2. Tentukan Kolom (Header, Key, dan Lebar)
    // Header akan otomatis menjadi huruf besar
    worksheet.columns = [
      { header: 'NAMA', key: 'nama', width: 30 },
      { header: 'EMAIL', key: 'email', width: 30 },
      { header: 'BIDANG', key: 'bidang', width: 25 },
      { header: 'STATUS', key: 'status', width: 15 },
      { header: 'TANGGAL RESPON', key: 'tanggalRespon', width: 25 },
      { header: 'CATATAN', key: 'catatan', width: 50 },
      { header: 'LINK FILE', key: 'fileLink', width: 30 },
    ];

    // 3. Siapkan data sesuai 'key' yang ditentukan
    const exportData = riwayat.map((l) => ({
      nama: l.peserta.nama,
      email: l.peserta.email,
      bidang: l.peserta.bidang,
      status: l.status === 'APPROVED' ? 'Diterima' : 'Ditolak',
      tanggalRespon: new Date(l.respondedAt).toLocaleString('id-ID'),
      catatan: l.catatan,
      fileLink: l.fileLaporan, // URL tujuan link
    }));

    // 4. Tambahkan Data ke Worksheet
    worksheet.addRows(exportData);

    // 5. STYLING HEADER (Bold, Huruf Besar, Border, Warna Latar)
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      // Font
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFFFF' }, // Putih
        name: 'Calibri',
      };

      // Background
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF006DA6' }, // Warna biru tema Anda
      };

      // Border
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };

      // Alignment
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // 6. STYLING DATA CELLS (Border & Wrap Text)
    worksheet.eachRow({ includeEmpty: false, skipHeader: true }, (row) => {
      row.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };

        // Wrap text untuk kolom 'Catatan'
        if (worksheet.columns[colNumber - 1].key === 'catatan') {
          cell.alignment = { wrapText: true, vertical: 'top' };
        }
      });
    });

    // 7. Hasilkan File dan Download
    const buffer = await workbook.xlsx.writeBuffer();
    const today = new Date().toISOString().split('T')[0];
    const fileName = `riwayat_laporan_akhir_${today}.xlsx`;

    saveAs(new Blob([buffer]), fileName);
  };

  // Klik luar modal untuk tutup (Tidak perlu diubah)
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

  // === Tampilan Loading dan Error ===
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#006DA6]" />
        <span className="ml-2 text-gray-700">Memuat data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg text-center">
        {error}
      </div>
    );
  }

  // === JSX (Return) ===
  // (Tidak ada perubahan di bagian JSX, semua sama seperti sebelumnya)
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

      {/* Table Laporan Masuk */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#006DA6] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider rounded-tl-xl">
                Nama Peserta
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                Bidang
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                Tanggal Kirim
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
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
                    disabled={submittingId === laporan.id}
                    className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 disabled:bg-gray-400"
                  >
                    {submittingId === laporan.id ? '...' : 'Diterima'}
                  </button>
                  <button
                    onClick={() => handleResponse(laporan, 'Ditolak')}
                    disabled={submittingId === laporan.id}
                    className="px-3 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 disabled:bg-gray-400"
                  >
                    {submittingId === laporan.id ? '...' : 'Ditolak'}
                  </button>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  Tidak ada laporan masuk.
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
            <h3 className="text-lg font-semibold text-gray-700 rounded-t-lg">
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
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Catatan
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
                      laporan.status === 'APPROVED'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {laporan.status === 'APPROVED' ? 'Diterima' : 'Ditolak'}
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
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                    {laporan.catatan || '-'}
                  </td>
                </tr>
              ))}
              {riwayat.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
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
