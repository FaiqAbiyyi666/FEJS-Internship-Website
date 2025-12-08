// AdminDashboard.jsx
import React from 'react'; // Hapus useState karena tidak dipakai lagi untuk navigasi
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../../../components/navigations/AdminSidebar';
import AdminHeader from '../../../components/navigations/AdminHeader';

// TIDAK PERLU IMPORT Component Halaman (ManagementVerifikasi, dll) disini lagi.
// Karena sudah di-handle oleh Route.jsx

const AdminDashboard = () => {
  const location = useLocation();

  // Fungsi untuk mendapatkan menu aktif berdasarkan URL
  // Contoh: URL "/dashboard-admin/verifikasi" -> activeMenu = "verifikasi"
  const getActiveMenu = () => {
    const path = location.pathname;
    const parts = path.split('/');
    // parts[0] = "", parts[1] = "dashboard-admin", parts[2] = "verifikasi"
    return parts[2] || 'dashboard';
  };

  const activeMenu = getActiveMenu();

  // Fungsi Judul tetap digunakan, tapi logic-nya menyesuaikan activeMenu dari URL
  const getPageTitle = (menu) => {
    switch (menu) {
      case 'dashboard':
        return 'Dashboard';
      case 'verifikasi':
        return 'Verifikasi Akun Peserta Magang';
      case 'subkoorbid':
        return 'Sub Koordinator Bidang';
      case 'laporan':
        return 'Laporan Harian';
      case 'laporan-akhir':
        return 'Laporan Akhir'; // Sesuaikan dengan path di Route
      case 'ajuan':
        return 'Ajuan Magang';
      case 'bidang':
        return 'Bidang Magang';
      case 'data-magang':
        return 'Arsip Data Magang'; // Sesuaikan dengan path di Route
      case 'sertifikat':
        return 'Sertifikat';
      case 'surat-magang':
        return 'Surat Magang'; // Sesuaikan dengan path di Route
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
      {/* Pastikan AdminSidebar menerima prop activeMenu agar bisa highlight tombol.
         Kita tidak perlu setActiveMenu lagi, karena navigasi sekarang via URL (Link).
      */}
      <AdminSidebar activeMenu={activeMenu} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader title={getPageTitle(activeMenu)} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {/* Outlet adalah tempat komponen anak (child route) akan muncul */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
