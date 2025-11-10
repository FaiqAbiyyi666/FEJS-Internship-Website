import React, { useState, useEffect } from 'react';
import { Mail, Eye, EyeOff } from 'lucide-react';
// axios sudah dihapus

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
  const [formData, setFormData] = useState({
    nama: 'Memuat...',
    email: 'Memuat...',
    bidang: 'Memuat...',
    tanggalBergabung: 'Memuat...',
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');

        // --- Diganti dari axios.get ke fetch ---
        const response = await fetch(
          'http://localhost:3000/api/admin/profile',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json(); // 1. Manual parse JSON

        if (!response.ok) {
          // 2. Manual cek error HTTP
          throw new Error(data.message || 'Gagal mengambil data profil');
        }
        // ----------------------------------------

        setFormData({
          nama: data.nama,
          email: data.email,
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
        // Menampilkan pesan error yang lebih spesifik
        alert(`Gagal mengambil profil: ${error.message}`);
      }
    };

    fetchProfile();
  }, []);

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Password baru dan konfirmasi tidak cocok!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const body = {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      };

      // --- Diganti dari axios.post ke fetch ---
      const response = await fetch(
        'http://localhost:3000/api/admin/change-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Wajib ada untuk POST
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body), // 1. Manual stringify body
        }
      );

      const data = await response.json(); // 2. Manual parse JSON

      if (!response.ok) {
        // 3. Manual cek error HTTP
        throw new Error(data.message || 'Gagal mengubah password');
      }
      // ----------------------------------------

      alert('Password berhasil diubah!');
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Gagal mengubah password:', error);
      // Menampilkan pesan error yang lebih sederhana
      alert(`Gagal: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Informasi Profil
          </h2>
        </div>

        <div className="flex items-center space-x-6 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {formData.nama}
            </h2>
            <p className="text-gray-500 text-sm">{formData.bidang}</p>
          </div>
        </div>

        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
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
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Ubah Password
        </h3>
        <form className="space-y-4" onSubmit={handleSubmitPassword}>
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
