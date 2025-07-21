import { useState } from 'react';

export default function UnggahLaporanPage({ onBack }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type !== 'application/pdf') {
      setError('File harus berformat PDF');
      setFile(null);
    } else {
      setError('');
      setFile(uploadedFile);
    }
  };

  const handleSubmit = () => {
    alert('Laporan berhasil dikirim!');
    onBack(); // kembali ke halaman laporan
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow mt-10">
      <button onClick={onBack} className="text-[#006DA6] mb-4">
        ← Kembali
      </button>

      <h2 className="text-lg font-bold mb-2 text-[#006DA6]">
        📄 Unggah Laporan Hasil Magang
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Pastikan file yang diunggah berformat PDF dan merupakan laporan final
        hasil kegiatan magang.
      </p>

      <label className="block font-semibold mb-2">Pilih File PDF</label>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="mb-4"
      />
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {file && (
        <div className="bg-gray-100 p-4 rounded mb-6">
          <p className="text-sm font-medium text-gray-700">📎 {file.name}</p>
        </div>
      )}

      <div className="flex justify-between">
        <button
          disabled={!file}
          className={`px-6 py-2 rounded ${
            file
              ? 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Review
        </button>
        <button
          disabled={!file}
          onClick={handleSubmit}
          className={`px-6 py-2 rounded ${
            file
              ? 'bg-[#006DA6] text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Kirim
        </button>
      </div>
    </div>
  );
}
