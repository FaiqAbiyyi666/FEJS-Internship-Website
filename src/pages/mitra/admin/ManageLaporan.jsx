import React, { useState, useEffect } from 'react';
import { Search, Eye, Download, X, ChevronDown } from 'lucide-react';

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import $ from 'jquery';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import Modal from 'react-modal';

// --- Helper Functions (Tidak Berubah) ---
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

const Pagination = ({ pagination, onPageChange }) => {
  const { currentPage, totalPages, totalItems, itemsPerPage } = pagination;
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="py-4 px-6 flex items-center justify-between border-t border-gray-200">
      <div className="text-sm text-gray-700">
        Menampilkan <span className="font-medium">{start}</span> sampai{' '}
        <span className="font-medium">{end}</span> dari{' '}
        <span className="font-medium">{totalItems}</span> entri
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="text-sm px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Pertama
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="text-sm px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sebelumnya
        </button>

        <span className="text-sm px-4 py-2 bg-gray-100 rounded-md">
          {currentPage}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="text-sm px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Berikutnya
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="text-sm px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Terakhir
        </button>
      </div>
    </div>
  );
};

const ManagementLaporan = () => {
  const [logbooks, setLogbooks] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [bidangFilter, setBidangFilter] = useState('all');
  const [tanggalFilter, setTanggalFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [bidangList, setBidangList] = useState([]);

  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLaporan, setSelectedLaporan] = useState(null);

  useEffect(() => {
    const scripts = [
      'https://code.jquery.com/jquery-3.7.1.min.js',
      'https://cdn.datatables.net/2.0.8/js/dataTables.js',
      'https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js',
    ];
    const styles = [
      'https://cdn.datatables.net/2.0.8/css/dataTables.dataTables.css',
    ];

    styles.forEach((href) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.id = href;
      document.head.appendChild(link);
    });

    scripts.forEach((src) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.id = src;
      document.body.appendChild(script);
    });

    return () => {
      scripts.forEach((src) => {
        const script = document.getElementById(src);
        if (script) document.body.removeChild(script);
      });
      styles.forEach((href) => {
        const link = document.getElementById(href);
        if (link) document.head.removeChild(link);
      });
    };
  }, []);

  useEffect(() => {
    const fetchBidangList = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(
          `http://localhost:3000/api/admin/bidang/list`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error('Gagal mengambil daftar bidang');
        const data = await response.json();
        setBidangList(data.data); // Simpan daftar bidang di state
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchBidangList();
  }, []);

  useEffect(() => {
    const fetchLogbooks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        const itemsPerPage = 10;
        params.append('page', currentPage);
        params.append('limit', itemsPerPage);
        if (searchTerm) params.append('search', searchTerm);
        if (bidangFilter !== 'all') params.append('bidangId', bidangFilter);
        if (tanggalFilter) params.append('tanggal', tanggalFilter);

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

  useEffect(() => {
    if (
      typeof window.$ === 'undefined' ||
      typeof window.$.fn.DataTable === 'undefined' ||
      isLoading ||
      logbooks.length === 0
    ) {
      return;
    }

    const tableId = '#logbook-admin-table';
    const $ = window.$;

    if ($.fn.DataTable.isDataTable(tableId)) {
      $(tableId).DataTable().destroy();
    }

    const table = $(tableId).DataTable({
      paging: false,
      searching: false,
      info: false,
      ordering: true,
      order: [[2, 'desc']],
      destroy: true,
      language: {
        emptyTable: 'Tidak ada data logbook',
      },
    });

    $(tableId + ' tbody').off('click', '.view-logbook-btn');
    $(tableId + ' tbody').on('click', '.view-logbook-btn', function () {
      const id = $(this).data('id');
      const logbook = logbooks.find((l) => l.id === id);
      if (logbook) {
        handleOpenModal(logbook);
      }
    });

    return () => {
      if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().destroy();
      }
      $(tableId + ' tbody').off('click', '.view-logbook-btn');
    };
  }, [isLoading, logbooks]);

  const handleExportExcel = async () => {
    if (
      typeof window.ExcelJS === 'undefined' ||
      typeof window.saveAs === 'undefined'
    ) {
      alert('Library export sedang dimuat. Silakan coba lagi sesaat.');
      return;
    }

    const exportData = logbooks.map(({ pasFoto, ...rest }) => ({
      ...rest,
      tanggal: formatTanggalLaporan(rest.tanggal),
      tanggalSubmit: formatTanggalSubmit(rest.tanggalSubmit),
      logbookFile: rest.logbookFile || 'Tidak ada file',
    }));

    const workbook = new window.ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Laporan Harian');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 35 },
      { header: 'PESERTA', key: 'peserta', width: 30 },
      { header: 'BIDANG', key: 'bidang', width: 30 },
      { header: 'INSTANSI', key: 'instansi', width: 30 },
      { header: 'TANGGAL LAPORAN', key: 'tanggal', width: 25 },
      { header: 'KEGIATAN', key: 'kegiatan', width: 50 },
      { header: 'TANGGAL SUBMIT', key: 'tanggalSubmit', width: 20 },
      { header: 'FILE BUKTI', key: 'logbookFile', width: 50 },
    ];

    worksheet.addRows(exportData);

    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, name: 'Calibri' };
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
        if (colKey === 'kegiatan' || colKey === 'logbookFile') {
          cell.alignment = { wrapText: true, vertical: 'top' };
        }
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const today = new Date().toISOString().split('T')[0];
    const fileName = `laporan_harian_${today}.xlsx`;
    window.saveAs(new Blob([buffer]), fileName);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleOpenModal = (laporan) => {
    setSelectedLaporan(laporan);
    setIsOpen(true);
  };
  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedLaporan(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <select
            value={bidangFilter}
            onChange={(e) => {
              setBidangFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-[#006DA6] focus:border-transparent"
          >
            <option value="all">Semua Bidang</option>
            {bidangList.map((bidang) => (
              <option key={bidang.id} value={bidang.id}>
                {bidang.nama}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={tanggalFilter}
            onChange={(e) => {
              setTanggalFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                       focus:ring-2 focus:ring-[#006DA6] focus:border-transparent"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative">
            <label htmlFor="search-input" className="sr-only">
              Cari
            </label>
            <input
              id="search-input"
              type="text"
              placeholder="Cari..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-64 pl-4 pr-4 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-[#006DA6] focus:border-transparent"
            />
          </div>
          <button
            onClick={handleExportExcel}
            disabled={logbooks.length === 0}
            className="px-4 py-2 bg-[#006DA6] text-white rounded-lg hover:bg-[#002942] 
                       transition-colors flex items-center justify-center space-x-2 text-sm"
          >
            <Download size={18} />
            <span>Export Laporan</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        {isLoading && (
          <div className="text-center text-gray-500 py-10">
            Memuat data laporan harian...
          </div>
        )}
        {error && (
          <div className="text-center text-red-600 bg-red-100 p-4">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table id="logbook-admin-table" className="w-full text-sm text-left">
            <thead className="text-gray-700">
              <tr>
                <th className="px-6 py-4 font-medium">
                  Peserta <ChevronDown size={14} className="inline-block" />
                </th>
                <th className="px-6 py-4 font-medium">
                  Bidang <ChevronDown size={14} className="inline-block" />
                </th>
                <th className="px-6 py-4 font-medium">
                  Tanggal Laporan{' '}
                  <ChevronDown size={14} className="inline-block" />
                </th>
                <th className="px-6 py-4 font-medium">
                  File Bukti <ChevronDown size={14} className="inline-block" />
                </th>
                <th className="px-6 py-4 font-medium">
                  Tgl. Pengiriman{' '}
                  <ChevronDown size={14} className="inline-block" />
                </th>
                <th className="px-6 py-4 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {!isLoading &&
                !error &&
                logbooks.length > 0 &&
                logbooks.map((laporan) => (
                  <tr
                    key={laporan.id}
                    className="hover:bg-gray-50 border-b border-gray-200"
                  >
                    {/* Kolom Peserta */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#006DA6] to-[#002942] rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                          {laporan.pasFoto ? (
                            <img
                              src={laporan.pasFoto}
                              alt={laporan.peserta}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-white font-medium">
                              {laporan.peserta
                                ? laporan.peserta.substring(0, 2).toUpperCase()
                                : '??'}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {laporan.peserta}
                          </div>
                          <div className="text-xs text-gray-500">
                            {laporan.instansi}
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* Kolom Bidang */}
                    <td className="px-6 py-4 text-gray-700">
                      {laporan.bidang}
                    </td>
                    {/* Kolom Tanggal Laporan */}
                    <td className="px-6 py-4 text-gray-700">
                      {
                        /* Format tanggal lebih singkat di tabel */
                        new Date(laporan.tanggal).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      }
                    </td>
                    {/* Kolom File Bukti */}
                    <td className="px-6 py-4">
                      {laporan.logbookFile ? (
                        <a
                          href={laporan.logbookFile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Lihat Bukti
                        </a>
                      ) : (
                        <span className="text-gray-400">Tidak ada</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {formatTanggalSubmit(laporan.tanggalSubmit)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        data-id={laporan.id} // ⬅️ ID PENTING untuk jQuery
                        className="view-logbook-btn p-2 text-[#006DA6] hover:text-[#002942] hover:bg-[#BFDCFF] hover:bg-opacity-20 rounded-lg"
                        title="Lihat Detail"
                      >
                        <Eye size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {!isLoading && !error && logbooks.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            Tidak ada laporan harian yang ditemukan.
          </div>
        )}
      </div>

      {/* Paginasi (dari backend) */}
      {!isLoading && !error && pagination.totalPages > 1 && (
        <Pagination pagination={pagination} onPageChange={handlePageChange} />
      )}

      {/* --- Modal (Tetap sama, menggunakan div kondisional) --- */}
      {isOpen && selectedLaporan && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative max-h-[90vh] flex flex-col">
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#006DA6] to-[#002942] rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                {selectedLaporan.pasFoto ? (
                  <img
                    src={selectedLaporan.pasFoto}
                    alt={selectedLaporan.peserta}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-medium">
                    {selectedLaporan.peserta
                      ? selectedLaporan.peserta.substring(0, 2).toUpperCase()
                      : '??'}
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
                <div className="text-sm text-gray-500 mt-1">
                  <span className="font-semibold">Bidang:</span>{' '}
                  {selectedLaporan.bidang}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  <span className="font-semibold">Tanggal Laporan:</span>{' '}
                  {formatTanggalLaporan(selectedLaporan.tanggal)}
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-800 ml-auto"
              >
                <X size={24} />
              </button>
            </div>

            {/* Konten Modal */}
            <div className="mt-4 flex-1 overflow-y-auto">
              <h4 className="text-md font-semibold text-gray-800 mb-2">
                Detail Kegiatan:
              </h4>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {selectedLaporan.kegiatan}
              </p>

              {selectedLaporan.logbookFile && (
                <>
                  <h4 className="text-md font-semibold text-gray-800 mb-2 mt-4">
                    File Bukti:
                  </h4>
                  <a
                    href={selectedLaporan.logbookFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {selectedLaporan.logbookFile}
                  </a>
                </>
              )}
            </div>

            {/* Footer Modal */}
            <div className="mt-6 flex justify-between items-center flex-shrink-0">
              <span className="text-sm text-gray-600">
                <span className="font-semibold">Submit:</span>{' '}
                {formatTanggalSubmit(selectedLaporan.tanggalSubmit)}
              </span>
              <button
                onClick={handleCloseModal}
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
