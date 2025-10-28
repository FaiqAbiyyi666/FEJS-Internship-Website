// ManageDataMagang.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { Eye, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useLoading } from '../../../contexts/LoadingContext';

const ITEMS_PER_PAGE = 6;

export default function ManageDataMagang() {
  const [search, setSearch] = useState('');
  const [bidangFilter, setBidangFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPeserta, setSelectedPeserta] = useState(null);
  const [daftarPeserta, setDaftarPeserta] = useState([]);
  const { showLoading, hideLoading } = useLoading();
  const [isEditing, setIsEditing] = useState(false);
  const [allBidang, setAllBidang] = useState([]); // Untuk <select> dropdown
  const [formData, setFormData] = useState({});
  const [notification, setNotification] = useState({ message: '', type: '' });

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

  // Helper untuk memformat tanggal ISO ke YYYY-MM-DD
  const formatDateForInput = (isoString) => {
    if (!isoString) return '';
    return isoString.split('T')[0];
  };

  // Fungsi untuk mengisi state form
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
      periodeMulai: formatDateForInput(peserta.periodeMulai),
      periodeSelesai: formatDateForInput(peserta.periodeSelesai),
      bidangId: peserta.bidangId || '', // PRASYARAT (Lihat Bagian 3)
      ajuanId: peserta.ajuanId || '', // PRASYARAT (Lihat Bagian 3)
    });
  };

  // Isi form saat data peserta berubah (misal user klik peserta lain)
  useEffect(() => {
    if (selectedPeserta) {
      initializeFormData(selectedPeserta);
      setIsEditing(false); // Selalu kembali ke mode view
      setNotification({ message: '', type: '' }); // Hapus notifikasi lama
    }
  }, [selectedPeserta]);

  // Handler untuk input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler untuk tombol "Batal"
  const handleCancelClick = () => {
    setIsEditing(false);
    setNotification({ message: '', type: '' });
    // Reset form ke data asli
    initializeFormData(selectedPeserta);
  };

  // Handler untuk tombol "Simpan Data"
  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification({ message: '', type: '' });

    // Validasi Konfirmasi
    if (
      !window.confirm('Anda yakin ingin menyimpan perubahan data peserta ini?')
    ) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      // Panggil API baru yang kita buat di Bagian 1
      const res = await fetch(
        `http://localhost:3000/api/admin/peserta-magang/${selectedPeserta.id}`,
        {
          // selectedPeserta.id adalah userId
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

      // Beri tahu komponen parent untuk refresh data (PENTING)
      await fetchSemuaPeserta();
    } catch (err) {
      console.error('Error submit:', err);
      setNotification({
        message: err.message || 'Gagal menyimpan data.',
        type: 'error',
      });
    }
  };

  const inputClass =
    'w-full text-gray-600 border border-gray-300 rounded-md px-3 py-1.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500';
  const readOnlyClass = 'text-gray-500 bg-gray-100 italic';
  const labelClass = 'font-semibold text-black';

  // filtered & pagination
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

  // export all to excel
  const exportAllExcel = () => {
    const exportData = daftarPeserta.map((d) => ({
      NAMA: d.nama,
      'TANGGAL LAHIR': d.tglLahir ? d.tglLahir.split('T')[0] : '', // Tambahan: Format juga tgl lahir
      'NIM / NIS': d.nim,
      EMAIL: d.email,
      'NO TELEPON': d.noTelepon,
      NIK: d.nik,
      BIDANG: d.bidang,
      INSTANSI: d.instansi,
      JURUSAN: d.jurusan,
      ALAMAT: d.alamat,
      PERIODE: `${d.periodeMulai.split('T')[0]} - ${
        d.periodeSelesai.split('T')[0]
      }`,
      'SURAT MAGANG': d.suratMagang,
      SERTIFIKAT: d.sertifikat,
      'STATUS MAGANG': d.statusMagang,
    }));

    // Buat tanggal export (YYYY-MM-DD)
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    const ws = XLSX.utils.json_to_sheet(exportData);

    // ---- MULAI MODIFIKASI STYLE ----

    // 1. Definisikan style
    const borderStyle = {
      top: { style: 'thin', color: { rgb: '000000' } },
      bottom: { style: 'thin', color: { rgb: '000000' } },
      left: { style: 'thin', color: { rgb: '000000' } },
      right: { style: 'thin', color: { rgb: '000000' } },
    };

    const headerStyle = {
      font: { bold: true },
      fill: { fgColor: { rgb: 'DDEBF7' } }, // Warna Biru muda (Excel)
      border: borderStyle,
    };

    const cellStyle = {
      border: borderStyle,
    };

    // 2. Dapatkan range worksheet
    const range = XLSX.utils.decode_range(ws['!ref']);
    const numRows = range.e.r; // 0-indexed end row
    const numCols = range.e.c; // 0-indexed end col

    // 3. Loop semua sel untuk menerapkan border
    for (let R = 0; R <= numRows; R++) {
      for (let C = 0; C <= numCols; C++) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = ws[cellRef];

        if (!cell) continue; // Lewati sel kosong

        // Terapkan border ke semua sel
        cell.s = cellStyle;

        // Terapkan style header HANYA ke baris pertama (R === 0)
        if (R === 0) {
          cell.s = headerStyle;
        }
      }
    }

    // (Opsional) Atur lebar kolom agar sedikit lebih rapi
    if (exportData.length > 0) {
      const colWidths = Object.keys(exportData[0]).map((key) => ({
        wch: Math.max(key.length, 15), // Lebar kolom min 15, atau selebar judul
      }));
      ws['!cols'] = colWidths;
    }

    // ---- SELESAI MODIFIKASI STYLE ----

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'PesertaMagang');
    XLSX.writeFile(wb, `Arsip_Data_Magang_${formattedDate}.xlsx`, {
      bookType: 'xlsx',
      cellStyles: true,
    });
  };

  // pagination helpers
  const goToPage = (n) => {
    const p = Math.min(Math.max(1, n), totalPages);
    setCurrentPage(p);
  };

  return (
    <div className="space-y-6">
      {/* Search, filter, & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Kiri: Input & Filter */}
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

          {/* Bidang Filter */}
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

        {/* Kanan: Tombol Ekspor */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportAllExcel}
            className="px-3 py-2 bg-[#006DA6] text-white rounded hover:bg-[#003c5d] text-base flex items-center gap-2"
          >
            <Download size={20} /> Ekspor Data Magang
          </button>
        </div>
      </div>

      {/* Cards list */}
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
              {/* Foto */}
              <div className="w-20 h-20 rounded-md overflow-hidden border flex-shrink-0">
                <img
                  src={p.foto}
                  alt={p.nama}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Informasi Peserta */}
              <div className="flex-1">
                <div className="font-bold text-gray-900 text-lg mb-2">
                  {p.nim} - {p.nama}
                </div>

                {/* Grid dengan 2 kolom fleksibel */}
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

              {/* Tombol Aksi */}
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

      {/* Pagination (diletakkan di bawah daftar, di dalam container) */}
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

      {/* Modal Detail Peserta */}
      {selectedPeserta && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-start justify-center overflow-auto p-6"
          onClick={() => setSelectedPeserta(null)}
        >
          <div
            className="bg-white w-full max-w-5xl rounded-lg shadow-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header two colors */}
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
              {/* Info cards: Personal & Instansi */}
              <form onSubmit={handleSubmit}>
                {/* --- Notifikasi Sukses/Error --- */}
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

                {/* --- Grid 2 Kartu --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* --- KARTU INFO PERSONAL --- */}
                  <div className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="text-base space-y-3">
                      {/* Nama */}
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

                      {/* NIM */}
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

                      {/* Email */}
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

                      {/* Tgl Lahir */}
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

                      {/* No Telepon */}
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

                      {/* NIK */}
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

                      {/* Alamat */}
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

                      {/* Instansi */}
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

                      {/* Jurusan */}
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
                    </div>
                  </div>

                  {/* --- KARTU INFO MAGANG --- */}
                  <div className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="text-base space-y-3">
                      {/* Periode */}
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

                      {/* Bidang */}
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

                      {/* --- Bagian Read-Only --- */}

                      <div>
                        <div className={labelClass}>Status Magang</div>
                        <div className={readOnlyClass}>
                          {selectedPeserta.statusMagang}
                        </div>
                      </div>

                      <div>
                        <div className={labelClass}>Laporan Akhir</div>
                        <div className={readOnlyClass}>
                          {selectedPeserta.laporanAkhir?.status || '-'}{' '}
                          {selectedPeserta.laporanAkhir?.nilai
                            ? ` • Nilai: ${selectedPeserta.laporanAkhir.nilai}`
                            : ''}
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
                          {selectedPeserta.sertifikat}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- Tombol Kontrol --- */}
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

              {/* Weekly cards like reference */}
              <div>
                <h4 className="text-xl font-bold text-[#006DA6] mb-3">
                  Laporan Harian
                </h4>

                <div className="space-y-4">
                  {selectedPeserta.logbook && selectedPeserta.logbook.length ? (
                    selectedPeserta.logbook.map((w, idx) => (
                      <div
                        key={idx}
                        className="bg-white border rounded-lg p-4 shadow-sm flex items-center justify-between"
                      >
                        <div>
                          <div className="text-base text-orange-500 font-medium">
                            Belum Lengkap
                          </div>
                          <div className="font-bold text-gray-800">
                            {w.range}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-6">
                            {w.harian.map((day, di) => (
                              <div
                                key={di}
                                className="flex flex-col items-center"
                              >
                                <div
                                  className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                                    day.done
                                      ? 'bg-[#006DA6] text-white border-[#006DA6]'
                                      : 'bg-white text-gray-400 border-gray-500'
                                  }`}
                                >
                                  {day.done ? '✓' : ''}
                                </div>
                                <div className="text-sm text-gray-600 mt-2">
                                  {new Date(day.tanggal).toLocaleDateString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">
                      Belum ada laporan harian.
                    </div>
                  )}
                </div>
              </div>

              {/* If expanded week (simple inline rendering) */}
              {typeof selectedPeserta._expandedWeek === 'number' &&
                selectedPeserta.logbook[selectedPeserta._expandedWeek] && (
                  <div className="mt-4 bg-white border rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-sm text-gray-500">
                          Detail Minggu
                        </div>
                        <div className="font-semibold text-gray-800">
                          {
                            selectedPeserta.logbook[
                              selectedPeserta._expandedWeek
                            ].week
                          }{' '}
                          •{' '}
                          {
                            selectedPeserta.logbook[
                              selectedPeserta._expandedWeek
                            ].range
                          }
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {selectedPeserta.logbook[
                        selectedPeserta._expandedWeek
                      ].harian.map((day, idx) => (
                        <div
                          key={idx}
                          className="bg-white border rounded p-3 shadow-sm"
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                day.done
                                  ? 'bg-[#006DA6] text-white'
                                  : 'bg-gray-100 text-gray-400'
                              }`}
                            >
                              {day.done ? '✓' : ''}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800">
                                {new Date(day.tanggal).toLocaleDateString()}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {day.isi || 'Belum dibuat'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
