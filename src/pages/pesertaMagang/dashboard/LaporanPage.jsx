import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { LaporanContext } from './LaporanContext';

const toISODateString = (date) => {
  return date.toISOString().split('T')[0];
};

const formatWeekRange = (startDate, endDate) => {
  const options = { month: 'short', day: 'numeric' };
  const start = startDate.toLocaleDateString('id-ID', options);
  const end = endDate.toLocaleDateString('id-ID', {
    ...options,
    year: 'numeric',
  });
  return `${start} – ${end}`;
};

const generateWeeklyStructure = (tglMulaiISO, tglSelesaiISO, logbooks = []) => {
  const weeks = [];
  let currentDate = new Date(tglMulaiISO);
  const endDate = new Date(tglSelesaiISO);

  const filledLogbookDates = new Set(
    logbooks.map((log) => toISODateString(new Date(log.tanggal)))
  );

  while (currentDate <= endDate) {
    // Cari hari Senin (hari ke-1)
    while (currentDate.getDay() !== 1 && currentDate <= endDate) {
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (currentDate > endDate) break;

    const weekStartDate = new Date(currentDate.getTime());
    const weekDays = [];

    // Loop 5 hari (Senin-Jumat)
    for (let i = 0; i < 5; i++) {
      const dayDate = new Date(currentDate.getTime());
      dayDate.setDate(dayDate.getDate() + i); // Maju 1 hari

      if (dayDate > endDate) break;

      const isoDate = toISODateString(dayDate);
      weekDays.push({
        date: isoDate,
        dayName: dayDate
          .toLocaleDateString('id-ID', { weekday: 'short' })
          .charAt(0)
          .toUpperCase(),
        isFilled: filledLogbookDates.has(isoDate),
      });
    }

    if (weekDays.length > 0) {
      // Ambil tanggal terakhir di array weekDays (Jumat atau hari terakhir magang)
      const weekEndDate = new Date(weekDays[weekDays.length - 1].date);
      weeks.push({
        id: toISODateString(weekStartDate),
        tanggal: formatWeekRange(weekStartDate, weekEndDate),
        days: weekDays.map((d) => d.dayName),
        isi: weekDays.map((d) => d.isFilled),
      });
    }

    currentDate.setDate(currentDate.getDate() + 7 - 4);
  }

  return weeks;
};

export default function LaporanPage() {
  const navigate = useNavigate();
  const { uploadHistory } = useContext(LaporanContext);
  const latestSubmission = uploadHistory.length > 0 ? uploadHistory[0] : null;

  const [weeklyData, setWeeklyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogbookData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Otentikasi dibutuhkan. Silakan login kembali.');
        }

        const response = await fetch(
          'http://localhost:3000/api/peserta/logbook',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || 'Gagal mengambil data logbook');
        }

        const res = await response.json();
        const { periode, logbooks } = res.data;

        const weeks = generateWeeklyStructure(
          periode.tglMulai,
          periode.tglSelesai,
          logbooks
        );
        setWeeklyData(weeks);
      } catch (err) {
        console.error('Error fetching logbook data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogbookData();
  }, []);

  const handleNavigateUpload = () => {
    navigate('/dashboard/unggah-laporan-akhir');
  };

  const handleOpenForm = (mingguIndex, dayIndex) => {
    navigate(`/dashboard/laporan-harian-form/${mingguIndex}/${dayIndex}`);
  };

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

  const topStatusInfo = {
    Pending: { icon: '🕒', text: 'File Sudah Diupload, Menunggu Review' },
    Diterima: { icon: '✅', text: 'File Sudah Diterima' },
    Ditolak: { icon: '❌', text: 'File Ditolak, Perlu Perbaikan' },
  };

  return (
    <div>
      <div className="bg-white p-6 rounded shadow mb-6">
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

        <h2 className="font-bold text-lg mt-2">Laporan Hasil Magang</h2>
        <p className="text-sm text-gray-600">
          Laporan hasil magang dapat diunggah ketika semua laporan harian sudah
          diunggah.
        </p>

        <hr className="my-6 border-t border-gray-200" />

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
      {isLoading && (
        <div className="bg-white p-6 rounded shadow mb-6 text-center">
          Memuat data laporan harian...
        </div>
      )}
      {error && (
        <div className="bg-white p-6 rounded shadow mb-6 text-center text-red-600">
          Error: {error}
        </div>
      )}

      {!isLoading &&
        !error &&
        weeklyData.map((mingguItem, idx) => {
          const isWeekDone = mingguItem.isi.every((terisi) => terisi);
          return (
            <div
              key={mingguItem.id}
              className="bg-white p-6 rounded shadow mb-6"
            >
              <div
                className={`font-semibold mb-2 flex items-center gap-2 ${
                  isWeekDone ? 'text-green-600' : 'text-[#FF6B00]'
                }`}
              >
                {isWeekDone ? '✅ Selesai' : '✏️ Belum Dibuat'}
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
                <button
                  onClick={() => handleOpenForm(idx, 0)}
                  className="bg-[#006DA6] text-white px-6 py-2 rounded"
                >
                  Lengkapi Laporan Harian
                </button>
              </div>
            </div>
          );
        })}

      {!isLoading && !error && weeklyData.length === 0 && (
        <div className="bg-white p-6 rounded shadow mb-6 text-center text-gray-500">
          Anda tidak memiliki periode magang yang aktif atau disetujui.
        </div>
      )}
    </div>
  );
}
