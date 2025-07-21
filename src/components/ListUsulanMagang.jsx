import { useState } from 'react';
import { Eye } from 'react-feather'; // react-icons alternatif: import { FaEye } from 'react-icons/fa';

const usulanData = [
  {
    nama: 'Joko Widodo',
    tanggal: '30/09/2026',
    tema: 'Teknologi Informasi',
    periode: '30/11/2026 - 30/12/2026',
    posisi: 'Tata Kelola Informatika',
    status: 'Diterima',
  },
  {
    nama: 'Gibran FufuFafa',
    tanggal: '13/06/2026',
    tema: 'Statistika',
    periode: '25/07/2026 - 25/08/2026',
    posisi: 'Statistik',
    status: 'Diterima',
  },
  {
    nama: 'Susi Susanti',
    tanggal: '02/01/2025',
    tema: 'Komunikasi',
    periode: '01/03/2025 - 01/04/2025',
    posisi: 'Humas',
    status: 'Diproses',
  },
  {
    nama: 'Andi Wijaya',
    tanggal: '15/04/2025',
    tema: 'Teknik Informatika',
    periode: '01/06/2025 - 01/07/2025',
    posisi: 'Pemrograman Web',
    status: 'Ditolak',
  },
  {
    nama: 'Budi Santoso',
    tanggal: '10/05/2025',
    tema: 'Data Science',
    periode: '01/07/2025 - 01/08/2025',
    posisi: 'Analisis Data',
    status: 'Diproses',
  },
  {
    nama: 'Dewi Lestari',
    tanggal: '18/06/2025',
    tema: 'Desain Grafis',
    periode: '15/07/2025 - 15/08/2025',
    posisi: 'Desainer UI/UX',
    status: 'Diterima',
  },
  {
    nama: 'Fajar Pratama',
    tanggal: '22/07/2025',
    tema: 'Jaringan Komputer',
    periode: '01/08/2025 - 01/09/2025',
    posisi: 'Network Engineer',
    status: 'Diproses',
  },
  {
    nama: 'Intan Permata',
    tanggal: '05/08/2025',
    tema: 'Sistem Informasi',
    periode: '10/09/2025 - 10/10/2025',
    posisi: 'Manajemen Sistem',
    status: 'Ditolak',
  },
  {
    nama: 'Gilang Ramadhan',
    tanggal: '12/09/2025',
    tema: 'Keamanan Siber',
    periode: '15/10/2025 - 15/11/2025',
    posisi: 'Cybersecurity',
    status: 'Diterima',
  },
  {
    nama: 'Lisa Marlina',
    tanggal: '20/10/2025',
    tema: 'Data Mining',
    periode: '01/11/2025 - 01/12/2025',
    posisi: 'Penambangan Data',
    status: 'Diterima',
  },
  {
    nama: 'Tommy Sihotang',
    tanggal: '30/10/2025',
    tema: 'AI',
    periode: '05/12/2025 - 05/01/2026',
    posisi: 'AI Engineer',
    status: 'Diproses',
  },
  {
    nama: 'Putri Anggraini',
    tanggal: '05/11/2025',
    tema: 'Multimedia',
    periode: '15/01/2026 - 15/02/2026',
    posisi: 'Multimedia Editor',
    status: 'Ditolak',
  },
];

export default function ListUsulanMagang() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [tahun, setTahun] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredData = usulanData.filter((item) => {
    const matchSearch =
      item.tema.toLowerCase().includes(search.toLowerCase()) ||
      item.posisi.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status ? item.status === status : true;
    const matchTahun = tahun ? item.periode.includes(tahun) : true;
    return matchSearch && matchStatus && matchTahun;
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
          <input
            type="text"
            placeholder="Cari posisi magang"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-1/3 px-4 py-2 border rounded shadow-sm"
          />
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-1/3 px-4 py-2 border rounded shadow-sm"
          >
            <option value="">Semua status</option>
            <option value="Diterima">Diterima</option>
            <option value="Diproses">Diproses</option>
            <option value="Ditolak">Ditolak</option>
          </select>
          <select
            value={tahun}
            onChange={(e) => {
              setTahun(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-1/3 px-4 py-2 border rounded shadow-sm"
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
                <th className="py-3 px-4 font-semibold">POSISI MAGANG</th>
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
                    <td className="py-3 px-4">{item.posisi}</td>
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
