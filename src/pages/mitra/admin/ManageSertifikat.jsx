import React, { useState } from 'react';

const dummyPeserta = [
  { id: '1', nama: 'Ahmad Fadli' },
  { id: '2', nama: 'Siti Aminah' },
  { id: '3', nama: 'Budi Santoso' },
];

export default function ManageSertifikat() {
  const [form, setForm] = useState({
    pesertaId: '',
    namaPeserta: '',
    noSertifikat: '',
    nilai: '',
    file: null,
    fileURL: '',
  });

  const [history, setHistory] = useState([]);
  const [statusKirim, setStatusKirim] = useState('');
  const [selectedDetail, setSelectedDetail] = useState(null);

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
    setStatusKirim('Sertifikat berhasil dikirim.');

    // Reset form
    setForm({
      pesertaId: '',
      namaPeserta: '',
      noSertifikat: '',
      nilai: '',
      file: null,
      fileURL: '',
    });

    // Hapus status setelah beberapa detik
    setTimeout(() => setStatusKirim(''), 3000);
  };

  const openDetailModal = (item) => {
    setSelectedDetail(item);
  };

  const closeDetailModal = () => {
    setSelectedDetail(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-gray-700 mb-6 text-center">
        Form Pengiriman Sertifikat Magang
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-6 space-y-4 mb-10"
      >
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Cari Nama Peserta
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
          <label className="block mb-1 text-sm font-medium text-gray-700">
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
          <label className="block mb-1 text-sm font-medium text-gray-700">
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
          <label className="block mb-1 text-sm font-medium text-gray-700">
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
          <div className="mt-4">
            <p className="text-sm font-medium mb-1">Preview Sertifikat:</p>
            <iframe
              src={form.fileURL}
              className="w-full h-64 border rounded"
              title="Preview Sertifikat"
            ></iframe>
          </div>
        )}

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 text-sm"
          >
            Kirim Sertifikat
          </button>
        </div>

        {statusKirim && (
          <div className="text-green-600 text-sm text-center mt-2">
            {statusKirim}
          </div>
        )}
      </form>

      {/* History Table */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-md font-semibold mb-4 text-gray-700">
          Riwayat Pengiriman Sertifikat
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">Nama</th>
                <th className="px-4 py-2">No Sertifikat</th>
                <th className="px-4 py-2">Nilai</th>
                <th className="px-4 py-2">Tanggal</th>
                <th className="px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{item.nama}</td>
                  <td className="px-4 py-2">{item.noSertifikat}</td>
                  <td className="px-4 py-2">{item.nilai}</td>
                  <td className="px-4 py-2">{item.tanggal}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => openDetailModal(item)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center text-gray-500 py-4 text-sm"
                  >
                    Belum ada pengiriman sertifikat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Sertifikat */}
      {selectedDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
            <button
              onClick={closeDetailModal}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-lg"
            >
              &times;
            </button>

            <h3 className="text-lg font-bold mb-4">Detail Sertifikat</h3>

            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <strong>Nama Peserta:</strong> {selectedDetail.nama}
              </p>
              <p>
                <strong>No Sertifikat:</strong> {selectedDetail.noSertifikat}
              </p>
              <p>
                <strong>Nilai:</strong> {selectedDetail.nilai}
              </p>
              <p>
                <strong>Tanggal Kirim:</strong> {selectedDetail.tanggal}
              </p>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium mb-1">File Sertifikat:</p>
              <iframe
                src={selectedDetail.fileURL}
                title="Preview Sertifikat"
                className="w-full h-64 border rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
