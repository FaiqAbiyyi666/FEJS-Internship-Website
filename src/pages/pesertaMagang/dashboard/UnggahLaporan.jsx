import React, {
  useState,
  useRef,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { LaporanContext } from './LaporanContext';
import { Loader2 } from 'lucide-react';

const BASE_URL = 'http://localhost:3000/api/peserta';

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
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getToken = () => localStorage.getItem('token');

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${BASE_URL}/laporan-akhir/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.msg || 'Gagal memuat riwayat laporan.');
      }

      const data = await res.json();
      setUploadHistory(data);
    } catch (err) {
      console.error('Fetch History Error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [setUploadHistory]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const latestStatus =
    uploadHistory.length > 0 ? uploadHistory[0].status : null;
  const canUpload = !latestStatus || latestStatus === 'REJECTED';

  // Handler file (Tidak berubah)
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

  const handleReview = () => {
    if (file) {
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    setIsSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('fileLaporan', file);

    try {
      const token = getToken();
      const res = await fetch(`${BASE_URL}/laporan-akhir`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.msg || 'Gagal mengunggah file.');
      }

      alert(
        resData.msg || 'Laporan berhasil dikirim dan sedang menunggu review!'
      );
      handleRemoveFile();
      fetchHistory();
    } catch (err) {
      console.error('Submit Error:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // === FUNGSI BADGE (Diperbarui) ===
  // Menangani nilai dari backend (PENDING, APPROVED, REJECTED)
  const StatusBadge = ({ status }) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
    };
    const statusText = {
      PENDING: 'Pending',
      APPROVED: 'Diterima',
      REJECTED: 'Ditolak',
    };
    return (
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
          styles[status] || 'bg-gray-100 text-gray-800'
        }`}
      >
        {statusText[status] || status}
      </span>
    );
  };

  // Komponen Input File
  const CustomFileInput = () => (
    <div className="space-y-1 mb-6">
      <label className="block text-sm font-medium">
        {/* **PERBAIKAN**: Sesuaikan dengan nilai backend ('REJECTED') */}
        {latestStatus === 'REJECTED'
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
        disabled={isSubmitting} // Disable saat proses submit
      />
      <div
        className={`form-input w-full flex items-center p-0 ${
          error ? 'border-red-500' : ''
        } ${isSubmitting ? 'bg-gray-100' : ''}`}
      >
        <label
          htmlFor="file-input-laporan"
          className={`text-sm font-medium px-4 py-2 rounded-l-md border-r border-gray-300 transition-colors whitespace-nowrap ${
            isSubmitting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700 cursor-pointer'
          }`}
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
            disabled={isSubmitting}
            className="text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full p-1 mr-2 disabled:opacity-50"
            title="Hapus file"
          >
            <CloseIcon />
          </button>
        )}
      </div>
      {/* Tampilkan error submit atau error validasi */}
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );

  // === Tampilan Loading Utama ===
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#006DA6]" />
        <span className="ml-2 text-gray-700">Memuat riwayat...</span>
      </div>
    );
  }

  // === JSX Utama ===
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

        {/* Alert Peringatan (Tidak berubah) */}
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

        {/* === Tampilan Form Upload atau Status === */}
        {canUpload ? (
          <>
            <CustomFileInput />
            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <button
                onClick={handleReview}
                disabled={!file || isSubmitting}
                className={`px-6 py-2 rounded transition-colors text-sm font-medium ${
                  file
                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Review File
              </button>
              <button
                onClick={handleSubmit}
                disabled={!file || isSubmitting}
                className={`px-6 py-2 rounded transition-colors text-sm font-medium w-36 ${
                  file
                    ? 'bg-[#006DA6] text-white hover:bg-[#00314b] disabled:bg-gray-300 disabled:text-gray-500'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  'Kirim Laporan'
                )}
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

      {/* === Tampilan Riwayat === */}
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
                      Diunggah pada:{' '}
                      {new Date(item.tanggalUpload).toLocaleDateString(
                        'id-ID',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 justify-start md:justify-self-end">
                    <StatusBadge status={item.status} />
                    {item.status === 'REJECTED' && item.catatan && (
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
