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

const formatPeriode = (tglMulai, tglSelesai) => {
  if (!tglMulai || !tglSelesai) return '-';

  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };

  const mulai = new Date(tglMulai)
    .toLocaleDateString('id-ID', options)
    .replace(/\//g, '-');
  const selesai = new Date(tglSelesai)
    .toLocaleDateString('id-ID', options)
    .replace(/\//g, '-');

  if (mulai === selesai) return mulai;
  return `${mulai} sampai ${selesai}`;
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'DITERIMA':
    case 'APPROVED':
      return 'bg-green-100 text-green-800';
    case 'DITOLAK':
    case 'REJECTED':
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
  const [canApply, setCanApply] = useState(false);

  useEffect(() => {
    const fetchUsulanMagang = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Anda harus login untuk melihat data ini.');
        }
        const response = await fetch(
          `http://localhost:3000/api/peserta/ajuan-magang-saya`,
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

        console.log('Raw data from backend:', result.data);

        if (result.status && Array.isArray(result.data)) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const hasBlockingAjuan = result.data.some((item) => {
            if (item.statusUsulan === 'PENDING') {
              return true;
            }
            if (item.statusUsulan === 'APPROVED') {
              const endDate = new Date(item.tglSelesai);
              return endDate >= today;
            }
            return false;
          });

          setCanApply(!hasBlockingAjuan);

          const transformedData = result.data.map((item) => ({
            id: item.id,
            tanggal: formatDate(item.createdAt),
            tema: item.temaMagang,
            periode: formatPeriode(item.tglMulai, item.tglSelesai),
            bidang: item.bidang?.nama || 'N/A',
            status: item.statusUsulan,
          }));
          console.log('Transformed data being set to state:', transformedData);
          setUsulanMagang(transformedData);
        } else {
          setCanApply(true);
          throw new Error(result.message || 'Format data dari server salah.');
        }
      } catch (err) {
        setError(err.message);
        setCanApply(false);
        console.error('Error fetching usulan magang:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsulanMagang();
  }, []);

  const getButtonTitle = () => {
    if (isLoading) {
      return 'Sedang memverifikasi status ajuan...';
    }
    if (!canApply) {
      return 'Anda sudah memiliki ajuan yang sedang diproses atau sedang dalam periode magang.';
    }
    return 'Ajukan pendaftaran magang baru';
  };

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
              onClick={() => navigate('/pengajuan-magang/formulir')}
              className="bg-[#006DA6] hover:bg-[#0093DD] text-white font-medium px-5 py-2 rounded-lg shadow inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !canApply}
              title={getButtonTitle()}
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
                          onClick={() => {
                            console.log('Button clicked, item.id is:', item.id);
                            navigate(`/usulan/detail/${item.id}`);
                          }}
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
