import React, { useState } from 'react';
import { Plus, FileText, Eye } from 'lucide-react';

const dummyPesertaDisetujui = [
  { id: 'p1', nama: 'Ahmad Fadli' },
  { id: 'p2', nama: 'Siti Aminah' },
  { id: 'p3', nama: 'Budi Santoso' },
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
  const [fileUrl, setFileUrl] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewPdfUrl, setPreviewPdfUrl] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

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

    const fileLink = URL.createObjectURL(form.file);

    setRiwayat((prev) => [
      ...prev,
      {
        ...form,
        id: Date.now(),
        fileUrl: fileLink,
        tanggal: new Date().toLocaleDateString(),
      },
    ]);

    setForm({ pesertaId: '', namaPeserta: '', noSurat: '', file: null });
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold text-[#006DA6]">
          Manajemen Surat Magang
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#006DA6] text-white px-4 py-2 rounded hover:bg-[#00517c] flex items-center gap-2"
        >
          <Plus size={16} />
          Tambah Surat Magang
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#006DA6] text-white">
            <tr>
              <th className="px-4 py-3">Nama Peserta</th>
              <th className="px-4 py-3">No Surat</th>
              <th className="px-4 py-3">Tanggal Kirim</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {riwayat.length > 0 ? (
              riwayat.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{item.namaPeserta}</td>
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
                  colSpan="4"
                  className="text-center py-4 text-gray-500 italic"
                >
                  Belum ada surat magang yang dikirim.
                </td>
              </tr>
            )}
          </tbody>
        </table>

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
      </div>

      {/* Modal Input */}
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
