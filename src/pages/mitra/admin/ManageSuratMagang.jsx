import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Eye } from 'lucide-react';

const daftarBidang = [
  'Semua',
  'Tata Kelola Informatika',
  'Pengelolaan Informasi dan Komunikasi Publik',
  'Infrastruktur & Keamanan TIK',
  'Sekretariat',
  'Statistik',
];

export default function ManageSuratMagang() {
  const [showModal, setShowModal] = useState(false);
  const [pesertaDiterima, setPesertaDiterima] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTabel, setIsLoadingTabel] = useState(false);

  const [riwayat, setRiwayat] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewPdfUrl, setPreviewPdfUrl] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const [searchNama, setSearchNama] = useState('');
  const [filterBidang, setFilterBidang] = useState('Semua');
  const [filterTanggal, setFilterTanggal] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [form, setForm] = useState({
    ajuanId: '',
    namaPeserta: '',
    email: '',
    noSurat: '',
    file: null,
  });

  useEffect(() => {
    const fetchPeserta = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          'http://localhost:3000/api/admin/peserta-diterima',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.status) {
          setPesertaDiterima(result.data);
        } else {
          throw new Error(result.message || 'Gagal mengambil data.');
        }
      } catch (error) {
        console.error('Gagal mengambil data peserta:', error);
        alert('Gagal mengambil data peserta diterima: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPeserta();
  }, []);

  useEffect(() => {
    const fetchRiwayat = async () => {
      setIsLoadingTabel(true);
      try {
        const params = new URLSearchParams();
        if (searchNama) params.append('search', searchNama);
        if (filterBidang) params.append('bidang', filterBidang);
        if (filterTanggal) params.append('date', filterTanggal);

        const response = await fetch(
          `http://localhost:3000/api/admin/riwayat-surat-penerimaan?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        if (!response.ok) throw new Error('Gagal mengambil riwayat surat.');
        const result = await response.json();
        if (result.status) {
          setRiwayat(result.data);
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        console.error('Gagal mengambil riwayat surat:', error);
        alert('Gagal mengambil riwayat surat: ' + error.message);
      } finally {
        setIsLoadingTabel(false);
      }
    };

    fetchRiwayat();
  }, [searchNama, filterBidang, filterTanggal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handlePilihPeserta = (e) => {
    const namaTerpilih = e.target.value;
    const peserta = pesertaDiterima.find((p) => p.nama === namaTerpilih);

    if (peserta) {
      setForm((prev) => ({
        ...prev,
        ajuanId: peserta.ajuanId,
        namaPeserta: peserta.nama,
        bidang: peserta.bidang,
        email: peserta.email,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        ajuanId: '',
        namaPeserta: namaTerpilih,
        email: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.ajuanId || !form.noSurat || !form.file || !form.email) {
      alert('Silakan lengkapi semua data');
      return;
    }

    const formData = new FormData();
    formData.append('ajuanId', form.ajuanId);
    formData.append('noSurat', form.noSurat);
    formData.append('suratPenerimaan', form.file);

    setIsLoading(true);

    try {
      const response = await fetch(
        'http://localhost:3000/api/admin/kirim-surat',
        {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`
        );
      }

      alert(result.message);

      const fileLink = URL.createObjectURL(form.file);
      setRiwayat((prev) => [
        {
          id: Date.now(),
          namaPeserta: form.namaPeserta,
          email: form.email,
          bidang: form.bidang,
          noSurat: form.noSurat,
          tanggal: new Date().toISOString(),
          fileUrl: fileLink,
        },
        ...prev,
      ]);

      setForm({
        ajuanId: '',
        namaPeserta: '',
        email: '',
        noSurat: '',
        file: null,
      });
      setShowModal(false);
      setPreviewUrl(null);

      setPesertaDiterima((prev) =>
        prev.filter((p) => p.ajuanId !== form.ajuanId)
      );
    } catch (error) {
      console.error('Gagal mengirim surat:', error);
      alert(
        'Gagal mengirim surat: ' +
          (error.message || 'Terjadi kesalahan tidak diketahui')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRiwayat = useMemo(() => {
    return riwayat.filter((item) => {
      const matchNama = item.namaPeserta
        .toLowerCase()
        .includes(searchNama.toLowerCase());
      const matchBidang =
        filterBidang === 'Semua' || item.bidang === filterBidang;
      const matchTanggal =
        filterTanggal === '' || item.tanggal === filterTanggal;
      return matchNama && matchBidang && matchTanggal;
    });
  }, [riwayat, searchNama, filterBidang, filterTanggal]);

  const totalPages = Math.ceil(filteredRiwayat.length / itemsPerPage);
  const currentData = filteredRiwayat.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Cari nama peserta..."
            value={searchNama}
            onChange={(e) => setSearchNama(e.target.value)}
            className="border px-3 py-2 rounded text-sm w-64"
          />
          <select
            value={filterBidang}
            onChange={(e) => setFilterBidang(e.target.value)}
            className="border px-3 py-2 rounded text-sm"
          >
            {daftarBidang.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={filterTanggal}
            onChange={(e) => setFilterTanggal(e.target.value)}
            className="border px-3 py-2 rounded text-sm"
          />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#006DA6] text-white px-4 py-2 rounded hover:bg-[#00517c] flex items-center gap-2"
        >
          <Plus size={16} />
          Kirim Surat Magang
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#006DA6] text-white">
            <tr>
              <th className="px-4 py-3">Nama Peserta</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Bidang</th>
              <th className="px-4 py-3">No Surat</th>
              <th className="px-4 py-3">Tanggal Kirim</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{item.namaPeserta}</td>
                  <td className="px-4 py-3">{item.email}</td>
                  <td className="px-4 py-3">{item.bidang}</td>
                  <td className="px-4 py-3">{item.noSurat}</td>
                  <td className="px-4 py-3">
                    {item.tanggal ? item.tanggal.split('T')[0] : 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        setPreviewPdfUrl(item.fileUrl);
                        setShowPreviewModal(true);
                      }}
                      className="text-[#006DA6] hover:underline flex items-center gap-1 text-sm"
                    >
                      <Eye size={16} /> Lihat Surat
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-4 text-gray-500 italic"
                >
                  Tidak ada data yang sesuai.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {filteredRiwayat.length > 0 && (
          <div className="flex justify-between items-center p-4 text-sm">
            <span>
              Halaman {currentPage} dari {totalPages}
            </span>
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-3 py-1 border rounded hover:bg-gray-100"
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded ${
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
                className="px-3 py-1 border rounded hover:bg-gray-100"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {showPreviewModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={() => setShowPreviewModal(false)}
        >
          <div
            className="bg-white w-full max-w-4xl h-[90vh] rounded shadow relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPreviewModal(false)}
              className="absolute top-2 right-3 bg-red-500 text-white rounded-full w-7 h-7 text-sm flex items-center justify-center"
            >
              ✕
            </button>
            <iframe
              src={previewPdfUrl}
              title="Preview Surat"
              className="w-full h-full rounded-b"
            ></iframe>
          </div>
        </div>
      )}

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          onClick={() => {
            setShowModal(false);
            setPreviewUrl(null);
          }}
        >
          <div
            className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-5 text-white bg-red-500 rounded-full px-2 py-1 text-sm"
              onClick={() => {
                setShowModal(false);
                setPreviewUrl(null);
              }}
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4 text-[#006DA6]">
              Tambah Surat Magang
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block mb-1 text-gray-700">Nama Peserta</label>
                <input
                  list="pesertaList"
                  name="namaPeserta"
                  value={form.namaPeserta}
                  onChange={handlePilihPeserta}
                  placeholder="Ketik nama peserta..."
                  className="w-full border px-3 py-2 rounded"
                />
                <datalist id="pesertaList">
                  {pesertaDiterima.map((peserta) => (
                    <option key={peserta.ajuanId} value={peserta.nama} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block mb-1 text-gray-700">
                  Email Peserta
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  readOnly
                  placeholder="Email akan terisi otomatis..."
                  className="w-full border px-3 py-2 rounded bg-gray-100"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-700">No Surat</label>
                <input
                  name="noSurat"
                  value={form.noSurat}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-700">
                  Upload Surat (PDF)
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    handleFileChange(e);
                    const file = e.target.files[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setPreviewUrl(url);
                    } else {
                      setPreviewUrl(null);
                    }
                  }}
                  className="w-full text-sm"
                />
              </div>

              {previewUrl && (
                <div className="mt-4">
                  <label className="block mb-1 text-gray-700">
                    Preview Surat:
                  </label>
                  <div className="border rounded overflow-hidden h-[400px]">
                    <iframe
                      src={previewUrl}
                      title="PDF Preview"
                      className="w-full h-full"
                    ></iframe>
                  </div>
                </div>
              )}

              <div className="text-right pt-4">
                <button
                  type="submit"
                  className="bg-[#006DA6] text-white px-4 py-2 rounded hover:bg-[#00517c]"
                >
                  Kirim Surat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
