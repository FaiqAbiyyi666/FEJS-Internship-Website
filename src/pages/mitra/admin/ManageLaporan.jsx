import React, { useState, useEffect } from 'react';
import { Search, Eye, Download } from 'lucide-react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const formatTanggalLaporan = (isoDate) => {
  if (!isoDate) return '-';
  return new Date(isoDate).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const formatTanggalSubmit = (isoDateTime) => {
  if (!isoDateTime) return '-';
  return new Date(isoDateTime).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center items-center space-x-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &lt;
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded ${
            currentPage === page ? 'bg-[#006DA6] text-white' : 'bg-gray-200'
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &gt;
      </button>
    </div>
  );
};

const ManagementLaporan = () => {
  const [logbooks, setLogbooks] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [bidangFilter, setBidangFilter] = useState('all');
  const [tanggalFilter, setTanggalFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedLaporan, setSelectedLaporan] = useState(null);

  useEffect(() => {
    const fetchLogbooks = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.append('page', currentPage);
        params.append('limit', 10);

        if (searchTerm) {
          params.append('search', searchTerm);
        }
        if (bidangFilter !== 'all') {
          params.append('bidangId', bidangFilter);
        }
        if (tanggalFilter) {
          params.append('tanggal', tanggalFilter);
        }

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Anda harus login untuk melihat data ini.');
        }

        const response = await fetch(
          `http://localhost:3000/api/admin/logbook/all?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || 'Gagal mengambil data');
        }

        const data = await response.json();

        setLogbooks(data.data);
        setPagination(data.pagination);
      } catch (err) {
        console.error('Error fetching logbooks:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogbooks();
  }, [searchTerm, bidangFilter, tanggalFilter, currentPage]);

  const handleExportExcel = async () => {
    const exportData = logbooks.map(({ pasFoto, ...rest }) => ({
      ...rest,
      tanggal: formatTanggalLaporan(rest.tanggal),
      tanggalSubmit: formatTanggalSubmit(rest.tanggalSubmit),
    }));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Laporan Harian');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 35 },
      { header: 'PESERTA', key: 'peserta', width: 30 },
      { header: 'BIDANG', key: 'bidang', width: 30 },
      { header: 'INSTANSI', key: 'instansi', width: 30 },
      { header: 'TANGGAL LAPORAN', key: 'tanggal', width: 25 },
      { header: 'KEGIATAN', key: 'kegiatan', width: 50 },
      { header: 'TANGGAL SUBMIT', key: 'tanggalSubmit', width: 20 },
    ];

    worksheet.addRows(exportData);

    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell, colNumber) => {
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

    worksheet.eachRow(
      { includeEmpty: false, skipHeader: true },
      (row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };

          if (worksheet.columns[colNumber - 1].key === 'kegiatan') {
            cell.alignment = { wrapText: true, vertical: 'top' };
          }
        });
      }
    );

    const buffer = await workbook.xlsx.writeBuffer();
    const today = new Date().toISOString().split('T')[0];
    const fileName = `laporan_harian_${today}.xlsx`;

    saveAs(new Blob([buffer]), fileName);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
          disabled={logbooks.length === 0}
          className="px-4 py-2 bg-[#006DA6] text-white rounded-lg hover:bg-[#002942] 
            transition-colors flex items-center space-x-2 text-sm"
        >
          <Download size={18} />
          <span>Export Laporan</span>
        </button>
      </div>

      {/* Laporan Cards */}
      <div className="space-y-4">
        {isLoading && (
          <div className="text-center text-gray-500 py-10">
            Memuat data laporan harian...
          </div>
        )}
        {error && (
          <div className="text-center text-red-600 bg-red-100 p-4 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}
        {!isLoading && !error && logbooks.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            Tidak ada laporan harian yang ditemukan.
          </div>
        )}

        {!isLoading &&
          !error &&
          logbooks.map((laporan) => (
            <div
              key={laporan.id}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#006DA6] to-[#002942] rounded-full flex items-center justify-center overflow-hidden">
                    {laporan.pasFoto ? (
                      // JIKA ADA FOTO: Tampilkan <img>
                      <img
                        src={laporan.pasFoto}
                        alt={laporan.peserta}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      // JIKA TIDAK ADA FOTO: Tampilkan <span> dengan inisial
                      <span className="text-white font-medium">
                        {laporan.peserta.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {laporan.peserta} <span>• </span>
                      <span className="text-gray-900">{laporan.instansi}</span>
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-500 mt-1">
                      <span>
                        <span className="font-semibold">Bidang:</span>{' '}
                        {laporan.bidang}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span>
                        <span className="font-semibold">Tanggal Laporan:</span>{' '}
                        {formatTanggalLaporan(laporan.tanggal)}
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

              <p className="text-gray-700 mb-4 leading-relaxed line-clamp-3">
                {laporan.kegiatan}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                <div>
                  <span className="font-medium">Disubmit:</span>{' '}
                  {formatTanggalSubmit(laporan.tanggalSubmit)}
                </div>
              </div>
            </div>
          ))}
      </div>

      {!isLoading && !error && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Modal Detail Laporan */}
      {isOpen && selectedLaporan && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative max-h-[90vh] flex flex-col">
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#006DA6] to-[#002942] rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                {selectedLaporan.pasFoto ? (
                  // JIKA ADA FOTO: Tampilkan <img>
                  <img
                    src={selectedLaporan.pasFoto}
                    alt={selectedLaporan.peserta}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  // JIKA TIDAK ADA FOTO: Tampilkan <span> dengan inisial
                  <span className="text-white font-medium">
                    {selectedLaporan.peserta.substring(0, 2).toUpperCase()}
                  </span>
                )}
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
                  {formatTanggalLaporan(selectedLaporan.tanggal)}
                </div>
              </div>
            </div>

            <div className="mt-4 flex-1 overflow-y-auto">
              <h4 className="text-md font-semibold text-gray-800 mb-2">
                Detail Kegiatan:
              </h4>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {selectedLaporan.kegiatan}
              </p>
            </div>

            <div className="mt-6 flex justify-between items-center flex-shrink-0">
              <span className="text-sm text-gray-600">
                <span className="font-semibold">Submit:</span>{' '}
                {formatTanggalSubmit(selectedLaporan.tanggalSubmit)}
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
