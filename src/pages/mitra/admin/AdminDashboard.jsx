import React, { useState } from 'react';
import AdminSidebar from '../../../components/navigations/AdminSidebar';
import AdminHeader from '../../../components/navigations/AdminHeader';
import DashboardHome from './AdminDashboardHome';
import ManagementVerifikasiAkun from './ManageVerifAkun';
import ManagementSubKoorbid from './ManageSubKoorbid';
import ManagementLaporan from './ManageLaporan';
import ManagementLaporanAkhir from './ManageLaporanAkhir';
import ManagementBidang from './ManageBidang';
import ManagementKritikSaran from './ManageKritikSaran';
import ManagementUlasanMagang from './ManageUlasanMagang';
import AdminProfile from './AdminProfile';
import ManageAjuanMagang from './ManageAjuanMagang';
import ManageSertifikat from './ManageSertifikat';
import ManageSuratMagang from './ManageSuratMagang';
import ManageDataMagang from './ManageDataMagang';

const AdminDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <DashboardHome />;
      case 'verifikasi':
        return <ManagementVerifikasiAkun />;
      case 'subkoorbid':
        return <ManagementSubKoorbid />;
      case 'laporan':
        return <ManagementLaporan />;
      case 'laporanAkhir':
        return <ManagementLaporanAkhir />;
      case 'ajuan':
        return <ManageAjuanMagang />;
      case 'bidang':
        return <ManagementBidang />;
      case 'dataMagang':
        return <ManageDataMagang />;
      case 'sertifikat':
        return <ManageSertifikat />;
      case 'suratMagang':
        return <ManageSuratMagang />;
      case 'kritik':
        return <ManagementKritikSaran />;
      case 'ulasan':
        return <ManagementUlasanMagang />;
      case 'profile':
        return <AdminProfile />;
      default:
        return <DashboardHome />;
    }
  };

  const getPageTitle = () => {
    switch (activeMenu) {
      case 'dashboard':
        return 'Dashboard';
      case 'verifikasi':
        return 'Verifikasi Akun Peserta Magang';
      case 'subkoorbid':
        return 'Sub Koordinator Bidang';
      case 'laporan':
        return 'Laporan Harian';
      case 'laporanAkhir':
        return 'Laporan Akhir';
      case 'Ajuan':
        return 'Ajuan Magang';
      case 'bidang':
        return 'Bidang Magang';
      case 'sertifikat':
        return 'Sertifikat';
      case 'suratMagang':
        return 'Surat Magang';
      case 'kritik':
        return 'Kritik & Saran';
      case 'ulasan':
        return 'Ulasan Magang';
      case 'profile':
        return 'Profile Admin';
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
