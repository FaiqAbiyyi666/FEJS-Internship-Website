import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/pesertaMagang/auth/Login';
import LoginMitra from './pages/mitra/LoginMitra';
import Register from './pages/pesertaMagang/auth/Register';
import LupaPasswordPage from './pages/pesertaMagang/auth/LupaPassword';
import ResetPasswordPage from './pages/pesertaMagang/auth/ResetPassword';

import Lowongan from './components/KuotaMagang';
import Profile from './pages/pesertaMagang/Profile';

import DashboardHome from './pages/pesertaMagang/dashboard/DashboradHome';
import DashboardLayout from './pages/pesertaMagang/dashboard/DashboardLayout';
import LaporanPage from './pages/pesertaMagang/dashboard/LaporanPage';
import LaporanAkhir from './pages/pesertaMagang/dashboard/UnggahLaporan';
import LaporanHarian from './pages/pesertaMagang/dashboard/LaporanHarianForm';
import SertifikatPage from './pages/pesertaMagang/dashboard/SertifikatPage';
import UlasanMagangPage from './pages/pesertaMagang/dashboard/UlasanMagangPage';
import FormUlasanWrapper from './pages/pesertaMagang/dashboard/FormUlasanWrapper';

import UsulanMagang from './pages/pesertaMagang/usulan/UsulanMagangPage';
import DetailUsulanMagang from './pages/pesertaMagang/usulan/DetailUsulanMagang';
import PengajuanMagang from './pages/pesertaMagang/usulan/PengajuanMagangPage';
import FormulirPendaftaran from './pages/pesertaMagang/usulan/FormulirPendaftaran';
import UnggahBerkas from './pages/pesertaMagang/usulan/UnggahBerkas';
import PilihBidang from './pages/pesertaMagang/usulan/PilihBidang';
import KonfirmasiSimpan from './pages/pesertaMagang/usulan/KonfirmasiSimpan';

import AllTestimoniPage from './components/AllTestimoniPage';

import AdminDashboard from './pages/mitra/admin/AdminDashboard';
import DashboardHomeAdmin from './pages/mitra/admin/AdminDashboardHome'; // Pastikan path benar
import ManageVerifikasiAkun from './pages/mitra/admin/ManageVerifAkun';
import ManageSubKoorbid from './pages/mitra/admin/ManageSubKoorbid';
import ManageLaporan from './pages/mitra/admin/ManageLaporan';
import ManageLaporanAkhir from './pages/mitra/admin/ManageLaporanAkhir';
import ManageBidang from './pages/mitra/admin/ManageBidang';
import ManageDataMagang from './pages/mitra/admin/ManageDataMagang';
import ManageSertifikat from './pages/mitra/admin/ManageSertifikat';
import ManageSuratMagang from './pages/mitra/admin/ManageSuratMagang';
import ManageKritikSaran from './pages/mitra/admin/ManageKritikSaran';
import ManageUlasanMagang from './pages/mitra/admin/ManageUlasanMagang';
import AdminProfile from './pages/mitra/admin/AdminProfile';
import ManageAjuanMagang from './pages/mitra/admin/ManageAjuanMagang';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login-peserta" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login-admin" element={<LoginMitra />} />
        <Route path="/forgot-password" element={<LupaPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="/informasi-lowongan" element={<Lowongan />} />
        <Route path="/profile" element={<Profile />} />

        {/* Dashboard Peserta Route */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="laporan" element={<LaporanPage />} />
          <Route
            path="laporan-harian-form/:minggu/:hari"
            element={<LaporanHarian />}
          />
          <Route path="unggah-laporan-akhir" element={<LaporanAkhir />} />
          <Route path="sertifikat" element={<SertifikatPage />} />
          <Route path="ulasan-magang" element={<FormUlasanWrapper />} />
        </Route>

        {/* Pengajuan Magang Route */}
        <Route path="/usulan" element={<UsulanMagang />} />
        <Route path="/pengajuan-magang" element={<PengajuanMagang />}>
          <Route index element={<Navigate to="formulir" replace />} />

          <Route path="formulir" element={<FormulirPendaftaran />} />
          <Route path="berkas" element={<UnggahBerkas />} />
          <Route path="bidang" element={<PilihBidang />} />
          <Route path="konfirmasi" element={<KonfirmasiSimpan />} />
        </Route>
        <Route path="/usulan/detail/:id" element={<DetailUsulanMagang />} />

        <Route path="/testimoni" element={<AllTestimoniPage />} />

        <Route path="/dashboard-admin" element={<AdminDashboard />}>
          {/* Index akan dimuat saat url tepat /dashboard-admin */}
          <Route index element={<DashboardHomeAdmin />} />

          {/* Sub-routes: URL akan menjadi /dashboard-admin/verifikasi, dll */}
          <Route path="verifikasi" element={<ManageVerifikasiAkun />} />
          <Route path="subkoorbid" element={<ManageSubKoorbid />} />
          <Route path="laporan" element={<ManageLaporan />} />
          <Route path="laporan-akhir" element={<ManageLaporanAkhir />} />
          <Route path="ajuan" element={<ManageAjuanMagang />} />
          <Route path="bidang" element={<ManageBidang />} />
          <Route path="data-magang" element={<ManageDataMagang />} />
          <Route path="sertifikat" element={<ManageSertifikat />} />
          <Route path="surat-magang" element={<ManageSuratMagang />} />
          <Route path="kritik" element={<ManageKritikSaran />} />
          <Route path="ulasan" element={<ManageUlasanMagang />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}
