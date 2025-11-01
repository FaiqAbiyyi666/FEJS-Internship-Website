import React, { useState, useEffect } from 'react';
import { Plus, Edit, Search, X } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import { FaTrash } from 'react-icons/fa';

const ITEMS_PER_PAGE = 5;

// Komponen Modal yang Disederhanakan
const BidangModal = ({
  isOpen,
  onClose,
  onSubmit,
  isEditMode,
  formData,
  setFormData,
  errors,
  setErrors,
  loading,
}) => {
  const { nama, kuota } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      // Ubah kuota menjadi angka, biarkan nama sebagai string
      [name]: name === 'kuota' ? (value ? Number(value) : '') : value,
    }));
    // Hapus error saat user mulai mengetik
    if (name === 'nama' && errors.nama)
      setErrors((prev) => ({ ...prev, nama: '' }));
    if (name === 'kuota' && errors.kuota)
      setErrors((prev) => ({ ...prev, kuota: '' }));
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6 shadow-lg space-y-4">
          <div className="flex justify-between items-center mb-2">
            <Dialog.Title className="text-lg font-semibold text-gray-800">
              {isEditMode ? 'Edit Bidang' : 'Tambah Bidang'}
            </Dialog.Title>
            <button onClick={onClose} disabled={loading}>
              <X size={20} className="text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            <div className="space-y-4">
              {/* Nama Bidang */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Bidang
                </label>
                <input
                  type="text"
                  name="nama"
                  placeholder="Nama Bidang"
                  value={nama}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#006DA6] focus:outline-none ${
                    errors.nama ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.nama && (
                  <p className="text-red-500 text-xs mt-1">{errors.nama}</p>
                )}
              </div>

              {/* Kuota */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kuota Bidang Magang
                </label>
                <input
                  type="number"
                  name="kuota"
                  placeholder="Masukkan jumlah kuota"
                  value={kuota}
                  min="0"
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#006DA6] focus:outline-none ${
                    errors.kuota ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.kuota && (
                  <p className="text-red-500 text-xs mt-1">{errors.kuota}</p>
                )}
              </div>
            </div>

            {/* Tombol Simpan */}
            <button
              type="submit"
              disabled={loading}
              className="bg-[#006DA6] w-full text-white px-4 py-2 rounded-lg hover:bg-[#00476d] transition mt-6 disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : isEditMode ? 'Update' : 'Simpan'}
            </button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

const ManagementBidang = () => {
  // === State Data ===
  const [bidangList, setBidangList] = useState([]); // Data dari API
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  // === State UI ===
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // === State Modal ===
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formBidang, setFormBidang] = useState({ nama: '', kuota: 0 });
  const [formErrors, setFormErrors] = useState({ nama: '', kuota: '' });
  const [modalLoading, setModalLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token)
        throw new Error('Token tidak ditemukan, silakan login ulang.');

      const res = await fetch('http://localhost:3000/api/admin/bidang', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();
      if (!res.ok)
        throw new Error(result.message || 'Gagal mengambil data bidang');

      setBidangList(result.data || []);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const validateForm = () => {
    const errors = { nama: '', kuota: '' };
    let isValid = true;

    const kuotaNum = Number(formBidang.kuota);

    if (!formBidang.nama.trim()) {
      errors.nama = 'Nama bidang wajib diisi.';
      isValid = false;
    }

    if (isNaN(kuotaNum) || kuotaNum < 1) {
      errors.kuota = 'Kuota minimal 1 orang.';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditId(null);
    setFormBidang({ nama: '', kuota: 0 });
    setFormErrors({ nama: '', kuota: '' });
    setModalLoading(false);
  };

  const handleOpenTambah = () => {
    setIsEditMode(false);
    setFormBidang({ nama: '', kuota: 0 });
    setFormErrors({ nama: '', kuota: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (bidang) => {
    setIsEditMode(true);
    setEditId(bidang.id);
    setFormBidang({
      nama: bidang.nama,
      kuota: bidang.kuota,
    });
    setFormErrors({ nama: '', kuota: '' });
    setIsModalOpen(true);
  };

  const handleSubmitForm = async () => {
    if (!validateForm()) return;

    setModalLoading(true);
    setApiError(null);
    const token = localStorage.getItem('token');

    const url = isEditMode
      ? `http://localhost:3000/api/admin/bidang/${editId}`
      : 'http://localhost:3000/api/admin/bidang';

    const method = isEditMode ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nama: formBidang.nama,
          kuota: formBidang.kuota,
        }),
      });

      const result = await res.json();
      if (!res.ok)
        throw new Error(result.message || 'Terjadi kesalahan server');

      alert(result.message);
      handleCloseModal();
      fetchData();
    } catch (err) {
      if (err.message.toLowerCase().includes('sudah ada')) {
        setFormErrors((prev) => ({ ...prev, nama: err.message }));
      } else {
        setApiError(err.message);
        alert(`Error: ${err.message}`);
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteBidang = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus bidang ini?'))
      return;

    setLoading(true);
    setApiError(null);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`http://localhost:3000/api/admin/bidang/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Gagal menghapus');

      alert(result.message);
      setBidangList((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setApiError(err.message);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredBidang = bidangList.filter((bidang) =>
    bidang.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBidang.length / ITEMS_PER_PAGE);
  const paginatedBidang = filteredBidang.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
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
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006DA6] focus:border-transparent"
          />
        </div>
        <button
          onClick={handleOpenTambah}
          className="bg-[#006DA6] text-white px-4 py-2 rounded-lg hover:bg-[#002942] transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Tambah Bidang</span>
        </button>
      </div>

      {apiError && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {apiError}</span>
        </div>
      )}

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        {loading ? (
          <div className="p-6 text-center text-gray-500">
            Memuat data bidang...
          </div>
        ) : (
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
                  <td className="px-4 py-3 font-medium">{item.nama}</td>
                  <td className="px-4 py-3">{item.kuota}</td>
                  <td className="px-4 py-3">{item.pesertaAktif}</td>
                  <td className="px-4 py-3 font-semibold">
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
                    {searchTerm
                      ? 'Tidak ada bidang yang cocok.'
                      : 'Belum ada data bidang.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {!loading && totalPages > 1 && (
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

      <BidangModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitForm}
        isEditMode={isEditMode}
        formData={formBidang}
        setFormData={setFormBidang}
        errors={formErrors}
        setErrors={setFormErrors}
        loading={modalLoading}
      />
    </div>
  );
};

export default ManagementBidang;
