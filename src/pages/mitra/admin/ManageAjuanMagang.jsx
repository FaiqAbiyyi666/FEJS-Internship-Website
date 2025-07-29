import React, { useEffect, useState, Fragment } from 'react';
import { Eye, CheckCircle, XCircle } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import autoTable from 'jspdf-autotable';

const dummyData = [
  // Tambahkan lebih banyak data agar bisa terlihat efek pagination
  ...Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    peserta: { nama: `Peserta ${i + 1}` },
    instansi: 'Universitas Contoh',
    jurusan: 'Teknik Informatika',
    temaMagang: 'Pengembangan Aplikasi',
    tglMulai: '2025-08-01',
    tglSelesai: '2025-10-31',
    statusUsulan:
      i % 3 === 0 ? 'disetujui' : i % 3 === 1 ? 'ditolak' : 'pending',
  })),
  {
    id: 1,
    peserta: { nama: 'Ahmad Rafi' },
    instansi: 'Universitas Negeri Surabaya',
    jurusan: 'Teknik Informatika',
    temaMagang: 'Pengembangan Website',
    tglMulai: '2025-08-01',
    tglSelesai: '2025-10-31',
    statusUsulan: 'pending',
  },
  {
    id: 2,
    peserta: { nama: 'Joko Widodo' },
    instansi: 'Universitas Negeri Surabaya',
    jurusan: 'Teknik Informatika',
    temaMagang: 'Pengembangan Website',
    tglMulai: '2025-08-01',
    tglSelesai: '2025-10-31',
    statusUsulan: 'pending',
  },
  {
    id: 3,
    peserta: { nama: 'Prabowo' },
    instansi: 'Universitas Negeri Surabaya',
    jurusan: 'Teknik Informatika',
    temaMagang: 'Pengembangan Website',
    tglMulai: '2025-08-01',
    tglSelesai: '2025-10-31',
    statusUsulan: 'pending',
  },
  {
    id: 4,
    peserta: { nama: 'Dina Lestari' },
    instansi: 'Politeknik Elektronika Negeri Surabaya',
    jurusan: 'Teknik Komputer',
    temaMagang: 'Desain UI/UX',
    tglMulai: '2025-07-15',
    tglSelesai: '2025-10-15',
    statusUsulan: 'disetujui',
  },
  {
    id: 5,
    peserta: { nama: 'Budi Santoso' },
    instansi: 'Universitas Airlangga',
    jurusan: 'Sistem Informasi',
    temaMagang: 'Manajemen Proyek',
    tglMulai: '2025-09-01',
    tglSelesai: '2025-12-01',
    statusUsulan: 'ditolak',
  },
];

const ManageAjuanMagang = () => {
  const [ajuanList, setAjuanList] = useState([]);
  const [selectedAjuan, setSelectedAjuan] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setAjuanList(dummyData);
  }, []);

  const handleUpdateStatus = (id, newStatus) => {
    const updatedList = ajuanList.map((ajuan) =>
      ajuan.id === id ? { ...ajuan, statusUsulan: newStatus } : ajuan
    );
    setAjuanList(updatedList);
    setSelectedAjuan(null);
  };

  const filteredAjuan = ajuanList.filter(
    (item) =>
      item.peserta?.nama?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (statusFilter === 'all' || item.statusUsulan === statusFilter)
  );

  const aktifAjuan = filteredAjuan.filter(
    (item) => item.statusUsulan === 'pending'
  );
  const historiAjuan = filteredAjuan.filter(
    (item) => item.statusUsulan !== 'pending'
  );

  const paginatedData = (data) => {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  };

  const totalPages = Math.ceil(historiAjuan.length / itemsPerPage);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Pengajuan Magang', 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [['Peserta', 'Judul', 'Tanggal', 'Status']],
      body: historiAjuan.map((ajuan) => [
        ajuan.peserta.nama,
        ajuan.temaMagang,
        `${new Date(ajuan.tglMulai).toLocaleDateString()} - ${new Date(
          ajuan.tglSelesai
        ).toLocaleDateString()}`,
        ajuan.statusUsulan,
      ]),
    });
    doc.save('histori-ajuan-magang.pdf');
  };

  const exportToExcel = () => {
    const data = historiAjuan.map((ajuan) => ({
      Peserta: ajuan.peserta.nama,
      Judul: ajuan.temaMagang,
      Tanggal: `${new Date(ajuan.tglMulai).toLocaleDateString()} - ${new Date(
        ajuan.tglSelesai
      ).toLocaleDateString()}`,
      Status: ajuan.statusUsulan,
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Histori');
    XLSX.writeFile(workbook, 'histori-ajuan-magang.xlsx');
  };

  const renderTable = (list, isHistory = false) => (
    <>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-[#006DA6] text-white text-sm">
          <tr>
            <th className="px-4 py-2 text-left">Nama Peserta</th>
            <th className="px-4 py-2 text-left">Instansi</th>
            <th className="px-4 py-2 text-left">Tanggal</th>
            <th className="px-4 py-2 text-left">Bidang</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {list.length > 0 ? (
            list.map((ajuan) => (
              <tr key={ajuan.id} className="border-t text-sm">
                <td className="px-4 py-2">{ajuan.peserta?.nama || '-'}</td>
                <td className="px-4 py-2">{ajuan.instansi}</td>
                <td className="px-4 py-2">
                  {new Date(ajuan.tglMulai).toLocaleDateString()} -{' '}
                  {new Date(ajuan.tglSelesai).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">{ajuan.temaMagang}</td>
                <td className="px-4 py-2 capitalize">{ajuan.statusUsulan}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => setSelectedAjuan(ajuan)}
                    className="text-blue-600 hover:underline"
                    title="Lihat Detail"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500">
                Tidak ada data.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {isHistory && (
        <div className="flex justify-center items-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded text-sm border ${
                currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </>
  );

  return (
    <div className="p-4 space-y-10">
      <div className="flex flex-wrap md:flex-nowrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Cari berdasarkan nama peserta..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-full md:w-1/3"
        />
        <select
          className="border border-gray-300 rounded-md px-3 py-2 w-full md:w-52"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="disetujui">Disetujui</option>
          <option value="ditolak">Ditolak</option>
        </select>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Ajuan Magang Masuk</h2>
        <div className="overflow-x-auto">{renderTable(aktifAjuan)}</div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Histori Pengajuan Magang</h2>
          <div className="flex gap-2">
            <button
              onClick={exportToPDF}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
            >
              Ekspor PDF
            </button>
            <button
              onClick={exportToExcel}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
            >
              Ekspor Excel
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          {renderTable(paginatedData(historiAjuan), true)}
        </div>
      </div>

      {/* Dialog */}
      <Transition appear show={selectedAjuan !== null} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setSelectedAjuan(null)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                  <Dialog.Title className="text-lg font-bold mb-4">
                    Detail Ajuan Magang
                  </Dialog.Title>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>
                      <strong>Peserta:</strong> {selectedAjuan?.peserta?.nama}
                    </p>
                    <p>
                      <strong>Instansi:</strong> {selectedAjuan?.instansi}
                    </p>
                    <p>
                      <strong>Jurusan:</strong> {selectedAjuan?.jurusan}
                    </p>
                    <p>
                      <strong>Tema Magang:</strong> {selectedAjuan?.temaMagang}
                    </p>
                    <p>
                      <strong>Tanggal:</strong>{' '}
                      {new Date(selectedAjuan?.tglMulai).toLocaleDateString()} -{' '}
                      {new Date(selectedAjuan?.tglSelesai).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Status Usulan:</strong>{' '}
                      {selectedAjuan?.statusUsulan}
                    </p>
                  </div>
                  {selectedAjuan?.statusUsulan === 'pending' && (
                    <div className="mt-6 flex gap-3 justify-end">
                      <button
                        onClick={() =>
                          handleUpdateStatus(selectedAjuan.id, 'disetujui')
                        }
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 inline-flex items-center gap-1"
                      >
                        <CheckCircle size={16} /> Setujui
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateStatus(selectedAjuan.id, 'ditolak')
                        }
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 inline-flex items-center gap-1"
                      >
                        <XCircle size={16} /> Tolak
                      </button>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default ManageAjuanMagang;
