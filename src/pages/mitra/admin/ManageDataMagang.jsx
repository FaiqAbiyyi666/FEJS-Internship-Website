// ManageDataMagang.jsx
import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    const fetchSemuaPeserta = async () => {
      showLoading();
      try {
        const token = localStorage.getItem('token'); // Ambil token admin

        // Panggil endpoint yang sudah kita siapkan
        const res = await fetch('http://localhost:3000/api/admin/data-magang', {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store', // Selalu ambil data baru
        });

        const result = await res.json();

        if (result.status && Array.isArray(result.data)) {
          // --- TIDAK PERLU PENYESUAIAN ---
          // Data dari backend (result.data) langsung disimpan ke state
          // karena formatnya sudah benar.
          setDaftarPeserta(result.data);
        } else {
          console.error('Gagal mengambil data peserta:', result.message);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        hideLoading();
      }
    };

    fetchSemuaPeserta();
  }, [showLoading, hideLoading]);

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

  // export single peserta to PDF
  const exportPesertaPDF = (p) => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    doc.setFontSize(16);
    doc.text('Detail Peserta Magang', 40, 40);
    doc.setFontSize(11);

    const info = [
      ['Nama', p.nama],
      ['NIM / NIS', p.nim || '-'],
      ['Email', p.email || '-'],
      ['No. Telepon', p.noTelepon || '-'],
      ['Bidang', p.bidang],
      ['Instansi', p.instansi],
      ['Jurusan', p.jurusan || '-'],
      ['Alamat', p.alamat || '-'],
      ['Periode Magang', `${p.periodeMulai} - ${p.periodeSelesai}`],
      ['Status Laporan Akhir', p.laporanAkhir.status || '-'],
      ['Status Surat Magang', p.suratMagang || '-'],
      ['Status Magang', p.statusMagang || '-'],
      ['Status Sertifikat', p.sertifikat || '-'],
    ];

    autoTable(doc, {
      startY: 70,
      head: [['Field', 'Detail']],
      body: info,
      styles: { fontSize: 10 },
    });

    doc.save(`Peserta-${p.nama.replace(/\s+/g, '_')}.pdf`);
  };

  // export all to excel
  const exportAllExcel = () => {
    const exportData = daftarPeserta.map((d) => ({
      nama: d.nama,
      nim: d.nim,
      email: d.email,
      phone: d.phone,
      bidang: d.bidang,
      instansi: d.instansi,
      jurusan: d.jurusan,
      alamat: d.alamat,
      periode: `${d.periodeMulai} - ${d.periodeSelesai}`,
      suratMagang: d.suratMagang,
      sertifikat: d.sertifikat,
      status: d.statusMagang,
    }));

    // Buat tanggal export (YYYY-MM-DD)
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'PesertaMagang');
    XLSX.writeFile(wb, `Arsip_Data_Magang_${formattedDate}.xlsx`);
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                  <div className="text-base space-y-3">
                    <div>
                      <div className="font-semibold text-black">Nama</div>
                      <div className="text-gray-600">
                        {selectedPeserta.nama}
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-black">NIM / NIS</div>
                      <div className="text-gray-600">{selectedPeserta.nim}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-black">Email</div>
                      <div className="text-gray-600">
                        {selectedPeserta.email}
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-black">
                        No. Telepon
                      </div>
                      <div className="text-gray-600">
                        {selectedPeserta.noTelepon}
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-black">Alamat</div>
                      <div className="text-gray-600">
                        {selectedPeserta.alamat}
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-black">Instansi</div>
                      <div className="text-gray-600">
                        {selectedPeserta.instansi}
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-black">Jurusan</div>
                      <div className="text-gray-600">
                        {selectedPeserta.jurusan}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4 shadow-sm">
                  <div className="text-base space-y-3">
                    <div>
                      <div className="font-semibold text-black">
                        Status Magang
                      </div>
                      <div className="text-gray-600">
                        {selectedPeserta.statusMagang}
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-black">Periode</div>
                      <div className="text-gray-600">
                        {selectedPeserta.periodeMulai} s/d{' '}
                        {selectedPeserta.periodeSelesai}
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-black">Bidang</div>
                      <div className="text-gray-600">
                        {selectedPeserta.bidang}
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-black">
                        Laporan Akhir
                      </div>
                      <div className="text-gray-600">
                        {selectedPeserta.laporanAkhir?.status || '-'}{' '}
                        {selectedPeserta.laporanAkhir?.nilai
                          ? ` • Nilai: ${selectedPeserta.laporanAkhir.nilai}`
                          : ''}
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-black">
                        Status Surat Magang
                      </div>
                      <div className="text-gray-600">
                        {selectedPeserta.suratMagang}
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-black">
                        Status Sertifikat
                      </div>
                      <div className="text-gray-600">
                        {selectedPeserta.sertifikat}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

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
