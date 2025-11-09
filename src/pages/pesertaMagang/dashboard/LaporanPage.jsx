import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { LaporanContext } from './LaporanContext';
import { Plus, X } from 'lucide-react';
import Modal from 'react-modal';

import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import 'datatables.net-dt/css/dataTables.dataTables.css';

DataTable.use(DT);
Modal.setAppElement('#root');

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
    while (currentDate.getDay() !== 1 && currentDate <= endDate) {
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (currentDate > endDate) break;

    const weekStartDate = new Date(currentDate.getTime());
    const weekDays = [];

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(currentDate.getTime());
      dayDate.setDate(dayDate.getDate() + i);

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
      const weekEndDate = new Date(weekDays[weekDays.length - 1].date);
      weeks.push({
        id: toISODateString(weekStartDate),
        tanggal: formatWeekRange(weekStartDate, weekEndDate),
        days: weekDays.map((d) => d.dayName),
        isi: weekDays.map((d) => d.isFilled),
      });
    }

    currentDate.setDate(currentDate.getDate() + 7);
  }

  return weeks;
};

export default function LaporanPage() {
  const navigate = useNavigate();
  const { uploadHistory } = useContext(LaporanContext);
  const [latestSubmission, setLatestSubmission] = useState(null);

  // --- State untuk Laporan Harian (Logbook) ---
  const [logbooks, setLogbooks] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- State untuk Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState(null);

  // --- State untuk Form di Modal ---
  const [tanggal, setTanggal] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [deskripsi, setDeskripsi] = useState('');
  const [fileBukti, setFileBukti] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Otentikasi dibutuhkan. Silakan login kembali.');
      setIsLoading(false);
      return;
    }

    // 1. Fungsi untuk fetch logbook
    const fetchLogbookData = async () => {
      try {
        const response = await fetch(
          'http://localhost:3000/api/peserta/logbook',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || 'Gagal mengambil data logbook');
        }
        const res = await response.json();

        const { periode, logbooks } = res.data;
        setLogbooks(logbooks); // Set data untuk DataTable

        if (periode) {
          const weeks = generateWeeklyStructure(
            periode.tglMulai,
            periode.tglSelesai,
            logbooks
          );
          setWeeklyData(weeks);
        }
      } catch (err) {
        console.error('Error fetching logbook data:', err);
        setError((prevError) => prevError || err.message); // Hanya set error jika belum ada
      }
    };

    // 2. Fungsi untuk fetch status laporan akhir
    const fetchLaporanHistory = async () => {
      try {
        const response = await fetch(
          'http://localhost:3000/api/peserta/laporan-akhir/history',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(
            errData.msg || 'Gagal mengambil riwayat laporan akhir'
          );
        }
        const history = await response.json();
        if (history.length > 0) {
          setLatestSubmission(history[0]); // Simpan hanya laporan terbaru
        }
      } catch (err) {
        console.error('Error fetching laporan history:', err);
        setError((prevError) => prevError || err.message);
      }
    };

    // 3. Panggil kedua fungsi
    const loadAllData = async () => {
      setIsLoading(true);
      setError(null);
      // Menjalankan kedua fetch secara paralel
      await Promise.all([fetchLogbookData(), fetchLaporanHistory()]);
      setIsLoading(false);
    };

    loadAllData();
  }, []);

  const handleNavigateUpload = () => {
    navigate('/dashboard/unggah-laporan-akhir');
  };

  const handleOpenModal = () => {
    // Reset form
    setTanggal(new Date().toISOString().split('T')[0]);
    setDeskripsi('');
    setFileBukti(null);
    setModalError(null);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => setIsModalOpen(false);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileBukti(e.target.files[0]);
    } else {
      setFileBukti(null);
    }
  };

  // --- Fungsi Submit Form Modal ---
  const handleSubmitLogbook = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setModalError(null);

    const formData = new FormData();
    formData.append('tanggal', tanggal);
    formData.append('deskripsi', deskripsi);

    if (fileBukti) {
      formData.append('logbookFile', fileBukti);
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        'http://localhost:3000/api/peserta/logbook',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const res = await response.json();
      if (!response.ok) {
        throw new Error(res.message || 'Gagal menyimpan logbook');
      }

      await fetchLogbookData();
      handleCloseModal();
    } catch (err) {
      console.error('Error submitting logbook:', err);
      setModalError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      title: 'Tanggal Laporan',
      data: 'tanggal',
      render: (data) =>
        new Date(data).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
    },
    {
      title: 'Deskripsi Kegiatan',
      data: 'deskripsi', //
      render: (data) =>
        `<div class="line-clamp-2" title="${data}">${data}</div>`,
    },
    {
      title: 'File Bukti',
      data: 'logbookFile',
      render: (data) => {
        if (!data) return '<span class="text-gray-400">Tidak ada</span>';
        return `<a href="${data}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">Lihat Bukti</a>`;
      },
    },
    {
      title: 'Tanggal Pengiriman',
      data: 'createdAt',
      render: (data) =>
        new Date(data).toLocaleString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
    },
  ];

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

      <div className="bg-white p-6 rounded shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Laporan Harian</h3>
          <button
            onClick={handleOpenModal}
            disabled={
              isLoading || (error && error.includes('tidak memiliki ajuan'))
            }
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 
                 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Plus size={18} />
            Tambah Laporan Harian
          </button>
        </div>

        {isLoading && (
          <p className="text-center text-gray-500 py-4">
            Memuat data logbook...
          </p>
        )}

        {error &&
          (error.includes('tidak memiliki ajuan') ? (
            <div className="text-center text-gray-500 py-10">
              <p className="font-semibold">
                Kamu belum memiliki ajuan magang yang disetujui.
              </p>
              <p className="text-sm mt-2">
                Silakan daftar magang terlebih dahulu untuk mengisi laporan
                harian.
              </p>
            </div>
          ) : (
            <p className="text-red-600 p-4 text-center">Error: {error}</p>
          ))}

        {!isLoading && !error && (
          <DataTable
            data={logbooks}
            columns={columns}
            options={{
              destroy: true,
              paging: true,
              searching: true,
              ordering: true,
              order: [[3, 'desc']],
              language: {
                search: 'Cari:',
                lengthMenu: 'Tampilkan _MENU_ entri',
                info: 'Menampilkan _START_ sampai _END_ dari _TOTAL_ entri',
                paginate: {
                  first: 'Pertama',
                  last: 'Terakhir',
                  next: 'Berikutnya',
                  previous: 'Sebelumnya',
                },
                emptyTable: 'Tidak ada data logbook',
              },
            }}
          />
        )}
      </div>

      {/* --- Modal Tambah Laporan --- */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Tambah Laporan Harian"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            border: 'none',
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '500px',
            width: '100%',
          },
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Tambah Aktivitas Harian</h2>
          <button
            onClick={handleCloseModal}
            className="text-gray-500 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmitLogbook} className="space-y-4">
          <div>
            <label
              htmlFor="tanggal"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tanggal Laporan
            </label>
            <input
              type="date"
              id="tanggal"
              name="tanggal"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006DA6]"
              required
            />
          </div>
          <div>
            <label
              htmlFor="deskripsi"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Deskripsi Kegiatan
            </label>
            <textarea
              id="deskripsi"
              name="deskripsi"
              rows={5}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006DA6]"
              placeholder="Jelaskan kegiatan yang Anda lakukan hari ini..."
              required
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="logbookFile"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              File Bukti Kegiatan (Ukuran File harus dibawah 5MB)
            </label>
            <input
              type="file"
              id="logbookFile"
              name="logbookFile" // ⬅️ Pastikan 'name' ini ada dan sama dengan di middleware
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-lg file:border-0
                         file:text-sm file:font-semibold
                         file:bg-[#BFDCFF] file:text-[#006DA6]
                         hover:file:bg-[#a0caff]"
            />
          </div>

          {modalError && <p className="text-sm text-red-600">{modalError}</p>}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#006DA6] text-white rounded-lg hover:bg-[#005080] disabled:bg-gray-400"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
