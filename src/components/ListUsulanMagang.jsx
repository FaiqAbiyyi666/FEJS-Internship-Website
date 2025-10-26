import { useState } from 'react';
import { Eye } from 'react-feather'; // react-icons alternatif: import { FaEye } from 'react-icons/fa';

const usulanData = [
  {
    nama: 'Joko Widodo',
    tanggal: '30/09/2026',
    tema: 'Pengembangan aplikasi internal',
    periode: '30/11/2026 - 30/12/2026',
    bidang: 'Tata Kelola Informatika',
    status: 'Diterima',
  },
  {
    nama: 'Gibran FufuFafa',
    tanggal: '13/06/2026',
    tema: 'Analisis big data',
    periode: '25/07/2026 - 25/08/2026',
    bidang: 'Statistik',
    status: 'Diterima',
  },
  {
    nama: 'Susi Susanti',
    tanggal: '02/01/2025',
    tema: 'Efektivitas media sosial',
    periode: '01/03/2025 - 01/04/2025',
    bidang: 'Pengelolaan Informasi & Komunikasi Publik',
    status: 'Diproses',
  },
  {
    nama: 'Andi Wijaya',
    tanggal: '15/04/2025',
    tema: 'Keamanan jaringan',
    periode: '01/06/2025 - 01/07/2025',
    bidang: 'Infrastruktur & Keamanan TIK',
    status: 'Ditolak',
  },
  {
    nama: 'Budi Santoso',
    tanggal: '10/05/2025',
    tema: 'Manajemen arsip digital',
    periode: '01/07/2025 - 01/08/2025',
    bidang: 'Sekretariat',
    status: 'Diproses',
  },
  {
    nama: 'Dewi Lestari',
    tanggal: '18/06/2025',
    tema: 'Visualisasi data interaktif',
    periode: '15/07/2025 - 15/08/2025',
    bidang: 'Statistik',
    status: 'Diterima',
  },
  {
    nama: 'Fajar Pratama',
    tanggal: '22/07/2025',
    tema: 'Pemanfaatan cloud pada sistem',
    periode: '01/08/2025 - 01/09/2025',
    bidang: 'Infrastruktur & Keamanan TIK',
    status: 'Diproses',
  },
  {
    nama: 'Intan Permata',
    tanggal: '05/08/2025',
    tema: 'Strategi konten publik',
    periode: '10/09/2025 - 10/10/2025',
    bidang: 'Pengelolaan Informasi & Komunikasi Publik',
    status: 'Ditolak',
  },
  {
    nama: 'Gilang Ramadhan',
    tanggal: '12/09/2025',
    tema: 'Manajemen sistem surat elektronik',
    periode: '15/10/2025 - 15/11/2025',
    bidang: 'Sekretariat',
    status: 'Diterima',
  },
];

export default function ListUsulanMagang() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [bidangFilter, setBidangFilter] = useState('all');
  const [tahun, setTahun] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredData = usulanData.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.tema.toLowerCase().includes(search.toLowerCase());
    const matchesBidang =
      bidangFilter === 'all' ||
      item.bidang.toLowerCase() === bidangFilter.toLowerCase();
    const matchStatus = status ? item.status === status : true;
    const matchTahun = tahun ? item.periode.includes(tahun) : true;
    return matchSearch && matchesBidang && matchStatus && matchTahun;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

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

        {/* Filter Input */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search diperpanjang */}
          <input
            type="text"
            placeholder="Cari berdasarkan nama atau tema magang..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-grow min-w-[20rem] px-4 py-2 border rounded shadow-sm"
          />

          {/* Bidang Filter */}
          <select
            value={bidangFilter}
            onChange={(e) => setBidangFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-[#006DA6] focus:border-transparent"
          >
            <option value="all">Semua Bidang</option>
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

          {/* Status diperkecil */}
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="w-auto min-w-[8rem] px-4 py-2 border rounded shadow-sm"
          >
            <option value="">Semua status</option>
            <option value="Diterima">Diterima</option>
            <option value="Diproses">Diproses</option>
            <option value="Ditolak">Ditolak</option>
          </select>

          {/* Tahun tetap sedang */}
          <select
            value={tahun}
            onChange={(e) => {
              setTahun(e.target.value);
              setCurrentPage(1);
            }}
            className="w-auto min-w-[10rem] px-4 py-2 border rounded shadow-sm"
          >
            <option value="">Semua tahun</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gradient-to-r from-[#002942] to-[#006DA6] text-white">
              <tr>
                <th className="py-3 px-4 font-semibold">PESERTA MAGANG</th>
                <th className="py-3 px-4 font-semibold">TANGGAL PENGAJUAN</th>
                <th className="py-3 px-4 font-semibold">TEMA MAGANG</th>
                <th className="py-3 px-4 font-semibold">PERIODE MAGANG</th>
                <th className="py-3 px-4 font-semibold">BIDANG MAGANG</th>
                <th className="py-3 px-4 font-semibold">STATUS</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-4 text-center text-gray-500">
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-4">{item.nama}</td>
                    <td className="py-3 px-4">{item.tanggal}</td>
                    <td className="py-3 px-4">{item.tema}</td>
                    <td className="py-3 px-4">{item.periode}</td>
                    <td className="py-3 px-4">{item.bidang}</td>
                    <td className="py-3 px-4">{item.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-[#006DA6] text-white hover:opacity-90'
              }`}
            >
              Previous
            </button>
            <p className="text-sm text-gray-600">
              Halaman {currentPage} dari {totalPages}
            </p>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages
                  ? 'bg-gray-300 cursor-not-allowed'
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
