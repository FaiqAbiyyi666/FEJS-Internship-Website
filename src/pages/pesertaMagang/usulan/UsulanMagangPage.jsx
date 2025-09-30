import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../../src/components/navigations/Navbar';

export default function UsulanMagangPage() {
  const navigate = useNavigate();

  const [usulanMagang, setUsulanMagang] = useState([
    {
      id: 'MAG-202507001',
      tanggal: '2025-07-01',
      tema: 'Penerapan Sistem Informasi Manajemen',
      periode: 'Agustus - November 2025',
      bidang: 'Pemrograman Web',
      status: 'Menunggu',
    },
    {
      id: 'MAG-202507002',
      tanggal: '2025-07-05',
      tema: 'Analisis Keamanan Jaringan',
      periode: 'Agustus - Desember 2025',
      bidang: 'Jaringan Komputer',
      status: 'Ditolak',
    },
    {
      id: 'MAG-202507003',
      tanggal: '2025-07-10',
      tema: 'Pengembangan Aplikasi Tiket Online',
      periode: 'September - Desember 2025',
      bidang: 'Pengembangan Aplikasi',
      status: 'Diterima',
    },
  ]);

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
              onClick={() => navigate('/pengajuan-magang')}
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
                {usulanMagang.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-10 text-gray-500">
                      Tidak ada usulan magang
                    </td>
                  </tr>
                ) : (
                  usulanMagang.map((item, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4">{item.tanggal}</td>
                      <td className="px-6 py-4">{item.tema}</td>
                      <td className="px-6 py-4">{item.periode}</td>
                      <td className="px-6 py-4">{item.bidang}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.status === 'Menunggu'
                              ? 'bg-yellow-100 text-yellow-800'
                              : item.status === 'Diterima'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
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
