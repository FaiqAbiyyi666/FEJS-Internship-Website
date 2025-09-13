// ManageDataMagang.jsx
import React, { useMemo, useState } from 'react';
import { Eye, DownloadCloud } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const ITEMS_PER_PAGE = 6;

const dummyData = [
  {
    id: 'p1',
    foto: 'https://randomuser.me/api/portraits/women/68.jpg',
    nama: 'Lala Trilili',
    nim: '21082010118',
    email: 'lala@example.com',
    phone: '081234567890',
    bidang: 'Tata Kelola Informatika',
    instansi: 'Universitas Pembangunan Nasional "Veteran" Jawa Timur',
    jurusan: 'Sistem Informasi',
    alamat: 'Jl. Raya Veteran No.12, Surabaya',
    periodeMulai: '2024-03-04',
    periodeSelesai: '2024-05-03',
    statusMagang: 'Selesai',
    fotoThumb: null,
    // sample weekly logbook: array of weeks each with daily entries
    logbook: [
      {
        week: 'Minggu 1',
        range: '2024-03-04 - 2024-03-08',
        harian: [
          { tanggal: '2024-03-04', isi: 'Observasi sistem lama', done: true },
          { tanggal: '2024-03-05', isi: 'Meeting tim', done: true },
          { tanggal: '2024-03-06', isi: '', done: false },
          { tanggal: '2024-03-07', isi: '', done: false },
          { tanggal: '2024-03-08', isi: '', done: false },
        ],
      },
      {
        week: 'Minggu 2',
        range: '2024-03-11 - 2024-03-15',
        harian: [
          { tanggal: '2024-03-11', isi: 'Membuat flowchart', done: true },
          { tanggal: '2024-03-12', isi: '', done: false },
          { tanggal: '2024-03-13', isi: '', done: false },
          { tanggal: '2024-03-14', isi: '', done: false },
          { tanggal: '2024-03-15', isi: '', done: false },
        ],
      },
    ],
    laporanAkhir: { status: 'Belum Dikirim', nilai: null },
  },
  {
    id: 'p2',
    foto: 'https://randomuser.me/api/portraits/men/45.jpg',
    nama: 'Arif Haryanto',
    nim: '21082010119',
    email: 'arif@example.com',
    phone: '081298765432',
    bidang: 'Sekretariat',
    instansi: 'Politeknik Negeri Malang',
    jurusan: 'Ilmu Administrasi',
    alamat: 'Jl. Merdeka No.5, Malang',
    periodeMulai: '2024-04-01',
    periodeSelesai: '2024-06-30',
    statusMagang: 'Aktif',
    logbook: [
      {
        week: 'Minggu 1',
        range: '2024-04-01 - 2024-04-05',
        harian: [
          { tanggal: '2024-04-01', isi: '', done: false },
          { tanggal: '2024-04-02', isi: '', done: false },
          { tanggal: '2024-04-03', isi: '', done: false },
          { tanggal: '2024-04-04', isi: '', done: false },
          { tanggal: '2024-04-05', isi: '', done: false },
        ],
      },
    ],
    laporanAkhir: { status: 'Belum Dikirim', nilai: null },
  },
  {
    id: 'p3',
    foto: 'https://randomuser.me/api/portraits/women/12.jpg',
    nama: 'Nadia Putri',
    nim: '21082010120',
    email: 'nadia@example.com',
    phone: '081377788899',
    bidang: 'Infrastruktur & Keamanan TIK',
    instansi: 'Universitas Diponegoro',
    jurusan: 'Teknik Informatika',
    alamat: 'Jl. Prof. Sudarto No.2, Semarang',
    periodeMulai: '2024-02-15',
    periodeSelesai: '2024-05-15',
    statusMagang: 'Aktif',
    logbook: [],
    laporanAkhir: { status: 'Diterima', nilai: 85 },
  },
  // ... tambahkan lebih banyak dummy sesuai kebutuhan
];

export default function ManageDataMagang() {
  const [data, setData] = useState(dummyData);
  const [search, setSearch] = useState('');
  const [bidangFilter, setBidangFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPeserta, setSelectedPeserta] = useState(null);

  const bidangOptions = useMemo(() => {
    const s = new Set(data.map((d) => d.bidang));
    return Array.from(s);
  }, [data]);

  // filtered & pagination
  const filtered = data.filter((d) => {
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      d.nama.toLowerCase().includes(q) ||
      (d.nim && d.nim.toLowerCase().includes(q)) ||
      (d.email && d.email.toLowerCase().includes(q));
    const matchBidang = !bidangFilter || d.bidang === bidangFilter;
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
      ['No. Telp', p.phone || '-'],
      ['Bidang', p.bidang],
      ['Instansi', p.instansi],
      ['Jurusan', p.jurusan || '-'],
      ['Alamat', p.alamat || '-'],
      ['Periode Magang', `${p.periodeMulai} - ${p.periodeSelesai}`],
      ['Status Magang', p.statusMagang || '-'],
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
    const exportData = data.map((d) => ({
      nama: d.nama,
      nim: d.nim,
      email: d.email,
      phone: d.phone,
      bidang: d.bidang,
      instansi: d.instansi,
      jurusan: d.jurusan,
      alamat: d.alamat,
      periode: `${d.periodeMulai} - ${d.periodeSelesai}`,
      status: d.statusMagang,
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'PesertaMagang');
    XLSX.writeFile(wb, 'PesertaMagang.xlsx');
  };

  // export all to pdf
  const exportAllPDF = () => {
    const doc = new jsPDF({
      unit: 'pt',
      format: 'a4',
      orientation: 'portrait',
    });
    doc.setFontSize(14);
    doc.text('Daftar Peserta Magang', 40, 40);

    const body = data.map((d) => [
      d.nim || '-',
      d.nama,
      d.bidang,
      d.instansi,
      `${d.periodeMulai} - ${d.periodeSelesai}`,
      d.statusMagang || '-',
    ]);

    autoTable(doc, {
      startY: 70,
      head: [['NIM', 'Nama', 'Bidang', 'Instansi', 'Periode', 'Status']],
      body,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [0, 109, 166] },
    });

    doc.save('Daftar_Peserta_Magang.pdf');
  };

  // pagination helpers
  const goToPage = (n) => {
    const p = Math.min(Math.max(1, n), totalPages);
    setCurrentPage(p);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header + actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Arsip Data Magang
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola data peserta magang — lihat detail, eksport, dan filter.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportAllPDF}
            className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm flex items-center gap-2"
          >
            <DownloadCloud size={16} /> Ekspor PDF
          </button>
          <button
            onClick={exportAllExcel}
            className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm flex items-center gap-2"
          >
            <DownloadCloud size={16} /> Ekspor Excel
          </button>
        </div>
      </div>

      {/* Search & filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
          <input
            type="text"
            placeholder="Cari nama / NIM / email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-96 px-4 py-2 border rounded-md focus:ring-[#006DA6] focus:border-[#006DA6]"
          />

          <select
            value={bidangFilter}
            onChange={(e) => {
              setBidangFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border rounded-md"
          >
            <option value="">Semua Bidang</option>
            {bidangOptions.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
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
              <div className="w-16 h-16 rounded-md overflow-hidden border flex-shrink-0">
                <img
                  src={p.foto}
                  alt={p.nama}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Informasi Peserta */}
              <div className="flex-1">
                <div className="font-semibold text-gray-900 text-base mb-2">
                  {p.nim} - {p.nama}
                </div>

                {/* Grid dengan 2 kolom fleksibel */}
                <div className="grid grid-cols-[120px,1fr] gap-y-1 text-sm text-gray-700">
                  <div className="font-medium">Email</div>
                  <div>: {p.email}</div>

                  <div className="font-medium">Institusi</div>
                  <div>: {p.instansi}</div>

                  <div className="font-medium">Bidang</div>
                  <div>: {p.bidang}</div>

                  <div className="font-medium">Periode</div>
                  <div>
                    : {p.periodeMulai} s/d {p.periodeSelesai}
                  </div>

                  <div className="font-medium">Status Dokumen</div>
                  <div>: {p.statusDokumen}</div>

                  <div className="font-medium">Status Magang</div>
                  <div>: {p.statusMagang}</div>
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
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm flex items-center gap-1"
                >
                  <DownloadCloud size={14} /> Export
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
                  <h2 className="text-xl font-semibold text-[#006DA6]">
                    Detail Laporan Harian
                  </h2>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedPeserta.nama}
                  </h3>
                  <div className="text-sm text-gray-600 mt-1">
                    {selectedPeserta.nim} • {selectedPeserta.jurusan}
                  </div>
                </div>
              </div>
              <div className="p-6 bg-[#f3f9fd] flex flex-col items-end gap-2">
                <div className="text-sm text-gray-700">Bidang</div>
                <div className="text-lg font-semibold">
                  {selectedPeserta.bidang}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {selectedPeserta.periodeMulai} —{' '}
                  {selectedPeserta.periodeSelesai}
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Info cards: Personal & Instansi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Informasi Pribadi
                  </h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>
                      <strong>Nama:</strong> {selectedPeserta.nama}
                    </div>
                    <div>
                      <strong>NIM / NIS:</strong> {selectedPeserta.nim}
                    </div>
                    <div>
                      <strong>Email:</strong> {selectedPeserta.email}
                    </div>
                    <div>
                      <strong>No. Telp:</strong> {selectedPeserta.phone}
                    </div>
                    <div>
                      <strong>Alamat:</strong> {selectedPeserta.alamat}
                    </div>
                    <div>
                      <strong>Status Magang:</strong>{' '}
                      {selectedPeserta.statusMagang}
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4 shadow-sm">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Instansi & Akademik
                  </h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>
                      <strong>Instansi:</strong> {selectedPeserta.instansi}
                    </div>
                    <div>
                      <strong>Jurusan:</strong> {selectedPeserta.jurusan}
                    </div>
                    <div>
                      <strong>Periode:</strong> {selectedPeserta.periodeMulai} —{' '}
                      {selectedPeserta.periodeSelesai}
                    </div>
                    <div>
                      <strong>Bidang:</strong> {selectedPeserta.bidang}
                    </div>
                    <div>
                      <strong>Laporan Akhir:</strong>{' '}
                      {selectedPeserta.laporanAkhir?.status || '-'}{' '}
                      {selectedPeserta.laporanAkhir?.nilai
                        ? ` • Nilai: ${selectedPeserta.laporanAkhir.nilai}`
                        : ''}
                    </div>
                  </div>
                </div>
              </div>

              {/* Weekly cards like reference */}
              <div>
                <h4 className="text-md font-semibold text-gray-800 mb-3">
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
                          <div className="text-sm text-orange-500 font-medium">
                            Belum Lengkap
                          </div>
                          <div className="font-semibold text-gray-800">
                            {w.range}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {w.harian.map((day, di) => (
                              <div
                                key={di}
                                className="flex flex-col items-center"
                              >
                                <div
                                  className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                                    day.done
                                      ? 'bg-[#006DA6] text-white border-[#006DA6]'
                                      : 'bg-white text-gray-400 border-gray-300'
                                  }`}
                                >
                                  {day.done ? '✓' : ''}
                                </div>
                                <div className="text-xs text-gray-600 mt-1">
                                  {new Date(day.tanggal).toLocaleDateString()}
                                </div>
                              </div>
                            ))}
                          </div>

                          <button
                            onClick={() => {
                              // scroll to week detail inside modal by opening a sub-view
                              // For simplicity show detailed week items in a small popup panel below
                              // Here we reuse selectedPeserta + toggle a small state — but to keep code simple, show an alert or open a small inline detail
                              // We'll open an inline detail by toggling a local detail flag on the participant object (not persisted)
                              // Implement inline expansion:
                              const expandedKey = `__expanded_${p.id}_${idx}`;
                              // We'll do expansion by setting a property on selectedPeserta state copy:
                              setSelectedPeserta((prev) => {
                                if (!prev) return prev;
                                const copy = { ...prev };
                                copy._expandedWeek =
                                  copy._expandedWeek === idx ? null : idx;
                                return copy;
                              });
                            }}
                            className="px-3 py-2 bg-[#006DA6] text-white rounded text-sm"
                          >
                            Lihat Mingguan
                          </button>
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
