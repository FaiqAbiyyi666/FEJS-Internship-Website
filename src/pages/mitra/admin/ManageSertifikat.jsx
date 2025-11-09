import React, { useState, useEffect } from 'react';
import { Eye, Plus, AlertTriangle, Loader } from 'react-feather';

export default function ManageSertifikat() {
  const [history, setHistory] = useState([]);
  const [ajuanList, setAjuanList] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBidang, setSelectedBidang] = useState('');
  const [filterTanggal, setFilterTanggal] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [modalKirim, setModalKirim] = useState(false);
  const [modalPreview, setModalPreview] = useState(null);

  const [form, setForm] = useState({
    ajuanId: '',
    namaDisplay: '',
    noSertifikat: '',
    nilai: '',
    file: null,
    fileURL: '',
  });

  const fetchHistory = async (page) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Autentikasi tidak ditemukan. Silakan login kembali.');
      }

      const params = new URLSearchParams({
        page: page,
        search: searchTerm,
        bidang: selectedBidang,
        tanggal: filterTanggal,
      });

      const res = await fetch(
        `http://localhost:3000/api/admin/sertifikat/history?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        if (res.status === 401)
          throw new Error('Sesi Anda telah berakhir. Silakan login kembali.');
        throw new Error(errData.message || 'Gagal mengambil riwayat');
      }
      const data = await res.json();

      setHistory(data.data.history);
      setTotalPages(data.data.totalPages);
      setCurrentPage(data.data.currentPage);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAjuansForSertifikat = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Autentikasi tidak ditemukan.');
        return;
      }

      const res = await fetch(
        'http://localhost:3000/api/admin/ajuan-for-sertifikat',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error('Gagal mengambil daftar ajuan');
      }
      const data = await res.json();
      setAjuanList(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory(currentPage);
    fetchAjuansForSertifikat();
  }, [currentPage]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchHistory(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm, selectedBidang, filterTanggal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({
      ...prev,
      file: file,
      fileURL: file ? URL.createObjectURL(file) : '',
    }));
  };

  const handlePilihAjuan = (e) => {
    const value = e.target.value;

    const ajuan = ajuanList.find((a) => a.namaDisplay === value);

    if (ajuan) {
      setForm((prev) => ({
        ...prev,
        ajuanId: ajuan.id,
        namaDisplay: ajuan.namaDisplay,
      }));
    } else {
      setForm((prev) => ({ ...prev, ajuanId: '', namaDisplay: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.ajuanId || !form.noSertifikat || !form.nilai || !form.file) {
      alert('Semua kolom wajib diisi. Pastikan memilih ajuan dari daftar.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Sesi Anda berakhir. Silakan login kembali.');
      return;
    }

    const formData = new FormData();
    formData.append('ajuanId', form.ajuanId);
    formData.append('noSertifikat', form.noSertifikat);
    formData.append('nilai', form.nilai);
    formData.append('file', form.file);

    try {
      const res = await fetch(
        'http://localhost:3000/api/admin/kirim-sertifikat',
        {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Gagal mengirim sertifikat');
      }

      alert('Sertifikat berhasil dikirim!');
      setModalKirim(false);
      setForm({
        ajuanId: '',
        namaDisplay: '',
        noSertifikat: '',
        nilai: '',
        file: null,
        fileURL: '',
      });
      fetchHistory(1);
      fetchAjuansForSertifikat();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleBukaModalKosong = () => {
    setForm({
      ajuanId: '',
      namaDisplay: '',
      noSertifikat: '',
      nilai: '',
      file: null,
      fileURL: '',
    });
    setModalKirim(true);
  };

  const handleBukaModalPraisi = (ajuan) => {
    setForm({
      ...form,
      ajuanId: ajuan.id,
      namaDisplay: ajuan.namaDisplay,
      noSertifikat: '',
      nilai: '',
      file: null,
      fileURL: '',
    });
    setModalKirim(true);
  };

  const handleTutupModal = () => {
    setModalKirim(false);
    setForm({
      ajuanId: '',
      namaDisplay: '',
      noSertifikat: '',
      nilai: '',
      file: null,
      fileURL: '',
    });
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:flex-grow">
          <input
            type="text"
            placeholder="Cari nama peserta / nomor surat..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-[#006DA6] focus:border-[#006DA6] w-full sm:w-64"
          />

          <select
            value={selectedBidang}
            onChange={(e) => {
              setSelectedBidang(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-[#006DA6] focus:border-[#006DA6] w-full sm:w-64"
          >
            <option value="">Semua Bidang</option>
            <option value="Tata Kelola Informatika">
              Tata Kelola Informatika
            </option>
            <option value="Pengelolaan Informasi dan Komunikasi Publik">
              Pengelolaan Informasi dan Komunikasi Publik
            </option>
            <option value="Infrastruktur dan Keamanan TIK">
              Infrastruktur dan Keamanan TIK
            </option>
            <option value="Sekretariat">Sekretariat</option>
            <option value="Statistik">Statistik</option>
          </select>

          <input
            type="date"
            value={filterTanggal}
            onChange={(e) => {
              setFilterTanggal(e.target.value);
              setCurrentPage(1);
            }}
            className="border px-3 py-2 rounded text-sm"
          />
        </div>

        <button
          onClick={handleBukaModalKosong}
          className="flex items-center gap-2 bg-[#006DA6] hover:bg-[#1a4962] text-white px-4 py-2 rounded text-sm"
        >
          <Plus size={16} /> Kirim Sertifikat (Manual)
        </button>
      </div>

      {ajuanList.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 border rounded-lg shadow">
          <h3 className="text-lg font-bold text-[#002942] mb-3">
            🕒 Perlu Tindakan: Siap Kirim Sertifikat
          </h3>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {ajuanList.map((ajuan) => (
              <div
                key={ajuan.id}
                className="flex justify-between items-center p-3 bg-white border rounded-md"
              >
                <span className="text-sm text-gray-700">
                  {ajuan.namaDisplay}
                </span>
                <button
                  onClick={() => handleBukaModalPraisi(ajuan)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-xs font-semibold rounded"
                >
                  Kirim
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-200">
          <thead className="bg-[#006DA6] text-white">
            <tr>
              <th className="px-4 py-3 text-left rounded-tl-lg">Nama</th>
              <th className="px-4 py-3 text-left">No Sertifikat</th>
              <th className="px-4 py-3 text-left">Bidang</th>
              <th className="px-4 py-3 text-left">Nilai</th>
              <th className="px-4 py-3 text-left">Tanggal</th>
              <th className="px-4 py-3 text-left rounded-tr-lg">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  <Loader className="animate-spin inline-block mr-2" />
                  Memuat data...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-red-500">
                  <AlertTriangle className="inline-block mr-2" />
                  Error: {error}
                </td>
              </tr>
            ) : history.length > 0 ? (
              <>
                {history.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      {item.ajuan.peserta.namaLengkap}
                    </td>
                    <td className="px-4 py-3">{item.noSertifikat}</td>
                    <td className="px-4 py-3">{item.ajuan.bidang.nama}</td>
                    <td className="px-4 py-3">{item.nilai}</td>
                    <td className="px-4 py-3">
                      {new Date(item.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setModalPreview(item)}
                        className="text-[#006DA6] hover:underline flex items-center gap-1"
                      >
                        <Eye size={16} /> Lihat Sertifikat
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="6" className="px-4 py-3 border-t">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-sm">
                      <p className="text-gray-700">
                        Halaman {currentPage} dari {totalPages}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        <button
                          onClick={() => setCurrentPage((p) => p - 1)}
                          className="px-3 py-1 border rounded hover:bg-gray-100"
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setCurrentPage((p) => p + 1)}
                          className="px-3 py-1 border rounded hover:bg-gray-100"
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              </>
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  Belum ada data sertifikat.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalKirim && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <button
              onClick={handleTutupModal}
              className="absolute top-2 right-3 text-gray-600 hover:text-red-600 text-xl"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-4">Kirim Sertifikat</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Pilih Ajuan Magang (Peserta yang telah selesai)
                </label>
                <input
                  list="ajuanList"
                  name="namaDisplay"
                  value={form.namaDisplay}
                  onChange={handlePilihAjuan}
                  placeholder="Ketik nama peserta atau bidang..."
                  className="w-full border px-3 py-2 rounded text-sm"
                  required
                />
                <datalist id="ajuanList">
                  {ajuanList.map((ajuan) => (
                    <option key={ajuan.id} value={ajuan.namaDisplay} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nomor Sertifikat
                </label>
                <input
                  type="text"
                  name="noSertifikat"
                  value={form.noSertifikat}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nilai
                </label>
                <input
                  type="number"
                  name="nilai"
                  value={form.nilai}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload Sertifikat (PDF)
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="w-full text-sm"
                  required
                />
              </div>
              {form.fileURL && (
                <div>
                  <p className="text-sm mb-1 font-medium">
                    Preview Sertifikat:
                  </p>
                  <iframe
                    src={form.fileURL}
                    className="w-full h-56 border rounded"
                    title="Preview Sertifikat"
                  />
                </div>
              )}
              <div className="text-right">
                <button
                  type="submit"
                  className="bg-[#006DA6] text-white px-5 py-2 rounded text-sm hover:bg-[#1a4962]"
                >
                  Kirim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative">
            <button
              onClick={() => setModalPreview(null)}
              className="absolute top-2 right-3 text-gray-600 hover:text-red-600 text-xl"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-4">
              Sertifikat: {modalPreview.ajuan.peserta.namaLengkap}
            </h3>
            <iframe
              src={modalPreview.fileUrl}
              className="w-full h-[500px] border rounded"
              title="Preview Sertifikat"
            />
          </div>
        </div>
      )}
    </div>
  );
}
