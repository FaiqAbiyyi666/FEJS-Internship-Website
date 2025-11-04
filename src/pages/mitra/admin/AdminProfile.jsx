import React, { useState, useEffect } from 'react';
import { Mail, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

// Fungsi helper sederhana untuk memformat tanggal
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  } catch (e) {
    return dateString;
  }
};

const AdminProfile = () => {
  // State untuk data profil (diambil dari API)
  const [formData, setFormData] = useState({
    nama: 'Memuat...',
    email: 'Memuat...',
    bidang: 'Memuat...',
    tanggalBergabung: 'Memuat...',
  });

  // State untuk form ubah password
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- 1. Mengambil Data Profil Saat Halaman Dimuat ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Asumsi token disimpan di localStorage. Sesuaikan jika perlu.
        const token = localStorage.getItem('token');

        // Memanggil API yang Anda tentukan di routes
        const response = await axios.get(
          'http://localhost:3000/api/admin/profile',
          {
            headers: {
              Authorization: `Bearer ${token}`, // Kirim token untuk middleware
            },
          }
        );

        const data = response.data;

        // Mengisi state dengan data dari controller
        setFormData({
          nama: data.nama,
          email: data.email,
          // Menampilkan nama bidang, atau 'Super Admin' jika bidang null
          bidang: data.bidang ? data.bidang.nama : 'Super Admin',
          tanggalBergabung: formatDate(data.tanggalBergabung),
        });
      } catch (error) {
        console.error('Gagal mengambil profil:', error);
        setFormData({
          nama: 'Gagal memuat',
          email: 'Gagal memuat',
          bidang: 'Gagal memuat',
          tanggalBergabung: 'Gagal memuat',
        });
      }
    };

    fetchProfile();
  }, []); // [] = Jalankan sekali saat komponen dimuat

  // --- 2. Handler untuk Form Ubah Password ---
  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();

    // Validasi frontend sederhana
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Password baru dan konfirmasi tidak cocok!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      // Memanggil API change-password
      await axios.post(
        'http://localhost:3000/api/admin/change-password',
        {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Password berhasil diubah!');
      // Kosongkan form setelah berhasil
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Gagal mengubah password:', error);
      // Menampilkan pesan error dari backend
      alert(`Gagal: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* --- Bagian Informasi Profil (Display Only) --- */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Informasi Profil
          </h2>
          {/* Tombol Edit dihapus sesuai permintaan */}
        </div>

        <div className="flex items-center space-x-6 mb-6">
          {/* Foto profil dihapus sesuai kode Anda yang dikomentari */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {formData.nama}
            </h2>
            {/* Menampilkan bidang di bawah nama */}
            <p className="text-gray-500 text-sm">{formData.bidang}</p>
          </div>
        </div>

        {/* Form ini tidak memiliki tombol submit, hanya untuk display */}
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              {/* Hanya menampilkan data, tidak ada input */}
              <div className="flex items-center py-2">
                <Mail size={16} className="text-gray-400 mr-2" />
                <span className="text-gray-900">{formData.email}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Bergabung
              </label>
              <p className="text-gray-900 py-2">{formData.tanggalBergabung}</p>
            </div>

            {/* Field "Role" dan "Bidang" yang lama dihapus agar sesuai data */}
          </div>
          {/* Tombol Simpan/Batal dihapus sesuai permintaan */}
        </form>
      </div>

      {/* --- Bagian Ubah Password (Fungsional) --- */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Ubah Password
        </h3>
        <form className="space-y-4" onSubmit={handleSubmitPassword}>
          {/* --- Password Lama --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password Lama
            </label>
            <div className="relative">
              <input
                type={showOldPassword ? 'text' : 'password'}
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006DA6] focus:border-transparent"
                placeholder="Masukkan password lama"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* --- Password Baru --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password Baru
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006DA6] focus:border-transparent"
                placeholder="Masukkan password baru"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* --- Konfirmasi Password Baru --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Konfirmasi Password Baru
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006DA6] focus:border-transparent"
                placeholder="Konfirmasi password baru"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-[#006DA6] text-white rounded-lg hover:bg-[#002942] transition-colors"
            >
              Ubah Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProfile;
