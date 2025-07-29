import React, { useState } from 'react';

const dummyPesertaDisetujui = [
  { id: 'p1', nama: 'Ahmad Fadli' },
  { id: 'p2', nama: 'Siti Aminah' },
  { id: 'p3', nama: 'Budi Santoso' },
];

export default function ManageSuratMagang() {
  const [form, setForm] = useState({
    pesertaId: '',
    namaPeserta: '',
    noSurat: '',
    file: null,
  });

  const [history, setHistory] = useState([]);
  const [statusKirim, setStatusKirim] = useState('');
  const [previewURL, setPreviewURL] = useState(null);

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

    const fileURL = URL.createObjectURL(form.file);

    const newEntry = {
      id: Date.now(),
      pesertaId: form.pesertaId,
      namaPeserta: form.namaPeserta,
      noSurat: form.noSurat,
      fileURL,
    };

    setHistory((prev) => [...prev, newEntry]);
    setStatusKirim('Surat penerimaan berhasil dikirim.');

    // Reset form
    setForm({
      pesertaId: '',
      namaPeserta: '',
      noSurat: '',
      file: null,
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-gray-700 mb-6 text-center">
        Kirim Surat Penerimaan Magang
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-6 space-y-4"
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
            {dummyPesertaDisetujui.map((peserta) => (
              <option key={peserta.id} value={peserta.nama} />
            ))}
          </datalist>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Nomor Surat Penerimaan
          </label>
          <input
            type="text"
            name="noSurat"
            value={form.noSurat}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded text-sm"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Upload Surat (PDF)
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full text-sm"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 text-sm"
          >
            Kirim Surat
          </button>
        </div>

        {statusKirim && (
          <div className="text-green-600 text-sm text-center mt-2">
            {statusKirim}
          </div>
        )}
      </form>

      {/* Tabel Riwayat Pengiriman */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Riwayat Pengiriman Surat
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border border-gray-200">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border">No</th>
                <th className="px-4 py-2 border">Nama Peserta</th>
                <th className="px-4 py-2 border">Nomor Surat</th>
                <th className="px-4 py-2 border">Preview File</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-gray-500 py-4">
                    Belum ada surat yang dikirim.
                  </td>
                </tr>
              ) : (
                history.map((item, idx) => (
                  <tr key={item.id} className="border-b">
                    <td className="px-4 py-2 border">{idx + 1}</td>
                    <td className="px-4 py-2 border">{item.namaPeserta}</td>
                    <td className="px-4 py-2 border">{item.noSurat}</td>
                    <td className="px-4 py-2 border text-center">
                      <button
                        onClick={() => setPreviewURL(item.fileURL)}
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        Lihat File
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Preview File */}
      {previewURL && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-4 max-w-3xl w-full rounded shadow">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-lg font-semibold">Preview Surat</h4>
              <button
                onClick={() => setPreviewURL(null)}
                className="text-red-600 hover:underline text-sm"
              >
                Tutup
              </button>
            </div>
            <embed
              src={previewURL}
              type="application/pdf"
              width="100%"
              height="500px"
            />
          </div>
        </div>
      )}
    </div>
  );
}
