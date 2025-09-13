import React from 'react';
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

const AdminSidebar = ({ activeMenu, setActiveMenu }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'verifikasi', label: 'Verifikasi Akun', icon: UserRoundCheck },
    { id: 'subkoorbid', label: 'Sub Koor Bidang', icon: UserCog2 },
    { id: 'laporan', label: 'Laporan Harian', icon: FileText },
    { id: 'laporanAkhir', label: 'Laporan Akhir', icon: FileCheck },
    { id: 'ajuan', label: 'Ajuan Magang', icon: Files },
    { id: 'bidang', label: 'Bidang Magang', icon: Briefcase },
    { id: 'dataMagang', label: 'Data Magang', icon: Database },
    { id: 'sertifikat', label: 'Sertifikat', icon: TicketCheck },
    { id: 'suratMagang', label: 'Surat Magang', icon: FileSignature },
    { id: 'kritik', label: 'Kritik & Saran', icon: Mail },
    { id: 'ulasan', label: 'Ulasan Magang', icon: ThumbsUp },
    { id: 'profile', label: 'Profile', icon: User },
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
            const isActive = activeMenu === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
                  isActive
                    ? 'bg-[#BFDCFA] text-[#002942] shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-[#006DA6]'
                }`}
              >
                <Icon size={20} className="mr-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* User Info */}
      {/* <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#20A0E6] rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Admin</p>
            <p className="text-xs text-gray-500 truncate">admin@simagang.com</p>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default AdminSidebar;
