import { ClipboardList, FileText, Award, Star } from 'lucide-react';

// ✅ Card & CardContent sederhana
function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl shadow ${className}`}>{children}</div>
  );
}
function CardContent({ children, className = '' }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

export default function PesertaDashboardHome() {
  // Dummy data (nanti ganti dari backend)
  const profile = {
    nama: 'Muhammad Faiq Al Abiyyi',
    nim: '21082010203',
    telp: '081259123456',
    email: 'faiqabiyyi@gmail.com',
    instansi: 'UPN Veteran Jawa Timur',
    jurusan: 'Sistem Informasi',
    bidang: 'Tata Kelola Informatika',
    periode: '01/03/2025 – 01/04/2025',
  };

  // Data dummy
  const statusUsulanData = 'Ditolak';
  const bidangUsulan = '';
  const tanggalPengajuan = ''; // format YYYY-MM-DD
  const laporanProgress = 65; // %
  const laporanAkhir = 'Belum disubmit';
  const ulasan = 'Belum dikirim';
  const sertifikat = 'Belum terbit';

  // Format tanggal lokal (Indonesia)
  const formatTanggal = (tanggal) => {
    if (!tanggal) return '';
    return new Date(tanggal).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Pengecekan Status Usulan
  const statusUsulan =
    !bidangUsulan || !tanggalPengajuan
      ? 'Belum Mengajukan Usulan'
      : statusUsulanData;

  return (
    <div className="space-y-6">
      {/* ====== Profil ====== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent>
            <p className="text-sm font-semibold text-gray-600">Nama Lengkap</p>
            <p className="text-base font-medium text-gray-800">
              {profile.nama}
            </p>

            <p className="text-sm font-semibold text-gray-600 mt-3">
              NIM / NIS
            </p>
            <p className="text-base font-medium text-gray-800">{profile.nim}</p>

            <p className="text-sm font-semibold text-gray-600 mt-3">
              No Telepon
            </p>
            <p className="text-base font-medium text-gray-800">
              {profile.telp}
            </p>

            <p className="text-sm font-semibold text-gray-600 mt-3">Email</p>
            <p className="text-base font-medium text-gray-800">
              {profile.email}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <p className="text-sm font-semibold text-gray-600">Instansi</p>
            <p className="text-base font-medium text-gray-800">
              {profile.instansi}
            </p>

            <p className="text-sm font-semibold text-gray-600 mt-3">Jurusan</p>
            <p className="text-base font-medium text-gray-800">
              {profile.jurusan}
            </p>

            <p className="text-sm font-semibold text-gray-600 mt-3">
              Bidang Magang
            </p>
            <p className="text-base font-medium text-gray-800">
              {profile.bidang}
            </p>

            <p className="text-sm font-semibold text-gray-600 mt-3">
              Periode Magang
            </p>
            <p className="text-base font-medium text-gray-800">
              {profile.periode}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ====== Status Usulan Magang ====== */}
      <Card>
        <CardContent className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
            <ClipboardList size={24} />
          </div>

          <div className="flex-1">
            {/* Judul + Detail Bidang & Tanggal */}
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-600">
                Status Usulan Magang
              </span>
              <span className="text-xs text-gray-500">
                {bidangUsulan
                  ? `Bidang: ${bidangUsulan}`
                  : 'Belum memilih bidang'}
              </span>
              <span className="text-xs text-gray-400">
                {tanggalPengajuan ? `Diajukan pada ${tanggalPengajuan}` : ''}
              </span>
            </div>
          </div>

          {/* Status Badge */}
          {(() => {
            const statusStyles = {
              'Belum Mengajukan Usulan': 'bg-gray-100 text-gray-600',
              'Menunggu Persetujuan': 'bg-blue-100 text-blue-600',
              Diterima: 'bg-green-100 text-green-600',
              Ditolak: 'bg-red-100 text-red-600',
            };

            return (
              <span
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  statusStyles[statusUsulan] || 'bg-gray-100 text-gray-600'
                }`}
              >
                {statusUsulan}
              </span>
            );
          })()}
        </CardContent>
      </Card>

      {/* ====== Progress Laporan Harian ====== */}
      <Card>
        <CardContent className="flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-full">
            <FileText size={24} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-600">
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

      {/* ====== Kotak Ringkas ====== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex flex-col items-center text-center">
            <FileText className="text-blue-500 mb-2" size={28} />
            <p className="text-sm font-semibold text-gray-600">Laporan Akhir</p>
            <p className="text-base font-medium text-gray-800">
              {laporanAkhir}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center text-center">
            <Star className="text-yellow-500 mb-2" size={28} />
            <p className="text-sm font-semibold text-gray-600">Ulasan Magang</p>
            <p className="text-base font-medium text-gray-800">{ulasan}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center text-center">
            <Award className="text-indigo-500 mb-2" size={28} />
            <p className="text-sm font-semibold text-gray-600">Sertifikat</p>
            <p className="text-base font-medium text-gray-800">{sertifikat}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
