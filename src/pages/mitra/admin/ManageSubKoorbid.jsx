// ManageSubKoorbid.jsx
import React, { useState, useEffect } from 'react';
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
  const [subKoorList, setSubKoorList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bidangList, setBidangList] = useState([]);
  const [subKoors, setSubKoors] = useState([]);

  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    bidangId: '',
    password: '',
  });
  const [createFormData, setCreateFormData] = useState({
    nama: '',
    email: '',
    password: '',
    bidangId: '',
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchSubKoorList();
    fetchBidangList();
  }, []);

  // Fetch semua sub koordinator
  const fetchSubKoorList = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        'http://localhost:3000/api/admin/subkoordinator',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const json = await res.json();
      if (json.status) {
        // API diharapkan mengembalikan array berisi { id, nama, email, bidang: 'Nama Bidang' }
        setSubKoorList(json.data);
      } else {
        console.error(json.message || 'Gagal ambil data');
      }
    } catch (err) {
      console.error('Gagal fetch subkoordinator:', err);
    } finally {
      setLoading(false);
    }
  };

  // Ambil daftar bidang (untuk dropdown)
  const fetchBidangList = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/admin/bidang', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.status) {
        // API bidang diharapkan mengembalikan array { id, nama }
        setBidangList(json.data);
      } else {
        console.error('Gagal ambil bidang:', json.message);
      }
    } catch (err) {
      console.error('Gagal fetch bidang:', err);
    }
  };

  // Ambil detail sub koordinator by sub.id
  const openModal = async (subKoor) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/admin/subkoordinator/${subKoor.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (data.status) {
        setSelectedSubKoor(data.data); // data.data contains id, userId, nama, email, bidang:{id,nama}
        setFormData({
          nama: data.data.nama || '',
          email: data.data.email || '',
          bidangId: data.data.bidang?.id || '',
          password: '',
        });
        setIsModalOpen(true);
      } else {
        alert(data.message || 'Gagal ambil detail sub koordinator');
      }
    } catch (err) {
      console.error('Gagal ambil data sub koor:', err);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSubKoor(null);
    setFormData({ nama: '', email: '', bidangId: '', password: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  // Simpan (PUT) perubahan — menggunakan sub.id di URL
  const handleSave = async () => {
    if (!selectedSubKoor) return;

    try {
      const res = await fetch(
        `http://localhost:3000/api/admin/subkoordinator/${selectedSubKoor.id}`, // pakai sub.id (bukan userId)
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nama: formData.nama,
            email: formData.email,
            bidangId: formData.bidangId,
            password: formData.password || undefined,
          }),
        }
      );
      const data = await res.json();
      if (data.status) {
        // Update list: cari item.id === data.data.id
        setSubKoorList((prev) =>
          prev.map((item) =>
            item.id === data.data.id
              ? {
                  ...item,
                  nama: data.data.nama,
                  email: data.data.email,
                  bidang: data.data.bidang?.nama || item.bidang,
                }
              : item
          )
        );
        closeModal();
        alert('Data berhasil diperbarui');
      } else {
        alert(data.message || 'Gagal update');
      }
    } catch (err) {
      console.error('Gagal update sub koor:', err);
      alert('Terjadi kesalahan saat mengupdate');
    }
  };

  // Hapus sub koordinator by sub.id
  const handleDeleteSubkoor = async (id) => {
    if (!confirm('Yakin ingin menghapus akun ini?')) return;
    try {
      const res = await fetch(
        `http://localhost:3000/api/admin/subkoordinator/${id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const json = await res.json();
      if (json.status) {
        alert('Sub koordinator berhasil dihapus');
        fetchSubKoorList();
      } else {
        alert(json.message || 'Gagal menghapus');
      }
    } catch (err) {
      console.error('Gagal menghapus subkoordinator:', err);
      alert('Terjadi kesalahan saat menghapus');
    }
  };

  // Create (not implemented backend) - placeholder
  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreateFormData({ nama: '', email: '', password: '', bidangId: '' });
    setEmailError('');
    setShowPassword(false);
  };
  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData((p) => ({ ...p, [name]: value }));
  };
  const handleCreate = async () => {
    try {
      const res = await fetch(
        'http://localhost:3000/api/admin/create-subkoordinator',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`, // kalau pakai JWT
          },
          body: JSON.stringify(createFormData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Terjadi kesalahan');
        return;
      }

      alert('Akun Sub Koordinator berhasil dibuat!');

      await fetchSubKoorList();

      closeCreateModal();
    } catch (err) {
      console.error(err);
      alert('Gagal membuat akun Sub Koordinator');
    }
  };

  // safe filter usage (hindari undefined.toLowerCase())
  const filteredData = subKoorList.filter((item) => {
    const s = searchTerm.toLowerCase();
    return (
      (item.nama || '').toLowerCase().includes(s) ||
      (item.email || '').toLowerCase().includes(s) ||
      ((item.bidang && (item.bidang.nama || item.bidang)) || '')
        .toString()
        .toLowerCase()
        .includes(s)
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  );
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
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

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        {loading ? (
          <p className="p-4 text-center">Loading data...</p>
        ) : (
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
                    <td className="px-4 py-3">
                      {item.bidang?.nama || item.bidang}
                    </td>
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
        )}

        {!loading && (
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
        )}
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
              <div>
                <label className="block mb-1 text-gray-700">Nama</label>
                <input
                  name="nama"
                  value={formData.nama || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-700">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-700">Bidang</label>
                <select
                  name="bidangId"
                  value={formData.bidangId || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">-- Pilih Bidang --</option>
                  {bidangList.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 text-gray-700">
                  Password (kosong = tidak diubah)
                </label>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="mt-2 text-sm text-gray-600"
                >
                  {showPassword ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              </div>
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

      {/* Modal Create (sederhana) */}
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
              </div>
              <div>
                <label className="block mb-1 text-gray-700">Password</label>
                <input
                  name="password"
                  type="password"
                  value={createFormData.password}
                  onChange={handleCreateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-700">Bidang</label>
                <select
                  name="bidangId"
                  value={createFormData.bidangId}
                  onChange={handleCreateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Pilih Bidang</option>
                  {bidangList.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.nama}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 text-right">
              <button
                onClick={handleCreate}
                className="bg-[#006DA6] text-white px-4 py-2 rounded hover:bg-[#00517c]"
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
