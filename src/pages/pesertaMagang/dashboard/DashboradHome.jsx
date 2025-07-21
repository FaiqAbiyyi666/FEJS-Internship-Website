import {
  FaFileAlt,
  FaCheckCircle,
  FaBell,
  FaCloudUploadAlt,
  FaCertificate,
} from 'react-icons/fa';

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <h2 className="text-xl font-bold text-gray-800">
          Selamat Datang di SIMAGANG!
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          Berikut ringkasan informasi magangmu di Diskominfo Kabupaten Sidoarjo.
        </p>
      </div>

      {/* Status Ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-lg shadow flex items-center space-x-4">
          <FaFileAlt className="text-blue-600 text-3xl" />
          <div>
            <p className="text-gray-700 text-sm">Status Pendaftaran</p>
            <h3 className="font-semibold text-lg text-green-600">Diterima</h3>
            <p className="text-xs text-gray-500">Bidang: Pemrograman Web</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow flex items-center space-x-4">
          <FaCloudUploadAlt className="text-indigo-600 text-3xl" />
          <div>
            <p className="text-gray-700 text-sm">Laporan Harian</p>
            <h3 className="font-semibold text-lg text-gray-800">
              12 / 20 Hari
            </h3>
            <p className="text-xs text-gray-500">Tingkat penyelesaian 60%</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: '60%' }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow flex items-center space-x-4">
          <FaCertificate className="text-yellow-600 text-3xl" />
          <div>
            <p className="text-gray-700 text-sm">Sertifikat</p>
            <h3 className="font-semibold text-lg text-gray-800">
              Belum Tersedia
            </h3>
            <p className="text-xs text-gray-500">
              Akan diterbitkan setelah laporan selesai
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow flex items-center space-x-4">
          <FaCheckCircle className="text-green-600 text-3xl" />
          <div>
            <p className="text-gray-700 text-sm">Laporan Akhir</p>
            <h3 className="font-semibold text-lg text-gray-800">
              Sudah Diunggah
            </h3>
            <p className="text-xs text-gray-500">
              Cek kembali sebelum deadline
            </p>
          </div>
        </div>
      </div>

      {/* Notifikasi */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center space-x-2 mb-3">
          <FaBell className="text-red-500" />
          <h3 className="text-lg font-semibold text-gray-800">Notifikasi</h3>
        </div>
        <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
          <li>Laporan minggu ke-2 belum lengkap.</li>
          <li>Pengumpulan laporan akhir paling lambat 25 Juli 2025.</li>
          <li>Penyerahan sertifikat akan dimulai 5 Agustus 2025.</li>
        </ul>
      </div>
    </div>
  );
}
