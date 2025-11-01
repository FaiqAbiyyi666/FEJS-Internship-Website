import { useEffect, useState } from 'react';
import { ClipboardList, FileText, Award, Star } from 'lucide-react';

function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl shadow ${className}`}>{children}</div>
  );
}
function CardContent({ children, className = '' }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

export default function PesertaDashboardHome() {
  const [profile, setProfile] = useState(null);

  const [statusUsulanData, setStatusUsulanData] = useState('');
  const [bidangUsulan, setBidangUsulan] = useState('');
  const [tanggalPengajuan, setTanggalPengajuan] = useState('');
  const [laporanProgress, setLaporanProgress] = useState(0);
  const [laporanAkhir, setLaporanAkhir] = useState('Belum disubmit');
  const [ulasan, setUlasan] = useState('Belum dikirim');
  const [sertifikat, setSertifikat] = useState('Belum terbit');

  const formatTanggal = (tanggal) => {
    if (!tanggal) return '';
    return new Date(tanggal).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!userId || !token) {
          console.error('User ID atau token tidak ditemukan');
          return;
        }

        const res = await fetch(
          `http://localhost:3000/api/peserta/profile/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        if (data.status) {
          setProfile(data.data);

          setStatusUsulanData(data.data.statusUsulan || '');
          setBidangUsulan(data.data.bidangUsulan || '');
          setTanggalPengajuan(data.data.tanggalPengajuan || '');
          setLaporanProgress(data.data.laporanProgress || 0);
          setLaporanAkhir(data.data.laporanAkhir || 'Belum disubmit');
          setUlasan(data.data.ulasan || 'Belum dikirim');
          setSertifikat(data.data.sertifikat || 'Belum terbit');
        } else {
          console.error('Gagal ambil profil:', data.message);
        }
      } catch (err) {
        console.error('Error fetch profile:', err);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return <div className="p-6 text-gray-600">Loading profil...</div>;
  }

  const statusUsulan =
    !bidangUsulan || !tanggalPengajuan
      ? 'Belum Mengajukan Usulan'
      : statusUsulanData;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent>
            <p className="text-sm font-bold text-black">Nama Lengkap</p>
            <p className="text-base font-medium text-gray-800">
              {profile.namaLengkap}
            </p>

            <p className="text-sm font-bold text-black mt-3">NIM / NIS</p>
            <p className="text-base font-medium text-gray-800">
              {profile.nimNis}
            </p>

            <p className="text-sm font-bold text-black mt-3">No Telepon</p>
            <p className="text-base font-medium text-gray-800">
              {profile.noTelepon}
            </p>

            <p className="text-sm font-bold text-black mt-3">Email</p>
            <p className="text-base font-medium text-gray-800">
              {profile.email}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <p className="text-sm font-bold text-black">Instansi</p>
            <p className="text-base font-medium text-gray-800">
              {profile.instansi}
            </p>

            <p className="text-sm font-bold text-black mt-3">Jurusan</p>
            <p className="text-base font-medium text-gray-800">
              {profile.jurusan}
            </p>

            <p className="text-sm font-bold text-black mt-3">Bidang Magang</p>
            <p className="text-base font-medium text-gray-800">
              {profile.bidang || '-'}
            </p>

            <p className="text-sm font-bold text-black mt-3">Periode Magang</p>
            <p className="text-base font-medium text-gray-800">
              {profile.periode
                ? `${formatTanggal(profile.periode.mulai)} – ${formatTanggal(
                    profile.periode.selesai
                  )}`
                : '-'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
            <ClipboardList size={24} />
          </div>

          <div className="flex-1">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-black">
                Status Usulan Magang
              </span>
              <span className="text-xs text-gray-500">
                {bidangUsulan
                  ? `Bidang: ${bidangUsulan}`
                  : 'Belum memilih bidang'}
              </span>
              <span className="text-xs text-gray-400">
                {tanggalPengajuan
                  ? `Diajukan pada ${formatTanggal(tanggalPengajuan)}`
                  : ''}
              </span>
            </div>
          </div>

          {(() => {
            const statusStyles = {
              'Belum Mengajukan Usulan': 'bg-gray-100 text-black',
              'Menunggu Persetujuan': 'bg-blue-100 text-blue-600',
              Diterima: 'bg-green-100 text-green-600',
              Ditolak: 'bg-red-100 text-red-600',
            };

            return (
              <span
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  statusStyles[statusUsulan] || 'bg-gray-100 text-black'
                }`}
              >
                {statusUsulan}
              </span>
            );
          })()}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-full">
            <FileText size={24} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-black">
                Progres Laporan Harian
              </span>
              <span className="text-sm font-medium text-gray-700">
                {laporanProgress}%
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-3 bg-green-500"
                style={{ width: `${laporanProgress}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex flex-col items-center text-center">
            <FileText className="text-blue-500 mb-2" size={28} />
            <p className="text-sm font-bold text-black">Laporan Akhir</p>
            <p className="text-base font-medium text-gray-800">
              {laporanAkhir}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center text-center">
            <Star className="text-yellow-500 mb-2" size={28} />
            <p className="text-sm font-bold text-black">Ulasan Magang</p>
            <p className="text-base font-medium text-gray-800">{ulasan}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center text-center">
            <Award className="text-indigo-500 mb-2" size={28} />
            <p className="text-sm font-bold text-black">Sertifikat</p>
            <p className="text-base font-medium text-gray-800">{sertifikat}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
