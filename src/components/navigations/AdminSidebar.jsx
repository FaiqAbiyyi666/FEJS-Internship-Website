import React from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  UserRoundCheck,
  FileText,
  Briefcase,
  User,
  UserCog2,
  Files,
  FileCheck,
  Mail,
  ThumbsUp,
  FileSignature,
  TicketCheck,
  Database,
} from 'lucide-react';

// Kita tidak butuh setActiveMenu lagi karena state diatur oleh URL
const AdminSidebar = ({ activeMenu }) => {
  // Pastikan ID di sini cocok dengan URL slug yang kita buat di Route.jsx
  // path: alamat tujuan saat diklik
  const menuItems = [
    {
      id: 'dashboard',
      path: '/dashboard-admin',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'verifikasi',
      path: '/dashboard-admin/verifikasi',
      label: 'Verifikasi Akun',
      icon: UserRoundCheck,
    },
    {
      id: 'subkoorbid',
      path: '/dashboard-admin/subkoorbid',
      label: 'Sub Koor Bidang',
      icon: UserCog2,
    },
    {
      id: 'laporan',
      path: '/dashboard-admin/laporan',
      label: 'Laporan Harian',
      icon: FileText,
    },
    {
      id: 'laporan-akhir', // ID disesuaikan dengan URL (kebab-case)
      path: '/dashboard-admin/laporan-akhir',
      label: 'Laporan Akhir',
      icon: FileCheck,
    },
    {
      id: 'ajuan',
      path: '/dashboard-admin/ajuan',
      label: 'Ajuan Magang',
      icon: Files,
    },
    {
      id: 'bidang',
      path: '/dashboard-admin/bidang',
      label: 'Bidang Magang',
      icon: Briefcase,
    },
    {
      id: 'data-magang', // ID disesuaikan dengan URL (kebab-case)
      path: '/dashboard-admin/data-magang',
      label: 'Data Magang',
      icon: Database,
    },
    {
      id: 'sertifikat',
      path: '/dashboard-admin/sertifikat',
      label: 'Sertifikat',
      icon: TicketCheck,
    },
    {
      id: 'surat-magang', // ID disesuaikan dengan URL (kebab-case)
      path: '/dashboard-admin/surat-magang',
      label: 'Surat Magang',
      icon: FileSignature,
    },
    {
      id: 'kritik',
      path: '/dashboard-admin/kritik',
      label: 'Kritik & Saran',
      icon: Mail,
    },
    {
      id: 'ulasan',
      path: '/dashboard-admin/ulasan',
      label: 'Ulasan Magang',
      icon: ThumbsUp,
    },
    {
      id: 'profile',
      path: '/dashboard-admin/profile',
      label: 'Profile',
      icon: User,
    },
  ];

  return (
    <div className="h-screen bg-white shadow-lg flex flex-col w-64">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#006DA6] to-[#002942] rounded-lg flex items-center justify-center">
            <img
              src="/Simagang-icon.svg"
              alt="Simagang Icon"
              className="w-6 h-6 object-contain"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#002942]">SiMagang</h1>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-6 overflow-y-auto">
        <div className="px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            // Logika Active: Membandingkan prop activeMenu dengan item.id
            // (activeMenu dikirim dari AdminDashboard berdasarkan URL)
            const isActive = activeMenu === item.id;

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
                  isActive
                    ? 'bg-[#BFDCFA] text-[#002942] shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-[#006DA6]'
                }`}
              >
                <Icon size={20} className="mr-3" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;
