import { useState, useEffect, useCallback, useMemo } from 'react'; // Import useMemo

const formatTgl = (dateInput) => {
  if (!dateInput) return '-';
  try {
    const date = new Date(dateInput);
    // Validasi tanggal
    if (isNaN(date.getTime())) {
      return '-';
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Bulan dimulai dari 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (e) {
    console.error('Error formatting date:', e);
    return '-';
  }
};

const formatPeriode = (mulai, selesai) => {
  const mulaiStr = formatTgl(mulai);
  const selesaiStr = formatTgl(selesai);
  if (mulaiStr === '-' || selesaiStr === '-') return '-';
  return `${mulaiStr} - ${selesaiStr}`;
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'DITERIMA':
      return 'bg-green-100 text-green-800';
    case 'DITOLAK':
      return 'bg-red-100 text-red-800';
    case 'PENDING':
    case 'Diproses':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function ListUsulanMagang() {
  // === State Data & UI ===
  const [ajuanList, setAjuanList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // === State Filter ===
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [bidangFilter, setBidangFilter] = useState('');
  // const [tahun, setTahun] = useState('');

  // === State Pagination ===
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const ITEMS_PER_PAGE = 5;

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    console.log(
      `Fetching data for page: ${currentPage}, status: ${status}, bidang: ${bidangFilter}`
    ); // Log filter yang dikirim

    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });

      if (status) params.append('status', status);
      if (bidangFilter) params.append('bidang', bidangFilter);

      const response = await fetch(
        `http://localhost:3000/api/peserta/ajuan-magang`
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result.message || 'Gagal mengambil data usulan magang.'
        );
      }

      if (result.status && Array.isArray(result.data)) {
        setAjuanList(result.data);
        setTotalPages(result.pagination.totalPages);
      } else {
        throw new Error('Format data dari server tidak valid.');
      }
    } catch (err) {
      setError(err.message);
      setAjuanList([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, status, bidangFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- CLIENT-SIDE FILTERING (Hanya untuk Search) ---
  const filteredAjuanList = useMemo(() => {
    let list = ajuanList;

    if (search) {
      const searchTerm = search.toLowerCase();
      list = list.filter(
        (item) =>
          item.nama.toLowerCase().includes(searchTerm) ||
          (item.tema && item.tema.toLowerCase().includes(searchTerm))
      );
    }
    return list;
  }, [ajuanList, search]);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAjuanList.slice(startIndex, endIndex);
  }, [filteredAjuanList, currentPage]);

  useEffect(() => {
    const newTotalPages = Math.ceil(filteredAjuanList.length / ITEMS_PER_PAGE);
    setTotalPages(newTotalPages > 0 ? newTotalPages : 1); // minimal 1 halaman
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(1);
    } else if (filteredAjuanList.length === 0) {
      setCurrentPage(1);
    }
  }, [filteredAjuanList, currentPage]);

  // Handler Pagination
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // Handler Filter Change
  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    if (setter === setStatus || setter === setBidangFilter) {
      setCurrentPage(1);
    }
  };

  return (
    <section className="bg-[#F7FAFC] py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Judul */}
        <div className="text-center mb-6">
          <div className="w-36 h-1 mx-auto mt-4 mb-5 bg-[#006DA6] rounded-full" />
          <h2 className="text-2xl md:text-3xl font-normal text-[#002942]">
            <span className="text-[#006DA6] font-bold">List Usulan Magang</span>{' '}
            <span className="text-[#002942]">Yang Ada Saat Ini</span>
          </h2>
        </div>

        {/* Menampilkan Error */}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
            <button
              onClick={() => setError(null)}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <span className="text-xl">×</span>
            </button>
          </div>
        )}

        {/* Filter Input */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search (Client-side) */}
          <input
            type="text"
            placeholder="Cari nama atau tema..."
            value={search}
            onChange={handleFilterChange(setSearch)}
            className="flex-grow min-w-[15rem] px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-[#006DA6]"
          />

          {/* Bidang Filter (Server-side) */}
          <select
            value={bidangFilter}
            onChange={handleFilterChange(setBidangFilter)}
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006DA6]"
          >
            <option value="">Semua Bidang</option>
            <option value="Tata Kelola Informatika">
              Tata Kelola Informatika
            </option>
            <option value="Pengelolaan Informasi & Komunikasi Publik">
              Pengelolaan Informasi & Komunikasi Publik
            </option>
            <option value="Infrastruktur & Keamanan TIK">
              Infrastruktur & Keamanan TIK
            </option>
            <option value="Sekretariat">Sekretariat</option>
            <option value="Statistik">Statistik</option>
          </select>

          {/* Status Filter (Server-side) */}
          <select
            value={status}
            onChange={handleFilterChange(setStatus)}
            className="w-full md:w-auto min-w-[8rem] px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-[#006DA6]"
          >
            <option value="">Semua status</option>
            <option value="DITERIMA">Diterima</option>
            <option value="PENDING">Diproses</option>
            <option value="DITOLAK">Ditolak</option>
          </select>

          {/* Tahun Filter (Tetap nonaktif) */}
          <select
            className="w-full md:w-auto min-w-[10rem] px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-[#006DA6] disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled
            title="Filter tahun belum tersedia"
          >
            <option value="">Semua tahun</option>
          </select>
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gradient-to-r from-[#002942] to-[#006DA6] text-white">
              <tr>
                <th className="py-3 px-4 font-semibold">PESERTA MAGANG</th>
                <th className="py-3 px-4 font-semibold">TANGGAL PENGAJUAN</th>
                <th className="py-3 px-4 font-semibold">TEMA MAGANG</th>
                <th className="py-3 px-4 font-semibold">PERIODE MAGANG</th>
                <th className="py-3 px-4 font-semibold">BIDANG MAGANG</th>
                <th className="py-3 px-4 font-semibold text-center">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Loading State */}
              {isLoading && (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-gray-500">
                    Memuat data usulan...
                  </td>
                </tr>
              )}
              {/* Empty State (berdasarkan data paginasi) */}
              {!isLoading && paginatedData.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-gray-500">
                    Tidak ada data usulan magang yang cocok dengan filter Anda.
                  </td>
                </tr>
              )}
              {/* Data State (gunakan paginatedData) */}
              {!isLoading &&
                paginatedData.map(
                  (
                    item,
                    idx // Render dari paginatedData
                  ) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="py-3 px-4">{item.nama}</td>
                      <td className="py-3 px-4">{formatTgl(item.createdAt)}</td>
                      <td className="py-3 px-4">{item.tema || '-'}</td>
                      <td className="py-3 px-4">
                        {formatPeriode(item.tglMulai, item.tglSelesai)}
                      </td>
                      <td className="py-3 px-4">{item.bidang}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                            item.status
                          )}`}
                        >
                          {item.status === 'PENDING' ? 'Diproses' : item.status}
                        </span>
                      </td>
                    </tr>
                  )
                )}
            </tbody>
          </table>
        </div>

        {/* Pagination (menggunakan totalPages client-side) */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded text-sm ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-[#006DA6] text-white hover:opacity-90'
              }`}
            >
              Previous
            </button>
            <p className="text-sm text-gray-600">
              Halaman {currentPage} dari {totalPages}{' '}
              {/* totalPages dari state */}
            </p>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded text-sm ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-[#006DA6] text-white hover:opacity-90'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
