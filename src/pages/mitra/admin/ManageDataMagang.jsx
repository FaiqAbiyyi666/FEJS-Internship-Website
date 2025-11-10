// ManageDataMagang.jsx
import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { Eye, Download, Loader2 } from 'lucide-react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { useLoading } from '../../../contexts/LoadingContext';

const formatDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

function generateFullLogbook(startDateStr, endDateStr, existingLogs) {
  if (!startDateStr || !endDateStr) {
    return [];
  }

  const logMap = new Map();
  for (const log of existingLogs) {
    logMap.set(log.tanggal, log);
  }

  let allWeeks = [];

  const startParts = startDateStr.split('-').map(Number);
  const endParts = endDateStr.split('-').map(Number);

  let current = new Date(
    Date.UTC(startParts[0], startParts[1] - 1, startParts[2])
  );
  let end = new Date(Date.UTC(endParts[0], endParts[1] - 1, endParts[2]));

  let weekIndex = 0;

  while (current <= end) {
    let harian = [];

    let weekEndDate = new Date(current);
    weekEndDate.setUTCDate(current.getUTCDate() + 6);

    if (weekEndDate > end) {
      weekEndDate = new Date(end);
    }

    let dayInWeek = new Date(current);

    while (dayInWeek <= weekEndDate) {
      if (dayInWeek > end) break;

      const dayStr = formatDate(dayInWeek);
      const existingLog = logMap.get(dayStr);

      if (existingLog) {
        harian.push({
          ...existingLog,
          tanggal: dayStr,
        });
      } else {
        harian.push({
          id: `missing-${dayStr}`,
          tanggal: dayStr,
          isi: '',
          done: false,
        });
      }

      dayInWeek.setUTCDate(dayInWeek.getUTCDate() + 1);
    }

    if (harian.length > 0) {
      allWeeks.push({
        id: `week-${weekIndex}`,
        week: `Minggu ${weekIndex + 1}`,
        range: `${harian[0].tanggal} - ${harian[harian.length - 1].tanggal}`,
        harian: harian,
      });
    }

    current = new Date(weekEndDate);
    current.setUTCDate(current.getUTCDate() + 1);
    weekIndex++;
  }

  return allWeeks;
}

const ITEMS_PER_PAGE = 6;

export default function ManageDataMagang() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  const [search, setSearch] = useState('');
  const [bidangFilter, setBidangFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPeserta, setSelectedPeserta] = useState(null);
  const [daftarPeserta, setDaftarPeserta] = useState([]);
  const { showLoading, hideLoading } = useLoading();
  const [isEditing, setIsEditing] = useState(false);
  const [allBidang, setAllBidang] = useState([]);
  const [formData, setFormData] = useState({});
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
    const loadScript = (src, id) => {
      return new Promise((resolve, reject) => {
        if (document.getElementById(id)) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.id = id;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Gagal memuat skrip ${src}`));
        document.body.appendChild(script);
      });
    };

    Promise.all([
      loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
        'jspdf-script'
      ),
      loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js',
        'jspdf-autotable-script'
      ),
      loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
        'xlsx-script'
      ),
    ])
      .then(() => {
        setScriptsLoaded(true);
      })
      .catch((err) => {
        console.error('Gagal memuat skrip ekspor:', err);
        setError(
          'Gagal memuat skrip ekspor. Fitur ekspor PDF/Excel mungkin tidak berfungsi.'
        );
      });
  }, []);

  const fetchSemuaPeserta = useCallback(async () => {
    showLoading();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/admin/data-magang', {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });

      const result = await res.json();

      if (result.status && Array.isArray(result.data)) {
        setDaftarPeserta(result.data);
      } else {
        console.error('Gagal mengambil data peserta:', result.message);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  useEffect(() => {
    fetchSemuaPeserta();
  }, [fetchSemuaPeserta]);

  const formatDateForInput = (isoString) => {
    if (!isoString) return '';
    return isoString.split('T')[0];
  };

  const initializeFormData = (peserta) => {
    setFormData({
      namaLengkap: peserta.nama || '',
      nimNis: peserta.nim || '',
      email: peserta.email || '',
      tglLahir: formatDateForInput(peserta.tglLahir),
      noTelepon: peserta.noTelepon || '',
      nik: peserta.nik || '',
      alamat: peserta.alamat || '',
      instansi: peserta.instansi || '',
      jurusan: peserta.jurusan || '',
      instagram: peserta.instagram || '',
      periodeMulai: formatDateForInput(peserta.periodeMulai),
      periodeSelesai: formatDateForInput(peserta.periodeSelesai),
      bidangId: peserta.bidangId || '',
      ajuanId: peserta.ajuanId || '',
    });
  };

  useEffect(() => {
    if (selectedPeserta) {
      initializeFormData(selectedPeserta);
      setIsEditing(false);
      setNotification({ message: '', type: '' });
    }
  }, [selectedPeserta]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setNotification({ message: '', type: '' });
    initializeFormData(selectedPeserta);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification({ message: '', type: '' });

    if (
      !window.confirm('Anda yakin ingin menyimpan perubahan data peserta ini?')
    ) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `http://localhost:3000/api/admin/peserta-magang/${selectedPeserta.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      setNotification({ message: result.message, type: 'success' });
      setIsEditing(false);

      await fetchSemuaPeserta();
    } catch (err) {
      console.error('Error submit:', err);
      setNotification({
        message: err.message || 'Gagal menyimpan data.',
        type: 'error',
      });
    }
  };

  const fullLogbookCalendar = useMemo(() => {
    if (!selectedPeserta) {
      return [];
    }
    return generateFullLogbook(
      selectedPeserta.periodeMulai,
      selectedPeserta.periodeSelesai,
      selectedPeserta.logbook
    );
  }, [selectedPeserta]);

  const inputClass =
    'w-full text-gray-600 border border-gray-300 rounded-md px-3 py-1.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500';
  const readOnlyClass = 'text-gray-500 bg-gray-100 italic';
  const labelClass = 'font-semibold text-black';

  const filtered = daftarPeserta.filter((d) => {
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      d.nama.toLowerCase().includes(q) ||
      (d.nim && d.nim.toLowerCase().includes(q)) ||
      (d.instansi && d.instansi.toLowerCase().includes(q)) ||
      (d.email && d.email.toLowerCase().includes(q));
    const matchBidang =
      !bidangFilter ||
      bidangFilter === 'all' ||
      d.bidang.toLowerCase() === bidangFilter.toLowerCase();
    return matchSearch && matchBidang;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const exportAllExcel = async () => {
    if (daftarPeserta.length === 0) {
      alert('Belum ada data peserta untuk diekspor.');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data Peserta Magang');

    worksheet.columns = [
      { header: 'NAMA', key: 'nama', width: 30 },
      { header: 'TANGGAL LAHIR', key: 'tglLahir', width: 20 },
      { header: 'NIM / NIS', key: 'nim', width: 20 },
      { header: 'EMAIL', key: 'email', width: 30 },
      { header: 'NO TELEPON', key: 'noTelepon', width: 20 },
      { header: 'NIK', key: 'nik', width: 20 },
      { header: 'BIDANG', key: 'bidang', width: 25 },
      { header: 'INSTANSI', key: 'instansi', width: 30 },
      { header: 'JURUSAN', key: 'jurusan', width: 25 },
      { header: 'ALAMAT', key: 'alamat', width: 50 },
      { header: 'INSTAGRAM', key: 'instagram', width: 50 },
      { header: 'PERIODE', key: 'periode', width: 25 },
      { header: 'SURAT MAGANG', key: 'suratMagang', width: 40 },
      { header: 'SERTIFIKAT', key: 'sertifikat', width: 40 },
      { header: 'STATUS MAGANG', key: 'statusMagang', width: 20 },
    ];

    const exportData = daftarPeserta.map((d) => ({
      nama: d.nama,
      tglLahir: d.tglLahir ? d.tglLahir.split('T')[0] : '',
      nim: d.nim,
      email: d.email,
      noTelepon: d.noTelepon,
      nik: d.nik,
      bidang: d.bidang,
      instansi: d.instansi,
      jurusan: d.jurusan,
      alamat: d.alamat,
      instagram: d.instagram,
      periode: `${d.periodeMulai.split('T')[0]} - ${
        d.periodeSelesai.split('T')[0]
      }`,
      suratMagang: d.suratMagang,
      sertifikat: d.sertifikat,
      statusMagang: d.statusMagang,
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

        if (
          colKey === 'alamat' ||
          colKey === 'suratMagang' ||
          colKey === 'sertifikat'
        ) {
          cell.alignment = { wrapText: true, vertical: 'top' };
        }
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const today = new Date().toISOString().split('T')[0];
    const fileName = `Arsip_Data_Magang_${today}.xlsx`;

    saveAs(new Blob([buffer]), fileName);
  };

  const goToPage = (n) => {
    const p = Math.min(Math.max(1, n), totalPages);
    setCurrentPage(p);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
          <input
            type="text"
            placeholder="Cari berdasarkan nama / NIM / email / Instasi..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-auto min-w-[28rem] px-4 py-2 border rounded-md focus:ring-[#006DA6] focus:border-[#006DA6]"
          />

          <select
            value={bidangFilter}
            onChange={(e) => setBidangFilter(e.target.value)}
            className="w-auto px-4 py-2 border border-gray-300 rounded-lg 
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
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportAllExcel}
            className="px-3 py-2 bg-[#006DA6] text-white rounded hover:bg-[#003c5d] text-base flex items-center gap-2"
          >
            <Download size={20} /> Ekspor Data Magang
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {paginated.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            Tidak ada peserta cocok dengan filter.
          </div>
        ) : (
          paginated.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-lg shadow p-4 flex items-start gap-4"
            >
              <div className="w-20 h-20 rounded-md overflow-hidden border flex-shrink-0">
                <img
                  src={p.foto}
                  alt={p.nama}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="font-bold text-gray-900 text-lg mb-2">
                  {p.nim} - {p.nama}
                </div>

                <div className="grid grid-cols-[180px,1fr] gap-y-1 text-sm text-gray-700">
                  <div className="font-semibold">Email</div>
                  <div>: {p.email}</div>

                  <div className="font-semibold">Institusi</div>
                  <div>: {p.instansi}</div>

                  <div className="font-semibold">Bidang</div>
                  <div>: {p.bidang}</div>

                  <div className="font-semibold">Periode</div>
                  <div>
                    : {p.periodeMulai} s/d {p.periodeSelesai}
                  </div>

                  <div className="font-semibold">Status Surat Magang</div>
                  <div>: {p.suratMagang}</div>

                  <div className="font-semibold">Status Magang</div>
                  <div>: {p.statusMagang}</div>

                  <div className="font-semibold">Status Sertifikat</div>
                  <div>: {p.sertifikat}</div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setSelectedPeserta(p)}
                  className="px-3 py-1 bg-[#006DA6] text-white rounded text-sm flex items-center gap-1"
                >
                  <Eye size={14} /> Detail
                </button>
                <button
                  onClick={() => exportPesertaPDF(p)}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm flex items-center gap-1"
                >
                  <Download size={14} /> Export
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-white rounded-lg shadow px-4 py-3 flex flex-col md:flex-row items-center justify-between mt-4">
        <p className="text-sm text-gray-700 mb-2 md:mb-0">
          Menampilkan{' '}
          <span className="font-medium">
            {(currentPage - 1) * ITEMS_PER_PAGE + (paginated.length ? 1 : 0)}
          </span>{' '}
          -{' '}
          <span className="font-medium">
            {(currentPage - 1) * ITEMS_PER_PAGE + paginated.length}
          </span>{' '}
          dari <span className="font-medium">{filtered.length}</span> hasil
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? 'bg-[#006DA6] text-white' : ''
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {selectedPeserta && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-start justify-center overflow-auto p-6"
          onClick={() => setSelectedPeserta(null)}
        >
          <div
            className="bg-white w-full max-w-5xl rounded-lg shadow-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 p-6 bg-white">
                <div className="w-24 h-24 rounded overflow-hidden">
                  <img
                    src={selectedPeserta.foto}
                    alt={selectedPeserta.nama}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#006DA6] mb-1">
                    Detail Akun Peserta Magang
                  </h2>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedPeserta.nama}
                  </h3>
                  <div className="text-base text-gray-600 mt-1">
                    {selectedPeserta.nim} • {selectedPeserta.jurusan}
                  </div>
                </div>
              </div>
              <div className="p-6 flex flex-col items-end ">
                <div className="text-sm text-gray-700">Bidang</div>
                <div className="text-lg font-semibold">
                  {selectedPeserta.bidang}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {selectedPeserta.periodeMulai} s/d{' '}
                  {selectedPeserta.periodeSelesai}
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <form onSubmit={handleSubmit}>
                {notification.message && (
                  <div
                    className={`p-3 mb-4 rounded-lg text-sm ${
                      notification.type === 'success'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {notification.message}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="text-base space-y-3">
                      <div>
                        <div className={labelClass}>Nama</div>
                        {isEditing ? (
                          <input
                            type="text"
                            name="namaLengkap"
                            value={formData.namaLengkap}
                            onChange={handleInputChange}
                            className={inputClass}
                          />
                        ) : (
                          <div className="text-gray-600">
                            {selectedPeserta.nama}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className={labelClass}>NIM / NIS</div>
                        {isEditing ? (
                          <input
                            type="text"
                            name="nimNis"
                            value={formData.nimNis}
                            onChange={handleInputChange}
                            className={inputClass}
                          />
                        ) : (
                          <div className="text-gray-600">
                            {selectedPeserta.nim}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className={labelClass}>Email</div>
                        {isEditing ? (
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={inputClass}
                          />
                        ) : (
                          <div className="text-gray-600">
                            {selectedPeserta.email}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className={labelClass}>Tanggal Lahir</div>
                        {isEditing ? (
                          <input
                            type="date"
                            name="tglLahir"
                            value={formData.tglLahir}
                            onChange={handleInputChange}
                            className={inputClass}
                          />
                        ) : (
                          <div className="text-gray-600">
                            {selectedPeserta.tglLahir
                              ? selectedPeserta.tglLahir.split('T')[0]
                              : 'N/A'}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className={labelClass}>No. Telepon</div>
                        {isEditing ? (
                          <input
                            type="tel"
                            name="noTelepon"
                            value={formData.noTelepon}
                            onChange={handleInputChange}
                            className={inputClass}
                          />
                        ) : (
                          <div className="text-gray-600">
                            {selectedPeserta.noTelepon}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className={labelClass}>
                          Nomor Induk Kependudukan
                        </div>
                        {isEditing ? (
                          <input
                            type="text"
                            name="nik"
                            value={formData.nik}
                            onChange={handleInputChange}
                            className={inputClass}
                          />
                        ) : (
                          <div className="text-gray-600">
                            {selectedPeserta.nik}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className={labelClass}>Alamat</div>
                        {isEditing ? (
                          <textarea
                            name="alamat"
                            value={formData.alamat}
                            onChange={handleInputChange}
                            className={inputClass}
                            rows={2}
                          />
                        ) : (
                          <div className="text-gray-600">
                            {selectedPeserta.alamat}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className={labelClass}>Instansi</div>
                        {isEditing ? (
                          <input
                            type="text"
                            name="instansi"
                            value={formData.instansi}
                            onChange={handleInputChange}
                            className={inputClass}
                          />
                        ) : (
                          <div className="text-gray-600">
                            {selectedPeserta.instansi}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className={labelClass}>Jurusan</div>
                        {isEditing ? (
                          <input
                            type="text"
                            name="jurusan"
                            value={formData.jurusan}
                            onChange={handleInputChange}
                            className={inputClass}
                          />
                        ) : (
                          <div className="text-gray-600">
                            {selectedPeserta.jurusan}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className={labelClass}>Instagram</div>
                        {isEditing ? (
                          <input
                            type="text"
                            name="intagram"
                            value={formData.instagram}
                            onChange={handleInputChange}
                            className={inputClass}
                          />
                        ) : (
                          <div className="text-gray-600">
                            {selectedPeserta.instagram}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="text-base space-y-3">
                      <div>
                        <div className={labelClass}>Periode</div>
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="date"
                              name="periodeMulai"
                              value={formData.periodeMulai}
                              onChange={handleInputChange}
                              className={inputClass}
                            />
                            <span>s/d</span>
                            <input
                              type="date"
                              name="periodeSelesai"
                              value={formData.periodeSelesai}
                              onChange={handleInputChange}
                              className={inputClass}
                            />
                          </div>
                        ) : (
                          <div className="text-gray-600">
                            {selectedPeserta.periodeMulai
                              ? selectedPeserta.periodeMulai.split('T')[0]
                              : 'N/A'}{' '}
                            s/d{' '}
                            {selectedPeserta.periodeSelesai
                              ? selectedPeserta.periodeSelesai.split('T')[0]
                              : 'N/A'}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className={labelClass}>Bidang</div>
                        {isEditing ? (
                          <select
                            name="bidangId"
                            value={formData.bidangId}
                            onChange={handleInputChange}
                            className={inputClass}
                          >
                            <option value="" disabled>
                              -- Pilih Bidang --
                            </option>
                            {allBidang.map((bidang) => (
                              <option key={bidang.id} value={bidang.id}>
                                {bidang.nama}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="text-gray-600">
                            {selectedPeserta.bidang}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className={labelClass}>Status Magang</div>
                        <div className={readOnlyClass}>
                          {selectedPeserta.statusMagang}
                        </div>
                      </div>

                      <div>
                        <div className={labelClass}>Laporan Akhir</div>
                        <div className={readOnlyClass}>
                          {selectedPeserta.laporanAkhir?.status || '-'}
                        </div>
                      </div>

                      <div>
                        <div className={labelClass}>Status Surat Magang</div>
                        <div className={readOnlyClass}>
                          {selectedPeserta.suratMagang}
                        </div>
                      </div>

                      <div>
                        <div className={labelClass}>Status Sertifikat</div>
                        <div className={readOnlyClass}>
                          {selectedPeserta.sertifikat || '-'}{' '}
                          {selectedPeserta.sertifikatData?.nilai
                            ? ` • Nilai: ${selectedPeserta.sertifikatData.nilai}`
                            : ''}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={handleCancelClick}
                        className="px-6 py-2 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-lg bg-[#006DA6] text-white font-medium hover:bg-[#003c5d]"
                      >
                        Simpan Data
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700"
                    >
                      Ubah Data Peserta
                    </button>
                  )}
                </div>
              </form>
              <div>
                <h4 className="text-xl font-bold text-[#006DA6] mb-3">
                  Laporan Harian (Kalender Lengkap)
                </h4>
                <div className="space-y-4">
                  {fullLogbookCalendar && fullLogbookCalendar.length ? (
                    fullLogbookCalendar.map((w, idx) => {
                      const isComplete = w.harian?.every((d) => d.done);

                      return (
                        <div
                          key={w.id}
                          className="bg-white border rounded-lg shadow-sm"
                        >
                          <div className="p-4 w-full flex items-center justify-between text-left">
                            <div>
                              <div
                                className={`text-base font-medium ${
                                  isComplete
                                    ? 'text-green-600'
                                    : 'text-orange-500'
                                }`}
                              >
                                {isComplete ? 'Lengkap' : 'Belum Lengkap'}
                              </div>
                              <div className="font-bold text-gray-800">
                                {w.week} ({w.range})
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2 sm:gap-4">
                                {w.harian.map((day) => (
                                  <div
                                    key={day.id}
                                    className="flex flex-col items-center"
                                  >
                                    <div
                                      title={day.tanggal}
                                      className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center text-sm sm:text-base ${
                                        day.done
                                          ? 'bg-[#006DA6] text-white border-[#006DA6]'
                                          : 'bg-white text-gray-400 border-gray-500'
                                      }`}
                                    >
                                      {day.done ? '✓' : ''}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-sm text-gray-500">
                      Periode magang peserta ini belum diatur, atau tidak ada
                      data logbook untuk ditampilkan.
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedPeserta(null)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
