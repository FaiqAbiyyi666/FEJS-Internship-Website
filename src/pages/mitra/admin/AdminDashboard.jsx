import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../../components/navigations/AdminSidebar';
import AdminHeader from '../../../components/navigations/AdminHeader';

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // State untuk menyimpan data user yang sedang login
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data User saat Dashboard dimuat
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login-admin');
        return;
      }

      try {
        // Pastikan endpoint ini mengembalikan data: { nama, email, role, bidang: { nama } }
        const response = await fetch(
          'http://localhost:3000/api/admin/profile',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          // Jika token expired atau error
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login-admin');
        }
      } catch (error) {
        console.error('Gagal mengambil profil:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // 2. Logic Menu Aktif (Highlight Sidebar)
  const getActiveMenu = () => {
    const path = location.pathname;
    const parts = path.split('/');
    return parts[2] || 'dashboard';
  };

  // 3. Logic Judul Halaman
  const getPageTitle = (menu) => {
    switch (menu) {
      case 'dashboard':
        return 'Dashboard';
      case 'verifikasi':
        return 'Verifikasi Akun Peserta';
      case 'subkoorbid':
        return 'Kelola Sub Koordinator';
      case 'laporan':
        return 'Laporan Harian';
      case 'laporan-akhir':
        return 'Laporan Akhir';
      case 'ajuan':
        return 'Ajuan Magang';
      case 'bidang':
        return 'Bidang Magang';
      case 'data-magang':
        return 'Arsip Data Magang';
      case 'sertifikat':
        return 'Sertifikat';
      case 'surat-magang':
        return 'Surat Magang';
      case 'kritik':
        return 'Kritik & Saran';
      case 'ulasan':
        return 'Ulasan Magang';
      case 'profile':
        return 'Profile Saya';
      default:
        return 'Dashboard';
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-[#002942] font-semibold animate-pulse">
          Memuat Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Kirim Role yang didapat dari API ke Sidebar untuk filtering menu */}
      <AdminSidebar activeMenu={getActiveMenu()} userRole={user?.role} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Kirim object User lengkap ke Header untuk menampilkan Nama & Bidang */}
        <AdminHeader title={getPageTitle(getActiveMenu())} user={user} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {/* Outlet menerima context user jika halaman anak membutuhkannya */}
          <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
