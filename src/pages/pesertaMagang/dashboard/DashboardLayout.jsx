import { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardHome from './DashboradHome';
import LaporanPage from './LaporanPage';
import LaporanHarianForm from './LaporanHarianForm';
import SertifikatPage from './SertifikatPage';
import Navbar from '../../../components/navigations/Navbar';
import UnggahLaporanPage from './UnggahLaporan';
import UlasanMagangPage from './UlasanMagangPage';

export default function DashboardLayout() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  const handleOpenForm = (weekIndex, dayIndex) => {
    setSelectedWeek(weekIndex);
    setSelectedDay(dayIndex);
    setActiveMenu('form-laporan');
  };

  return (
    <>
      <Navbar />

      {/* Header Dashboard */}
      <div className="text-center pt-[130px] mb-3">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#002942] to-[#006DA6] bg-clip-text text-transparent inline-block">
          Dashboard
        </h1>
      </div>

      <div className="flex bg-[#F5F7FA] min-h-screen max-w-7xl mx-auto px-4">
        {/* Sidebar hanya ditampilkan jika bukan halaman form laporan dan unggah laporan */}
        {activeMenu !== 'form-laporan' && activeMenu !== 'unggah-laporan' && (
          <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        )}

        <main className="flex-1 p-6">
          {activeMenu === 'dashboard' && <DashboardHome />}

          {activeMenu === 'laporan' && (
            <LaporanPage
              onOpenForm={handleOpenForm}
              onNavigateToUpload={() => setActiveMenu('unggah-laporan')}
            />
          )}

          {activeMenu === 'form-laporan' &&
            selectedWeek !== null &&
            selectedDay !== null && (
              <LaporanHarianForm
                weekIndex={selectedWeek}
                dayIndex={selectedDay}
                onBack={() => setActiveMenu('laporan')}
              />
            )}

          {activeMenu === 'unggah-laporan' && (
            <UnggahLaporanPage onBack={() => setActiveMenu('laporan')} />
          )}

          {activeMenu === 'sertifikat' && <SertifikatPage />}

          {/* ✅ Tambahan untuk halaman Ulasan Magang */}
          {activeMenu === 'ulasan-magang' && <UlasanMagangPage />}
        </main>
      </div>
    </>
  );
}
