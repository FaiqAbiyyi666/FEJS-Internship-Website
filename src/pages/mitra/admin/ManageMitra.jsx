import React, { useState } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Building,
  Mail,
  Phone,
  MapPin,
  Users,
  MoreHorizontal,
} from 'lucide-react';

const ManagementMitra = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const mitraData = [
    {
      id: 1,
      nama: 'PT. Teknologi Nusantara',
      email: 'info@teknologi-nusantara.com',
      phone: '021-12345678',
      alamat: 'Jl. Sudirman No. 123, Jakarta Pusat',
      kontak: 'Budi Santoso',
      jabatan: 'HR Manager',
      bidang: ['IT Development', 'Data Science', 'UI/UX Design'],
      kapasitas: 20,
      pesertaAktif: 15,
      status: 'Aktif',
      tanggalKerjasama: '2023-01-15',
      deskripsi:
        'Perusahaan teknologi terkemuka yang bergerak dalam pengembangan solusi digital.',
      logo: 'TN',
    },
    {
      id: 2,
      nama: 'PT. Maju Bersama',
      email: 'hr@majubersama.co.id',
      phone: '021-87654321',
      alamat: 'Jl. Thamrin No. 456, Jakarta',
      kontak: 'Siti Nurhaliza',
      jabatan: 'Head of HR',
      bidang: ['Human Resources', 'Administration', 'Marketing'],
      kapasitas: 15,
      pesertaAktif: 12,
      status: 'Aktif',
      tanggalKerjasama: '2023-03-20',
      deskripsi:
        'Perusahaan konsultan manajemen dan pengembangan sumber daya manusia.',
      logo: 'MB',
    },
    {
      id: 3,
      nama: 'CV. Kreatif Mandiri',
      email: 'contact@kreatifmandiri.com',
      phone: '021-11223344',
      alamat: 'Jl. Gatot Subroto No. 789, Jakarta',
      kontak: 'Made Subrata',
      jabatan: 'Owner',
      bidang: ['Graphic Design', 'Digital Marketing'],
      kapasitas: 10,
      pesertaAktif: 8,
      status: 'Nonaktif',
      tanggalKerjasama: '2022-08-10',
      deskripsi: 'Studio kreatif yang fokus pada desain dan komunikasi visual.',
      logo: 'KM',
    },
  ];

  const filteredMitra = mitraData.filter(
    (mitra) =>
      mitra.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mitra.kontak.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mitra.bidang.some((b) =>
        b.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const getStatusColor = (status) => {
    return status === 'Aktif'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 sm:max-w-md">
          <Search
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Cari mitra..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006DA6] focus:border-transparent"
          />
        </div>
        <button className="bg-[#006DA6] text-white px-4 py-2 rounded-lg hover:bg-[#002942] transition-colors flex items-center space-x-2">
          <Plus size={20} />
          <span>Tambah Mitra</span>
        </button>
      </div>

      {/* Mitra Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMitra.map((mitra) => (
          <div
            key={mitra.id}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#006DA6] to-[#002942] rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {mitra.logo}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {mitra.nama}
                  </h3>
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      mitra.status
                    )}`}
                  >
                    {mitra.status}
                  </span>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreHorizontal size={20} className="text-gray-400" />
              </button>
            </div>

            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
              {mitra.deskripsi}
            </p>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Mail size={16} className="mr-3 text-gray-400" />
                <span>{mitra.email}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone size={16} className="mr-3 text-gray-400" />
                <span>{mitra.phone}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin size={16} className="mr-3 text-gray-400" />
                <span>{mitra.alamat}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users size={16} className="mr-3 text-gray-400" />
                <span>
                  {mitra.pesertaAktif} / {mitra.kapasitas} peserta aktif
                </span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Kontak:</span> {mitra.kontak} (
                {mitra.jabatan})
              </p>

              <div className="flex flex-wrap gap-2">
                {mitra.bidang.map((bidang, index) => (
                  <span
                    key={index}
                    className="inline-flex px-2 py-1 bg-[#BFDCFF] text-[#002942] rounded-full text-xs font-medium"
                  >
                    {bidang}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Kerjasama sejak: {mitra.tanggalKerjasama}
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-[#006DA6] to-[#BFDCFF] h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(mitra.pesertaAktif / mitra.kapasitas) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-xs text-gray-500">
                  {Math.round((mitra.pesertaAktif / mitra.kapasitas) * 100)}%
                </span>
              </div>
            </div>

            <div className="flex space-x-2 mt-4">
              <button className="flex-1 px-3 py-2 text-[#006DA6] border border-[#006DA6] rounded-lg hover:bg-[#006DA6] hover:text-white transition-colors text-sm">
                <Edit size={16} className="inline mr-1" />
                Edit
              </button>
              <button className="flex-1 px-3 py-2 bg-[#006DA6] text-white rounded-lg hover:bg-[#002942] transition-colors text-sm">
                Detail
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagementMitra;
