import React, { useState } from 'react';
import { Eye, Edit } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export default function ManagePesertaMagang() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPeserta, setSelectedPeserta] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Tambahkan state form edit
  const [formData, setFormData] = useState(null);

  const openDetailModal = (peserta) => {
    setSelectedPeserta(peserta);
    setFormData({ ...peserta });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPeserta(null);
    setFormData(null);
  };

  // Update form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Simpan data (dummy handler)
  const handleSave = () => {
    console.log('Data yang disimpan:', formData);
    closeModal();
  };

  const pesertaData = [
    {
      id: 1,
      nik: '3175091501990001',
      nim: '0101234567',
      nama: 'Ahmad Rizki Pratama',
      email: 'ahmad.rizki@email.com',
      phone: '081234567890',
      alamat: 'Jl. Merdeka No.10, Jakarta',
      universitas: 'Universitas Indonesia',
      jurusan: 'Sistem Informasi',
      bidang: 'Tata Kelola Informatika',
      status: 'Aktif',
      tanggalMulai: '2024-01-15',
      tanggalSelesai: '2024-04-15',
      progress: 75,
    },
    {
      id: 2,
      nik: '3374092202000002',
      nim: '0202345678',
      nama: 'Siti Aminah',
      email: 'siti.aminah@email.com',
      phone: '081234567891',
      alamat: 'Jl. Kaliurang Km.7, Yogyakarta',
      universitas: 'Universitas Gadjah Mada',
      jurusan: 'Manajemen',
      bidang: '',
      status: 'Pending',
      tanggalMulai: '2024-02-01',
      tanggalSelesai: '2024-05-01',
      progress: 0,
    },
    {
      id: 3,
      nik: '3273011801980003',
      nim: '0303456789',
      nama: 'Budi Santoso',
      email: 'budi.santoso@email.com',
      phone: '081234567892',
      alamat: 'Jl. Dago Atas No.5, Bandung',
      universitas: 'Institut Teknologi Bandung',
      jurusan: 'Teknik Elektro',
      bidang: 'Infrastruktur & Keamanan TIK',
      status: 'Selesai',
      tanggalMulai: '2023-10-15',
      tanggalSelesai: '2024-01-15',
      progress: 100,
    },
    {
      id: 4,
      nik: '3578020402000004',
      nim: '0404567890',
      nama: 'Lestari Wulandari',
      email: 'lestari.wulan@email.com',
      phone: '081234567893',
      alamat: 'Jl. Dharmawangsa No.8, Surabaya',
      universitas: 'Universitas Airlangga',
      jurusan: 'Ilmu Komunikasi',
      bidang: 'Pengelolaan Informasi dan Komunikasi Publik',
      status: 'Aktif',
      tanggalMulai: '2024-03-01',
      tanggalSelesai: '2024-06-01',
      progress: 40,
    },
    {
      id: 5,
      nik: '3374011802000005',
      nim: '0505678901',
      nama: 'Andi Nugroho',
      email: 'andi.nugroho@email.com',
      phone: '081234567894',
      alamat: 'Jl. Siliwangi No.12, Semarang',
      universitas: 'Universitas Diponegoro',
      jurusan: 'Hukum',
      bidang: '',
      status: 'Pending',
      tanggalMulai: '2024-03-15',
      tanggalSelesai: '2024-06-15',
      progress: 0,
    },
    {
      id: 6,
      nik: '3374031001990006',
      nim: '0606789012',
      nama: 'Rika Putri',
      email: 'rika.putri@email.com',
      phone: '081234567895',
      alamat: 'Jl. Slamet Riyadi No.3, Solo',
      universitas: 'Universitas Sebelas Maret',
      jurusan: 'Ekonomi',
      bidang: 'Statistik',
      status: 'Aktif',
      tanggalMulai: '2024-01-10',
      tanggalSelesai: '2024-04-10',
      progress: 60,
    },
    {
      id: 7,
      nik: '3273010501990007',
      nim: '0707890123',
      nama: 'Iqbal Ramadhan',
      email: 'iqbal.ramadhan@email.com',
      phone: '081234567896',
      alamat: 'Jl. Setiabudi No.99, Bandung',
      universitas: 'Universitas Padjadjaran',
      jurusan: 'Teknik Sipil',
      bidang: 'Infrastruktur & Keamanan TIK',
      status: 'Selesai',
      tanggalMulai: '2023-09-01',
      tanggalSelesai: '2023-12-01',
      progress: 100,
    },
    {
      id: 8,
      nik: '3578032001990008',
      nim: '0808901234',
      nama: 'Putri Ayu',
      email: 'putri.ayu@email.com',
      phone: '081234567897',
      alamat: 'Jl. Ijen No.21, Malang',
      universitas: 'Universitas Negeri Malang',
      jurusan: 'Pendidikan Matematika',
      bidang: 'Sekretariat',
      status: 'Aktif',
      tanggalMulai: '2024-04-01',
      tanggalSelesai: '2024-07-01',
      progress: 20,
    },
    {
      id: 9,
      nik: '3578011502000009',
      nim: '0909012345',
      nama: 'Fahmi Hidayat',
      email: 'fahmi.hidayat@email.com',
      phone: '081234567898',
      alamat: 'Jl. Kayun No.7, Surabaya',
      universitas: 'Universitas Islam Negeri Sunan Ampel',
      jurusan: 'Psikologi',
      bidang: '',
      status: 'Pending',
      tanggalMulai: '2024-05-01',
      tanggalSelesai: '2024-08-01',
      progress: 0,
    },
    {
      id: 10,
      nik: '3471012801990010',
      nim: '1001234567',
      nama: 'Mega Larasati',
      email: 'mega.larasati@email.com',
      phone: '081234567899',
      alamat: 'Jl. Ringroad Selatan No.4, Yogyakarta',
      universitas: 'Universitas Muhammadiyah Yogyakarta',
      jurusan: 'Desain Komunikasi Visual',
      bidang: 'Pengelolaan Informasi dan Komunikasi Publik',
      status: 'Aktif',
      tanggalMulai: '2024-02-10',
      tanggalSelesai: '2024-05-10',
      progress: 55,
    },
    {
      id: 11,
      nik: '3271010501990011',
      nim: '1102345678',
      nama: 'Rizky Ananda',
      email: 'rizky.ananda@email.com',
      phone: '081234567800',
      alamat: 'Jl. Sangkuriang No.88, Bandung',
      universitas: 'Telkom University',
      jurusan: 'Sistem Informasi',
      bidang: 'Tata Kelola Informatika',
      status: 'Aktif',
      tanggalMulai: '2024-01-20',
      tanggalSelesai: '2024-04-20',
      progress: 70,
    },
    {
      id: 12,
      nik: '3374041502000012',
      nim: '1203456789',
      nama: 'Nurul Fadilah',
      email: 'nurul.fadilah@email.com',
      phone: '081234567801',
      alamat: 'Jl. Ahmad Yani No.22, Semarang',
      universitas: 'Universitas Negeri Semarang',
      jurusan: 'Akuntansi',
      bidang: '',
      status: 'Pending',
      tanggalMulai: '2024-06-01',
      tanggalSelesai: '2024-09-01',
      progress: 0,
    },
    {
      id: 13,
      nik: '3578041801990013',
      nim: '1304567890',
      nama: 'Galih Prasetyo',
      email: 'galih.prasetyo@email.com',
      phone: '081234567802',
      alamat: 'Jl. Majapahit No.5, Surabaya',
      universitas: 'Institut Teknologi Sepuluh Nopember',
      jurusan: 'Informatika',
      bidang: 'Tata Kelola Informatika',
      status: 'Aktif',
      tanggalMulai: '2024-03-01',
      tanggalSelesai: '2024-06-01',
      progress: 45,
    },
    {
      id: 14,
      nik: '3374022201990014',
      nim: '1405678901',
      nama: 'Desi Maharani',
      email: 'desi.maharani@email.com',
      phone: '081234567803',
      alamat: 'Jl. Pemuda No.17, Kudus',
      universitas: 'Universitas Muria Kudus',
      jurusan: 'Ilmu Komunikasi',
      bidang: 'Pengelolaan Informasi dan Komunikasi Publik',
      status: 'Selesai',
      tanggalMulai: '2023-10-01',
      tanggalSelesai: '2024-01-01',
      progress: 100,
    },
    {
      id: 15,
      nik: '3471020501990015',
      nim: '1506789012',
      nama: 'Bayu Wirawan',
      email: 'bayu.wirawan@email.com',
      phone: '081234567804',
      alamat: 'Jl. Kaliurang No.45, Sleman',
      universitas: 'Universitas Negeri Yogyakarta',
      jurusan: 'Pendidikan Teknologi Informasi',
      bidang: 'Tata Kelola Informatika',
      status: 'Aktif',
      tanggalMulai: '2024-02-05',
      tanggalSelesai: '2024-05-05',
      progress: 65,
    },
  ];

  const filteredPeserta = pesertaData.filter((peserta) => {
    const matchesSearch =
      peserta.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      peserta.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      peserta.universitas.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || peserta.status.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPeserta.length / ITEMS_PER_PAGE);
  const paginatedPeserta = filteredPeserta.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'aktif':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-700 bg-yellow-100';
      case 'selesai':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <input
            type="text"
            placeholder="Cari peserta..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-[#006DA6] focus:border-[#006DA6]"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-[#006DA6] focus:border-[#006DA6]"
          >
            <option value="all">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="pending">Pending</option>
            <option value="selesai">Selesai</option>
          </select>
        </div>
      </div>
      {/* Tabel */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#006DA6] text-white">
            <tr>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Universitas</th>
              <th className="px-4 py-3">Bidang</th>
              <th className="px-4 py-3">Progres (%)</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPeserta.map((peserta) => (
              <tr key={peserta.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{peserta.nama}</td>
                <td className="px-4 py-3">{peserta.email}</td>
                <td className="px-4 py-3">{peserta.universitas}</td>
                <td className="px-4 py-3">{peserta.bidang}</td>
                <td className="px-4 py-3">{peserta.progress}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(
                      peserta.status
                    )}`}
                  >
                    {peserta.status}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    onClick={() => openDetailModal(peserta)}
                    className="text-[#006DA6] hover:underline flex items-center text-sm"
                  >
                    <Edit size={16} className="mr-1" />
                  </button>
                </td>
              </tr>
            ))}
            {paginatedPeserta.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  Tidak ada data peserta ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/*Modal Detail (Editable Form)*/}
      {isModalOpen && formData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          onClick={closeModal}
        >
          <div
            className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-5 text-gray-500 hover:text-red-500"
              onClick={closeModal}
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4 text-[#006DA6]">
              Edit Data Peserta Magang
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {[
                { label: 'Nama', name: 'nama' },
                { label: 'Email', name: 'email' },
                { label: 'NIM', name: 'nim' },
                { label: 'NIK', name: 'nik' },
                { label: 'Telepon', name: 'phone' },
                { label: 'Alamat', name: 'alamat' },
                { label: 'Universitas', name: 'universitas' },
                { label: 'Jurusan', name: 'jurusan' },
                {
                  label: 'Bidang',
                  name: 'bidang',
                  type: 'select',
                  options: [
                    'Tata Kelola Informatika',
                    'Infrastruktur & Keamanan TIK',
                    'Pengelolaan Informasi dan Komunikasi Publik',
                    'Sekretariat',
                    'Statistik',
                  ],
                }, // ✅ dropdown
                {
                  label: 'Status',
                  name: 'status',
                  type: 'select',
                  options: ['Aktif', 'Selesai', 'Ditolak', 'Pending'],
                },
                { label: 'Tanggal Mulai', name: 'tanggalMulai', type: 'date' },
                {
                  label: 'Tanggal Selesai',
                  name: 'tanggalSelesai',
                  type: 'date',
                },
                {
                  label: 'Progress (%)',
                  name: 'progress',
                  type: 'number',
                  readOnly: true,
                },
              ].map(
                ({ label, name, type = 'text', readOnly = false, options }) => (
                  <div key={name}>
                    <label className="block mb-1 text-gray-700">{label}</label>

                    {type === 'select' ? (
                      <select
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#006DA6] focus:border-[#006DA6]"
                      >
                        {options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={type}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        readOnly={readOnly}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#006DA6] focus:border-[#006DA6] ${
                          readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
                        }`}
                      />
                    )}
                  </div>
                )
              )}
            </div>
            <div className="mt-6 text-right">
              <button
                onClick={handleSave}
                className="bg-[#006DA6] text-white px-4 py-2 rounded hover:bg-[#00517c] transition"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-700">
          Menampilkan{' '}
          <span className="font-medium">
            {(currentPage - 1) * ITEMS_PER_PAGE + 1}
          </span>{' '}
          -{' '}
          <span className="font-medium">
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredPeserta.length)}
          </span>{' '}
          dari <span className="font-medium">{filteredPeserta.length}</span>{' '}
          hasil
        </p>
        <div className="flex space-x-1">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded hover:bg-gray-100 text-sm"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded text-sm ${
                currentPage === i + 1
                  ? 'bg-[#006DA6] text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded hover:bg-gray-100 text-sm"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
