import { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LaporanContext } from './LaporanContext';

// (Data dan Ikon tetap sama seperti sebelumnya)
const mockHistoryData = [
  {
    id: 2,
    namaFile: 'Laporan_Revisi_Magang_JohnDoe.pdf',
    tanggalUpload: '2025-10-05',
    status: 'Ditolak',
    fileUrl: '/path/to/revisi.pdf',
    catatan: 'Mohon perbaiki bagian Bab 3 dan lampiran.',
  },
  {
    id: 1,
    namaFile: 'Laporan_Magang_JohnDoe_v1.pdf',
    tanggalUpload: '2025-09-28',
    status: 'Diterima',
    fileUrl: '/path/to/file.pdf',
    catatan: null,
  },
];

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
const WarningIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-red-700"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

export default function UnggahLaporanPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const { uploadHistory, setUploadHistory } = useContext(LaporanContext);
  const [visibleNoteId, setVisibleNoteId] = useState(null);

  const latestStatus =
    uploadHistory.length > 0 ? uploadHistory[0].status : null;
  const canUpload = !latestStatus || latestStatus === 'Ditolak';

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      if (uploadedFile.type !== 'application/pdf') {
        setError('File harus berformat PDF');
        setFile(null);
      } else {
        setError('');
        setFile(uploadedFile);
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // FUNGSI BARU: Untuk review file sebelum kirim
  const handleReview = () => {
    if (file) {
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
    }
  };

  // FUNGSI LENGKAP: Logika untuk submit dan menambah ke riwayat
  const handleSubmit = () => {
    if (!file) return;

    const newSubmission = {
      id: Date.now(),
      namaFile: file.name,
      tanggalUpload: new Date().toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      status: 'Pending',
      fileUrl: URL.createObjectURL(file),
      catatan: null,
    };

    // Gunakan setUploadHistory dari Context!
    setUploadHistory([newSubmission, ...uploadHistory]);

    handleRemoveFile();
    alert('Laporan berhasil dikirim dan sedang menunggu review!');
    // Opsional: Langsung kembali ke halaman laporan setelah submit
    // navigate('/dashboard/laporan');
  };

  // FUNGSI LENGKAP: Logika untuk badge status
  const StatusBadge = ({ status }) => {
    const styles = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Diterima: 'bg-green-100 text-green-800',
      Ditolak: 'bg-red-100 text-red-800',
    };
    return (
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${styles[status]}`}
      >
        {status}
      </span>
    );
  };

  const CustomFileInput = () => (
    // ... (Komponen CustomFileInput tidak berubah)
    <div className="space-y-1 mb-6">
      <label className="block text-sm font-medium">
        {latestStatus === 'Ditolak'
          ? 'Pilih File Laporan Perbaikan'
          : 'Pilih File Laporan'}
      </label>
      <input
        ref={fileInputRef}
        id="file-input-laporan"
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
      />
      <div
        className={`form-input w-full flex items-center p-0 ${
          error ? 'border-red-500' : ''
        }`}
      >
        <label
          htmlFor="file-input-laporan"
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded-l-md border-r border-gray-300 cursor-pointer transition-colors whitespace-nowrap"
        >
          Choose File
        </label>
        <div className="px-3 truncate flex-grow flex items-center">
          {file ? (
            <span className="text-sm text-gray-800 truncate" title={file.name}>
              {file.name}
            </span>
          ) : (
            <span className="text-sm text-gray-500">No file chosen</span>
          )}
        </div>
        {file && (
          <button
            type="button"
            onClick={handleRemoveFile}
            className="text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full p-1 mr-2"
            title="Hapus file"
          >
            <CloseIcon />
          </button>
        )}
      </div>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );

  return (
    <>
      <div className="w-full bg-white p-6 rounded shadow ">
        <button
          onClick={() => navigate(-1)}
          className="text-[#006DA6] mb-4 hover:underline"
        >
          ← Kembali
        </button>

        <h2 className="text-lg font-bold mb-2 text-[#006DA6]">
          📄 Unggah Laporan Hasil Magang
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Pastikan file yang diunggah berformat PDF dan merupakan laporan final
          hasil kegiatan magang.
        </p>

        {/* Alert peringatan ini sekarang akan selalu terlihat di dalam card utama */}
        <div
          className="bg-red-50 border-l-4 border-red-400 p-4 mb-6"
          role="alert"
        >
          <div className="flex">
            <div className="py-1">
              <WarningIcon />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 font-semibold">
                Periksa Kembali File Anda!
              </p>
              <p className="text-sm text-red-600 mt-1">
                File yang sudah dikirim tidak dapat diubah atau dihapus sambil
                menunggu proses review.
              </p>
            </div>
          </div>
        </div>

        {canUpload ? (
          <>
            <CustomFileInput />
            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              {/* KEMBALI: Tombol Review File ditambahkan */}
              <button
                onClick={handleReview}
                disabled={!file}
                className={`px-6 py-2 rounded transition-colors text-sm font-medium ${
                  file
                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Review File
              </button>
              <button
                onClick={handleSubmit}
                disabled={!file}
                className={`px-6 py-2 rounded transition-colors text-sm font-medium ${
                  file
                    ? 'bg-[#006DA6] text-white hover:bg-[#00314b]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Kirim Laporan
              </button>
            </div>
          </>
        ) : (
          <div className="text-center bg-gray-50 p-6 rounded-md border">
            <h3 className="font-semibold text-gray-800">
              Laporan Anda Telah Terkirim
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Status laporan Anda saat ini adalah:
            </p>
            <div className="mt-4">
              <StatusBadge status={latestStatus} />
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Anda akan dapat mengunggah lagi jika laporan ini ditolak.
            </p>
          </div>
        )}
      </div>

      {uploadHistory.length > 0 && (
        <div className="mt-8 max-w-7xl mx-auto px-4">
          <h3 className="text-xl font-bold text-[#002942] mb-4">
            Riwayat Unggah Laporan
          </h3>
          <div className="space-y-4">
            {uploadHistory.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-lg shadow border transition-all duration-300"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="md:col-span-2">
                    <p className="font-semibold text-gray-800 truncate">
                      {item.namaFile}
                    </p>
                    <p className="text-sm text-gray-500">
                      Diunggah pada: {item.tanggalUpload}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 justify-start md:justify-self-end">
                    {/* KEMBALI: Badge status ditampilkan di sini */}
                    <StatusBadge status={item.status} />
                    {item.status === 'Ditolak' && item.catatan && (
                      <button
                        onClick={() =>
                          setVisibleNoteId(
                            visibleNoteId === item.id ? null : item.id
                          )
                        }
                        className="text-sm bg-orange-100 text-orange-800 font-semibold px-4 py-2 rounded-md hover:bg-orange-200 transition-colors"
                      >
                        {visibleNoteId === item.id ? 'Tutup' : 'Catatan'}
                      </button>
                    )}
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm bg-blue-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Lihat File
                    </a>
                  </div>
                </div>
                {visibleNoteId === item.id && (
                  <div className="mt-4 pt-4 border-t border-dashed">
                    <p className="text-sm font-semibold text-gray-800">
                      Catatan dari Koordinator:
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{item.catatan}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
