import React, { useState } from 'react';
import { Plus, Edit, Users, Search, MoreHorizontal, X } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import { FaTrash } from 'react-icons/fa';

const ITEMS_PER_PAGE = 5;

const ManagementBidang = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorNama, setErrorNama] = useState('');
  const [errorKuota, setErrorKuota] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const [bidangList, setBidangList] = useState([
    {
      id: 1,
      nama: 'Tata Kelola Informatika',
      kuota: 10,
      pesertaAktif: 5,
    },
    {
      id: 2,
      nama: 'Pengelolaan Informasi dan Komunikasi Publik',
      kuota: 10,
      pesertaAktif: 7,
    },
    {
      id: 3,
      nama: 'Sekretariat',
      kuota: 10,
      pesertaAktif: 4,
    },
    {
      id: 4,
      nama: 'Statistik',
      kuota: 10,
      pesertaAktif: 3,
    },
    {
      id: 5,
      nama: 'Infrastruktur & Keamanan TIK',
      kuota: 10,
      pesertaAktif: 8,
    },
  ]);

  const [formBidang, setFormBidang] = useState({
    nama: '',
    kuota: 0,
    pesertaAktif: 0,
  });

  // === Tambah bidang baru ===
  const handleAddBidang = () => {
    setErrorKuota('');
    // cek duplikat nama
    const isDuplicate = bidangList.some(
      (bidang) => bidang.nama.toLowerCase() === formBidang.nama.toLowerCase()
    );

    if (isDuplicate) {
      setErrorNama('Nama bidang sudah ada, gunakan nama lain.');
      return;
    }

    if (!formBidang.nama.trim()) {
      setErrorNama('Nama bidang wajib diisi.');
      return;
    }

    // parsing kuota ke number & minimal 1
    const kuota = parseInt(formBidang.kuota, 10);

    if (!kuota || kuota < 1) {
      setErrorKuota('Kuota minimal 1 orang.');
      return;
    }

    setBidangList([
      ...bidangList,
      {
        id: bidangList.length + 1,
        nama: formBidang.nama,
        kuota: kuota,
        pesertaAktif: 0,
      },
    ]);
    setIsModalOpen(false);
    setFormBidang({
      nama: '',
      kuota: 0,
      pesertaAktif: 0,
    });
  };

  // Edit Bidang
  const handleOpenEdit = (bidang) => {
    setIsEditMode(true);
    setEditId(bidang.id);
    setFormBidang({
      nama: bidang.nama,
      kuota: bidang.kuota,
      pesertaAktif: bidang.pesertaAktif,
    });
    setErrorNama('');
    setErrorKuota('');
    setIsModalOpen(true);
  };

  // Save Edit Bidang
  const handleSaveBidang = () => {
    setErrorNama('');
    setErrorKuota('');

    // validasi nama
    const isDuplicate = bidangList.some(
      (bidang) =>
        bidang.nama.toLowerCase() === formBidang.nama.toLowerCase() &&
        bidang.id !== editId
    );

    if (isDuplicate) {
      setErrorNama('Nama bidang sudah ada, gunakan nama lain.');
      return;
    }

    if (!formBidang.nama.trim()) {
      setErrorNama('Nama bidang wajib diisi.');
      return;
    }

    if (!formBidang.kuota || formBidang.kuota < 1) {
      setErrorKuota('Kuota minimal 1 orang.');
      return;
    }

    if (isEditMode) {
      // update bidang
      setBidangList(
        bidangList.map((bidang) =>
          bidang.id === editId
            ? { ...bidang, nama: formBidang.nama, kuota: formBidang.kuota }
            : bidang
        )
      );
    } else {
      // tambah bidang
      setBidangList([
        ...bidangList,
        {
          id: bidangList.length + 1,
          nama: formBidang.nama,
          kuota: formBidang.kuota,
          pesertaAktif: 0,
        },
      ]);
    }

    setIsModalOpen(false);
  };

  // === Delete bidang ===
  const handleDeleteBidang = (id) => {
    const confirmDelete = window.confirm(
      'Apakah Anda yakin ingin menghapus bidang ini?'
    );
    if (confirmDelete) {
      setBidangList(bidangList.filter((item) => item.id !== id));
    }
  };

  // filter berdasarkan input pencarian
  const filteredBidang = bidangList.filter((bidang) =>
    bidang.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // pagination setelah filter
  const totalPages = Math.ceil(filteredBidang.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = filteredBidang.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const totalPagesBidang = Math.ceil(filteredBidang.length / ITEMS_PER_PAGE);
  const paginatedBidang = filteredBidang.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 sm:max-w-md">
          <Search
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Cari bidang magang..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reset ke halaman 1 kalau melakukan pencarian
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006DA6] focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#006DA6] text-white px-4 py-2 rounded-lg hover:bg-[#002942] transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Tambah Bidang</span>
        </button>
      </div>

      {/* Tabel Bidang */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <div className="overflow-x-auto rounded-lg shadow mt-4">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#006DA6] text-white">
              <tr>
                <th className="px-4 py-3">Nama Bidang</th>
                <th className="px-4 py-3">Kuota</th>
                <th className="px-4 py-3">Peserta Aktif</th>
                <th className="px-4 py-3">Kuota Tersedia</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBidang.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{item.nama}</td>
                  <td className="px-4 py-3">{item.kuota}</td>
                  <td className="px-4 py-3">{item.pesertaAktif}</td>
                  <td className="px-4 py-3">
                    {item.kuota - item.pesertaAktif}
                  </td>
                  <td className="px-4 py-3 flex gap-6">
                    <button
                      className="text-[#006DA6] hover:underline flex items-center text-sm"
                      onClick={() => handleOpenEdit(item)}
                    >
                      <Edit size={18} className="mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBidang(item.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Hapus Bidang"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedBidang.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex flex-col md:flex-row items-center justify-between px-4 py-3 bg-white border-t">
            <p className="text-sm text-gray-700 mb-2 md:mb-0">
              Menampilkan{' '}
              <span className="font-medium">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              </span>{' '}
              -{' '}
              <span className="font-medium">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredBidang.length)}
              </span>{' '}
              dari <span className="font-medium">{filteredBidang.length}</span>{' '}
              hasil
            </p>
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-3 py-1 border rounded hover:bg-gray-100 text-sm"
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {[...Array(totalPagesBidang)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded text-sm ${
                    currentPage === i + 1
                      ? 'bg-[#006DA6] text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPagesBidang))
                }
                className="px-3 py-1 border rounded hover:bg-gray-100 text-sm"
                disabled={currentPage === totalPagesBidang}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tambah */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6 shadow-lg space-y-4">
            <div className="flex justify-between items-center mb-2">
              <Dialog.Title className="text-lg font-semibold text-gray-800">
                Tambah Bidang
              </Dialog.Title>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={20} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            {/* Nama Bidang */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Bidang
              </label>
              <input
                type="text"
                placeholder="Nama Bidang"
                value={formBidang.nama}
                onChange={(e) => {
                  setFormBidang({ ...formBidang, nama: e.target.value });
                  setErrorNama(''); // hapus error saat user mengetik ulang
                }}
                className={`w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#006DA6] focus:outline-none ${
                  errorNama ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errorNama && (
                <p className="text-red-500 text-xs mt-1">{errorNama}</p>
              )}
            </div>

            {/* Kuota */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kuota Bidang Magang
              </label>
              <input
                type="number"
                placeholder="Masukkan jumlah kuota"
                value={formBidang.kuota}
                onChange={(e) =>
                  setFormBidang({
                    ...formBidang,
                    kuota: Number(e.target.value),
                  })
                }
                className={`w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#006DA6] focus:outline-none ${
                  errorKuota ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errorKuota && (
                <p className="text-red-500 text-xs mt-1">{errorKuota}</p>
              )}
            </div>

            {/* Tombol Simpan */}
            <button
              onClick={handleAddBidang}
              className="bg-[#006DA6] w-full text-white px-4 py-2 rounded-lg hover:bg-[#00476d] transition"
            >
              Simpan
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Modal Edit Bidang */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6 shadow-lg space-y-4">
            <div className="flex justify-between items-center mb-2">
              <Dialog.Title className="text-lg font-semibold text-gray-800">
                {isEditMode ? 'Edit Bidang' : 'Tambah Bidang'}
              </Dialog.Title>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={20} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            {/* Nama Bidang */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Bidang
              </label>
              <input
                type="text"
                placeholder="Nama Bidang"
                value={formBidang.nama}
                onChange={(e) => {
                  setFormBidang({ ...formBidang, nama: e.target.value });
                  setErrorNama('');
                }}
                className={`w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#006DA6] focus:outline-none ${
                  errorNama ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errorNama && (
                <p className="text-red-500 text-xs mt-1">{errorNama}</p>
              )}
            </div>

            {/* Kuota */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kuota Bidang Magang
              </label>
              <input
                type="number"
                placeholder="Masukkan jumlah kuota"
                value={formBidang.kuota}
                onChange={(e) =>
                  setFormBidang({
                    ...formBidang,
                    kuota: Number(e.target.value),
                  })
                }
                className={`w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#006DA6] focus:outline-none ${
                  errorKuota ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errorKuota && (
                <p className="text-red-500 text-xs mt-1">{errorKuota}</p>
              )}
            </div>

            {/* Tombol Simpan */}
            <button
              onClick={handleSaveBidang}
              className="bg-[#006DA6] w-full text-white px-4 py-2 rounded-lg hover:bg-[#00476d] transition"
            >
              {isEditMode ? 'Update' : 'Simpan'}
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default ManagementBidang;
