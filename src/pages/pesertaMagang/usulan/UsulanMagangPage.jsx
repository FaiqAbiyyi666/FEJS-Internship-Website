import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../../src/components/navigations/Navbar';

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Helper function untuk memformat periode
 */
const formatPeriode = (tglMulai, tglSelesai) => {
  if (!tglMulai || !tglSelesai) return '-';
  const mulai = new Date(tglMulai).toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });
  const selesai = new Date(tglSelesai).toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });
  if (mulai === selesai) return mulai;
  return `${mulai} - ${selesai}`;
};

/**
 * Helper function untuk memetakan status
 */
const getStatusBadge = (status) => {
  switch (status) {
    case 'DITERIMA':
    case 'APPROVED': // (Menangani kedua kemungkinan)
      return 'bg-green-100 text-green-800';
    case 'DITOLAK':
    case 'REJECTED': // (Menangani kedua kemungkinan)
      return 'bg-red-100 text-red-800';
    case 'PENDING':
    default:
      return 'bg-yellow-100 text-yellow-800';
  }
};

export default function UsulanMagangPage() {
  const navigate = useNavigate();
  const [usulanMagang, setUsulanMagang] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsulanMagang = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 1. Ambil token dari localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Anda harus login untuk melihat data ini.');
        }

        // 2. Panggil endpoint backend (sesuai router: /api/ajuan/saya)
        const response = await fetch(
          'http://localhost:3000/api/peserta/ajuan-magang',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || 'Gagal mengambil data usulan.');
        }

        const result = await response.json();

        if (result.status && Array.isArray(result.data)) {
          // 3. Transformasi data backend ke format frontend
          const transformedData = result.data.map((item) => ({
            id: item.id, // ID dari AjuanMagang (untuk detail)
            tanggal: formatDate(item.createdAt),
            tema: item.temaMagang,
            periode: formatPeriode(item.tglMulai, item.tglSelesai),
            bidang: item.bidang?.nama || 'N/A', // 'bidang.nama' dari include
            status: item.statusUsulan, // PENDING, DITERIMA, DITOLAK
          }));
          setUsulanMagang(transformedData);
        } else {
          throw new Error(result.message || 'Format data dari server salah.');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching usulan magang:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsulanMagang();
  }, []);

  return (
    <>
      <Navbar />
      <div className="pt-[100px] min-h-screen bg-[#F5F7FA] px-6">
        <div className="max-w-6xl mx-auto py-10">
          <h1 className="text-center text-2xl font-extrabold bg-gradient-to-r from-[#002942] to-[#006DA6] bg-clip-text text-transparent mb-8">
            Usulan Magang
          </h1>

          <div className="mb-6">
            <button
              onClick={() => navigate('/pengajuan-magang/formulir')} // Arahkan ke step pertama
              className="bg-[#006DA6] hover:bg-[#0093DD] text-white font-medium px-5 py-2 rounded-lg shadow inline-flex items-center gap-2"
            >
              <span className="text-xl font-bold">＋</span> Daftar Magang
            </button>
          </div>

          <div className="bg-white border rounded-lg shadow overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-[#006DA6] border-b font-semibold text-white">
                <tr>
                  <th className="px-6 py-3">TANGGAL PENGAJUAN</th>
                  <th className="px-6 py-3">TEMA MAGANG</th>
                  <th className="px-6 py-3">PERIODE MAGANG</th>
                  <th className="px-6 py-3">BIDANG</th>
                  <th className="px-6 py-3">STATUS</th>
                  <th className="px-6 py-3">AKSI</th>
                </tr>
              </thead>
              <tbody className="text-left">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      Memuat data usulan magang...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-10 text-center text-red-600"
                    >
                      Error: {error}
                    </td>
                  </tr>
                ) : usulanMagang.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      Anda belum memiliki usulan magang.
                    </td>
                  </tr>
                ) : (
                  usulanMagang.map((item) => (
                    <tr key={item.id} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4">{item.tanggal}</td>
                      <td className="px-6 py-4">{item.tema}</td>
                      <td className="px-6 py-4">{item.periode}</td>
                      <td className="px-6 py-4">{item.bidang}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => navigate(`/usulan/detail/${item.id}`)}
                          className="text-blue-600 hover:underline"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
