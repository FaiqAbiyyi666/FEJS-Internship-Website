import React, { useState } from 'react';
import { Eye, Plus } from 'react-feather';

const dummyPeserta = [
  { id: '1', nama: 'Ahmad Fadli' },
  { id: '2', nama: 'Siti Aminah' },
  { id: '3', nama: 'Budi Santoso' },
];

const ITEMS_PER_PAGE = 5;

export default function ManageSertifikat() {
  const [sertifikatData] = useState([
    {
      id: 1,
      namaPeserta: 'Ahmad Fauzi',
      noSurat: '123/SK/Diskominfo',
      bidang: 'Tata Kelola Informatika',
      fileUrl: '/dummy/surat1.pdf',
    },
    {
      id: 2,
      namaPeserta: 'Dina Maharani',
      noSurat: '124/SK/Diskominfo',
      bidang: 'Sekretariat',
      fileUrl: '/dummy/surat2.pdf',
    },
    {
      id: 3,
      namaPeserta: 'Rizky Saputra',
      noSurat: '125/SK/Diskominfo',
      bidang: 'Statistik',
      fileUrl: '/dummy/surat3.pdf',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBidang, setSelectedBidang] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [history, setHistory] = useState([]);
  const [modalKirim, setModalKirim] = useState(false);
  const [modalPreview, setModalPreview] = useState(null);
  const [filterTanggal, setFilterTanggal] = useState('');

  const filteredData = history.filter((item) => {
    const matchesSearch =
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.noSertifikat.toLowerCase().includes(searchTerm.toLowerCase());

    const bidangPeserta = sertifikatData.find(
      (data) => data.namaPeserta === item.nama
    )?.bidang;

    const matchesBidang =
      selectedBidang === '' || bidangPeserta === selectedBidang;

    // Konversi tanggal sertifikat ke format YYYY-MM-DD untuk dibandingkan
    const formattedTanggal = new Date(item.tanggal).toISOString().split('T')[0];
    const matchTanggal =
      filterTanggal === '' || formattedTanggal === filterTanggal;

    return matchesSearch && matchesBidang && matchTanggal;
  });

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const [form, setForm] = useState({
    pesertaId: '',
    namaPeserta: '',
    noSertifikat: '',
    nilai: '',
    file: null,
    fileURL: '',
  });

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

  const handlePilihPeserta = (e) => {
    const value = e.target.value;
    const peserta = dummyPeserta.find((p) => p.nama === value);
    if (peserta) {
      setForm((prev) => ({
        ...prev,
        pesertaId: peserta.id,
        namaPeserta: peserta.nama,
      }));
    } else {
      setForm((prev) => ({ ...prev, pesertaId: '', namaPeserta: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.pesertaId || !form.noSertifikat || !form.nilai || !form.file) {
      alert('Semua kolom wajib diisi');
      return;
    }

    const newEntry = {
      id: Date.now(),
      nama: form.namaPeserta,
      noSertifikat: form.noSertifikat,
      nilai: form.nilai,
      tanggal: new Date().toLocaleDateString(),
      fileURL: form.fileURL,
    };

    setHistory((prev) => [newEntry, ...prev]);
    setModalKirim(false);
    setForm({
      pesertaId: '',
      namaPeserta: '',
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
            <option value="Infrastruktur & Keamanan TIK">
              Infrastruktur & Keamanan TIK
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
          onClick={() => setModalKirim(true)}
          className="flex items-center gap-2 bg-[#006DA6] hover:bg-[#1a4962] text-white px-4 py-2 rounded text-sm"
        >
          <Plus size={16} /> Kirim Sertifikat
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-200">
          <thead className="bg-[#006DA6] text-white">
            <tr>
              <th className="px-4 py-3 text-left rounded-tl-lg">Nama</th>
              <th className="px-4 py-3 text-left">No Sertifikat</th>
              <th className="px-4 py-3 text-left">Nilai</th>
              <th className="px-4 py-3 text-left">Tanggal</th>
              <th className="px-4 py-3 text-left rounded-tr-lg">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              <>
                {paginatedData.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">{item.nama}</td>
                    <td className="px-4 py-3">{item.noSertifikat}</td>
                    <td className="px-4 py-3">{item.nilai}</td>
                    <td className="px-4 py-3">{item.tanggal}</td>
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
                  <td colSpan="5" className="px-4 py-3 border-t">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-sm">
                      <p className="text-gray-700">
                        Menampilkan{' '}
                        <span className="font-medium">
                          {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                        </span>{' '}
                        -{' '}
                        <span className="font-medium">
                          {Math.min(
                            currentPage * ITEMS_PER_PAGE,
                            filteredData.length
                          )}
                        </span>{' '}
                        dari{' '}
                        <span className="font-medium">
                          {filteredData.length}
                        </span>{' '}
                        hasil
                      </p>
                      <div className="flex flex-wrap gap-1">
                        <button
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
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
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
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
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  Belum ada data sertifikat.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Kirim Sertifikat */}
      {modalKirim && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <button
              onClick={() => setModalKirim(false)}
              className="absolute top-2 right-3 text-gray-600 hover:text-red-600 text-xl"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-4">Kirim Sertifikat</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nama Peserta
                </label>
                <input
                  list="pesertaList"
                  name="namaPeserta"
                  value={form.namaPeserta}
                  onChange={handlePilihPeserta}
                  placeholder="Ketik nama peserta..."
                  className="w-full border px-3 py-2 rounded text-sm"
                />
                <datalist id="pesertaList">
                  {dummyPeserta.map((peserta) => (
                    <option key={peserta.id} value={peserta.nama} />
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

      {/* Modal Preview Sertifikat */}
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
              Sertifikat: {modalPreview.nama}
            </h3>
            <iframe
              src={modalPreview.fileURL}
              className="w-full h-[500px] border rounded"
              title="Preview Sertifikat"
            />
          </div>
        </div>
      )}
    </div>
  );
}
