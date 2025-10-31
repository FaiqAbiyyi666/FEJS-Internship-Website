import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from '../../../components/modals/Modal';

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

const generateWeekAndDayData = (
  tglMulaiISO,
  tglSelesaiISO,
  logbooks = [],
  weekIndex
) => {
  const weeks = [];
  let currentDate = new Date(tglMulaiISO);
  const endDate = new Date(tglSelesaiISO);
  const logbookMap = new Map(
    logbooks.map((log) => [
      toISODateString(new Date(log.tanggal)),
      log.deskripsi,
    ])
  );

  while (currentDate <= endDate) {
    while (currentDate.getDay() !== 1 && currentDate <= endDate) {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    if (currentDate > endDate) break;

    const weekStartDate = new Date(currentDate.getTime());
    const weekDays = [];
    for (let i = 0; i < 5; i++) {
      const dayDate = new Date(currentDate.getTime());
      dayDate.setDate(dayDate.getDate() + i);
      if (dayDate > endDate) break;
      weekDays.push(dayDate);
    }

    if (weekDays.length > 0) {
      const weekEndDate = new Date(weekDays[weekDays.length - 1].getTime());
      weeks.push({
        startDateISO: toISODateString(weekStartDate),
        tanggalRange: formatWeekRange(weekStartDate, weekEndDate),
      });
    }
    currentDate.setDate(currentDate.getDate() + 7);
  }

  const thisWeek = weeks[weekIndex];
  if (!thisWeek) {
    return { weekRange: 'Minggu Tidak Ditemukan', days: [] };
  }

  const dayDataForWeek = [];
  const weekStartDate = new Date(thisWeek.startDateISO);

  for (let i = 0; i < 5; i++) {
    const dayDate = new Date(weekStartDate.getTime());
    dayDate.setDate(dayDate.getDate() + i);

    if (dayDate > endDate) break;

    const dayISO = toISODateString(dayDate);
    dayDataForWeek.push({
      hari: dayDate.toLocaleDateString('id-ID', { weekday: 'long' }),
      tanggal: dayDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      tanggalISO: dayISO,
      isi: logbookMap.get(dayISO) || '',
    });
  }

  return { weekRange: thisWeek.tanggalRange, days: dayDataForWeek };
};

export default function LaporanHarianForm() {
  const navigate = useNavigate();
  const { minggu, hari } = useParams();
  const weekIndex = parseInt(minggu, 10);

  const [hariData, setHariData] = useState([]);
  const [weekRange, setWeekRange] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [modalIndex, setModalIndex] = useState(null);
  const [modalContent, setModalContent] = useState('');
  const [showFullIndex, setShowFullIndex] = useState(null);

  useEffect(() => {
    if (isNaN(weekIndex)) {
      setError('Index minggu tidak valid');
      setIsLoading(false);
      return;
    }

    const fetchLogbookAndSetDays = async () => {
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
              'Cache-Control': 'no-store',
            },
            cache: 'no-store',
          }
        );

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || 'Gagal mengambil data logbook');
        }

        const res = await response.json();
        const { periode, logbooks } = res.data;

        const { weekRange, days } = generateWeekAndDayData(
          periode.tglMulai,
          periode.tglSelesai,
          logbooks,
          weekIndex
        );

        setHariData(days);
        setWeekRange(weekRange);
      } catch (err) {
        console.error('Error setting week data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogbookAndSetDays();
  }, [weekIndex]);

  const handleBack = () => navigate('/dashboard/laporan');

  const handleOpenModal = (index) => {
    setModalIndex(index);
    setModalContent(hariData[index].isi);
  };

  const handleSubmitApi = async () => {
    if (modalIndex === null) return;

    setIsSubmitting(true);
    setError(null);
    const token = localStorage.getItem('token'); // Pastikan key token sudah benar

    const dataToSend = {
      tanggal: hariData[modalIndex].tanggalISO,
      deskripsi: modalContent,
    };

    try {
      const response = await fetch(
        'http://localhost:3000/api/peserta/logbook', // Pastikan URL ini benar
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataToSend),
        }
      );

      const res = await response.json();
      if (!response.ok) {
        throw new Error(res.message || 'Gagal mengirim data');
      }
      setHariData((prevHariData) =>
        prevHariData.map((hari, index) => {
          if (index === modalIndex) {
            return { ...hari, isi: modalContent };
          }
          return hari;
        })
      );

      setModalIndex(null); // Tutup modal
      setModalContent('');
    } catch (err) {
      console.error('Error submitting logbook:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-6">Memuat data harian...</div>;
  }

  if (error && !isSubmitting) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  return (
    <>
      {/* Modal Input */}
      {modalIndex !== null && (
        <Modal onClose={() => setModalIndex(null)}>
          <h2 className="text-xl font-bold text-center">Laporan Harian</h2>
          <p className="text-center mb-4">
            {hariData[modalIndex].hari}, {hariData[modalIndex].tanggal}
          </p>
          <label className="block font-semibold text-gray-700 mb-2">
            Jelaskan kegiatanmu hari ini!
          </label>
          <textarea
            className="w-full h-40 border rounded p-3 text-sm mb-4"
            placeholder="Tips: Deskripsikan kegiatanmu hari ini"
            value={modalContent}
            onChange={(e) => setModalContent(e.target.value)}
          />
          {error && isSubmitting && (
            <p className="text-red-500 text-center mb-2">{error}</p>
          )}
          <div className="text-center">
            <button
              onClick={handleSubmitApi}
              className="bg-[#006DA6] text-white px-6 py-2 rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim'}
            </button>
          </div>
        </Modal>
      )}

      {/* Modal Detail */}
      {showFullIndex !== null && (
        <Modal onClose={() => setShowFullIndex(null)}>
          <h2 className="text-xl font-bold mb-2">
            {hariData[showFullIndex].hari}, {hariData[showFullIndex].tanggal}
          </h2>
          <hr className="my-6 border-t border-gray-200" />
          <p className="text-gray-800 whitespace-pre-line">
            {hariData[showFullIndex].isi}
          </p>
        </Modal>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 bg-white p-4 rounded shadow h-fit">
          <button
            onClick={handleBack}
            className="text-[#006DA6] flex items-center gap-1 mb-4 font-bold"
          >
            <span className="text-lg">←</span> Kembali
          </button>
          <p className="text-[#FF6B00] font-semibold mb-1">
            {hariData.every((h) => h.isi) ? '✅ Selesai' : '✏️ Belum Dibuat'}
          </p>
          <h2 className="text-lg font-bold">{weekRange}</h2>{' '}
          <hr className="my-4 border-t border-gray-300" />
          <div className="flex justify-between px-2">
            {hariData.map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-xs font-semibold">{item.hari[0]}</span>
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm ${
                    item.isi
                      ? 'bg-blue-500 text-white border-black border-2'
                      : 'bg-gray-200 text-gray-500 border-gray-500'
                  }`}
                >
                  {item.isi ? '✓' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Konten laporan */}
        <div className="flex-1 space-y-6">
          {hariData.map((item, i) => (
            <div key={i} className="bg-white p-6 rounded shadow">
              <div className="flex items-center gap-4 mb-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 text-sm font-bold ${
                    item.isi
                      ? 'bg-blue-500 text-white border-black'
                      : 'bg-gray-200 text-gray-500 border-gray-400'
                  }`}
                >
                  {item.isi ? '✓' : ''}
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-lg mb-1">{item.hari}</h3>
                  <p className="text-sm text-gray-600">{item.tanggal}</p>
                </div>
              </div>

              {item.isi ? (
                // --- Jika sudah terisi ---
                <>
                  <div>
                    <p className="text-gray-700 mb-2 line-clamp-2">
                      {item.isi}
                    </p>
                    {item.isi.length > 100 && (
                      <button
                        onClick={() => setShowFullIndex(i)}
                        className="text-[#006DA6] font-semibold text-sm mr-4"
                      >
                        selengkapnya
                      </button>
                    )}
                  </div>
                </>
              ) : (
                // --- Jika masih kosong ---
                <>
                  <hr className="border-t border-gray-200 w-full my-6" />
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleOpenModal(i)}
                      className="bg-[#006DA6] text-white px-6 py-2 rounded"
                    >
                      Buat Laporan Harian
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
