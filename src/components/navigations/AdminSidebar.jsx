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

const AdminSidebar = ({ activeMenu, userRole }) => {
  // Fallback jika role belum terload
  const role = userRole || '';

  // Definisi Menu
  const menuItems = [
    {
      id: 'dashboard',
      path: '/dashboard-admin',
      label: 'Dashboard',
      icon: LayoutDashboard,
      allowedRoles: ['admin', 'sub_koordinator_bidang'],
    },
    {
      id: 'verifikasi',
      path: '/dashboard-admin/verifikasi',
      label: 'Verifikasi Akun',
      icon: UserRoundCheck,
      // HANYA ADMIN
      allowedRoles: ['admin'],
    },
    {
      id: 'subkoorbid',
      path: '/dashboard-admin/subkoorbid',
      label: 'Sub Koor Bidang',
      icon: UserCog2,
      // HANYA ADMIN
      allowedRoles: ['admin'],
    },
    {
      id: 'laporan',
      path: '/dashboard-admin/laporan',
      label: 'Laporan Harian',
      icon: FileText,
      allowedRoles: ['admin', 'sub_koordinator_bidang'],
    },
    {
      id: 'laporan-akhir',
      path: '/dashboard-admin/laporan-akhir',
      label: 'Laporan Akhir',
      icon: FileCheck,
      allowedRoles: ['admin', 'sub_koordinator_bidang'],
    },
    {
      id: 'ajuan',
      path: '/dashboard-admin/ajuan',
      label: 'Ajuan Magang',
      icon: Files,
      allowedRoles: ['admin', 'sub_koordinator_bidang'],
    },
    {
      id: 'bidang',
      path: '/dashboard-admin/bidang',
      label: 'Bidang Magang',
      icon: Briefcase,
      // HANYA ADMIN (Karena Sub Koor terikat 1 bidang, dia tidak manage bidang lain)
      allowedRoles: ['admin'],
    },
    {
      id: 'data-magang',
      path: '/dashboard-admin/data-magang',
      label: 'Data Magang',
      icon: Database,
      allowedRoles: ['admin', 'sub_koordinator_bidang'],
    },
    {
      id: 'sertifikat',
      path: '/dashboard-admin/sertifikat',
      label: 'Sertifikat',
      icon: TicketCheck,
      allowedRoles: ['admin', 'sub_koordinator_bidang'],
    },
    {
      id: 'surat-magang',
      path: '/dashboard-admin/surat-magang',
      label: 'Surat Magang',
      icon: FileSignature,
      allowedRoles: ['admin', 'sub_koordinator_bidang'],
    },
    {
      id: 'kritik',
      path: '/dashboard-admin/kritik',
      label: 'Kritik & Saran',
      icon: Mail,
      allowedRoles: ['admin', 'sub_koordinator_bidang'],
    },
    {
      id: 'ulasan',
      path: '/dashboard-admin/ulasan',
      label: 'Ulasan Magang',
      icon: ThumbsUp,
      allowedRoles: ['admin', 'sub_koordinator_bidang'],
    },
    {
      id: 'profile',
      path: '/dashboard-admin/profile',
      label: 'Profile',
      icon: User,
      allowedRoles: ['admin', 'sub_koordinator_bidang'],
    },
  ];

  // LOGIC FILTERING
  const filteredMenu = menuItems.filter((item) =>
    item.allowedRoles.includes(role)
  );

  return (
    <div className="h-screen bg-white shadow-lg flex flex-col w-64">
      {/* Brand */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#006DA6] to-[#002942] rounded-lg flex items-center justify-center">
            <img
              src="/Simagang-icon.svg"
              alt="Icon"
              className="w-6 h-6 object-contain"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#002942]">SiMagang</h1>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              DISKOMINFO SIDOARJO
            </p>
          </div>
        </div>
      </div>

      {/* Menu List */}
      <nav className="flex-1 py-6 overflow-y-auto">
        <div className="px-3 space-y-1">
          {filteredMenu.map((item) => {
            const Icon = item.icon;
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
