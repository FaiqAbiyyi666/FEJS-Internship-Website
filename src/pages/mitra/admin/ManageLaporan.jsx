import React, { useState } from 'react';
import {
  Search,
  Eye,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import * as xlsx from 'xlsx';
import autoTable from 'jspdf-autotable';

const Card = ({ title, value, icon, gradient, color }) => (
  <div className="bg-white rounded-xl shadow-sm p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
      </div>
      <div className={`p-3 rounded-lg bg-gradient-to-br ${gradient}`}>
        {React.cloneElement(icon, { className: 'text-white' })}
      </div>
    </div>
  </div>
);

export default function ManagementLaporan() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [bidangFilter, setBidangFilter] = useState('all');
  const [selectedLaporan, setSelectedLaporan] = useState(null);

  const [laporanData, setLaporanData] = useState([
    // contoh data
    {
      id: 1,
      peserta: 'Ahmad Rizki',
      bidang: 'Tata Kelola Informatika',
      email: 'rizkiahmad@gmail.com',
      minggu: [
        {
          week: 'Minggu ke‑1',
          tanggal: '2025-07-01',
          harian: [
            { tanggal: '2025-07-01', isi: true },
            { tanggal: '2025-07-02', isi: false },
          ],
        },
        {
          week: 'Minggu ke‑2',
          tanggal: '2025-07-08',
          harian: [
            { tanggal: '2025-07-08', isi: true },
            { tanggal: '2025-07-09', isi: true },
          ],
        },
      ],
    },
    {
      id: 2,
      peserta: 'Siti Aminah',
      bidang: 'Sekretariat',
      email: 'aminahsiti@gmail.com',
      minggu: [
        {
          week: 'Minggu ke‑1',
          tanggal: '2025-07-01',
          harian: [
            { tanggal: '2025-07-01', isi: false },
            { tanggal: '2025-07-02', isi: false },
          ],
        },
      ],
    },
    // tambahkan data sesuai kebutuhan
  ]);

  // stat cards
  const total = laporanData.length;
  const pending = laporanData.filter((l) => l.status === 'Pending').length;
  const disetujui = laporanData.filter((l) => l.status === 'Disetujui').length;
  const perluRevisi = laporanData.filter(
    (l) => l.status === 'Perlu Revisi'
  ).length;

  const filtered = laporanData.filter(
    (item) =>
      item.peserta.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === 'all' || item.status?.toLowerCase() === statusFilter) &&
      (bidangFilter === 'all' || item.bidang === bidangFilter)
  );

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Peserta', 'Bidang']],
      body: filtered.map((d) => [d.peserta, d.bidang]),
    });
    doc.save('laporan.pdf');
  };

  const exportExcel = () => {
    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    xlsx.writeFile(workbook, 'data.xlsx');
  };

  return (
    <div className="space-y-6 p-6">
      {/* statistik */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card
          title="Total Laporan"
          value={total}
          icon={<FileText />}
          gradient="from-blue-400 to-blue-600"
          color="text-gray-900"
        />
        <Card
          title="Pending"
          value={pending}
          icon={<Clock />}
          gradient="from-yellow-400 to-yellow-600"
          color="text-yellow-600"
        />
        <Card
          title="Disetujui"
          value={disetujui}
          icon={<CheckCircle />}
          gradient="from-green-400 to-green-600"
          color="text-green-600"
        />
        <Card
          title="Perlu Revisi"
          value={perluRevisi}
          icon={<XCircle />}
          gradient="from-red-400 to-red-600"
          color="text-red-600"
        />
      </div>

      {/* filter & export */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari peserta..."
              className="pl-8 pr-3 py-2 border rounded-lg w-64"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="disetujui">Disetujui</option>
            <option value="perlurevisi">Perlu Revisi</option>
          </select>
          <select
            value={bidangFilter}
            onChange={(e) => setBidangFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="all">Semua Bidang</option>
            <option value="Tata Kelola Informatika">
              Tata Kelola Informatika
            </option>
            <option value="Sekretariat">Sekretariat</option>
            <option value="Statistik">Statistik</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportPDF}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Ekspor PDF
          </button>
          <button
            onClick={exportExcel}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Ekspor Excel
          </button>
        </div>
      </div>

      {/* tabel */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-[#006DA6] text-white">
            <tr>
              <th className="px-4 py-2 text-left">Peserta</th>
              <th className="px-4 py-2 text-left">Bidang</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Aksi</th>
              <th className="px-4 py-2 text-left">Terakhir Submit</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 text-left">{r.peserta}</td>
                <td className="px-4 py-2 text-left">{r.bidang}</td>
                <td className="px-4 py-2 text-left">{r.email}</td>
                <td className="px-4 py-2 text-left">
                  <button
                    onClick={() => setSelectedLaporan(r)}
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <Eye size={16} /> Detail
                  </button>
                </td>
                <td className="px-4 py-2 text-left">
                  {r.minggu?.slice(-1)[0]?.tanggal || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* modal detail */}
      {selectedLaporan && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center"
          onClick={() => setSelectedLaporan(null)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white p-6 rounded-lg shadow mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                <h2 className="text-xl font-semibold text-[#006DA6]">
                  Detail Laporan Harian
                </h2>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <h1 className="text-lg font-bold text-gray-800 mb-1">
                  Nama Peserta:
                </h1>
                <p className="text-md text-black">{selectedLaporan.peserta}</p>
              </div>
            </div>

            <div className="space-y-3">
              {selectedLaporan.minggu.map((week) => (
                <div key={week.week}>
                  <h3 className="font-medium">
                    {week.week} - {week.tanggal}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {week.harian.map((day) => (
                      <div
                        key={day.tanggal}
                        className="flex items-center px-3 py-1 border rounded text-sm"
                      >
                        <span className="mr-2">
                          {day.isi ? (
                            <CheckCircle className="text-green-600" />
                          ) : (
                            <XCircle className="text-gray-400" />
                          )}
                        </span>
                        <span>{day.tanggal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-right">
              <button
                onClick={() => setSelectedLaporan(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
