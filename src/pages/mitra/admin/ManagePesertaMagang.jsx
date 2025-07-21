import React, { useState } from 'react';
import { Eye, Edit } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export default function ManagementPeserta() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const pesertaData = [
    {
      id: 1,
      nama: 'Ahmad Rizki Pratama',
      email: 'ahmad.rizki@email.com',
      phone: '081234567890',
      universitas: 'Universitas Indonesia',
      jurusan: 'Teknik Informatika',
      bidang: 'IT Development',
      status: 'Aktif',
      tanggalMulai: '2024-01-15',
      tanggalSelesai: '2024-04-15',
      pembimbing: 'Dr. Siti Nurhaliza',
      progress: 75,
    },
    {
      id: 2,
      nama: 'Siti Aminah',
      email: 'siti.aminah@email.com',
      phone: '081234567891',
      universitas: 'Universitas Gadjah Mada',
      jurusan: 'Manajemen',
      bidang: 'Human Resources',
      status: 'Pending',
      tanggalMulai: '2024-02-01',
      tanggalSelesai: '2024-05-01',
      pembimbing: 'Budi Santoso, S.H.',
      progress: 0,
    },
    {
      id: 3,
      nama: 'Budi Santoso',
      email: 'budi.santoso@email.com',
      phone: '081234567892',
      universitas: 'Institut Teknologi Bandung',
      jurusan: 'Teknik Elektro',
      bidang: 'Engineering',
      status: 'Selesai',
      tanggalMulai: '2023-10-15',
      tanggalSelesai: '2024-01-15',
      pembimbing: 'Ir. Made Subrata',
      progress: 100,
    },
    {
      id: 4,
      nama: 'Lestari Wulandari',
      email: 'lestari.wulan@email.com',
      phone: '081234567893',
      universitas: 'Universitas Airlangga',
      jurusan: 'Ilmu Komunikasi',
      bidang: 'Public Relations',
      status: 'Aktif',
      tanggalMulai: '2024-03-01',
      tanggalSelesai: '2024-06-01',
      pembimbing: 'Drs. Hadi Wijaya',
      progress: 40,
    },
    {
      id: 5,
      nama: 'Andi Nugroho',
      email: 'andi.nugroho@email.com',
      phone: '081234567894',
      universitas: 'Universitas Diponegoro',
      jurusan: 'Hukum',
      bidang: 'Legal',
      status: 'Pending',
      tanggalMulai: '2024-03-15',
      tanggalSelesai: '2024-06-15',
      pembimbing: 'Rina Kartika, S.H.',
      progress: 0,
    },
    {
      id: 6,
      nama: 'Rika Putri',
      email: 'rika.putri@email.com',
      phone: '081234567895',
      universitas: 'Universitas Sebelas Maret',
      jurusan: 'Ekonomi',
      bidang: 'Finance',
      status: 'Aktif',
      tanggalMulai: '2024-01-10',
      tanggalSelesai: '2024-04-10',
      pembimbing: 'Dr. Sugeng Hartono',
      progress: 60,
    },
    {
      id: 7,
      nama: 'Iqbal Ramadhan',
      email: 'iqbal.ramadhan@email.com',
      phone: '081234567896',
      universitas: 'Universitas Padjadjaran',
      jurusan: 'Teknik Sipil',
      bidang: 'Engineering',
      status: 'Selesai',
      tanggalMulai: '2023-09-01',
      tanggalSelesai: '2023-12-01',
      pembimbing: 'Ir. Taufik Hidayat',
      progress: 100,
    },
    {
      id: 8,
      nama: 'Putri Ayu',
      email: 'putri.ayu@email.com',
      phone: '081234567897',
      universitas: 'Universitas Negeri Malang',
      jurusan: 'Pendidikan Matematika',
      bidang: 'Education',
      status: 'Aktif',
      tanggalMulai: '2024-04-01',
      tanggalSelesai: '2024-07-01',
      pembimbing: 'Drs. Bambang Supriadi',
      progress: 20,
    },
    {
      id: 9,
      nama: 'Fahmi Hidayat',
      email: 'fahmi.hidayat@email.com',
      phone: '081234567898',
      universitas: 'Universitas Islam Negeri Sunan Ampel',
      jurusan: 'Psikologi',
      bidang: 'Human Resources',
      status: 'Pending',
      tanggalMulai: '2024-05-01',
      tanggalSelesai: '2024-08-01',
      pembimbing: 'Siti Rahmah, M.Psi.',
      progress: 0,
    },
    {
      id: 10,
      nama: 'Mega Larasati',
      email: 'mega.larasati@email.com',
      phone: '081234567899',
      universitas: 'Universitas Muhammadiyah Yogyakarta',
      jurusan: 'Desain Komunikasi Visual',
      bidang: 'Design',
      status: 'Aktif',
      tanggalMulai: '2024-02-10',
      tanggalSelesai: '2024-05-10',
      pembimbing: 'Anita Pratiwi, S.Sn.',
      progress: 55,
    },
    {
      id: 11,
      nama: 'Rizky Maulana',
      email: 'rizky.maulana@email.com',
      phone: '081234567800',
      universitas: 'Politeknik Negeri Jakarta',
      jurusan: 'Teknik Informatika',
      bidang: 'IT Development',
      status: 'Selesai',
      tanggalMulai: '2023-11-01',
      tanggalSelesai: '2024-02-01',
      pembimbing: 'Dr. Andika Putra',
      progress: 100,
    },
    {
      id: 12,
      nama: 'Nadia Safira',
      email: 'nadia.safira@email.com',
      phone: '081234567801',
      universitas: 'Universitas Negeri Surabaya',
      jurusan: 'Bahasa Inggris',
      bidang: 'Translation',
      status: 'Aktif',
      tanggalMulai: '2024-03-05',
      tanggalSelesai: '2024-06-05',
      pembimbing: 'Erna Wati, M.Hum.',
      progress: 35,
    },
    {
      id: 13,
      nama: 'Dio Wahyudi',
      email: 'dio.wahyudi@email.com',
      phone: '081234567802',
      universitas: 'Universitas Jember',
      jurusan: 'Teknik Mesin',
      bidang: 'Engineering',
      status: 'Aktif',
      tanggalMulai: '2024-01-20',
      tanggalSelesai: '2024-04-20',
      pembimbing: 'Ir. Suroso',
      progress: 80,
    },
    {
      id: 14,
      nama: 'Salsa Maharani',
      email: 'salsa.maharani@email.com',
      phone: '081234567803',
      universitas: 'Universitas Katolik Parahyangan',
      jurusan: 'Akuntansi',
      bidang: 'Finance',
      status: 'Pending',
      tanggalMulai: '2024-04-10',
      tanggalSelesai: '2024-07-10',
      pembimbing: 'Dr. Bambang Setiawan',
      progress: 0,
    },
    {
      id: 15,
      nama: 'Danu Prasetyo',
      email: 'danu.prasetyo@email.com',
      phone: '081234567804',
      universitas: 'Universitas Sanata Dharma',
      jurusan: 'Ilmu Komputer',
      bidang: 'IT Support',
      status: 'Aktif',
      tanggalMulai: '2024-02-15',
      tanggalSelesai: '2024-05-15',
      pembimbing: 'Dedi Kurniawan, M.Kom.',
      progress: 70,
    },
    {
      id: 16,
      nama: 'Anisa Nuraini',
      email: 'anisa.nuraini@email.com',
      phone: '081234567805',
      universitas: 'Universitas Trunojoyo',
      jurusan: 'Sistem Informasi',
      bidang: 'Data Analyst',
      status: 'Aktif',
      tanggalMulai: '2024-03-10',
      tanggalSelesai: '2024-06-10',
      pembimbing: 'Nina Mulyani, M.Kom.',
      progress: 50,
    },
    {
      id: 17,
      nama: 'Bayu Saputra',
      email: 'bayu.saputra@email.com',
      phone: '081234567806',
      universitas: 'Universitas Negeri Semarang',
      jurusan: 'Statistika',
      bidang: 'Data Science',
      status: 'Pending',
      tanggalMulai: '2024-05-20',
      tanggalSelesai: '2024-08-20',
      pembimbing: 'Dr. Suryadi, M.Sc.',
      progress: 0,
    },
    {
      id: 18,
      nama: 'Clarissa Aulia',
      email: 'clarissa.aulia@email.com',
      phone: '081234567807',
      universitas: 'Universitas Kristen Petra',
      jurusan: 'Informatika',
      bidang: 'Mobile Development',
      status: 'Aktif',
      tanggalMulai: '2024-04-01',
      tanggalSelesai: '2024-07-01',
      pembimbing: 'Maria Natalia, M.T.',
      progress: 25,
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
      {/* Filters */}
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

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#006DA6] text-white">
            <tr>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Universitas</th>
              <th className="px-4 py-3">Bidang</th>
              <th className="px-4 py-3">Pembimbing</th>
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
                <td className="px-4 py-3">{peserta.pembimbing}</td>
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
                  <button className="text-[#006DA6] hover:underline flex items-center text-sm">
                    <Eye size={16} className="mr-1" />
                  </button>
                  <button className="text-yellow-600 hover:underline flex items-center text-sm">
                    <Edit size={16} className="mr-1" />
                  </button>
                </td>
              </tr>
            ))}
            {paginatedPeserta.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  Tidak ada data peserta ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
            className="px-3 py-1 border rounded hover:bg-gray-100 text-sm"
            disabled={currentPage === 1}
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
            className="px-3 py-1 border rounded hover:bg-gray-100 text-sm"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
