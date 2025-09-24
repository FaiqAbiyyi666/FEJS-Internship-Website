import React, { useState } from 'react';
import { Eye, EyeOff, Edit, Plus } from 'lucide-react';
import { FaTrash } from 'react-icons/fa';

const ITEMS_PER_PAGE = 10;

export default function ManagementSubKoorbid() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSubKoor, setSelectedSubKoor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [namaError, setNamaError] = useState('');

  const [subKoorList, setSubKoorList] = useState([
    {
      id: 1,
      nama: 'Dian Prasetyo',
      email: 'dian.prasetyo@simagang.com',
      bidang: 'Tata Kelola Informatika',
      status: 'Aktif',
    },
    {
      id: 2,
      nama: 'Yuliana Rahmawati',
      email: 'yuliana.rahma@simagang.com',
      bidang: 'Pengelolaan Informasi dan Komunikasi Publik',
      status: 'Aktif',
    },
    {
      id: 3,
      nama: 'Agus Setiawan',
      email: 'agus.setiawan@simagang.com',
      bidang: 'Sekretariat',
      status: 'Aktif',
    },
    {
      id: 4,
      nama: 'Nina Marlina',
      email: 'nina.marlina@simagang.com',
      bidang: 'Statistik',
      status: 'Aktif',
    },
    {
      id: 5,
      nama: 'Bambang Susilo',
      email: 'bambang.susilo@simagang.com',
      bidang: 'Infrastruktur & Keamanan TIK',
      status: 'Aktif',
    },
  ]);

  // === State untuk modal edit & create ===
  const [formData, setFormData] = useState({});
  const [createFormData, setCreateFormData] = useState({
    nama: '',
    email: '',
    password: '',
    bidang: '',
  });

  // === Edit Modal ===
  const openModal = (subKoor) => {
    setSelectedSubKoor(subKoor);
    setFormData(subKoor);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSubKoor(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // ambil semua email & nama kecuali yang sedang diedit
    const existingEmails = subKoorList
      .filter((item) => item.id !== selectedSubKoor.id)
      .map((item) => item.email.toLowerCase());

    const existingNames = subKoorList
      .filter((item) => item.id !== selectedSubKoor.id)
      .map((item) => item.nama.toLowerCase());

    // validasi email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Format email tidak valid');
      return;
    }
    if (existingEmails.includes(formData.email.toLowerCase())) {
      alert('Email sudah digunakan');
      return;
    }

    // validasi nama
    if (!formData.nama.trim()) {
      alert('Nama wajib diisi');
      return;
    }
    if (existingNames.includes(formData.nama.toLowerCase())) {
      alert('Nama sudah digunakan');
      return;
    }

    // kalau lolos validasi, update data
    setSubKoorList((prev) =>
      prev.map((item) =>
        item.id === selectedSubKoor.id ? { ...item, ...formData } : item
      )
    );
    closeModal();
  };

  // === Create modal ===
  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreateFormData({ nama: '', email: '', password: '', bidang: '' });
    setEmailError('');
    setShowPassword(false);
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData((prev) => ({ ...prev, [name]: value }));

    // ambil semua nama dan email dari list subKoor
    const existingEmails = subKoorList.map((item) => item.email.toLowerCase());
    const existingNames = subKoorList.map((item) => item.nama.toLowerCase());

    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(value)) {
        setEmailError('Format email tidak valid');
      } else if (existingEmails.includes(value)) {
        setEmailError('Email sudah digunakan');
      } else {
        setEmailError('');
      }
    }

    if (name === 'nama') {
      if (!value.trim()) {
        setNamaError('Nama wajib diisi');
      } else if (existingNames.includes(value.toLowerCase())) {
        setNamaError('Nama sudah digunakan');
      } else {
        setNamaError('');
      }
    }
  };

  const handleCreate = () => {
    if (emailError) return;

    const newSubKoor = {
      id: subKoorList.length + 1,
      nama: createFormData.nama,
      email: createFormData.email,
      bidang: createFormData.bidang,
    };

    setSubKoorList((prev) => [...prev, newSubKoor]);
    closeCreateModal();
  };

  // === Delete Sub Koor ===
  const handleDeleteSubkoor = (id) => {
    if (confirm('Yakin ingin menghapus akun ini?')) {
      setSubKoorList(subKoorList.filter((item) => item.id !== id));
    }
  };

  const filteredData = subKoorList.filter(
    (item) =>
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.bidang.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      {/* Search & Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <input
          type="text"
          placeholder="Cari Sub Koor Bidang..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-[#006DA6] focus:border-[#006DA6]"
        />
        <button
          onClick={openCreateModal}
          className="bg-[#006DA6] text-white px-4 py-2 rounded hover:bg-[#00517c] flex items-center gap-2"
        >
          <Plus size={16} />
          Buat Akun Sub Koor
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <div className="overflow-x-auto rounded-lg shadow mt-4">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#006DA6] text-white">
              <tr>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Bidang</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{item.nama}</td>
                    <td className="px-4 py-3">{item.email}</td>
                    <td className="px-4 py-3">{item.bidang}</td>
                    <td className="px-4 py-3 flex gap-6">
                      <button
                        className="text-[#006DA6] hover:underline flex items-center text-sm"
                        onClick={() => openModal(item)}
                      >
                        <Edit size={18} className="mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSubkoor(item.id)}
                        className="text-red-500 hover:text-red-700 flex items-center text-sm"
                        title="Hapus Akun"
                      >
                        <FaTrash size={18} className="mr-1" />
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* ✅ Pagination - di luar table */}
          <div className="flex flex-col md:flex-row items-center justify-between px-4 py-3 bg-white border-t">
            <p className="text-sm text-gray-700 mb-2 md:mb-0">
              Menampilkan{' '}
              <span className="font-medium">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              </span>{' '}
              -{' '}
              <span className="font-medium">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)}
              </span>{' '}
              dari <span className="font-medium">{filteredData.length}</span>{' '}
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
              {[...Array(totalPages)].map((_, i) => (
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
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className="px-3 py-1 border rounded hover:bg-gray-100 text-sm"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Edit */}
      {isModalOpen && selectedSubKoor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          onClick={closeModal}
        >
          <div
            className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-5 text-white bg-red-500 rounded-full px-2 py-1 text-sm"
              onClick={closeModal}
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4 text-[#006DA6]">
              Edit Data Sub Koor
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {/* Nama, Email, Bidang, Status */}
              {[
                { label: 'Nama', name: 'nama' },
                { label: 'Email', name: 'email' },
                {
                  label: 'Bidang',
                  name: 'bidang',
                  type: 'select',
                  options: [
                    'Tata Kelola Informatika',
                    'Infrastruktur & Keamanan TIK',
                    'Pengelolaan Informasi dan Komunikasi Publik',
                    'Sekretariat',
                    'Statistik',
                  ],
                },
              ].map(({ label, name, type = 'text', options }) => (
                <div key={name}>
                  <label className="block mb-1 text-gray-700">{label}</label>
                  {type === 'select' ? (
                    <select
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#006DA6] focus:border-[#006DA6]"
                    >
                      {options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#006DA6] focus:border-[#006DA6]"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 text-right">
              <button
                onClick={handleSave}
                className="bg-[#006DA6] text-white px-4 py-2 rounded hover:bg-[#00517c]"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Create */}
      {isCreateModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          onClick={closeCreateModal}
        >
          <div
            className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-5 text-white bg-red-500 rounded-full px-2 py-1 text-sm"
              onClick={closeCreateModal}
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4 text-[#006DA6]">
              Buat Akun Sub Koor
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block mb-1 text-gray-700">Nama</label>
                <input
                  name="nama"
                  value={createFormData.nama}
                  onChange={handleCreateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {namaError && (
                  <p className="text-red-500 text-sm mt-1">{namaError}</p>
                )}
              </div>
              <div>
                <label className="block mb-1 text-gray-700">Email</label>
                <input
                  name="email"
                  type="email"
                  value={createFormData.email}
                  onChange={handleCreateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {emailError && (
                  <p className="text-red-500 text-xs mt-1">{emailError}</p>
                )}
              </div>
              <div className="relative">
                <label className="block mb-1 text-gray-700">Password</label>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={createFormData.password}
                  onChange={handleCreateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-8 right-3 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div>
                <label className="block mb-1 text-gray-700">Bidang</label>
                <select
                  name="bidang"
                  value={createFormData.bidang}
                  onChange={handleCreateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Pilih Bidang</option>
                  <option>Tata Kelola Informatika</option>
                  <option>Pengelolaan Informasi dan Komunikasi Publik</option>
                  <option>Statistik</option>
                  <option>Sekretariat</option>
                  <option>Infrastruktur & Keamanan TIK</option>
                </select>
              </div>
            </div>
            <div className="mt-6 text-right">
              <button
                onClick={handleCreate}
                className="bg-[#006DA6] text-white px-4 py-2 rounded hover:bg-[#00517c]"
                disabled={!!emailError}
              >
                Buat Akun
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
