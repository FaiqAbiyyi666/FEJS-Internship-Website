import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { LaporanContext } from './LaporanContext';

// SIMULASI: Ubah isi array ini untuk melihat perubahan tampilan
const mockUploadHistory = [
  {
    id: 1,
    namaFile: 'Laporan_Final_Magang_JaneDoe_v2.pdf',
    status: 'Pending', // Coba ganti: 'Diterima' atau 'Ditolak'
  },
];

export default function LaporanPage() {
  const navigate = useNavigate();

  const { uploadHistory } = useContext(LaporanContext);
  const latestSubmission = uploadHistory.length > 0 ? uploadHistory[0] : null;

  // Data laporan harian (tidak diubah)
  const minggu = [
    {
      tanggal: '30 Nov – 4 Des 2026',
      days: ['S', 'S', 'R', 'K', 'J'],
      isi: [true, false, false, false, false],
    },
    {
      tanggal: '7 – 11 Des 2026',
      days: ['S', 'S', 'R', 'K', 'J'],
      isi: [true, false, false, false, false],
    },
  ];

  const handleNavigateUpload = () => {
    navigate('/dashboard/unggah-laporan-akhir');
  };

  const handleOpenForm = (mingguIndex, dayIndex) => {
    navigate(`/dashboard/laporan-harian-form/${mingguIndex}/${dayIndex}`);
  };

  // Komponen helper untuk badge status
  const StatusBadge = ({ status }) => {
    const styles = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Diterima: 'bg-green-100 text-green-800',
      Ditolak: 'bg-red-100 text-red-800',
    };
    return (
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full ${styles[status]}`}
      >
        {status}
      </span>
    );
  };

  // Objek helper untuk status di bagian atas
  const topStatusInfo = {
    Pending: { icon: '🕒', text: 'File Sudah Diupload, Menunggu Review' },
    Diterima: { icon: '✅', text: 'File Sudah Diterima' },
    Ditolak: { icon: '❌', text: 'File Ditolak, Perlu Perbaikan' },
  };

  return (
    <div>
      {/* --- Card Laporan Hasil Magang --- */}
      <div className="bg-white p-6 rounded shadow mb-6">
        {/* BAGIAN 1: Status di atas (sekarang dinamis) */}
        {latestSubmission ? (
          <p className="font-semibold flex items-center gap-2 text-gray-700">
            <span className="text-lg">
              {topStatusInfo[latestSubmission.status]?.icon}
            </span>
            {topStatusInfo[latestSubmission.status]?.text}
          </p>
        ) : (
          <p className="text-[#006DA6] font-semibold flex items-center gap-2">
            <span className="text-lg">📝</span> Belum Diupload
          </p>
        )}

        {/* BAGIAN 2: Judul dan Deskripsi (tetap statis) */}
        <h2 className="font-bold text-lg mt-2">Laporan Hasil Magang</h2>
        <p className="text-sm text-gray-600">
          Laporan hasil magang dapat diunggah ketika semua laporan harian sudah
          diunggah.
        </p>

        <hr className="my-6 border-t border-gray-200" />

        {/* BAGIAN 3: Konten di bawah garis (sekarang dinamis) */}
        {latestSubmission ? (
          // Tampilan JIKA SUDAH UPLOAD
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-grow">
              <p className="text-sm font-semibold text-gray-800">
                File Terkirim:
              </p>
              <p
                className="text-base text-gray-700 truncate"
                title={latestSubmission.namaFile}
              >
                {latestSubmission.namaFile}
              </p>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <StatusBadge status={latestSubmission.status} />
              <button
                onClick={handleNavigateUpload}
                className="px-4 py-2 bg-[#006DA6] text-white rounded hover:bg-[#003450] transition-colors text-sm font-medium"
              >
                Detail Unggahan
              </button>
            </div>
          </div>
        ) : (
          // Tampilan JIKA BELUM UPLOAD
          <div className="flex justify-center">
            <button
              onClick={handleNavigateUpload}
              className="px-4 py-2 bg-[#006DA6] text-white rounded hover:bg-[#003450] transition-colors"
            >
              Unggah Laporan Hasil Magang
            </button>
          </div>
        )}
      </div>

      <h3 className="text-lg font-bold mb-2">Laporan Harian</h3>
      {minggu.map((mingguItem, idx) => (
        <div key={idx} className="bg-white p-6 rounded shadow mb-6">
          <div className="text-[#FF6B00] font-semibold mb-2 flex items-center gap-2">
            ✏️ Belum Dibuat
          </div>
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg font-bold">{mingguItem.tanggal}</div>
            <div className="flex gap-6">
              {mingguItem.days.map((day, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-sm font-semibold text-gray-700 mb-1">
                    {day}
                  </span>
                  <div
                    className={`w-9 h-9 flex items-center justify-center rounded-full border text-sm ${
                      mingguItem.isi[i]
                        ? 'bg-blue-500 text-white border-black border-2'
                        : 'border-2 bg-gray-200 border-gray-500'
                    }`}
                  >
                    {mingguItem.isi[i] ? '✓' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <hr className="my-6 border-t border-gray-200" />
          <div className="flex justify-center">
            {/* Hardcode dayIndex ke 0, Anda mungkin perlu logika lebih lanjut di sini */}
            <button
              onClick={() => handleOpenForm(idx, 0)}
              className="bg-[#006DA6] text-white px-6 py-2 rounded"
            >
              Lengkapi Laporan Harian
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
