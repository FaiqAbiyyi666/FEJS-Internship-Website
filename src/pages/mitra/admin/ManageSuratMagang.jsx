import React, { useState, useMemo } from 'react';
import { Plus, Eye } from 'lucide-react';

const dummyPesertaDisetujui = [
  { id: 'p1', nama: 'Ahmad Fadli', bidang: 'Tata Kelola Informatika' },
  { id: 'p2', nama: 'Siti Aminah', bidang: 'Infrastruktur & Keamanan TIK' },
  { id: 'p3', nama: 'Budi Santoso', bidang: 'Sekretariat' },
];

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
  const [form, setForm] = useState({
    pesertaId: '',
    namaPeserta: '',
    noSurat: '',
    file: null,
  });
  const [riwayat, setRiwayat] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewPdfUrl, setPreviewPdfUrl] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const [searchNama, setSearchNama] = useState('');
  const [filterBidang, setFilterBidang] = useState('Semua');
  const [filterTanggal, setFilterTanggal] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handlePilihPeserta = (e) => {
    const value = e.target.value;
    const peserta = dummyPesertaDisetujui.find((p) => p.nama === value);
    if (peserta) {
      setForm((prev) => ({
        ...prev,
        pesertaId: peserta.id,
        namaPeserta: peserta.nama,
        bidang: peserta.bidang,
      }));
    } else {
      setForm((prev) => ({ ...prev, pesertaId: '', namaPeserta: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.pesertaId || !form.noSurat || !form.file) {
      alert('Silakan lengkapi semua data');
      return;
    }

    const fileLink = URL.createObjectURL(form.file);
    const peserta = dummyPesertaDisetujui.find((p) => p.id === form.pesertaId);

    setRiwayat((prev) => [
      ...prev,
      {
        ...form,
        id: Date.now(),
        fileUrl: fileLink,
        tanggal: new Date().toISOString().split('T')[0],
        bidang: peserta?.bidang || 'Tidak diketahui',
      },
    ]);

    setForm({ pesertaId: '', namaPeserta: '', noSurat: '', file: null });
    setShowModal(false);
    setPreviewUrl(null);
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

  const changePage = (dir) => {
    setCurrentPage((prev) => {
      const next = prev + dir;
      if (next < 1 || next > totalPages) return prev;
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Filter & Button */}
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

      {/* Tabel Riwayat Surat */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#006DA6] text-white">
            <tr>
              <th className="px-4 py-3">Nama Peserta</th>
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
                  <td className="px-4 py-3">{item.bidang}</td>
                  <td className="px-4 py-3">{item.noSurat}</td>
                  <td className="px-4 py-3">{item.tanggal}</td>
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
                  colSpan="5"
                  className="text-center py-4 text-gray-500 italic"
                >
                  Tidak ada data yang sesuai.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
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

      {/* Modal Preview PDF */}
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

      {/* Modal Tambah Surat */}
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
                  {dummyPesertaDisetujui.map((peserta) => (
                    <option key={peserta.id} value={peserta.nama} />
                  ))}
                </datalist>
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

              {/* Preview PDF */}
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
