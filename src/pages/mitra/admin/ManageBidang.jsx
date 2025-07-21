import React, { useState } from 'react';
import { Plus, Edit, Users, Search, MoreHorizontal, X } from 'lucide-react';
import { Dialog } from '@headlessui/react';

const ManagementBidang = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bidangList, setBidangList] = useState([
    {
      id: 1,
      nama: 'Tata Kelola Informatika',
      deskripsi:
        'Merancang kebijakan, pengelolaan infrastruktur TI, dan pengawasan sistem informasi di lingkungan pemerintah.',
      requirements: [
        'Minimal semester 5',
        'Menguasai programming (Java/PHP/JavaScript)',
        'Memahami database',
      ],
      durasi: '3-6 bulan',
      kapasitas: 10,
      pesertaAktif: 5,
      mitra: ['PT. Teknologi Nusantara', 'PT. Digital Solusi'],
      skills: ['Programming', 'Database', 'System Analysis'],
      status: 'Aktif',
      icon: '🖥️',
    },
    {
      id: 2,
      nama: 'Pengelolaan Informasi dan Komunikasi Publik',
      deskripsi:
        'Mengelola penyebaran informasi publik, hubungan media, dan konten komunikasi digital pemerintah.',
      requirements: [
        'Minimal semester 4',
        'Jurusan Psikologi/Manajemen',
        'Komunikasi yang baik',
      ],
      durasi: '2-4 bulan',
      kapasitas: 10,
      pesertaAktif: 7,
      mitra: ['PT. Maju Bersama', 'CV. Konsultan Prima'],
      skills: ['Communication', 'Administration', 'Employee Relations'],
      status: 'Aktif',
      icon: '📢',
    },
    {
      id: 3,
      nama: 'Sekretariat',
      deskripsi:
        'Mendukung administrasi, penyusunan laporan, jadwal kegiatan, dan dokumentasi kegiatan kedinasan.',
      requirements: [
        'Minimal semester 3',
        'Kreatif dan inovatif',
        'Menguasai social media',
      ],
      durasi: '2-3 bulan',
      kapasitas: 10,
      pesertaAktif: 4,
      mitra: ['CV. Kreatif Mandiri', 'PT. Media Digital'],
      skills: ['Content Creation', 'Social Media', 'Analytics'],
      status: 'Aktif',
      icon: '📂',
    },
    {
      id: 4,
      nama: 'Statistik',
      deskripsi:
        'Pengolahan, analisis, dan visualisasi data statistik untuk mendukung pengambilan keputusan.',
      requirements: [
        'Minimal semester 6',
        'Menguasai Python/R',
        'Statistika dan matematika',
      ],
      durasi: '4-6 bulan',
      kapasitas: 10,
      pesertaAktif: 3,
      mitra: ['PT. Teknologi Nusantara'],
      skills: ['Python', 'Statistics', 'Machine Learning'],
      status: 'Aktif',
      icon: '📊',
    },
    {
      id: 5,
      nama: 'Infrastruktur & Keamanan TIK',
      deskripsi:
        'Mengelola jaringan, server, perangkat keras, dan sistem keamanan teknologi informasi di instansi.',
      requirements: [
        'Minimal semester 5',
        'Menguasai jaringan komputer dan keamanan siber',
        'Memahami arsitektur sistem',
      ],
      durasi: '3-6 bulan',
      kapasitas: 10,
      pesertaAktif: 8,
      mitra: ['PT. Teknologi Nusantara', 'PT. Digital Solusi'],
      skills: ['Networking', 'Cybersecurity', 'System Admin'],
      status: 'Aktif',
      icon: '🔐',
    },
  ]);

  const [formBidang, setFormBidang] = useState({
    nama: '',
    deskripsi: '',
    requirements: '',
    skills: '',
    kapasitas: 0,
    icon: '',
  });

  const handleAddBidang = () => {
    const newBidang = {
      ...formBidang,
      id: bidangList.length + 1,
      requirements: formBidang.requirements.split(',').map((r) => r.trim()),
      skills: formBidang.skills.split(',').map((s) => s.trim()),
      pesertaAktif: 0,
      status: 'Aktif',
      durasi: '3 bulan',
      mitra: [],
    };
    setBidangList([newBidang, ...bidangList]);
    setIsModalOpen(false);
    setFormBidang({
      nama: '',
      deskripsi: '',
      requirements: '',
      skills: '',
      kapasitas: 0,
      icon: '',
    });
  };

  const filteredBidang = bidangList.filter(
    (bidang) =>
      bidang.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bidang.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            placeholder="Cari bidang magang..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006DA6] focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#006DA6] text-white px-4 py-2 rounded-lg hover:bg-[#002942] transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Tambah Bidang</span>
        </button>
      </div>

      {/* Bidang Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredBidang.map((bidang) => (
          <div
            key={bidang.id}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#BFDCFF] to-[#006DA6] rounded-xl flex items-center justify-center text-2xl">
                  {bidang.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {bidang.nama}
                  </h3>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreHorizontal size={20} className="text-gray-400" />
              </button>
            </div>

            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
              {bidang.deskripsi}
            </p>

            <div className="space-y-4 mb-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Requirements:
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {bidang.requirements.slice(0, 2).map((req, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-[#006DA6] rounded-full mr-2 mt-2 flex-shrink-0"></span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Skills:
                </h4>
                <div className="flex flex-wrap gap-1">
                  {bidang.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-gray-200 mb-4">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <Users size={16} className="mr-1" />
                  {bidang.pesertaAktif} / {bidang.kapasitas}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-[#006DA6] to-[#BFDCFF] h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        (bidang.pesertaAktif / bidang.kapasitas) * 100
                      }%`,
                    }}
                  />
                </div>
                <span className="text-xs text-gray-500">
                  {Math.round((bidang.pesertaAktif / bidang.kapasitas) * 100)}%
                </span>
              </div>
            </div>

            <div className="flex space-x-2">
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

      {/* Modal Tambah */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6 shadow-lg space-y-4">
            <div className="flex justify-between items-center">
              <Dialog.Title className="text-lg font-semibold text-gray-800">
                Tambah Bidang
              </Dialog.Title>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Nama Bidang */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Bidang
              </label>
              <input
                type="text"
                placeholder="Nama Bidang"
                value={formBidang.nama}
                onChange={(e) =>
                  setFormBidang({ ...formBidang, nama: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
              />
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi Bidang
              </label>
              <textarea
                placeholder="Deskripsi"
                value={formBidang.deskripsi}
                onChange={(e) =>
                  setFormBidang({ ...formBidang, deskripsi: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
              />
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Persyaratan (pisahkan dengan koma)
              </label>
              <input
                type="text"
                placeholder="Requirements"
                value={formBidang.requirements}
                onChange={(e) =>
                  setFormBidang({ ...formBidang, requirements: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Keahlian yang Dibutuhkan (pisahkan dengan koma)
              </label>
              <input
                type="text"
                placeholder="Skills"
                value={formBidang.skills}
                onChange={(e) =>
                  setFormBidang({ ...formBidang, skills: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
              />
            </div>

            {/* Kapasitas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kuota Peserta Magang
              </label>
              <input
                type="number"
                placeholder="Kapasitas"
                value={formBidang.kapasitas}
                onChange={(e) =>
                  setFormBidang({ ...formBidang, kapasitas: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
              />
            </div>

            {/* Icon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon Emoji (contoh: 🖥️)
              </label>
              <input
                type="text"
                placeholder="Icon Emoji"
                value={formBidang.icon}
                onChange={(e) =>
                  setFormBidang({ ...formBidang, icon: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
              />
            </div>

            {/* Tombol Simpan */}
            <button
              onClick={handleAddBidang}
              className="bg-[#006DA6] w-full text-white px-4 py-2 rounded-lg hover:bg-[#002942] transition"
            >
              Simpan
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default ManagementBidang;
