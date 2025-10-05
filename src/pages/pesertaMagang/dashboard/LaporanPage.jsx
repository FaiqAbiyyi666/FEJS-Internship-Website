// src/pages/pesertaMagang/dashboard/LaporanPage.jsx

import { useNavigate } from 'react-router-dom';

export default function LaporanPage() {
  const navigate = useNavigate();

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
    // Navigasi ke rute yang sudah didefinisikan di App.jsx
    navigate('/dashboard/unggah-laporan-akhir');
  };

  const handleOpenForm = (mingguIndex, dayIndex) => {
    // Navigasi ke rute form dengan parameter
    navigate(`/dashboard/laporan-harian-form/${mingguIndex}/${dayIndex}`);
  };

  return (
    <div>
      <div className="bg-white p-6 rounded shadow mb-6">
        <p className="text-[#006DA6] font-semibold flex items-center gap-2">
          <span className="text-lg">📝</span> Belum Diupload
        </p>
        <h2 className="font-bold text-lg mt-2">Laporan Hasil Magang</h2>
        <p className="text-sm text-gray-600">
          Laporan hasil magang dapat diunggah ketika semua laporan harian sudah
          diunggah
        </p>
        <hr className="my-6 border-t border-gray-200" />
        <div className="flex justify-center">
          <button
            onClick={handleNavigateUpload}
            className="px-4 py-2 bg-[#006DA6] text-white rounded"
          >
            Unggah Laporan Hasil Magang
          </button>
        </div>
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
