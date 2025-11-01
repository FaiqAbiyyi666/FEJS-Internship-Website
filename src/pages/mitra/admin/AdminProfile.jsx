import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Edit, Save, X, Camera } from 'lucide-react';

const AdminProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nama: 'Administrator',
    email: 'admin@magang.com',
    phone: '021-12345678',
    alamat: 'Jl. Sudirman No. 123, Jakarta',
    jabatan: 'System Administrator',
    divisi: 'IT Department',
    tanggalBergabung: '2023-01-15',
    bio: 'Bertanggung jawab mengelola sistem informasi magang dan koordinasi dengan semua stakeholder.',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      nama: 'Administrator',
      email: 'admin@magang.com',
      phone: '021-12345678',
      alamat: 'Jl. Sudirman No. 123, Jakarta',
      jabatan: 'System Administrator',
      divisi: 'IT Department',
      tanggalBergabung: '2023-01-15',
      bio: 'Bertanggung jawab mengelola sistem informasi magang dan koordinasi dengan semua stakeholder.',
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Informasi Profile
          </h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[#006DA6] text-white px-4 py-2 rounded-lg hover:bg-[#002942] transition-colors flex items-center space-x-2"
            >
              <Edit size={20} />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        <div className="flex items-center space-x-6 mb-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-[#006DA6] to-[#002942] rounded-full flex items-center justify-center">
              <User size={48} className="text-white" />
            </div>
            {isEditing && (
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#006DA6] rounded-full flex items-center justify-center text-white hover:bg-[#002942] transition-colors">
                <Camera size={16} />
              </button>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {formData.nama}
            </h2>
            <p className="text-gray-600">{formData.jabatan}</p>
            <p className="text-gray-500 text-sm">{formData.divisi}</p>
            <div className="flex items-center mt-2">
              <span className="inline-flex px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Active
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006DA6] focus:border-transparent"
                  required
                />
              ) : (
                <div className="flex items-center py-2">
                  <Mail size={16} className="text-gray-400 mr-2" />
                  <span className="text-gray-900">{formData.email}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.jabatan}
                  onChange={(e) =>
                    setFormData({ ...formData, jabatan: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006DA6] focus:border-transparent"
                  required
                />
              ) : (
                <p className="text-gray-900 py-2">{formData.jabatan}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bidang
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.divisi}
                  onChange={(e) =>
                    setFormData({ ...formData, divisi: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006DA6] focus:border-transparent"
                  required
                />
              ) : (
                <p className="text-gray-900 py-2">{formData.divisi}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Bergabung
              </label>
              <p className="text-gray-900 py-2">{formData.tanggalBergabung}</p>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2 transition-colors"
              >
                <X size={20} />
                <span>Batal</span>
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#006DA6] text-white rounded-lg hover:bg-[#002942] flex items-center space-x-2 transition-colors"
              >
                <Save size={20} />
                <span>Simpan</span>
              </button>
            </div>
          )}
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Ubah Password
        </h3>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password Lama
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006DA6] focus:border-transparent"
              placeholder="Masukkan password lama"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password Baru
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006DA6] focus:border-transparent"
              placeholder="Masukkan password baru"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Konfirmasi Password Baru
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006DA6] focus:border-transparent"
              placeholder="Konfirmasi password baru"
            />
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
