import React, { useState } from 'react';
import AdminSidebar from '../../../components/navigations/AdminSidebar';
import AdminHeader from '../../../components/navigations/AdminHeader';
import DashboardHome from './AdminDashboardHome';
import ManagementPeserta from './ManagePesertaMagang';
import ManagementSubKoorbid from './ManageSubKoorbid';
import ManagementLaporan from './ManageLaporan';
import ManagementMitra from './ManageMitra';
import ManagementBidang from './ManageBidang';
import AdminProfile from './AdminProfile';
import AdminSettings from './AdminSetting';

const AdminDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <DashboardHome />;
      case 'peserta':
        return <ManagementPeserta />;
      case 'subkoorbid':
        return <ManagementSubKoorbid />;
      case 'laporan':
        return <ManagementLaporan />;
      case 'mitra':
        return <ManagementMitra />;
      case 'bidang':
        return <ManagementBidang />;
      case 'profile':
        return <AdminProfile />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <DashboardHome />;
    }
  };

  const getPageTitle = () => {
    switch (activeMenu) {
      case 'dashboard':
        return 'Dashboard';
      case 'peserta':
        return 'Manajemen Peserta';
      case 'peserta':
        return 'Manajemen Sub Koor Bidang';
      case 'laporan':
        return 'Laporan Harian';
      case 'mitra':
        return 'Manajemen Mitra';
      case 'bidang':
        return 'Bidang Magang';
      case 'profile':
        return 'Profile Admin';
      case 'settings':
        return 'Pengaturan';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader title={getPageTitle()} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
